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
import { CODE_IS_REQUIRED } from '../../../Utility/Validation_Message';
import { sendSignupEmailOtp, verifySignupEmailOtp } from '../../../redux/Service/auth/signup';
import { AppDispatch } from '../../../redux/store';
import { renderError } from '../../../Utility/Helper';
import OTPInput from 'react-otp-input';
import { ENUMFORROUTES } from '../../../interfaces/enum';
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
    const handleOtpInput = (otp) => {
        setOtpData(otp);

    };
    const handleverifyCodeSubmit = async () => {

        if(otpData?.length !==6){
            return ;
        }

        const reqBody = {
            email: otpDetailsObj?.isFromLogin? `${otpDetailsObj?.detailsObj?.email}`:`${otpDetailsObj?.detailsObj?.first_name}_${otpDetailsObj?.detailsObj?.last_name}`,
            code: otpData.toString()
        }
        const verifyResponse = await dispatch(verifySignupEmailOtp(reqBody));
        if (verifyResponse) {
            if (otpDetailsObj?.isFromLogin) {
                props?.handleLoginData();
            } else {
                navigate(ENUMFORROUTES.LOGIN)
            }

        }
    }

   
    /* ------------------------- handle Resend Otp Start ------------------------ */

    const handleResendOtp = async() => {
        const sendEmailOtpReqBody = {
            email:  otpDetailsObj?.isFromLogin? `${otpDetailsObj?.detailsObj?.email}`:`${otpDetailsObj?.detailsObj?.first_name}_${otpDetailsObj?.detailsObj?.last_name}`
        }
        const sendEmailOtpResponse = await dispatch(sendSignupEmailOtp(sendEmailOtpReqBody));
        if (sendEmailOtpResponse) {
            setOtpData("");

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
                                    <NavLink
                                        className="text-link text-primary fw-600"
                                        to={""}
                                    >
                                        Terms and Conditions
                                    </NavLink>
                                    and
                                    <NavLink
                                        className="text-link text-primary fw-600"
                                        to={""}
                                    >
                                        Services Agreement.
                                    </NavLink>
                                </p>
                            </div>
                        </div>
                        <div className="admin-auth-col admin-auth-right">
                            <div className="admin-auth-from">
                                <div className="admin-auth-card-title">
                                    <div className="box-icon box-light-primary wh-70px">
                                        <i className="material-symbols-outlined">mark_email_unread</i>
                                    </div>
                                    <h2 className="">Check your Email!</h2>
                                    <p className="text-center mt-4">
                                        We have sent a 6-digit code to your email
                                        <br />
                                        <span className="text-warning">{otpDetailsObj?.detailsObj?.email || ""}</span>
                                    </p>
                                </div>
                                <Card className="admin-auth-card">
                                    <Card.Body>
                                        <Form.Group className="form-group mb-0">
                                            <div className="otp-group">

                                                <OTPInput
                                                    value={otpData}
                                                    numInputs={6}
                                                    inputType="number"
                                                    onChange={handleOtpInput}
                                                    containerStyle={""}
                                                    shouldAutoFocus={true}
                                                    placeholder={"-"}
                                                    renderInput={(props) => <input {...props} />}
                                                />
                                            </div>
                                        </Form.Group>
                                        <div className="auth-top-text-link otp-resend-text">
                                            <p>
                                                Did not receive it?
                                                <button className='btn btn-link'
                                                    onClick={() => { handleResendOtp();}}
                                                >
                                                    Resend
                                                </button>
                                            </p>
                                        </div>

                                        <div className="btn-full-group">
                                            <Button variant="primary" className="w-100 mb-4" onClick={() => { handleverifyCodeSubmit() }}>
                                                Verify Email
                                            </Button>
                                        </div>
                                        <div className="auth-bottom-text-link">
                                            <p>
                                                Don’t have an email address
                                                <button className='btn btn-link'
                                                onClick={()=>{props.setOtpDetailsObj({} as any)}}
                                                >
                                                    Use Another Email
                                                </button>
                                            </p>
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
export default VerifySignupOtp;