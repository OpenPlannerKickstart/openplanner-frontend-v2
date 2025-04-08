import { SEND_EMAIL_OTP_FOR_NEW_PASSWORD_DATA_API, SEND_NEW_PASSWORD_DATA_API } from "../../../Utility/ApiList";
import { post } from "../../../Utility/httpInterceptor";
import {  sendEmailOtpForPasswordFailure, sendEmailOtpForPasswordSuccess, sendNewPasswordDataFailure, sendNewPasswordDataSuccess } from "../../auth/ForgotPassword/forgotPasswordSlice";
import { setLoading } from "../../Loader/LoaderSlice";
import { AppDispatch } from "../../store";

/**
 * Send Email Otp 
 * @param {*} objBody
 * @method sendForgotPasswordEmailOtp
 * @url /resendConfirmSignupOtp
 * @returns API will return login token and redirect to dashboard
 */
export const sendForgotPasswordEmailOtp =
  (objBody: any = undefined) =>
  async (dispatch: AppDispatch) => {
    dispatch(setLoading(true));
   
    try {
      const response: any = await post(SEND_EMAIL_OTP_FOR_NEW_PASSWORD_DATA_API, objBody);
      if (!response.data.error) {       
        return  dispatch(sendEmailOtpForPasswordSuccess(response.data.data));
      } else {
        dispatch(sendEmailOtpForPasswordFailure());
      }
    } catch (err) {
      dispatch(sendEmailOtpForPasswordFailure());
    } finally {
      dispatch(setLoading(false));
    }
  };
/**
 * Send New Password Data
 * @param {*} objBody
 * @method sendNewPasswordData
 * @url /resendConfirmSignupOtp
 * @returns API will Sucess
 */
export const sendNewPasswordDataAPI =
  (objBody: any = undefined) =>
  async (dispatch: AppDispatch) => {
    dispatch(setLoading(true));
   
    try {
      const response: any = await post(SEND_NEW_PASSWORD_DATA_API, objBody);
      if (!response.data.error) {       
        return  dispatch(sendNewPasswordDataSuccess(response.data.data));
      } else {
        dispatch(sendNewPasswordDataFailure());
      }
    } catch (err) {
      dispatch(sendNewPasswordDataFailure());
    } finally {
      dispatch(setLoading(false));
    }
  };