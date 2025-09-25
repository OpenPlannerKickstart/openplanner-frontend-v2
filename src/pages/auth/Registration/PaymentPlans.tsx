import React, { useState } from 'react'
import authLogo from '/assets/images/auth-logo.svg'
import { PricePlans } from '../../../components/PricePlans/PricePlans'
import { Button, Form, Modal } from 'react-bootstrap'
import { useLocation, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../../redux/store'
import { redeemCodeAPI } from '../../../redux/Service/User/Settings/settings'
import { te, ts } from '../../../Utility/Toaster'
import { getToken } from '../../../Utility/Helper'
import { ENUMFORROUTES } from '../../../interfaces/enum'

export const PaymentPlans = () => {
  const dispatch: AppDispatch = useDispatch();
  const { state } = useLocation();
  const navigate = useNavigate();
  const [showRedeem, setShowRedeem] = useState(false);
  const [redeemCode, setRedeemCode] = useState('');
  const [redeemLoading, setRedeemLoading] = useState(false);

  const normalizeCode = (code: string) => code.trim().replace(/[^A-Za-z0-9]/g, '').toUpperCase();

  // Render exactly what the user types (alphanumeric + optional dashes), uppercased.
  const formatDisplayCode = (value: string) => {
    return value.replace(/[^A-Za-z0-9-]/g, '').toUpperCase();
  };

  const handleRedeem = async () => {
    const normalized = normalizeCode(redeemCode);
    if (!normalized) {
      te('Please enter a code.');
      return;
    }
    // Require student login for redeem
    const accessToken = getToken();
    if (!accessToken) {
      te('Please log in to redeem a code.');
      navigate(ENUMFORROUTES.LOGIN);
      return;
    }
    try {
      setRedeemLoading(true);
      const data: any = await dispatch<any>(redeemCodeAPI(normalized));
      const url = data?.url;
      if (url) {
        window.location.href = url;
      } else {
        try { localStorage.setItem('has_subscription', 'true'); } catch {}
        ts('Code accepted');
        setShowRedeem(false);
        setRedeemCode('');
        navigate(ENUMFORROUTES.DASHBOARD);
      }
    } catch (err: any) {
      const payload = err?.response?.data || {};
      const code = payload?.code;
      const message = payload?.message || 'Unable to redeem code.';
      if (code === 'IN_PROGRESS') {
        ts('Checkout in progress. Please wait and try again.');
      } else {
        te(message);
      }
    } finally {
      setRedeemLoading(false);
    }
  };

  const handleCopyParentsLink = async () => {
    const url = `${window.location.origin}/#/parents`;
    const legacyCopy = () => {
      try {
        const ta = document.createElement('textarea');
        ta.value = url;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        const ok = document.execCommand('copy');
        document.body.removeChild(ta);
        return ok;
      } catch {
        return false;
      }
    };
    try {
      if (navigator?.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(url);
        ts('Parents payment link copied');
      } else {
        const ok = legacyCopy();
        ok ? ts('Parents payment link copied') : te(`Unable to copy. Link: ${url}`);
      }
    } catch {
      const ok = legacyCopy();
      ok ? ts('Parents payment link copied') : te(`Unable to copy. Link: ${url}`);
    }
  };
  return (

    <>
      <div className='payment-plans-container'>
        <div className="admin-auth-wrapper admin-auth-side-image">
          <div className="admin-auth-inner-wrapper">
            <div className="admin-auth-row">
              <div className="admin-auth-col admin-auth-left">
                <div className="admin-auth-logo">
                  <img src={authLogo} alt="OpenPlanner" />
                </div>

                <div className="subscription-box subscription-plans auth-plans">
                  <div className="plans-header">
                    <h2>Choose Your Plan</h2>
                    <p>Start with a 7-day FREE trial!</p>
                  </div>
                  <div className="d-flex justify-content-center align-items-center gap-3 mb-3">
                    <Button variant="link" className="p-0" onClick={() => setShowRedeem(true)}>Have a code? Redeem it</Button>
                  </div>
                  <PricePlans state={state} />
                  {/* 
                  Removed for now
                  <div className="d-flex justify-content-center align-items-center mt-3">
                    <Button variant="link" className="p-0" onClick={handleCopyParentsLink}>Copy payment link for parents</Button>
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal className='modal-theme' show={showRedeem} onHide={() => setShowRedeem(false)} centered>
        <Modal.Header>
          <h4 className="modal-title">Redeem a code</h4>
          <button type="button" className="btn-close" onClick={() => setShowRedeem(false)}>
            <i className="material-symbols-outlined">close</i>
          </button>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="form-group">
            <Form.Label>Enter your redemption code</Form.Label>
            <Form.Control
              type="text"
              placeholder="e.g. C5AB2379D25C or OP-XXXX-YYYY"
              value={redeemCode}
              onChange={(e) => setRedeemCode(formatDisplayCode(e.target.value))}
            />
            <div className="form-text">Codes can include letters and numbers, with or without dashes. We’ll handle formatting for you.</div>
          </Form.Group>
          <div className="d-flex justify-content-end gap-2 mt-3">
            <Button variant="light" onClick={() => setShowRedeem(false)} disabled={redeemLoading}>Cancel</Button>
            <Button variant="primary" onClick={handleRedeem} disabled={redeemLoading}>{redeemLoading ? 'Checking…' : 'Redeem'}</Button>
          </div>
        </Modal.Body>
      </Modal>
    </>

  )
}
