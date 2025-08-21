import { ADD_OTHER_UNIVERSITY_NAME_API, CREATE_CHECKOUT_API, GET_REGISTER_DATA_API, GET_RESEND_USER_OTP_DATA_API, GET_UNIVERSITY_LIST_API, GET_VERIFY_USER_OTP_DATA_API } from "../../../Utility/ApiList";
import { get, post } from "../../../Utility/httpInterceptor";
import { ts } from "../../../Utility/Toaster";
import { addUniversityFailure, addUniversitySuccess, createCheckOutSessionFailure, createCheckOutSessionSuccess, getSignupFailure, getSignupSuccess, getUniversityListFailure, getUniversityListSuccess, sendSignUpEmailOtpFailure, sendSignUpEmailOtpSuccess, verfiySignUpEmailOtpFailure, verfiySignUpEmailOtpSuccess } from "../../auth/Signup/signupSlice";
import { setLoading } from "../../Loader/LoaderSlice";
import { AppDispatch } from "../../store";

/**
 * Signup
 * @param {*} objBody
 * @method signupToSystem
 * @url /login/verify
 * @returns API will return login token and redirect to dashboard
 */
export const signupToSystem =
  (objBody: any = undefined) =>
    async (dispatch: AppDispatch) => {
      dispatch(setLoading(true));
      // setTimeout(() => {
      //   dispatch(setLoading(false));
      // }, 2000);
      try {
        const response: any = await post(GET_REGISTER_DATA_API, objBody);
        if (!response.data.error) {
          return dispatch(getSignupSuccess(response.data.data));
        } else {
          dispatch(getSignupFailure());
        }
      } catch (err) {
        dispatch(getSignupFailure());
      } finally {
        dispatch(setLoading(false));
      }
    };


/**
 * Send Email Otp 
 * @param {*} objBody
 * @method sendSignupEmailOtp
 * @url /resendConfirmSignupOtp
 * @returns API will return login token and redirect to dashboard
 */
export const sendSignupEmailOtp =
  (objBody: any = undefined) =>
    async (dispatch: AppDispatch) => {
      dispatch(setLoading(true));

      try {
        const response: any = await post(GET_RESEND_USER_OTP_DATA_API, objBody);
        if (!response.data.error) {
          ts(response.data?.message);
          return dispatch(sendSignUpEmailOtpSuccess(response.data.data));
        } else {
          dispatch(sendSignUpEmailOtpFailure());
        }
      } catch (err) {
        dispatch(sendSignUpEmailOtpFailure());
      } finally {
        dispatch(setLoading(false));
      }
    };
/**
 * Verify Email Otp 
 * @param {*} objBody
 * @method verifySignupEmailOtp
 * @url /verifySignUp
 * @returns API will return login token and redirect to dashboard
 */
export const verifySignupEmailOtp =
  (objBody: any = undefined) =>
    async (dispatch: AppDispatch) => {
      dispatch(setLoading(true));

      try {
        const response: any = await post(GET_VERIFY_USER_OTP_DATA_API, objBody);
        if (!response.data.error) {
          ts(response.data.message)
          return dispatch(verfiySignUpEmailOtpSuccess(response.data.data));
        } else {
          dispatch(verfiySignUpEmailOtpFailure());
        }
      } catch (err) {
        dispatch(verfiySignUpEmailOtpFailure());
      } finally {
        dispatch(setLoading(false));
      }
    };


    export const getUniversityListAPI =
    (objBody: any = undefined) =>
      async (dispatch: AppDispatch) => {
        dispatch(setLoading(true));
  
        try {
          const response: any = await get(GET_UNIVERSITY_LIST_API);
          if (!response.data.error) {
            // ts(response.data.message)
            return dispatch(getUniversityListSuccess(response.data.data));
          } else {
            dispatch(getUniversityListFailure());
          }
        } catch (err) {
          dispatch(getUniversityListFailure());
        } finally {
          dispatch(setLoading(false));
        }
    };
      

    export const addUniversityAPI =
    (objBody: any = undefined) =>
      async (dispatch: AppDispatch) => {
        dispatch(setLoading(true));
  
        try {
          const response: any = await post(ADD_OTHER_UNIVERSITY_NAME_API, objBody);
          if (!response.data.error) {
            ts(response.data.message)
            return dispatch(addUniversitySuccess(response.data.data));
          } else {
            dispatch(addUniversityFailure());
          }
        } catch (err) {
          dispatch(addUniversityFailure());
        } finally {
          dispatch(setLoading(false));
        }
      };


    export const createCheckOutAPI =
    (objBody: any = undefined) =>
      async (dispatch: AppDispatch) => {
        dispatch(setLoading(true));
  
        try {
          const response: any = await post(CREATE_CHECKOUT_API, objBody);
          if (!response.data.error) {
            // ts(response.data.message)
            return dispatch(createCheckOutSessionSuccess(response.data.data));
          } else {
            dispatch(createCheckOutSessionFailure());
          }
        } catch (err) {
          dispatch(createCheckOutSessionFailure());
        } finally {
          dispatch(setLoading(false));
        }
      };