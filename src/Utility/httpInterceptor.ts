import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { jwtDecode } from "jwt-decode";
/**Importing API and base URLs from a configuration file  */
import { API_URL, BASE_URL } from "./Config";
import {
  getServerValidation,
  getToken,
  excludeTokenAPIList,
  isExcludedUrl,
  getRefreshToken,
  setCookieByName,
  removeCookieByName,
  deleteAllCookies,
  setPlannerToken,
  getIDToken,
  getDecodeIDToken,
  // getClientId,
} from "./Helper"; // Importing utility functions related to server validation, token retrieval, exclusion list, and refresh tokens
import { te, ts } from "./Toaster"; // Importing functions related to displaying toasts or messages
import { ResponseWrapperDTO } from "../interfaces/interface"; // Importing a data transfer object (DTO) for response wrapping
import { GET_LOGIN_DATA_API } from "./ApiList"; // Importing a specific API endpoint constant
// import { GET_LOGIN_DATA_API } from './ApiList';

export type responseType = ReturnType<typeof handleResponse>;
export type errorType = ReturnType<typeof handleError>;

/** Create an Axios instance with a base URL */
const axiosInstance = axios.create({
  /** Base URL for API requests */
  baseURL: API_URL,
  // other axios configurations
});
/** Intercept responses to handle token refreshing */
axiosInstance.interceptors.response.use(
  (response) => response, // If the response is successful, pass it along
  async (error) => {
    const originalRequest = error.config; // Get the original request configuration
    //    console.log(originalRequest);
    //    console.log( window.__INITIAL_HEADERS__);

    // If the response is unauthorized and it's the first attempt to refresh the token

    if (!error.config.url.includes("refreshToken")) {
      /**Check if the error is due to unauthorized access (401)  */

      if (error.response.status === 401) {
        /**Prevent infinite retry loop  */
        // originalRequest._retry = true;

        try {
          /**   Refresh the access token using the refresh token */

          const decoded: any = getDecodeIDToken();
          // console.log(decoded['cognito:username'], "!decoded?.username")
          if (!decoded['cognito:username']) {
            return logoutFromSystem();
          }
          const refreshToken = getRefreshToken(); // Retrieve the refresh token from wherever it is stored
          const response = await axiosInstance.post(`${API_URL}refreshToken`, null, {
            headers: {
              refreshToken: `${refreshToken}`,
              username: decoded['cognito:username']
            },
          });

          const newAccessToken = response.data.data.AccessToken;
          /**  Update the access token in local storage or wherever it is stored */

          setPlannerToken(response.data.data?.AccessToken);

          /** Update the token in your application's state or wherever it is stored  */
          /**Update the access token in your storage  */

          //   saveToken(newAccessToken);

          /**   Retry the original request with the new access token */
          originalRequest.headers["Authorization"] = newAccessToken
            ? `Bearer ${newAccessToken}`
            : "";
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          /**    Handle token refresh error (e.g., refresh token expired) */
          console.error(refreshError);
          return logoutFromSystem();

          /**   Redirect to login or perform other error handling*/
        }
      }

      /** For all other error cases, pass the error along */

      return Promise.reject(error);
    }
  }
);

let count: any = 1;
/**
 * Perform a GET request to the specified URL using Axios.
 *
 * @param url - The URL for the GET request.
 * @returns A Promise that resolves with the Axios response.
 */
export const get = (
  url: string
  // headers: any,
  // isPrivate = true,
  // responseType = undefined,
  // customUrl = false
): Promise<AxiosResponse> => {
  /** Construct the API URL */

  let apiUrl = API_URL + url;
  /** Customize URL handling (commented out in your code)  */

  // if (customUrl) {
  //     apiUrl = url;
  // }
  // Add authentication token to the URL if needed (commented out in your code)
  // if (isPrivate && getToken()) {
  //     const isParam = apiUrl.includes("?");
  //     if (isParam) apiUrl = `${apiUrl}&&api_token=${getToken()}`;
  //     else apiUrl = `${apiUrl}?api_token=${getToken()}`;
  // }
  /**  Create an Axios request configuration object */

  const axiosObj: AxiosRequestConfig = {
    method: "get",
    url: apiUrl,
  };
  /** Add headers to the request if needed  */

  if (!isExcludedUrl(url)) {
    axiosObj.headers = {
      Authorization: getToken() ? `${"Bearer " + getToken()}` : "",
      // "Access-Control-Allow-Origin": "*",

    };
    axiosObj.headers.platform = 'w'
  }
  /** Add responseType to the request if needed (commented out in your code) */

  // if (responseType) axiosObj.responseType = responseType;
  /** Perform the GET request using axiosInstance  */

  return axiosInstance(axiosObj)
    .then((response: any) => handleResponse(response))
    .catch((error: any) => {
      // console.log("return handleError(error)", error); // Handle the response
      /** Handle errors and return the result  */

      return handleError(error);
    });
};

/**
 * Perform a POST request to the specified URL using Axios.
 *
 * @param url - The URL for the POST request.
 * @param bodyObj - The request body object.
 * @param isPrivate - Flag indicating whether the request is private.
 * @param mediaFile - Flag indicating whether the request includes media files.
 * @param uat - Flag indicating whether to use the UAT URL.
 * @returns A Promise that resolves with the Axios response.
 */
export const post = (
  url: string,
  bodyObj = {} as any,
  isPrivate = true,
  mediaFile = false,
  uat = false
): Promise<AxiosResponse> => {
  // console.log("bodyObj", bodyObj);
  /**  Construct the API URL based on the uat flag */

  const apiUrl = !uat ? API_URL + url : url;
  /**  Perform additional handling if the request includes media files */

  // if (mediaFile == true) {
  //     const formData = new FormData();
  //     console.log("bodyObj", bodyObj);
  //     Object.keys(bodyObj).map((key) => {
  //         formData.append(key, bodyObj[key]);
  //     });
  //     bodyObj = formData;
  // }

  /**  Define the headers for the request, including the Authorization token if required */

  let header: any = { "Content-Type": "application/json" };
  if (!isExcludedUrl(url)) {
    header = {
      Authorization: getToken() ? `${"Bearer " + getToken()}` : "",
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    };
    // Dev-only: provide a CSRF header so MSW (if enabled) allows POSTs
    if (process.env.NODE_ENV === 'development') {
      header['X-CSRF-Token'] = 'dev';
    }
  }
  // Remove dev-only CSRF header now that BE endpoints are live
  // if (url === GET_LOGIN_DATA_API) {
  //     header = {
  //         'Content-Type': "application/json"
  //     };
  // }
  /** Perform the POST request using axiosInstance */
  header.platform = 'w'

  return axiosInstance
    .post(apiUrl, bodyObj, {
      headers: header,
    })
    .then((response: any) =>
      handleResponse(response)
    ) /** Handle the response */
    .catch((error: any) => {
      // console.log("error interceptor", error);
      // te(error.message);

      /** Handle errors and return the result */
      return handleError(error);
    });
};

/**
 * Perform a PUT request to the specified URL using Axios.
 *
 * @param url - The URL for the PUT request.
 * @param bodyObj - The request body object.
 * @param isPrivate - Flag indicating whether the request is private.
 * @param mediaFile - Flag indicating whether the request includes media files.
 * @param uat - Flag indicating whether to use the UAT URL.
 * @returns A Promise that resolves with the Axios response.
 */
export const put = (
  url: string,
  bodyObj: any = {},
  isPrivate = true,
  mediaFile = false,
  uat = false
): Promise<AxiosResponse> => {
  /** Construct the API URL based on the uat flag  */

  const apiUrl = !uat ? API_URL + url : url;
  /** Check if the request includes media files */
  if (mediaFile === true) {
    /** If mediaFile is true, create a FormData object for the body  */

    const formData = new FormData();
    // console.log("bodyObj", bodyObj);
    Object.keys(bodyObj).map((key) => {
      formData.append(key, bodyObj[key]);
    });
    bodyObj = formData;
  }
  /**  Define the headers for the request, including the Authorization token if required */
  let header: any = {};
  if (!isExcludedUrl(url)) {
    header = {
      Authorization: getToken() ? `${"Bearer " + getToken()}` : "",
      "Access-Control-Allow-Origin": "*",

    };
  }
  /**  Perform the PUT request using axiosInstance  */
  header.platform = 'w'
  return (
    axiosInstance
      .put(apiUrl, bodyObj, {
        headers: header,
      })
      /**Handle the response  */
      .then((response: any) => handleResponse(response))
      .catch((error: any) => {
        // console.log("error interceptor", error);
        /** Handle errors and return the result */

        return handleError(error);
      })
  );
};

/**
 * Handle a response by returning a new object with the same properties.
 * @param response - The response object to handle.
 * @returns A new object with the same properties as the input response.
 */
const handleResponse = (response: any): AxiosResponse<ResponseWrapperDTO> => {
  return {
    ...response,
  };
};
/**
 * Logout from the system by clearing local storage and displaying an unauthorized message.
 * @param objBody - An optional parameter, perhaps for additional logout-related data.
 */
export const logoutFromSystem = (objBody = {}, msg = "Unauthorized user") => {
  // Display an unauthorized message
  te(msg);
  /**Clear token-related data from local storage  */
  deleteAllCookies();
  // removeCookieByName("token");
  // removeCookieByName("accessToken");
};

/**
 * Handle errors from HTTP responses.
 *
 * @param error - The error object received from the HTTP response.
 * @returns Returns undefined or performs specific actions based on the error.
 */

const handleError = (error: any): any => {
  /** Destructure the 'response' property from the error object */
  const { response } = error;
  // console.log(response);
  // console.log(response.status);

  /** Parse the error response data */
  const parsedError = response && JSON.parse(JSON.stringify(response.data));
  // console.log("handleError",
  //     parsedError,
  //     parsedError.statusCode,
  //     parsedError && parsedError.statusCode == 401
  // );
  /** Default error message */

  let errorMsg: string | undefined =
    "Sorry, something went wrong. Please try again.";

  //
  /** Check if the response status is 422 (Unprocessable Entity) */
  if (response && response !== undefined && response.status === 422) {
    // Handle server validation errors
    if (response.data && response.data.errors)
      errorMsg = getServerValidation(response.data.errors) || errorMsg;
    else if (response.data.message) errorMsg = response.data.message;
  }

  // Check if the parsed error status is 503 (Service Unavailable)
  else if (parsedError && parsedError.status === 503) {
    errorMsg = parsedError.error;
    te(errorMsg);
    return Promise.reject(error);
  }
  // Check if the response status indicates unauthorized (401)
  else if (
    response &&
    response !== undefined &&
    JSON.parse(JSON.stringify(response.data)).toString().includes("401")
  ) {
    syncLogout();
  }
  //  else if (response && response !== undefined && response.status === 401) {
  //     const obj = {
  //         clientId: localStorage.getItem("clientId"),
  //         username: localStorage.getItem("userId"),
  //     };
  //     if (count === 1) {
  //         localStorage.removeItem("token");
  //         logoutFromSystem(obj);
  //         count = 0;
  //     }
  // }

  // Handle other specific HTTP response statuses
  else if (response && response !== undefined && response.status === 400) {
    te(response.data.message);
  } else if (response && response !== undefined && response.status === 403) {
    // Do not clear auth on 403; non-subscribed users may hit protected endpoints
    //logoutFromSystem("Access Denied Because Subscription Not Found");
    te(response.data.message || "Access denied");
    return;
  } else if (response && response !== undefined && response.status === 405) {
    // console.log(response.data.Message)
    te(response.data.message);
  } else if (response && response != undefined && response.status === 500) {
    te(response.data.message);
    //   const obj = {
    //     clientId: localStorage.getItem("clientId"),
    //     username: localStorage.getItem("userId"),
    //   };
    //   if (count === 1) {
    //     localStorage.removeItem("token");
    //     logoutFromSystem(obj);
    //     count = 0;
    //   }
  }
  // Default case for other unspecified errors
  else {
    te("Sorry, something went wrong. Please try again.");
  }
  // Always reject so callers can handle status/headers (e.g., 429 rate limit)
  return Promise.reject(error);
};
/**
 * Signal a synchronous logout by throwing an error.
 * This can be caught and handled elsewhere in the application.
 */
function syncLogout() {
  throw new Error("Logout");
}

/**
 * Download a file from the specified API endpoint using Axios.
 * @param fileName - The suggested file name for the downloaded file.
 * @param url - The API endpoint URL.
 * @returns A Promise that resolves when the file is downloaded.
 */

export const downloadFileAPI = (url: string, fileName: any): Promise<any> => {
  /**Construct the full API URL  */
  const apiUrl = API_URL + url;
  /** Set the suggested file name for the downloaded file  */

  const exportfileName = fileName;
  /**  Define the headers for the request, including the Authorization token if required  */
  let header = {};
  if (excludeTokenAPIList.indexOf(url) < 0) {
    header = {
      token: getToken() ? getToken() : "",
      Authorization: getToken() ? `${"Bearer " + getToken()}` : "",
      "Access-Control-Allow-Origin": "*",
    };
  }
  /** Fetch the dynamically generated excel document from the server.  */

  return axiosInstance
    .get(apiUrl, { responseType: "arraybuffer", headers: header })
    .then((response: any) => {
      // Handle the response

      // Check if the response status is 200

      if (response.status === 200) {
        /**  Extract the suggested file name from the response headers */

        const fileNameHeader = "content-disposition";
        console.log(response.headers[fileNameHeader], "response ");
        const suggestedFileName =
          response.headers[fileNameHeader].split("filename=")[1];
        /** Set the effective file name considering the suggested file name  */

        const effectiveFileName =
          suggestedFileName === undefined
            ? exportfileName + ".csv"
            : suggestedFileName;
        /**If you want to download file automatically using link attribute.  */
        /** Create a Blob containing the response data  */

        const blob = new Blob([response.data]);
        /**  Create a download link and trigger a click to download the file */

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", effectiveFileName);
        document.body.appendChild(link);
        link.click();
        /**Prepare a custom response object  */

        const customResponse: ResponseWrapperDTO = {
          status: "200",
          message: "File Downloaded Successfully.",
          error: false,
          data: {
            data: { fileName: suggestedFileName },
          },
          path: url,
        };
        /**Return the custom response  */

        return handleResponse(customResponse);
      } else {
        /**Handle the case where the response status is not 200 */
        const obj = JSON.parse(new TextDecoder().decode(response.data));
        // console.log(obj);
        /** Return the response object  */

        return handleResponse(obj);
      }
    })
    .catch((error: any) => {
      // Handle errors

      /**  Extract the response from the error object*/
      const { response } = error;

      /**  Parse the response data  */
      const obj = JSON.parse(new TextDecoder().decode(response.data));

      /** Return the response object */

      return handleResponse(obj);
    });
};

/**
 * Download a file from a POST API endpoint using Axios.
 *
 * @param url - The API endpoint URL.
 * @param bodyObj - The request body object.
 * @param fileName - The suggested file name for the downloaded file.
 * @returns A Promise that resolves when the file is downloaded.
 */
export const downloadFilePostAPI = (
  url: string,
  bodyObj = {} as any,
  fileName: any
): Promise<any> => {
  /**Construct the full API URL  */
  const apiUrl = API_URL + url;
  /** Set the suggested file name for the downloaded file  */
  const exportfileName = fileName;
  /**  Define the headers for the request, including the Authorization token if required  */
  let header = {};
  if (excludeTokenAPIList.indexOf(url) < 0) {
    header = {
      Authorization: getToken() ? `Bearer ${getToken()}` : "",
      "Access-Control-Allow-Origin": "*",
    };
  }
  // Fetch the dynamically generated excel document from the server.
  return axios
    .post(apiUrl, bodyObj, { responseType: "arraybuffer", headers: header })
    .then((response: any) => {
      // Handle the response

      // Check if the response status is 200
      if (response.status === 200) {
        /** Extract the suggested file name from the response headers */
        const fileNameHeader = "x-suggested-filename";
        const suggestedFileName = response.headers[fileNameHeader];
        const fileNameHeader1 = "Content-Disposition:";

        /** Set the effective file name considering the suggested file name  */
        // const suggestedFileName = response.headers[fileNameHeader].split('filename=')[1];
        const effectiveFileName =
          suggestedFileName === undefined
            ? exportfileName + ".csv"
            : suggestedFileName;
        console.log(
          `Received header[${fileNameHeader}]: ${suggestedFileName}, effective fileName: ${effectiveFileName} `
        );

        // Let the user save the file.
        // FileSaver.saveAs(response.data);

        // const outputFilename = effectiveFileName;
        /**Create a Blob containing the response data  */
        const blob = new Blob([response.data]);
        /** Create a download link and trigger a click to download the file  */

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", effectiveFileName);
        document.body.appendChild(link);
        link.click();
        /**Prepare a custom response object  */

        const customResponse: ResponseWrapperDTO = {
          status: "200",
          message: "File Downloaded Successfully.",
          error: false,
          data: {
            data: { fileName: suggestedFileName },
          },
          path: url,
        };
        /** Return the custom response */

        return handleResponse(customResponse);
      } else {
        // Handle the case where the response status is not 200
        console.log(
          "2@ res",
          JSON.parse(new TextDecoder().decode(response.data))
        );
        const obj = JSON.parse(new TextDecoder().decode(response.data));

        /** Return the response object */
        return handleResponse(obj);
      }
    })
    .catch((error: any) => {
      // Handle errors

      /** Extract the response from the error object  */
      const { response } = error;
      // console.log('2@ res', JSON.parse(new TextDecoder().decode(response.data)))

      /**  Parse the response data */
      const obj = JSON.parse(new TextDecoder().decode(response.data));
      /** Return the response object */

      return handleResponse(obj);
    });
};

/**
 * Perform a DELETE request to the specified URL using Axios.
 *
 * @param url - The URL for the DELETE request.
 * @param bodyObj - The request body object.
 * @param isPrivate - Flag indicating whether the request is private.
 * @param mediaFile - Flag indicating whether the request includes media files.
 * @param uat - Flag indicating whether to use the UAT URL.
 * @returns A Promise that resolves with the Axios response.
 */
export const deleteAPI = (
  url: string,
  bodyObj: any = {},
  isPrivate = true,
  mediaFile = false,
  uat = false
): Promise<AxiosResponse> => {
  /**  Construct the API URL based on the uat flag  */

  const apiUrl = !uat ? API_URL + url : url;
  /** Check if the request includes media files  */

  if (mediaFile === true) {
    /**If mediaFile is true, create a FormData object for the body  */
    const formData = new FormData();
    // console.log("bodyObj", bodyObj);
    Object.keys(bodyObj).map((key) => {
      formData.append(key, bodyObj[key]);
    });
    bodyObj = formData;
  }
  /**Define the headers for the request, including the Authorization token if required  */

  let header: any = {};
  if (excludeTokenAPIList.indexOf(url) < 0) {
    header = {
      Authorization: getToken() ? `${"Bearer " + getToken()}` : "",
      "Access-Control-Allow-Origin": "*",
    };
  }
  /** Perform the DELETE request using axiosInstance */

  return axiosInstance
    .delete(apiUrl, {
      headers: header,
    })
    .then((response: any) => handleResponse(response)) // Handle the response
    .catch((error: any) => {
      /** Handle errors and return the result */
      //
      // console.log("error interceptor", error);
      return handleError(error);
    });
};

export const getFilePath = (filePath: string) =>
  filePath && filePath.replace("/var/www/html", BASE_URL);

// export const downloadXLSFile = async (url) => {
//   const apiUrl = API_URL + url;
//   // Its important to set the 'Content-Type': 'blob' and responseType:'arraybuffer'.
//   const headers = {'Content-Type': 'blob'};
//   const config: AxiosRequestConfig = {method: 'GET', url: API_URL, responseType: 'arraybuffer', headers};

//   try {
//       const response = await axios(config);

//       const outputFilename = `${ Date.now() }.xls`;

//       // If you want to download file automatically using link attribute.
//       const url = URL.createObjectURL(new Blob([response.data]));
//       const link = document.createElement('a');
//       link.href = url;
//       link.setAttribute('download', outputFilename);
//       document.body.appendChild(link);
//       link.click();

//       // // OR you can save/write file locally.
//       // fs.writeFileSync(outputFilename, response.data);
//   } catch (error) {
//     te("Could not Download the Excel report from the backend.");

//   }
// }
