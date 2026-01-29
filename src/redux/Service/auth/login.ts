import { post } from "../../../Utility/httpInterceptor";
import { GET_LOGIN_DATA_API } from "../../../Utility/ApiList";
import { AppDispatch } from "../../store";
import { getLoginFailure, getLoginSuccess } from "../../auth/Login/loginSlice";
import { setLoading } from "../../Loader/LoaderSlice";
import { deleteAllCookies, setPlannerIDToken, setPlannerRefreshToken, setPlannerToken } from "../../../Utility/Helper";
import { queryClient } from "../../../lib/queryClient";

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
      dispatch(setLoading(true));
      // setTimeout(() => {
      //   dispatch(setLoading(false));
      // }, 2000);
      try {
        const response: any = await post(GET_LOGIN_DATA_API, objBody);
        if (!response.data.error) {
          const payload = response.data.data || {};
          const accessToken = payload.AccessToken || payload.AuthenticationResult?.AccessToken;
          const idToken = payload.IdToken || payload.AuthenticationResult?.IdToken;
          const refreshToken = payload.RefreshToken || payload.AuthenticationResult?.RefreshToken;

          if (payload.isVerify && accessToken && idToken && refreshToken) {
            // Persist Cognito tokens so subsequent calls (e.g., redeem) have Authorization
            setPlannerToken(accessToken);
            setPlannerIDToken(idToken);
            setPlannerRefreshToken(refreshToken);
            // Debug prefix to validate presence in dev
            // eslint-disable-next-line no-console
            console.log('login tokens', accessToken.slice(0,10), idToken.slice(0,10));
          }

          // cache subscription flag for route guards
          try {
            localStorage.setItem('has_subscription', String(!!payload.isSubscription));
            if (payload.isSubscription) {
              localStorage.removeItem('plan_tier');
            }
            // Note: Don't set plan_tier here - it's set when user explicitly chooses freemium
          } catch {}
          return dispatch(getLoginSuccess(payload));
        }
      }
      catch (err) {
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
  deleteAllCookies();
  try {
    localStorage.removeItem('has_subscription');
    localStorage.removeItem('plan_tier');
  } catch {}
  
  // SECURITY: Clear React Query cache to prevent cross-user data bleed
  queryClient.clear();
  
  dispatch(setLoading(true));
  setTimeout(() => {
    dispatch(setLoading(false));
  }, 2000);
};
