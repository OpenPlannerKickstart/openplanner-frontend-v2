import React from 'react'
import { useLocation,Navigate } from 'react-router-dom';
import { getToken, isNullUndefinedOrBlank } from '../Utility/Helper';
import { ENUMFORROUTES } from '../interfaces/interface';
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

return children;

}

export default AuthRoute;