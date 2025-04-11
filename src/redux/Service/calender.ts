import { get, post } from "../../Utility/httpInterceptor";
import { GET_CALENDER_DATA, GET_SYLLABUS_DROPDOWN_DATA_API } from "../../Utility/ApiList";
import { AppDispatch } from "../store";
import { setLoading } from "../Loader/LoaderSlice";
import { getCalendarDataFailure, getCalendarDataSuccess } from "../Calender/calenderSlice";
import { getDropdownFailure, getDropdownSuccess } from "../Generic/genericSlice";


/**
 * Get Calender Data
 * @param {*} objBody
 * @method getCalenderDataAPI
 * @url /getCalenderData
 * @returns API will get CalenderData
 */
export const getCalenderDataAPI =
    (objBody: any = undefined) =>
        async (dispatch: AppDispatch) => {
            dispatch(setLoading(true));

            try {
                const response: any = await post(GET_CALENDER_DATA, objBody);
                if (!response.data.error) {
                    return dispatch(getCalendarDataSuccess(response.data.data));
                } else {
                    dispatch(getCalendarDataFailure());
                }
            } catch (err) {
                dispatch(getCalendarDataFailure());
            } finally {
                dispatch(setLoading(false));
            }
        };

/**
 * Get Drop Down Data
 * @param {*} objBody
 * @method getSyllabusDropDownDataAPI
 * @url /getSyllabusDropDown
 * @returns API will  getSyllabusDropDown
 */
export const getSyllabusDropDownDataAPI =
    (objBody: any = undefined) =>
        async (dispatch: AppDispatch) => {
            dispatch(setLoading(true));

            try {
                const response: any = await get(GET_SYLLABUS_DROPDOWN_DATA_API);
                if (!response.data.error) {
                    return dispatch(getDropdownSuccess(response.data.data));
                } else {
                    dispatch(getDropdownFailure());
                }
            } catch (err) {
                dispatch(getDropdownFailure());
            } finally {
                dispatch(setLoading(false));
            }
        };