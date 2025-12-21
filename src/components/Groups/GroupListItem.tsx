import React from 'react';
import GroupAvatar from '../GroupAvatar/GroupAvatar';

type Privacy = 'public' | 'invite_only';
type Variant = 'mine' | 'suggested';

type Props = {
  id: string;
  name: string;
  avatarColor?: string | null;
  variant: Variant;
  memberCount?: number;
  privacy?: Privacy;
  lastMessage?: any;
  lastActivityAt?: string | Date | null;
  unreadCount?: number;
  isSelected?: boolean;
  onClick?: () => void;
  onActionClick?: () => void;
};

const GroupListItem: React.FC<Props> = ({
  name,
  avatarColor,
  variant,
  memberCount,
  privacy,
  lastMessage,
  lastActivityAt,
  unreadCount = 0,
  isSelected,
  onClick,
  onActionClick,
}) => {
  const getRelativeTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    if (diffMins < 1) return 'now';
    if (diffMins < 60) return `${diffMins}m`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return date.toLocaleDateString(undefined, { weekday: 'short' });
    return date.toLocaleDateString(undefined, { month: '2-digit', day: '2-digit' });
  };

  const getMessagePreview = () => {
    const m = lastMessage;
    if (!m) return '';
    if (Array.isArray(m.attachments) && m.attachments.length > 0) {
      const c = m.attachments.length;
      return `${c} Attachment${c > 1 ? 's' : ''}`;
    }
    return m.content || m.message || m.text || '';
  };

  const getMessageTime = () => {
    const m = lastMessage;
    const raw =
      m?.createdAt ||
      m?.created_at ||
      m?.created_on ||
      m?.created ||
      lastActivityAt ||
      null;
    if (!raw) return '';
    const d = raw instanceof Date ? raw : new Date(raw);
    if (Number.isNaN(d.getTime())) return '';
    return getRelativeTime(d);
  };

  const preview = getMessagePreview();
  const timeStr = getMessageTime();

  return (
    <div>
      <div
        className={`d-flex align-items-center justify-content-between px-3 py-3`}
        style={{ cursor: onClick ? 'pointer' : 'default', background: isSelected ? '#FFF8EA' : 'transparent', position: 'relative', overflow: 'hidden' }}
        onClick={onClick}
      >
        <div className="d-flex align-items-center gap-3 flex-grow-1" style={{ minWidth: 0 }}>
          <GroupAvatar color={avatarColor || '#E5F3FF'} size={56} />
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ fontWeight: 600, color: '#111827', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {name}
            </div>
            {variant === 'suggested' ? (
              <div className="text-muted" style={{ fontSize: 14 }}>
                {typeof memberCount === 'number' ? `${memberCount} Students` : ''}
              </div>
            ) : (
              <div
                className="text-muted"
                style={{
                  fontSize: 14,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth: '100%',
                }}
              >
                {preview || 'No messages yet'}
              </div>
            )}
          </div>
        </div>

        {variant === 'mine' ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'flex-start', gap: 4, flexShrink: 0, minWidth: 44, alignSelf: 'flex-start', paddingTop: 4 }}>
            {timeStr && <div style={{ fontSize: 12, color: '#6B7280', lineHeight: 1, marginTop: 2 }}>{timeStr}</div>}
            {unreadCount > 0 && (
              <div style={{ minWidth: 20, height: 20, padding: '0 6px', borderRadius: 10, background: '#0EA5E9', color: '#fff', fontSize: 11, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {unreadCount > 99 ? '99+' : unreadCount}
              </div>
            )}
          </div>
        ) : null}

        {variant === 'suggested' ? (
          <button
            type="button"
            className={`btn ${privacy === 'public' ? 'btn-outline-white' : 'btn-outline-white'}`}
            onClick={(e) => {
              e.stopPropagation();
              onActionClick && onActionClick();
            }}
            style={{ minWidth: 96 }}
          >
            {privacy === 'public' ? 'Public' : 'Private'}
          </button>
        ) : null}
      </div>
      <hr className="my-0" />
    </div>
  );
};

export default GroupListItem;


