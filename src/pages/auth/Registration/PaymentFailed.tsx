import React from 'react'
import authLogo from '/assets/images/auth-logo.svg'
import authBGLogo from '/assets/images/registerpayment-failed.svg'
import { Button } from 'react-bootstrap'
import { NavLink } from 'react-router-dom'

export const PaymentFailed = () => {
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
                        <div className="terms-condition-wrapper">
                            <p>
                                By creating an account, you agree to our{" "}
                                <NavLink
                                className="text-link text-primary justify-content-center fw-600" target='_blank'
                                to={"https://open-planner.com/terms-and-conditions/"}
                                >
                                Terms and Conditions
                                </NavLink>
                                and
                                <NavLink
                                className="text-link text-primary justify-content-center fw-600"
                                to={""}
                                >
                                Services Agreement.
                                </NavLink>
                            </p>
                        </div>
                    </div>
                    <div className="admin-auth-col admin-auth-right">
                        <div className="subscription-payment-box">                            
                            <div className="payment-message-box failed-payment">
                                <div className="payment-icon">
                                    <Button variant='danger' className='btn-icon btn-light-danger btn-icon-text btn-lg' style={{ pointerEvents: 'none' }}> <i className='material-symbols-outlined fs-4'>cancel</i></Button>
                                </div>
                                <div className="payment-title">
                                    <h2>Payment Failed 😕</h2>
                                    <p>Something went wrong while processing your payment. Please try again.</p>
                                </div>
                                <div className="retry-btn w-100">
                                    <Button variant="primary" className="btn-text w-100 mx-auto">Retry Payment</Button>
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
