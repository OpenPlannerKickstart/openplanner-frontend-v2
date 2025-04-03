import React, { useState } from "react";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import authLogo from "/assets/images/auth-logo.svg";
import authTextBG from "/assets/images/signup-bg.svg";


import { connect, useDispatch } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { ENUMFORROUTES } from "../../../interfaces/enum";
import { AppDispatch } from "../../../redux/store";
import { MAX_50, PASSWORD_INVALID, PATTERN_EMAIL, PATTERN_FOR_PASSWORD_NEW } from "../../../Utility/Validation_Helper";
import { SignUpData } from "../../../interfaces/interface";
import { FormikTouched, FormikValues, setNestedObjectValues, useFormik } from "formik";
import * as yup from "yup";
import { EMAIL_INVALID, EMAIL_REQUIRED, FIRST_NAME_REQUIRED, LAST_NAME_REQUIRED, PASSWORD_REQUIRED, UNIVERSITY_NAME_REQUIRED } from "../../../Utility/Validation_Message";
import { customJsonInclude, renderError } from "../../../Utility/Helper";
import { sendSignupEmailOtp, signupToSystem } from "../../../redux/Service/auth/signup";

const Registeration = (props) => {
  const [eyeToggle, setEyeToggle] = useState<boolean>(false);
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const navigateToRelatedScreen = (route: any, val?: any) => {
    if (val) {
      navigate(route, { state: val })
    }
    else {
      navigate(route);
    }

  }
  const [otp, setOtp] = useState("");

  /* ------------------------- Signup Form Validation ------------------------- */
  const initSignUpValues: SignUpData = {
  

    // first_name: "",
    // last_name: "",
    // university_name: "",
    // email: "",
    // password: "",
    
      "first_name": "Test",
      "last_name": "Teshhive",
      "university_name": "Teshhive",
      "email": "youttauseiddumoi-9760@yopmail.com",
      "password": "Test@123"
  


  }


  const onSubmitForSignUp = async (values, onSubmitProps) => {



  };


  const validationSchemaForSignUp = yup.object({
    email: yup.string()
      .trim()
      .matches(PATTERN_EMAIL, EMAIL_INVALID)
      // .email("Please Enter a valid Email.")
      .required(EMAIL_REQUIRED),
    first_name: yup.string().required(FIRST_NAME_REQUIRED),
    last_name: yup.string().required(LAST_NAME_REQUIRED),
    university_name: yup.string().required(UNIVERSITY_NAME_REQUIRED),

    password: yup
      .string()
      .matches(PATTERN_FOR_PASSWORD_NEW, PASSWORD_INVALID)
      .required(PASSWORD_REQUIRED),
  });
  const signUpFormData = useFormik({
    initialValues: initSignUpValues,
    // onubmit:onSubmitForLogin,
    onSubmit: onSubmitForSignUp,
    validationSchema: validationSchemaForSignUp,
  });
  const handleBlurValueUpdate = (key) => {
    signUpFormData.setFieldValue(key, signUpFormData.values[key].trim());
    setTimeout(() => {

      signUpFormData.setFieldTouched(key, true);
    }, 100);

  }

  // const handleKeyPress = (event) => {

  //     if (event.keyCode === 13) {
  //         event.preventDefault();
  //         signUpFormData.handleSubmit();

  //     }

  // };


  const handleSignUpData = async () => {
    signUpFormData.handleSubmit();
    const signUpFormDataErrors = await signUpFormData.validateForm();
    if (Object.keys(signUpFormDataErrors).length > 0) {
      signUpFormData.setTouched(
        setNestedObjectValues<
          FormikTouched<FormikValues>
        >(signUpFormDataErrors, true))
      return;
    }
    console.log(signUpFormDataErrors);

    const reqBody = {
      first_name: signUpFormData.values.first_name,
      last_name: signUpFormData.values.last_name,
      university_name: signUpFormData.values.university_name,
      email: signUpFormData.values.email,
      password: signUpFormData.values.password,
    }
    customJsonInclude(reqBody);
    const response = await dispatch(signupToSystem(reqBody));
    console.log(response);
    if (response) {
      const sendEmailOtpReqBody = {
        email: `${reqBody?.first_name}_${reqBody?.last_name}`
      }
      const sendEmailOtpResponse = await dispatch(sendSignupEmailOtp(sendEmailOtpReqBody));
      if (sendEmailOtpResponse) {
        navigateToRelatedScreen(ENUMFORROUTES.VERIFY_SIGNUP_OTP,{
          isFromLogin: false,
          email: `${reqBody?.first_name}_${reqBody?.last_name}`
        })
      }

    }
  }


  /* ------------------------- Signup Form Validation ------------------------- */
  return (
    <>
      <div className="admin-auth-wrapper admin-registration-wrapper admin-auth-side-image">
        <div className="admin-auth-inner-wrapper">
          <div className="admin-auth-row">
            <div className="admin-auth-col admin-auth-left">
              <div className="admin-auth-logo">
                <img src={authLogo} alt="OpenPlanner" />
              </div>

              <div className="auth-text">
                <div className="side-main-title">
                  <h2>Get Started With Us</h2>
                </div>
                <div className="side-detail-wrapper">
                  <ul>
                    <li>
                      <h5>Effortless Scheduling</h5>
                      <p>
                        Upload your syllabi for the semester, and let Open
                        Planner do the heavy lifting.
                      </p>
                    </li>
                    <li>
                      <h5>Customizable Calendar</h5>
                      <p>
                        Review your generated schedule and make adjustments to
                        suit your needs.
                      </p>
                    </li>
                    <li>
                      <h5>Stay Connected Anywhere</h5>
                      <p>
                        Download the Open Planner App to get push notifications
                        and keep track of your upcoming assignments on the go.
                      </p>
                    </li>
                  </ul>
                </div>
              </div>

              <img
                src={authTextBG}
                className="signup_bg-img"
                alt="OpenPlanner"
              />
              <div className="terms-condition-wrapper">
                <p>
                  By creating an account, you agree to our{" "}
                  <NavLink
                    className="text-link text-primary justify-content-center fw-600"
                    to={""}
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
              <div className="admin-auth-from">
                <div className="admin-auth-card-title">
                  <div className="box-icon box-light-primary wh-70px">
                    <i className="th th-outline-user"></i>
                  </div>
                  <h2 className="mb-0">Create your free account</h2>
                </div>
                <Card className="admin-auth-card">
                  <Card.Body>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="form-group required">
                          <Form.Label>First Name</Form.Label>
                          <div className="form-group-icon-start">
                            <i className="th-outline-user"></i>
                            <Form.Control
                              type="text"
                              placeholder="Enter First Name"
                              {...signUpFormData.getFieldProps("first_name")}
                              maxLength={MAX_50}
                              onBlur={() => {
                                handleBlurValueUpdate("first_name");
                              }}
                            />
                          </div>
                          {signUpFormData.touched.first_name &&
                            signUpFormData.errors.first_name
                            ? renderError(signUpFormData.errors.first_name)
                            : null}
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="form-group required">
                          <Form.Label>Last Name</Form.Label>
                          <div className="form-group-icon-start">
                            <i className="th-outline-user"></i>
                            <Form.Control
                              type="text"
                              placeholder="Enter Last Name"
                              {...signUpFormData.getFieldProps("last_name")}
                              maxLength={MAX_50}
                              onBlur={() => {
                                handleBlurValueUpdate("last_name");
                              }}
                            />
                          </div>
                          {signUpFormData.touched.last_name &&
                            signUpFormData.errors.last_name
                            ? renderError(signUpFormData.errors.last_name)
                            : null}
                        </Form.Group>
                      </Col>
                    </Row>

                    <Form.Group className="form-group required">
                      <Form.Label>Email Address</Form.Label>
                      <div className="form-group-icon-start">
                        <i className="th-outline-sms"></i>
                        <Form.Control type="email" placeholder="Enter Email"
                          {...signUpFormData.getFieldProps("email")}
                          maxLength={MAX_50}
                          onBlur={() => {
                            handleBlurValueUpdate("email");
                          }}
                        />
                      </div>
                      {signUpFormData.touched.email &&
                        signUpFormData.errors.email
                        ? renderError(signUpFormData.errors.email)
                        : null}
                    </Form.Group>

                    <Form.Group className="form-group required">
                      <Form.Label>University Name</Form.Label>
                      <div className="form-group-icon-start">
                        <i className="th-outline-buildings"></i>
                        <Form.Control
                          type="text"
                          placeholder="Enter University Name"
                          {...signUpFormData.getFieldProps("university_name")}
                          maxLength={MAX_50}
                          onBlur={() => {
                            handleBlurValueUpdate("university_name");
                          }}
                        />
                      </div>
                      {signUpFormData.touched.university_name &&
                        signUpFormData.errors.university_name
                        ? renderError(signUpFormData.errors.university_name)
                        : null}
                    </Form.Group>

                    <Form.Group className="form-group required">
                      <Form.Label>Password</Form.Label>
                      <div className="form-group-icon-start form-group-password">
                        <i className="th th-outline-lock"></i>
                        <Form.Control
                          type={eyeToggle ? "text" : "password"}
                          placeholder="Enter Password"
                          {...signUpFormData.getFieldProps("password")}
                          maxLength={MAX_50}
                        />
                        <button
                          onClick={() => setEyeToggle(!eyeToggle)}
                          className="btn-password"
                        >
                          <i
                            className={` ${eyeToggle
                              ? "th-outline-eye"
                              : "th-outline-eye-slash"
                              }`}
                          ></i>
                        </button>
                      </div>
                      {signUpFormData.touched.password &&
                        signUpFormData.errors.password
                        ? renderError(signUpFormData.errors.password)
                        : null}
                    </Form.Group>

                    <div className="btn-full-group">
                      <Button variant="primary" className="w-100 mt-4"
                      onClick={()=>{handleSignUpData();}}
                      >
                        Gert started
                      </Button>
                    </div>

                    <div className="auth-bottom-text-link">
                      <p>
                        Already have an account?{" "}
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
      </div>

    </>
  );
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Registeration);
