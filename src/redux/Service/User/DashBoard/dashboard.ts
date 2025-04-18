import {
    DASHBOARD_LISTING_COUNT_API,
    DASHBOARD_COURSES_DATA_API,
    DASHBOARD_TASKS_DATA_API,
    DASHBOARD_EVENTS_DATA_API,
    DASHBOARD_EVENT_LISTING_API,
    GET_SYLLABUS_DROPDOWN_API,
    DELETE_EVENT_DATA_API,
    UPDATE_EVENT_STATUS_DATA_API,
} from "../../../../Utility/ApiList";
import { get, post } from "../../../../Utility/httpInterceptor";
import { ts } from "../../../../Utility/Toaster";
import {
    dashboardListingCountSuccess,
    dashboardListingCountFailure,
    dashboardCoursesDataSuccess,
    dashboardCoursesDataFailure,
    dashboardTasksDataSuccess,
    dashboardTasksDataFailure,
    dashboardEventsDataSuccess,
    dashboardEventsDataFailure,
    dashboardEventListingSuccess,
    dashboardEventListingFailure,
    getSyllabusDropDownSuccess,
    getSyllabusDropDownFailure,
    deleteEventSuccess,
    deleteEventFailure,
    updateEventStatusSuccess,
    updateEventStatusFailure,
} from "../../../User/Dashboard/dashboardSlice"; // Adjust path based on your folder structure
import { setLoading } from "../../../Loader/LoaderSlice";
import { AppDispatch } from "../../../store";

/**
 * Fetch Dashboard Listing Count
 * @method dashboardListingCountAPI
 * @url /dashboardListingCount
 */
export const dashboardListingCountAPI = (objBody: any = undefined) => async (dispatch: AppDispatch) => {
    dispatch(setLoading(true));
    try {
        const response: any = await get(DASHBOARD_LISTING_COUNT_API);
        if (!response.data.error) {
            return dispatch(dashboardListingCountSuccess(response.data.data));
        } else {
            dispatch(dashboardListingCountFailure());
        }
    } catch (err) {
        dispatch(dashboardListingCountFailure());
    } finally {
        dispatch(setLoading(false));
    }
};

/**
 * Fetch Dashboard Courses Data
 * @method dashboardCoursesDataAPI
 * @url /dashboardCoursesData
 */
export const dashboardCoursesDataAPI = (objBody: any = undefined) => async (dispatch: AppDispatch) => {
    dispatch(setLoading(true));
    try {
        const response: any = await post(DASHBOARD_COURSES_DATA_API, objBody);
        if (!response.data.error) {
            return dispatch(dashboardCoursesDataSuccess(response.data.data));
        } else {
            dispatch(dashboardCoursesDataFailure());
        }
    } catch (err) {
        dispatch(dashboardCoursesDataFailure());
    } finally {
        dispatch(setLoading(false));
    }
};

/**
 * Fetch Dashboard Tasks Data
 * @method dashboardTasksDataAPI
 * @url /dashboardTasksData
 */
export const dashboardTasksDataAPI = (objBody: any = undefined) => async (dispatch: AppDispatch) => {
    dispatch(setLoading(true));
    try {
        const response: any = await post(DASHBOARD_TASKS_DATA_API, objBody);
        if (!response.data.error) {
            return dispatch(dashboardTasksDataSuccess(response.data.data));
        } else {
            dispatch(dashboardTasksDataFailure());
        }
    } catch (err) {
        dispatch(dashboardTasksDataFailure());
    } finally {
        dispatch(setLoading(false));
    }
};

/**
 * Fetch Dashboard Events Data
 * @method dashboardEventsDataAPI
 * @url /dashboardEventsData
 */
export const dashboardEventsDataAPI = (objBody: any = undefined) => async (dispatch: AppDispatch) => {
    dispatch(setLoading(true));
    try {
        const response: any = await post(DASHBOARD_EVENTS_DATA_API, objBody);
        if (!response.data.error) {
            return dispatch(dashboardEventsDataSuccess(response.data.data));
        } else {
            dispatch(dashboardEventsDataFailure());
        }
    } catch (err) {
        dispatch(dashboardEventsDataFailure());
    } finally {
        dispatch(setLoading(false));
    }
};

/**
 * Fetch Dashboard Event Listing
 * @method dashboardEventListingAPI
 * @url /dashboardEventListing
 */
export const dashboardEventListingAPI = (objBody: any = undefined) => async (dispatch: AppDispatch) => {
    dispatch(setLoading(true));
    try {
        const response: any = await post(DASHBOARD_EVENT_LISTING_API, objBody);
        if (!response.data.error) {
            return dispatch(dashboardEventListingSuccess(response.data.data));
        } else {
            dispatch(dashboardEventListingFailure());
        }
    } catch (err) {
        dispatch(dashboardEventListingFailure());
    } finally {
        dispatch(setLoading(false));
    }
};

/**
 * Fetch Syllabus Dropdown Data
 * @method syllabusDropDownAPI
 * @url /getSyllabusDropDown
 */
export const syllabusDropDownAPI = (objBody: any = undefined) => async (dispatch: AppDispatch) => {
    dispatch(setLoading(true));
    try {
        const response: any = await get(GET_SYLLABUS_DROPDOWN_API);
        if (!response.data.error) {
            return dispatch(getSyllabusDropDownSuccess(response.data.data));
        } else {
            dispatch(getSyllabusDropDownFailure());
        }
    } catch (err) {
        dispatch(getSyllabusDropDownFailure());
    } finally {
        dispatch(setLoading(false));
    }
};



/**
 * delete event
 * @param {*} objBody
 * @method deleteEventAPI
 * @url /deleteEvent
 * @returns API will delete event by id
 */
export const deleteEventAPI =
    (objBody: any = undefined) =>
        async (dispatch: AppDispatch) => {
            dispatch(setLoading(true));
            try {
                const response: any = await post(DELETE_EVENT_DATA_API, objBody);
                if (!response.data.error) {
                    ts(response?.data?.message)
                    return dispatch(deleteEventSuccess(response.data.data));
                } else {
                    dispatch(deleteEventFailure());
                }
            } catch (err) {
                dispatch(deleteEventFailure());
            } finally {
                dispatch(setLoading(false));
            }
        };



/**
 * upadteEventStatus 
 * @param {*} objBody
 * @method upadteEventStatusAPI
 * @url /upadteEventStatus
 * @returns API will update status of task
 */
export const upadteEventStatusAPI =
    (objBody: any = undefined) =>
        async (dispatch: AppDispatch) => {
            dispatch(setLoading(true));
            try {
                const response: any = await post(UPDATE_EVENT_STATUS_DATA_API, objBody);
                if (!response.data.error) {
                    return dispatch(updateEventStatusSuccess(response.data.data));
                } else {
                    dispatch(updateEventStatusFailure());
                }
            } catch (err) {
                dispatch(updateEventStatusFailure());
            } finally {
                dispatch(setLoading(false));
            }
        };


