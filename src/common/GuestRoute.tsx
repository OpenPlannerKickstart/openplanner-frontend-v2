import React from "react";
import { useLocation, Navigate } from "react-router-dom";
import { getToken } from "../Utility/Helper";
import { ENUMFORROUTES } from "../interfaces/enum";

/**
 * GuestRoute component
 * Redirects authenticated users away from routes intended for guests.
 * @param {Object} props - Props for GuestRoute component
 * @param {JSX.Element} props.children - The child elements to render within the GuestRoute
 */
const GuestRoute = ({ children }: { children: JSX.Element }) => {
  const location = useLocation();
  const path = location?.pathname;

  //   console.log(children);
  /** Check if the user is authenticated */
  const isAuthenticated = getToken() !== null ? true : false; // get Token or flag from Localstorage for dynamic
  const hasSubscription = ((): boolean => {
    try {
      const val = localStorage.getItem('has_subscription');
      return val === 'true';
    } catch {
      return false;
    }
  })();
  const isFreemium = ((): boolean => {
    try {
      return localStorage.getItem('plan_tier') === 'freemium';
    } catch {
      return false;
    }
  })();
  const allowAuthenticated = [
    ENUMFORROUTES.PLAN_DETAILS,
    ENUMFORROUTES.SUCCESS,
    ENUMFORROUTES.FAILURE,
    "/faqs",
    ENUMFORROUTES.PARENTS,
  ];

  if (
    isAuthenticated &&
    (hasSubscription || isFreemium) &&
    !allowAuthenticated.includes(path)
  ) {
    console.log("going to dashboard")
    return <Navigate to={ENUMFORROUTES.DASHBOARD} state={{ from: location }} />
  }
  return children;

};

export default GuestRoute;
