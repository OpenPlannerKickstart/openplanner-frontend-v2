import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'

const ParentsCancel = () => {
  useEffect(() => {
    let meta: HTMLMetaElement | null = document.querySelector('meta[name="robots"]');
    const previous = meta?.getAttribute('content') || '';
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'robots');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', 'noindex,nofollow');
    return () => {
      if (meta) {
        if (previous) meta.setAttribute('content', previous);
        else document.head.removeChild(meta);
      }
    }
  }, [])

  return (
    <div className="parents-wrapper">
      <div className="parents-container">
        <div className="parents-header">
          <h1>Payment canceled</h1>
          <p>Your payment was canceled. You can try again at any time.</p>
        </div>
        <div className="parents-body">
          <Link className="btn btn-light" to="/parents">Back to Parents</Link>
        </div>
      </div>
    </div>
  )
}

export default ParentsCancel


