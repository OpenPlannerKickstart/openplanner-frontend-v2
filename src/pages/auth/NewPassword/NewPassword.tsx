import React, { useState } from "react";
import { Button, Card, Form } from "react-bootstrap";
import authLogo from "/assets/images/auth-logo.svg";
import authBGImage4 from "/assets/images/auth-bg-image4.svg";
import { connect, useDispatch } from "react-redux";
import { AppDispatch } from "../../../redux/store";
import { NavLink } from "react-router-dom";
import { ENUMFORROUTES } from "../../../interfaces/enum";

const NewPassword = (props) => {
  const [eyeToggle, setEyeToggle] = useState<boolean>(false);
  const dispatch: AppDispatch = useDispatch();

  return (
    <>
      <div className="admin-auth-wrapper admin-auth-side-image">
        <div className="admin-auth-inner-wrapper">
          <div className="admin-auth-row">
            <div className="admin-auth-col admin-auth-left">
              <div className="admin-auth-logo">
                <img src={authLogo} alt="CaddyPay" />
              </div>
              <div className="auth-image">
                <img src={authBGImage4} alt="CaddyPay" />
              </div>
            </div>
            <div className="admin-auth-col admin-auth-right">
              <div className="admin-auth-from">
                <div className="admin-auth-card-title">
                  <div className="box-icon box-light-primary wh-70px">
                    <i className="th th-outline-key"></i>
                  </div>
                  <h2 className="mb-0">Set New Password</h2>
                </div>
                <Card className="admin-auth-card">
                  <Card.Body>
                    <Form.Group className="form-group required">
                      <Form.Label>New Password</Form.Label>
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
                    <Form.Group className="form-group required">
                      <Form.Label>Confirm Password</Form.Label>
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
                      <Button variant="primary" className="w-100 mb-3 mt-4">
                        Update Password
                      </Button>
                    </div>
                    <div className="btn-full-group">
                        <p className='d-flex align-items-center justify-content-center gap-2'>Go back to<NavLink className="text-link text-primary justify-content-center fw-600" to={ENUMFORROUTES.LOGIN}>Log In</NavLink></p>
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

export default connect(mapStateToProps, mapDispatchToProps)(NewPassword);
