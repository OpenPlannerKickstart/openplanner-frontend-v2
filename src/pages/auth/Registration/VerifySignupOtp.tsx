import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { Button, Form } from 'react-bootstrap';
import { NavLink, useLocation } from 'react-router-dom';
import { Card } from 'react-bootstrap';
import authLogo from "/assets/images/auth-logo.svg";
import authTextBG from "/assets/images/signup-bg.svg";

import authBGImage from "/assets/images/auth-bg-image.svg";
import authBGImage3 from "/assets/images/auth-bg-image3.svg";

import { FormikTouched, FormikValues, setNestedObjectValues, useFormik } from 'formik';
import * as yup from 'yup';
import { CODE_IS_REQUIRED } from '../../../Utility/Validation_Message';
import { verifySignupEmailOtp } from '../../../redux/Service/auth/signup';
import { AppDispatch } from '../../../redux/store';
import { renderError } from '../../../Utility/Helper';
import OTPInput from 'react-otp-input';
const VerifySignupOtp = () => {
    const dispatch: AppDispatch = useDispatch();
    const { state } = useLocation();
    useEffect(() => {
        console.log(state, "state");

        return () => {

        }
    }, [state])

    const [otpData, setOtpData] = useState("");
    const handleOtpInput = (otp) => {
        setOtpData(otp);

    };
    const handleverifyCodeSubmit = async () => {


        const reqBody = {
            email: state?.email,
            code: otpData.toString()
        }
        const verifyResponse = await dispatch(verifySignupEmailOtp(reqBody));
        if (verifyResponse) {
            console.log(verifyResponse, "verify response");
        }
    }


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
                                        <i className="th th-outline-sms-notification"></i>
                                    </div>
                                    <h2 className="">Check your Email!</h2>
                                    <p className="text-center mt-4">
                                        We have sent a 4-digit code to your email
                                        <br />
                                        <span className="text-warning">robertdowney@gmail.com</span>
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
                                                <NavLink to={""}
                                                >
                                                    Resend
                                                </NavLink>
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
                                                <NavLink to={""}
                                                >
                                                    Use Another Email
                                                </NavLink>
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