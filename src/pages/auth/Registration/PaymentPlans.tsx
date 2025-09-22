import React, { useState } from 'react'
import authLogo from '/assets/images/auth-logo.svg'
import { PricePlans } from '../../../components/PricePlans/PricePlans'
import { Button, Form, Modal } from 'react-bootstrap'
import { useLocation } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../../redux/store'
import { redeemCodeAPI } from '../../../redux/Service/User/Settings/settings'
import { te, ts } from '../../../Utility/Toaster'

export const PaymentPlans = () => {
  const dispatch: AppDispatch = useDispatch();
  const { state } = useLocation();
  const [showRedeem, setShowRedeem] = useState(false);
  const [redeemCode, setRedeemCode] = useState('');
  const [redeemLoading, setRedeemLoading] = useState(false);

  const normalizeCode = (code: string) => code.trim().replace(/[^A-Za-z0-9]/g, '').toUpperCase();

  const formatDisplayCode = (value: string) => {
    const raw = value.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
    const part1 = raw.slice(0, 2);
    const part2 = raw.slice(2, 6);
    const part3 = raw.slice(6);
    let out = part1;
    if (raw.length > 2) out += `-${part2}`;
    if (raw.length > 6 && part3) out += `-${part3}`;
    return out;
  };

  const handleRedeem = async () => {
    const normalized = normalizeCode(redeemCode);
    if (!normalized) {
      te('Please enter a code.');
      return;
    }
    try {
      setRedeemLoading(true);
      const data: any = await dispatch<any>(redeemCodeAPI(normalized));
      const url = data?.url;
      if (url) {
        window.location.href = url;
      } else {
        ts('Code accepted');
        setShowRedeem(false);
        setRedeemCode('');
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
    try {
      await navigator.clipboard.writeText(url);
      ts('Parents payment link copied');
    } catch (e) {
      te('Unable to copy link');
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
                    <p>Start with a 7-day free trial. Upgrade anytime for full access to all features.</p>
                  </div>
                  <div className="d-flex justify-content-center align-items-center gap-3 mb-3">
                    <Button variant="link" className="p-0" onClick={() => setShowRedeem(true)}>Have a code? Redeem it</Button>
                  </div>
                  <PricePlans state={state} />
                  <div className="d-flex justify-content-center align-items-center mt-3">
                    <Button variant="link" className="p-0" onClick={handleCopyParentsLink}>Copy parents link</Button>
                  </div>
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
              placeholder="e.g. OP-XXXX-YYYY"
              value={redeemCode}
              onChange={(e) => setRedeemCode(formatDisplayCode(e.target.value))}
            />
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
