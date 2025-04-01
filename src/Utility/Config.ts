
import { env } from "process";
/**BASE_URL represents the base URL for the application. It dynamically determines the URL based on the environment.  */
export const BASE_URL = `${window.location.protocol}//${
  window.location.hostname === "localhost" ||
  window.location.hostname === "192.168.2.166"
    ? "192.168.2.166"
    : "192.168.2.166"
}`;
// export const API_URL = "https://vedichind.com:7260/";
// production Time
/** API URL for the application. Use the production URL if available, otherwise use the local URL. */
export const API_URL = process.env.API_URL;
/** WebSocket connection URL obtained from the environment. */
export const WEB_SOCKET_CONNECTION_URL =`${process.env.SOCKET_URL}`;
/** Frontend URL based on the current protocol and hostname, running on port 8000. */
export const FrontendURL = `${window.location.protocol}//${window.location.hostname}:8000`;
/** File URL based on the current protocol and hostname. */
export const FileUrl = `${window.location.protocol}//${window.location.hostname}/`;
