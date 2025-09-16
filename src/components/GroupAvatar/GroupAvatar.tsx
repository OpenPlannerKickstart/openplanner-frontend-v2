import React from 'react';

type GroupAvatarProps = {
  color: string;
  size?: number;       // total box size in px
  radius?: number;     // border radius in px
  border?: string;     // optional border like '1px solid #E5E7EB'
  iconScale?: number;  // 0..1 fraction of size for icon width
};

const GroupAvatar: React.FC<GroupAvatarProps> = ({
  color,
  size = 40,
  radius = 12,
  border = '1px solid #E5E7EB',
  iconScale = 0.55,
}) => {
  const iconSize = Math.max(12, Math.floor(size * iconScale));
  return (
    <div
      style={{
        width: size,
        height: size,
        background: color,
        borderRadius: radius,
        border,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
      aria-label="Group avatar"
    >
      <img
        src={'/assets/images/book.svg'}
        alt="group"
        style={{ width: iconSize, height: 'auto', display: 'block' }}
      />
    </div>
  );
};

export default GroupAvatar;


