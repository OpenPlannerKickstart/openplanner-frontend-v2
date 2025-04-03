import { post } from "../../../Utility/httpInterceptor";
import { GET_LOGIN_DATA_API } from "../../../Utility/ApiList";
import { AppDispatch } from "../../store";
import { getLoginFailure, getLoginSuccess } from "../../auth/Login/loginSlice";
import { setLoading } from "../../Loader/LoaderSlice";

/**
 * Login
 * @param {*} objBody
 * @method loginToSystem
 * @url /login/verify
 * @returns API will return login token and redirect to dashboard
 */
export const loginToSystem =
  (objBody: any = undefined) =>
  async (dispatch: AppDispatch) => {
    // dispatch(setLoading(true));
    // setTimeout(() => {
    //   dispatch(setLoading(false));
    // }, 2000);
    try {
      const response: any = await post(GET_LOGIN_DATA_API, objBody);
      if (!response.data.error) {
        dispatch(getLoginSuccess(objBody));
      } else {
        dispatch(getLoginFailure());
      }
    } catch (err) {
      dispatch(getLoginFailure());
    } finally {
      dispatch(setLoading(false));
    }
  };

/**
 * Logout
 * @method logoutFromSystem
 */
export const logoutFromSystem = () => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));
  setTimeout(() => {
    dispatch(setLoading(false));
  }, 2000);
};
