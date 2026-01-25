import React, { useEffect, useState } from "react";
import { connect, useDispatch } from "react-redux";
import { FormikTouched, FormikValues, setNestedObjectValues, useFormik } from "formik";
import { NavLink, useNavigate } from "react-router-dom";
import * as yup from "yup";

import "../AuthPage.css";
import sidebarLogoLg from '../../../assets/images/sidebar-logo-lg.svg';

import { AppDispatch } from "../../../redux/store";
import { loginToSystem } from "../../../redux/Service/auth/login";
import { getSubscriptionStatusAPI } from "../../../redux/Service/User/Settings/settings";
import { customJsonInclude, isEmptyObjectOrNullUndefiend, renderError } from "../../../Utility/Helper";
import { ENUMFORROUTES } from "../../../interfaces/enum";
import { LoginData } from "../../../interfaces";
import {
  MAX_32,
  MAX_50,
  PASSWORD_INVALID,
  PATTERN_FOR_EMAIL_OR_USERNAME,
  PATTERN_FOR_PASSWORD_NEW,
} from "../../../Utility/Validation_Helper";
import {
  PASSWORD_REQUIRED,
  USERNAME_EMAIL_IS_REQUIRED,
  USERNAME_EMAIL_VALIDATION,
} from "../../../Utility/Validation_Message";
import { sendSignupEmailOtp } from "../../../redux/Service/auth/signup";
import VerifySignupOtp from "../Registration/VerifySignupOtp";
import { savedLoginDataSuccess } from "../../../redux/auth/Signup/signupSlice";

/**
 * Login Component
 * @param {object} props - Props passed to the component
 * @returns {JSX.Element} JSX element representing the Login component
 */

const Login = (props) => {
  const navigate = useNavigate();
  const [eyeToggle, setEyeToggle] = useState<boolean>(false);
  const dispatch: AppDispatch = useDispatch();
  const [otpDetailsObj, setOtpDetailsObj] = useState<any>({} as any);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [showAppPromo, setShowAppPromo] = useState<boolean>(false);

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

  useEffect(() => {
    const dismissed = localStorage.getItem("openPlannerAppPromoDismissed");
    setShowAppPromo(!dismissed);
  }, []);

  const initLoginValues: LoginData = {
    identifier: "",
    password: "",
  };
  const [savedLoginFormData, setSavedLoginFormData] = useState(initLoginValues);
  const onSubmitForLogin = async (values, onSubmitProps) => {};

  const validationSchemaForLogin = yup.object({
    identifier: yup
      .string()
      .trim()
      .matches(PATTERN_FOR_EMAIL_OR_USERNAME, USERNAME_EMAIL_VALIDATION)
      .required(USERNAME_EMAIL_IS_REQUIRED),

    password: yup
      .string()
      .matches(PATTERN_FOR_PASSWORD_NEW, PASSWORD_INVALID)
      .required(PASSWORD_REQUIRED),
  });

  const loginFormData = useFormik({
    initialValues: savedLoginFormData || initLoginValues,
    onSubmit: onSubmitForLogin,
    validationSchema: validationSchemaForLogin,
  });

  const handleBlurValueUpdate = (key) => {
    loginFormData.setFieldValue(key, loginFormData.values[key].trim());
    setTimeout(() => {
      loginFormData.setFieldTouched(key, true);
    }, 100);
  };

  const handleLoginData = async () => {
    loginFormData.handleSubmit();
    const loginFormDataErrors = await loginFormData.validateForm();
    if (Object.keys(loginFormDataErrors).length > 0) {
      loginFormData.setTouched(
        setNestedObjectValues<FormikTouched<FormikValues>>(loginFormDataErrors, true)
      );
      return;
    }

    const reqBody = {
      identifier: loginFormData.values.identifier,
      password: loginFormData.values.password,
    };
    customJsonInclude(reqBody);
    const response = await dispatch(loginToSystem(reqBody));

    if (response) {
      if (!response?.payload?.isVerify) {
        const sendEmailOtpReqBody = {
          username: `${response?.payload?.username}`,
        };
        const sendEmailOtpResponse = await dispatch(sendSignupEmailOtp(sendEmailOtpReqBody));
        if (sendEmailOtpResponse) {
          setOtpDetailsObj({
            isFromLogin: true,
            detailsObj: {
              ...reqBody,
              username: `${response?.payload?.username}`,
            },
          });
        }
        return;
      }

      if (!response?.payload?.isSubscription) {
        if (response?.payload) {
          dispatch(savedLoginDataSuccess(response.payload));
        }
        navigate(ENUMFORROUTES.PLAN_DETAILS, { state: response?.payload });
        return;
      }
      navigate(ENUMFORROUTES.DASHBOARD);
    }
  };

  useEffect(() => {
    if (!isEmptyObjectOrNullUndefiend(otpDetailsObj?.detailsObj)) {
      setSavedLoginFormData(otpDetailsObj?.detailsObj);
    }
  }, [otpDetailsObj]);

  const handleKeyPress = (event) => {
    if (event.keyCode === 13) {
      event.preventDefault();
      handleLoginData();
    }
  };

  const brandLogo = isDarkMode ? sidebarLogoLg : "/assets/logo.png";
  const handleDismissAppPromo = () => {
    localStorage.setItem("openPlannerAppPromoDismissed", "1");
    setShowAppPromo(false);
  };

  return (
    <>
      {isEmptyObjectOrNullUndefiend(otpDetailsObj) ? (
        <div className="auth-page">
          <div className="auth-left-features">
            <a href="https://open-planner.com/" className="auth-logo-left" target="_blank" rel="noreferrer">
              <img src={brandLogo} alt="Open Planner" />
            </a>

            <h2 className="auth-left-title">Get Started With Us</h2>

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

            <div className="auth-calendar-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11zM9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm-8 4H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z" />
              </svg>
            </div>

            <p className="auth-legal-footer">
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

          <div className="auth-right-form">
            <div className="auth-form-container">
              <a href="https://open-planner.com/" className="auth-mobile-logo" target="_blank" rel="noreferrer">
                <img src={brandLogo} alt="Open Planner" />
              </a>

              <div className="auth-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>

              <div className="auth-header">
                <h1>Log in to Open Planner</h1>
              </div>

              <form
                className="auth-form"
                onSubmit={(event) => {
                  event.preventDefault();
                  handleLoginData();
                }}
              >
                <div className="form-group">
                  <label className="form-label">
                    Username/Email <span>*</span>
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
                      {...loginFormData.getFieldProps("identifier")}
                      maxLength={MAX_50}
                      onKeyDown={(event) => {
                        handleKeyPress(event);
                      }}
                      onBlur={() => {
                        handleBlurValueUpdate("identifier");
                      }}
                    />
                  </div>
                  {loginFormData.touched.identifier && loginFormData.errors.identifier
                    ? renderError(loginFormData.errors.identifier)
                    : null}
                </div>

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
                      type={eyeToggle ? "text" : "password"}
                      className="form-input"
                      placeholder="Enter Password"
                      {...loginFormData.getFieldProps("password")}
                      maxLength={MAX_32}
                      onKeyDown={(event) => {
                        handleKeyPress(event);
                      }}
                    />
                    <button
                      type="button"
                      className="form-input-toggle"
                      onClick={() => setEyeToggle(!eyeToggle)}
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
                  {loginFormData.touched.password && loginFormData.errors.password
                    ? renderError(loginFormData.errors.password)
                    : null}
                </div>

                <div className="form-forgot">
                  <NavLink to={ENUMFORROUTES.FORGOTPASSWORD}>Forgot Password?</NavLink>
                </div>

                <button type="submit" className="login-btn">
                  Log in
                </button>
              </form>

              <p className="auth-footer">
                Don't have an account? <NavLink to={ENUMFORROUTES.REGISTRATION}>Register Here</NavLink>
              </p>
            </div>
          </div>
          {showAppPromo ? (
            <div className="auth-app-promo" role="dialog" aria-live="polite">
              <div className="auth-app-promo-content">
                <div className="auth-app-promo-text">
                  <p className="auth-app-promo-title">Check out the Open Planner app</p>
                  <p className="auth-app-promo-subtitle">Get reminders and manage assignments on the go.</p>
                </div>
                <a
                  className="auth-app-promo-link"
                  href="https://apps.apple.com/us/app/open-planner/id6615063437"
                  target="_blank"
                  rel="noreferrer"
                >
                  View in App Store
                </a>
              </div>
              <button
                type="button"
                className="auth-app-promo-dismiss"
                onClick={handleDismissAppPromo}
                aria-label="Dismiss app promo"
              >
                Dismiss
              </button>
            </div>
          ) : null}
        </div>
      ) : (
        <VerifySignupOtp
          otpDetailsObj={otpDetailsObj}
          setOtpDetailsObj={setOtpDetailsObj}
          handleLoginData={handleLoginData}
        />
      )}
    </>
  );
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {
  loginToSystem,
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
