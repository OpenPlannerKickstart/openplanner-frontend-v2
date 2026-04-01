import React from 'react'

interface WorthBadgeProps {
  worthPercent: number | null;
  method: 'exact' | 'estimated' | 'insufficient_data';
}

const WorthBadge: React.FC<WorthBadgeProps> = ({ worthPercent, method }) => {
  if (method === 'insufficient_data' || worthPercent === null) return null

  const prefix = method === 'estimated' ? '~' : ''
  const displayValue = worthPercent % 1 === 0 ? worthPercent.toFixed(0) : worthPercent.toFixed(1)

  return (
    <span className={`worth-badge ${method === 'estimated' ? 'estimated' : ''}`}>
      {prefix}{displayValue}%
    </span>
  )
}

export default WorthBadge
