import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useSearchParams } from 'react-router-dom'
import { AppDispatch } from '../../redux/store'
import { parentsBillingPortalAPI } from '../../redux/Service/User/Settings/settings'
import { te } from '../../Utility/Toaster'
import { ENUMFORROUTES } from '../../interfaces/enum'

const ParentsManageBilling = () => {
  const [params] = useSearchParams()
  const sub = params.get('sub') || ''
  const dispatch: AppDispatch = useDispatch()

  useEffect(() => {
    let cancelled = false
    const run = async () => {
      try {
        if (!sub) {
          te('Missing subscription id')
          window.location.replace('/#' + ENUMFORROUTES.PARENTS_SUCCESS)
          return
        }
        const payload: any = { stripe_subscription_id: sub }
        // Ensure return_url brings them back to parents success
        try {
          const base = window.location.origin + '/#'
          payload.return_url = base + ENUMFORROUTES.PARENTS_SUCCESS
        } catch {}
        const data: any = await (dispatch as any)(parentsBillingPortalAPI(payload))
        const url = data?.url
        if (!cancelled) {
          if (url) window.location.assign(url)
          else {
            te('Unable to open billing portal')
            window.location.replace('/#' + ENUMFORROUTES.PARENTS_SUCCESS)
          }
        }
      } catch (err: any) {
        const code = err?.response?.data?.code
        if (code === 'PARENT_MANAGED_SUBSCRIPTION') te('This subscription is managed by a parent.')
        else if (err?.response?.status === 404) te('No active Stripe subscription found.')
        else te('Unable to open billing portal.')
        window.location.replace('/#' + ENUMFORROUTES.PARENTS_SUCCESS)
      }
    }
    run()
    return () => { cancelled = true }
  }, [dispatch, sub])

  return (
    <div style={{ padding: 24, textAlign: 'center' }}>Opening billing portal…</div>
  )
}

export default ParentsManageBilling


