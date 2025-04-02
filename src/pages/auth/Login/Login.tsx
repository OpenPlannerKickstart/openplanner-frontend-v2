import React, { useState } from "react";
import { Button, Card, Form } from "react-bootstrap";
import authLogo from '/assets/images/auth-logo.svg'
import authBGLogo from '/assets/images/auth-bg-logo.svg'
import bgShapeOne from '/assets/images/bg-shape-one.png'
import bgShapeTwo from '/assets/images/bg-shape-two.png'

import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../redux/store";
import { loginToSystem } from "../../../redux/Service/auth/login";
import { setCookieByName } from "../../../Utility/Helper";


import { NavLink } from "react-router-dom";

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
                                <img src={authLogo} alt="CaddyPay" />
                            </div>

                            <div className="auth-image">
                                <img src={authBGLogo} alt="CaddyPay" />
                            </div>

                            <div className="bg-shape-one"><img src={bgShapeOne} alt="" /></div>
                            <div className="bg-shape-two"><img src={bgShapeTwo} alt="" /></div>
                        </div>
                        <div className="admin-auth-col admin-auth-right">

                            <div className="admin-auth-from">
                                <div className="admin-auth-card-title">
                                    <div className="box-icon box-light-primary wh-70px">
                                        <i className='th th-outline-user'></i>
                                    </div>
                                    <h2 className='mb-0'>Log in to CaddyPay</h2>
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
                                            <Button variant='primary' className='w-100 mb-3' onClick={() => {
                localStorage.setItem("token", "hii");
                props.loading(true);
                setTimeout(() => {
                    props.loading(false);
                }, 2000);
            }}>Login</Button>
                                            <NavLink className="text-link text-primary justify-content-center fw-700" to="">Forgot Password?</NavLink>

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
export default Login;
