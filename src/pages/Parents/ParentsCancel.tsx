import React, { useEffect } from 'react'
import authLogo from '/assets/images/auth-logo.svg'
import authBGLogo from '/assets/images/registerpayment-failed.svg'
import { Button } from 'react-bootstrap'
import { NavLink, useNavigate } from 'react-router-dom'
import { ENUMFORROUTES } from '../../interfaces/enum'

const ParentsCancel = () => {
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

  const navigate = useNavigate();
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
                <div className="payment-message-box failed-payment">
                  <div className="payment-icon">
                    <Button variant='danger' className='btn-icon btn-light-danger btn-icon-text btn-lg' style={{ pointerEvents: 'none' }}> <i className='material-symbols-outlined fs-4'>cancel</i></Button>
                  </div>
                  <div className="payment-title">
                    <h2>Payment Canceled</h2>
                    <p>No charge was made. You can return to the parents page and try again.</p>
                  </div>
                  <div className="retry-btn w-100">
                    <Button variant="primary" className="btn-text w-100 mx-auto" onClick={() => { navigate(ENUMFORROUTES.PARENTS) }}>Return to Parents</Button>
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

export default ParentsCancel


