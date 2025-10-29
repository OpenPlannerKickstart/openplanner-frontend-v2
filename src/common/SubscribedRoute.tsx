import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { ENUMFORROUTES } from '../interfaces/enum'

/**
 * SubscribedRoute
 * - Requires the user to have an active subscription
 * - If not, redirect to plan details (paywall)
 * - Assumes authentication already enforced by an outer AuthRoute
 */
const SubscribedRoute = ({ children }: { children: JSX.Element }) => {
  const location = useLocation();
  const hasSubscription = ((): boolean => {
    try {
      const val = localStorage.getItem('has_subscription');
      return val === 'true';
    } catch {
      return false;
    }
  })();

  if (!hasSubscription) {
    return <Navigate to={ENUMFORROUTES.PLAN_DETAILS} state={{ from: location }} />
  }
  return children;
}

export default SubscribedRoute


