import React, { useState } from 'react'
import { Button, Card, Form } from 'react-bootstrap';
import authLogo from '/assets/images/auth-logo.svg'
import authBGImage from '/assets/images/auth-bg-image.svg'
import authBGImage3 from '/assets/images/auth-bg-image3.svg'
import { NavLink, useNavigate } from 'react-router-dom';

import { connect } from 'react-redux'
import OTPInput from 'react-otp-input';
import { ENUMFORROUTES } from '../../../interfaces/enum';

const ForgotPassword = (props) => {

    const [otp, setOtp] = useState('');
  return (
    <>
        <div className="admin-auth-wrapper admin-auth-side-image">
                <div className={`admin-auth-inner-wrapper`}>
                    <div className="admin-auth-row">
                        <div className="admin-auth-col admin-auth-left">
                            <div className="admin-auth-logo">
                                <img src={authLogo} alt="OpenPlanner" />
                            </div>

                            <div className="auth-image">
                                <img src={authBGImage} alt="OpenPlanner" />
                            </div>
                        </div>
                        <div className="admin-auth-col admin-auth-right">

                            <div className="admin-auth-from">
                                <div className="admin-auth-card-title">
                                    <div className="box-icon box-light-primary wh-70px">
                                        <i className='th th-outline-lock-1'></i>
                                    </div>
                                    <h2 className='mb-0'>Forgot Password</h2>
                                </div>
                                <Card className='admin-auth-card'>
                                    <Card.Body>

                                        <Form.Group className="form-group required">
                                            <Form.Label>Email Address</Form.Label>
                                            <div className="form-group-icon-start">
                                                <i className='th-outline-sms'></i>
                                                <Form.Control type="email" placeholder="Enter Email"/>
                                            </div>                                            
                                        </Form.Group>



                                        <div className="btn-full-group">
                                            <Button variant='primary' className='w-100 mb-3' >Continue</Button>
                                            <p className='d-flex align-items-center justify-content-center gap-2'>Go back to<NavLink className="text-link text-primary justify-content-center fw-600" to={ENUMFORROUTES.LOGIN}>Log In</NavLink></p>
                                        </div>

                                    </Card.Body>
                                </Card>

                            </div>

                        </div>
                    </div>
                </div>
                <div className={`admin-auth-inner-wrapper`}>
                    <div className="admin-auth-row">
                        <div className="admin-auth-col admin-auth-left">
                            <div className="admin-auth-logo">
                                <img src={authLogo} alt="OpenPlanner" />
                            </div>

                            <div className="auth-image">
                                <img src={authBGImage3} alt="OpenPlanner" />
                            </div>
                        </div>
                        <div className="admin-auth-col admin-auth-right">

                            <div className="admin-auth-from">
                                <div className="admin-auth-card-title">
                                    <div className="box-icon box-light-primary wh-70px">
                                        <i className='th th-outline-sms-notification'></i>
                                    </div>
                                    <h2 className=''>Check your Email!</h2>
                                    <p className='text-center mt-4'>We have sent a 4-digit code to your email<br /> <span className='text-warning'>robertdowney@gmail.com</span></p>
                                </div>
                                <Card className='admin-auth-card'>
                                    <Card.Body>
                                        <Form.Group className="form-group mb-0">
                                            <div className="otp-group">
                                                <OTPInput
                                                    value={otp}
                                                    numInputs={4}
                                                    inputType="number"
                                                    onChange={setOtp}
                                                    containerStyle={''}
                                                    shouldAutoFocus={true}
                                                    renderInput={(props) => <input {...props} />}
                                                />
                                            </div>
                                        </Form.Group>
                                        <div className="my-4">

                                            <p className='d-flex align-items-center justify-content-center gap-2'>Did not receive it?
                                            <NavLink className="text-link text-primary justify-content-center fw-600" to={""}>Resend</NavLink>
                                            </p>
                                        </div>


                                        <div className="btn-full-group">
                                            <Button variant='primary' className='w-100 mb-4'>Verify Email</Button>
                                            <p className='d-flex align-items-center justify-content-center gap-2 '>Don’t have an email address<NavLink className="text-link text-primary justify-content-center fw-600" to={""}>Use Another Email</NavLink></p>
                                        </div>

                                    </Card.Body>
                                </Card>

                            </div>

                        </div>
                    </div>
                </div>
            </div>
    </>
  )
}

const mapStateToProps = (state) => ({})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPassword)