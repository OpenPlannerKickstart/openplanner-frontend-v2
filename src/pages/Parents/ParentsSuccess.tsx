import React, { useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'

const ParentsSuccess = () => {
  const [params] = useSearchParams();
  const sessionId = params.get('session_id');

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
          <h1>Payment successful</h1>
          <p>Your redemption codes will be shown below and sent via email.</p>
        </div>
        <div className="parents-body">
          <p>Session: {sessionId || '-'}</p>
          <div className="mt-3">
            <Link className="btn btn-primary" to="/parents">Back to Parents</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ParentsSuccess


