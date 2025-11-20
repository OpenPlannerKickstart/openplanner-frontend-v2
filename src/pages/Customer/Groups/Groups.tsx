import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import AddEditSyllabus from '../../../common/AddSyllabusEvents/AddEditSyllabus';
import AddEditGroup from '../../../common/Groups/AddEditGroup';
import { get, post, deleteAPI } from '../../../Utility/httpInterceptor';
import { ts, te } from '../../../Utility/Toaster';
import GroupListItem from '../../..//components/Groups/GroupListItem';
import { useNotifications } from '../../../context/SocketContext';
import { getDecodeIDToken } from '../../../Utility/Helper';
import { v4 as uuidv4 } from 'uuid';
import { ATTACH_ACCEPT_INPUT, ATTACH_MAX_PER_MESSAGE, ATTACH_MAX_MB, isMimeAllowed, isSizeAllowed } from '../../../Utility/attachments';
import { initiateUpload, uploadToS3, toAttachmentDescriptor, computeCrc32Base64 } from '../../../Utility/uploads';
import type { AttachmentDescriptor } from '../../../interfaces/groups';

// Simple responsive hook for mobile breakpoint detection (align with Bootstrap lg)
const useIsMobile = (maxWidthPx: number = 991.98) => {
  const [isMobile, setIsMobile] = useState<boolean>(
    typeof window !== 'undefined' ? window.matchMedia(`(max-width: ${maxWidthPx}px)`).matches : false
  );
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mql = window.matchMedia(`(max-width: ${maxWidthPx}px)`);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    // Older Safari uses addListener/removeListener
    if (mql.addEventListener) mql.addEventListener('change', handler);
    else if ((mql as any).addListener) (mql as any).addListener(handler);
    return () => {
      if (mql.removeEventListener) mql.removeEventListener('change', handler);
      else if ((mql as any).removeListener) (mql as any).removeListener(handler);
    };
  }, [maxWidthPx]);
  return isMobile;
};

const Groups: React.FC = () => {
  const navigate = useNavigate();
  const params = useParams();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [mobileView, setMobileView] = useState<'list' | 'chat'>('list');
  const [activeTab, setActiveTab] = useState<'chats' | 'groups'>('chats');
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Add/Edit Syllabus state
  const [showSyllabus, setShowSyllabus] = useState(false);
  const handleSyllabusShow = () => setShowSyllabus(true);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [myGroups, setMyGroups] = useState<any[]>([]);
  const [myGroupsCollapsed, setMyGroupsCollapsed] = useState<boolean>(false);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [showGroupInfo, setShowGroupInfo] = useState<boolean>(false);
  // Group info panel data and UI state
  const [groupDetail, setGroupDetail] = useState<any | null>(null);
  const [membersExpanded, setMembersExpanded] = useState<boolean>(false);
  const { subscribeToPath, unsubscribeFromPath, sendNotification } = useNotifications();
  // Invite modal state
  const [showInvite, setShowInvite] = useState<boolean>(false);
  const [inviteLoading, setInviteLoading] = useState<boolean>(false);
  const [inviteExpiresIn, setInviteExpiresIn] = useState<number>(7 * 24 * 3600); // 7 days default
  const [inviteSingleUse, setInviteSingleUse] = useState<boolean>(false);
  // Direct invite modal state
  const [inviteQuery, setInviteQuery] = useState<string>('');
  const [inviteResults, setInviteResults] = useState<Array<{ id: string; username: string; displayName: string; picture?: string | null }>>([]);
  const [inviteSelected, setInviteSelected] = useState<string[]>([]);
  const [inviteSearching, setInviteSearching] = useState<boolean>(false);
  const [inviteSending, setInviteSending] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  // Invites inbox
  const [invites, setInvites] = useState<Array<{ id: string; groupId: string; message?: string; fromUserId?: string; groupName?: string; fromName?: string }>>([]);
  const [isDragOverChat, setIsDragOverChat] = useState<boolean>(false);
  const chatDragCounter = useRef(0);

  // Suggestions (Find groups to join)
  const [suggestionsLoading, setSuggestionsLoading] = useState<boolean>(false);
  const [suggestions, setSuggestions] = useState<Array<{ id: string; name: string; course?: { code?: string; term?: string; year?: number }, memberPreviews?: Array<{ id: string; displayName?: string | null; picture?: string | null }> }>>([]);
  const fetchSuggestedGroups = async () => {
    try {
      setSuggestionsLoading(true);
      // Call BE suggestions without a specific syllabus; BE will infer from user courses or return empty
      const res: any = await post('groups/suggestions', { forUser: true, limit: 10 });
      const data = res?.data ?? res;
      const list = Array.isArray(data?.candidates) ? data.candidates : [];
      setSuggestions(list);
    } catch (e) {
      setSuggestions([]);
    } finally {
      setSuggestionsLoading(false);
    }
  };
  useEffect(() => { fetchSuggestedGroups(); }, []);

  useEffect(() => {
    chatDragCounter.current = 0;
    setIsDragOverChat(false);
  }, [selectedGroupId]);

  // Fetch group detail when the info panel opens
  useEffect(() => {
    if (!showGroupInfo || !selectedGroupId) return;
    setGroupDetail(null);
    setMembersExpanded(false);
    let isMounted = true;
    (async () => {
      try {
        const res: any = await get(`groups/${selectedGroupId}`);
        const data = res?.data ?? res;
        if (isMounted) setGroupDetail(data || null);
      } catch {
        if (isMounted) setGroupDetail(null);
      }
    })();
    return () => { isMounted = false; };
  }, [showGroupInfo, selectedGroupId]);

  // No random banner color; BE provides avatarColor for canonical groups

  // Upload queue + prepared descriptors for attachments
  const [uploading, setUploading] = useState<Array<{ id: string; file: File; fileId?: string; status: 'initiating' | 'uploading' | 'done' | 'error'; error?: string; progress?: number }>>([]);
  const [readyAttachments, setReadyAttachments] = useState<AttachmentDescriptor[]>([]);
  const [uploadRateLimitUntil, setUploadRateLimitUntil] = useState<number | null>(null);
  // Local object-URL previews for optimistic rendering (fileId -> blob URL)
  const [attachmentPreviews, setAttachmentPreviews] = useState<Record<string, string>>({});
  const [previewLightbox, setPreviewLightbox] = useState<{ open: boolean; url: string | null; name?: string | null }>({ open: false, url: null, name: null });
  const removeReadyAttachment = (fileId: string) => {
    try {
      const url = attachmentPreviews[fileId];
      if (url) URL.revokeObjectURL(url);
    } catch {}
    setAttachmentPreviews(prev => {
      const next = { ...prev };
      delete next[fileId];
      return next;
    });
    setReadyAttachments(prev => prev.filter(d => d.fileId !== fileId));
  };
  const renderAttachmentPreviews = () => {
    const inflight = uploading.filter(u => (u.status === 'initiating' || u.status === 'uploading') && u.fileId).map(u => ({
      fileId: u.fileId as string,
      fileName: u.file.name,
      mimeType: u.file.type,
      sizeBytes: u.file.size,
      progress: typeof u.progress === 'number' ? u.progress : 0
    }));
    if ((!readyAttachments || readyAttachments.length === 0) && inflight.length === 0) return null;
    const included = new Set<string>();
    const tiles: Array<any> = [];
    // Show in-flight first
    inflight.forEach(a => { if (!included.has(a.fileId)) { tiles.push(a); included.add(a.fileId); } });
    // Then ready (done)
    readyAttachments.forEach(a => { if (!included.has(a.fileId)) { tiles.push({ ...a, progress: 1 }); included.add(a.fileId); } });
    return (
      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', marginBottom: 8 }}>
        {tiles.map(att => {
          const isImage = (att?.mimeType || '').startsWith('image/');
          const url = attachmentPreviews[att.fileId];
          const progress: number | undefined = typeof att.progress === 'number' ? att.progress : undefined;
          return (
            <div
              key={att.fileId}
              title={att.fileName}
              style={{ position: 'relative', width: 64, height: 64, borderRadius: 10, border: '1px solid #E5E7EB', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flex: '0 0 auto', cursor: ((typeof progress !== 'number' || progress >= 1) && isImage && url) ? 'pointer' : 'default' }}
              onClick={() => { if ((typeof progress !== 'number' || progress >= 1) && isImage && url) setPreviewLightbox({ open: true, url, name: att.fileName }); }}
            >
              {typeof progress === 'number' && progress < 1 ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
                  <span className="op-uiverse-spinner" style={{ width: 22, height: 22 }}>
                    <svg viewBox="25 25 50 50">
                      <circle r="20" cy="50" cx="50"></circle>
                    </svg>
                  </span>
                </div>
              ) : (
                <>
                  {isImage && url ? (
                    <img src={url} alt={att.fileName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <span role="img" aria-label="document" style={{ fontSize: 28 }}>📄</span>
                  )}
                </>
              )}
              <button
                aria-label="Remove attachment"
                title="Remove"
                onClick={(e) => { e.stopPropagation(); removeReadyAttachment(att.fileId); }}
                style={{
                  position: 'absolute',
                  top: 4,
                  right: 4,
                  width: 20,
                  height: 20,
                  borderRadius: 6,
                  padding: 0,
                  lineHeight: '18px',
                  fontSize: 14,
                  background: '#FFFFFF',
                  border: '1px solid #E5E7EB',
                  color: '#6B7280',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                ×
              </button>
            </div>
          );
        })}
      </div>
    );
  };
  // Open attachment in a new tab, refreshing message URLs first if the signed URL is expired/near-expiry
  const parseAmzDate = (str: string) => {
    // format: YYYYMMDDThhmmssZ
    if (!str || str.length < 16) return 0;
    const y = Number(str.slice(0, 4));
    const m = Number(str.slice(4, 6)) - 1;
    const d = Number(str.slice(6, 8));
    const hh = Number(str.slice(9, 11));
    const mm = Number(str.slice(11, 13));
    const ss = Number(str.slice(13, 15));
    return Date.UTC(y, m, d, hh, mm, ss);
  };
  const isS3UrlExpiringSoon = (url: string, thresholdMs = 5000) => {
    try {
      const u = new URL(url);
      const amzDate = u.searchParams.get('X-Amz-Date');
      const amzExpires = Number(u.searchParams.get('X-Amz-Expires') || '0');
      if (!amzDate || !amzExpires) return false;
      const issued = parseAmzDate(amzDate);
      if (!issued) return false;
      const expiry = issued + amzExpires * 1000;
      return Date.now() >= (expiry - thresholdMs);
    } catch {
      return false;
    }
  };
  const handleAttachmentOpen = async (att: any, messageId?: string | null) => {
    try {
      let targetUrl = att?.url;
      if (!targetUrl) return;
      // If link is expired or near expiry, refresh messages to get a fresh URL
      if (isS3UrlExpiringSoon(targetUrl, 5000) && selectedGroupId) {
        try {
          await fetchMessages(selectedGroupId);
          // Try to find a fresher URL for this attachment
          const list = messages[selectedGroupId] ?? [];
          const msg = list.find((m: any) => (m?.id && m.id === messageId) || (m?.clientId && m.clientId === messageId));
          const updated = msg?.attachments?.find((a: any) => (a?.id && a.id === att.id) || (a?.fileId && a.fileId === att.id));
          if (updated?.url) targetUrl = updated.url;
        } catch {}
      }
      window.open(targetUrl, '_blank', 'noopener,noreferrer');
    } catch {}
  };
  const openAttachmentLightbox = async (att: any, messageId?: string | null) => {
    try {
      let targetUrl = att?.url;
      if (!targetUrl) return;
      if (isS3UrlExpiringSoon(targetUrl, 5000) && selectedGroupId) {
        try {
          await fetchMessages(selectedGroupId);
          const list = messages[selectedGroupId] ?? [];
          const msg = list.find((m: any) => (m?.id && m.id === messageId) || (m?.clientId && m.clientId === messageId));
          const updated = msg?.attachments?.find((a: any) => (a?.id && a.id === att.id) || (a?.fileId && a.fileId === att.id));
          if (updated?.url) targetUrl = updated.url;
        } catch {}
      }
      setPreviewLightbox({ open: true, url: targetUrl, name: att.fileName });
    } catch {}
  };

  // chat timeline state
  const [messages, setMessages] = useState<Record<string, any[]>>({}); // keyed by groupId
  const [nextCursorByGroup, setNextCursorByGroup] = useState<Record<string, string | null>>({});
  const [loadingMessages, setLoadingMessages] = useState<boolean>(false);
  const timelineRef = useRef<HTMLDivElement | null>(null);
  const currentUserSub = React.useMemo(() => {
    try { return getDecodeIDToken()?.sub || null; } catch { return null; }
  }, []);

  // Debounced user search for direct invites
  useEffect(() => {
    const t = setTimeout(async () => {
      const q = inviteQuery.trim();
      if (!q) { setInviteResults([]); return; }
      try {
        setInviteSearching(true);
        const res: any = await get(`users/search?q=${encodeURIComponent(q)}`);
        const list = res?.data ?? res ?? [];
        setInviteResults(Array.isArray(list) ? list.slice(0, 20) : []);
      } catch {
        setInviteResults([]);
      } finally { setInviteSearching(false); }
    }, 250);
    return () => clearTimeout(t);
  }, [inviteQuery]);

  const toggleInviteSelect = (id: string) => {
    setInviteSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };
  // Rate-limit state: timestamp (ms) until which sending is disabled
  const [rateLimitUntil, setRateLimitUntil] = useState<number | null>(null);
  // Tick to refresh countdown text while rate-limited
  const [rateTick, setRateTick] = useState<number>(0);
  useEffect(() => {
    if (!rateLimitUntil) return;
    const id = setInterval(() => setRateTick((x) => x + 1), 1000);
    return () => clearInterval(id);
  }, [rateLimitUntil]);
  // Track composer height so the timeline bottom offset always clears it
  const composerWrapRef = useRef<HTMLDivElement | null>(null);
  const [composerHeight, setComposerHeight] = useState<number>(72);
  const chatFrameRef = useRef<HTMLDivElement | null>(null);
  const [frameRect, setFrameRect] = useState<{ left: number; width: number; top: number }>({ left: 0, width: 0, top: 0 });
  useEffect(() => {
    if (!isMobile || mobileView !== 'chat') return;
    const el = composerWrapRef.current;
    if (!el) return;
    const update = () => {
      const h = el.getBoundingClientRect().height;
      if (h && Math.abs(h - composerHeight) > 1) setComposerHeight(Math.ceil(h));
    };
    update();
    const ro = new ResizeObserver(() => update());
    ro.observe(el);
    window.addEventListener('resize', update);
    return () => { ro.disconnect(); window.removeEventListener('resize', update); };
  }, [isMobile, mobileView, composerHeight]);

  // Track chat frame position so the composer can be truly viewport-fixed within the frame bounds
  useEffect(() => {
    if (!isMobile || mobileView !== 'chat') return;
    const fr = chatFrameRef.current;
    if (!fr) return;
    const update = () => {
      const r = fr.getBoundingClientRect();
      if (r) setFrameRect({ left: Math.round(r.left), width: Math.round(r.width), top: Math.round(r.top) });
    };
    update();
    const ro = new ResizeObserver(() => update());
    ro.observe(document.body);
    window.addEventListener('resize', update);
    return () => { ro.disconnect(); window.removeEventListener('resize', update); };
  }, [isMobile, mobileView]);

  // Lock background scroll on mobile when Group Info is open
  const bodyOverflowRef = useRef<string | null>(null);
  useEffect(() => {
    if (!isMobile) return;
    if (showGroupInfo) {
      if (bodyOverflowRef.current === null) bodyOverflowRef.current = document.body.style.overflow || '';
      document.body.style.overflow = 'hidden';
    } else {
      if (bodyOverflowRef.current !== null) {
        document.body.style.overflow = bodyOverflowRef.current;
        bodyOverflowRef.current = null;
      }
    }
    return () => {
      if (bodyOverflowRef.current !== null) {
        document.body.style.overflow = bodyOverflowRef.current;
        bodyOverflowRef.current = null;
      }
    };
  }, [isMobile, showGroupInfo]);

  // Keep timeline scrolled to bottom when entering chat and when new messages append
  useEffect(() => {
    if (!isMobile || mobileView !== 'chat') return;
    const el = timelineRef.current;
    if (!el) return;
    // slight delay to allow layout to apply new heights
    requestAnimationFrame(() => { el.scrollTop = el.scrollHeight; });
  }, [isMobile, mobileView, selectedGroupId, messages[selectedGroupId || '']?.length, composerHeight]);

  // Desktop: keep timeline scrolled to bottom on select and when new messages arrive
  useEffect(() => {
    if (isMobile) return;
    const el = timelineRef.current;
    if (!el) return;
    requestAnimationFrame(() => { el.scrollTop = el.scrollHeight; });
  }, [isMobile, selectedGroupId, messages[selectedGroupId || '']?.length]);

  const fetchMyGroups = async () => {
    try {
      const res: any = await get('groups/mine');
      if (res?.data) {
        setMyGroups(res.data);
      }
    } catch (err: any) {
      te('Failed to load your groups');
    }
  };
  React.useEffect(() => {
    fetchMyGroups();
  }, []);

  // Load inbox invites
  const fetchInvites = async () => {
    try {
      const res: any = await get('invites');
      const data = res?.data ?? res;
      const list: any[] = data?.invites ?? [];
      setInvites(list);
      // optional: enrich group names lazily
      list.forEach(async (inv) => {
        if (!inv?.groupId) return;
        try {
          const gres: any = await get(`groups/${inv.groupId}`);
          const g = gres?.data ?? gres;
          if (g?.name) setInvites(prev => prev.map(x => x.id === inv.id ? { ...x, groupName: g.name } : x));
        } catch {}
      });
    } catch {}
  };
  useEffect(() => { fetchInvites(); }, []);

  // Sync selection with URL param and localStorage
  useEffect(() => {
    const gid = (params as any)?.groupId as string | undefined;
    if (gid) {
      // If URL has a groupId, prefer it
      if (selectedGroupId !== gid) setSelectedGroupId(gid);
      try { localStorage.setItem('groups.selected', gid); } catch {}
      if (isMobile) setMobileView('chat');
    } else {
      // No group in URL → fallback to last selection from storage (one-time)
      if (!selectedGroupId) {
        try {
          const saved = localStorage.getItem('groups.selected');
          if (saved) {
            setSelectedGroupId(saved);
            const params = new URLSearchParams(location.search);
            if (!params.get('tab')) {
              const savedTab = (localStorage.getItem('groups.tab') as any) as ('chats'|'groups') | null;
              if (savedTab === 'chats' || savedTab === 'groups') params.set('tab', savedTab);
            }
            const search = params.toString() ? `?${params.toString()}` : '';
            if (!location.pathname.endsWith(`/groups/${saved}`) || location.search !== search) {
              navigate({ pathname: `/groups/${saved}`, search }, { replace: true });
            }
          }
        } catch {}
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.groupId]);

  // If the selected group no longer exists (left/deleted), clear selection and URL
  useEffect(() => {
    if (!selectedGroupId) return;
    if (myGroups && myGroups.length > 0 && !myGroups.some(g => g.id === selectedGroupId)) {
      try { localStorage.removeItem('groups.selected'); } catch {}
      if (location.pathname.startsWith('/groups/')) navigate('/groups', { replace: true });
      setSelectedGroupId(null);
    }
  }, [myGroups, selectedGroupId, location.pathname, navigate]);

  const applySelection = (id: string) => {
    setSelectedGroupId(id);
    try { localStorage.setItem('groups.selected', id); } catch {}
    if (isMobile) setMobileView('chat');
    const sp = new URLSearchParams(location.search);
    sp.set('tab', activeTab);
    const search = sp.toString() ? `?${sp.toString()}` : '';
    if (!location.pathname.endsWith(`/groups/${id}`) || location.search !== search) {
      navigate({ pathname: `/groups/${id}`, search });
    }
  };

  const clearSelection = () => {
    setSelectedGroupId(null);
    try { localStorage.removeItem('groups.selected'); } catch {}
    const sp = new URLSearchParams(location.search);
    sp.set('tab', activeTab);
    const search = sp.toString() ? `?${sp.toString()}` : '';
    if (location.pathname.startsWith('/groups/')) navigate({ pathname: '/groups', search }, { replace: true });
  };

  // Ensure activeTab reflects the URL (with localStorage fallback) and normalize URL when missing
  useEffect(() => {
    const sp = new URLSearchParams(location.search);
    let tab = sp.get('tab');
    let nextTab: 'chats' | 'groups' = (tab === 'groups' || tab === 'chats') ? (tab as any) : null as any;
    if (!nextTab) {
      const saved = (localStorage.getItem('groups.tab') as any) as ('chats'|'groups') | null;
      nextTab = (saved === 'groups' || saved === 'chats') ? saved : 'chats';
      sp.set('tab', nextTab);
      const search = sp.toString() ? `?${sp.toString()}` : '';
      if (location.search !== search) navigate({ pathname: location.pathname, search }, { replace: true });
    }
    if (nextTab && activeTab !== nextTab) setActiveTab(nextTab);
    try { if (nextTab) localStorage.setItem('groups.tab', nextTab); } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  // Accept invite via URL param or path: ?invite=TOKEN or /invite/TOKEN
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('invite');
    let pathToken: string | null = null;
    const path = window.location.pathname || '';
    const match = path.match(/\/invite\/([^/?#]+)/);
    if (match && match[1]) pathToken = decodeURIComponent(match[1]);
    const finalToken = token || pathToken;
    if (!finalToken) return;
    (async () => {
      try {
        const res: any = await post('invites/accept', { token: finalToken });
        const data = res?.data ?? res;
        if (data?.groupId) {
          ts('Joined group');
          await fetchMyGroups();
          setSelectedGroupId(data.groupId);
          if (isMobile) setMobileView('chat');
        }
      } catch (e: any) {
        te('Failed to accept invite');
      } finally {
        // Remove invite token from URL without reload
        const url = new URL(window.location.href);
        url.searchParams.delete('invite');
        if (url.pathname.startsWith('/invite/')) url.pathname = '/';
        window.history.replaceState({}, '', url.toString());
      }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectedGroup = selectedGroupId ? myGroups.find(g => g.id === selectedGroupId) : null;

  // fetch messages helper
  const fetchMessages = async (groupId: string, before?: string) => {
    try {
      setLoadingMessages(true);
      const qs = new URLSearchParams();
      qs.set('limit', '50');
      if (before) qs.set('before', before);
      const res: any = await get(`groups/${groupId}/messages?${qs.toString()}`);
      const payload = res?.data ?? res;
      const list: any[] = payload?.messages ?? [];
      const next: string | null = payload?.nextCursor ?? null;
      setMessages(prev => ({
        ...prev,
        [groupId]: before ? [...list, ...(prev[groupId] ?? [])] : list,
      }));
      setNextCursorByGroup(prev => ({ ...prev, [groupId]: next }));
    } catch (e) {
      te('Failed to load messages');
    } finally {
      setLoadingMessages(false);
    }
  };

  // when a group is selected, fetch its messages and subscribe to socket room
  useEffect(() => {
    if (!selectedGroupId) return;

    // initial load if not present
    if (!messages[selectedGroupId]) {
      fetchMessages(selectedGroupId);
    }

    const eventName = `group:${selectedGroupId}:message`;
    const eventDeletedName = `group:${selectedGroupId}:message:deleted`;
    const onMessage = (msg: any) => {
      setMessages(prev => {
        const current = prev[selectedGroupId] ?? [];
        // dedupe by id or clientId
        if (msg?.clientId && current.some(m => m && m.clientId && m.clientId === msg.clientId)) {
          // replace optimistic item
          const replaced = current.map(m => (m && m.clientId === msg.clientId ? msg : m));
          return { ...prev, [selectedGroupId]: replaced };
        }
        if (msg?.id && current.some(m => m && m.id === msg.id)) return prev;
        return { ...prev, [selectedGroupId]: [...current, msg] };
      });
      // keep timeline scrolled to bottom on new message if user is near bottom
      const el = timelineRef.current;
      if (el) {
        const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 120;
        if (nearBottom) {
          requestAnimationFrame(() => { el.scrollTop = el.scrollHeight; });
        }
      }
    };

    // attempt to join server room (no-op if backend ignores)
    try { sendNotification?.('group:join', { room: `group:${selectedGroupId}` }); } catch {}
    const onDeleted = (payload: any) => {
      if (!payload || !payload.id) return;
      setMessages(prev => {
        const current = prev[selectedGroupId] ?? [];
        const updated = current.map(m => (m && (m.id === payload.id || m.clientId === payload.id)
          ? { ...m, deleted: true, deletedAt: payload.deletedAt, deletedBy: payload.deletedBy, content: null }
          : m));
        return { ...prev, [selectedGroupId]: updated };
      });
    };
    subscribeToPath(eventName, onMessage);
    subscribeToPath(eventDeletedName, onDeleted);
    return () => {
      unsubscribeFromPath(eventName, onMessage);
      unsubscribeFromPath(eventDeletedName, onDeleted);
      try { sendNotification?.('group:leave', { room: `group:${selectedGroupId}` }); } catch {}
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedGroupId]);

  // Subscribe to direct invite notifications for current user
  useEffect(() => {
    if (!currentUserSub) return;
    const eventName = `user:${currentUserSub}:invite`;
    const onInvite = (payload: any) => {
      if (!payload || !payload.id) return;
      setInvites(prev => [{
        id: payload.id,
        groupId: payload.groupId,
        message: payload.message,
        fromUserId: payload.from?.id,
        groupName: payload.groupName,
        fromName: payload.from?.displayName
      }, ...prev]);
    };
    subscribeToPath(eventName, onInvite);
    return () => { unsubscribeFromPath(eventName, onInvite); };
  }, [currentUserSub, subscribeToPath, unsubscribeFromPath]);

  const filterValidFiles = (incoming: File[]): File[] => {
    const accepted: File[] = [];
    let typeWarned = false;
    let sizeWarned = false;
    incoming.forEach((file) => {
      if (!isMimeAllowed(file.type)) {
        if (!typeWarned) {
          te('Unsupported file type');
          typeWarned = true;
        }
        return;
      }
      if (!isSizeAllowed(file.size)) {
        if (!sizeWarned) {
          te(`File too large (max ${ATTACH_MAX_MB} MB)`);
          sizeWarned = true;
        }
        return;
      }
      accepted.push(file);
    });
    return accepted;
  };

  // Helper: add files to queue and perform initiate + S3 PUT
  const addFiles = async (files: File[]) => {
    const validFiles = filterValidFiles(files);
    if (validFiles.length === 0) return;
    const spaceRemaining = Math.max(0, ATTACH_MAX_PER_MESSAGE - (readyAttachments.length + uploading.filter(u => u.status === 'initiating' || u.status === 'uploading').length));
    if (spaceRemaining <= 0) {
      te(`You can attach up to ${ATTACH_MAX_PER_MESSAGE} files`);
      return;
    }
    const toProcess = validFiles.slice(0, spaceRemaining);
    if (validFiles.length > spaceRemaining) {
      te(`You can attach up to ${ATTACH_MAX_PER_MESSAGE} files`);
    }
    const items = toProcess.map((file) => ({ id: uuidv4(), file, status: 'initiating' as const, progress: 0 }));
    setUploading(prev => [...prev, ...items]);

    const revokePreview = (fileId?: string) => {
      if (!fileId) return;
      setAttachmentPreviews(prev => {
        if (!prev[fileId]) return prev;
        try { URL.revokeObjectURL(prev[fileId]); } catch {}
        const next = { ...prev };
        delete next[fileId];
        return next;
      });
    };

    const processUpload = async (item: typeof items[number]) => {
      let assignedFileId: string | undefined;
      try {
        // Respect active rate limit
        if (uploadRateLimitUntil && Date.now() < uploadRateLimitUntil) {
          const remaining = Math.max(1, Math.ceil((uploadRateLimitUntil - Date.now()) / 1000));
          te(`Too many uploads, try again in ${remaining}s`);
          setUploading(prev => prev.map(u => u.id === item.id ? ({ ...u, status: 'error', error: 'rate_limited' }) : u));
          return;
        }
        // 1) Compute checksum (base64 CRC32) and initiate
        const checksum = await computeCrc32Base64(item.file);
        const init = await initiateUpload(item.file, selectedGroupId || undefined, checksum);
        let signedHeadersStr: string | null = null;
        if (init?.signedHeaders) {
          // Log the exact signed headers for quick verification with BE
          // Expect: includes x-amz-checksum-crc32 (order may vary)
          // eslint-disable-next-line no-console
          console.info('[uploads] X-Amz-SignedHeaders:', init.signedHeaders);
          signedHeadersStr = init.signedHeaders;
        } else {
          // Fallback: parse from URL for debugging
          try {
            const u = new URL(init.putUrl);
            const sh = u.searchParams.get('X-Amz-SignedHeaders');
            // eslint-disable-next-line no-console
            console.info('[uploads] X-Amz-SignedHeaders (parsed):', sh);
            signedHeadersStr = sh;
          } catch {}
        }
        assignedFileId = init.fileId;
        setUploading(prev => prev.map(u => u.id === item.id ? ({ ...u, status: 'uploading', fileId: init.fileId, progress: 0 }) : u));
        try {
          const blobUrl = URL.createObjectURL(item.file);
          setAttachmentPreviews(prev => ({ ...prev, [init.fileId]: blobUrl }));
        } catch {}
        // 2) PUT to S3
        const hdrs: Record<string, string> = { ...(init.headers || {}) };
        // If the presign did NOT sign the checksum header (X-Amz-SignedHeaders lacks it),
        // do NOT send the header or S3 will reject with HeadersNotSigned.
        if (signedHeadersStr && !signedHeadersStr.toLowerCase().includes('x-amz-checksum-crc32')) {
          delete hdrs['x-amz-checksum-crc32'];
          delete (hdrs as any)['X-Amz-Checksum-Crc32'];
        }
        await uploadToS3(init.putUrl, hdrs, item.file, (p) => {
          setUploading(prev => prev.map(u => (u.fileId === init.fileId ? ({ ...u, progress: p }) : u)));
        });
        // 3) Build descriptor
        const desc = toAttachmentDescriptor(item.file, init.fileId);
        setReadyAttachments(prev => [...prev, desc]);
        setUploading(prev => prev.map(u => u.id === item.id ? ({ ...u, status: 'done', progress: 1 }) : u));
      } catch (e: any) {
        const status = e?.response?.status || e?.status;
        if (status === 429) {
          const headers = (e?.response?.headers || {}) as Record<string, any>;
          const retryRaw = headers['retry-after'] ?? headers['Retry-After'];
          let retrySeconds = parseInt(String(retryRaw ?? ''), 10);
          if (!Number.isFinite(retrySeconds) || retrySeconds <= 0) retrySeconds = 5;
          setUploadRateLimitUntil(Date.now() + retrySeconds * 1000);
          te(`Too many uploads, try again in ${retrySeconds}s`);
        } else if (status === 415) {
          te('Unsupported file type');
        } else if (status === 413) {
          te(`File too large (max ${ATTACH_MAX_MB} MB)`);
        } else {
          te('Failed to upload file');
        }
        setUploading(prev => prev.map(u => u.id === item.id ? ({ ...u, status: 'error', error: String(status || 'error'), fileId: assignedFileId ?? u.fileId }) : u));
        revokePreview(assignedFileId);
      }
    };

    await Promise.all(items.map(item => processUpload(item)));
  };

  const dragEventHasFiles = (event: React.DragEvent) => {
    const types = event.dataTransfer?.types;
    if (!types) return false;
    for (let i = 0; i < types.length; i += 1) {
      if (types[i] === 'Files') return true;
    }
    return false;
  };

  const handleChatDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
    if (!dragEventHasFiles(event)) return;
    event.preventDefault();
    event.stopPropagation();
    chatDragCounter.current += 1;
    if (!isDragOverChat) setIsDragOverChat(true);
  };

  const handleChatDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    if (!dragEventHasFiles(event)) return;
    event.preventDefault();
    event.stopPropagation();
    chatDragCounter.current = Math.max(0, chatDragCounter.current - 1);
    if (chatDragCounter.current === 0) setIsDragOverChat(false);
  };

  const handleChatDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    if (!dragEventHasFiles(event)) return;
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer) event.dataTransfer.dropEffect = 'copy';
  };

  const handleChatDrop = (event: React.DragEvent<HTMLDivElement>) => {
    if (!dragEventHasFiles(event)) return;
    event.preventDefault();
    event.stopPropagation();
    const files = event.dataTransfer?.files;
    chatDragCounter.current = 0;
    setIsDragOverChat(false);
    if (!files || files.length === 0) return;
    if (!selectedGroupId) {
      te('Select a group to attach files');
      return;
    }
    addFiles(Array.from(files));
    event.dataTransfer?.clearData();
  };

  const uploadingCount = uploading.filter(u => u.status === 'initiating' || u.status === 'uploading').length;
  const selectedFilesCount = readyAttachments.length + uploadingCount;

  // If a group is already selected and we move to mobile, auto-open chat view
  useEffect(() => {
    if (isMobile && selectedGroupId) {
      setMobileView('chat');
    }
  }, [isMobile, selectedGroupId]);

  const handleLoadOlder = async () => {
    if (!selectedGroupId) return;
    const cursor = nextCursorByGroup[selectedGroupId];
    if (!cursor || loadingMessages) return;
    const el = timelineRef.current;
    const prevScrollBottom = el ? el.scrollHeight - el.scrollTop : 0;
    await fetchMessages(selectedGroupId, cursor);
    // maintain viewport position after prepend
    if (el) {
      requestAnimationFrame(() => {
        el.scrollTop = el.scrollHeight - prevScrollBottom;
      });
    }
  };

  const handleSendMessage = async (text: string): Promise<boolean> => {
    if (!selectedGroupId) return false;
    const content = text.trim();
    const hasAttachments = readyAttachments.length > 0;
    const attachmentsToSend = hasAttachments ? [...readyAttachments] : [];
    const usedIds = hasAttachments ? attachmentsToSend.map(d => d.fileId) : [];
    const previewSnapshot = hasAttachments
      ? usedIds.reduce<Record<string, string>>((acc, fid) => {
          const url = attachmentPreviews[fid];
          if (url) acc[fid] = url;
          return acc;
        }, {})
      : {};
    if (!content && !hasAttachments) return false;
    const optimisticAttachments = hasAttachments
      ? attachmentsToSend.map(d => ({
          id: d.fileId,
          fileName: d.fileName,
          mimeType: d.mimeType,
          sizeBytes: d.sizeBytes,
          url: previewSnapshot[d.fileId] || attachmentPreviews[d.fileId] || undefined,
        }))
      : [];
    // Block if currently rate-limited
    if (rateLimitUntil && Date.now() < rateLimitUntil) {
      const remaining = Math.max(1, Math.ceil((rateLimitUntil - Date.now()) / 1000));
      te(`You're sending too fast, try again in ${remaining}s`);
      return false;
    }
    const clientId = uuidv4();
    const optimistic = {
      id: `optimistic-${clientId}`,
      groupId: selectedGroupId,
      sender: { id: 'me', name: 'You' },
      content: content || (hasAttachments ? '' : content),
      createdAt: new Date().toISOString(),
      clientId,
      optimistic: true,
      attachments: optimisticAttachments,
    };
    setMessages(prev => ({
      ...prev,
      [selectedGroupId]: [ ...(prev[selectedGroupId] ?? []), optimistic ],
    }));
    // scroll to bottom
    requestAnimationFrame(() => { timelineRef.current && (timelineRef.current.scrollTop = timelineRef.current.scrollHeight); });

    if (hasAttachments) {
      setReadyAttachments(prev => prev.filter(d => !usedIds.includes(d.fileId)));
      setAttachmentPreviews(prev => {
        const next = { ...prev };
        usedIds.forEach(fid => { delete next[fid]; });
        return next;
      });
      setUploading(prev => prev.filter(u => !usedIds.includes(u.fileId || '')));
    }

    try {
      const payload: any = { clientId } as any;
      if (content) (payload as any).content = content;
      if (hasAttachments) (payload as any).attachments = attachmentsToSend;
      const res: any = await post(`groups/${selectedGroupId}/messages`, payload, true, false, false);
      const msg = res?.data ?? res;
      setMessages(prev => ({
        ...prev,
        [selectedGroupId]: (prev[selectedGroupId] ?? []).map(m => (m && m.clientId === clientId ? msg : m)),
      }));
    } catch (e: any) {
      // remove optimistic item on failure
      setMessages(prev => ({
        ...prev,
        [selectedGroupId]: (prev[selectedGroupId] ?? []).filter(m => m && m.clientId !== clientId),
      }));
      if (hasAttachments) {
        setReadyAttachments(prev => {
          const filtered = attachmentsToSend.filter(d => !prev.some(existing => existing.fileId === d.fileId));
          return [...prev, ...filtered];
        });
        setAttachmentPreviews(prev => ({ ...prev, ...previewSnapshot }));
      }
      const status = e?.response?.status || e?.status;
      if (status === 429) {
        // Read Retry-After from headers (seconds)
        const headers = (e?.response?.headers || {}) as Record<string, any>;
        const retryRaw = headers['retry-after'] ?? headers['Retry-After'];
        let retrySeconds = parseInt(String(retryRaw ?? ''), 10);
        if (!Number.isFinite(retrySeconds) || retrySeconds <= 0) retrySeconds = 5;
        setRateLimitUntil(Date.now() + retrySeconds * 1000);
        te(`You're sending too fast, try again in ${retrySeconds}s`);
      } else {
        te('Failed to send');
      }
      return false;
    }
    return true;
  };

  const handleLeaveGroup = async () => {
    if (!selectedGroupId) return;
    try {
      await post('groups/leave', { groupId: selectedGroupId });
      ts('Left group');
      setShowGroupInfo(false);
      clearSelection();
      await fetchMyGroups();
      // Refresh suggestions after leaving a group
      fetchSuggestedGroups();
    } catch (err) {
      te('Failed to leave group');
    }
  };

  const handleDeleteGroup = async () => {
    if (!selectedGroupId) return;
    try {
      await post(`groups/${selectedGroupId}/delete`, {});
      ts('Group deleted');
      setShowGroupInfo(false);
      clearSelection();
      await fetchMyGroups();
    } catch (err) {
      te('Failed to delete group');
    }
  };

  // UI-only delete confirmation (wire to BE later)
  const [confirmDelete, setConfirmDelete] = useState<{ open: boolean; messageId: string | null; loading?: boolean }>({ open: false, messageId: null, loading: false });

  const handleConfirmDelete = async () => {
    if (!selectedGroupId || !confirmDelete.messageId) { setConfirmDelete({ open: false, messageId: null }); return; }
    try {
      setConfirmDelete(prev => ({ ...prev, loading: true }));
      const res: any = await deleteAPI(`groups/${selectedGroupId}/messages/${confirmDelete.messageId}`);
      const data = res?.data ?? res;
      const targetId = data?.id || confirmDelete.messageId;
      setMessages(prev => ({
        ...prev,
        [selectedGroupId]: (prev[selectedGroupId] ?? []).map(m => (m && (m.id === targetId || m.clientId === targetId)
          ? { ...m, deleted: true, deletedAt: data?.deletedAt, deletedBy: data?.deletedBy, content: null }
          : m)),
      }));
      ts('Message deleted');
    } catch (e: any) {
      const status = e?.response?.status || e?.status;
      if (status === 429) {
        const headers = (e?.response?.headers || {}) as Record<string, any>;
        const retryRaw = headers['retry-after'] ?? headers['Retry-After'];
        let retrySeconds = parseInt(String(retryRaw ?? ''), 10);
        if (!Number.isFinite(retrySeconds) || retrySeconds <= 0) retrySeconds = 5;
        te(`You're deleting too fast, try again in ${retrySeconds}s`);
      } else if (status === 403) {
        te('You do not have permission to delete this message');
      } else {
        te('Failed to delete message');
      }
    } finally {
      setConfirmDelete({ open: false, messageId: null, loading: false });
    }
  };

  return (
    <div className="page-content groups-page" style={isMobile && mobileView === 'chat' ? { height: 'calc(100dvh - 60px)', overflow: 'hidden' } : undefined}>
      <div className="page-title-wrapper" style={{ borderBottom: '1px solid #E5E7EB' }}>
        <div className="page-title-left">
          <div className="page-title">
            <h4>Groups</h4>
          </div>
        </div>
        <div className="page-title-right">
          <button type="button" className="btn btn-primary" onClick={() => setShowCreateGroup(true)}>
            Create Group
          </button>
          <button type="button" className="btn btn-warning" onClick={handleSyllabusShow}>
            Add Syllabus
          </button>
        </div>
      </div>
      <div className="content-area content-area-title-filter" style={{ overflow: isMobile ? (mobileView === 'chat' ? 'hidden' : 'visible') : 'hidden', height: isMobile && mobileView === 'chat' ? 'calc(100dvh - 60px)' : undefined, minHeight: isMobile && mobileView === 'chat' ? 0 : undefined }}>
        <div className="page-content-wrapper h-100" style={{ overflow: isMobile ? (mobileView === 'chat' ? 'hidden' : 'visible') : 'hidden' }}>
          <div className="row gx-0 gy-0" style={{ minHeight: 0 }}>
            <div className="col-12 col-lg-4 px-0" >
              <div className="d-flex flex-column h-100 bg-white" style={{ overflow: isMobile ? 'visible' : 'hidden' }}>
                {/* Search - hide entirely on mobile when in chat view */}
                {!(isMobile && mobileView === 'chat') && (
                  <div className="d-flex align-items-center search-row" style={{ height: 64, padding: '10px 8px', boxSizing: 'border-box', borderBottom: '1px solid #E5E7EB', background: '#fff', position: 'sticky', top: 0, zIndex: 2 }}>
                    <div className="px-2 w-100" style={{ position: 'relative' }}>
                      <i
                        className="material-symbols-outlined"
                        style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#6B7280' }}
                      >
                        search
                      </i>
                      <input
                        className="form-control w-100"
                        placeholder="Search"
                        aria-label="Search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={() => setSearchFocused(true)}
                        onBlur={() => setSearchFocused(false)}
                        style={{
                          height: 44,
                          paddingLeft: 44,
                          borderRadius: 10,
                          border: searchFocused ? '1px solid #0EA5E9' : '1px solid #E5E7EB',
                          outline: 'none',
                          boxShadow: 'none'
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Tabs - hidden on mobile when in chat; visible otherwise */}
                <div className="nav-tabs-outer nav-tabs-style2 px-0 tabs-row" style={{ background: '#fff', paddingBottom: 0, display: isMobile && mobileView === 'chat' ? 'none' : 'block', position: 'sticky', top: 64, zIndex: 1 }}>
                  <nav>
                    <div
                      className="nav nav-tabs page-filters"
                      role="tablist"
                      style={{ position: 'relative', marginLeft: 0, marginRight: 0, paddingLeft: 0, paddingRight: 0, marginBottom: 0 }}
                    >
                      <div className="page-filters-left w-100 d-flex justify-content-around">
                        <button
                          type="button"
                          className={`nav-link ${activeTab === 'chats' ? 'active' : ''}`}
                          onClick={() => {
                            setActiveTab('chats');
                            try { localStorage.setItem('groups.tab', 'chats'); } catch {}
                            const sp = new URLSearchParams(location.search);
                            sp.set('tab', 'chats');
                            navigate({ pathname: location.pathname, search: `?${sp.toString()}` });
                          }}
                          style={{ borderBottom: 'none', paddingTop: 8, paddingBottom: 8 }}
                        >
                          <div className="d-flex flex-column align-items-center">
                            <i className="material-symbols-outlined" style={{ fontSize: 40 }}>chat_bubble</i>
                            <span style={{ fontSize: 12 }}>All Chats</span>
                          </div>
                        </button>
                        <button
                          type="button"
                          className={`nav-link ${activeTab === 'groups' ? 'active' : ''}`}
                          onClick={() => {
                            if (isMobile && mobileView === 'chat') {
                              setMobileView('list');
                              return;
                            }
                            setActiveTab('groups');
                            try { localStorage.setItem('groups.tab', 'groups'); } catch {}
                            const sp = new URLSearchParams(location.search);
                            sp.set('tab', 'groups');
                            navigate({ pathname: location.pathname, search: `?${sp.toString()}` });
                          }}
                          style={{ borderBottom: 'none', paddingTop: 8, paddingBottom: 8 }}
                        >
                          <div className="d-flex flex-column align-items-center">
                            <i className="material-symbols-outlined" style={{ fontSize: 40 }}>menu_book</i>
                            <span style={{ fontSize: 12 }}>Groups</span>
                          </div>
                        </button>
                      </div>
                      {/* Active underline indicator aligned to divider (overlaps by 1px) */}
                      <div
                        style={{
                          position: 'absolute',
                          left: activeTab === 'chats' ? 0 : '50%',
                          bottom: -1,
                          width: '50%',
                          height: 3,
                          background: '#0EA5E9',
                          borderRadius: 0,
                          pointerEvents: 'none'
                        }}
                      />
                    </div>
                  </nav>
                </div>

                {/* Left column content: on mobile, toggle between list and chat */}
                <div className="left-scroll-inner d-flex flex-column" style={{ minHeight: 0, flex: '1 1 auto', overflow: isMobile && mobileView === 'chat' ? 'hidden' : undefined }}>
                  <div className="flex-grow-1 overflow-auto left-list-scroll" style={{ minHeight: 0, display: isMobile && mobileView === 'chat' ? 'none' : 'block', paddingBottom: 16, WebkitOverflowScrolling: 'touch', overflowY: 'auto' }}>
                  {activeTab === 'chats' ? (
                    <div className="text-center p-4">
                      <img src={'/assets/images/not-voucher-found.svg'} alt="Empty" style={{ width: 120, height: 'auto', opacity: 0.9 }} />
                      <h5 className="mt-3 mb-1">No recent chats</h5>
                      <p className="text-muted mb-0" style={{ fontSize: 14 }}>
                        Start a conversation from a group or create a private study group.
                      </p>
                    </div>
                  ) : null}
                  {/* Temporary placeholder rows to verify left list scrolling */}
                  {activeTab === 'chats' ? (
                    <div className="px-3" aria-hidden="true">
                      {[...Array(40)].map((_, i) => (
                        <div key={`chatrow-${i}`} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0', borderBottom: '1px solid #F3F4F6' }}>
                          <div style={{ width: 36, height: 36, background: '#E5E7EB', borderRadius: '50%' }} />
                          <div style={{ flex: 1 }}>
                            <div style={{ height: 10, background: '#E5E7EB', borderRadius: 6, width: i % 3 === 0 ? '60%' : '40%' }} />
                            <div style={{ height: 10, background: '#F0F2F5', borderRadius: 6, width: i % 4 === 0 ? '30%' : '20%', marginTop: 6 }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div>
                      <div className="px-3 pt-3 d-flex align-items-center justify-content-between">
                        <h6 className="mb-0" style={{ color: '#111827', fontWeight: 600, letterSpacing: 0.2 }}>My Groups</h6>
                        <button
                          className="btn btn-outline-white"
                          style={{ height: 32, width: 32, borderRadius: 8, border: 'none', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          aria-label={myGroupsCollapsed ? 'Expand My Groups' : 'Collapse My Groups'}
                          title={myGroupsCollapsed ? 'Expand' : 'Collapse'}
                          onClick={() => setMyGroupsCollapsed(prev => !prev)}
                        >
                          <i
                            className="material-symbols-outlined"
                            style={{
                              lineHeight: 1,
                              transition: 'transform 160ms ease',
                              transform: myGroupsCollapsed ? 'rotate(-90deg)' : 'rotate(0deg)'
                            }}
                          >
                            expand_more
                          </i>
                        </button>
                      </div>
                      {!myGroupsCollapsed && (
                      <div>
                        {myGroups && myGroups.length > 0 ? (
                          myGroups
                            .filter((g: any) => g?.name?.toLowerCase().includes(searchQuery.trim().toLowerCase()))
                            .map((g: any) => (
                            <GroupListItem
                              key={g.id}
                              id={g.id}
                              name={g.name}
                              avatarColor={g.avatarColor}
                              variant="mine"
                              isSelected={selectedGroupId === g.id}
                              onClick={() => applySelection(g.id)}
                            />
                            ))
                        ) : (
                          <div className="text-center p-4">
                            <h5 className="mt-3 mb-1">You're not in any groups yet</h5>
                            <p className="text-muted mb-0" style={{ fontSize: 14 }}>
                              When you join or create a group, it will appear here.
                            </p>
                          </div>
                        )}
                        {myGroups && myGroups.length > 0 && searchQuery.trim() &&
                          myGroups.filter((g: any) => g?.name?.toLowerCase().includes(searchQuery.trim().toLowerCase())).length === 0 && (
                            <div className="text-center p-3 text-muted" style={{ fontSize: 14 }}>No groups match "{searchQuery.trim()}".</div>
                          )}
                      </div>
                      )}
                      <hr className="my-0" />
                      <div className="px-3 pt-3 d-flex align-items-center justify-content-between">
                        <h6 className="mb-0" style={{ color: '#111827', fontWeight: 600, letterSpacing: 0.2 }}>Find groups to join</h6>
                        <button
                          className="btn btn-outline-white"
                          style={{ height: 32, width: 32, borderRadius: 8, border: 'none', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          aria-label="Refresh suggestions"
                          title="Refresh"
                          onClick={fetchSuggestedGroups}
                        >
                          <i className="material-symbols-outlined" style={{ lineHeight: 1 }}>refresh</i>
                        </button>
                      </div>
                      {suggestionsLoading ? (
                        <div className="px-3" aria-hidden="true">
                          {[...Array(4)].map((_, i) => (
                            <div key={`sugskel-${i}`} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0', borderBottom: '1px solid #F3F4F6' }}>
                              <div style={{ width: 36, height: 36, background: '#E5E7EB', borderRadius: '50%' }} />
                              <div style={{ flex: 1 }}>
                                <div style={{ height: 10, background: '#E5E7EB', borderRadius: 6, width: i % 2 ? '60%' : '40%' }} />
                                <div style={{ height: 10, background: '#F0F2F5', borderRadius: 6, width: i % 3 ? '30%' : '20%', marginTop: 6 }} />
                              </div>
                              <div style={{ width: 88, height: 30, background: '#E5E7EB', borderRadius: 8 }} />
                            </div>
                          ))}
                        </div>
                      ) : suggestions && suggestions.length > 0 ? (
                        <div className="px-2">
                          {suggestions.map((sg: any) => (
                            <div key={sg.id} className="d-flex align-items-center justify-content-between" style={{ padding: '8px 10px', borderBottom: '1px solid #F3F4F6' }}>
                              <div className="d-flex align-items-center gap-2">
                                <div style={{ width: 36, height: 36, borderRadius: 18, background: sg.avatarColor || '#E5F3FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                  <img src={'/assets/images/book.svg'} alt="avatar" style={{ width: 22, height: 'auto' }} />
                                </div>
                                <div>
                                  <div style={{ fontWeight: 600, color: '#111827', lineHeight: 1.2 }}>{sg.name}</div>
                                  <div style={{ fontSize: 12, color: '#6B7280' }}>
                                    {sg?.course?.code ? `${sg.course.code} — ` : ''}{sg?.course?.term ? `${sg.course.term} ` : ''}{sg?.course?.year ?? ''}
                                  </div>
                                </div>
                              </div>
                              <div className="d-flex align-items-center gap-2">
                                {((sg?.members || sg?.memberPreviews || [])).slice(0, 3).map((m: any) => (
                                  <div key={m.id} title={m.displayName || ''} style={{ width: 28, height: 28, borderRadius: '50%', overflow: 'hidden', border: '1px solid #E5E7EB', background: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    {m.picture ? (
                                      <img src={m.picture} alt={m.displayName || ''} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                      <span style={{ fontSize: 10, color: '#374151' }}>
                                        {(m.displayName || '').split(' ').map((s: string) => s[0]).join('').slice(0, 2).toUpperCase() || 'U'}
                                      </span>
                                    )}
                                  </div>
                                ))}
                                <button
                                  className="btn btn-primary"
                                  style={{ height: 32, borderRadius: 8 }}
                                  onClick={async () => {
                                    try {
                                      await post('groups/join', { groupId: sg.id });
                                      ts('Joined group');
                                      await fetchMyGroups();
                                      applySelection(sg.id);
                                    } catch (e) {
                                      te('Failed to join group');
                                    }
                                  }}
                                >
                                  Join
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center p-4">
                          <h5 className="mt-3 mb-1">No suggestions available</h5>
                          <p className="text-muted mb-0" style={{ fontSize: 14 }}>
                            Upload a syllabus to get tailored group suggestions.
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                  </div>
                  {/* Mobile chat view embedded in left column when mobileView === 'chat' */}
                  {isMobile && mobileView === 'chat' && (
                    <div ref={chatFrameRef} className="d-flex flex-column" style={{ minHeight: 0, position: 'relative', flex: '1 1 auto', height: 'calc(100dvh - 60px)', overflow: 'hidden' }}>
                      {/* Fixed chat header inside the frame */}
                      <div className="d-flex align-items-center justify-content-between" style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 56, padding: '8px 16px', boxSizing: 'border-box', borderBottom: '1px solid #E5E7EB', background: '#fff', zIndex: 2 }}>
                        <div className="d-flex align-items-center gap-2">
                          <button className="btn btn-outline-white" onClick={() => setMobileView('list')} aria-label="Back" title="Back">
                            <i className="material-symbols-outlined">arrow_back</i>
                          </button>
                          <div className="d-flex align-items-center gap-2">
                            <div style={{ width: 36, height: 36, borderRadius: 18, background: (myGroups.find(g => g.id === selectedGroupId)?.avatarColor) || '#E5F3FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <img src={'/assets/images/book.svg'} alt="avatar" style={{ width: 22, height: 'auto' }} />
                            </div>
                            <h6 className="mb-0" style={{ color: '#111827' }}>{myGroups.find(g => g.id === selectedGroupId)?.name || 'Group'}</h6>
                          </div>
                        </div>
                        <div className="d-flex align-items-center gap-2">
                          <button className="btn btn-primary" onClick={() => setShowGroupInfo(prev => !prev)} style={{ height: 36, width: 48, borderRadius: 8 }} aria-label="Group Info" title="Group Info">
                            <i className="material-symbols-outlined" style={{ color: '#fff' }}>info</i>
                          </button>
                          <button className="btn btn-outline-white" style={{ height: 36, width: 48, borderRadius: 8 }} aria-label="Search" title="Search"><i className="material-symbols-outlined">search</i></button>
                        </div>
                      </div>
                      {/* Timeline: the only scroller, between fixed header (56px) and measured composer height */}
                      <div ref={timelineRef} style={{ position: 'absolute', top: 56, bottom: composerHeight, left: 0, right: 0, background: '#FAFAFA', padding: '12px 16px', paddingBottom: composerHeight + 70, overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}>
                          {/* Reuse the same message rendering block as right column */}
                          {(() => {
                            const list = selectedGroupId ? (messages[selectedGroupId] ?? []) : [];
                            const sorted = [...list].sort((a: any, b: any) => {
                              const ad = new Date(a?.createdAt || a?.created_on || a?.created_at || 0).getTime();
                              const bd = new Date(b?.createdAt || b?.created_on || b?.created_at || 0).getTime();
                              return ad - bd; // oldest first, newest last (bottom)
                            });
                            if (!list.length) return null;
                            const byDay: { label: string; items: any[] }[] = [];
                            const isSameDay = (a: Date, b: Date) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
                            let currentLabel = '';
                            sorted.forEach((m) => {
                              if (!m) return;
                              const d = m.createdAt ? new Date(m.createdAt) : new Date();
                              const today = new Date();
                              const startOf = (dt: Date) => new Date(dt.getFullYear(), dt.getMonth(), dt.getDate());
                              const diffDays = Math.floor((startOf(today).getTime() - startOf(d).getTime()) / (24 * 60 * 60 * 1000));
                              let label = '';
                              if (isSameDay(d, today)) {
                                label = 'Today';
                              } else if (diffDays >= 0 && diffDays <= 6) {
                                label = d.toLocaleDateString(undefined, { weekday: 'long' });
                              } else {
                                label = d.toLocaleDateString(undefined, { month: '2-digit', day: '2-digit' });
                              }
                              if (label !== currentLabel) {
                                byDay.push({ label, items: [m] });
                                currentLabel = label;
                              } else {
                                byDay[byDay.length - 1].items.push(m);
                              }
                            });
                            return (
                              <>
                                {byDay.map((section, sIdx) => (
                                  <div key={`msec-${sIdx}`}>
                                    <div className="d-flex align-items-center my-3" aria-hidden="true">
                                      <div className="flex-grow-1" style={{ height: 1, background: '#E5E7EB' }} />
                                      <div style={{ padding: '0 10px', color: '#6B7280', fontSize: 12 }}>{section.label}</div>
                                      <div className="flex-grow-1" style={{ height: 1, background: '#E5E7EB' }} />
                                    </div>
                                    {section.items.map((m, i) => {
                                      const key = (m.id as string) || (m.clientId as string) || `${sIdx}-${i}`;
                                      const created = m.createdAt ? new Date(m.createdAt) : new Date();
                                      const isMine = Boolean(
                                        (m?.sender?.id && currentUserSub && m.sender.id === currentUserSub) ||
                                        m?.sender?.id === 'me' ||
                                        (m?.sender?.name && m.sender.name.toLowerCase() === 'you')
                                      );
                                      if (isMine) {
                                        if (m?.deleted) {
                                          return (
                                            <div key={key} className="d-flex justify-content-end mb-2">
                                              <div className="groups-message-row mine" style={{ maxWidth: '90%' }}>
                                                <div className="d-flex align-items-center" style={{ fontSize: 12, color: '#6B7280', margin: '0 4px 4px 4px', justifyContent: 'space-between', width: '100%' }}>
                                                  <div style={{ textAlign: 'left' }}>You</div>
                                                  <div style={{ textAlign: 'right' }}>{created.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                                </div>
                                                <div style={{ background: '#F3F4F6', border: '1px solid #E5E7EB', color: '#6B7280', borderRadius: 12, padding: '10px 12px', fontStyle: 'italic' }}>This message was deleted.</div>
                                              </div>
                                            </div>
                                          );
                                        }
                                        return (
                                          <div key={key} className="d-flex justify-content-end mb-2">
                                            <div className="groups-message-row mine" style={{ maxWidth: '90%', position: 'relative' }}>
                                              {/* Hover actions (mine → top-left of bubble) */}
                                              <div className="message-actions" style={{ position: 'absolute', top: -14, right: -6, background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', display: 'flex', gap: 4, padding: 4, opacity: 0, pointerEvents: 'none', transition: 'opacity 150ms ease', zIndex: 5 }}>
                                                <button className="btn btn-outline-white" aria-label="Delete message" title="Delete" onClick={(e) => { e.stopPropagation(); setConfirmDelete({ open: true, messageId: m.id || m.clientId }); }} style={{ height: 28, width: 28, borderRadius: 8 }}>
                                                  <i className="material-symbols-outlined" style={{ color: '#DC2626' }}>delete</i>
                                                </button>
                                              </div>
                                              <div className="d-flex align-items-center" style={{ fontSize: 12, color: '#6B7280', margin: '0 4px 4px 4px', justifyContent: 'space-between', width: '100%' }}>
                                                <div style={{ textAlign: 'left' }}>You</div>
                                                <div style={{ textAlign: 'right' }}>{created.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                              </div>
{Array.isArray(m.attachments) && m.attachments.length > 0 && !m.deleted ? (
                                              (() => {
                                                const images = m.attachments.filter((att: any) => att?.mimeType?.startsWith('image/'));
                                                const docs = m.attachments.filter((att: any) => !att?.mimeType?.startsWith('image/'));
                                                const imageCount = images.length;
                                                
                                                const singleMaxWidth = 360;
                                                const multiMaxWidth = 280;
                                                const singleHeight = 300;
                                                const multiHeight = 180;
                                                
                                                return (
                                                  <div style={{ marginBottom: m.content ? 8 : 0, display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end' }}>
                                                    {imageCount > 0 && (
                                                      <div
                                                        style={{
                                                          display: imageCount === 1 ? 'block' : 'grid',
                                                          gridTemplateColumns: imageCount === 1 ? 'none' : 'repeat(2, 1fr)',
                                                          gap: 4,
                                                          maxWidth: imageCount === 1 ? singleMaxWidth : multiMaxWidth,
                                                          width: '100%'
                                                        }}
                                                      >
                                                        {images.map((att: any, idx: number) => (
                                                          <span
                                                            key={att.id}
                                                            role="button"
                                                            title={att.fileName}
                                                            onClick={(e) => { e.preventDefault(); openAttachmentLightbox(att, m.id || m.clientId); }}
                                                            style={{
                                                              display: 'block',
                                                              width: '100%',
                                                              height: imageCount === 1 ? singleHeight : multiHeight,
                                                              borderRadius: 12,
                                                              overflow: 'hidden',
                                                              border: '1px solid #E5E7EB',
                                                              cursor: 'zoom-in',
                                                              gridColumn: (imageCount === 3 && idx === 2) ? '2 / 3' : 'auto'
                                                            }}
                                                          >
                                                            <img
                                                              src={att.url}
                                                              alt={att.fileName}
                                                              style={{
                                                                width: '100%',
                                                                height: '100%',
                                                                objectFit: 'cover',
                                                                display: 'block'
                                                              }}
                                                            />
                                                          </span>
                                                        ))}
                                                      </div>
                                                    )}
                                                    {docs.map((att: any) => (
                                                      <a key={att.id} href={att.url} target="_blank" rel="noreferrer" download={att.fileName} className="btn btn-outline-white" style={{ border: '1px solid #E5E7EB', borderRadius: 10 }} onClick={(e) => { e.preventDefault(); handleAttachmentOpen(att, m.id || m.clientId); }}>
                                                        <span style={{ marginRight: 6 }}>📄</span>{att.fileName}
                                                      </a>
                                                    ))}
                                                  </div>
                                                );
                                              })()
                                            ) : null}
                                              {m.content ? (
                                                <div style={{ background: '#E5F3FF', border: '1px solid #CDE7FF', color: '#0F172A', borderRadius: 12, padding: '10px 12px', minWidth: 40 }}>
                                                  {m.content}
                                                </div>
                                              ) : null}
                                            </div>
                                          </div>
                                        );
                                      }
                              // Precompute sender display for branches below
                              const senderName = m?.sender?.displayName || 'User';
                              const avatar = m?.sender?.picture || '/assets/images/avatar-default.svg';
                              if (m?.deleted) {
                                        return (
                                          <div key={key} className="d-flex align-items-start gap-2 mb-2">
                                    <img src={avatar} alt={senderName} style={{ width: 28, height: 28, borderRadius: '50%' }} />
                                            <div style={{ maxWidth: '90%' }}>
                                              <div className="d-flex align-items-center" style={{ fontSize: 12, color: '#6B7280', margin: '0 2px 4px 2px', justifyContent: 'space-between', width: '100%' }}>
                                                <div>{senderName}</div>
                                                <div>{created.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                              </div>
                                              <div style={{ background: '#F9FAFB', border: '1px solid #E5E7EB', color: '#6B7280', borderRadius: 12, padding: '10px 12px', fontStyle: 'italic' }}>This message was deleted.</div>
                                            </div>
                                          </div>
                                        );
                                      }
                                      return (
                                        <div key={key} className="d-flex align-items-start gap-2 mb-2">
                                          <img src={avatar} alt={senderName} style={{ width: 28, height: 28, borderRadius: '50%' }} />
                                          <div style={{ maxWidth: '90%' }}>
                                            <div className="d-flex align-items-center" style={{ fontSize: 12, color: '#6B7280', margin: '0 2px 4px 2px', justifyContent: 'space-between', width: '100%' }}>
                                              <div>{senderName}</div>
                                              <div>{created.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                            </div>
{Array.isArray(m.attachments) && m.attachments.length > 0 && !m.deleted ? (
                                              (() => {
                                                const images = m.attachments.filter((att: any) => att?.mimeType?.startsWith('image/'));
                                                const docs = m.attachments.filter((att: any) => !att?.mimeType?.startsWith('image/'));
                                                const imageCount = images.length;
                                                
                                                const singleMaxWidth = 360;
                                                const multiMaxWidth = 280;
                                                const singleHeight = 300;
                                                const multiHeight = 180;
                                                
                                                return (
                                                  <div style={{ marginBottom: m.content ? 8 : 0, display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-start' }}>
                                                    {imageCount > 0 && (
                                                      <div
                                                        style={{
                                                          display: imageCount === 1 ? 'block' : 'grid',
                                                          gridTemplateColumns: imageCount === 1 ? 'none' : 'repeat(2, 1fr)',
                                                          gap: 4,
                                                          maxWidth: imageCount === 1 ? singleMaxWidth : multiMaxWidth,
                                                          width: '100%'
                                                        }}
                                                      >
                                                        {images.map((att: any, idx: number) => (
                                                          <span
                                                            key={att.id}
                                                            role="button"
                                                            title={att.fileName}
                                                            onClick={(e) => { e.preventDefault(); openAttachmentLightbox(att, m.id || m.clientId); }}
                                                            style={{
                                                              display: 'block',
                                                              width: '100%',
                                                              height: imageCount === 1 ? singleHeight : multiHeight,
                                                              borderRadius: 12,
                                                              overflow: 'hidden',
                                                              border: '1px solid #E5E7EB',
                                                              cursor: 'zoom-in',
                                                              gridColumn: (imageCount === 3 && idx === 2) ? '2 / 3' : 'auto'
                                                            }}
                                                          >
                                                            <img
                                                              src={att.url}
                                                              alt={att.fileName}
                                                              style={{
                                                                width: '100%',
                                                                height: '100%',
                                                                objectFit: 'cover',
                                                                display: 'block'
                                                              }}
                                                            />
                                                          </span>
                                                        ))}
                                                      </div>
                                                    )}
                                                    {docs.map((att: any) => (
                                                      <a key={att.id} href={att.url} target="_blank" rel="noreferrer" download={att.fileName} className="btn btn-outline-white" style={{ border: '1px solid #E5E7EB', borderRadius: 10 }}>
                                                        <span style={{ marginRight: 6 }}>📄</span>{att.fileName}
                                                      </a>
                                                    ))}
                                                  </div>
                                                );
                                              })()
                                            ) : null}
                                            {m.content ? (
                                              <div style={{ background: '#fff', border: '1px solid #E5E7EB', color: '#111827', borderRadius: 12, padding: '10px 12px', minWidth: 40 }}>
                                                {m.content}
                                              </div>
                                            ) : null}
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                ))}
                              </>
                            );
                          })()}
                      </div>
                      {/* Fixed composer at bottom of frame */}
                      <div ref={composerWrapRef} style={{ position: 'fixed', left: frameRect.left, width: frameRect.width, bottom: 0, background: '#FAFAFA', zIndex: 3 }}>
                        <Composer
                          onSend={handleSendMessage}
                          disabled={!selectedGroupId || Boolean(rateLimitUntil && Date.now() < rateLimitUntil)}
                          countdownSeconds={rateLimitUntil ? Math.max(0, Math.ceil((rateLimitUntil - Date.now()) / 1000)) : 0}
                          resizeSignal={frameRect.width}
                          onFilesAdded={addFiles}
                          selectedFilesCount={selectedFilesCount}
                          uploadingCount={uploadingCount}
                          allowEmptySend={readyAttachments.length > 0}
                          previews={renderAttachmentPreviews()}
                        />
                      </div>

                      {/* Mobile Group Info overlay (mirrors desktop panel) */}
                      <div
                        onClick={() => setShowGroupInfo(false)}
                        style={{
                          position: 'fixed', left: frameRect.left, width: frameRect.width, top: Math.max(64, frameRect.top), bottom: composerHeight,
                          background: 'rgba(0,0,0,0.06)', zIndex: 3,
                          opacity: showGroupInfo && isMobile ? 1 : 0,
                          transition: 'opacity 220ms ease',
                          pointerEvents: showGroupInfo && isMobile ? 'auto' : 'none',
                          display: (showGroupInfo && isMobile && frameRect.width > 0) ? 'block' : 'none'
                        }}
                      />
                      <div
                        style={{
                          position: 'fixed', top: Math.max(64, frameRect.top), left: frameRect.left, width: Math.max(300, frameRect.width), bottom: composerHeight,
                          background: '#fff', borderLeft: '1px solid #E5E7EB', boxShadow: '0 0 24px rgba(0,0,0,0.08)', zIndex: 4,
                          display: (showGroupInfo && isMobile && frameRect.width > 0) ? 'flex' : 'none', flexDirection: 'column',
                          transform: showGroupInfo && isMobile ? 'translateX(0)' : 'translateX(100%)',
                          transition: showGroupInfo && isMobile ? 'transform 240ms ease' : 'none',
                          pointerEvents: showGroupInfo && isMobile ? 'auto' : 'none'
                        }}
                      >
                        <div
                          style={{
                            background: (selectedGroup?.avatarColor) || '#E5F3FF',
                            height: 88,
                            padding: '12px 16px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                          }}
                        >
                          <img src={'/assets/images/book.svg'} alt="group" style={{ width: 28, height: 'auto' }} />
                          <button className="btn btn-outline-white" onClick={() => setShowGroupInfo(false)} aria-label="Close">
                            <i className="material-symbols-outlined">close</i>
                          </button>
                        </div>
                        <div style={{ padding: '12px 16px', borderBottom: '1px solid #E5E7EB' }}>
                          <h6 className="mb-1" style={{ color: '#111827' }}>{selectedGroup?.name || 'Group'}</h6>
                          <div className="text-muted" style={{ fontSize: 13 }}>
                            {(() => {
                              const typeLabel = selectedGroup?.type === 'canonical' ? 'Class' : 'Group';
                              const count = typeof selectedGroup?.memberCount === 'number' ? selectedGroup?.memberCount : null;
                              const countLabel = count !== null ? `${count} Student${count === 1 ? '' : 's'}` : 'Students';
                              return `${typeLabel} - ${countLabel}`;
                            })()}
                          </div>
                        </div>
                        <div className="group-info-scroll" style={{ flex: '1 1 auto', minHeight: 0, overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}>
                          <div style={{ padding: '16px' }}>
                            {(() => {
                              const hex = selectedGroup?.avatarColor || '#E5F3FF';
                              const toRGBA = (h: string, alpha: number) => {
                                const m = h.replace('#','');
                                const r = parseInt(m.substring(0,2), 16);
                                const g = parseInt(m.substring(2,4), 16);
                                const b = parseInt(m.substring(4,6), 16);
                                return `rgba(${r}, ${g}, ${b}, ${alpha})`;
                              };
                              const bg = toRGBA(hex, 0.10);
                              const border = toRGBA(hex, 0.25);
                              const description = selectedGroup?.description || 'No description provided.';
                              const creatorName = (selectedGroup?.createdBy && (selectedGroup?.createdBy.displayName || selectedGroup?.createdBy.name))
                                || (selectedGroup?.owner && (selectedGroup?.owner.displayName || selectedGroup?.owner.name))
                                || selectedGroup?.creatorName
                                || 'Unknown';
                              const createdAtRaw = selectedGroup?.createdAt || selectedGroup?.created_on || selectedGroup?.created_at || null;
                              const createdAtStr = createdAtRaw ? new Date(createdAtRaw).toLocaleDateString() : '';
                              return (
                                <div style={{ background: bg, border: `1px solid ${border}`, borderRadius: 12, padding: 16 }}>
                                  <div style={{ color: '#111827', lineHeight: 1.6 }}>{description}</div>
                                  <div className="text-muted" style={{ fontSize: 13, marginTop: 12 }}>
                                    Created By : {creatorName}{createdAtStr ? `  ${createdAtStr}` : ''}
                                  </div>
                                </div>
                              );
                            })()}
                          </div>
                          {selectedGroup ? (
                            <>
                              <div style={{ borderTop: '1px solid #E5E7EB' }} />
                              <div style={{ padding: '16px' }}>
                                <div className="d-flex flex-column gap-3">
                                  <button type="button" className="btn btn-outline-white text-start" onClick={() => { setInviteQuery(''); setInviteResults([]); setInviteSelected([]); setCopied(false); setInviteLoading(false); setShowInvite(true); }} style={{ border: '1px solid #E5E7EB', borderRadius: 12, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12, width: '100%' }}>
                                    <i className="material-symbols-outlined">person_add</i>
                                    <span>Invite Members</span>
                                  </button>
                                  <button type="button" className="btn btn-outline-white text-start" onClick={handleLeaveGroup} style={{ border: '1px solid #E5E7EB', borderRadius: 12, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12, width: '100%' }}>
                                    <i className="material-symbols-outlined">logout</i>
                                    <span>Exit Group</span>
                                  </button>
                                  {selectedGroup?.type !== 'canonical' ? (
                                    <button type="button" className="btn btn-outline-white text-start" onClick={handleDeleteGroup} style={{ border: '1px solid #E5E7EB', borderRadius: 12, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12, width: '100%' }}>
                                      <i className="material-symbols-outlined">delete</i>
                                      <span>Delete Group</span>
                                    </button>
                                  ) : null}
                                </div>
                              </div>
                            </>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            {/* Right column (chat area) - hide entirely on mobile to avoid duplicate stacked view */}
            <div
              className={`col-12 col-lg-8 d-flex flex-column right-pane-scroll ${isMobile ? 'd-none' : ''}`}
              style={{ minHeight: 0, overflow: 'auto', overflowX: 'hidden', position: 'relative' }}
              onDragEnter={handleChatDragEnter}
              onDragOver={handleChatDragOver}
              onDragLeave={handleChatDragLeave}
              onDrop={handleChatDrop}
            >
              {isDragOverChat && (
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'rgba(15,23,42,0.18)',
                    border: '2px dashed #0EA5E9',
                    borderRadius: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 5,
                    pointerEvents: 'none',
                  }}
                >
                  <div style={{ background: '#FFFFFF', padding: '20px 28px', borderRadius: 16, boxShadow: '0 10px 30px rgba(15,23,42,0.25)', color: '#0F172A', fontWeight: 600, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 64, height: 64, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <i className="material-symbols-outlined" style={{ fontSize: 36, color: '#0EA5E9' }}>cloud_upload</i>
                    </div>
                    <div>Drop files to attach</div>
                  </div>
                </div>
              )}
              {/* Header */}
              <div className="d-flex align-items-center justify-content-between" style={{ height: 64, padding: '10px 24px', boxSizing: 'border-box', borderBottom: '1px solid #E5E7EB', borderLeft: '1px solid #E5E7EB', position: 'sticky', top: 0, background: '#fff', zIndex: 1 }}>
                <div className="d-flex align-items-center gap-2">
                  {selectedGroupId ? (
                    <>
                      <div className="d-flex align-items-center gap-2">
                        <div style={{ width: 44, height: 44, borderRadius: 22, background: (myGroups.find(g => g.id === selectedGroupId)?.avatarColor) || '#E5F3FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <img src={'/assets/images/book.svg'} alt="avatar" style={{ width: 26, height: 'auto' }} />
                        </div>
                        <h5 className="mb-0" style={{ color: '#111827' }}>{myGroups.find(g => g.id === selectedGroupId)?.name}</h5>
                      </div>
                    </>
                  ) : (
                    <>
                      <img src={'/assets/images/avatar-default.svg'} alt="avatar" style={{ width: 44, height: 44, borderRadius: '50%' }} />
                      <h5 className="mb-0" style={{ color: '#6B7280' }}>{activeTab === 'groups' ? 'Select a group' : 'Select a conversation'}</h5>
                    </>
                  )}
                </div>
                {(activeTab === 'groups' || !!selectedGroupId) ? (
                  <div className="d-flex align-items-center gap-2">
                    <button
                      className="btn btn-primary"
                      style={{ height: 40, minWidth: 120, borderRadius: 8, opacity: selectedGroupId ? 1 : 0.6 }}
                      disabled={!selectedGroupId}
                      onClick={() => setShowGroupInfo(prev => !prev)}
                    >
                      Group Info
                    </button>
                    <button className="btn btn-outline-white" style={{ height: 40, width: 56, borderRadius: 8 }}>
                      <i className="material-symbols-outlined">search</i>
                    </button>
                  </div>
                ) : null}
              </div>
              {/* Chat timeline (independent scroll) */}
              <div className="flex-grow-1 d-flex flex-column" style={{ minHeight: 0 }}>
                <div ref={timelineRef} className="flex-grow-1 right-timeline-scroll" style={{ background: '#FAFAFA', padding: '16px 24px', overflow: selectedGroupId ? 'auto' : 'hidden' }}>
                  {/* Load older */}
                  {selectedGroupId && nextCursorByGroup[selectedGroupId] && (
                    <div className="text-center mb-3">
                      <button className="btn btn-outline-white" onClick={handleLoadOlder} disabled={loadingMessages}>Load older</button>
                    </div>
                  )}

                  {(() => {
                    const list = selectedGroupId ? (messages[selectedGroupId] ?? []) : [];
                    const sorted = [...list].sort((a: any, b: any) => {
                      const ad = new Date(a?.createdAt || a?.created_on || a?.created_at || 0).getTime();
                      const bd = new Date(b?.createdAt || b?.created_on || b?.created_at || 0).getTime();
                      return ad - bd; // oldest first, newest last (bottom)
                    });
                    if (!list.length) return null;

                    // Group messages by calendar day (local time)
                    const byDay: { label: string; items: any[] }[] = [];
                    const isSameDay = (a: Date, b: Date) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
                    let currentLabel = '';
                    sorted.forEach((m) => {
                      if (!m) return;
                      const d = m.createdAt ? new Date(m.createdAt) : new Date();
                      const today = new Date();
                      const startOf = (dt: Date) => new Date(dt.getFullYear(), dt.getMonth(), dt.getDate());
                      const diffDays = Math.floor((startOf(today).getTime() - startOf(d).getTime()) / (24 * 60 * 60 * 1000));
                      let label = '';
                      if (isSameDay(d, today)) {
                        label = 'Today';
                      } else if (diffDays >= 0 && diffDays <= 6) {
                        label = d.toLocaleDateString(undefined, { weekday: 'long' });
                      } else {
                        label = d.toLocaleDateString(undefined, { month: '2-digit', day: '2-digit' });
                      }
                      if (label !== currentLabel) {
                        byDay.push({ label, items: [m] });
                        currentLabel = label;
                      } else {
                        byDay[byDay.length - 1].items.push(m);
                      }
                    });

                    return (
                      <>
                        {byDay.map((section, sIdx) => (
                          <div key={`sec-${sIdx}`}>
                            {/* Day separator */}
                            <div className="d-flex align-items-center my-3" aria-hidden="true">
                              <div className="flex-grow-1" style={{ height: 1, background: '#E5E7EB' }} />
                              <div style={{ padding: '0 10px', color: '#6B7280', fontSize: 12 }}>{section.label}</div>
                              <div className="flex-grow-1" style={{ height: 1, background: '#E5E7EB' }} />
                            </div>

                            {section.items.map((m, i) => {
                              const key = (m.id as string) || (m.clientId as string) || `${sIdx}-${i}`;
                              const created = m.createdAt ? new Date(m.createdAt) : new Date();
                              const isMine = Boolean(
                                (m?.sender?.id && currentUserSub && m.sender.id === currentUserSub) ||
                                m?.sender?.id === 'me' ||
                                (m?.sender?.name && m.sender.name.toLowerCase() === 'you')
                              );
                              if (isMine) {
                                if (m?.deleted) {
                                  return (
                                    <div key={key} className="d-flex justify-content-end mb-2">
                                      <div className="groups-message-row mine" style={{ maxWidth: '72%' }}>
                                        <div className="d-flex align-items-center" style={{ fontSize: 12, color: '#6B7280', margin: '0 4px 4px 4px', justifyContent: 'space-between', width: '100%' }}>
                                          <div style={{ textAlign: 'left' }}>You</div>
                                          <div style={{ textAlign: 'right' }}>{created.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                        </div>
                                        <div style={{ background: '#F3F4F6', border: '1px solid #E5E7EB', color: '#6B7280', borderRadius: 12, padding: '10px 12px', fontStyle: 'italic' }}>This message was deleted.</div>
                                      </div>
                                    </div>
                                  );
                                }
                                return (
                                  <div key={key} className="d-flex justify-content-end mb-2">
                                    <div className="groups-message-row mine" style={{ maxWidth: '72%', position: 'relative' }}>
                                      {/* Hover actions (mine → top-left of bubble) */}
                                      <div className="message-actions" style={{ position: 'absolute', top: -14, right: -6, background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', display: 'flex', gap: 4, padding: 4, opacity: 0, pointerEvents: 'none', transition: 'opacity 150ms ease', zIndex: 5 }}>
                                        <button className="btn btn-outline-white" aria-label="Delete message" title="Delete" onClick={(e) => { e.stopPropagation(); setConfirmDelete({ open: true, messageId: m.id || m.clientId }); }} style={{ height: 28, width: 28, borderRadius: 8 }}>
                                          <i className="material-symbols-outlined" style={{ color: '#DC2626' }}>delete</i>
                                        </button>
                                      </div>
                                      <div className="d-flex align-items-center" style={{ fontSize: 12, color: '#6B7280', margin: '0 4px 4px 4px', justifyContent: 'space-between', width: '100%' }}>
                                        <div style={{ textAlign: 'left' }}>You</div>
                                        <div style={{ textAlign: 'right' }}>{created.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                      </div>
{Array.isArray(m.attachments) && m.attachments.length > 0 && !m.deleted ? (
                                        (() => {
                                          const images = m.attachments.filter((att: any) => att?.mimeType?.startsWith('image/'));
                                          const docs = m.attachments.filter((att: any) => !att?.mimeType?.startsWith('image/'));
                                          const imageCount = images.length;
                                          
                                          // Determine layout based on count
                                          const singleMaxWidth = 360;
                                          const multiMaxWidth = 280;
                                          const singleHeight = 300;
                                          const multiHeight = 180;
                                          
                                          return (
                                            <div style={{ marginBottom: m.content ? 8 : 0, display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end' }}>
                                              {imageCount > 0 && (
                                                <div
                                                  style={{
                                                    display: imageCount === 1 ? 'block' : 'grid',
                                                    gridTemplateColumns: imageCount === 1 ? 'none' : 'repeat(2, 1fr)',
                                                    gap: 4,
                                                    maxWidth: imageCount === 1 ? singleMaxWidth : multiMaxWidth,
                                                    width: '100%'
                                                  }}
                                                >
                                                  {images.map((att: any, idx: number) => (
                                                    <span
                                                      key={att.id}
                                                      role="button"
                                                      title={att.fileName}
                                                      onClick={(e) => { e.preventDefault(); openAttachmentLightbox(att, m.id || m.clientId); }}
                                                      style={{
                                                        display: 'block',
                                                        width: '100%',
                                                        height: imageCount === 1 ? singleHeight : multiHeight,
                                                        borderRadius: 12,
                                                        overflow: 'hidden',
                                                        border: '1px solid #E5E7EB',
                                                        cursor: 'zoom-in',
                                                        gridColumn: (imageCount === 3 && idx === 2) ? '2 / 3' : 'auto'
                                                      }}
                                                    >
                                                      <img
                                                        src={att.url}
                                                        alt={att.fileName}
                                                        style={{
                                                          width: '100%',
                                                          height: '100%',
                                                          objectFit: 'cover',
                                                          display: 'block'
                                                        }}
                                                      />
                                                    </span>
                                                  ))}
                                                </div>
                                              )}
                                              {docs.map((att: any) => (
                                                <a key={att.id} href={att.url} target="_blank" rel="noreferrer" download={att.fileName} className="btn btn-outline-white" style={{ border: '1px solid #E5E7EB', borderRadius: 10 }} onClick={(e) => { e.preventDefault(); handleAttachmentOpen(att, m.id || m.clientId); }}>
                                                  <span style={{ marginRight: 6 }}>📄</span>{att.fileName}
                                                </a>
                                              ))}
                                            </div>
                                          );
                                        })()
                                      ) : null}
                                      {m.content ? (
                                        <div style={{ background: '#E5F3FF', border: '1px solid #CDE7FF', color: '#0F172A', borderRadius: 12, padding: '10px 12px', minWidth: 40 }}>
                                          {m.content}
                                        </div>
                                      ) : null}
                                    </div>
                                  </div>
                                );
                              }
                              const senderName = m?.sender?.displayName || 'User';
                              const avatar = m?.sender?.picture || '/assets/images/avatar-default.svg';
                              if (m?.deleted) {
                                return (
                                  <div key={key} className="d-flex align-items-start gap-2 mb-2">
                                  <img src={avatar} alt={senderName} style={{ width: 32, height: 32, borderRadius: '50%' }} />
                                    <div style={{ maxWidth: '72%' }}>
                                      <div className="d-flex align-items-center" style={{ fontSize: 12, color: '#6B7280', margin: '0 2px 4px 2px', justifyContent: 'space-between', width: '100%' }}>
                                        <div>{senderName}</div>
                                        <div>{created.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                      </div>
                                      <div style={{ background: '#F9FAFB', border: '1px solid #E5E7EB', color: '#6B7280', borderRadius: 12, padding: '10px 12px', fontStyle: 'italic' }}>This message was deleted.</div>
                                    </div>
                                  </div>
                                );
                              }
                              return (
                                <div key={key} className="d-flex align-items-start gap-2 mb-2">
                                  <img src={avatar} alt={senderName} style={{ width: 32, height: 32, borderRadius: '50%' }} />
                                  <div style={{ maxWidth: '72%' }}>
                                    <div className="d-flex align-items-center" style={{ fontSize: 12, color: '#6B7280', margin: '0 2px 4px 2px', justifyContent: 'space-between', width: '100%' }}>
                                      <div>{senderName}</div>
                                      <div>{created.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                    </div>
{Array.isArray(m.attachments) && m.attachments.length > 0 && !m.deleted ? (
                                      (() => {
                                        const images = m.attachments.filter((att: any) => att?.mimeType?.startsWith('image/'));
                                        const docs = m.attachments.filter((att: any) => !att?.mimeType?.startsWith('image/'));
                                        const imageCount = images.length;
                                        
                                        const singleMaxWidth = 360;
                                        const multiMaxWidth = 280;
                                        const singleHeight = 300;
                                        const multiHeight = 180;
                                        
                                        return (
                                          <div style={{ marginBottom: m.content ? 8 : 0, display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-start' }}>
                                            {imageCount > 0 && (
                                              <div
                                                style={{
                                                  display: imageCount === 1 ? 'block' : 'grid',
                                                  gridTemplateColumns: imageCount === 1 ? 'none' : 'repeat(2, 1fr)',
                                                  gap: 4,
                                                  maxWidth: imageCount === 1 ? singleMaxWidth : multiMaxWidth,
                                                  width: '100%'
                                                }}
                                              >
                                                {images.map((att: any, idx: number) => (
                                                  <span
                                                    key={att.id}
                                                    role="button"
                                                    title={att.fileName}
                                                    onClick={(e) => { e.preventDefault(); openAttachmentLightbox(att, m.id || m.clientId); }}
                                                    style={{
                                                      display: 'block',
                                                      width: '100%',
                                                      height: imageCount === 1 ? singleHeight : multiHeight,
                                                      borderRadius: 12,
                                                      overflow: 'hidden',
                                                      border: '1px solid #E5E7EB',
                                                      cursor: 'zoom-in',
                                                      gridColumn: (imageCount === 3 && idx === 2) ? '2 / 3' : 'auto'
                                                    }}
                                                  >
                                                    <img
                                                      src={att.url}
                                                      alt={att.fileName}
                                                      style={{
                                                        width: '100%',
                                                        height: '100%',
                                                        objectFit: 'cover',
                                                        display: 'block'
                                                      }}
                                                    />
                                                  </span>
                                                ))}
                                              </div>
                                            )}
                                            {docs.map((att: any) => (
                                              <a key={att.id} href={att.url} target="_blank" rel="noreferrer" download={att.fileName} className="btn btn-outline-white" style={{ border: '1px solid #E5E7EB', borderRadius: 10 }}>
                                                <span style={{ marginRight: 6 }}>📄</span>{att.fileName}
                                              </a>
                                            ))}
                                          </div>
                                        );
                                      })()
                                    ) : null}
                                    {m.content ? (
                                      <div style={{ background: '#fff', border: '1px solid #E5E7EB', color: '#111827', borderRadius: 12, padding: '10px 12px', minWidth: 40 }}>
                                        {m.content}
                                      </div>
                                    ) : null}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ))}
                      </>
                    );
                  })()}
                </div>
                {/* Composer */}
                <Composer
                  onSend={handleSendMessage}
                  disabled={!selectedGroupId || Boolean(rateLimitUntil && Date.now() < rateLimitUntil)}
                  countdownSeconds={rateLimitUntil ? Math.max(0, Math.ceil((rateLimitUntil - Date.now()) / 1000)) : 0}
                  onFilesAdded={addFiles}
                  selectedFilesCount={selectedFilesCount}
                  uploadingCount={uploadingCount}
                  allowEmptySend={readyAttachments.length > 0}
                  previews={renderAttachmentPreviews()}
                />
              </div>

              {/* Nested Group Info panel (animated slide) */}
              {/* Backdrop limited to right column content area */}
              <div
                onClick={() => setShowGroupInfo(false)}
                style={{
                  position: 'absolute', left: 0, right: 0, top: 64, bottom: 0,
                  background: 'rgba(0,0,0,0.06)', zIndex: 2,
                  opacity: showGroupInfo ? 1 : 0,
                  transition: 'opacity 220ms ease',
                  pointerEvents: showGroupInfo ? 'auto' : 'none'
                }}
              />
              <div
                style={{
                  position: 'absolute', top: 64, right: 0, bottom: 0, width: 380,
                  background: '#fff', borderLeft: '1px solid #E5E7EB', boxShadow: '0 0 24px rgba(0,0,0,0.08)', zIndex: 3,
                  display: 'flex', flexDirection: 'column',
                  transform: showGroupInfo ? 'translateX(0)' : 'translateX(100%)',
                  transition: 'transform 240ms ease',
                  pointerEvents: showGroupInfo ? 'auto' : 'none'
                }}
              >
                {/* Banner header: fills with avatar color, icon left, close on right */}
                <div
                  style={{
                    background: (selectedGroup?.avatarColor) || '#E5F3FF',
                    height: 96,
                    padding: '12px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <img src={'/assets/images/book.svg'} alt="group" style={{ width: 32, height: 'auto' }} />
                  <button className="btn btn-outline-white" onClick={() => setShowGroupInfo(false)}>
                    <i className="material-symbols-outlined">close</i>
                  </button>
                </div>
                {/* Name under banner */}
                <div style={{ padding: '12px 16px', borderBottom: '1px solid #E5E7EB' }}>
                  <h5 className="mb-1" style={{ color: '#111827' }}>{selectedGroup?.name || 'Group'}</h5>
                  <div className="text-muted" style={{ fontSize: 14 }}>
                    {(() => {
                      if (selectedGroup?.type === 'canonical') {
                        const prof =
                          groupDetail?.course?.instructor ||
                          groupDetail?.instructor ||
                          groupDetail?.professorName ||
                          selectedGroup?.professorName ||
                          'Unassigned';
                        return prof;
                      }
                      const count = typeof selectedGroup?.memberCount === 'number' ? selectedGroup?.memberCount : null;
                      const countLabel = count !== null ? `${count} Student${count === 1 ? '' : 's'}` : 'Students';
                      return `Group - ${countLabel}`;
                    })()}
                  </div>
                </div>
                {/* Scrollable body for desktop (description + actions) */}
                <div className="group-info-scroll" style={{ flex: '1 1 auto', minHeight: 0, overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}>
                  <div style={{ padding: '16px' }}>
                    {selectedGroup?.type === 'canonical' ? (
                      (() => {
                        const count = (Array.isArray(groupDetail?.members) ? groupDetail.members.length : (typeof selectedGroup?.memberCount === 'number' ? selectedGroup?.memberCount : 0));
                        const members: Array<any> = Array.isArray(groupDetail?.members) ? groupDetail.members : [];
                        const visible = membersExpanded ? members : members.slice(0, 3);
                        return (
                          <>
                            <div style={{ fontWeight: 600, color: '#111827', marginBottom: 8 }}>
                              {`Class - ${count} Student${count === 1 ? '' : 's'}`}
                            </div>
                            <div style={{ maxHeight: membersExpanded ? 260 : undefined, overflowY: membersExpanded ? 'auto' : 'visible' }}>
                              {visible.map((m: any) => (
                                <div key={m.id || m.userId} className="d-flex align-items-center gap-2 py-2">
                                  <img src={m.picture || '/assets/images/avatar-default.svg'} alt={m.displayName || m.name || 'student'} style={{ width: 28, height: 28, borderRadius: 14 }} />
                                  <div style={{ color: '#111827' }}>
                                    {(m.displayName || m.name || (m.firstName && m.lastName ? `${m.firstName} ${m.lastName}` : 'Student'))}
                                  </div>
                                </div>
                              ))}
                              {members.length > 3 && (
                                <div className="text-center" style={{ paddingTop: 6 }}>
                                  <button className="btn btn-outline-white" style={{ height: 32, borderRadius: 8 }} onClick={() => setMembersExpanded(v => !v)}>
                                    {membersExpanded ? 'Collapse' : 'Show all'}
                                  </button>
                                </div>
                              )}
                            </div>
                          </>
                        );
                      })()
                    ) : (
                    (() => {
                      const hex = selectedGroup?.avatarColor || '#E5F3FF';
                      const toRGBA = (h: string, alpha: number) => {
                        const m = h.replace('#','');
                        const r = parseInt(m.substring(0,2), 16);
                        const g = parseInt(m.substring(2,4), 16);
                        const b = parseInt(m.substring(4,6), 16);
                        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
                      };
                      const bg = toRGBA(hex, 0.10);
                      const border = toRGBA(hex, 0.25);
                      const description = selectedGroup?.description || 'No description provided.';
                      const creatorName = (selectedGroup?.createdBy && (selectedGroup?.createdBy.displayName || selectedGroup?.createdBy.name))
                        || (selectedGroup?.owner && (selectedGroup?.owner.displayName || selectedGroup?.owner.name))
                        || selectedGroup?.creatorName
                        || 'Unknown';
                      const createdAtRaw = selectedGroup?.createdAt || selectedGroup?.created_on || selectedGroup?.created_at || null;
                      const createdAtStr = createdAtRaw ? new Date(createdAtRaw).toLocaleDateString() : '';
                      return (
                        <div style={{ background: bg, border: `1px solid ${border}`, borderRadius: 12, padding: 16 }}>
                          <div style={{ color: '#111827', lineHeight: 1.6 }}>{description}</div>
                          <div className="text-muted" style={{ fontSize: 13, marginTop: 12 }}>
                            Created By : {creatorName}{createdAtStr ? `  ${createdAtStr}` : ''}
                          </div>
                        </div>
                      );
                    })())}
                  </div>
                  {selectedGroup ? (
                    <>
                      <div style={{ borderTop: '1px solid #E5E7EB' }} />
                      <div style={{ padding: '16px' }}>
                        <div className="d-flex flex-column gap-3">
                          <button
                            type="button"
                            className="btn btn-outline-white text-start"
                            onClick={() => { setInviteQuery(''); setInviteResults([]); setInviteSelected([]); setCopied(false); setInviteLoading(false); setShowInvite(true); }}
                            style={{
                              border: '1px solid #E5E7EB',
                              borderRadius: 12,
                              padding: '14px 16px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 12,
                              width: '100%'
                            }}
                          >
                            <i className="material-symbols-outlined">person_add</i>
                            <span>Invite Members</span>
                          </button>
                          <button
                            type="button"
                            className="btn btn-outline-white text-start"
                            onClick={handleLeaveGroup}
                            style={{
                              border: '1px solid #E5E7EB',
                              borderRadius: 12,
                              padding: '14px 16px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 12,
                              width: '100%'
                            }}
                          >
                            <i className="material-symbols-outlined">logout</i>
                            <span>Exit Group</span>
                          </button>

                          {selectedGroup?.type !== 'canonical' ? (
                            <button
                              type="button"
                              className="btn btn-outline-white text-start"
                              onClick={handleDeleteGroup}
                              style={{
                                border: '1px solid #E5E7EB',
                                borderRadius: 12,
                                padding: '14px 16px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 12,
                                width: '100%'
                              }}
                            >
                              <i className="material-symbols-outlined">delete</i>
                              <span>Delete Group</span>
                            </button>
                          ) : null}
                        </div>
                      </div>
                    </>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Syllabus Modal */}
      <AddEditSyllabus 
        showSyllabus={showSyllabus} 
        setShowSyllabus={setShowSyllabus} 
        handleGetData={() => {}} // TODO: Add syllabus data refresh if needed
      />
      {/* Create Group Modal */}
      <AddEditGroup 
        showGroup={showCreateGroup}
        setShowGroup={setShowCreateGroup}
        handleGetData={() => {}}
        onCreate={async (payload) => {
          try {
            const res: any = await post('groups/create', payload);
            if (res?.data) {
              ts('Group created');
              await fetchMyGroups();
            }
          } catch (err: any) {
            te('Failed to create group');
          }
        }}
      />

      {/* Confirm Delete (UI only for now) */}
      {confirmDelete.open && (
        <div role="dialog" aria-modal="true" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.25)', zIndex: 1050, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setConfirmDelete({ open: false, messageId: null })}>
          <div className="bg-white" style={{ width: 360, borderRadius: 12, boxShadow: '0 10px 24px rgba(0,0,0,0.15)', border: '1px solid #E5E7EB' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: '16px 16px 0 16px' }}>
              <h6 className="mb-1" style={{ color: '#111827' }}>Delete message?</h6>
              <div className="text-muted" style={{ fontSize: 14 }}>This can't be undone. We'll wire this to backend next.</div>
            </div>
            <div className="d-flex justify-content-end gap-2" style={{ padding: 16 }}>
              <button className="btn btn-outline-white" onClick={() => setConfirmDelete({ open: false, messageId: null })}>Cancel</button>
              <button className="btn btn-primary" onClick={handleConfirmDelete} disabled={!!confirmDelete.loading}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Invite Members Modal - simplified */}
      {showInvite && (
        <div role="dialog" aria-modal="true" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.25)', zIndex: 1050, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setShowInvite(false)}>
          <div className="bg-white" style={{ width: 520, maxWidth: '95vw', borderRadius: 12, boxShadow: '0 10px 24px rgba(0,0,0,0.15)', border: '1px solid #E5E7EB' }} onClick={(e) => e.stopPropagation()}>
            <div className="d-flex align-items-center justify-content-between" style={{ padding: 16, borderBottom: '1px solid #E5E7EB' }}>
              <h6 className="mb-0" style={{ color: '#111827' }}>Invite to group</h6>
              <button type="button" className="btn-close" onClick={() => setShowInvite(false)}>
                <i className='material-symbols-outlined'>close</i>
              </button>
            </div>
            <div style={{ padding: 16 }}>
              {/* One-row create/copy link button */}
              <div className="d-flex align-items-center justify-content-between" style={{ gap: 12 }}>
                <div className="text-muted" style={{ fontSize: 13 }}>Create a 24-hour link that anyone can use.</div>
                <button
                  className="btn btn-primary"
                  disabled={inviteLoading || !selectedGroupId}
                  onClick={async () => {
                    if (!selectedGroupId) return;
                    try {
                      setInviteLoading(true);
                      const res: any = await post(`groups/${selectedGroupId}/invites`, {});
                      const data = res?.data ?? res;
                      if (data?.url) {
                        await navigator.clipboard.writeText(data.url);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 4000);
                        ts('Link copied to clipboard');
                      } else {
                        te('No link returned');
                      }
                    } catch {
                      te('Failed to create invite link');
                    } finally { setInviteLoading(false); }
                  }}
                >
                  {inviteLoading ? 'Creating…' : (copied ? 'Link copied to clipboard' : 'Create invite link')}
                </button>
              </div>

              {/* Divider between create-link row and search row */}
              <hr className="my-3" />

              {/* Direct invite by username */}
              <div>
                <label className="form-label" style={{ fontWeight: 600 }}>Invite by username</label>
                <input
                  className="form-control"
                  placeholder="Search username"
                  value={inviteQuery}
                  onChange={(e) => setInviteQuery(e.target.value)}
                  style={{ outline: 'none', boxShadow: 'none' }}
                />
                {/* Row with helper text + send button */}
                <div className="d-flex align-items-center justify-content-between" style={{ marginTop: 13 }}>
                  <div className="text-muted" style={{ fontSize: 12 }}>
                    {inviteSearching ? 'Searching…' : 'Select users to invite'}
                  </div>
                  <button
                    className="btn btn-primary"
                    disabled={!selectedGroupId || inviteSelected.length === 0 || inviteSending}
                    onClick={async () => {
                      if (!selectedGroupId || inviteSelected.length === 0) return;
                      try {
                        setInviteSending(true);
                        const res: any = await post(`groups/${selectedGroupId}/invites/direct`, { userIds: inviteSelected });
                        const data = res?.data ?? res;
                        ts('Invites sent');
                        // reset selection
                        setInviteSelected([]);
                        setInviteQuery('');
                        setInviteResults([]);
                      } catch {
                        te('Failed to send invites');
                      } finally { setInviteSending(false); }
                    }}
                  >
                    {inviteSending ? 'Sending…' : `Send invite${inviteSelected.length > 1 ? 's' : ''}`}
                  </button>
                </div>
                {/* Results list */}
                <div style={{ maxHeight: 260, overflowY: 'auto', marginTop: 8, scrollbarWidth: 'none' as any }} className="invite-results-scroll">
                  {inviteResults.map(u => (
                    <div key={u.id} className="d-flex align-items-center gap-2 py-2" style={{ cursor: 'pointer', borderBottom: '1px solid #F3F4F6' }} onClick={() => toggleInviteSelect(u.id)}>
                      <img src={u.picture || '/assets/images/avatar-default.svg'} alt="avatar" style={{ width: 28, height: 28, borderRadius: 14 }} />
                      <div className="flex-grow-1">
                        <div style={{ color: '#111827', fontWeight: 600 }}>{u.displayName}</div>
                        <div className="text-muted" style={{ fontSize: 12 }}>@{u.username}</div>
                      </div>
                      <input type="checkbox" checked={inviteSelected.includes(u.id)} readOnly />
                    </div>
                  ))}
                  {!inviteSearching && inviteQuery.trim() && inviteResults.length === 0 && (
                    <div className="text-muted" style={{ fontSize: 13, padding: '8px 0' }}>No users found.</div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer removed; close handled by header X */}
          </div>
        </div>
      )}
      {/* Image preview lightbox */}
      {previewLightbox.open && previewLightbox.url ? (
        <div onClick={() => setPreviewLightbox({ open: false, url: null, name: null })} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 4000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div onClick={(e) => e.stopPropagation()} style={{ position: 'relative', maxWidth: '95vw', maxHeight: '95vh' }}>
            <img src={previewLightbox.url} alt={previewLightbox.name || 'preview'} style={{ maxWidth: '95vw', maxHeight: '95vh', borderRadius: 12, display: 'block' }} />
            <button aria-label="Close preview" title="Close" onClick={() => setPreviewLightbox({ open: false, url: null, name: null })} style={{ position: 'absolute', top: 12, right: 12, width: 28, height: 28, borderRadius: 8, padding: 0, lineHeight: '26px', fontSize: 18, background: '#FFFFFF', border: '1px solid #E5E7EB', color: '#111827', cursor: 'pointer' }}>×</button>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Groups;

// Lightweight internal composer component
const Composer: React.FC<{
  onSend: (text: string) => Promise<boolean> | boolean;
  disabled?: boolean;
  countdownSeconds?: number;
  resizeSignal?: any;
  onFilesAdded?: (files: File[]) => void;
  selectedFilesCount?: number;
  uploadingCount?: number;
  allowEmptySend?: boolean;
  previews?: React.ReactNode;
}> = ({ onSend, disabled, countdownSeconds, resizeSignal, onFilesAdded, selectedFilesCount = 0, uploadingCount = 0, allowEmptySend = false, previews }) => {
  const [text, setText] = useState('');
  const textRef = useRef<HTMLTextAreaElement | null>(null);
  const igRef = useRef<HTMLDivElement | null>(null);
  const [baseHeight, setBaseHeight] = useState<number>(40);
  const [isMultiline, setIsMultiline] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const send = async () => {
    if (disabled) return;
    const trimmed = (text || '').trim();
    if (!trimmed && !allowEmptySend) return;
    const payload = text;
    // Optimistically clear composer immediately for snappier UX
    setText('');
    resize();
    const ok = await onSend(payload);
    if (!ok) {
      // Restore text if send failed
      setText(payload);
      resize();
    }
  };
  const handleFileClick = () => {
    if (disabled) return;
    fileInputRef.current?.click();
  };
  const handleFilesSelected = (filesList: FileList | null) => {
    if (!filesList || !onFilesAdded) return;
    const incoming = Array.from(filesList);
    if (incoming.length > 0) onFilesAdded(incoming);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };
  const resize = () => {
    const el = textRef.current;
    if (!el) return;
    el.style.height = 'auto';
    const max = 160; // ~6 lines
    const targetContentHeight = Math.max(baseHeight, Math.min(el.scrollHeight, max));
    el.style.height = targetContentHeight + 'px';
    setIsMultiline(targetContentHeight > baseHeight + 1);
    // Sync row height CSS variable so sibling buttons match the textarea exactly
    const ig = igRef.current;
    if (ig) ig.style.setProperty('--composer-row-height', Math.round(el.getBoundingClientRect().height) + 'px');
  };
  const resetToSingleLine = () => {
    const el = textRef.current;
    if (!el) return;
    if ((text || '').trim().length === 0) {
      el.style.height = baseHeight + 'px';
      setIsMultiline(false);
      const ig = igRef.current; if (ig) ig.style.setProperty('--composer-row-height', Math.round(el.getBoundingClientRect().height) + 'px');
    } else {
      resize();
    }
  };
  useEffect(() => { resize(); }, [text]);
  // Reset height to single-line when composer mounts or when the chat frame re-measures
  useEffect(() => {
    const el = textRef.current;
    const ig = igRef.current;
    if (!el || !ig) return;
    // Measure button height to align textarea baseline with controls
    const btn = ig.querySelector('button.btn-primary') as HTMLElement | null;
    const h = Math.round(btn?.getBoundingClientRect().height || 40);
    // Compute textarea content height needed to visually match button height
    const cs = window.getComputedStyle(el);
    const box = cs.boxSizing;
    const paddingTop = parseFloat(cs.paddingTop || '0');
    const paddingBottom = parseFloat(cs.paddingBottom || '0');
    const borderTop = parseFloat(cs.borderTopWidth || '0');
    const borderBottom = parseFloat(cs.borderBottomWidth || '0');
    const outerDelta = box === 'border-box' ? 0 : (paddingTop + paddingBottom + borderTop + borderBottom);
    const contentHeightForButton = Math.max(24, h - outerDelta);
    setBaseHeight(contentHeightForButton);
    el.style.height = contentHeightForButton + 'px';
    setIsMultiline(false);
    // Seed CSS variable for exact sibling button height
    ig.style.setProperty('--composer-row-height', Math.round(el.getBoundingClientRect().height) + 'px');
  }, [resizeSignal]);

  // Ensure correct initial height on mount and after refresh/orientation changes
  useEffect(() => { resetToSingleLine(); /* after first paint */ setTimeout(resetToSingleLine, 0); }, []);
  useEffect(() => { resetToSingleLine(); }, [baseHeight]);
  useEffect(() => {
    const handler = () => resetToSingleLine();
    window.addEventListener('resize', handler);
    window.addEventListener('orientationchange', handler as any);
    document.addEventListener('visibilitychange', handler);
    return () => {
      window.removeEventListener('resize', handler);
      window.removeEventListener('orientationchange', handler as any);
      document.removeEventListener('visibilitychange', handler);
    };
  }, []);

  return (
    <div className="d-flex flex-column" style={{ padding: '12px 16px', borderTop: '1px solid #E5E7EB', background: '#FAFAFA', position: 'sticky', bottom: 0, zIndex: 1, gap: 8 }}>
      {previews || null}
      <div ref={igRef} className="input-group d-flex align-items-end" style={{ width: '100%', alignItems: 'flex-end' }}>
        <input
          ref={fileInputRef}
          type="file"
          accept={ATTACH_ACCEPT_INPUT}
          multiple
          hidden
          onChange={(e) => handleFilesSelected(e.currentTarget.files)}
        />
        <textarea
          ref={textRef}
          className={`form-control composer-textarea ${isMultiline ? 'multiline' : 'one-line'}`}
          placeholder="Send a message"
          value={text}
          rows={1}
          onChange={(e) => setText(e.target.value)}
          onInput={resize}
          onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
          style={{ outline: 'none', boxShadow: 'none', resize: 'none', overflowY: 'auto', boxSizing: 'border-box' }}
          disabled={disabled}
        />
        <button className="btn btn-outline-white" type="button" aria-label="Attach file" title="Attach" disabled={disabled} style={{ height: 40, position: 'relative' }} onClick={handleFileClick}>
          <i className="material-symbols-outlined">attach_file</i>
          {(selectedFilesCount > 0) && (
            <span style={{ position: 'absolute', top: -6, right: -2, background: '#0EA5E9', color: '#fff', fontSize: 11, lineHeight: '14px', height: 16, minWidth: 16, borderRadius: 8, padding: '0 4px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
              {selectedFilesCount}
            </span>
          )}
        </button>
        <button className="btn btn-primary" type="button" onClick={send} disabled={disabled} style={{ height: 40 }}>
          {disabled && (countdownSeconds ?? 0) > 0 ? `Send (${Math.max(0, countdownSeconds || 0)}s)` : 'Send'}
        </button>
      </div>
    </div>
  );
};
