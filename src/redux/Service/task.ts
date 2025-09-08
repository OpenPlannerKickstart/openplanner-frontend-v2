import { ADD_EDIT_TASK_DATA_API, DELETE_TASK_DATA_API, GET_TASK_LIST_DATA_API, SEND_EMAIL_OTP_FOR_NEW_PASSWORD_DATA_API, SEND_NEW_PASSWORD_DATA_API, UPDATE_TASK_STATUS_DATA_API } from "../../Utility/ApiList";
import { ts } from "../../Utility/Toaster";
import { post } from "../../Utility/httpInterceptor";
import {
    addEditTaskFailure, addEditTaskSuccess,
    deleteTaskFailure, deleteTaskSuccess,
    getTaskListFailure, getTaskListSuccess,
    updateStatusFailure, updateStatusSuccess,
} from "../User/Task/taskSlice";
import { setLoading } from "../Loader/LoaderSlice";
import { AppDispatch } from "../store";

/**
 * addEdit Task
 * @param {*} objBody
 * @method addEditTaskAPI
 * @url /addEditTask
 * @returns API will add or edit task
 */
export const addEditTaskAPI =
    (objBody: any = undefined) =>
        async (dispatch: AppDispatch) => {
            dispatch(setLoading(true));
            try {
                const response: any = await post(ADD_EDIT_TASK_DATA_API, objBody);
                if (!response.data.error) {
                    ts(response.data.message)
                    return dispatch(addEditTaskSuccess(response.data.data));
                } else {
                    dispatch(addEditTaskFailure());
                }
            } catch (err) {
                dispatch(addEditTaskFailure());
            } finally {
                dispatch(setLoading(false));
            }
        };





/**
 * delete Task
 * @param {*} objBody
 * @method deleteTaskAPI
 * @url /deleteTask
 * @returns API will delete task by id
 */
export const deleteTaskAPI =
    (objBody: any = undefined) =>
        async (dispatch: AppDispatch) => {
            dispatch(setLoading(true));
            try {
                const response: any = await post(DELETE_TASK_DATA_API, objBody);
                if (!response.data.error) {
                    ts(response.data.message)
                    return dispatch(deleteTaskSuccess(response.data.data));
                } else {
                    dispatch(deleteTaskFailure());
                }
            } catch (err) {
                dispatch(deleteTaskFailure());
            } finally {
                dispatch(setLoading(false));
            }
        };



/**
 * upadteTaskStatus 
 * @param {*} objBody
 * @method upadteTaskStatusAPI
 * @url /upadteTaskStatus
 * @returns API will update status of task
 */
export const upadteTaskStatusAPI =
    (objBody: any = undefined) =>
        async (dispatch: AppDispatch) => {
            dispatch(setLoading(true));
            try {
                const response: any = await post(UPDATE_TASK_STATUS_DATA_API, objBody);
                if (!response.data.error) {
                    ts(response?.data?.message)
                    return dispatch(updateStatusSuccess(response.data.data));
                } else {
                    dispatch(updateStatusFailure());
                }
            } catch (err) {
                dispatch(updateStatusFailure());
            } finally {
                dispatch(setLoading(false));
            }
        };



/**
 * taskListing Task
 * @param {*} objBody
 * @method taskListingAPI
 * @url /taskListing
 * @returns API will return login token and redirect to dashboard
 */
export const taskListingAPI =
    (objBody: any = undefined) =>
        async (dispatch: AppDispatch) => {
            dispatch(setLoading(true));
            try {
                const response: any = await post(GET_TASK_LIST_DATA_API, objBody);
                if (!response.data.error) {
                    return dispatch(getTaskListSuccess(response.data.data));
                } else {
                    dispatch(getTaskListFailure());
                }
            } catch (err) {
                dispatch(getTaskListFailure());
            } finally {
                dispatch(setLoading(false));
            }
        };