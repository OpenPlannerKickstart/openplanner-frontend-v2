import { get, post } from "../../Utility/httpInterceptor";
import {
  GET_COUNTRY_DATA_API,
  GET_STATE_DATA_API,
  GET_CITY_DATA_API,
} from "../../Utility/ApiList";
import { AppDispatch } from "../store";
import { setLoading } from "../Loader/LoaderSlice";
import {
  getCityDataFailure,
  getCityDataSuccess,
  getCountryDataFailure,
  getCountryDataSuccess,
  getStateDataFailure,
  getStateDataSuccess,
} from "../Generic/genericSlice";

/**
 * Get Country Data
 * @param {*} objBody
 * @method getCountryApi
 * @url getCountry
 * @returns API will return value and name of the country
 */

export const getCountryAPI =
  (objBody: any = undefined) =>
  async (dispatch: AppDispatch) => {
    /** Dispatch loading action to indicate start of API call */
    dispatch(setLoading(true));
    try {
      /**Make API call to fetch country data  */
      const response: any = await get(GET_COUNTRY_DATA_API);
      /**Check if response doesn't contain error  */
      if (!response.data.error) {
        /**Dispatch success action with fetched data  */
        return dispatch(getCountryDataSuccess(response.data.data));
      } else {
        /**  Dispatch failure action if API returns error */
        dispatch(getCountryDataFailure());
      }
    } catch (err) {
      /**Catch any errors that occur during API call and dispatch failure action  */
      dispatch(getCountryDataFailure());
    } finally {
      /**Dispatch loading action to indicate end of API call  */
      dispatch(setLoading(false));
    }
  };

/**
 * Get state data for dropdownn in Add Property form
 * @param {*} objBody
 * @method getStateAPI
 * @url getStateByCountryId
 * @returns API will return value and name of the state
 */

export const getStateAPI =
  (objBody: any = undefined) =>
  async (dispatch: AppDispatch) => {
    /** Dispatch loading action to indicate start of API call */
    dispatch(setLoading(true));
    try {
      /**Make API call to fetch State data  */
      const response: any = await post(GET_STATE_DATA_API, objBody);
      /**Check if response doesn't contain error  */

      if (!response.data.error) {
        /**Dispatch success action with fetched data  */
        return dispatch(getStateDataSuccess(response.data.data));
      } else {
        /**  Dispatch failure action if API returns error */
        dispatch(getStateDataFailure());
      }
    } catch (err) {
      /**Catch any errors that occur during API call and dispatch failure action  */
      dispatch(getStateDataFailure());
    } finally {
      /**Dispatch loading action to indicate end of API call  */
      dispatch(setLoading(false));
    }
  };

/**
 * Get City data
 * @param {*} objBody
 * @method getCityAPI
 * @url getCityByStateId
 * @returns API will return value and name of the city based on stateid
 */

export const getCityAPI =
  (objBody: any = undefined) =>
  async (dispatch: AppDispatch) => {
    /** Dispatch loading action to indicate start of API call */
    dispatch(setLoading(true));
    try {
      /**Make API call to fetch City data  */
      const response: any = await post(GET_CITY_DATA_API, objBody);
      /**Check if response doesn't contain error  */
      if (!response.data.error) {
        /**Dispatch success action with fetched data  */
        return dispatch(getCityDataSuccess(response.data.data));
      } else {
        /**  Dispatch failure action if API returns error */
        dispatch(getCityDataFailure());
      }
    } catch (err) {
      /**Catch any errors that occur during API call and dispatch failure action  */
      dispatch(getCityDataFailure());
    } finally {
      /**Dispatch loading action to indicate end of API call  */
      dispatch(setLoading(false));
    }
  };
