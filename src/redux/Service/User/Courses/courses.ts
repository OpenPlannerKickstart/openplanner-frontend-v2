import { ADD_EDIT_EVENT_DATA_API, ADD_EDIT_SYLLABUS_DATA_API, DELETE_EVENT_DATA_API, DELETE_SYLLABUS_DATA_API, GET_COURSES_LIST_DATA_API, GET_EVENT_LIST_DATA_API, GET_SYLLABUS_DROP_DOWN_DATA_API, UPDATE_EVENT_STATUS_DATA_API, UPDATE_SYLLABUS_STATUS_DATA_API } from "../../../../Utility/ApiList";
import { get, post } from "../../../../Utility/httpInterceptor";
import { ts } from "../../../../Utility/Toaster";
import { setLoading } from "../../../Loader/LoaderSlice";
import { AppDispatch } from "../../../store";
import { addEditEventDataFailure, addEditEventDataSuccess, addEditSyllabusDataFailure, addEditSyllabusDataSuccess, deleteEventDataFailure, deleteEventDataSuccess, deleteSyllabusDataFailure, deleteSyllabusDataSuccess, getCoursesListDataFailure, getCoursesListDataSuccess, getEventListDataFailure, getEventListDataSuccess, getSyllabusDropDownDataFailure, getSyllabusDropDownDataSuccess, updateEventStatusDataFailure, updateEventStatusDataSuccess, updateSyllabusStatusDataFailure, updateSyllabusStatusDataSuccess } from "../../../User/Courses/coursesSlice";

/**
 * Get Courses List Data ApI
 * @param {*} objBody
 * @method getCoursesListDataAPI
 * @url /courseListing
 * @returns API will return Data
 */
export const getCoursesListDataAPI =
  (objBody: any = undefined) =>
    async (dispatch: AppDispatch) => {
      dispatch(setLoading(true));

      try {
        const response: any = await post(GET_COURSES_LIST_DATA_API, objBody);
        if (!response.data.error) {
          return dispatch(getCoursesListDataSuccess(response.data.data));
        } else {
          dispatch(getCoursesListDataFailure());
        }
      } catch (err) {
        dispatch(getCoursesListDataFailure());
      } finally {
        dispatch(setLoading(false));
      }
    };

/**
 * Get Event List Data ApI
 * @param {*} objBody
 * @method getEventListDataAPI
 * @url /eventListing
 * @returns API will return Data
 */
export const getEventListDataAPI =
  (objBody: any = undefined) =>
    async (dispatch: AppDispatch) => {
      dispatch(setLoading(true));

      try {
        const response: any = await post(GET_EVENT_LIST_DATA_API, objBody);
        if (!response.data.error) {
          return dispatch(getEventListDataSuccess(response.data.data));
        } else {
          dispatch(getEventListDataFailure());
        }
      } catch (err) {
        dispatch(getEventListDataFailure());
      } finally {
        dispatch(setLoading(false));
      }
    };
/**
 * Get Event List Data ApI
 * @param {*} objBody
 * @method addEditEventDataAPI
 * @url /ADD_EDIT_EVENT_DATA_API
 * @returns API will return Data
 */
export const addEditEventDataAPI =
  (objBody: any = undefined) =>
    async (dispatch: AppDispatch) => {
      dispatch(setLoading(true));

      try {
        const response: any = await post(ADD_EDIT_EVENT_DATA_API, objBody);
        if (!response.data.error) {
          ts(response.data.message)
          return dispatch(addEditEventDataSuccess(response.data.data));
        } else {
          dispatch(addEditEventDataFailure());
        }
      } catch (err) {
        dispatch(addEditEventDataFailure());
      } finally {
        dispatch(setLoading(false));
      }
    };

/**
 * Add Edit Syllabus Data ApI
 * @param {*} objBody
 * @method addEditSyllabusDataAPI
 * @url /ADD_EDIT_EVENT_DATA_API
 * @returns API will return Data
 */
export const addEditSyllabusDataAPI =
  (objBody: any = undefined) =>
    async (dispatch: AppDispatch) => {
      dispatch(setLoading(true));

      try {
        const response: any = await post(ADD_EDIT_SYLLABUS_DATA_API, objBody);
        if (!response.data.error) {
          ts(response.data.message)
          return dispatch(addEditSyllabusDataSuccess(response.data.data));
        } else {
          dispatch(addEditSyllabusDataFailure());
        }
      } catch (err) {
        dispatch(addEditSyllabusDataFailure());
      } finally {
        dispatch(setLoading(false));
      }
    };
/**
 * Delete Syllabus Data ApI
 * @param {*} objBody
 * @method deleteSyllabusDataAPI
 * @url /DELETE_SYLLABUS_DATA_API
 * @returns API will return Data
 */
export const deleteSyllabusDataAPI =
  (objBody: any = undefined) =>
    async (dispatch: AppDispatch) => {
      dispatch(setLoading(true));

      try {
        const response: any = await post(DELETE_SYLLABUS_DATA_API, objBody);
        if (!response.data.error) {
          ts(response.data.message);
          return dispatch(deleteSyllabusDataSuccess(response.data.data));
        } else {
          dispatch(deleteSyllabusDataFailure());
        }
      } catch (err) {
        dispatch(deleteSyllabusDataFailure());
      } finally {
        dispatch(setLoading(false));
      }
    };
/**
 * Delete event Data ApI
 * @param {*} objBody
 * @method deleteEventDataAPI
 * @url /DELETE_EVENT_DATA_API
 * @returns API will return Data
 */
export const deleteEventDataAPI =
  (objBody: any = undefined) =>
    async (dispatch: AppDispatch) => {
      dispatch(setLoading(true));

      try {
        const response: any = await post(DELETE_EVENT_DATA_API, objBody);
        if (!response.data.error) {
          ts(response.data.message)
          return dispatch(deleteEventDataSuccess(response.data.data));
        } else {
          dispatch(deleteEventDataFailure());
        }
      } catch (err) {
        dispatch(deleteEventDataFailure());
      } finally {
        dispatch(setLoading(false));
      }
    };
/**
 * Update event Status Data ApI
 * @param {*} objBody
 * @method updateEventStatusDataAPI
 * @url /UPDATE_EVENT_STATUS_DATA_API
 * @returns API will return Data
 */
export const updateEventStatusDataAPI =
  (objBody: any = undefined) =>
    async (dispatch: AppDispatch) => {
      dispatch(setLoading(true));

      try {
        const response: any = await post(UPDATE_EVENT_STATUS_DATA_API, objBody);
        if (!response.data.error) {
          ts(response?.data?.message)
          return dispatch(updateEventStatusDataSuccess(response.data.data));
        } else {
          dispatch(updateEventStatusDataFailure());
        }
      } catch (err) {
        dispatch(updateEventStatusDataFailure());
      } finally {
        dispatch(setLoading(false));
      }
    };
/**
 * Update Syllabus Status Data ApI
 * @param {*} objBody
 * @method updateEventStatusDataAPI
 * @url /UPDATE_SYLLABUS_STATUS_DATA_API
 * @returns API will return Data
 */
export const updateSyllabusStatusDataAPI =
  (objBody: any = undefined) =>
    async (dispatch: AppDispatch) => {
      dispatch(setLoading(true));

      try {
        const response: any = await post(UPDATE_SYLLABUS_STATUS_DATA_API, objBody);
        if (!response.data.error) {
          return dispatch(updateSyllabusStatusDataSuccess(response.data.data));
        } else {
          dispatch(updateSyllabusStatusDataFailure());
        }
      } catch (err) {
        dispatch(updateSyllabusStatusDataFailure());
      } finally {
        dispatch(setLoading(false));
      }
    };
/**
 * get Syllabus Drop Down Data ApI
 * @param {*} objBody
 * @method getSyllabusDropDownDataAPI
 * @url /UPDATE_SYLLABUS_STATUS_DATA_API
 * @returns API will return Data
 */
export const getSyllabusDropDownDataAPI =
  (objBody: any = undefined) =>
    async (dispatch: AppDispatch) => {
      dispatch(setLoading(true));

      try {
        const response: any = await get(GET_SYLLABUS_DROP_DOWN_DATA_API);
        if (!response.data.error) {
          return dispatch(getSyllabusDropDownDataSuccess(response.data.data));
        } else {
          dispatch(getSyllabusDropDownDataFailure());
        }
      } catch (err) {
        dispatch(getSyllabusDropDownDataFailure());
      } finally {
        dispatch(setLoading(false));
      }
    };
