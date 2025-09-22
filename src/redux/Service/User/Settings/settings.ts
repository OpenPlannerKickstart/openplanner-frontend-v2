import {
    GET_USER_API,
    UPDATE_USER_API,
    DELETE_USER_API,
    CHANGE_PASSWORD_API,
    NOTIFICATION_SETTING,
    GET_NOTIFICATION_SETTINGS_API,
    TRANSACTION_LISTING,
    CANCEL_TRANSACTION,
    UPDATE_PLAN,
    PLAN_MASTER,
    PARENTS_CREATE_SESSION,
    PARENTS_CODES_BY_SESSION,
} from "../../../../Utility/ApiList";
import { get, post } from "../../../../Utility/httpInterceptor";
import {
    getUserSuccess,
    getUserFailure,
    updateUserSuccess,
    updateUserFailure,
    deleteUserSuccess,
    deleteUserFailure,
    changePasswordSuccess,
    changePasswordFailure,
    updateSettingsSuccess,
    updateSettingsFailure,
    getSettingsDataSuccess,
    getSettingsDataFailure,
    getTransactionSuccess,
    getTransactionFailure,
    cancelSubscriptionSuccess,
    cancelSubscriptionFailure,
    updatePlanSuccess,
    updatePlanFailure,
} from "../../../User/Settings/settingsSlice"; // Adjust path based on your folder structure
import { setLoading } from "../../../Loader/LoaderSlice";
import { AppDispatch } from "../../../store";
import { ts } from "../../../../Utility/Toaster";

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
                    ts(response?.data?.message)
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


// Parents purchase flow services
export const parentsCreateSessionAPI =
    (objBody: any) =>
        async (dispatch: AppDispatch) => {
            dispatch(setLoading(true));
            try {
                const response: any = await post(PARENTS_CREATE_SESSION, objBody);
                if (!response.data.error) {
                    return response.data.data; // { url, id }
                }
            } catch (err) {
                // surface error upward
                throw err;
            } finally {
                dispatch(setLoading(false));
            }
        };

export const parentsGetCodesBySessionAPI =
    (sessionId: string) =>
        async (dispatch: AppDispatch) => {
            try {
                const response: any = await get(`${PARENTS_CODES_BY_SESSION}/${sessionId}`);
                return response.data.data; // { session_id, codes: [...] }
            } catch (err) {
                throw err;
            }
        };


/**
 * setting Notification 
 * @param {*} objBody
 * @method notificationSettingAPI
 * @url /addEditNotificationSetting
 * @returns addEditNotificationSetting 
 */
export const notificationSettingAPI =
    (objBody: any = undefined) =>
        async (dispatch: AppDispatch) => {
            dispatch(setLoading(true));
            try {
                const response: any = await post(NOTIFICATION_SETTING, objBody);
                if (!response.data.error) {
                    ts(response?.data?.message)
                    return dispatch(updateSettingsSuccess(response.data.data));
                } else {
                    dispatch(updateSettingsFailure());
                }
            } catch (err) {
                dispatch(updateSettingsFailure());
            } finally {
                dispatch(setLoading(false));
            }
        };
/**
 * setting Notification get data
 * @param {*} objBody
 * @method notificationSettingAPI
 * @url /addEditNotificationSetting
 * @returns addEditNotificationSetting 
 */
export const getNotificationSettingAPI =
    (objBody: any = undefined) =>
        async (dispatch: AppDispatch) => {
            dispatch(setLoading(true));
            try {
                const response: any = await get(GET_NOTIFICATION_SETTINGS_API);
                if (!response.data.error) {
                    // ts(response?.data?.message)
                    return dispatch(getSettingsDataSuccess(response.data.data));
                } else {
                    dispatch(getSettingsDataFailure());
                }
            } catch (err) {
                dispatch(getSettingsDataFailure());
            } finally {
                dispatch(setLoading(false));
            }
        };

export const getTransactionAPI =
    (objBody: any = undefined) =>
        async (dispatch: AppDispatch) => {
            dispatch(setLoading(true));
            try {
                const response: any = await get(TRANSACTION_LISTING);
                if (!response.data.error) {
                    return dispatch(getTransactionSuccess(response.data.data));
                } else {
                    dispatch(getTransactionFailure());
                }
            } catch (err) {
                dispatch(getUserFailure());
            } finally {
                dispatch(setLoading(false));
            }
        };

export const cancelSubscriptionAPI =
    (objBody: any = undefined) =>
        async (dispatch: AppDispatch) => {
            dispatch(setLoading(true));
            try {
                const response: any = await get(CANCEL_TRANSACTION);
                if (!response.data.error) {
                    ts(response?.data?.message)
                    return dispatch(cancelSubscriptionSuccess(response.data.data));
                } else {
                    dispatch(cancelSubscriptionFailure());
                }
            } catch (err) {
                dispatch(cancelSubscriptionFailure());
            } finally {
                dispatch(setLoading(false));
            }
        };


export const updatePlanAPI =
    (objBody: any = undefined) =>
        async (dispatch: AppDispatch) => {
            dispatch(setLoading(true));
            try {
                const response: any = await post(UPDATE_PLAN, objBody);
                if (!response.data.error) {
                    ts(response?.data?.message)
                    return dispatch(updatePlanSuccess(response.data.data));
                } else {
                    dispatch(updatePlanFailure());
                }
            } catch (err) {
                dispatch(updatePlanFailure());
            } finally {
                dispatch(setLoading(false));
            }
        };

export const getAllPlanAPI =
    (objBody: any = undefined) =>
        async (dispatch: AppDispatch) => {
            dispatch(setLoading(true));
            try {
                const response: any = await post(PLAN_MASTER, objBody);
                if (!response.data.error) {
                    // ts(response?.data?.message)
                    return dispatch(updatePlanSuccess(response.data.data));
                } else {
                    dispatch(updatePlanFailure());
                }
            } catch (err) {
                dispatch(updatePlanFailure());
            } finally {
                dispatch(setLoading(false));
            }
        };