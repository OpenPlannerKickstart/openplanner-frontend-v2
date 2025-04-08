import React, { useState } from "react";
import { Button, Card, Form } from "react-bootstrap";
import authLogo from "/assets/images/auth-logo.svg";
import authBGImage4 from "/assets/images/auth-bg-image4.svg";
import { connect, useDispatch } from "react-redux";
import { AppDispatch } from "../../../redux/store";
import { NavLink, useNavigate } from "react-router-dom";
import { ENUMFORROUTES } from "../../../interfaces/enum";
import { CONFIRM_PASSWORD_NOT_MATCHED, PATTERN_FOR_PASSWORD_NEW } from "../../../Utility/Validation_Helper";
import { FormikTouched, FormikValues, setNestedObjectValues, useFormik } from 'formik';
import * as yup from 'yup';
import { CONFIRM_PASSWORD_REQUIRED, EMAIL_CODE_IS_REQUIRED, NEW_PASSWORD_REQUIRED, PASSWORD_INVALID } from "../../../Utility/Validation_Message";
import { sendNewPasswordDataAPI } from "../../../redux/Service/auth/forgotPassword";
import { renderError } from "../../../Utility/Helper";
const NewPassword = (props) => {
  const { emailDetailObj } = props;
  const [eyeToggle, setEyeToggle] = useState<boolean>(false);
  const [eyeConfirmToggle, setEyeConfirmToggle] = useState<boolean>(false);
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const initPasswordResetValues: any = {
    new_password: "",
    confirm_password: "",
    code: ""
  }
  const onSubmitForResetPassword = async (values) => {


  }

  const validationSchemaForResetPassword = yup.object({
    code: yup.string().required(EMAIL_CODE_IS_REQUIRED),
    new_password: yup
      .string()
      .trim()
      .matches(PATTERN_FOR_PASSWORD_NEW, `${PASSWORD_INVALID}`)
      .required(NEW_PASSWORD_REQUIRED),
    confirm_password: yup.string()
      .when('new_password', ([new_password]) => {
        return new_password?.length > 0 ? yup.string().required(CONFIRM_PASSWORD_REQUIRED).oneOf([yup.ref("new_password")], `${CONFIRM_PASSWORD_NOT_MATCHED}`) : yup.string()
      })
  })
  const resetPasswordForm = useFormik({
    initialValues: initPasswordResetValues,
    onSubmit: onSubmitForResetPassword,
    validationSchema: validationSchemaForResetPassword,
  });

  const handleChangePassword = async () => {
    resetPasswordForm.handleSubmit();
    const changPasswordErrors = await resetPasswordForm.validateForm();
    if (Object.keys(changPasswordErrors).length > 0) {
      resetPasswordForm.setTouched(
        setNestedObjectValues<
          FormikTouched<FormikValues>
        >(changPasswordErrors, true));

      return;
    }
    const reqBody = { ...resetPasswordForm.values,username:emailDetailObj?.username };
    delete reqBody.confirm_password;
    const response = await dispatch(sendNewPasswordDataAPI(reqBody));

    if (response) {
      navigate(ENUMFORROUTES.LOGIN);
      props?.setEmailDetailObj({} as any);
    }


    // const requestValue = businessDetailsFormData.values;
    // customJsonInclude(requestValue);
    // reqBody.append("companyDetail", JSON.stringify(requestValue));
  }

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
                      <Form.Label>Email Code</Form.Label>
                      <div className="form-group-icon-start">
                        <i className="th-outline-sms"></i>
                        <Form.Control type="email" placeholder="Enter Email Code"
                          {...resetPasswordForm.getFieldProps("code")}                       
                        
                        />
                      </div>
                      {resetPasswordForm.touched.code &&
                        resetPasswordForm.errors.code
                        ? renderError(resetPasswordForm.errors.code as any)
                        : null}
                    </Form.Group>
                    <Form.Group className="form-group required">
                      <Form.Label>New Password</Form.Label>
                      <div className="form-group-icon-start form-group-password">
                        <i className="th th-outline-lock-1"></i>
                        <Form.Control
                          type={eyeToggle ? "text" : "password"}
                          placeholder="Enter Password"
                          {...resetPasswordForm.getFieldProps("new_password")} 
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
                      {resetPasswordForm.touched.new_password &&
                        resetPasswordForm.errors.new_password
                        ? renderError(resetPasswordForm.errors.new_password as any)
                        : null}
                    </Form.Group>
                    <Form.Group className="form-group required">
                      <Form.Label>Confirm Password</Form.Label>
                      <div className="form-group-icon-start form-group-password">
                        <i className="th th-outline-lock-1"></i>
                        <Form.Control
                          type={eyeConfirmToggle ? "text" : "password"}
                          placeholder="Enter Confirm Password"
                          {...resetPasswordForm.getFieldProps("confirm_password")} 
                        />
                        <button
                          onClick={() => setEyeConfirmToggle(!eyeConfirmToggle)}
                          className="btn-password"
                        >
                          {" "}
                          <i
                            className={` ${eyeConfirmToggle
                                ? "th-outline-eye"
                                : "th-outline-eye-slash"
                              }`}
                          ></i>
                        </button>
                      </div>
                      {resetPasswordForm.touched.confirm_password &&
                        resetPasswordForm.errors.confirm_password
                        ? renderError(resetPasswordForm.errors.confirm_password as any)
                        : null}
                    </Form.Group>
                    <div className="btn-full-group">
                      <Button variant="primary" className="w-100 mb-3 mt-4"
                      onClick={()=>{handleChangePassword();}}
                      >
                        Update Password
                      </Button>
                    </div>
                    <div className="auth-bottom-text-link btn-full-group">
                      <p>Go back to <NavLink className="text-link text-primary fw-600" to={ENUMFORROUTES.LOGIN}>Log In</NavLink></p>
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



export default NewPassword;
