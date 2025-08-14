import React, { useEffect, useState } from "react";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import authLogo from "/assets/images/auth-logo.svg";
import authTextBG from "/assets/images/signup-bg.svg";


import { connect, useDispatch } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { ENUMFORROUTES } from "../../../interfaces/enum";
import { AppDispatch } from "../../../redux/store";
import { MAX_15, MAX_5, MAX_50, ONLY_ALPHABETS_AND_DOT, ONLY_NUMBERS, PASSWORD_INVALID, PATTERN_EMAIL, PATTERN_FOR_EMAIL_OR_USERNAME, PATTERN_FOR_MOBILE_NO, PATTERN_FOR_PASSWORD_NEW, PATTERN_NOT_ALLOW_SPACE } from "../../../Utility/Validation_Helper";
import { SignUpData } from "../../../interfaces/interface";
import { FormikTouched, FormikValues, setNestedObjectValues, useFormik } from "formik";
import * as yup from "yup";
import { EMAIL_INVALID, EMAIL_REQUIRED, FIRST_NAME_REQUIRED, LAST_NAME_REQUIRED, MOBILE_NO_IS_REQUIRED, MOBILE_NO_VALIDATION_MESSAGE, PASSWORD_REQUIRED, UNIVERSITY_NAME_REQUIRED, USERNAME_IS_REQUIRED, USERNAME_SPACE_VALIDATION } from "../../../Utility/Validation_Message";
import { customJsonInclude, isEmptyObjectOrNullUndefiend, isNullUndefinedOrBlank, renderError } from "../../../Utility/Helper";
import { addUniversityAPI, getUniversityListAPI, sendSignupEmailOtp, signupToSystem } from "../../../redux/Service/auth/signup";
import VerifySignupOtp from "./VerifySignupOtp";
import PhoneInput from "react-phone-input-2";
import Select, { components, ControlProps } from "react-select";
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

  const [otpDetailsObj, setOtpDetailsObj] = useState<any>({} as any);

  /* ------------------------- Signup Form Validation ------------------------- */
  const initSignUpValues: SignUpData = {


    first_name: "",
    last_name: "",
    university_name: "",
    email: "",
    password: "",
    username: "",
    mobile: "+1"

    //   "first_name": "Test",
    //   "last_name": "Teshhive",
    //   "university_name": "Teshhive",
    //   "email": "youttauseiddumoi-9760@yopmail.com",
    //   "password": "Test@123",
    // username: "TestTechhive",
    //   mobile: "+195854785415"


  }

  const [savesignUpFormData, setSaveSignUpFormData] = useState(initSignUpValues);

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
    university_name: yup.string().required(UNIVERSITY_NAME_REQUIRED).min(5, "Minimum 5 letters Required."),
    mobile: yup.string().required(MOBILE_NO_IS_REQUIRED).matches(PATTERN_FOR_MOBILE_NO, MOBILE_NO_VALIDATION_MESSAGE),
    username: yup.string().required(USERNAME_IS_REQUIRED).matches(PATTERN_FOR_EMAIL_OR_USERNAME, USERNAME_SPACE_VALIDATION),

    password: yup
      .string()
      .matches(PATTERN_FOR_PASSWORD_NEW, PASSWORD_INVALID)
      .required(PASSWORD_REQUIRED),
  });
  const signUpFormData = useFormik({
    initialValues: savesignUpFormData || initSignUpValues,
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


    const reqBody = {
      first_name: signUpFormData.values.first_name,
      last_name: signUpFormData.values.last_name,
      university_name: signUpFormData.values.university_name,
      email: signUpFormData.values.email,
      password: signUpFormData.values.password,
      mobile: signUpFormData.values.mobile,
      username: signUpFormData.values.username,
    }
    customJsonInclude(reqBody);
    const response = await dispatch(signupToSystem(reqBody));

    if (response) {

      setOtpDetailsObj(
        {
          isFromLogin: false,
          detailsObj: {
            ...reqBody
          }
        }
      )



    }
  }

  useEffect(() => {
    if (!isEmptyObjectOrNullUndefiend(otpDetailsObj?.detailsObj)) {
      setSaveSignUpFormData(otpDetailsObj?.detailsObj);
    }


    return () => {

    }
  }, [otpDetailsObj])


  /* ------------------------- Signup Form Validation ------------------------- */


  /** -----------------------get university drop down start---------------------*/
  const [univercityData, setUnivercityData] = useState<any>([])
  const handleGetUniversityData = async () => {
    const data = await dispatch(getUniversityListAPI());
    if (data || data?.payload) {
      let other = [{
        value: "Other",
        label: "Other"
      }]

      setUnivercityData([...other, ...data?.payload])
    }
  }

  useEffect(() => {
    handleGetUniversityData();
    return () => {
      setUnivercityData([]);
    }
  }, [])




  // Define initial values
  const initFormValues = {
    unitid: null,
    institution_name: "",
    // Add other fields here
  };

  // useState for saved form data
  const [savedFormData, setSavedFormData] = useState(initFormValues);

  // Define validation schema
  const validationSchema = yup.object({
    unitid: yup.string().nullable(),
    institution_name: yup.string()
      .trim()
      .required('Institution name is required.').min(5, "Minimum 5 letters Required."),
    // Add validation rules for other fields
  });

  // onSubmit function
  const onSubmit = async (values, onSubmitProps) => {
    // Handle form submission logic
  };

  // useFormik instance
  const formData = useFormik({
    initialValues: savedFormData || initFormValues,
    validationSchema,
    onSubmit,
    enableReinitialize: true,
  });

  // Utility function to handle blur updates
  const handleAddUniBlurValueUpdate = (key) => {
    formData.setFieldValue(key, formData.values[key].trim());
    setTimeout(() => {
      formData.setFieldTouched(key, true);
    }, 100);
  };

  // Submission handler
  const handleSubmitFormData = async () => {
    formData.handleSubmit();
    const formDataErrors = await formData.validateForm();
    if (Object.keys(formDataErrors).length > 0) {
      formData.setTouched(
        setNestedObjectValues(formDataErrors, true)
      );
      return;
    }

    const reqBody = { ...formData.values };
    customJsonInclude(reqBody);
    const response = await dispatch(addUniversityAPI(reqBody));

    if (response && response.payload) {
      formData.resetForm();
      handleGetUniversityData();
      signUpFormData?.setFieldValue("university_name", formData?.values?.institution_name)
      // Handle successful response
    }
  };


  /** -----------------------get university drop down end---------------------*/

  return (
    <>
      {
        isEmptyObjectOrNullUndefiend(otpDetailsObj) ?

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
                        className="text-link text-primary justify-content-center fw-600" target="_blank"
                        to={"https://open-planner.com/terms-and-conditions/"}
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
                                <i className="material-symbols-outlined">person</i>
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
                                <i className="material-symbols-outlined">person</i>
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
                          <Form.Label>User Name</Form.Label>
                          <div className="form-group-icon-start">
                            <i className="material-symbols-outlined">mail</i>
                            <Form.Control type="text" placeholder="Enter User Name"
                              {...signUpFormData.getFieldProps("username")}
                              maxLength={MAX_50}
                              onBlur={() => {
                                handleBlurValueUpdate("username");
                              }}
                            />
                          </div>
                          {signUpFormData.touched.username &&
                            signUpFormData.errors.username
                            ? renderError(signUpFormData.errors.username)
                            : null}
                        </Form.Group>
                        <Form.Group className="form-group required">
                          <Form.Label>Email Address</Form.Label>
                          <div className="form-group-icon-start">
                            <i className="material-symbols-outlined">mail</i>
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
                          <Form.Label>Mobile No.</Form.Label>
                          <div className="form-group-icon-start">
                            <i className="th-outline-sms"></i>
                            <PhoneInput
                              country={'us'}
                              value={signUpFormData?.values?.mobile}
                              onChange={(value) => {
                                const formattedValue = value.startsWith('+') ? value : `+${value}`;
                                signUpFormData.setFieldValue("mobile", formattedValue);
                              }}
                              onBlur={() => {
                                signUpFormData?.setFieldTouched("mobile", true);
                              }}
                              inputProps={{
                                name: 'mobile',
                                required: true,
                              }}
                              placeholder="Enter your Mobile Number"
                            />
                          </div>
                          {signUpFormData.touched.mobile &&
                            signUpFormData.errors.mobile
                            ? renderError(signUpFormData.errors.mobile)
                            : null}
                        </Form.Group>

                        <Form.Group className="form-group required">
                          {/* <Form.Label>University Name</Form.Label>
                          <div className="form-group-icon-start">
                            <i className="material-symbols-outlined">home_work</i>
                            <Form.Control
                              type="text"
                              placeholder="Enter University Name"
                              {...signUpFormData.getFieldProps("university_name")}
                              maxLength={MAX_50}
                              minLength={MAX_5}
                              onBlur={() => {
                                handleBlurValueUpdate("university_name");
                              }}
                            />
                          </div> */}

                          <Form.Label>Select University Name</Form.Label>
                          <Select
                            options={univercityData}
                            placeholder={<div>Select </div>}
                            onChange={(selectedOption) => {
                              signUpFormData.setFieldValue("university_name", selectedOption?.label ? selectedOption?.label : null);


                            }}
                            value={univercityData?.filter(({ label }) => {

                              return (
                                label ===
                                signUpFormData.values.university_name
                              );
                            })}
                            isDisabled={!isNullUndefinedOrBlank(props?.selectedCourse) ? true : false}
                            // onBlur={() => {
                            //     // objectiveDetailsFormData.setFieldTouched("theme_id", true)
                            //     handleUpdateDetails()
                            // }}
                            isClearable
                            menuPosition="fixed"
                            className="react-select-container"
                          />
                          {signUpFormData.touched.university_name &&
                            signUpFormData.errors.university_name
                            ? renderError(signUpFormData.errors.university_name)
                            : null}
                          {
                            signUpFormData.values.university_name === "Other" &&
                            (
                              <>
                                {/* <Form.Label>University Id</Form.Label>
                                <div className="form-group-icon-start">
                                  <i className="material-symbols-outlined">home_work</i>
                                  <Form.Control
                                    type="text"
                                    placeholder="Enter University Id"
                                    {...formData.getFieldProps("unitid")}
                                    maxLength={MAX_50}
                                    minLength={MAX_5}
                                    onBlur={() => {
                                      handleAddUniBlurValueUpdate("unitid");
                                    }}
                                  />
                                </div>
                                {formData.touched.unitid &&
                                  formData.errors.unitid
                                  ? renderError(formData.errors.unitid)
                                  : null} */}
                                <Row className="mt-3">
                                  <Col xs={10}>
                                    <Form.Label>University Name</Form.Label>
                                    <div className="form-group-icon-start">
                                      <i className="material-symbols-outlined">home_work</i>
                                      <Form.Control
                                        type="text"
                                        placeholder="Enter University Name"
                                        {...formData.getFieldProps("institution_name")}
                                        maxLength={MAX_50}
                                        minLength={MAX_5}
                                        onBlur={() => {
                                          handleAddUniBlurValueUpdate("institution_name");
                                        }}
                                      />
                                    </div>
                                    {formData.touched.institution_name &&
                                      formData.errors.institution_name
                                      ? renderError(formData.errors.institution_name)
                                      : null}
                                  </Col>
                                  <Col xs={2}>

                                    <Button variant="primary" className="w-100 mt-4" onClick={() => { handleSubmitFormData() }}>Add</Button>
                                  </Col>

                                </Row>
                              </>
                            )
                          }



                        </Form.Group>

                        <Form.Group className="form-group required">
                          <Form.Label>Password</Form.Label>
                          <div className="form-group-icon-start form-group-password">
                            <i className="material-symbols-outlined">lock</i>
                            <Form.Control
                              autoComplete="new-password"
                              type={eyeToggle ? "text" : "password"}
                              placeholder="Enter Password"
                              {...signUpFormData.getFieldProps("password")}
                              maxLength={MAX_15}
                            />
                            <button
                              onClick={() => setEyeToggle(!eyeToggle)}
                              className="btn-password"
                            >
                              {/* <i
                                className={` ${eyeToggle
                                  ? "th-outline-eye"
                                  : "th-outline-eye-slash"
                                  }`}
                              ></i> */}
                              <i className="material-symbols-outlined">{eyeToggle ? "visibility" : "visibility_off"}</i>
                            </button>
                          </div>
                          {signUpFormData.touched.password &&
                            signUpFormData.errors.password
                            ? renderError(signUpFormData.errors.password)
                            : null}
                        </Form.Group>

                        <div className="btn-full-group">
                          <Button variant="primary" className="w-100 mt-4"
                            onClick={() => { handleSignUpData(); }}
                          >
                            Sign Up
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
          </div> :
          <VerifySignupOtp
            otpDetailsObj={otpDetailsObj}
            setOtpDetailsObj={setOtpDetailsObj}

          />
      }

    </>
  );
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Registeration);
