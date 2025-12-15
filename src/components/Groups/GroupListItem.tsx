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
  isSelected,
  onClick,
  onActionClick,
}) => {
  return (
    <div>
      <div
        className={`d-flex align-items-center justify-content-between px-3 py-3`}
        style={{ cursor: onClick ? 'pointer' : 'default', background: isSelected ? '#FFF8EA' : 'transparent', position: 'relative', overflow: 'hidden' }}
        onClick={onClick}
      >
        <div className="d-flex align-items-center gap-3 flex-grow-1" style={{ minWidth: 0 }}>
          <GroupAvatar color={avatarColor || '#E5F3FF'} size={56} />
          <div>
            <div style={{ fontWeight: 600, color: '#111827' }}>{name}</div>
            {variant === 'suggested' ? (
              <div className="text-muted" style={{ fontSize: 14 }}>
                {typeof memberCount === 'number' ? `${memberCount} Students` : ''}
              </div>
            ) : null}
          </div>
        </div>

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


