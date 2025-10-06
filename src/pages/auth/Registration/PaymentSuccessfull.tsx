import React from 'react'
import authLogo from '/assets/images/auth-logo.svg'
import authBGLogo from '/assets/images/registerpayment-success.svg'
import { Button } from 'react-bootstrap'
import { NavLink, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../../redux/store'
import { ENUMFORROUTES } from '../../../interfaces/enum'
import { getSubscriptionStatusAPI } from '../../../redux/Service/User/Settings/settings'
import { getToken } from '../../../Utility/Helper'

export const PaymentSuccessfull = () => {
    const dispatch: AppDispatch = useDispatch();
    const navigate = useNavigate();

    const isLoggedIn = React.useMemo(() => !!getToken(), []);

    const handleGotoLogin = () => {
        navigate(ENUMFORROUTES.LOGIN)
    }

    // After checkout success, for students we poll subscription status and then enter the app
    React.useEffect(() => {
        let cancelled = false;
        const run = async () => {
            const delays = [500, 500, 750, 1000, 1500, 2000, 2500, 3000];
            for (let i = 0; i <= delays.length; i++) {
                try {
                    const resp: any = await (dispatch as any)(getSubscriptionStatusAPI());
                    const payload = resp?.payload || resp;
                    if (payload && payload.isSubscription === true) {
                        try { localStorage.setItem('has_subscription', 'true'); } catch {}
                        if (!cancelled) navigate(ENUMFORROUTES.DASHBOARD, { replace: true });
                        return;
                    }
                } catch {
                    // ignore and retry
                }
                if (i < delays.length) {
                    await new Promise((res) => setTimeout(res, delays[i]));
                }
            }
        };
        if (isLoggedIn) {
            run();
        }
        return () => { cancelled = true };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch, navigate, isLoggedIn])

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
                                        to={"https://open-planner.com/privacy-policy/"}
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
