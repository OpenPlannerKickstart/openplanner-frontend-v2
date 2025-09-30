import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useSearchParams } from 'react-router-dom'
import { AppDispatch } from '../../redux/store'
import { parentsCreateSessionAPI, parentsSubscriptionFinalizeAPI } from '../../redux/Service/User/Settings/settings'

const ParentsContinue = () => {
  const [params] = useSearchParams();
  const dispatch: AppDispatch = useDispatch();
  const sessionId = params.get('session_id');

  useEffect(() => {
    let cancelled = false
    const run = async () => {
      try {
        if (sessionId) {
          try {
            await dispatch<any>(parentsSubscriptionFinalizeAPI({ session_id: sessionId }))
          } catch {}
        }
        let idx = 0
        let queue: any[] = []
        try {
          idx = parseInt(localStorage.getItem('parents_checkout_idx') || '0', 10)
          queue = JSON.parse(localStorage.getItem('parents_checkout_queue') || '[]')
        } catch {}
        const nextIdx = idx + 1
        if (!cancelled && Array.isArray(queue) && nextIdx < queue.length) {
          try { localStorage.setItem('parents_checkout_idx', String(nextIdx)) } catch {}
          const payload = queue[nextIdx]
          const start = await dispatch<any>(parentsCreateSessionAPI(payload))
          if (start?.url) window.location.href = start.url
          else window.location.href = '/#'+(localStorage.getItem('parents_final_success') || '/parents/success')
        } else if (!cancelled) {
          // finished all groups
          const finalUrl = '/#'+(localStorage.getItem('parents_final_success') || '/parents/success')
          window.location.href = finalUrl
        }
      } catch {
        const finalUrl = '/#'+(localStorage.getItem('parents_final_success') || '/parents/success')
        window.location.href = finalUrl
      }
    }
    run()
    return () => { cancelled = true }
  }, [dispatch, sessionId])

  return (
    <div style={{ padding: 24, textAlign: 'center' }}>Continuing checkout…</div>
  )
}

export default ParentsContinue


