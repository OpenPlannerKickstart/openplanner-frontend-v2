import React, { useEffect, useState } from "react";
import { connect, useDispatch } from "react-redux";
import { NavLink } from "react-router-dom";
import { FormikTouched, FormikValues, setNestedObjectValues, useFormik } from "formik";
import * as yup from "yup";
import Select from "react-select";

import "../AuthPage.css";
import sidebarLogoLg from '../../../assets/images/sidebar-logo-lg.svg';

import { ENUMFORROUTES } from "../../../interfaces/enum";
import { AppDispatch } from "../../../redux/store";
import {
  MAX_32,
  MAX_5,
  MAX_50,
  PASSWORD_INVALID,
  PATTERN_EMAIL,
  PATTERN_FOR_EMAIL_OR_USERNAME,
  PATTERN_FOR_PASSWORD_NEW,
} from "../../../Utility/Validation_Helper";
import { SignUpData } from "../../../interfaces/interface";
import {
  EMAIL_INVALID,
  EMAIL_REQUIRED,
  FIRST_NAME_REQUIRED,
  LAST_NAME_REQUIRED,
  PASSWORD_REQUIRED,
  UNIVERSITY_NAME_REQUIRED,
  USERNAME_IS_REQUIRED,
  USERNAME_SPACE_VALIDATION,
} from "../../../Utility/Validation_Message";
import { customJsonInclude, isEmptyObjectOrNullUndefiend, isNullUndefinedOrBlank, renderError } from "../../../Utility/Helper";
import { addUniversityAPI, getUniversityListAPI, signupToSystem } from "../../../redux/Service/auth/signup";
import VerifySignupOtp from "./VerifySignupOtp";

// Academic year options for college/university students
const yearOptions = [
  { value: "freshman", label: "Freshman" },
  { value: "sophomore", label: "Sophomore" },
  { value: "junior", label: "Junior" },
  { value: "senior", label: "Senior" },
  { value: "graduate", label: "Graduate" },
  { value: "other", label: "Other" },
];

const Registeration = (props) => {
  const [eyeToggle, setEyeToggle] = useState<boolean>(false);
  const dispatch: AppDispatch = useDispatch();
  const [otpDetailsObj, setOtpDetailsObj] = useState<any>({} as any);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);

  // Detect theme changes
  useEffect(() => {
    const checkTheme = () => {
      const theme = document.documentElement.getAttribute('data-theme');
      setIsDarkMode(theme === 'dark');
    };
    
    // Initial check
    checkTheme();
    
    // Watch for theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'data-theme') {
          checkTheme();
        }
      });
    });
    
    observer.observe(document.documentElement, { attributes: true });
    
    return () => observer.disconnect();
  }, []);

  const initSignUpValues: SignUpData & { custom_school_name?: string } = {
    first_name: "",
    last_name: "",
    university_name: "",
    email: "",
    password: "",
    username: "",
    mobile: "+1",
    custom_school_name: "",
  };

  const [savesignUpFormData, setSaveSignUpFormData] = useState(initSignUpValues);
  const onSubmitForSignUp = async (values, onSubmitProps) => {};

  const validationSchemaForSignUp = yup.object({
    email: yup
      .string()
      .trim()
      .matches(PATTERN_EMAIL, EMAIL_INVALID)
      .required(EMAIL_REQUIRED),
    first_name: yup.string().required(FIRST_NAME_REQUIRED),
    last_name: yup.string().required(LAST_NAME_REQUIRED),
    university_name: yup.string().required(UNIVERSITY_NAME_REQUIRED).min(5, "Minimum 5 letters Required."),
    mobile: yup.string().nullable(),
    username: yup.string().required(USERNAME_IS_REQUIRED).matches(PATTERN_FOR_EMAIL_OR_USERNAME, USERNAME_SPACE_VALIDATION),
    password: yup
      .string()
      .matches(PATTERN_FOR_PASSWORD_NEW, PASSWORD_INVALID)
      .required(PASSWORD_REQUIRED),
    custom_school_name: yup.string().when('university_name', {
      is: 'Other/Highschool',
      then: (schema) => schema.required("School name is required").min(3, "Minimum 3 characters required"),
      otherwise: (schema) => schema.notRequired(),
    }),
  });

  const signUpFormData = useFormik({
    initialValues: savesignUpFormData || initSignUpValues,
    onSubmit: onSubmitForSignUp,
    validationSchema: validationSchemaForSignUp,
  });

  const handleBlurValueUpdate = (key) => {
    signUpFormData.setFieldValue(key, signUpFormData.values[key].trim());
    setTimeout(() => {
      signUpFormData.setFieldTouched(key, true);
    }, 100);
  };

  const handleSignUpData = async () => {
    signUpFormData.handleSubmit();
    const signUpFormDataErrors = await signUpFormData.validateForm();
    if (Object.keys(signUpFormDataErrors).length > 0) {
      signUpFormData.setTouched(
        setNestedObjectValues<FormikTouched<FormikValues>>(signUpFormDataErrors, true)
      );
      return;
    }

    const isOtherSchool = signUpFormData.values.university_name === "Other/Highschool";
    const customSchoolName = (signUpFormData.values as any).custom_school_name?.trim();

    // If user selected "Other/Highschool", we need to add their custom school first
    if (isOtherSchool && customSchoolName) {
      try {
        const addUniversityReqBody = {
          institution_name: customSchoolName,
          unitid: `custom-${Date.now()}`, // Generate a unique ID
        };
        const addUniversityResponse = await dispatch(addUniversityAPI(addUniversityReqBody));
        
        // If the response is successful OR the school already exists, proceed with registration
        // The backend will return success or "already exists" - both are fine
        if (!addUniversityResponse?.payload && !addUniversityResponse?.error?.includes?.('already exists')) {
          // Only fail if it's a real error (not "already exists")
          console.error('[Registration] Failed to add custom school:', addUniversityResponse);
          // Still proceed - the backend might accept the school name directly
        }
      } catch (error: any) {
        // If the error is "already exists", that's fine - proceed with registration
        const errorMessage = error?.response?.data?.message || error?.message || '';
        if (!errorMessage.toLowerCase().includes('already exists')) {
          console.error('[Registration] Error adding custom school:', error);
          // Still proceed with registration - the backend might handle it
        }
      }
    }

    // Determine the actual university name to send
    const universityNameToSend = isOtherSchool && customSchoolName 
      ? customSchoolName 
      : signUpFormData.values.university_name;

    const reqBody: any = {
      first_name: signUpFormData.values.first_name,
      last_name: signUpFormData.values.last_name,
      university_name: universityNameToSend,
      email: signUpFormData.values.email,
      password: signUpFormData.values.password,
      mobile: signUpFormData.values.mobile == "+1" ? undefined : `${signUpFormData.values.mobile}`,
      username: signUpFormData.values.username,
    };
    
    // Include year if selected and not Other/Highschool
    if (selectedYear && !isOtherSchool) {
      reqBody.year = selectedYear;
    }
    customJsonInclude(reqBody);
    const response = await dispatch(signupToSystem(reqBody));

    if (response) {
      setOtpDetailsObj({
        isFromLogin: false,
        detailsObj: {
          ...reqBody,
        },
      });
    }
  };

  useEffect(() => {
    if (!isEmptyObjectOrNullUndefiend(otpDetailsObj?.detailsObj)) {
      setSaveSignUpFormData(otpDetailsObj?.detailsObj);
    }
  }, [otpDetailsObj]);

  const [univercityData, setUnivercityData] = useState<any>([]);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const handleGetUniversityData = async () => {
    const data = await dispatch(getUniversityListAPI());
    if (data || data?.payload) {
      const other = [
        {
          value: "Other",
          label: "Other/Highschool",
        },
      ];

      setUnivercityData([...other, ...data?.payload]);
    }
  };

  useEffect(() => {
    handleGetUniversityData();
    return () => {
      setUnivercityData([]);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const initFormValues = {
    unitid: null,
    institution_name: "",
  };

  const [savedFormData, setSavedFormData] = useState(initFormValues);

  const validationSchema = yup.object({
    unitid: yup.string().nullable(),
    institution_name: yup.string().trim().required("Institution name is required.").min(5, "Minimum 5 letters Required."),
  });

  const onSubmit = async (values, onSubmitProps) => {};

  const formData = useFormik({
    initialValues: savedFormData || initFormValues,
    validationSchema,
    onSubmit,
    enableReinitialize: true,
  });

  const handleAddUniBlurValueUpdate = (key) => {
    formData.setFieldValue(key, formData.values[key].trim());
    setTimeout(() => {
      formData.setFieldTouched(key, true);
    }, 100);
  };

  const handleSubmitFormData = async () => {
    formData.handleSubmit();
    const formDataErrors = await formData.validateForm();
    if (Object.keys(formDataErrors).length > 0) {
      formData.setTouched(setNestedObjectValues(formDataErrors, true));
      return;
    }

    const reqBody = { ...formData.values };
    customJsonInclude(reqBody);
    const response = await dispatch(addUniversityAPI(reqBody));

    if (response && response.payload) {
      formData.resetForm();
      handleGetUniversityData();
      signUpFormData?.setFieldValue("university_name", formData?.values?.institution_name);
    }
  };

  const brandLogo = isDarkMode ? sidebarLogoLg : "/assets/logo.png";
  const mobileNumberValue =
    signUpFormData.values.mobile?.startsWith("+1")
      ? signUpFormData.values.mobile.slice(2)
      : signUpFormData.values.mobile || "";

  return (
    <>
      {isEmptyObjectOrNullUndefiend(otpDetailsObj) ? (
        <div className="signup-page">
          <div className="signup-left">
            <a href="https://open-planner.com/" className="signup-logo" target="_blank" rel="noreferrer">
              <img src={brandLogo} alt="Open Planner" />
            </a>

            <h2 className="signup-left-title">Get Started With Us</h2>

            <div className="feature-list">
              <div className="feature-item">
                <div className="feature-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <div className="feature-content">
                  <h3>Effortless Scheduling</h3>
                  <p>Upload your syllabi for the semester, and let Open Planner do the heavy lifting.</p>
                </div>
              </div>

              <div className="feature-item">
                <div className="feature-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <div className="feature-content">
                  <h3>Customizable Calendar</h3>
                  <p>Review your generated schedule and make adjustments to suit your needs.</p>
                </div>
              </div>

              <div className="feature-item">
                <div className="feature-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <div className="feature-content">
                  <h3>Stay Connected Anywhere</h3>
                  <p>Download the Open Planner App to get push notifications and keep track of your upcoming assignments on the go.</p>
                </div>
              </div>
            </div>

            <div className="signup-calendar-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11zM9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm-8 4H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z" />
              </svg>
            </div>

            <p className="signup-legal-footer">
              By creating an account, you agree to our{" "}
              <a href="https://open-planner.com/terms-and-conditions/" target="_blank" rel="noreferrer">
                Terms and Conditions
              </a>{" "}
              and{" "}
              <a href="https://open-planner.com/privacy-policy/" target="_blank" rel="noreferrer">
                Services Agreement
              </a>.
            </p>
          </div>

          <div className="signup-right">
            <div className="signup-form-container">
              <a href="https://open-planner.com/" className="signup-mobile-logo" target="_blank" rel="noreferrer">
                <img src={brandLogo} alt="Open Planner" />
              </a>

              <div className="signup-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>

              <div className="signup-header">
                <h1>Create Your Account</h1>
              </div>

              <form
                className="signup-form"
                onSubmit={(event) => {
                  event.preventDefault();
                  handleSignUpData();
                }}
              >
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">
                      First Name <span>*</span>
                    </label>
                    <div className="form-input-wrapper">
                      <span className="form-input-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                          <circle cx="12" cy="7" r="4" />
                        </svg>
                      </span>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Enter First Name"
                        {...signUpFormData.getFieldProps("first_name")}
                        maxLength={MAX_50}
                        onBlur={() => {
                          handleBlurValueUpdate("first_name");
                        }}
                      />
                    </div>
                    {signUpFormData.touched.first_name && signUpFormData.errors.first_name
                      ? renderError(signUpFormData.errors.first_name)
                      : null}
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      Last Name <span>*</span>
                    </label>
                    <div className="form-input-wrapper">
                      <span className="form-input-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                          <circle cx="12" cy="7" r="4" />
                        </svg>
                      </span>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Enter Last Name"
                        {...signUpFormData.getFieldProps("last_name")}
                        maxLength={MAX_50}
                        onBlur={() => {
                          handleBlurValueUpdate("last_name");
                        }}
                      />
                    </div>
                    {signUpFormData.touched.last_name && signUpFormData.errors.last_name
                      ? renderError(signUpFormData.errors.last_name)
                      : null}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    User Name <span>*</span>
                  </label>
                  <div className="form-input-wrapper">
                    <span className="form-input-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                    </span>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Enter Username/Email"
                      {...signUpFormData.getFieldProps("username")}
                      maxLength={MAX_50}
                      onBlur={() => {
                        handleBlurValueUpdate("username");
                      }}
                    />
                  </div>
                  {signUpFormData.touched.username && signUpFormData.errors.username
                    ? renderError(signUpFormData.errors.username)
                    : null}
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Email Address <span>*</span>
                  </label>
                  <div className="form-input-wrapper">
                    <span className="form-input-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                        <polyline points="22,6 12,13 2,6" />
                      </svg>
                    </span>
                    <input
                      type="email"
                      className="form-input"
                      placeholder="Enter Email"
                      {...signUpFormData.getFieldProps("email")}
                      maxLength={MAX_50}
                      onBlur={() => {
                        handleBlurValueUpdate("email");
                      }}
                    />
                  </div>
                  {signUpFormData.touched.email && signUpFormData.errors.email
                    ? renderError(signUpFormData.errors.email)
                    : null}
                </div>

                <div className="form-group">
                  <label className="form-label">Mobile No</label>
                  <div className="phone-input-wrapper">
                    <div className="phone-prefix">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                      </svg>
                      +1
                    </div>
                    <input
                      type="tel"
                      className="phone-input"
                      placeholder="Enter your Mobile Number"
                      value={mobileNumberValue}
                      onChange={(event) => {
                        const value = event.target.value;
                        signUpFormData.setFieldValue("mobile", value ? `+1${value}` : "+1");
                      }}
                      onBlur={() => {
                        signUpFormData?.setFieldTouched("mobile", true);
                      }}
                    />
                  </div>
                  {signUpFormData.touched.mobile && signUpFormData.errors.mobile
                    ? renderError(signUpFormData.errors.mobile)
                    : null}
                </div>

                <div className="form-group">
                  <label className="form-label">Select School Name <span>*</span></label>
                  <div className="form-input-wrapper">
                    <span className="form-input-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                        <path d="M6 12v5c3 3 9 3 12 0v-5" />
                      </svg>
                    </span>
                    <Select
                      options={univercityData}
                      placeholder={<div>Select your school</div>}
                      onChange={(selectedOption) => {
                        signUpFormData.setFieldValue("university_name", selectedOption?.label ? selectedOption?.label : null);
                        // Reset year selection if switching to Other/Highschool or clearing
                        if (!selectedOption?.label || selectedOption?.label === "Other/Highschool") {
                          setSelectedYear(null);
                        }
                      }}
                      value={univercityData?.filter(({ label }) => {
                        return label === signUpFormData.values.university_name;
                      })}
                      isClearable
                      menuPosition={isMobile ? "absolute" : "fixed"}
                      menuPlacement={isMobile ? "top" : "auto"}
                      menuPortalTarget={isMobile ? undefined : document.body}
                      menuShouldScrollIntoView={isMobile}
                      classNamePrefix="auth-select"
                    />
                  </div>
                  {signUpFormData.touched.university_name && signUpFormData.errors.university_name
                    ? renderError(signUpFormData.errors.university_name)
                    : null}
                </div>

                {/* Academic Year dropdown - only shows for college/university (not Other/Highschool) */}
                {signUpFormData.values.university_name && signUpFormData.values.university_name !== "Other/Highschool" && (
                  <div className="form-group">
                    <label className="form-label">Academic Year</label>
                    <div className="form-input-wrapper">
                      <span className="form-input-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                          <line x1="16" y1="2" x2="16" y2="6" />
                          <line x1="8" y1="2" x2="8" y2="6" />
                          <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                      </span>
                      <Select
                        options={yearOptions}
                        placeholder={<div>Select your year</div>}
                        onChange={(selectedOption) => {
                          setSelectedYear(selectedOption?.value || null);
                        }}
                        value={yearOptions.filter(({ value }) => value === selectedYear)}
                        isClearable
                        menuPosition={isMobile ? "absolute" : "fixed"}
                        menuPlacement={isMobile ? "top" : "auto"}
                        menuPortalTarget={isMobile ? undefined : document.body}
                        menuShouldScrollIntoView={isMobile}
                        classNamePrefix="auth-select"
                      />
                    </div>
                  </div>
                )}

                {signUpFormData.values.university_name === "Other/Highschool" && (
                  <div className="form-group">
                    <label className="form-label">School Name <span>*</span></label>
                    <div className="form-input-wrapper">
                      <span className="form-input-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                          <path d="M6 12v5c3 3 9 3 12 0v-5" />
                        </svg>
                      </span>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Enter School Name"
                        {...signUpFormData.getFieldProps("custom_school_name")}
                        onBlur={() => handleBlurValueUpdate("custom_school_name")}
                      />
                    </div>
                    {(signUpFormData.touched as any).custom_school_name && (signUpFormData.errors as any).custom_school_name
                      ? renderError((signUpFormData.errors as any).custom_school_name)
                      : null}
                  </div>
                )}


                <div className="form-group">
                  <label className="form-label">
                    Password <span>*</span>
                  </label>
                  <div className="form-input-wrapper">
                    <span className="form-input-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                    </span>
                    <input
                      autoComplete="new-password"
                      type={eyeToggle ? "text" : "password"}
                      className="form-input"
                      placeholder="Enter Password"
                      {...signUpFormData.getFieldProps("password")}
                      maxLength={MAX_32}
                    />
                    <button
                      type="button"
                      onClick={() => setEyeToggle(!eyeToggle)}
                      className="form-input-toggle"
                      aria-label={eyeToggle ? "Hide password" : "Show password"}
                    >
                      <svg
                        className="eye-icon"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{ color: eyeToggle ? "var(--primary)" : "var(--neutral-400)" }}
                      >
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    </button>
                  </div>
                  {signUpFormData.touched.password && signUpFormData.errors.password
                    ? renderError(signUpFormData.errors.password)
                    : null}
                </div>

                <button type="submit" className="signup-btn">
                  Sign Up
                </button>
              </form>

              <p className="auth-footer">
                Already have an account? <NavLink to={ENUMFORROUTES.LOGIN}>Log In</NavLink>
              </p>
            </div>
          </div>
        </div>
      ) : (
        <VerifySignupOtp otpDetailsObj={otpDetailsObj} setOtpDetailsObj={setOtpDetailsObj} />
      )}
    </>
  );
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Registeration);
