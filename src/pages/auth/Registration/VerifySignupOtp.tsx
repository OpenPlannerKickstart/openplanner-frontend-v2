import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { Button, Form } from 'react-bootstrap';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Card } from 'react-bootstrap';
import authLogo from "/assets/images/auth-logo.svg";
import authTextBG from "/assets/images/signup-bg.svg";

import authBGImage from "/assets/images/auth-bg-image.svg";
import authBGImage3 from "/assets/images/auth-bg-image3.svg";

import { FormikTouched, FormikValues, setNestedObjectValues, useFormik } from 'formik';
import * as yup from 'yup';
import { CODE_IS_REQUIRED, PLEASE_ENTER_OTP } from '../../../Utility/Validation_Message';
import { sendSignupEmailOtp, verifySignupEmailOtp } from '../../../redux/Service/auth/signup';
import { AppDispatch } from '../../../redux/store';
import { renderError } from '../../../Utility/Helper';
import OTPInput from 'react-otp-input';
import { ENUMFORROUTES } from '../../../interfaces/enum';
import { setLoading } from '../../../redux/Loader/LoaderSlice';
import { te } from '../../../Utility/Toaster';
const VerifySignupOtp = (props) => {
    const { otpDetailsObj } = props;
    const dispatch: AppDispatch = useDispatch();
    const { state } = useLocation();
    const navigate = useNavigate();
    const navigateToRelatedScreen = (route: any, val?: any) => {
        if (val) {
            navigate(route, { state: val })
        }
        else {
            navigate(route);
        }

    }

    const [otpData, setOtpData] = useState("");
    const [errorMessage, setErrorMessage] = useState("")
    const handleOtpInput = (otp) => {
        setOtpData(otp);

    };
    const handleverifyCodeSubmit = async () => {

        if (otpData?.length !== 6) {
            setErrorMessage(PLEASE_ENTER_OTP)
            return;
        }

        const reqBody = {
            username: `${otpDetailsObj?.detailsObj?.username}`,
            code: otpData.toString()
        }
        const verifyResponse = await dispatch(verifySignupEmailOtp(reqBody));
        if (verifyResponse) {
            setErrorMessage("")
            console.log(verifyResponse, "otp")
            // if (otpDetailsObj?.isFromLogin) {

            dispatch(setLoading(true));
            // setTimeout(() => {
            //     props?.handleLoginData();
            //     dispatch(setLoading(false));
            // }, 2000);
            //Redeem code on pricing page do not work, if auth token is not set.
            navigate(ENUMFORROUTES.LOGIN)
            //navigate(ENUMFORROUTES.PLAN_DETAILS, { state: verifyResponse?.payload })
            return;
            // }
            // } else {
            //     navigate(ENUMFORROUTES.LOGIN)
            // }

        }
    }


    /* ------------------------- handle Resend Otp Start ------------------------ */
    const [timer, setTimer] = useState(60);
    const [canResend, setCanResend] = useState(false);

    useEffect(() => {
        let countdown;
        if (timer > 0) {
            countdown = setTimeout(() => setTimer(timer - 1), 1000);
        } else {
            setCanResend(true);
        }

        return () => clearTimeout(countdown);
    }, [timer]);

    const handleResendOtp = async () => {
        const sendEmailOtpReqBody = {
            username: `${otpDetailsObj?.detailsObj?.username}`
        }
        const sendEmailOtpResponse = await dispatch(sendSignupEmailOtp(sendEmailOtpReqBody));
        if (sendEmailOtpResponse) {
            setOtpData("");
            setTimer(60);
            setCanResend(false);
        }
    }
    /* ------------------------- handle Resend Otp End ------------------------ */


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
                                <img src={authBGImage3} alt="OpenPlanner" />
                            </div>
                            <div className="terms-condition-wrapper">
                                <p >
                                    By creating an account, you agree to our{" "}
                                    {/* <span
                                        className="text-link text-primary fw-600"

                                    >
                                        Terms and Conditions
                                    </span> */}
                                    <NavLink
                                        className="text-link text-primary justify-content-center fw-600" target="_blank"
                                        to={"https://open-planner.com/terms-and-conditions/"}
                                    >
                                        Terms and Conditions
                                    </NavLink>
                                    and
                                    <NavLink
                                        className="text-link text-primary justify-content-center fw-600" target="_blank"
                                        to={"https://open-planner.com/privacy-policy/"}
                                    >
                                        Services Agreement.
                                    </NavLink>
                                </p>
                            </div>
                        </div>
                        <div className="admin-auth-col admin-auth-right">
                            <div className="admin-auth-from">
                                {
                                    otpDetailsObj?.isFromLogin ?
                                        <>
                                            <div className="admin-auth-card-title">
                                                <div className="box-icon box-light-primary wh-70px">
                                                    <i className="material-symbols-outlined">mark_email_unread</i>
                                                </div>
                                                <h2 className="">Email Verification pending</h2>
                                                <p className="text-center mt-4">
                                                    We have sent a 6-digit code to your email for verification
                                                    <br />
                                                    <span className="text-warning">{otpDetailsObj?.isFromLogin ? otpDetailsObj?.detailsObj?.identifier : otpDetailsObj?.detailsObj?.email || ""}</span>
                                                </p>
                                            </div>
                                        </> :

                                        <div className="admin-auth-card-title">
                                            <div className="box-icon box-light-primary wh-70px">
                                                <i className="material-symbols-outlined">mark_email_unread</i>
                                            </div>
                                            <h2 className="">Check your Email!</h2>
                                            <p className="text-center mt-4">
                                                We have sent a 6-digit code to your email
                                                <br />
                                                <span className="text-warning">{otpDetailsObj?.isFromLogin ? otpDetailsObj?.detailsObj?.identifier : otpDetailsObj?.detailsObj?.email || ""}</span>
                                            </p>
                                        </div>
                                }
                                <Card className="admin-auth-card">
                                    <Card.Body>
                                        <Form.Group className="form-group mb-0">
                                            <div className="otp-group">

                                                <OTPInput
                                                    value={otpData}
                                                    numInputs={6}
                                                    inputType="text"

                                                    onChange={handleOtpInput}
                                                    containerStyle={""}
                                                    shouldAutoFocus={true}
                                                    placeholder={"-"}
                                                    renderInput={(props) => <input {...props} />}
                                                />
                                            </div>
                                        </Form.Group>
                                        <div className='text-center'>

                                            {
                                                errorMessage ? renderError(errorMessage) : <></>
                                            }
                                        </div>
                                        {canResend ? (

                                            <p className="text-center mt-4">Did not receive it? <span className="text-primary fw-600 cursor-pointer" onClick={() => { handleResendOtp(); }}>Resend Code</span></p>
                                        ) : (
                                            <p className="mt-4 text-gray-600 text-center ">You can resend code in <span className="text-primary fw-600">{timer}</span> seconds.</p>
                                        )}
                                        <div className="btn-full-group">
                                            <Button variant="primary" className="w-100 mb-4" onClick={() => { handleverifyCodeSubmit() }}>
                                                Verify Email
                                            </Button>
                                        </div>
                                        {/* <div className="auth-bottom-text-link">
                                            <p>
                                                Don’t have an email address
                                                <button className='btn btn-link'
                                                onClick={()=>{props.setOtpDetailsObj({} as any)}}
                                                >
                                                    Use Another Email
                                                </button>
                                            </p>
                                        </div> */}
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
export default VerifySignupOtp;