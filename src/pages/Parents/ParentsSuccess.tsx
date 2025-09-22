import React, { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { parentsGetCodesBySessionAPI } from '../../redux/Service/User/Settings/settings'
import { te } from '../../Utility/Toaster'

const ParentsSuccess = () => {
  const [params] = useSearchParams();
  const sessionId = params.get('session_id');
  const dispatch = useDispatch();
  const [codes, setCodes] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    if (!sessionId) return;
    let cancelled = false;

    const fetchCodesWithBackoff = async () => {
      const delays = [300, 600, 1200, 2400, 3600];
      try {
        for (let i = 0; i < delays.length + 1; i++) {
          // try
          const data: any = await dispatch<any>(parentsGetCodesBySessionAPI(sessionId));
          if (cancelled) return;
          if (Array.isArray(data?.codes) && data.codes.length > 0) {
            setCodes(data.codes);
            break;
          }
          if (i === delays.length) break; // stop
          await new Promise((res) => setTimeout(res, delays[i]));
        }
      } catch (err: any) {
        if (!cancelled) {
          const msg = err?.response?.data?.message || 'Unable to load codes.'
          te(msg)
        }
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    fetchCodesWithBackoff();
    return () => { cancelled = true }
  }, [sessionId, dispatch])

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
          {isLoading && <p className="text-muted">Preparing your codes…</p>}
          {!isLoading && codes.length === 0 && (
            <p className="text-muted">No codes found yet. If this persists, please refresh or check your email.</p>
          )}
          {!isLoading && codes.length > 0 && (
            <div className="mt-2">
              <ul className="list-unstyled">
                {codes.map((c) => (
                  <li key={c.id} className="d-flex align-items-center justify-content-between border rounded p-2 mb-2">
                    <div>
                      <div className="fw-semibold">{c.code}</div>
                      <div className="text-muted" style={{ fontSize: 12 }}>{c.plan_name} • {c.status}</div>
                    </div>
                    <button className="btn btn-sm btn-light" onClick={() => navigator.clipboard.writeText(c.code)}>Copy</button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="mt-3">
            <Link className="btn btn-primary" to="/parents">Back to Parents</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ParentsSuccess


