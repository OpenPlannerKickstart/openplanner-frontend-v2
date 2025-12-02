import React from 'react'
import { Route, HashRouter as Router, Routes, useLocation } from 'react-router-dom';
import { getToken } from './Utility/Helper';
import Login from './pages/auth/Login/Login';

import { RouterProps } from './interfaces';


import Sidebar from './components/Sidebar/Sidebar';
import GuestRoute from './common/GuestRoute';
import AuthRoute from './common/AuthRoute';
import SubscribedRoute from './common/SubscribedRoute';
import NotFound from './components/NotFound/NotFound';

import Navbar from './components/Navbar/Navbar';

import { ENUMFORROUTES } from './interfaces/enum';
import Dashboard from './pages/Customer/Dashboard/Dashboard';
import PageComponent from './pages/Customer/PageComponent/PageComponent';
import ForgotPassword from './pages/auth/ForgotPassword/ForgotPassword';
// import NewPassword from './pages/auth/NewPassword/NewPassword';
import Registration from './pages/auth/Registration/Registration';
import Courses from './pages/Customer/Courses/Courses';
import Task from './pages/Customer/Task/Task';
// import VerifySignupOtp from './pages/auth/Registration/VerifySignupOtp';
import Calendar from './pages/Customer/Calendar/CalendarEvent';
import Settings from './pages/Customer/Settings/Settings';
import EditCourse from './pages/Customer/Courses/EditCourse';
// import { hasUnsavedChanges } from './redux/User/Settings/settingsSlice';
// import { RootState } from './redux/store';
// import { useDispatch, useSelector } from 'react-redux';
import NavigationConfirm from './NavigationConfirm';
import { PaymentSuccessfull } from './pages/auth/Registration/PaymentSuccessfull';
import { PaymentFailed } from './pages/auth/Registration/PaymentFailed';
import { PaymentPlans } from './pages/auth/Registration/PaymentPlans';
import Groups from './pages/Customer/Groups/Groups';
import GlobalSyllabusUploadModal from './components/GlobalSyllabusUploadModal/GlobalSyllabusUploadModal';
const ParentsLanding = React.lazy(() => import('./pages/Parents/ParentsLanding'));
// @ts-ignore - TS resolver can misreport on lazy dynamic imports in some configs
const ParentsSuccess = React.lazy(() => import('./pages/Parents/ParentsSuccess'));
// @ts-ignore
const ParentsContinue = React.lazy(() => import('./pages/Parents/ParentsContinue'));
// @ts-ignore - TS resolver can misreport on lazy dynamic imports in some configs
const ParentsCancel = React.lazy(() => import('./pages/Parents/ParentsCancel'));
// @ts-ignore - TS resolver can misreport on lazy dynamic imports in some configs
const ParentsManageBilling = React.lazy(() => import('./pages/Parents/ParentsManageBilling'));

/** Define private  routes */
const privateRoutes: RouterProps[] = [
  {
    path: ENUMFORROUTES.DASHBOARD,
    component: <Dashboard />,
    caseSensitive: true,
    url: ENUMFORROUTES.DASHBOARD,
  },
  {
    path: ENUMFORROUTES.PAGE_COMPONENT,
    component: <PageComponent />,
    caseSensitive: true,
    url: ENUMFORROUTES.PAGE_COMPONENT,
  },
  {
    path: ENUMFORROUTES.COURSES,
    component: <Courses />,
    caseSensitive: true,
    url: ENUMFORROUTES.COURSES,
  },
  {
    path: ENUMFORROUTES.TASK,
    component: <Task />,
    caseSensitive: true,
    url: ENUMFORROUTES.TASK,
  },
  {
    path: ENUMFORROUTES.CALENDAR,
    component: <Calendar />,
    caseSensitive: true,
    url: ENUMFORROUTES.CALENDAR,
  },
  {
    path: ENUMFORROUTES.SETTINGS,
    component: <Settings />,
    caseSensitive: true,
    url: ENUMFORROUTES.SETTINGS,
  },
  // Conditionally include Groups route via feature flag later if needed in rendering
  {
    path: ENUMFORROUTES.GROUPS,
    component: <Groups />,
    caseSensitive: true,
    url: ENUMFORROUTES.GROUPS,
  },
  // Deep-link to a specific group chat: /groups/:groupId
  {
    path: "/groups/:groupId",
    component: <Groups />,
    caseSensitive: true,
    url: "/groups/:groupId",
  },
  {
    path: ENUMFORROUTES.EDIT_COURSE,
    component: <EditCourse />,
    caseSensitive: true,
    url: ENUMFORROUTES.EDIT_COURSE,
  },
   



];
/** Define public Routes */
const publicRoutes: RouterProps[] = [
  {
    path: "/",
    component: <Login />,
    caseSensitive: true,
  },
  {
    path: ENUMFORROUTES.LOGIN,
    component: <Login />,
    caseSensitive: true,
  },

  {
    path: ENUMFORROUTES.FORGOTPASSWORD,
    component: <ForgotPassword />,
    caseSensitive: true,
  },
  // {
  //   path: ENUMFORROUTES.NEWPASSWORD,
  //   component: <NewPassword />,
  //   caseSensitive: true,
  // },
  {
    path: ENUMFORROUTES.REGISTRATION,
    component: <Registration />,
    caseSensitive: true,
  },
  // {
  //   path: ENUMFORROUTES.VERIFY_SIGNUP_OTP,
  //   component: <VerifySignupOtp />,
  //   caseSensitive: true,
  // },

  // {
  //     path: "/access-denied",
  //     component: <AccessDenied />,
  //     caseSensitive: true,
  // },
 {
    path: ENUMFORROUTES.PLAN_DETAILS,
    component: <PaymentPlans />,
    caseSensitive: true,
    url: ENUMFORROUTES.PLAN_DETAILS,
  },
    {
    path: ENUMFORROUTES.SUCCESS,
    component: <PaymentSuccessfull />,
    caseSensitive: true,
    url: ENUMFORROUTES.SUCCESS,
  },
    {
    path: ENUMFORROUTES.FAILURE,
    component: <PaymentFailed />,
    caseSensitive: true,
    url: ENUMFORROUTES.FAILURE,
  },
];

const Layout = ({ isAuthenticated, children }: { isAuthenticated: boolean, children: React.ReactNode }) => {
  const location = useLocation();
  const isParentsRoute = location.pathname.startsWith(ENUMFORROUTES.PARENTS);
  const isPaywallRoute = location.pathname === ENUMFORROUTES.PLAN_DETAILS;
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
  const showChrome =
    isAuthenticated && (hasSubscription || isFreemium) && !isParentsRoute && !isPaywallRoute;
  return (
    <div className={showChrome ? 'layout-wrapper' : ''} id={showChrome ? "layout-wrapper" : ''}>
      {showChrome && (
        <Navbar />
      )}
      {showChrome && (
        <Sidebar />
      )}
      <div className={showChrome ? 'main-content' : ''}>
        {children}
        {!isParentsRoute && !isPaywallRoute && <NavigationConfirm />}
      </div>
    </div>
  )
}

/**
 * AppRouter Component
 */
const AppRouter = (): JSX.Element => {
  /** Check if the user is authenticated  */
  const isAuthenticated = getToken() !== null ? true : false;
  //roles and Righs Start
  // useEffect(() => {

  //   if (isAuthenticated === false) {
  //     const routeList = [...privateRoutes];
  //     const updatePageData = routeList.map((val) => {
  //       val.component = getPageJsx(val.path, "");
  //       val.accessType = "";
  //       return val;
  //     });

  //     setPrivateRouteList(updatePageData);
  //     return;
  //   }

  // let token: any = localStorage.getItem("token");

  //  const decode: any = jwtDecode(token);
  //  console.log(decode,"decode value");
  //   const decode: any =[ENUMFORROUTES.DASHBOARD,ENUMFORROUTES.REPORTS]
  //   const newPageData = [...decode];

  //   const routeList = [...privateRoutes];
  //   const updatePageData = routeList.filter((val) => {
  //     newPageData.map((item, index) => {
  //       if (!isNullUndefinedOrBlank(item.accessType)) {

  //         if (val.url === item.url) {
  //           val.accessType = item.accessType;
  //         }
  //         val.component = getPageJsx(val.path, val.accessType);
  //       }
  //     })

  //     return val;
  //   })
  // console.log(newPageData,"api Route");
  //   setPrivateRouteList(updatePageData);


  // }, [isAuthenticated]);



  // const getPageJsx = (url, accessType) => {
  //   let jsx: any = null;

  //   switch (url) {

  //     case ENUMFORROUTES.DASHBOARD:
  //       jsx = <Dashboard accessType={accessType} />
  //       break;
  //     case ENUMFORROUTES.REPORTS:
  //       jsx = <Reports accessType={accessType} />
  //       break;


  //     default:
  //       break;
  //   }
  //   return jsx;
  // }
  // React.useEffect(() => {
  //   document.documentElement.setAttribute('data-layout', 'vertical');
  //   document.documentElement.setAttribute('data-sidebar-size', 'lg');

  //   // var verticalOverlay = document.getElementsByClassName("vertical-overlay");
  //   // if (verticalOverlay) {
  //   //   verticalOverlay[0].addEventListener("click", function () {
  //   //     document.body.classList.remove("vertical-sidebar-enable");
  //   //   });
  //   // }

  //   const windowSize = document.documentElement.clientWidth;
  //   if (windowSize == 768) {
  //     document.documentElement.setAttribute('data-sidebar-size', 'sm');
  //   }
  // }, [isAuthenticated]);





  // return (
  //   <div className={isAuthenticated  && !window.location.href.includes(ENUMFORROUTES.ACCESS_DENIED)  ? 'layout-wrapper' : ''} id={isAuthenticated  && !window.location.href.includes(ENUMFORROUTES.ACCESS_DENIED) ? "layout-wrapper" : ''}>

  //     <Router>
  //       {isAuthenticated && props.defaultRedux && <Navbar />}
  //       {isAuthenticated && props.defaultRedux && <Sidebar />}
  //       <div className={isAuthenticated ? 'main-content' : ''}>
  //         <React.Suspense
  //           fallback={<div className="lazy-loading">Loading...</div>}
  //         >
  //           <Routes>
  //             {/*               
  //             {publicRoutes.map((route, i) => (
  //               // <GuestRoute key={i} {...route} />
  //               <Route
  //                 key={i}
  //                 caseSensitive={route.caseSensitive}
  //                 path={route.path}
  //                 element={<GuestRoute>{route.component}</GuestRoute>}
  //               />
  //             ))}
  //             {!isEmptyObjectOrNullUndefiend(privateRouteList) ?
  //               <>

  //                 {privateRouteList.map((route, i) => (
  //                   // <GuestRoute key={i} {...route} />

  //                   <Route
  //                     key={i}
  //                     caseSensitive={route.caseSensitive}
  //                     path={route.path}
  //                     element={<AuthRoute>{route.component}</AuthRoute>}
  //                   />
  //                 ))}
  //               </> : <Route path="*" element={<NotFound />} />}
  //               <Route path="*" element={<NotFound />} /> */}

  //             {!isEmptyObjectOrNullUndefiend(publicRoutes) && !isEmptyObjectOrNullUndefiend(privateRouteList) ?
  //               <>
  //                 {publicRoutes.map((route, i) => (
  //                   // <GuestRoute key={i} {...route} />
  //                   <Route
  //                     key={i}
  //                     caseSensitive={route.caseSensitive}
  //                     path={route.path}
  //                     element={<GuestRoute>{route.component}</GuestRoute>}
  //                   />
  //                 ))} <Route path="*" element={<NOTFOUND />} /> </> : <></>}
  //             {!isEmptyObjectOrNullUndefiend(privateRouteList) ?
  //               <>


  //                 {privateRouteList?.map((route, i) => (
  //                   // <GuestRoute key={i} {...route} />

  //                   // !isNullUndefinedOrBlank(route.accessType) ?

  //                   <Route
  //                     key={i}
  //                     caseSensitive={route.caseSensitive}
  //                     path={route.path}
  //                     element={<AuthRoute>{route.component}</AuthRoute>}
  //                   />
  //                   // :
  //                   // <Route path="/access-denied" element={<AccessDenied />} />
  //                 ))}

  //                 <Route path="*" element={<NOTFOUND />} />
  //               </> : <></>
  //             }
  //             {/* <Route path="/session-expired" element={<SessionExpired />} /> */}
  //           </Routes>
  //         </React.Suspense>
  //       </div>
  //       {/* {isAuthenticated && <Footer />} */}
  //     </Router>
  //   </div>
  // )
  // role sight end




  return (
    <Router>
      <Layout isAuthenticated={isAuthenticated}>
        <React.Suspense fallback={<div className="lazy-loading">Loading...</div>}>
          <Routes>
            {/* Parents flow (standalone, accessible regardless of auth) */}
            <Route caseSensitive path={ENUMFORROUTES.PARENTS} element={<ParentsLanding />} />
            <Route caseSensitive path={ENUMFORROUTES.PARENTS_SUCCESS} element={<ParentsSuccess />} />
            <Route caseSensitive path={ENUMFORROUTES.PARENTS_CONTINUE} element={<ParentsContinue />} />
            <Route caseSensitive path={ENUMFORROUTES.PARENTS_CANCEL} element={<ParentsCancel />} />
            <Route caseSensitive path={ENUMFORROUTES.PARENTS_MANAGE_BILLING} element={<ParentsManageBilling />} />

            {publicRoutes.map((route, i) => (
              <Route
                key={i}
                caseSensitive={route.caseSensitive}
                path={route.path}
                element={<GuestRoute>{route.component}</GuestRoute>}
              />
            ))}

            {privateRoutes.map((route, i) => (
              <Route
                key={i}
                caseSensitive={route.caseSensitive}
                path={route.path}
                element={<AuthRoute><SubscribedRoute>{route.component}</SubscribedRoute></AuthRoute>}
              />
            ))}

            <Route path="*" element={<NotFound />} />
          </Routes>
        </React.Suspense>
      </Layout>
      {/* Global syllabus upload modal - floats above everything, inside Router for navigation */}
      <GlobalSyllabusUploadModal />
    </Router>
  )
}


export default AppRouter;
