import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { Button, Modal, Form } from 'react-bootstrap'
import { ENUMFORROUTES } from '../../../interfaces/enum'
import { PricePlans } from '../../../components/PricePlans/PricePlans'
import { AppDispatch } from '../../../redux/store'
import { redeemCodeAPI, getSubscriptionStatusAPI } from '../../../redux/Service/User/Settings/settings'
import { te, ts } from '../../../Utility/Toaster'

const ChangePlan: React.FC = () => {
  const navigate = useNavigate()
  const dispatch: AppDispatch = useDispatch()
  const [showRedeem, setShowRedeem] = useState(false)
  const [redeemCode, setRedeemCode] = useState('')
  const [redeemLoading, setRedeemLoading] = useState(false)

  const normalizeCode = (code: string) => code.trim().replace(/[^A-Za-z0-9]/g, '').toUpperCase()

  const formatDisplayCode = (value: string) => {
    return value.replace(/[^A-Za-z0-9-]/g, '').toUpperCase()
  }

  const handleRedeem = async () => {
    const normalized = normalizeCode(redeemCode)
    if (!normalized) {
      te('Please enter a code.')
      return
    }
    try {
      setRedeemLoading(true)
      const data: any = await dispatch<any>(redeemCodeAPI(normalized))
      const url = data?.url
      if (url) {
        window.location.href = url
      } else {
        ts('Code accepted. Activating your subscription...')
        // Poll BE until subscription is active
        let attempts = 0
        const delays = [500, 500, 750, 1000, 1500, 2000, 2500, 3000]
        const check = async (): Promise<void> => {
          try {
            const resp: any = await dispatch<any>(getSubscriptionStatusAPI())
            const payload = resp?.payload || resp
            if (payload && payload.isSubscription === true) {
              try {
                localStorage.setItem('has_subscription', 'true')
                localStorage.removeItem('plan_tier')
              } catch {}
              setShowRedeem(false)
              navigate(ENUMFORROUTES.DASHBOARD)
              return
            }
          } catch {}
          attempts++
          if (attempts < delays.length) {
            setTimeout(check, delays[attempts])
          } else {
            setShowRedeem(false)
            navigate(ENUMFORROUTES.DASHBOARD)
          }
        }
        check()
      }
    } catch (err: any) {
      const msg = err?.message || err?.data?.message || 'Invalid or expired code.'
      te(msg)
    } finally {
      setRedeemLoading(false)
    }
  }

  return (
    <>
      {/* Top Header */}
      <header className="dashboard-header">
        <div className="dashboard-header-inner">
          <div className="dashboard-header-left">
            <button 
              className="back-btn" 
              onClick={() => navigate(-1)}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6" />
              </svg>
              Back
            </button>
            <h1 className="dashboard-page-title">Change Plan</h1>
          </div>
          
          <div className="dashboard-header-right">
            <Button 
              variant="primary" 
              onClick={() => setShowRedeem(true)}
              className="redeem-btn"
            >
              Redeem parent code
            </Button>
          </div>
        </div>
      </header>

      {/* Price Plans Content */}
      <div className="change-plan-content">
        <PricePlans updatePlan={true} />
      </div>

      {/* Redeem Code Modal */}
      <Modal className='modal-theme' show={showRedeem} onHide={() => setShowRedeem(false)} centered>
        <Modal.Header className="pb-2" style={{ borderBottom: '1px solid #e9ecef' }}>
          <h4 className="modal-title mb-0">Redeem a code</h4>
          <button type="button" className="btn-close" onClick={() => setShowRedeem(false)}>
            <i className="material-symbols-outlined">close</i>
          </button>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Enter your parent code</Form.Label>
            <Form.Control
              type="text"
              placeholder="e.g. ABC123"
              value={redeemCode}
              onChange={(e) => setRedeemCode(formatDisplayCode(e.target.value))}
              maxLength={20}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="light" onClick={() => setShowRedeem(false)}>Cancel</Button>
          <Button 
            variant="primary" 
            onClick={handleRedeem} 
            disabled={redeemLoading || !redeemCode.trim()}
          >
            {redeemLoading ? 'Redeeming...' : 'Redeem'}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default ChangePlan
