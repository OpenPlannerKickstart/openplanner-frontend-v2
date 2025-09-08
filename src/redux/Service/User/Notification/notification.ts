
import { get, post, put } from "../../../../Utility/httpInterceptor";
import { setLoading } from "../../../Loader/LoaderSlice";
import { AppDispatch } from "../../../store";
import { CLEAR_NOTIFICATION_API, GET_ALL_NOTIFICATION_API, GET_COUNT_OF_UNREAD_NOTIFICATION_API, READ_NOTIFICATION_API } from "../../../../Utility/ApiList";
import { clearNotificationFailure, clearNotificationSuccess, getAllNotificationFailure, getAllNotificationSuccess, getCountOfUnreadNotificationFailure, getCountOfUnreadNotificationSuccess, readNotificationFailure, readNotificationSuccess } from "../../../User/Notification/notification";



/**
* Get All notification Data
* @param {*} objBody
* @method getAllNotificationAPI
* @url notification/users
* @returns API will return notification Data
*/

export const getAllNotificationAPI =
    () =>
        async (dispatch: AppDispatch) => {

            dispatch(setLoading(true));
            try {
                const response: any = await get(GET_ALL_NOTIFICATION_API);
                if (!response.data.error) {
                    return dispatch(getAllNotificationSuccess(response.data.data));
                }
                else {
                    return dispatch(getAllNotificationFailure());
                }
            } catch (err) {
                //console.log(err)
                return dispatch(getAllNotificationFailure());
            } finally {
                dispatch(setLoading(false));
            }
        };



/**
* Get All count of unread notification Data
* @param {*} objBody
* @method getCountOfUnreadNotificationAPI
* @url notification/users/count
* @returns API will return count of unread notification Data
*/

export const getCountOfUnreadNotificationAPI =
    () =>
        async (dispatch: AppDispatch) => {

            dispatch(setLoading(true));
            try {
                const response: any = await get(GET_COUNT_OF_UNREAD_NOTIFICATION_API);
                if (!response.data.error) {
                    return dispatch(getCountOfUnreadNotificationSuccess(response.data.data.count));
                }
                else {
                    return dispatch(getCountOfUnreadNotificationFailure());
                }
            } catch (err) {
                //console.log(err)
                return dispatch(getCountOfUnreadNotificationFailure());
            } finally {
                dispatch(setLoading(false));
            }
        };

/**
* update read notification Data
* @param {*} objBody
* @method readNotificationAPI
* @url notification/read/${id}
* @returns API will return read notification Data
*/

export const readNotificationAPI =
    (objBody: any) =>
        async (dispatch: AppDispatch) => {

            dispatch(setLoading(true));
            try {
                const response: any = await post(READ_NOTIFICATION_API, objBody);
                if (!response.data.error) {
                    return dispatch(readNotificationSuccess(response.data.data));
                }
                else {
                    return dispatch(readNotificationFailure());
                }
            } catch (err) {
                //console.log(err)
                return dispatch(readNotificationFailure());
            } finally {
                dispatch(setLoading(false));
            }
        };

// /**
// * update read notification Data
// * @param {*} objBody
// * @method readAllNotificationAPI
// * @url notification/users/readAll
// * @returns API will return read notification Data
// */

// export const readAllNotificationAPI =
//     (objBody: any) =>
//         async (dispatch: AppDispatch) => {

//             dispatch(setLoading(true));
//             try {
//                 const response: any = await put(READ_ALL_NOTIFICATION_API, objBody);
//                 if (!response.data.error) {
//                     return dispatch(readAllNotificationSuccess(response.data.data));
//                 }
//                 else {
//                     return dispatch(readAllNotificationFailure());
//                 }
//             } catch (err) {
//                 //console.log(err)
//                 return dispatch(readAllNotificationFailure());
//             } finally {
//                 dispatch(setLoading(false));
//             }
//         };


/**
* update clear notification Data
* @param {*} objBody
* @method clearNotificationAPI
* @url notification/read/${id}
* @returns API will return clear notification Data
*/

export const clearNotificationAPI =
    (objBody: any) =>
        async (dispatch: AppDispatch) => {

            dispatch(setLoading(true));
            try {
                const response: any = await post(CLEAR_NOTIFICATION_API, objBody);
                if (!response.data.error) {
                    return dispatch(clearNotificationSuccess(response.data.data));
                }
                else {
                    return dispatch(clearNotificationFailure());
                }
            } catch (err) {
                //console.log(err)
                return dispatch(clearNotificationFailure());
            } finally {
                dispatch(setLoading(false));
            }
        };

// /**
// * update clear notification Data
// * @param {*} objBody
// * @method clearAllNotificationAPI
// * @url notification/clearAll
// * @returns API will return clear All notification Data
// */

// export const clearAllNotificationAPI =
//     (objBody: any) =>
//         async (dispatch: AppDispatch) => {

//             dispatch(setLoading(true));
//             try {
//                 const response: any = await put(CLEAR_ALL_NOTIFICATION_API, objBody);
//                 if (!response.data.error) {
//                     return dispatch(clearAllNotificationSuccess(response.data.data));
//                 }
//                 else {
//                     return dispatch(clearAllNotificationFailure());
//                 }
//             } catch (err) {
//                 //console.log(err)
//                 return dispatch(clearAllNotificationFailure());
//             } finally {
//                 dispatch(setLoading(false));
//             }
//         };