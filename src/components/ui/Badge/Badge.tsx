import React from 'react';
import './Badge.scss';

export type BadgeColor =
  | 'orange' | 'yellow' | 'green' | 'teal' | 'gold'
  | 'blue' | 'lime' | 'cyan' | 'red' | 'purple'
  | 'pink' | 'gray' | 'stone' | 'indigo';

export interface BadgeProps {
  color: BadgeColor;
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
  showDot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  color,
  children,
  active = false,
  onClick,
  showDot = true,
}) => {
  const classNames = [
    'course-pill',
    color,
    active ? 'active' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classNames} onClick={onClick}>
      {showDot && <span className="pill-dot" />}
      <span>{children}</span>
    </div>
  );
};

export default Badge;
