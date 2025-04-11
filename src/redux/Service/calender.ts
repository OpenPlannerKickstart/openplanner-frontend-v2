import { post } from "../../Utility/httpInterceptor";
import { GET_CALENDER_DATA } from "../../Utility/ApiList";
import { AppDispatch } from "../store";
import { setLoading } from "../Loader/LoaderSlice";
import { getCalendarDataFailure, getCalendarDataSuccess } from "../Calender/calenderSlice";


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