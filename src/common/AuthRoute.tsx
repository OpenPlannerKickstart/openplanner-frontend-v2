import React from 'react'
import { useLocation,Navigate } from 'react-router-dom';
import { getToken } from '../Utility/Helper';
import { ENUMFORROUTES } from '../interfaces/enum';

/**
 * AuthRoute component renders the children only if the user is authenticated,
 * otherwise redirects to the login page.
 *
 * @param children The JSX element to be rendered if the user is authenticated.
 */

const AuthRoute = ({ children }: { children: JSX.Element }) => {
  //roles rights start

//   const isAuthenticated = getToken() !== null ? true : false; // get Token or flag from Localstorage for dynamic
//   const location = useLocation();

//   let newPath: any;
//         // const array: any = [];
      
//         // const token = localStorage.getItem("accessToken");
//         // let decode: any;
//         // let newArray: any;
//         // let newPath: any;
      
      
//   if (!isAuthenticated) {
//     return <Navigate to="/login" state={{ from: location }} />;
//   }
//   if (isAuthenticated) {
//     newPath = location.pathname;
//     if(newPath!=="/access-denied"){
        
//       if(isNullUndefinedOrBlank(children.props?.accessType)){
//         return <Navigate to="/access-denied" state={{ from: location }}    />;
//       }

//     }
//   }
      
//   return children;

// }
//roles rights end


/**get Token or flag from Localstorage for dynamic  */
const isAuthenticated = getToken() !== null ? true : false; 
const location = useLocation();
// const array: any = [];

// const token = localStorage.getItem("accessToken");
// let decode: any;
// let newArray: any;
// let newPath: any;

if (!isAuthenticated) {
  return <Navigate to={ENUMFORROUTES.LOGIN} state={{ from: location }} />;
}

// Entitlement-aware guard: if user is authenticated but on a protected app route
// and lacks subscription, redirect to plan details. We rely on server 403s to indicate
// no subscription. Since we cannot query here synchronously, route-level guards should
// be added where available. As a safety net, if current path is dashboard and the app
// detects missing data (handled elsewhere), we don't bounce here. For now, just allow.

return children;

}

export default AuthRoute;