import React, { useState } from "react";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import authLogo from "/assets/images/auth-logo.svg";
import authTextBG from "/assets/images/signup-bg.svg";

import authBGImage from '/assets/images/auth-bg-image.svg'
import authBGImage3 from '/assets/images/auth-bg-image3.svg'

import { connect, useDispatch } from "react-redux";
import { NavLink } from "react-router-dom";
import { ENUMFORROUTES } from "../../../interfaces/enum";
import { AppDispatch } from "../../../redux/store";
import OTPInput from "react-otp-input";

const Registeration = (props) => {
  const [eyeToggle, setEyeToggle] = useState<boolean>(false);
  const dispatch: AppDispatch = useDispatch();


   const [otp, setOtp] = useState('');
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
                <p className="d-flex align-items-center justify-content-center gap-2 flex-wrap">
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
                            />
                          </div>
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
                            />
                          </div>
                        </Form.Group>
                      </Col>
                    </Row>

                    <Form.Group className="form-group required">
                      <Form.Label>Email Address</Form.Label>
                      <div className="form-group-icon-start">
                        <i className="th-outline-sms"></i>
                        <Form.Control type="email" placeholder="Enter Email" />
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group required">
                      <Form.Label>University Name</Form.Label>
                      <div className="form-group-icon-start">
                        <i className="th-outline-buildings"></i>
                        <Form.Control
                          type="text"
                          placeholder="Enter University Name"
                        />
                      </div>
                    </Form.Group>

                    <Form.Group className="form-group required">
                      <Form.Label>Password</Form.Label>
                      <div className="form-group-icon-start form-group-password">
                        <i className="th th-outline-lock"></i>
                        <Form.Control
                          type={eyeToggle ? "text" : "password"}
                          placeholder="Enter Password"
                        />
                        <button
                          onClick={() => setEyeToggle(!eyeToggle)}
                          className="btn-password"
                        >
                          {" "}
                          <i
                            className={` ${
                              eyeToggle
                                ? "th-outline-eye"
                                : "th-outline-eye-slash"
                            }`}
                          ></i>
                        </button>
                      </div>
                    </Form.Group>

                    <div className="btn-full-group">
                      <Button variant="primary" className="w-100 mt-4">
                        Gert started
                      </Button>
                    </div>

                    <div className="mt-4">
                      <p className="d-flex align-items-center justify-content-center gap-2 ">
                        Already have an account?{" "}
                        <NavLink
                          className="text-link text-primary justify-content-center fw-600"
                          to={ENUMFORROUTES.LOGIN}
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
                <p className="d-flex align-items-center justify-content-center gap-2 flex-wrap">
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
                    <div className="my-4">
                      <p className="d-flex align-items-center justify-content-center gap-2">
                        Did not receive it?
                        <NavLink
                          className="text-link text-primary justify-content-center fw-600"
                          to={""}
                        >
                          Resend
                        </NavLink>
                      </p>
                    </div>

                    <div className="btn-full-group">
                      <Button variant="primary" className="w-100 mb-4">
                        Verify Email
                      </Button>
                      <p className="d-flex align-items-center justify-content-center gap-2 ">
                        Don’t have an email address
                        <NavLink
                          className="text-link text-primary justify-content-center fw-600"
                          to={""}
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
  );
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Registeration);
