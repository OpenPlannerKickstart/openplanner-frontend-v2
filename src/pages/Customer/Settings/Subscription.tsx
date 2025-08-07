import React from 'react'
import { Button, Card, Table  } from 'react-bootstrap'
import { PricePlans } from '../../../components/PricePlans/PricePlans'

export const Subscription = () => {
  return (
    // subscription main dashboard
    <div className='subscription-main-container'>
        <div className='subscription-box subscription-dash '>
            <Card>
                <Card.Body>
                    <div className="setting-main-title">
                        <h2>Subscription</h2>
                    </div>
                    <div className="subscrip-dash-wrapper">
                        <div className="plan-container">
                            <div className="plan-item">
                                <p className="plan-label">Plan Tenure</p>
                                <p className="plan-value bold">6 month plan</p>
                            </div>
                            <div className="plan-item">
                                <p className="plan-label">Payment Amount</p>
                                <p className="plan-value bold">$14.99 <span className="muted">/ month</span></p>
                            </div>
                            <div className="plan-item">
                                <p className="plan-label">Next invoice issue date</p>
                                <p className="plan-value bold">Jul 4, 2024</p>
                            </div>
                            <div className="plan-item">
                                <p className="plan-label">Total Billing</p>
                                <p className="plan-value bold">$14.99</p>
                            </div>
                        </div>
                    </div>
                    <div className="button-group">
                        <Button variant="primary" className="btn-icon-text" >
                            <i className="material-symbols-outlined">refresh</i> Change Plan
                        </Button>
                        <Button variant="danger" className="btn-icon-text" >
                            <i className="material-symbols-outlined">close</i> Cancel Subscription
                        </Button>
                    </div>
                </Card.Body>
            </Card>
        </div>    
        <div className='subscription-box subscription-billing '>
            <Card>
                <Card.Body>
                    <div className="setting-main-title">
                        <h2>Billing Details</h2>
                    </div>
                    <div className="table-responsive">
                         <Table className="table-theme">
                            <thead className="border-less">
                                <tr>
                                <th>Plan Description</th>
                                <th>Month</th>
                                <th>Payment Date</th>
                                <th>Payment Method</th>
                                <th>Status</th>
                                <th>Plan Price</th>
                                <th className="text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>6 month plan</td>
                                    <td>Jun 2024</td>
                                    <td>06/27/2024</td>
                                    <td>Credit Card</td>
                                    <td>Paid</td>
                                    <td>
                                        <span className="link-info tbl-price text-decoration-underline text-link cursor-pointer">$99.00</span>
                                    </td>
                                    <td className="tbl-action">
                                        <button className="btn btn-xs btn-icon-text btn-transparent text-danger">
                                         <i className="material-symbols-outlined">visibility</i>
                                        </button>
                                    </td>
                                </tr>
                                <tr>
                                    <td>6 month plan</td>
                                    <td>Jun 2024</td>
                                    <td>06/27/2024</td>
                                    <td>Credit Card</td>
                                    <td>Paid</td>
                                    <td>
                                        <span className="link-info tbl-price text-decoration-underline text-link cursor-pointer">$99.00</span>
                                    </td>
                                    <td className="tbl-action">
                                        <button className="btn btn-xs btn-icon-text btn-transparent text-danger">
                                         <i className="material-symbols-outlined">visibility</i>
                                        </button>
                                    </td>
                                </tr>
                                <tr>
                                    <td>6 month plan</td>
                                    <td>Jun 2024</td>
                                    <td>06/27/2024</td>
                                    <td>Credit Card</td>
                                    <td>Paid</td>
                                    <td>
                                        <span className="link-info tbl-price text-decoration-underline text-link cursor-pointer">$99.00</span>
                                    </td>
                                    <td className="tbl-action">
                                        <button className="btn btn-xs btn-icon-text btn-transparent text-danger">
                                         <i className="material-symbols-outlined">visibility</i>
                                        </button>
                                    </td>
                                </tr>
                            </tbody>    
                        </Table>
                    </div>   
                </Card.Body>
            </Card>
        </div>    
        <div className="subscription-box subscription-plans d-none">
            <Card>
                <Card.Body>
                    <div className="setting-main-title align-items-center d-flex gap-3 setting-main-title">
                         <Button variant='white' className='btn-icon btn-light-white btn-icon-text btn-md'><i className="material-symbols-outlined fs-4">arrow_left_alt</i></Button>
                         <h2 className="mb-0">Choose Your Plan</h2>
                    </div>
                    <PricePlans />
                </Card.Body>
            </Card>
        </div>
        <div className="subscription-payment-box d-none">
            <div className="payment-wrapper-container">
                <div className="payment-message-box succesfull-payment">
                    <div className="payment-icon">
                           <Button variant='primary' className='btn-icon btn-light-primary btn-icon-text btn-lg' style={{ pointerEvents: 'none' }}> <i className='material-symbols-outlined fs-4'>check_circle</i></Button>
                    </div>
                    <div className="payment-title">
                        <h2>Payment Successful! 🎉</h2>
                        <p>Your subscription is now active. Thank you for joining Open Planner!</p>
                    </div>
                </div>
                <div className="payment-message-box failed-payment d-none">
                    <div className="payment-icon">
                           <Button variant='danger' className='btn-icon btn-light-danger btn-icon-text btn-lg' style={{ pointerEvents: 'none' }}> <i className='material-symbols-outlined fs-4'>cancel</i></Button>
                    </div>
                    <div className="payment-title">
                        <h2>Payment Failed 😕</h2>
                        <p>Something went wrong while processing your payment. Please try again.</p>
                    </div>
                    <div className="retry-btn">
                        <Button variant="primary" className="btn-text">Retry Payment</Button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}
