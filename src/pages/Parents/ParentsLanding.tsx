import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const ParentsLanding = () => {
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
          <h1>OpenPlanner for Parents</h1>
          <p>Buy subscriptions for your students without creating an account.</p>
        </div>

        <div className="parents-body">
          <p>Plan selection UI will appear here.</p>
        </div>
      </div>
    </div>
  )
}

export default ParentsLanding


