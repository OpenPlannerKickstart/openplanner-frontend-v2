import React, { useEffect, useRef, useState } from 'react';
import AddEditSyllabus from '../../../common/AddSyllabusEvents/AddEditSyllabus';
import AddEditGroup from '../../../common/Groups/AddEditGroup';
import { get, post, deleteAPI } from '../../../Utility/httpInterceptor';
import { ts, te } from '../../../Utility/Toaster';
import GroupListItem from '../../..//components/Groups/GroupListItem';
import { useNotifications } from '../../../context/SocketContext';
import { getDecodeIDToken } from '../../../Utility/Helper';
import { v4 as uuidv4 } from 'uuid';

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
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [showGroupInfo, setShowGroupInfo] = useState<boolean>(false);
  const { subscribeToPath, unsubscribeFromPath, sendNotification } = useNotifications();
  // Invite modal state
  const [showInvite, setShowInvite] = useState<boolean>(false);
  const [inviteLink, setInviteLink] = useState<string>('');
  const [inviteLoading, setInviteLoading] = useState<boolean>(false);
  const [inviteExpiresIn, setInviteExpiresIn] = useState<number>(7 * 24 * 3600); // 7 days default
  const [inviteSingleUse, setInviteSingleUse] = useState<boolean>(false);

  // chat timeline state
  const [messages, setMessages] = useState<Record<string, any[]>>({}); // keyed by groupId
  const [nextCursorByGroup, setNextCursorByGroup] = useState<Record<string, string | null>>({});
  const [loadingMessages, setLoadingMessages] = useState<boolean>(false);
  const timelineRef = useRef<HTMLDivElement | null>(null);
  const currentUserSub = React.useMemo(() => {
    try { return getDecodeIDToken()?.sub || null; } catch { return null; }
  }, []);
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
  const [frameRect, setFrameRect] = useState<{ left: number; width: number }>({ left: 0, width: 0 });
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
      if (r) setFrameRect({ left: Math.round(r.left), width: Math.round(r.width) });
    };
    update();
    const ro = new ResizeObserver(() => update());
    ro.observe(document.body);
    window.addEventListener('resize', update);
    return () => { ro.disconnect(); window.removeEventListener('resize', update); };
  }, [isMobile, mobileView]);

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
    if (!content) return false;
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
      content,
      createdAt: new Date().toISOString(),
      clientId,
      optimistic: true,
    };
    setMessages(prev => ({
      ...prev,
      [selectedGroupId]: [ ...(prev[selectedGroupId] ?? []), optimistic ],
    }));
    // scroll to bottom
    requestAnimationFrame(() => { timelineRef.current && (timelineRef.current.scrollTop = timelineRef.current.scrollHeight); });
    try {
      const res: any = await post(`groups/${selectedGroupId}/messages`, { content, clientId }, true, false, false);
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
      setSelectedGroupId(null);
      await fetchMyGroups();
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
      setSelectedGroupId(null);
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
                          onClick={() => setActiveTab('chats')}
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
                      <div className="px-3 pt-3">
                        <h6 className="mb-2" style={{ color: '#111827', fontWeight: 600, letterSpacing: 0.2 }}>My Groups</h6>
                      </div>
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
                              onClick={() => { setSelectedGroupId(g.id); if (isMobile) setMobileView('chat'); }}
                            />
                            ))
                        ) : (
                          <div className="text-center p-4">
                            <h5 className="mt-3 mb-1">You’re not in any groups yet</h5>
                            <p className="text-muted mb-0" style={{ fontSize: 14 }}>
                              When you join or create a group, it will appear here.
                            </p>
                          </div>
                        )}
                        {myGroups && myGroups.length > 0 && searchQuery.trim() &&
                          myGroups.filter((g: any) => g?.name?.toLowerCase().includes(searchQuery.trim().toLowerCase())).length === 0 && (
                            <div className="text-center p-3 text-muted" style={{ fontSize: 14 }}>No groups match “{searchQuery.trim()}”.</div>
                          )}
                      </div>
                      <hr className="my-0" />
                      <div className="px-3 pt-3">
                        <h6 className="mb-2" style={{ color: '#111827', fontWeight: 600, letterSpacing: 0.2 }}>Find groups to join</h6>
                      </div>
                      <div className="text-center p-4">
                        <h5 className="mt-3 mb-1">No suggestions available</h5>
                        <p className="text-muted mb-0" style={{ fontSize: 14 }}>
                          Upload a syllabus to get tailored group suggestions.
                        </p>
                      </div>
                      {/* Suggested groups list will be rendered here when available (filler removed) */}
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
                              let label = d.toLocaleDateString(undefined, { weekday: 'long' });
                              if (isSameDay(d, today)) label = 'Today';
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
                                              <div style={{ background: '#E5F3FF', border: '1px solid #CDE7FF', color: '#0F172A', borderRadius: 12, padding: '10px 12px', minWidth: 40 }}>{m.content}</div>
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
                                            <div style={{ background: '#fff', border: '1px solid #E5E7EB', color: '#111827', borderRadius: 12, padding: '10px 12px', minWidth: 40 }}>{m.content}</div>
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
                        />
                      </div>

                      {/* Mobile Group Info overlay (mirrors desktop panel) */}
                      <div
                        onClick={() => setShowGroupInfo(false)}
                        style={{
                          position: 'absolute', left: 0, right: 0, top: 56, bottom: composerHeight,
                          background: 'rgba(0,0,0,0.06)', zIndex: 2,
                          opacity: showGroupInfo ? 1 : 0,
                          transition: 'opacity 220ms ease',
                          pointerEvents: showGroupInfo ? 'auto' : 'none'
                        }}
                      />
                      <div
                        style={{
                          position: 'absolute', top: 56, right: 0, bottom: composerHeight, width: 340,
                          background: '#fff', borderLeft: '1px solid #E5E7EB', boxShadow: '0 0 24px rgba(0,0,0,0.08)', zIndex: 3,
                          display: 'flex', flexDirection: 'column',
                          transform: showGroupInfo ? 'translateX(0)' : 'translateX(100%)',
                          transition: 'transform 240ms ease',
                          pointerEvents: showGroupInfo ? 'auto' : 'none'
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
                  )}
                </div>
              </div>
            </div>
            {/* Right column (chat area) - hide entirely on mobile to avoid duplicate stacked view */}
            <div className={`col-12 col-lg-8 d-flex flex-column right-pane-scroll ${isMobile ? 'd-none' : ''}`} style={{ minHeight: 0, overflow: 'auto', overflowX: 'hidden', position: 'relative' }}>
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
                      let label = d.toLocaleDateString(undefined, { weekday: 'long' });
                      if (isSameDay(d, today)) label = 'Today';
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
                                      <div style={{ background: '#E5F3FF', border: '1px solid #CDE7FF', color: '#0F172A', borderRadius: 12, padding: '10px 12px', minWidth: 40 }}>{m.content}</div>
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
                                    <div style={{ background: '#fff', border: '1px solid #E5E7EB', color: '#111827', borderRadius: 12, padding: '10px 12px', minWidth: 40 }}>{m.content}</div>
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
                      const typeLabel = selectedGroup?.type === 'canonical' ? 'Class' : 'Group';
                      const count = typeof selectedGroup?.memberCount === 'number' ? selectedGroup?.memberCount : null;
                      const countLabel = count !== null ? `${count} Student${count === 1 ? '' : 's'}` : 'Students';
                      return `${typeLabel} - ${countLabel}`;
                    })()}
                  </div>
                </div>
                {/* Description card with 10% avatar tint */}
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

                {/* Actions: Only show when this is one of myGroups (i.e., joined) */}
                {selectedGroup ? (
                  <>
                    <div style={{ borderTop: '1px solid #E5E7EB' }} />
                    <div style={{ padding: '16px' }}>
                      <div className="d-flex flex-column gap-3">
                        <button
                          type="button"
                          className="btn btn-outline-white text-start"
                          onClick={() => { setInviteLink(''); setInviteLoading(false); setShowInvite(true); }}
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
              <div className="text-muted" style={{ fontSize: 14 }}>This can’t be undone. We’ll wire this to backend next.</div>
            </div>
            <div className="d-flex justify-content-end gap-2" style={{ padding: 16 }}>
              <button className="btn btn-outline-white" onClick={() => setConfirmDelete({ open: false, messageId: null })}>Cancel</button>
              <button className="btn btn-primary" onClick={handleConfirmDelete} disabled={!!confirmDelete.loading}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Invite Members Modal */}
      {showInvite && (
        <div role="dialog" aria-modal="true" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.25)', zIndex: 1050, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setShowInvite(false)}>
          <div className="bg-white" style={{ width: 460, borderRadius: 12, boxShadow: '0 10px 24px rgba(0,0,0,0.15)', border: '1px solid #E5E7EB' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: 16, borderBottom: '1px solid #E5E7EB' }}>
              <h6 className="mb-0" style={{ color: '#111827' }}>Invite to group</h6>
            </div>
            <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label className="form-label" style={{ fontWeight: 600 }}>Expiration (days)</label>
                <input type="number" min={1} max={30} className="form-control" value={Math.round(inviteExpiresIn / 86400)} onChange={(e) => setInviteExpiresIn(Math.min(30, Math.max(1, parseInt(e.target.value || '7', 10))) * 86400)} />
                <div className="text-muted" style={{ fontSize: 12 }}>1–30 days (default 7)</div>
              </div>
              <div className="form-check" style={{ userSelect: 'none' }}>
                <input className="form-check-input" type="checkbox" id="inviteSingleUse" checked={inviteSingleUse} onChange={(e) => setInviteSingleUse(e.target.checked)} />
                <label className="form-check-label" htmlFor="inviteSingleUse">Single-use link</label>
              </div>
              <div className="d-flex gap-2">
                <button className="btn btn-primary" disabled={inviteLoading || !selectedGroupId} onClick={async () => {
                  if (!selectedGroupId) return;
                  try {
                    setInviteLoading(true);
                    const res: any = await post(`groups/${selectedGroupId}/invites`, { expiresIn: inviteExpiresIn, singleUse: inviteSingleUse });
                    const data = res?.data ?? res;
                    setInviteLink(data?.url || '');
                    ts('Invite created');
                  } catch (e: any) {
                    te('Failed to create invite');
                  } finally {
                    setInviteLoading(false);
                  }
                }}>Create link</button>
                {inviteLink && (
                  <button className="btn btn-outline-white" onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(inviteLink);
                      ts('Copied');
                    } catch {
                      te('Copy failed');
                    }
                  }}>Copy</button>
                )}
              </div>
              {inviteLink ? (
                <div className="text-break" style={{ border: '1px solid #E5E7EB', borderRadius: 10, padding: 12, background: '#F9FAFB' }}>{inviteLink}</div>
              ) : (
                <div className="text-muted" style={{ fontSize: 13 }}>Create an invite link to share with others.</div>
              )}
            </div>
            <div className="d-flex justify-content-end" style={{ padding: 16, borderTop: '1px solid #E5E7EB' }}>
              <button className="btn btn-outline-white" onClick={() => setShowInvite(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Groups;

// Lightweight internal composer component
const Composer: React.FC<{ onSend: (text: string) => Promise<boolean> | boolean; disabled?: boolean; countdownSeconds?: number; resizeSignal?: any }> = ({ onSend, disabled, countdownSeconds, resizeSignal }) => {
  const [text, setText] = useState('');
  const textRef = useRef<HTMLTextAreaElement | null>(null);
  const igRef = useRef<HTMLDivElement | null>(null);
  const [baseHeight, setBaseHeight] = useState<number>(40);
  const [isMultiline, setIsMultiline] = useState<boolean>(false);
  const send = async () => { if (!disabled && text.trim()) { const ok = await onSend(text); if (ok) { setText(''); resize(); } } };
  const resize = () => {
    const el = textRef.current;
    if (!el) return;
    el.style.height = 'auto';
    const max = 160; // ~6 lines
    const targetContentHeight = Math.max(baseHeight, Math.min(el.scrollHeight, max));
    el.style.height = targetContentHeight + 'px';
    setIsMultiline(targetContentHeight > baseHeight + 1);
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
  }, [resizeSignal]);

  return (
    <div className="d-flex align-items-end" style={{ padding: '12px 16px', borderTop: '1px solid #E5E7EB', background: '#FAFAFA', position: 'sticky', bottom: 0, zIndex: 1 }}>
      <div ref={igRef} className="input-group" style={{ width: '100%', alignItems: 'flex-end' }}>
        <textarea
          ref={textRef}
          className={`form-control composer-textarea ${isMultiline ? 'multiline' : 'one-line'}`}
          placeholder="Send a message"
          value={text}
          rows={1}
          onChange={(e) => setText(e.target.value)}
          onInput={resize}
          onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
          style={{ outline: 'none', boxShadow: 'none', resize: 'none', overflowY: 'auto' }}
          disabled={disabled}
        />
        <button className="btn btn-outline-white" type="button" aria-label="Attach file" title="Attach" disabled={disabled}>
          <i className="material-symbols-outlined">attach_file</i>
        </button>
        <button className="btn btn-primary" type="button" onClick={send} disabled={disabled}>
          {disabled && (countdownSeconds ?? 0) > 0 ? `Send (${Math.max(0, countdownSeconds || 0)}s)` : 'Send'}
        </button>
      </div>
    </div>
  );
};
