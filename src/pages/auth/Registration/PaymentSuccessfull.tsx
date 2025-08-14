import React from 'react'
import authLogo from '/assets/images/auth-logo.svg'
import authBGLogo from '/assets/images/registerpayment-success.svg'
import { Button } from 'react-bootstrap'
import { NavLink, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch } from '../../../redux/store'
import { isNullUndefinedOrBlank } from '../../../Utility/Helper'
import { ENUMFORROUTES } from '../../../interfaces/enum'
import { loginToSystem } from '../../../redux/Service/auth/login'

export const PaymentSuccessfull = () => {
    // const loginData = useSelector((state: any) => state.SignupReducer.savedLoginData);
    // console.log(loginData, "loginData");
    const dispatch: AppDispatch = useDispatch();
    const navigate = useNavigate();
    const handleGotoLogin = () => {
        navigate(ENUMFORROUTES.LOGIN)
    }

    // const handleGotoDashBord = async () => {
    //     if (!loginData) {
    //         return;
    //     }
    //     const response = await dispatch(loginToSystem(loginData));

    // }
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
                                <div className="payment-message-box succesfull-payment">
                                    <div className="payment-icon">
                                        <Button variant='primary' className='btn-icon btn-light-primary btn-icon-text btn-lg' style={{ pointerEvents: 'none' }}> <i className='material-symbols-outlined fs-4'>check_circle</i></Button>
                                    </div>
                                    <div className="payment-title">
                                        <h2>Registration Successful! 🎉</h2>
                                        <p>Your subscription is now active. Thank you for joining Open Planner!</p>
                                    </div>
                                    <div className="retry-btn w-100">
                                        {/* <Button variant="primary" className="btn-text w-100 mx-auto" onClick={() => { isNullUndefinedOrBlank(loginData) ? handleGotoLogin() : handleGotoDashBord() }}>{isNullUndefinedOrBlank(loginData) ? 'Go To Login' : 'Go to DashBoard'}</Button> */}
                                        <Button variant="primary" className="btn-text w-100 mx-auto" onClick={() => { handleGotoLogin() }}>Go To Login</Button>
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
