import React, { useState } from "react";
import { Button, Card, Form } from "react-bootstrap";
import authLogo from '/assets/images/auth-logo.svg'
import authBGLogo from '/assets/images/auth-bg-logo.svg'
import bgShapeOne from '/assets/images/bg-shape-one.png'
import bgShapeTwo from '/assets/images/bg-shape-two.png'

import { connect, useDispatch } from "react-redux";
import { AppDispatch } from "../../../redux/store";
import { loginToSystem } from "../../../redux/Service/auth/login";
import { setCookieByName } from "../../../Utility/Helper";


import { NavLink } from "react-router-dom";
import { ENUMFORROUTES } from "../../../interfaces/enum";

/**
 * Login Component
 * @param {object} props - Props passed to the component
 * @returns {JSX.Element} JSX element representing the Login component
 */

const Login = (props) => {
  const AppDispatch: AppDispatch = useDispatch();
  const callLogin = async () => {
    setTimeout(() => {
      setCookieByName("token", "hii");
    }, 2000);
    await dispatch(loginToSystem());
  };

  const [eyeToggle, setEyeToggle] = useState<boolean>(false);
  const dispatch: AppDispatch = useDispatch();

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
                        </div>
                        <div className="admin-auth-col admin-auth-right">

                            <div className="admin-auth-from">
                                <div className="admin-auth-card-title">
                                    <div className="box-icon box-light-primary wh-70px">
                                        <i className='th th-outline-user'></i>
                                    </div>
                                    <h2 className='mb-0'>Log in to Open Planner</h2>
                                </div>
                                <Card className='admin-auth-card'>
                                    <Card.Body>

                                        <Form.Group className="form-group required" >
                                            <Form.Label>Email Address</Form.Label>
                                            <div className="form-group-icon-start">
                                                <i className='th-outline-user'></i>
                                                <Form.Control type="email" placeholder="Enter Email" />
                                            </div>
                                            
                                        </Form.Group>


                                        <Form.Group className='form-group required'>
                                            <Form.Label>Password</Form.Label>
                                            <div className="form-group-icon-start form-group-password">
                                                <i className="th th-outline-lock"></i>
                                                <Form.Control type={eyeToggle ? "text" : "password"} placeholder='Enter Password' />
                                                <button onClick={() => setEyeToggle(!eyeToggle)} className='btn-password'> <i className={` ${eyeToggle ? "th-outline-eye" : "th-outline-eye-slash"}`}></i></button>
                                            </div>
                                           
                                        </Form.Group>



                                        <div className="btn-full-group">
                                            
                                            <NavLink className="text-link text-primary justify-content-center fw-600 w-100 d-block text-end mt-4" to={ENUMFORROUTES.FORGOTPASSWORD}>Forgot Password?</NavLink>
                                            <Button variant='primary' className='w-100 mt-4' onClick={() => {
               
                                                callLogin()
                                            }}>Log in</Button>

                                        </div>

                                        <div className="auth-bottom-text-link">
                                            <p>Don’t have an account? <NavLink className="text-link text-primary justify-content-center fw-600" to={ENUMFORROUTES.REGISTRATION}>Registration</NavLink></p>
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
const mapStateToProps = (state) => ({})

const mapDispatchToProps = {
  loginToSystem
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)

