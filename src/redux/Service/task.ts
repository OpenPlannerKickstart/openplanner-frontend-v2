import { ADD_EDIT_TASK_DATA_API, DELETE_TASK_DATA_API, GET_TASK_LIST_DATA_API, SEND_EMAIL_OTP_FOR_NEW_PASSWORD_DATA_API, SEND_NEW_PASSWORD_DATA_API, UPDATE_TASK_STATUS_DATA_API, UPDATE_TASK_STAR_API } from "../../Utility/ApiList";
import { ts } from "../../Utility/Toaster";
import { post } from "../../Utility/httpInterceptor";
import {
    addEditTaskFailure, addEditTaskSuccess,
    deleteTaskFailure, deleteTaskSuccess,
    getTaskListFailure, getTaskListSuccess,
    updateStatusFailure, updateStatusSuccess,
    updateStarSuccess, updateStarFailure,
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
                    // Intentionally no success toast for complete/uncomplete.
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

/**
 * updateTaskStar - Star/unstar a task
 * @param {*} objBody - { task_id: number, is_starred?: boolean }
 * @method updateTaskStarAPI
 * @url /updateTaskStar
 * @returns API will update is_starred on the task
 */
export const updateTaskStarAPI =
    (objBody: any = undefined) =>
        async (dispatch: AppDispatch) => {
            dispatch(setLoading(true));
            const taskId = Array.isArray(objBody?.task_id) ? objBody?.task_id?.[0] : (objBody?.task_id ?? objBody?.id);
            const hasIsStarred = Object.prototype.hasOwnProperty.call(objBody ?? {}, "is_starred");
            const isStarred = objBody?.is_starred;

            const trySuccess = (resp: any) => {
                if (resp && !resp.data?.error) return dispatch(updateStarSuccess(resp.data.data));
                return undefined;
            };

            try {
                // 1) Prefer REST endpoint: POST /tasks/:id/star
                if (taskId) {
                    const restResp: any = await post(
                        `tasks/${taskId}/star`,
                        hasIsStarred ? { is_starred: isStarred } : undefined as any
                    );
                    const ok = trySuccess(restResp);
                    if (ok) return ok;
                }

                // 2) Legacy endpoint: POST /updateTaskStar (try both body shapes)
                // Some BE validators accept { task_id }, others accept { id }.
                if (taskId) {
                    // Many validators require ids to be arrays
                    const legacy1: any = await post(
                        UPDATE_TASK_STAR_API,
                        hasIsStarred ? { task_id: [taskId], is_starred: isStarred } : { task_id: [taskId] }
                    );
                    const ok1 = trySuccess(legacy1);
                    if (ok1) return ok1;

                    const legacy2: any = await post(
                        UPDATE_TASK_STAR_API,
                        hasIsStarred ? { id: [taskId], is_starred: isStarred } : { id: [taskId] }
                    );
                    const ok2 = trySuccess(legacy2);
                    if (ok2) return ok2;
                }

                // 3) Last resort: pass through whatever caller sent
                const legacy3: any = await post(UPDATE_TASK_STAR_API, objBody);
                const ok3 = trySuccess(legacy3);
                if (ok3) return ok3;

                dispatch(updateStarFailure());
            } catch (err) {
                dispatch(updateStarFailure());
            } finally {
                dispatch(setLoading(false));
            }
        };