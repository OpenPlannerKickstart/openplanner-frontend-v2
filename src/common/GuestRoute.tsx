import React from "react";
import { useLocation, Navigate } from "react-router-dom";
import { getToken } from "../Utility/Helper";
import { ENUMFORROUTES } from "../interfaces/interface";
/**
 * GuestRoute component
 * Redirects authenticated users away from routes intended for guests.
 * @param {Object} props - Props for GuestRoute component
 * @param {JSX.Element} props.children - The child elements to render within the GuestRoute
 */
const GuestRoute = ({ children }: { children: JSX.Element }) => {
  const location = useLocation();

  //   console.log(children);
  /** Check if the user is authenticated */
  const isAuthenticated = getToken() !== null ? true : false; // get Token or flag from Localstorage for dynamic

  if (isAuthenticated) {
    return <Navigate to={ENUMFORROUTES.DASHBOARD} state={{ from: location }} />
  };
  return children;

};

export default GuestRoute;
