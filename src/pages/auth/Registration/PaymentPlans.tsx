import React from 'react'
import authLogo from '/assets/images/auth-logo.svg'
import { PricePlans } from '../../../components/PricePlans/PricePlans'
import { useAccordionButton } from 'react-bootstrap'
import { useLocation } from 'react-router-dom'

export const PaymentPlans = () => {

  const { state } = useLocation();
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
                    <p>Start with a 7-day free trial on our 6 month or 1 year plans. Upgrade anytime for full access to all features.</p>
                  </div>
                  <PricePlans state={state} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>

  )
}
