import {
    GET_USER_API,
    UPDATE_USER_API,
    DELETE_USER_API,
    CHANGE_PASSWORD_API,
} from "../../Utility/ApiList";
import { get, post } from "../../Utility/httpInterceptor";
import {
    getUserSuccess,
    getUserFailure,
    updateUserSuccess,
    updateUserFailure,
    deleteUserSuccess,
    deleteUserFailure,
    changePasswordSuccess,
    changePasswordFailure,
} from "../Settings/settingsSlice"; // Adjust path based on your folder structure
import { setLoading } from "../Loader/LoaderSlice";
import { AppDispatch } from "../store";
import { ts } from "../../Utility/Toaster";

/**
 * Fetch User Data
 * @param {*} objBody
 * @method getUserAPI
 * @url /getUser
 * @returns User Data
 */
export const getUserAPI =
    (objBody: any = undefined) =>
        async (dispatch: AppDispatch) => {
            dispatch(setLoading(true));
            try {
                const response: any = await get(GET_USER_API);
                if (!response.data.error) {
                    return dispatch(getUserSuccess(response.data.data));
                } else {
                    dispatch(getUserFailure());
                }
            } catch (err) {
                dispatch(getUserFailure());
            } finally {
                dispatch(setLoading(false));
            }
        };

/**
 * Update User Data
 * @param {*} objBody
 * @method updateUserAPI
 * @url /updateUser
 * @returns Updated User Response
 */
export const updateUserAPI =
    (objBody: any = undefined) =>
        async (dispatch: AppDispatch) => {
            dispatch(setLoading(true));
            try {
                const response: any = await post(UPDATE_USER_API, objBody);
                if (!response.data.error) {
                    return dispatch(updateUserSuccess(response.data.data));
                } else {
                    dispatch(updateUserFailure());
                }
            } catch (err) {
                dispatch(updateUserFailure());
            } finally {
                dispatch(setLoading(false));
            }
        };

/**
 * Delete User
 * @param {*} objBody
 * @method deleteUserAPI
 * @url /deleteUser
 * @returns Deletion Response
 */
export const deleteUserAPI =
    (objBody: any = undefined) =>
        async (dispatch: AppDispatch) => {
            dispatch(setLoading(true));
            try {
                const response: any = await post(DELETE_USER_API, objBody);
                if (!response.data.error) {
                    ts(response?.data.message)
                    return dispatch(deleteUserSuccess(response.data.data));
                } else {
                    dispatch(deleteUserFailure());
                }
            } catch (err) {
                dispatch(deleteUserFailure());
            } finally {
                dispatch(setLoading(false));
            }
        };

/**
 * Change Password
 * @param {*} objBody
 * @method changePasswordAPI
 * @url /changePassword
 * @returns Password Change Response
 */
export const changePasswordAPI =
    (objBody: any = undefined) =>
        async (dispatch: AppDispatch) => {
            dispatch(setLoading(true));
            try {
                const response: any = await post(CHANGE_PASSWORD_API, objBody);
                if (!response.data.error) {
                    ts(response?.data?.message)
                    return dispatch(changePasswordSuccess(response.data.data));
                } else {
                    dispatch(changePasswordFailure());
                }
            } catch (err) {
                dispatch(changePasswordFailure());
            } finally {
                dispatch(setLoading(false));
            }
        };
