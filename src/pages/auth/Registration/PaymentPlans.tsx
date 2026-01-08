import React, { useState, useEffect } from 'react'
import authLogo from '/assets/images/auth-logo.svg'
import sidebarLogoLg from '../../../assets/images/sidebar-logo-lg.svg'
import { PricePlans } from '../../../components/PricePlans/PricePlans'
import { Button, Form, Modal } from 'react-bootstrap'
import { useLocation, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../../redux/store'
import { redeemCodeAPI, getSubscriptionStatusAPI } from '../../../redux/Service/User/Settings/settings'
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
  const [isDarkMode, setIsDarkMode] = useState(() => 
    document.documentElement.getAttribute('data-theme') === 'dark'
  );

  // Listen for theme changes
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDarkMode(document.documentElement.getAttribute('data-theme') === 'dark');
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  // Use blue and white logo in dark mode
  const brandLogo = isDarkMode ? sidebarLogoLg : authLogo;

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
        ts('Code accepted. Activating your subscription...');
        // Poll BE until subscription is active before entering the app
        let attempts = 0;
        const delays = [500, 500, 750, 1000, 1500, 2000, 2500, 3000];
        const check = async (): Promise<void> => {
          try {
            const resp: any = await dispatch<any>(getSubscriptionStatusAPI());
            const payload = resp?.payload || resp;
            if (payload && payload.isSubscription === true) {
              try {
                localStorage.setItem('has_subscription', 'true');
                localStorage.removeItem('plan_tier');
              } catch {}
              setShowRedeem(false);
              setRedeemCode('');
              navigate(ENUMFORROUTES.DASHBOARD);
              return;
            }
          } catch {
            // ignore and retry
          }
          if (attempts < delays.length) {
            const d = delays[attempts++];
            setTimeout(check, d);
          } else {
            // Fallback: keep user on plans, but mark as subscribed to avoid loop
            try {
              localStorage.setItem('has_subscription', 'true');
              localStorage.removeItem('plan_tier');
            } catch {}
            navigate(ENUMFORROUTES.DASHBOARD);
          }
        };
        check();
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

  // const handleCopyParentsLink = async () => {
  //   const url = `${window.location.origin}/#/parents`;
  //   const legacyCopy = () => {
  //     try {
  //       const ta = document.createElement('textarea');
  //       ta.value = url;
  //       ta.style.position = 'fixed';
  //       ta.style.opacity = '0';
  //       document.body.appendChild(ta);
  //       ta.focus();
  //       ta.select();
  //       const ok = document.execCommand('copy');
  //       document.body.removeChild(ta);
  //       return ok;
  //     } catch {
  //       return false;
  //     }
  //   };
  //   try {
  //     if (navigator?.clipboard && window.isSecureContext) {
  //       await navigator.clipboard.writeText(url);
  //       ts('Parents payment link copied');
  //     } else {
  //       const ok = legacyCopy();
  //       ok ? ts('Parents payment link copied') : te(`Unable to copy. Link: ${url}`);
  //     }
  //   } catch {
  //     const ok = legacyCopy();
  //     ok ? ts('Parents payment link copied') : te(`Unable to copy. Link: ${url}`);
  //   }
  // };
  return (
    <>
      <div className="plans-page">
        <div className="plans-shell">
          <div className="plans-hero">
            <div className="plans-hero__brand">
              <img src={brandLogo} alt="OpenPlanner" className="plans-hero__logo" />
            </div>
            <div className="plans-actions">
              <Button variant="outline-primary" onClick={() => setShowRedeem(true)}>
                Redeem parent code
              </Button>
            </div>
          </div>

          <div className="plans-grid">
            <PricePlans state={state} />
          </div>
        </div>
      </div>
      <Modal className='modal-theme' show={showRedeem} onHide={() => setShowRedeem(false)} centered>
        <Modal.Header className="pb-2" style={{ borderBottom: '1px solid #e9ecef' }}>
          <h4 className="modal-title mb-0">Redeem a code</h4>
          <button type="button" className="btn-close" onClick={() => setShowRedeem(false)}>
            <i className="material-symbols-outlined">close</i>
          </button>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="form-group mt-2">
            <Form.Label>Enter your redemption code</Form.Label>
              <Form.Control
              type="text"
              placeholder="e.g. C5AB2379D25C"
              value={redeemCode}
              onChange={(e) => setRedeemCode(formatDisplayCode(e.target.value))}
            />
            <div className="form-text">After you redeem, activating your subscription can take a few seconds. Please stay on this screen—we’ll update automatically once it’s ready.</div>
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
