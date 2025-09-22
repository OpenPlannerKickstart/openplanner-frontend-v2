import { cloneDeep } from "lodash";
import moment from "moment";
import CryptoJS from "crypto-js";
import { API_URL } from "./Config";
import * as React from "react";
import { jwtDecode } from "jwt-decode";

// import {
//   DropdownListFormat,
// } from "../interfaces/interfaces";

import { components } from "react-select";
// import jwt_decode from "jwt-decode";
import { GET_LOGIN_DATA_API } from "./ApiList";

export type returnTypeForString = string | null | undefined;
export type returnTypeForRegex = RegExp | null | undefined;
/** List of APIs that should exclude token authentication. */
export const excludeTokenAPIList: Array<string> = [
  GET_LOGIN_DATA_API,
  'api/parents/',            // exclude all public parents endpoints
];
export const isExcludedUrl = (url: string): boolean => {
  return excludeTokenAPIList.some((prefix) => url.startsWith(prefix));
};
/** Message to display when no records are found. */
export const NO_RECORD_FOUND_MSG = "No Records found.";
/** Date format for storing dates in the application. */
export const DATE_FORMAT = "dd-MM-yyyy";
/** Date format for displaying dates in the user interface. */
export const DATE_FORMAT_FOR_DISPLAY = "DD-MM-YYYY";
/** Maximum file size for a general blob in kilobytes. */
export const FILE_SIZE_FOR_BLOB = 60 * 1024;
/** Maximum file size for a general file in megabytes. */
export const FILE_SIZE = 1 * 1024 * 1024;
/** Maximum file size for a mark sheet file in megabytes. */
export const FILE_SIZE_FOR_MARKSHEET = 10 * 1024 * 1024;
/** Array of supported image formats. */
export const SUPPORTED_FORMATS = [
  "image/jpg",
  "image/jpeg",
  "image/gif",
  "image/png",
];
export const SUPPORTED_SYLLABUS_UPLOAD_FORMATS = [
  "application/pdf",
  "application/msword", 
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", 
];

/** key Genrated Base64   */
const key = "ODcmS3EzZnI/QXhybUFjeUpQREo2cHB6";
const parseKey = CryptoJS.enc.Base64.parse(key);

/**
 * Encrypts the given object using AES encryption.
 * @param obj The object to encrypt.
 * @returns The encrypted string.
 */
export const encrypted: any = (obj) => {
  return CryptoJS.AES.encrypt(
    typeof obj === "string" ? obj : JSON.stringify(obj),
    parseKey,
    {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    }
  ).toString();
};
/**
 * Decrypts the given string using AES decryption.
 * @param obj The string to decrypt.
 * @returns The decrypted object or string.
 */
export const decrypted = (obj) => {
  if (isNullUndefinedOrBlank(obj)) {
    return;
  }
  var bytes = CryptoJS.AES?.decrypt(obj, parseKey, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  });
  var originalText = bytes.toString(CryptoJS.enc.Utf8);
const sanitize = (s: string) => typeof s === "string" ? s.replace(/[\r\n\u2028\u2029]+/g, " ") : s;

console.log(
  obj,
  "in Function",
  sanitize(originalText),
  "text",
  sanitize(bytes.toString(CryptoJS.enc.Utf8))
);
  if (isNullUndefinedOrBlank(originalText)) {
    return;
  }
  // return originalText;
  console.log(typeof originalText, "type", originalText)
  return typeof originalText === "string"
    ? originalText
    : JSON?.parse(originalText);
};

// get token of loggedIn user
/** Function to get the token of the logged-in user from local storage. */
export const getToken = (): returnTypeForString => {
  return getCookieByName("planner_token");
};
//decode Token
export const getDecodeToken = (): any => {
  const token: any = getToken();
  if (token) {
    const decodeToken: any = jwtDecode(token);
    console.log(decodeToken, "decodes");
    return decodeToken;
  }
};
export const getDecodeIDToken = (): any => {
  const token: any = getIDToken();
  if (token) {
    const decodeIDToken: any = jwtDecode(token);
    return decodeIDToken;
  }
};

export const getUserSubId = (): any => {
  const decodeIDToken: any = getDecodeIDToken();
  if (decodeIDToken) {
    return decodeIDToken.sub;
  }
  return null;
}
/** Function to get the refresh token of the logged-in user from local storage. */
export const getRefreshToken = (): returnTypeForString => {
  return getCookieByName("planner_refreshToken");
};
export const getIDToken = (): returnTypeForString => {
  return getCookieByName("planner_ID_Token");
};
// get clientId of loggedIn user
/** Function to get the clientId of the logged-in user from local storage. */
export const getClientId = (): returnTypeForString => {
  return getCookieByName("clientId");
};
// get token of loggedIn user
/** Function to get the name of the logged-in user from local storage. */
export const getUserName = (): returnTypeForString => {
  return getCookieByName("userName");
};

// get token of loggedIn user
/** Function to get the role name of the logged-in user from local storage. */
export const getRoleName = (): returnTypeForString => {
  return getCookieByName("roleName");
};

// get id of loggedIn user
/** Function to get the profile ID of the logged-in user from local storage. */
export const getProfileId = (): returnTypeForString => {
  return getCookieByName("profile_id");
};
// get UserId
/** Function to get the user ID of the logged-in user from local storage. */
export const getUserId = (): any => {
  const userId = getCookieByName("userId");
  return userId ? +userId : 1;
};
// get UserId
/** Function to get the user type ID of the logged-in user from local storage. */
export const getUserTypeId = (): any => {
  const userId = getCookieByName("userType");
  return userId ? +userId : null;
};
// get IP
/** Function to get the IP address of the logged-in user from local storage. */
export const getIP = (): returnTypeForString => {
  return getCookieByName("ip");
};
/** Function to get the unique number of the logged-in user from local storage. */
export const getUniqueNumber = (): returnTypeForString => {
  return getCookieByName("unique_number");
};


export const getUserFirstLastName = () => {
  const decodeToken = getDecodeIDToken();
  return `${decodeToken?.family_name || ""} ${decodeToken?.given_name || ""}`


}
/**
 * Function to set a unique number in local storage based on the current timestamp.
 */
export const setUniqueNumber = (): void => {
  const uniqueNumber = Math.floor(Date.now() / 1000);
  return setCookieByName("unique_number", uniqueNumber.toString());
};

/**
 * Function to set a Token.
 */
export const setPlannerToken = (val): void => {

  return setCookieByName("planner_token", val);
};
/**
 * Function to set a Token.
 */
export const setPlannerRefreshToken = (val): void => {

  return setCookieByName("planner_refreshToken", val);
};

export const setPlannerIDToken = (val): void => {

  return setCookieByName("planner_ID_Token", val);
};
// get role of loggedIn user
/**
 * Function to get the role of the logged-in user from local storage.
 */
export const getRole = (): returnTypeForString => {
  return getCookieByName("role");
};

// export const setIP = async () => {
// 	await axios
// 		.get("https://api.ipify.org/?format=json")
// 		.then(async (res) => {
// 			await localStorage.setItem("ip", res.data.ip);
// 		})
// 		.catch((error) => {
// console.log(error);
// 		});
// };

// set session data in local storage
/**
 * Function to set session-related information in local storage.
 * @param {string} token - The API token to be stored.
 * @param {number} id - The profile ID to be stored.
 * @param {string} role - The role to be stored.
 */
export const setSession = (token: string, id: number, role: string): void => {
  setCookieByName("api_token", token);
  setCookieByName("profile_id", id.toString());
  setCookieByName("role", role);
};

// remove session data from local storage
/**
 * Function to remove session-related information from local storage.
 * Clears the API token, profile ID, and role stored in local storage.
 */
export const removeSession = (): void => {
  removeCookieByName("api_token");
  removeCookieByName("profile_id");
  removeCookieByName("role");
};

// get letter icon by name
/**
 * Function to generate a user letter based on the first name and last name.
 * @param {string} firstName - The first name of the user.
 * @param {string} lastName - The last name of the user.
 * @returns {string} - The generated user letter.
 */
export const getUserLetter = (
  firstName: string,
  lastName: string
): returnTypeForString => {
  let letter = "";
  if (firstName) letter = firstName.substr(0, lastName ? 1 : 2);
  if (lastName) letter += lastName.substr(0, 1);
  return letter;
};

// append scripts in body
/**
 * Function to dynamically append script tags to the document body.
 * @param {string[]} sources - An array of script source URLs to be appended.
 * @returns {void}
 */
export const appendScriptLink = (sources: any): void => {
  sources.map((src: string): any => {
    /**Create a new script element  */
    const script = document.createElement("script");
    // Set the source URL for the script
    script.src = src;
    // Set the script to load asynchronously
    script.async = true;
    /**   Append the script element to the document body */
    document.body.appendChild(script);
  });
};

// load script into body part
/**
 * Function to dynamically load a script by appending a script tag to the document body.
 * @param {string} source - The source code of the script to be loaded.
 * @returns {void}
 */
export const loadScript = (source: string): void => {
  /**Create a new script element  */
  const s = document.createElement("script");
  /**Set the type of the script to text/javascript  */
  s.type = "text/javascript";
  /**Set the script to load asynchronously  */
  s.async = true;
  /** Set the innerHTML of the script to the provided source code */
  s.innerHTML = source;
  /**  Append the script element to the document body*/
  document.body.appendChild(s);
};

// get regexp by type
/**
 * Function to get a regular expression based on the specified type.
 * @param {string} type - The type of regular expression to retrieve.
 * @returns {RegExp | null | undefined} - The regular expression matching the specified type.
 */
export const getRegExp = (type: string): returnTypeForRegex => {
  /**  set Regular expression */
  let regx: RegExp | null | undefined = null;
  /** Switch based on the specified type to determine the regular expression  */
  switch (type) {
    case "email":
      regx =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@(([[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      break;
    case "mobile10":
      regx = /^[7896]\d{9}$/;
      break;
    case "mobile14":
      regx = /^(?=.*[0-9])[- +()0-9]{10,14}$/;
      break;
    case "mobile":
      regx = /^((\(\d{3}\) ?)|(\d{3}-))?\d{3}-\d{4}$/;
      break;
    case "number":
      regx = /^[0-9]*$/;
      break;
    case "onlyAlphabate":
      regx = /^[a-zA-Z ]*$/;
      break;

    default:
      break;
  }
  /**Return the determined regular expression  */
  return regx;
};

// get object of state form
export const getFormDetails = (form: any, changeValidation: any): any => {
  let failed = false;
  for (const val in form.errors) {
    const fieldError = form.errors[val];
    if (fieldError) {
      failed = true;
    } else if (fieldError === null && !form[val]) {
      failed = true;
      changeValidation(val, true);
    }
  }
  if (failed) {
    return false;
  } else {
    const cloneObj = cloneDeep(form);
    delete cloneObj["errors"];
    return cloneObj;
  }
};

//for hashing
export const generatePassword = (password: any) => {
  const iv = CryptoJS.lib.WordArray.random(128 / 8).toString(CryptoJS.enc.Hex);
  const salt = CryptoJS.lib.WordArray.random(128 / 8).toString(
    CryptoJS.enc.Hex
  );
  //@ts-ignore
  const aesUtil = new AesUtil(128, 1000);
  const ciphertext = aesUtil.encrypt(salt, iv, "sarvagram", password);

  const aesPassword = iv + "::" + salt + "::" + ciphertext;
  const hashedpassword = Buffer.from(aesPassword).toString("base64"); //btoa(aesPassword);
  return hashedpassword;
};
//function for generating hashed password
export const AesUtil = function (
  this: any,
  keySize: number,
  iterationCount: any
) {
  this.keySize = keySize / 32;
  this.iterationCount = iterationCount;
};

AesUtil.prototype.generateKey = function (salt: any, passPhrase: any) {
  const key = CryptoJS.PBKDF2(passPhrase, CryptoJS.enc.Hex.parse(salt), {
    keySize: this.keySize,
    iterations: this.iterationCount,
  });
  return key;
};

AesUtil.prototype.encrypt = function (
  salt: any,
  iv: any,
  passPhrase: any,
  plainText: any
) {
  const key = this.generateKey(salt, passPhrase);
  const encrypted = CryptoJS.AES.encrypt(plainText, key, {
    iv: CryptoJS.enc.Hex.parse(iv),
  });
  return encrypted.ciphertext.toString(CryptoJS.enc.Base64);
};

AesUtil.prototype.decrypt = function (
  salt: any,
  iv: any,
  passPhrase: any,
  cipherText: any
) {
  const key = this.generateKey(salt, passPhrase);
  const cipherParams = CryptoJS.lib.CipherParams.create({
    ciphertext: CryptoJS.enc.Base64.parse(cipherText),
  });
  const decrypted = CryptoJS.AES.decrypt(cipherParams, key, {
    iv: CryptoJS.enc.Hex.parse(iv),
  });
  return decrypted.toString(CryptoJS.enc.Utf8);
};

// perform column sorting
/**
 * Function to handle column sorting in a table.
 * @param {any} key - The key of the column to sort.
 * @param {string} type - The current sorting type (asc, desc, or null).
 * @param {any[]} columns - The array of columns in the table.
 * @returns {object} - An object containing updated columns, sortType, and sortKey.
 */
export const getColumnSorting = (key: any, type: string, columns: any[]) => {
  /** Determine the new sortType based on the current type */
  const sortType = type ? (type === "asc" ? "desc" : null) : "asc";
  /** Update the sortType property for each column */
  columns.map((x) => {
    x.sortType = x.key === key ? sortType : null;
  });
  /** Return an object with updated columns, sortType, and sortKey  */
  return {
    columns,
    sortType,
    sortKey: sortType ? key : null,
  };
};

// generate random number
/**
 * Function to generate a random number as a string.
 * @returns {string} - A random number as a string.
 */
export const getRandomNumber = (): string => {
  /**Generate a random number using Math.random() and convert it to a string  */
  return Math.random().toString().substr(2);
};

// Return Form Data
/**
 * Function to convert an object into FormData.
 * @param {Object} obj - The object to be converted.
 * @param {string} file - The key representing the file in the object.
 * @returns {FormData} - The FormData object.
 */
export const ConvertInFormData = (obj = {} as any, file = "") => {
  /** Create a new FormData object */
  const formData = new FormData();
  /** Iterate through the keys of the object */
  Object.keys(obj).map((res) => {
    if (file == res) {
      Object.keys(obj[res]).map((response, index) => {
        // console.log("Image", obj[res][response]);
        /**Append the file to the FormData object  */
        formData.append(`${res}`, obj[res][response]);
      });
    } else {
      /** If it's not the file key, append the key and its value to the FormData object  */
      formData.append(res, JSON.stringify(obj[res]));
    }
  });
  /**Return the FormData object  */
  return formData;
};
// get server validation in string format
/**
 * Function to extract error messages from a server validation error object.
 * @param {Object} errorObj - The server validation error object.
 * @returns {string} - Concatenated error messages.
 */
export const getServerValidation = (errorObj: {
  [x: string]: any[];
}): string => {
  /** Create an array to store error messages */
  const messages: any = [];
  Object.keys(errorObj).map((val) => {
    /**Iterate through the array of error messages for each key  */
    errorObj[val].map((arr_val) => messages.push(arr_val));
  });
  /** Concatenate error messages with a comma separator */
  return messages.join(",");
};

// convert UTC date to Local date
/**
 * Function to convert a UTC date to a local date with the specified format.
 * @param {MomentInput} date - The UTC date to be converted.
 * @param {string} format - The format of the output date. Default is "yyyy-MM-ddTHH:mm:ss".
 * @returns {string} - The local date in the specified format.
 */
export const convertUTCtoLocal = (
  date: moment.MomentInput,
  format = "yyyy-MM-ddTHH:mm:ss"
) => {
  /**Check if the date is falsy, if so, return an empty string  */
  if (!date) return "";
  /** Set the moment locale to "en-IN"  */
  moment.locale("en-IN");
  /**Format the input date as UTC date  */
  const utcDate = moment(date).format(); //is used to convert to consider input as UTC if timezone offset is not passed
  /** Convert the UTC date to local date with the specified format */
  return moment(utcDate).format(format);
};

// convert Local date to UTC date
/**
 * Function to convert a local date to UTC with the specified format.
 * @param {MomentInput} date - The local date to be converted.
 * @param {string} format - The format of the output date. Default is "yyyy-MM-ddTHH:mm:ss".
 * @returns {string} - The UTC date in the specified format.
 */
export const convertlocaltoUTC = (
  date: moment.MomentInput,
  format = "yyyy-MM-ddTHH:mm:ss"
) => {
  /**Check if the date is falsy, if so, return an empty string  */
  if (!date) return "";
  /** Set the moment locale to "en-IN" */
  moment.locale("en-IN");
  /**Convert the local date to UTC with the specified format  */
  return moment.utc(date).format(format);
};
/**
 * Function to check if a given value is empty or not.
 * @param {string | null} value - The value to be checked.
 * @returns {boolean} - Returns true if the value is empty, false otherwise.
 */
export const isEmpty = (value: string | null) => {
  /**     Check if the value is a string and has no non-whitespace characters,
  or if it's undefined or null. */
  return (
    (typeof value == "string" && !value.trim()) ||
    typeof value == "undefined" ||
    value === null
  );
};
/**
 * Function to get a formatted date string.
 * @param {moment.MomentInput} date - The input date.
 * @param {string} format - The format in which the date string should be returned.
 * @returns {string} - The formatted date string.
 */
export const getDate = (
  date: moment.MomentInput,
  format = "yyyy-MM-DDTHH:mm:ssZ"
) => {
  /**If the input date is not provided, use the current date and time.  */
  return !date ? moment().format(format) : moment(date).format(format);
};

/**
 * Function to format a date string.
 * @param {string} date - The input date string.
 * @param {string} format - The format in which the date string should be returned.
 * @returns {string} - The formatted date string or "Invalid Date" if the input date is not valid.
 */
export const formatedDate = (date, format = "DD-MM-yyyy") => {
  /** 
   * Check if the input date is valid using moment.js.
   * If valid, format the date according to the specified format.
   * If not valid, return "Invalid Date".
   */
  return moment(date).isValid()
    ? moment(date).format(format) // Formats date in the user's local timezone
    : "Invalid Date";
};

/**
 * Function to format a time string.
 * @param {string} date - The input time string.
 * @param {string} format - The format in which the time string should be returned.
 * @returns {string} - The formatted time string or "Invalid Date" if the input time is not valid.
 */
export const formatedTime = (date, format = "HH:mm") => {
  /**  
   *   Check if the input time is valid using moment.js.
If valid, format the time according to the specified format.
If not valid, return "Invalid Date".
  */

  // console.log(moment(date).isValid()?"hello":"no hello");
  return moment(date).isValid() ? moment(date).format(format) : "Invalid Date";
};

export const formatTime = (time, formatString = 'HH:mm:ss') => {
  // Handle time-only strings
  if (typeof time === 'string' && time.match(/^\d{2}:\d{2}:\d{2}$/)) {
    return moment(time, 'HH:mm:ss').format(formatString);
  }
  // Handle general cases
  return moment(time).format(formatString);
}

/**
 * Function to check if a given date is before the current date.
 * @param {string} date - The input date string.
 * @param {string} format - The format in which the date string is provided.
 * @returns {boolean} - True if the given date is before the current date, false otherwise.
 */
export const dateCheck = (date, format = " DD-MM-yyyy") => {
  /** Parse the input date string using moment.js. */
  const givenDate = moment(date);
  /** Get the current date. */
  const todayDate = moment();
  // Check if the given date is before the current date.
  // If true, return true, indicating that the given date is before the current date.
  // If false, return false.

  // console.log(givenDate.isSame(todayDate, 'd') &&)
  if (givenDate.isBefore(todayDate, "d")) {
    return givenDate.isBefore(todayDate);
  }
};

/**
 * Checks if a value is null, undefined, or an empty string.
 *
 * @param {any} obj - The value to be checked.
 * @returns {boolean} - True if the value is null, undefined, or an empty string; false otherwise.
 */
export const isNullUndefinedOrBlank = (obj: any): boolean => {
  /**  Check if the value is null, undefined, or an empty string.
  If true, return true, indicating that the value is null, undefined, or an empty string.
  If false, return false.  */

  if (obj == null || obj === undefined || (obj === "" && obj !== 0)) {
    return true;
  }
  return false;
};
/**
 * Checks if any of the provided values is null, undefined, or an empty object.
 *
 * @param {...any} value - The values to be checked.
 * @returns {boolean} - True if any of the values is null, undefined, or an empty object; false otherwise.
 */
export const isEmptyObjectOrNullUndefiend = (...value: any): boolean => {
  /**Check if values are provided and the number of values is greater than 0.  */
  if (value && value.length > 0) {
    for (let i = 0; i < value.length; i++) {
      if (isNullUndefinedOrBlank(value[i]) || isEmptyObject(value[i])) {
        return true;
      }
    }
  }
  return false;
};
/**
 * Checks if the provided object is empty.
 *
 * @param {any} obj - The object to be checked.
 * @returns {boolean} - True if the object is empty; false otherwise.
 */
export const isEmptyObject = (obj: any): boolean => {
  return obj && Object.keys(obj).length === 0;
};

/**
 * Checks if the provided value is numeric.
 *
 * @param {any} value - The value to be checked.
 * @returns {boolean} - True if the value is numeric; false otherwise.
 */
export const isNumeric = (value: any): boolean => {
  /** Use a regular expression to test if the value consists of only digits.  */
  return /^\d+$/.test(value);
};

/**
 * Prevents leading spaces in the input value.
 *
 * @param {React.ChangeEvent<HTMLInputElement>} event - The input change event.
 * @returns {void}
 */
export const preventSpace = (
  event: React.ChangeEvent<HTMLInputElement>
): void => {
  event.target.value = event.target.value.replace(/^\s+/g, "");
};

/**   Decimal adjustment of a number.
 * @param { String } type The type of adjustment.
 * @param { Number }  value The number.
 * @param { Integer } exp   The exponent(the 10 logarithm of the adjustment base).
 * @returns { Number } The adjusted value.
 **/
export const decimalAdjust = (
  type: string,
  value: number | string[],
  exp: number
): number => {
  // If the exp is undefined or zero...
  if (typeof exp === "undefined" || +exp === 0) {
    //@ts-ignore
    return Math[type](value);
  }
  value = +value;
  exp = +exp;
  // If the value is not a number or the exp is not an integer...
  if (isNaN(value) || !(typeof exp === "number" && exp % 1 === 0)) {
    return NaN;
  }
  // Shift
  value = value.toString().split("e");
  //@ts-ignore
  value = Math[type](+(value[0] + "e" + (value[1] ? +value[1] - exp : -exp)));
  // Shift back
  value = value.toString().split("e");
  return +(value[0] + "e" + (value[1] ? +value[1] + exp : exp));
};
/**
 * Downloads a file from the specified API endpoint.
 *
 * @param {string} APIName - The name of the API endpoint.
 * @param {number} docId - The ID of the document to download.
 * @returns {void}
 */
export const download = (APIName: string, docId: number) => {
  /**  Construct the download URL using the API endpoint and document ID.*/
  const url = API_URL + APIName + "?id=" + docId;
  /** Create a new link element for downloading the file. */
  const dlLink = document.createElement("a");
  dlLink.setAttribute("crossOrigin", "anonymous");
  dlLink.setAttribute("data-downloadurl", url);
  dlLink.href = url;
  dlLink.download = "downloadfile.png";
  dlLink.dataset.downloadurl = [dlLink.download, url["href" as any]].join(":");
  document.body.appendChild(dlLink);
  dlLink.click();
  document.body.removeChild(dlLink);
};

/**
 * Recursively removes undefined, null, or empty string properties from an object.
 * Additionally, removes empty elements from arrays.
 *
 * @param {Object} obj - The input object to be processed.
 * @returns {void}
 */
export const customJsonInclude = (obj): void => {
  for (const key in obj) {
    /** Iterate through each key in the object. */
    const flag = obj[key] instanceof Blob;
    if (typeof obj[key] === "object" && !flag) {
      // console.log(key);

      if (obj[key] && obj[key].length > 0) {
        obj[key] = removeEmptyElementsFromArray(obj[key]);
      }
      if (isEmptyObject(obj[key]) || isNullUndefinedOrBlank(obj[key])) {
        delete obj[key];
      } else {
        customJsonInclude(obj[key]);
      }
    } else {
      if (obj[key] === undefined || obj[key] === null || obj[key] === "") {
        delete obj[key];
      }
    }
  }
};

/**
 * This Method Is Use From Remove Empty Element From Array
 * @param test_array  your selected array pass as args.
 */
const removeEmptyElementsFromArray = (test_array): Array<any> => {
  let index = -1;
  const arr_length = test_array ? test_array.length : 0;
  let resIndex = -1;
  const result: any = [];

  while (++index < arr_length) {
    const id = test_array[index];
    if (id) {
      result[++resIndex] = id;
    }
  }
  return result;
};

/** Destructuring specific components from the 'components' object.  */
const { ValueContainer, Placeholder }: any = components;
/**
 * Custom component for rendering the value container in a React Select component.
 *
 * @param {Object} props - Properties passed to the component.
 * @returns {ReactNode} - React elements representing the custom value container.
 */
export const CustomValueContainer = ({ children, ...props }) => {
  /**Render the custom value container.  */
  return (
    <ValueContainer {...props}>
      <Placeholder
        {...props}
        innerProps={{ title: props.selectProps.placeholder }}
        isFocused={props.isFocused}
      >
        {props.selectProps.placeholder}
      </Placeholder>
      {React.Children.map(children, (child) =>
        child && child.type !== Placeholder ? child : null
      )}
    </ValueContainer>
  );
};

export const customStylesForDefaultLable = {
  /**Styling for the control (container of the value and dropdown indicator).  */
  control: (base, state) => ({
    ...base,
    border: state.isDisabled
      ? "1px solid rgb(226 232 240)"
      : "1px solid #DDDDDD",
    background: state.isDisabled ? "#FFFFFF" : "",

    // boxShadow: 'none',
    "&:hover": {
      boxShadow: "none",
      border: state.isDisabled ? "1px solid #DDDDDD" : "1px solid #0D6BC8",
    },
    "&:focus": {
      boxShadow: "none",
      border: "1px solid #0D6BC8",
      position: "absolute",
      top: state.hasValue || state.selectProps.inputValue ? -15 : "50%",
      transition: "top 0.1s, font-size 0.1s",
      fontSize: (state.hasValue || state.selectProps.inputValue) && 13,
    },
  }),
  /** Styling for individual options in the dropdown. */
  option: (provided, state) => ({
    ...provided,
    background: state.isSelected ? "#0D6BC8" : "",
    fontSize: "0.875rem",
  }),
  /** Styling for the dropdown menu. */
  menu: (provided, state) => ({
    ...provided,

    zIndex: 999,
  }),
  /**Styling for the single selected value.  */
  singleValue: (provided, state) => {
    const opacity = state.isDisabled ? 1 : 1;
    const color = state.isDisabled ? "#000000" : "#000000";
    const transition = "opacity 300ms";

    return { ...provided, opacity, transition, color };
  },
  /** Styling for multi selected values.  */
  multiValue: (provided, state) => {
    const opacity = state.isDisabled ? 1 : 1;
    const color = state.isDisabled ? "#000000" : "#000000";
    const transition = "opacity 300ms";
    const pointerEvents = state.isDisabled ? "none" : "inherit";
    return { ...provided, opacity, transition, color, pointerEvents };
  },
  /** Styling for the container of the entire component. */
  container: (provided, state) => ({
    ...provided,
    pointerEvents: "inherit",
    // marginTop: 50,
  }),
  /**Styling for the container of the selected values.  */
  valueContainer: (provided, state) => ({
    ...provided,
    overflow: "visible",
    // pointerEvents: state.isDisabled && state.isMulti ?"none":"inherit" ,
  }),
  /** Styling for the placeholder text.  */
  placeholder: (provided, state) => ({
    ...provided,
    // fontSize: "0.875rem",
    // fontColor: "#F00F00",
    // opacity: 0.8,
    color: state.isFocused || state.isDisabled ? "#BBBBBB" : "#808080",

    opacity: state.isFocused ? 0.5 : 1,
    position: "absolute",
    top:
      state.hasValue ||
        state.isFocused ||
        state.isDisabled ||
        state.selectProps.inputValue
        ? -13
        : "",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxWidth: "98%",
    width: "auto",
    transition: "top 0.1s, font-size 0.1s",
    background:
      state.isDisabled || state.selectProps.inputValue ? "#FFFFFF" : "#FFFFFF",

    paddingLeft:
      state.hasValue || state.isFocused || state.selectProps.inputValue
        ? 4
        : "",
    paddingRight:
      state.hasValue || state.isFocused || state.selectProps.inputValue
        ? 4
        : "",
    fontSize: (state.hasValue || state.selectProps.inputValue) && 13,
  }),
};

export const customStyles = {
  /**Styling for the control (container of the value and dropdown indicator).  */
  control: (base, state) => ({
    ...base,
    // cursor: 'not-allowed',
    border: "1px solid #DDDDDD",
    // boxShadow: 'none',
    "&:hover": {
      boxShadow: "none",
      border: "1px solid #0D6BC8",
    },
    "&:focus": {
      boxShadow: "none",
      border: "1px solid #0D6BC8",
    },
    background: state.isDisabled ? "#F3F4F6" : "",
  }),
  /** Styling for individual options in the dropdown. */
  option: (provided, state) => ({
    ...provided,
    fontSize: "0.875rem",
    cursor: "pointer",
    background: state.isDisabled
      ? "#F3F4F6"
      : state.isSelected || ""
        ? "#0D6BC8"
        : "",
    placeholder: state.isFocused ? "red" : "green",
  }),
  /**Styling for the single selected value.  */
  singleValue: (provided, state) => {
    const opacity = state.isDisabled ? 0.9 : 1;
    const transition = "opacity 300ms";
    const color = state.isDisabled ? "#111111" : "#111111";
    return { ...provided, opacity, transition, color };
  },
  /** Styling for the placeholder text. */
  placeholder: (provided, state) => ({
    ...provided,
    fontColor: state.isDisabled ? "#F00F00" : "red",
    fontSize: "0.875rem",
    // fontColor: "#9CA3AF",
    opacity: 1,
    color: "#808080",
  }),
};

/**
 * Calculates the difference in years and months between two dates.
 * @param {string} startDate - The start date.
 * @param {string} endDate - The end date.
 * @returns {object} - An object containing the difference in years and months.
 */

export const calculateYearsAndMonth = (startDate, endDate) => {
  /**Parse the input dates using moment.js  */
  const a = moment(startDate);
  /**Parse the input dates using moment.js  */
  const b = moment(endDate);

  // var years = a.diff(b, 'year');
  // b.add(years, 'years');

  // var months = a.diff(b, 'months');
  // b.add(months, 'months');

  // var days = a.diff(b, 'days');
  // console.log(years + ' years ' + months + ' months ' + days + ' days');
  /** Calculate the duration between the two dates */
  const diffDuration = moment.duration(a.diff(b));

  // console.log(diffDuration.years()); // 8 years
  // console.log(diffDuration.months()); // 5 months
  // console.log(diffDuration.days()); // 2 days
  return { years: diffDuration.years(), months: diffDuration.months() };
};
/**
 * Renders an error message in a paragraph element with the 'error-msg' class.
 * @param {boolean|React.ReactChild|React.ReactFragment|React.ReactPortal|null|undefined} message - The error message to be rendered.
 * @returns {JSX.Element} - A JSX element representing the rendered error message.
 */
export const renderError = (
  message:
    | boolean
    | React.ReactChild
    | React.ReactFragment
    | React.ReactPortal
    | null
    | undefined
) => <p className="error-msg">{message}</p>;

/**
 * Converts a base64-encoded image string to a Blob.
 * @param {string} imageBase64 - The base64-encoded image string.
 * @returns {Blob} - A Blob representing the image.
 */

export const convertBase64ToBlob = (imageBase64: string) => {
  const ImageURL = imageBase64;
  /** Split the base64 string into data and contentType */
  const block = ImageURL.split(";");
  /**Get the content type of the image  */
  const contentType = block[0].split(":")[1]; // In this case 'image/gif'
  /** get the real base64 content of the file */
  const realData = block[1].split(",")[1]; // In this case 'R0lGODlhPQBEAPeoAJosM....'
  /** Convert it to a blob to upload */

  const blob = b64toBlob(realData, contentType);
  return blob;
};

/**
 * Convert a base64 string in a Blob according to the data and contentType.
 *
 * @param b64Data {String} Pure base64 string without contentType
 * @param contentType {String} the content type of the file i.e (image/jpeg - image/png - text/plain)
 * @param sliceSize {Int} SliceSize to process the byteCharacters
 * @return Blob
 */
export const b64toBlob = (b64Data, contentType, sliceSize?) => {
  contentType = contentType || "";
  sliceSize = sliceSize || 512;

  const byteCharacters = atob(b64Data);
  const byteArrays: any = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);

    byteArrays.push(byteArray);
  }
  const blob = new Blob(byteArrays, { type: contentType });
  return blob;
};

/**
 * Opens a URL in a new browser tab.
 * @param {string} url - The URL to be opened.
 */
export const openInNewTab = (url: string): void => {
  /**Open the URL in a new tab with security attributes */
  const newWindow = window.open(url, "_blank", "noopener,noreferrer");
  /**Set the opener property of the new window to null for security  */
  if (newWindow) newWindow.opener = null;
};
/**
 * Fetches a file from a given URL.
 * @param {string} url - The URL of the file.
 * @returns {Promise<[ArrayBuffer | null, Error | null]>} - A promise that resolves to an array containing the file's ArrayBuffer and any potential error.
 */
export async function getFile(url: string) {
  try {
    /** Fetch the file using the fetch API  */
    const response = await fetch(url, {
      method: "GET", // *GET, POST, PUT, DELETE, etc.
      mode: "no-cors", // no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    });
    /** Read the response as ArrayBuffer */
    const blob = await response.arrayBuffer();
    // console.log(new Blob([blob]));

    // console.log(Buffer.from(blob, 'binary').toString('base64'));

    // return [, null];
  } catch (error) {
    /**If an error occurs during the fetch, return null for the ArrayBuffer and the error  */
    // console.error(`get: error occurred ${error}`);
    return [null, error];
  }
}

/**
 * Capitalizes the first letter of a string.
 * @param {string} string - The input string.
 * @returns {string} - The string with the first letter capitalized.
 */
export const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};
/**
 * Check if the size of files in the array is within the specified limit.
 * @param {Array} files - An array of files.
 * @returns {boolean} - True if all files are within the size limit, false otherwise.
 */
export const checkIfFilesAreTooBig = (files?: any): boolean => {
  let valid = true;
  if (files) {
    files.map((file) => {
      /** Get the size of the file, defaulting to FILE_SIZE_FOR_MARKSHEET if no size is available */
      const size = file.document ? file.document.size : FILE_SIZE_FOR_MARKSHEET;
      if (size > FILE_SIZE_FOR_MARKSHEET) {
        valid = false;
      }
    });
  }
  return valid;
};
/**
 * Check if the file types in the array are among the supported formats.
 * @param {Array} files - An array of files.
 * @param {Array} supportedFormat - An array of supported file formats.
 * @returns {boolean} - True if all files have correct types, false otherwise.
 */
export function checkIfFilesAreCorrectType(
  files?: any,
  supportedFormat?: any
): boolean {
  let valid = true;
  if (files) {
    files.map((file) => {
      /** Get the file name or attachment name  */
      const fileName = file.attachmentName
        ? file.attachmentName
        : file.document.name;
      /** Check if the file type is among the supported formats */
      if (!checkExtensionValidOrNot(fileName, supportedFormat)) {
        valid = false;
      }
    });
  }
  return valid;
}
/**
 * Check if the file extension is among the supported formats.
 * @param {string} name - The file name.
 * @param {Array} supportedFormat - An array of supported file formats.
 * @returns {boolean} - True if the extension is supported, false otherwise.
 */
export const checkExtensionValidOrNot = (
  name: string,
  supportedFormat: any
): boolean => {
  /**Split the file name to extract the extension  */
  const splitName = name.split(".");
  // console.log(name);
  // console.log(splitName);
  const extension = splitName[splitName.length - 1];
  // console.log(extension);
  // console.log(
  //   supportedFormat.some(
  //     (item) => item.value.toLowerCase() === extension.toLowerCase()
  //   )
  // );
  // console.log(supportedFormat);
  /**Check if the extension is among the supported formats  */
  return supportedFormat.some(
    (item) => item.value.toLowerCase() === extension.toLowerCase()
  );
};
/**
 * Convert an array of objects to an array of strings using a specified key.
 * @param {Array} items - An array of objects.
 * @param {string} key - The key to extract from each object.
 * @returns {Array} - An array of strings containing the values of the specified key.
 */
export const convertStringFromArrayOfObject = (items: any[], key) => {
  /** Create a duplicate of the input array to avoid modifying the original array */
  const duplicateItems = [...items];
  /** Map over the array and extract the values of the specified key */
  return duplicateItems.map((val) => {
    return val[key];
  });
};

//Get the indian currency format
/**
 * Format a number as an Indian currency string.
 * @param {any} val - The value to be formatted.
 * @returns {string} - The formatted currency string.
 */
export const formatIndianCurrency = (val: any) => {
  // console.log("val------", val);
  const isNegative: any =
    val != "" && val != undefined && val != null
      ? val?.toString().includes("-")
      : false;
  if (isNegative) {
    val = val.replace(/-/gi, "");
  }
  let temp: any = val;
  temp = temp?.toString();
  let afterPoint = "";
  if (temp?.indexOf(".") > 0)
    afterPoint = temp?.substring(temp?.indexOf("."), temp.length);
  if (temp !== "-") {
    temp = isNaN(parseInt(temp)) ? "" : parseInt(temp);
  }
  temp = temp?.toString();
  let lastThree: any = temp?.substring(temp.length - 3);
  const otherNumbers: any = temp?.substring(0, temp.length - 3);
  if (otherNumbers !== "") lastThree = "," + lastThree;
  let res: any =
    otherNumbers?.replace(/\B(?=(\d{2})+(?!\d))/g, ",") +
    lastThree +
    afterPoint;
  if (isNegative) {
    res = "-" + res;
  }

  // console.log("curr", res);
  return res;
};
/**
 * Replace commas in a string with an empty string.
 * @param {any} value - The input string.
 * @returns {string} - The string with commas replaced.
 */
export const replaceComma = (value: any) => {
  return value?.replace(/,/g, "");
};
/**
 * Remove slashes from a string and replace them with commas.
 * @param {string} str - The input string.
 * @returns {string} - The string with slashes replaced by commas.
 */
export const removeSlash = (str) => {
  return str?.replace(/\//g, ",");
};
/**
 * Remove commas from a string.
 * @param {any} str - The input string.
 * @returns {string} - The string with commas removed.
 */
export const removeComma = (str: any) => {
  return str.replace(",", "");
};
/**
 * Convert a comma-separated string to an array.
 * @param {any} ids - The comma-separated string.
 * @returns {string[]} - The array of values.
 */
export const makeFilterArray = (ids: any) => {
  const newIds = removeComma(ids);
  const array = newIds.split(",");
  return array;
};
/**
 * Round a decimal value to two decimal places.
 * @param {number} value - The decimal value.
 * @returns {number} - The rounded value.
 */
export const roundDecimalValue = (value: number): number => {
  return Math.round((value + Number.EPSILON) * 100) / 100;
};

/**
 * Convert a decimal value to a string with a specified number of fixed decimal places.
 * @param {number} value - The decimal value.
 * @param {number} fixedNumber - The number of fixed decimal places.
 * @returns {string} - The string representation of the decimal value.
 */
export const convertDecimalTwoPoint = (value: number, fixedNumber): any => {
  return ((value * 100) / 100).toFixed(fixedNumber);
};

/**
 * Set value in cookie
 * @param {number} name - The cookie value.
 */
export const setCookieByName = (name, value, options = {}) => {
  const { path = "/" }: any = options;
  let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(
    value
  )}; path=${path}`;
  document.cookie = cookieString;
};

/**
 * get value of cookie
 * @param {number} name - The cookie value.
 * @returns {value} - The given cookie value.
 */
export const getCookieByName = (name) => {
  let cookies = document?.cookie?.split("; ");
  for (let cookie of cookies) {
    let [key, value] = cookie?.split("=");
    if (key === name) return decodeURIComponent(value);
  }
  return null;
};

/**
 * Clear cookie
 * @param {number} name - The cookie value.
 */
export const removeCookieByName = (name) => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};

/**
 * Clear all cookies
 * @param {}
 */
export const deleteAllCookies = () => {
  document?.cookie?.split("; ")?.forEach((cookie) => {
    const [name] = cookie?.split("=");
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
  });
};

//decode Token

export const hexToRgb = (hex) => {
  hex = hex.replace('#', '');
  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `${r}, ${g}, ${b}`;
}



// Alternative version with more control over formatting:
export function convertUTCToLocal(utcDateString) {
  try {
    // Apple receipt date format: "2025-09-01 06:34:38 Etc/GMT"
    // Remove the " Etc/GMT" part if present
    const cleanDate = utcDateString.replace(" Etc/GMT", "");

    // Parse the UTC date string (treat as UTC)
    const utcDateTime = new Date(cleanDate + "Z"); // Adding 'Z' indicates UTC

    // Convert to local time (JavaScript Date objects are inherently local)
    // Format output (change format as needed)
    const formatted = utcDateTime.toISOString().replace('T', ' ').substring(0, 19);

    return formatted;
  } catch (e: any) {
    return `Invalid date: ${e.message}`;
  }
}
