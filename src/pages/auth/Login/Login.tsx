import React, { useEffect, useState } from "react";
import { Button, Card, Form } from "react-bootstrap";
import authLogo from '/assets/images/auth-logo.svg'
import authBGLogo from '/assets/images/auth-bg-logo.svg'
import bgShapeOne from '/assets/images/bg-shape-one.png'
import bgShapeTwo from '/assets/images/bg-shape-two.png'

import { connect, useDispatch } from "react-redux";
import { AppDispatch } from "../../../redux/store";
import { loginToSystem } from "../../../redux/Service/auth/login";
import { customJsonInclude, isEmptyObjectOrNullUndefiend, renderError, setCookieByName } from "../../../Utility/Helper";


import { NavLink } from "react-router-dom";
import { ENUMFORROUTES } from "../../../interfaces/enum";
import { LoginData } from "../../../interfaces";
import { MAX_50, PASSWORD_INVALID, PATTERN_EMAIL, PATTERN_FOR_PASSWORD_NEW } from "../../../Utility/Validation_Helper";
import { EMAIL_INVALID, EMAIL_REQUIRED, PASSWORD_REQUIRED } from "../../../Utility/Validation_Message";
import { FormikTouched, FormikValues, setNestedObjectValues, useFormik } from "formik";
import { sendSignupEmailOtp } from "../../../redux/Service/auth/signup";
import * as yup from "yup";
import VerifySignupOtp from "../Registration/VerifySignupOtp";
/**
 * Login Component
 * @param {object} props - Props passed to the component
 * @returns {JSX.Element} JSX element representing the Login component
 */

const Login = (props) => {  

    const [eyeToggle, setEyeToggle] = useState<boolean>(false);
    const dispatch: AppDispatch = useDispatch();
    const [otpDetailsObj, setOtpDetailsObj] = useState<any>({} as any);
    /* ------------------------- Login Form Validation ------------------------- */
    const initLoginValues: LoginData = {        
        email: "",
        password: "",
    }
    const [savedLoginFormData, setSavedLoginFormData] = useState(initLoginValues);
    const onSubmitForLogin = async (values, onSubmitProps) => { };


    const validationSchemaForLogin = yup.object({
        email: yup.string()
            .trim()
            // .matches(PATTERN_EMAIL, EMAIL_INVALID)
            // .email("Please Enter a valid Email.")
            .required(EMAIL_REQUIRED),

        password: yup
            .string()
            .matches(PATTERN_FOR_PASSWORD_NEW, PASSWORD_INVALID)
            .required(PASSWORD_REQUIRED),
    });
    const loginFormData = useFormik({
        initialValues: savedLoginFormData || initLoginValues,
        // onubmit:onSubmitForLogin,
        onSubmit: onSubmitForLogin,
        validationSchema: validationSchemaForLogin,
    });
    const handleBlurValueUpdate = (key) => {
        loginFormData.setFieldValue(key, loginFormData.values[key].trim());
        setTimeout(() => {
            loginFormData.setFieldTouched(key, true);
        }, 100);

    }

    // const handleKeyPress = (event) => {

    //     if (event.keyCode === 13) {
    //         event.preventDefault();
    //         signUpFormData.handleSubmit();

    //     }

    // };


    const handleLoginData = async () => {
        loginFormData.handleSubmit();
        const loginFormDataErrors = await loginFormData.validateForm();
        if (Object.keys(loginFormDataErrors).length > 0) {
            loginFormData.setTouched(
                setNestedObjectValues<
                    FormikTouched<FormikValues>
                >(loginFormDataErrors, true))
            return;
        }


        const reqBody = {
            email: loginFormData.values.email,
            password: loginFormData.values.password,
        }
        customJsonInclude(reqBody);
        const response = await dispatch(loginToSystem(reqBody));
       
        if (response) {

            if (!response?.payload?.isVerify) {
                const sendEmailOtpReqBody = {
                    email: `${reqBody.email}`
                }
                const sendEmailOtpResponse = await dispatch(sendSignupEmailOtp(sendEmailOtpReqBody));
                if (sendEmailOtpResponse) {

                    setOtpDetailsObj(
                        {
                            isFromLogin: true,
                            detailsObj:{
                                ...reqBody
                              }
                           
                        }
                    )

                }
            }

        }
    }
 useEffect(() => {
    if(!isEmptyObjectOrNullUndefiend(otpDetailsObj?.detailsObj)){
      setSavedLoginFormData(otpDetailsObj?.detailsObj);
    }
    
  
    return () => {
      
    }
  }, [otpDetailsObj])

  const handleKeyPress = (event) => {

    if (event.keyCode === 13) {
      event.preventDefault();
        handleLoginData();

    }

  };
    /* ------------------------- Login Form Validation ------------------------- */

    return (
        <>
            {
                isEmptyObjectOrNullUndefiend(otpDetailsObj) ?

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

                                    <div className="admin-auth-from">
                                        <div className="admin-auth-card-title">
                                            <div className="box-icon box-light-primary wh-70px">
                                                <i className='material-symbols-outlined'>person</i>
                                            </div>
                                            <h2 className='mb-0'>Log in to Open Planner</h2>
                                        </div>
                                        <Card className='admin-auth-card'>
                                            <Card.Body>

                                                <Form.Group className="form-group required" >
                                                    <Form.Label>Email Address</Form.Label>
                                                    <div className="form-group-icon-start">
                                                    <i className='material-symbols-outlined'>person</i>
                                                        <Form.Control type="text" placeholder="Enter Email"
                                                            {...loginFormData.getFieldProps("email")}
                                                            maxLength={MAX_50}
                                                            onKeyDown={(event) => { handleKeyPress(event) }}
                                                            onBlur={() => {
                                                                handleBlurValueUpdate("email");
                                                            }}
                                                        />
                                                    </div>
                                                    {loginFormData.touched.email &&
                                                        loginFormData.errors.email
                                                        ? renderError(loginFormData.errors.email)
                                                        : null}
                                                </Form.Group>


                                                <Form.Group className='form-group required'>
                                                    <Form.Label>Password</Form.Label>
                                                    <div className="form-group-icon-start form-group-password">
                                                        <i className="material-symbols-outlined">lock</i>
                                                        <Form.Control type={eyeToggle ? "text" : "password"} placeholder='Enter Password'
                                                            {...loginFormData.getFieldProps("password")}
                                                            maxLength={MAX_50}
                                                            onKeyDown={(event) => { handleKeyPress(event) }}
                                                        />
                                                        <button onClick={() => setEyeToggle(!eyeToggle)} className='btn-password'> 
                                                            {/* <i className={` ${eyeToggle ? "th-outline-eye" : "th-outline-eye-slash"}`}></i> */}
                                                        
                                                        <i className="material-symbols-outlined">{eyeToggle ? "visibility" : "visibility_off"}</i>
                                                        </button>
                                                    </div>
                                                    {loginFormData.touched.password &&
                                                        loginFormData.errors.password
                                                        ? renderError(loginFormData.errors.password)
                                                        : null}

                                                </Form.Group>



                                                <div className="btn-full-group">

                                                    <NavLink className="auth-top-text-link text-link text-primary fw-500" to={ENUMFORROUTES.FORGOTPASSWORD}>Forgot Password?</NavLink>
                                                    <Button variant='primary' className='w-100 mt-4' onClick={() => {

                                                        handleLoginData()
                                                    }}>Log in</Button>

                                                </div>

                                                <div className="auth-bottom-text-link">
                                                    <p>Don’t have an account? <NavLink to={ENUMFORROUTES.REGISTRATION}>Registration</NavLink></p>
                                                </div>

                                            </Card.Body>
                                        </Card>

                                    </div>

                                </div>
                            </div>
                        </div>
                    </div> :
                    <VerifySignupOtp
                        otpDetailsObj={otpDetailsObj}
                        setOtpDetailsObj={setOtpDetailsObj}
                        handleLoginData={handleLoginData}
                    />
            }
        </>
    );
};
const mapStateToProps = (state) => ({})

const mapDispatchToProps = {
    loginToSystem
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)

