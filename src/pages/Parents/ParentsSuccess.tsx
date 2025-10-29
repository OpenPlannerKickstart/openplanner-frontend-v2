import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { parentsGetCodesBySessionAPI, parentsSubscriptionFinalizeAPI, parentsBillingPortalAPI } from '../../redux/Service/User/Settings/settings'
import { te } from '../../Utility/Toaster'
import authLogo from '/assets/images/auth-logo.svg'
import authBGLogo from '/assets/images/registerpayment-success.svg'
import { Button } from 'react-bootstrap'
import { ENUMFORROUTES } from '../../interfaces/enum'

const ParentsSuccess = () => {
  const [params] = useSearchParams();
  const sessionId = params.get('session_id');
  const dispatch = useDispatch();
  const [codes, setCodes] = useState<any[]>([])
  const [copied, setCopied] = useState<Record<string, boolean>>({})
  const [isLoading, setIsLoading] = useState<boolean>(true)
  //const [studentEmails, setStudentEmails] = useState<Record<string, string>>({})
  //const [emailErrors, setEmailErrors] = useState<Record<string, string>>({})
  // Removed per-code email send for now
  const [billingLoading, setBillingLoading] = useState<boolean>(false)
  const [subscriptionId, setSubscriptionId] = useState<string>('')
  const [finalizing, setFinalizing] = useState<boolean>(false)
  const parentEmailFromStorage = React.useMemo(() => {
    try { return localStorage.getItem('parent_email') || '' } catch { return '' }
  }, [])

  const normalizeAndDedupeCodes = React.useCallback((...lists: any[][]) => {
    const toArr = (x: any): any[] => Array.isArray(x) ? x : []
    const list = ([] as any[]).concat(...lists.map(toArr))
    const seen: Record<string, boolean> = {}
    const normalizeKey = (val: any): string => {
      const raw = typeof val === 'string' ? val : (typeof val?.code === 'string' ? val.code : JSON.stringify(val))
      // Normalize to be case-insensitive and ignore dashes/spaces
      return String(raw).toUpperCase().replace(/[^A-Z0-9]/g, '')
    }
    const result: any[] = []
    for (const c of list) {
      const key = normalizeKey(c)
      if (seen[key]) continue
      seen[key] = true
      result.push(c)
    }
    return result
  }, [])

  useEffect(() => {
    // Dev-only mock: preview UI with ?mock=1
    const isMock = params.get('mock');
    if (isMock === '1' || isMock === 'true' || isMock === 'yes') {
      const demo = [
        { id: '1', code: 'OP-ABC1-2345', plan_name: '1 Month', status: 'active', expires_at: new Date(Date.now() + 90*24*3600*1000).toISOString() },
        { id: '2', code: 'OP-DEF6-7890', plan_name: '6 Months', status: 'active', expires_at: new Date(Date.now() + 180*24*3600*1000).toISOString() },
        { id: '3', code: 'OP-GHI1-2345', plan_name: '1 Year', status: 'active', expires_at: new Date(Date.now() + 365*24*3600*1000).toISOString() },
      ];
      setCodes(demo as any);
      setIsLoading(false);
      return;
    }

    if (!sessionId) {
      try {
        const saved = JSON.parse(localStorage.getItem('parents_codes_accum') || '[]')
        const deduped = normalizeAndDedupeCodes(codes, saved)
        setCodes(deduped)
      } catch {}
      setIsLoading(false)
      return;
    }
    let cancelled = false;

            const fetchCodesWithBackoff = async () => {
              const delays = [300, 600, 1200, 2400, 3600, 6000, 8000]; 
      try {
        for (let i = 0; i < delays.length + 1; i++) {
          // try
          const data: any = await dispatch<any>(parentsGetCodesBySessionAPI(sessionId));
          if (cancelled) return;
          if (data?.stripe_subscription_id && !subscriptionId) {
            setSubscriptionId(data.stripe_subscription_id);
          }
          if (Array.isArray(data?.codes) && data.codes.length > 0) {
            try {
              const prev = JSON.parse(localStorage.getItem('parents_codes_accum') || '[]')
              const fresh = data.codes
              const combined = normalizeAndDedupeCodes(codes, prev, fresh)
              setCodes(combined)
              localStorage.setItem('parents_codes_accum', JSON.stringify(combined))
            } catch {
              setCodes(data.codes)
            }
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
  }, [sessionId, dispatch, params, subscriptionId, normalizeAndDedupeCodes, codes])

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
  }, [params])

  const navigate = useNavigate();

  // Per-code copy handled inline; bulk copy intentionally removed

  

  // const handleSendToStudentFor = (id: string) => {
  //   const email = studentEmails[id] || '';
  //   if (!email || !validateEmail(email)) {
  //     setEmailErrors((prev) => ({ ...prev, [id]: 'Please enter a valid email address.' }));
  //     return;
  //   }
  //   setEmailErrors((prev) => ({ ...prev, [id]: '' }));
  //   ts('Code sent to student email');
  //   setStudentEmails((prev) => ({ ...prev, [id]: '' }));
  // };

  const handleManageBilling = async () => {
    try {
      setBillingLoading(true)
      const payload: any = {}
      if (subscriptionId) payload.stripe_subscription_id = subscriptionId
      else if (parentEmailFromStorage) payload.parent_email = parentEmailFromStorage
      else {
        te("Couldn't open billing portal. Please try again.")
        setBillingLoading(false)
        return
      }
      // Ensure Stripe portal back button returns to parents success
      try {
        const base = window.location.origin + '/#'
        payload.return_url = base + ENUMFORROUTES.PARENTS_SUCCESS
      } catch {}
      const data: any = await (dispatch as any)(parentsBillingPortalAPI(payload))
      const url = data?.url
      if (!url) throw new Error('missing portal url')
      window.location.assign(url)
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e)
      te("Couldn't open billing portal. Please try again.")
    } finally {
      setBillingLoading(false)
    }
  }

  // Finalize current (final) session and show codes (no auto-advance here)
  useEffect(() => {
    const runFinalize = async () => {
      if (!sessionId || finalizing) return
      setFinalizing(true)
      try {
        // finalize with retries
        const delays = [300, 600, 1200]
        let finalizeResp: any | null = null
        for (let i = 0; i < delays.length + 1; i++) {
          try {
            finalizeResp = await (dispatch as any)(parentsSubscriptionFinalizeAPI({ session_id: sessionId }))
            break
          } catch (e) {
            if (i === delays.length) throw e
            await new Promise((res) => setTimeout(res, delays[i]))
          }
        }

        if (finalizeResp) {
          if (finalizeResp.stripe_subscription_id && !subscriptionId) setSubscriptionId(finalizeResp.stripe_subscription_id)
          // Merge with previously accumulated codes so we show all groups
          try {
            const prev = JSON.parse(localStorage.getItem('parents_codes_accum') || '[]')
            // Prefer detailed codes (with plan_name/expires_at) from GET if available
            let detailed = [] as any[]
            try {
              const getResp: any = await (dispatch as any)(parentsGetCodesBySessionAPI(sessionId))
              if (Array.isArray(getResp?.codes)) detailed = getResp.codes
            } catch {}
            const thisCodes = detailed.length > 0 ? detailed : (Array.isArray(finalizeResp.codes) ? finalizeResp.codes : [])
            const next = normalizeAndDedupeCodes(codes, prev, thisCodes)
            setCodes(next)
            localStorage.setItem('parents_codes_accum', JSON.stringify(next))
          } catch {
            if (Array.isArray(finalizeResp.codes)) setCodes(finalizeResp.codes)
          }
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('finalize error', e)
      } finally {
        setFinalizing(false)
      }
    }
    runFinalize()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId])

  return (
    <>
      <div className="admin-auth-wrapper admin-auth-side-image">
        <div className="admin-auth-inner-wrapper">
          <div className="admin-auth-row">
            <div className="admin-auth-col admin-auth-left">
              <div className="admin-auth-logo">
                <img src={authLogo} alt="OpenPlanner" />
              </div>

              <div className="auth-image">
                <img src={authBGLogo} alt="OpenPlanner" />
              </div>
              
            </div>
            <div className="admin-auth-col admin-auth-right">
              <div className="subscription-payment-box">
                <div className="payment-message-box succesfull-payment">
                  <div className="payment-icon">
                    <Button variant='primary' className='btn-icon btn-light-primary btn-icon-text btn-lg' style={{ pointerEvents: 'none' }}> <i className='material-symbols-outlined fs-4'>check_circle</i></Button>
                  </div>
                  <div className="payment-title">
                    <h2>Payment Successful! 🎉</h2>
                    <p>Your redemption codes are below and have been sent to your email.</p>
                  </div>

                  {/* Codes area */}
                  {isLoading && (
                    <p className="text-center text-success mb-0">Preparing your codes…</p>
                  )}
                  {!isLoading && codes.length === 0 && (
                    <p className="text-center text-danger mb-0">No codes found yet. Please check your email or try again in a moment.</p>
                  )}
                  {!isLoading && codes.length > 0 && (
                    <div className="mt-3">
                      <ul className="list-group">
                        {codes.map((c: any) => {
                          const key = String(c?.id || c?.code || Math.random())
                          const isCopied = !!copied[key]
                          const handleCopy = async () => {
                            const text = String(c?.code || '')
                            const legacyCopy = () => {
                              try {
                                const ta = document.createElement('textarea')
                                ta.value = text
                                ta.style.position = 'fixed'
                                ta.style.opacity = '0'
                                document.body.appendChild(ta)
                                ta.focus(); ta.select()
                                const ok = document.execCommand('copy')
                                document.body.removeChild(ta)
                                return ok
                              } catch {
                                return false
                              }
                            }
                            try {
                              if (navigator?.clipboard && window.isSecureContext) {
                                await navigator.clipboard.writeText(text)
                              } else {
                                legacyCopy()
                              }
                              setCopied((prev) => ({ ...prev, [key]: true }))
                              setTimeout(() => setCopied((prev) => ({ ...prev, [key]: false })), 1500)
                            } catch {
                              legacyCopy()
                              setCopied((prev) => ({ ...prev, [key]: true }))
                              setTimeout(() => setCopied((prev) => ({ ...prev, [key]: false })), 1500)
                            }
                          }
                          return (
                            <li key={key} className="list-group-item border-0">
                              <div className="d-flex flex-column align-items-center gap-1">
                                <div className="fw-semibold">{c.plan_name || 'Plan'}</div>
                                <div className="input-group" style={{ maxWidth: 520 }}>
                                  <span className="input-group-text"><i className="material-symbols-outlined">key</i></span>
                                  <input type="text" className="form-control" readOnly value={String(c.code || '')} />
                                  <button className={`btn ${isCopied ? 'btn-success' : 'btn-primary'}`} onClick={handleCopy} type="button">
                                    {isCopied ? 'Copied' : 'Copy'}
                                  </button>
                                </div>
                                {c.expires_at && (
                                  <div className="text-muted small">Expires: {new Date(c.expires_at).toLocaleDateString()}</div>
                                )}
                              </div>
                            </li>
                          )
                        })}
                      </ul>
                    </div>
                  )}

                  <div className="retry-btn w-100 mt-3">
                    <div className="d-grid gap-2">
                      <Button variant="secondary" className="btn-text w-100 mx-auto btn-manage-billing" disabled={billingLoading} onClick={handleManageBilling}>
                        {billingLoading ? 'Opening…' : 'Manage billing'}
                      </Button>
                      <Button variant="primary" className="btn-text w-100 mx-auto" onClick={() => { navigate(ENUMFORROUTES.PARENTS) }}>Back to Parents</Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ParentsSuccess


