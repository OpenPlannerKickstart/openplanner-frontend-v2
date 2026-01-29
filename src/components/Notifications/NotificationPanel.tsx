import React, { useEffect, useMemo, useState } from 'react';
import { useNotifications, useMarkNotificationRead, useClearNotification } from '../../hooks/queries/useNotifications';
import type { NotificationData } from '../../api/notifications';
import { useNotificationPanel } from './NotificationPanelContext';
import { formatedDate, isEmptyObjectOrNullUndefiend } from '../../Utility/Helper';
import { get, post } from '../../Utility/httpInterceptor';
import { useNavigate } from 'react-router-dom';

/**
 * Determine notification type from backend field or fallback to message parsing.
 * Uses the new `type` field from backend when available, otherwise parses keywords.
 */
const getNotificationType = (item: NotificationData): string => {
  // Prefer the new structured type field from backend
  if (item.type) {
    return item.type; // 'event' | 'task'
  }
  
  // Fallback: parse keywords from message for older notifications
  const lowerMsg = (item.message || '').toLowerCase();
  
  if (lowerMsg.includes('task')) return 'task';
  if (lowerMsg.includes('assignment') || lowerMsg.includes('homework') || lowerMsg.includes('quiz')) return 'reminder';
  if (lowerMsg.includes('due') && !lowerMsg.includes('event:')) return 'reminder';
  if (lowerMsg.includes('event:') || lowerMsg.includes('class') || lowerMsg.includes('lecture') || lowerMsg.includes('exam')) return 'event';
  if (lowerMsg.includes('course') || lowerMsg.includes('syllabus') || lowerMsg.includes('material')) return 'course';
  if (lowerMsg.includes('scheduled')) return 'event';
  
  return 'alert';
};

/**
 * Generate notification title from backend field or derive from type/message.
 * Uses the new `entity_name` field when available for a better display title.
 */
const getNotificationTitle = (type: string, item?: NotificationData | null): string => {
  // If we have entity_name from backend, use it directly
  if (item?.entity_name) {
    return item.entity_name;
  }
  
  // Fallback: generate title based on type and message content
  const lowerMsg = (item?.message || '').toLowerCase();
  const isUpcoming = lowerMsg.includes('tomorrow') || lowerMsg.includes('starting soon') || lowerMsg.includes('due');
  const isNew = lowerMsg.includes('added') || lowerMsg.includes('created') || lowerMsg.includes('new');
  
  switch (type) {
    case 'task':
      if (isUpcoming) return 'Task Due Soon';
      return 'Task Reminder';
    case 'reminder':
      if (lowerMsg.includes('tomorrow')) return 'Due Tomorrow';
      if (isUpcoming) return 'Upcoming Deadline';
      return 'Assignment Reminder';
    case 'event':
      if (lowerMsg.includes('exam')) return 'Exam Reminder';
      if (lowerMsg.includes('class')) return 'Class Reminder';
      if (isNew) return 'New Event';
      if (isUpcoming) return 'Upcoming Event';
      return 'Event Scheduled';
    case 'course':
      return 'Course Update';
    case 'invite':
      return 'Group Invite';
    case 'alert':
    default:
      if (isNew) return 'New Activity';
      return 'Notification';
  }
};

/**
 * Format the entity date for display.
 * Uses entity_date from backend when available.
 */
const formatEntityDate = (item: NotificationData): string | null => {
  if (item.entity_date) {
    return formatedDate(item.entity_date, 'MMM DD [at] hh:mm a');
  }
  return null;
};

const Icon: React.FC<{ type: string }> = ({ type }) => {
  switch (type) {
    case 'invite':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      );
    case 'task':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 11l3 3L22 4" />
          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
        </svg>
      );
    case 'reminder':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      );
    case 'course':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          <line x1="8" y1="7" x2="16" y2="7" />
          <line x1="8" y1="11" x2="14" y2="11" />
        </svg>
      );
    case 'event':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      );
    default:
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      );
  }
};

const NotificationPanel: React.FC = () => {
  const { isOpen, close, refresh } = useNotificationPanel();
  const navigate = useNavigate();

  // React Query hooks
  const { data: notificationList = [], isLoading: isLoadingNotifications } = useNotifications();
  const markReadMutation = useMarkNotificationRead();
  const clearMutation = useClearNotification();

  type InviteItem = { id: string; groupId: string; fromUserId?: string; fromUsername?: string; groupName?: string; fromName?: string; message?: string; createdAt?: any; read?: boolean };
  const [invites, setInvites] = useState<Array<InviteItem>>([]);
  const [isLoadingInvites, setIsLoadingInvites] = useState<boolean>(false);
  
  // Combined loading state
  const loading = isLoadingNotifications || isLoadingInvites;

  const getInviteReadSet = () => { try { return new Set<string>(JSON.parse(localStorage.getItem('op_invite_read') || '[]')); } catch { return new Set<string>(); } };
  const setInviteReadSet = (s: Set<string>) => { try { localStorage.setItem('op_invite_read', JSON.stringify(Array.from(s))); } catch {} };

  const fetchInvites = async () => {
    try {
      const res: any = await get('invites');
      const data = res?.data ?? res;
      const list: any[] = data?.invites ?? [];
      const readSet = getInviteReadSet();
      const enriched = await Promise.all(list.map(async (inv) => {
        let groupName = inv?.groupName;
        if (!groupName && inv?.groupId) {
          try {
            const gres: any = await get(`groups/${inv.groupId}`);
            const g = gres?.data ?? gres;
            if (g?.name) groupName = g.name;
          } catch {}
        }
        return {
          ...inv,
          groupName,
          fromName: inv?.from?.displayName || inv?.fromUsername || inv?.from?.username,
          read: readSet.has(inv.id),
        } as InviteItem;
      }));
      setInvites(enriched);
    } catch {
      setInvites([]);
    }
  };

  const hasAny = useMemo(() => {
    const anyNotifs = Array.isArray(notificationList) && notificationList.length > 0;
    const anyInvites = Array.isArray(invites) && invites.length > 0;
    return anyNotifs || anyInvites;
  }, [notificationList, invites]);

  const handleClearAll = () => {
    const allId = (notificationList || []).map((val) => val.id);
    if (allId.length === 0) return;
    clearMutation.mutate({ id: allId });
  };

  const handleRead = (id: any) => {
    markReadMutation.mutate({ id: [id], is_read: true });
  };

  const handleDismiss = (id: any) => {
    if (!id) return;
    clearMutation.mutate({ id: [id] });
  };

  useEffect(() => {
    if (!isOpen) return;
    let cancelled = false;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('keydown', onKeyDown);
    
    // Load invites when panel opens (notifications are loaded by React Query automatically)
    (async () => {
      try {
        setIsLoadingInvites(true);
        await fetchInvites();
        refresh();
      } finally {
        if (!cancelled) setIsLoadingInvites(false);
      }
    })();
    
    return () => {
      cancelled = true;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen, close, refresh]);

  return (
    <>
      <div
        className={`notification-panel-backdrop ${isOpen ? 'active' : ''}`}
        onClick={close}
      />

      <div className={`notification-panel ${isOpen ? 'active' : ''}`}>
        <div className="notification-panel-header">
          <h3 className="notification-panel-title">Notifications</h3>
          <div className="notification-panel-actions">
            {hasAny && (
              <button className="clear-all-btn" onClick={handleClearAll}>
                Clear All
              </button>
            )}
            <button className="close-panel-btn" onClick={close} aria-label="Close">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="notification-panel-body">
          {/* Single loader (body only). While loading, hide the empty state. */}
          {loading && !hasAny ? (
            <div className="d-flex align-items-center justify-content-center" style={{ padding: '56px 0' }}>
              <div className="notification-round-spinner" aria-label="Loading" />
            </div>
          ) : null}
          {/* Group invites (type: invite) */}
          {invites && invites.length > 0 && invites.map((it) => {
            const created = (it as any).createdAt || (it as any).created_at || Date.now();
            const title = getNotificationTitle('invite');
            const unread = !it.read;
            const msg = `${(it.fromUsername || it.fromName || 'Someone')} invited you to join ${it.groupName || 'a group'}`;
            return (
              <div key={it.id} className={`notification-item ${unread ? 'unread' : ''}`}>
                <div className="notification-icon invite">
                  <Icon type="invite" />
                </div>
                <div className="notification-content">
                  <div className="notification-title">{title}</div>
                  <p className="notification-message">{msg}</p>
                  <div className="notification-meta-row">
                    <span className="notification-time">{formatedDate(created, `MMM DD, [at] hh:mm a`)}</span>
                    <div className="notification-actions">
                      <button
                        className="btn-accept"
                        onClick={async () => {
                          try {
                            const res: any = await post(`invites/${it.id}/accept`, {});
                            const data = res?.data ?? res;
                            refresh();
                            close();
                            if (data?.groupId) navigate(`/groups/${data.groupId}?tab=groups`);
                            else navigate(`/groups?tab=groups`);
                          } catch {}
                        }}
                        type="button"
                      >
                        Join
                      </button>
                      <button
                        className="btn-decline"
                        onClick={async () => {
                          try {
                            await post(`invites/${it.id}/decline`, {});
                            fetchInvites();
                            refresh();
                          } catch {}
                        }}
                        type="button"
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                </div>
                <button
                  className="notification-dismiss"
                  type="button"
                  aria-label="Dismiss invite"
                  onClick={() => {
                    const r = getInviteReadSet();
                    r.add(it.id);
                    setInviteReadSet(r);
                    setInvites(prev => prev.map(x => x.id === it.id ? { ...x, read: true } : x));
                    refresh();
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
            );
          })}

          {!isEmptyObjectOrNullUndefiend(notificationList) && notificationList.map((item) => {
            const notifType = getNotificationType(item);
            const title = getNotificationTitle(notifType, item);
            const entityDate = formatEntityDate(item);
            const created = item?.created_at || (item as any)?.createdAt || Date.now();
            const unread = item?.is_read === false;
            const msg = String(item?.message ?? '');
            
            // Use syllabus info if available for additional context
            const syllabusInfo = item.syllabus_name ? ` • ${item.syllabus_name}` : '';
            
            return (
              <div
                key={String(item?.id ?? created)}
                className={`notification-item ${unread ? 'unread' : ''}`}
                onClick={() => { if (unread) handleRead(item.id); }}
                role="button"
                tabIndex={0}
              >
                <div className={`notification-icon ${notifType}`}>
                  <Icon type={notifType} />
                </div>
                <div className="notification-content">
                  <div className="notification-title">{title}</div>
                  <p className="notification-message">{msg}</p>
                  <div className="notification-meta">
                    {entityDate && (
                      <span className="notification-entity-date">{entityDate}</span>
                    )}
                    <span className="notification-time">
                      {formatedDate(created, `MMM DD, [at] hh:mm a`)}{syllabusInfo}
                    </span>
                  </div>
                </div>

                {/* Dismiss (X) - matches invite behavior/hover */}
                <button
                  className="notification-dismiss"
                  type="button"
                  aria-label="Dismiss notification"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleDismiss(item.id);
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
            );
          })}

          {!loading && (!notificationList || notificationList.length === 0) && (!invites || invites.length === 0) && (
            <div className="empty-notifications">
              <div className="empty-notifications-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
              </div>
              <h4>No notifications yet</h4>
              <p>You're all caught up.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default NotificationPanel;


