import React from 'react';

type Props = {
  size?: number;            // px
  color?: string;           // stroke color
};

export default function UploadSpinner({ size = 22, color = 'hsl(214, 97%, 59%)' }: Props) {
  const style: React.CSSProperties = {
    width: size,
    height: size,
    display: 'inline-block',
  };
  return (
    <span className="op-uiverse-spinner" style={style} role="status" aria-label="Uploading">
      <svg viewBox="25 25 50 50">
        <circle r="20" cy="50" cx="50" style={{ stroke: color }}></circle>
      </svg>
    </span>
  );
}


