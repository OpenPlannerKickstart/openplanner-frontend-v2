import React from 'react';
import bookIcon from '../../assets/images/book.svg';

type GroupAvatarProps = {
  color: string;
  size?: number;       // total box size in px
  radius?: number;     // border radius in px (defaults to full circle)
  border?: string;     // optional border
  iconScale?: number;  // 0..1 fraction of size for icon width
};

const GroupAvatar: React.FC<GroupAvatarProps> = ({
  color,
  size = 40,
  radius,
  border = 'none',
  iconScale = 0.55,
}) => {
  const iconSize = Math.max(12, Math.floor(size * iconScale));
  const computedRadius = typeof radius === 'number' ? radius : Math.floor(size / 2);
  return (
    <div
      style={{
        width: size,
        height: size,
        background: color,
        borderRadius: computedRadius,
        border,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
      aria-label="Group avatar"
    >
      <img
        src={bookIcon}
        alt="group"
        style={{ width: iconSize, height: 'auto', display: 'block' }}
      />
    </div>
  );
};

export default GroupAvatar;


