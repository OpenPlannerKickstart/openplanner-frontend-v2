import React, { useEffect, useState } from "react";
import { Button, Card, Form } from "react-bootstrap";
import authLogo from "/assets/images/auth-logo.svg";
import authBGImage from "/assets/images/auth-bg-image.svg";
import authBGImage3 from "/assets/images/auth-bg-image3.svg";
import { NavLink, useNavigate } from "react-router-dom";

import { connect, useDispatch } from "react-redux";
import OTPInput from "react-otp-input";
import { ENUMFORROUTES } from "../../../interfaces/enum";

import { FormikTouched, FormikValues, setNestedObjectValues, useFormik } from 'formik';
import * as yup from 'yup';
import { AppDispatch } from "../../../redux/store";
import { sendForgotPasswordEmailOtp } from "../../../redux/Service/auth/forgotPassword";
import { isEmptyObjectOrNullUndefiend, renderError } from "../../../Utility/Helper";
import NewPassword from "../NewPassword/NewPassword";
import { PATTERN_EMAIL, PATTERN_NOT_ALLOW_SPACE } from "../../../Utility/Validation_Helper";
import { EMAIL_INVALID, EMAIL_REQUIRED, USERNAME_IS_REQUIRED, USERNAME_SPACE_VALIDATION } from "../../../Utility/Validation_Message";
const ForgotPassword = (props) => {
  const dispatch: AppDispatch = useDispatch();
  const [emailDetailObj, setEmailDetailObj] = useState({} as any);
  /* ------------------------ Send Email Otp Data start ----------------------- */

  const initEmailData = {
    username: ""
  }
  const [savedEmailFormData, setSavedEmailFormData] = useState<any>(initEmailData);
  const onSubmit = (values) => {

  }
  const validationSchema = yup.object({
    username: yup.string().required(USERNAME_IS_REQUIRED).matches(PATTERN_NOT_ALLOW_SPACE, USERNAME_SPACE_VALIDATION),    // .trim()
    // .matches(PATTERN_EMAIL, EMAIL_INVALID)    
    // .required(EMAIL_REQUIRED),
  })
  const emailFormData = useFormik({
    initialValues: savedEmailFormData || initEmailData,
    onSubmit,
    validationSchema,
    enableReinitialize: true,
  })
  const handleEmailSubmit = async () => {
    emailFormData.handleSubmit();
    const emailFormDataErrors = await emailFormData.validateForm();
    if (Object.keys(emailFormDataErrors).length > 0) {
      emailFormData.setTouched(
        setNestedObjectValues<
          FormikTouched<FormikValues>
        >(emailFormDataErrors, true))
      return;
    }

    const reqBody = {
      username: emailFormData.values.username
    }
    const response = await dispatch(sendForgotPasswordEmailOtp(reqBody))
    if (response) {
      setEmailDetailObj(emailFormData?.values);
    }
  }
  const handleKeyPress = (event) => {

    if (event.keyCode === 13) {
      event.preventDefault();
      handleEmailSubmit();

    }

  };
  const handleBlurValueUpdate = (key) => {
    emailFormData.setFieldValue(key, emailFormData.values[key].trim());
    setTimeout(() => {

      emailFormData.setFieldTouched(key, true);
    }, 100);

  }
  useEffect(() => {
    if (!isEmptyObjectOrNullUndefiend(emailDetailObj)) {
      setSavedEmailFormData(emailDetailObj)
    }
    else {
      emailFormData.resetForm();
      setSavedEmailFormData(initEmailData);
    }


    return () => {

    }
  }, [emailDetailObj])

  /* ------------------------ Send Email Otp Data End ----------------------- */
  return (
    <>
      {
        isEmptyObjectOrNullUndefiend(emailDetailObj) ?

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
                        <i className="material-symbols-outlined">lock</i>
                      </div>
                      <h2 className="mb-0">Forgot Password</h2>
                    </div>
                    <Card className="admin-auth-card">
                      <Card.Body>
                        <Form.Group className="form-group required">
                          <Form.Label>Enter UserName</Form.Label>
                          <div className="form-group-icon-start">
                            <i className="material-symbols-outlined">mail</i>
                            <Form.Control type="email" placeholder="Enter UserName"
                              {...emailFormData.getFieldProps("username")}
                              onKeyDown={(event) => { handleKeyPress(event) }}
                              onBlur={() => {
                                handleBlurValueUpdate("username");
                              }}
                            />
                          </div>
                          {emailFormData.touched.username &&
                            emailFormData.errors.username
                            ? renderError(emailFormData.errors.username as any)
                            : null}
                        </Form.Group>

                        <div className="btn-full-group mt-4">
                          <Button variant="primary" className="w-100"
                            onClick={() => { handleEmailSubmit(); }}
                          >
                            Continue
                          </Button>
                        </div>
                        <div className="auth-bottom-text-link">
                          <p>
                            Go back to
                            <NavLink to={ENUMFORROUTES.LOGIN}
                            >
                              Log In
                            </NavLink>
                          </p>
                        </div>
                      </Card.Body>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
            {/* <div className={`admin-auth-inner-wrapper`}>
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
                    <i className="th th-outline-sms-notification"></i>
                  </div>
                  <h2 className="">Check your Email!</h2>
                  <p className="text-center mt-4">
                    We have sent a 4-digit code to your email
                    <br />{" "}
                    <span className="text-warning">robertdowney@gmail.com</span>
                  </p>
                </div>
                <Card className="admin-auth-card">
                  <Card.Body>
                    <Form.Group className="form-group mb-0">
                      <div className="otp-group">
                        <OTPInput
                          value={otp}
                          numInputs={4}
                          inputType="number"
                          onChange={setOtp}
                          containerStyle={""}
                          shouldAutoFocus={true}
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
                      <Button variant="primary" className="w-100">
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
        </div> */}
          </div> :
          <NewPassword emailDetailObj={emailDetailObj}
            setEmailDetailObj={setEmailDetailObj}
          />
      }
    </>
  );
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPassword);
