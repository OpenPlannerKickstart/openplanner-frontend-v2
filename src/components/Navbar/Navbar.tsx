import React, { useCallback, useEffect, useState } from 'react'
// import logo from "../../assets/images/dummy-logo.svg";
import defaultAvatar from "../../assets/images/avatar-default.svg";
import { Button, Form, Offcanvas } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import notVoucherFound from "/assets/images/not-voucher-found.svg";
import { formatedDate, getUserFirstLastName, getUserSubId, isEmptyObjectOrNullUndefiend, isNullUndefinedOrBlank, removeCookieByName } from '../../Utility/Helper';
import { connect, useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { logoutFromSystem } from '../../redux/Service/auth/login';
import { ENUMFORROUTES } from '../../interfaces/enum';
import { getUserAPI } from '../../redux/Service/User/Settings/settings';
import { NotificationData } from '../../interfaces/interface';
import { clearNotificationAPI, getAllNotificationAPI, getCountOfUnreadNotificationAPI, readNotificationAPI } from '../../redux/Service/User/Notification/notification';
import {
  useStompClient,
  // StompSessionProvider,
  useSubscription,
} from "react-stomp-hooks";
import { io } from 'socket.io-client';
import { NOTIFICATION_ALERT } from '../../Utility/ApiList';
import { ts } from '../../Utility/Toaster';
import { API_URL, WEB_SOCKET_CONNECTION_URL } from '../../Utility/Config';
import { useNotifications } from '../../context/SocketContext';
const Navbar = (props) => {
  const [SidebarSize, setSidebarSize] = useState('lg');
  const windowSize = document.documentElement.clientWidth;

  const toogleMenu = () => {
    if (windowSize > 1024) {
      setSidebarSize(SidebarSize === 'sm' ? 'lg' : 'sm');
      document.documentElement.setAttribute('data-sidebar-size', SidebarSize === 'lg' ? 'sm' : 'lg');
    }
  };

  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const callLogout = async () => {

    await dispatch(logoutFromSystem());
  };

  const [userData, setUserData] = useState<any>(null)
  const getUserData = async () => {
    const response = await dispatch(getUserAPI());
    // console.log(response, "res")
    if (response) {

    }
  }

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      getUserData();
    }, 300);
    return () => {
      clearTimeout(delayDebounceFn);
    }

  }, []);

  useEffect(() => {
    if (!isNullUndefinedOrBlank(props.userData)) {
      setUserData(props.userData)
    }
  }, [props.userData])

  /** --------------------Notification start------------------------*/

  const [notificationShow, setNotificationShow] = useState(false);

  const handleNotificationClose = () => setNotificationShow(false);
  const handleNotificationsShow = () => setNotificationShow(true);

  const [notificationList, setNotiFicationList] = useState<Array<NotificationData>>([]);
  const [notificationCount, setNotificationCount] = useState<any>(0);
  const [notificationAlert, setNotificationAlert] = useState<boolean>(false);
  const notificationData: any = useSelector(
    (state: RootState) => state.NotificationReducer.notificationData);
  const countOfUnreadNotificationData: any = useSelector(
    (state: RootState) => state.NotificationReducer.countOfUnreadNotificationData);
  const [is_readAll, setis_readAll] = useState<boolean>(false);
  // const socket = io(API_URL);

  const openNotificationModal = async () => {
    const response = await dispatch(getAllNotificationAPI());
    if (response) {
      handleNotificationsShow();
      countUnreadNotification();
    }

  }
  const readNotification = async (notificationId) => {
    if (isNullUndefinedOrBlank(notificationId)) {
      return;
    }

    let reqNotificationId: any = [];
    if (notificationId instanceof Array) {
      reqNotificationId = notificationId;
    }
    else {
      reqNotificationId = [notificationId];
    }
    const reqBody = {
      id: reqNotificationId,
      is_read: true

    }

    const response = await dispatch(readNotificationAPI(reqBody));

    if (!isNullUndefinedOrBlank(response.payload)) {
      await dispatch(getAllNotificationAPI());
    }
  }

  const clearNotification = async (notificationId) => {
    if (isNullUndefinedOrBlank(notificationId)) {
      return;
    }

    let reqNotificationId: any = [];
    if (notificationId instanceof Array) {
      reqNotificationId = notificationId;
    }
    else {
      reqNotificationId = [notificationId];
    }
    const reqBody = {
      id: reqNotificationId,


    }

    const response = await dispatch(clearNotificationAPI(reqBody));
    // console.log(response);
    if (!isNullUndefinedOrBlank(response.payload)) {
      await dispatch(getAllNotificationAPI());
    }
  }



  const countUnreadNotification = async () => {
    const response = await dispatch(getCountOfUnreadNotificationAPI());

  }
  useEffect(() => {
    if (!notificationShow) {
      countUnreadNotification();
    }

  }, [notificationShow])


  useEffect(() => {
    // console.log(props.notificationData);
    if (!isEmptyObjectOrNullUndefiend(notificationData)) {
      setNotiFicationList(notificationData);
      // setNotiFicationList([]);
    }
    else {
      setNotiFicationList([]);
    }

  }, [notificationData])


  useEffect(() => {

    if (!isNullUndefinedOrBlank(countOfUnreadNotificationData)) {
      setNotificationCount(countOfUnreadNotificationData);
    } else {
      setNotificationCount(0)
    }
  }, [countOfUnreadNotificationData])
  useEffect(() => {
    if (!isEmptyObjectOrNullUndefiend(notificationList)) {
      const newData = [...notificationList];
      const statusCheck = newData.some((val) => val.is_read === false);
      // console.log(statusCheck,"statusCheck");
      setis_readAll(statusCheck);
    }

  }, [notificationList])


  // useSubscription(`${NOTIFICATION_ALERT}${getUserSubId()}`, async (item) => {

  //   if (!isNullUndefinedOrBlank(item)) {

  //     try {
  //       const newNotificationObj = typeof item.body === "string" && item.body !== "" ? JSON.parse(item.body) : item.body;
  //       ts(`📅 ${newNotificationObj?.message}`, true)
  //       // Show the notification alert
  //       setNotificationAlert(true);

  //       // Hide the alert after 8 seconds
  //       setTimeout(() => {
  //         setNotificationAlert(false);
  //       }, 8000);
  //       setNotiFicationList([{ ...newNotificationObj, message: `📅 ${newNotificationObj?.message}` }, ...notificationList]);
  //       setNotificationCount(notificationCount + 1);
  //       // Dispatch actions to fetch notifications and unread count
  //       // await dispatch(getAllNotificationAPI());
  //       // await dispatch(getCountOfUnreadNotificationAPI());
  //     } catch (error) {
  //       console.log(error)
  //       console.error("Error handling subscription item:", error);
  //     }
  //   }
  // });


  // useEffect(() => {
  //   // Connect and listen for notifications
  //   socket.on(`receiveNotification/${getUserSubId()}`, (item) => {
  //     // console.log(item, "item from socket");
  //     if (item?.message) {
  //       try {
  //         const newNotificationObj =
  //           typeof item.message === 'string' && item.message !== '' ? JSON.parse(item?.message) : item?.message;

  //         ts(`📅 ${newNotificationObj?.message}`, true);

  //         // Show the notification alert
  //         setNotificationAlert(true);

  //         // Hide the alert after 8 seconds
  //         setTimeout(() => {
  //           setNotificationAlert(false);
  //         }, 8000);

  //         // Update the notification list and count
  //         setNotiFicationList([
  //           { ...newNotificationObj, message: `📅 ${newNotificationObj?.message}` },
  //           ...notificationList,
  //         ]);

  //         setNotificationCount(notificationCount + 1);

  //         // Dispatch actions if needed (uncomment and add logic for your actions)
  //         // await dispatch(getAllNotificationAPI());
  //         // await dispatch(getCountOfUnreadNotificationAPI());
  //       } catch (error) {
  //         console.error('Error handling notification:', error);
  //       }
  //     }
  //   });

  //   // Cleanup: Remove the listener when the component unmounts
  //   return () => {
  //     socket.off(`receiveNotification/${getUserSubId()}`);
  //   };
  // }, [notificationList, notificationCount]);
  /** --------------------Notification end------------------------*/

  const { subscribeToPath, unsubscribeFromPath } = useNotifications();

  // useCallback ensures the same function reference
  const handleNotification = useCallback((data: any) => {
    if (data?.message) {
      try {
        const newNotificationObj =
          typeof data.message === 'string' && data.message !== '' ? JSON.parse(data?.message) : data?.message;

        ts(`📅 ${newNotificationObj?.message}`, true);

        setNotificationAlert(true);
        setTimeout(() => {
          setNotificationAlert(false);
        }, 8000);

        setNotiFicationList([
          { ...newNotificationObj, message: `📅 ${newNotificationObj?.message}` },
          ...notificationList,
        ]);
        setNotificationCount((prev) => prev + 1);
      } catch (error) {
        console.error('Error handling notification:', error);
      }
    }
  }, [notificationList]);

  useEffect(() => {
    const path = `receiveNotification/${getUserSubId()}`;
    subscribeToPath(path, handleNotification);
    return () => {
      unsubscribeFromPath(path, handleNotification);
    };
  }, [subscribeToPath, unsubscribeFromPath, handleNotification]);
  // const handleSendNotification = () => {
  //   const path = 'notifications/send';
  //   const data = {
  //     message: 'Hello, this is a test notification!',
  //     userId: 123,
  //   };

  //   sendNotification(path, data);
  // };

  return (
    <>
      <header id="page-topbar">
        <div className="layout-width">
          <div className="navbar-header">
            <div className="navbar-header-left ">
              {/* <!-- LOGO --> */}


              <Button variant='primary' className="btn-icon btn-secondary-two" id="topnav-hamburger-icon" onClick={toogleMenu}>
                <i className='material-symbols-outlined'>menu</i>
              </Button>

              {/* <!-- App Search--> */}


              {/* <div className="header-item navbar-add-btn">
                <Button variant='primary' className='btn-icon-text btn-secondary-two'> <i className='material-symbols-outlined'>add_circle</i> Add New Event/Syllabus</Button>
              </div> */}
            </div>

            <div className="navbar-header-right d-flex align-items-center">

              <div className="dropdown topbar-head-dropdown notification-button header-item" id="notificationDropdown">
                <button type="button" className={`btn btn-lg btn-outline-white btn-icon rounded-pill ${notificationAlert ? "new-notification" : ""}`} onClick={() => { openNotificationModal(); }} >
                  <i className="material-symbols-outlined">notifications</i>
                  {
                    notificationCount > 0 ?
                      <div className='header-counter'>{!isNullUndefinedOrBlank(notificationCount) ? notificationCount : 0}</div>
                      : <></>
                  }
                </button>
              </div>
              <div className="dropdown header-item topbar-user">
                <button type="button" className="topbar-user-btn" id="page-header-user-dropdown" data-bs-toggle="dropdown"
                  aria-haspopup="true" aria-expanded="false">
                  <span className="d-flex align-items-center">
                    <img className="rounded-circle header-profile-user"
                      src={!isNullUndefinedOrBlank(userData?.profile_image) ? userData?.profile_image : defaultAvatar} alt="Header Avatar" />
                    <span className="text-start">
                      <span className="d-none d-xl-inline-block  user-name-text">{(!isNullUndefinedOrBlank(userData?.username)) ? `${userData?.username}` : "User"}</span>
                      {/* <span className="d-none d-xl-block  user-name-sub-text">Student</span> */}
                    </span>
                  </span>
                </button>
                <div className="dropdown-menu dropdown-menu-end">
                  {/* <h6 className="dropdown-header" title={`${(!isNullUndefinedOrBlank(userData?.firstname) && !isNullUndefinedOrBlank(userData?.lastname)) ? `${userData?.firstname} ${userData?.lastname}` : "User"}!`}>Welcome {(!isNullUndefinedOrBlank(userData?.firstname) && !isNullUndefinedOrBlank(userData?.lastname)) ? `${userData?.firstname} ${userData?.lastname}` : "User"}!</h6> */}
                  <a className="dropdown-item" onClick={() => { navigate(ENUMFORROUTES.SETTINGS) }}>
                    <i className="mdi mdi-account-circle text-muted fs-16 align-middle me-1"></i>
                    <span className="align-middle" >Profile</span>
                  </a>
                  <a className="dropdown-item"
                    onClick={() => {
                      setTimeout(() => {
                        callLogout();
                      }, 200);
                    }}
                  >
                    <i className="mdi mdi-logout text-muted fs-16 align-middle me-1"></i>
                    <span className="align-middle" data-key="t-logout">Logout</span>
                  </a>
                </div>
              </div>

            </div>
          </div>
        </div>
      </header>
      <Offcanvas show={notificationShow} placement="end" className="notification-offcanvas op-offcanvas style-1">
        <Offcanvas.Header>
          <Offcanvas.Title>Notifications</Offcanvas.Title>
          <button type="button" className="btn-close" onClick={handleNotificationClose}>
            <i className='material-symbols-outlined'>close</i>
          </button>

        </Offcanvas.Header>
        <Offcanvas.Body>
          <div className="Add-new-task-container">
            <div className="op-offcanvas-body-container">
              {
                !isEmptyObjectOrNullUndefiend(notificationList) ?

                  <div className="notification-box">
                    <ul className="list-unstyled">
                      {notificationList.map((item, index) => (
                        <li className={`${item.isNew ? "new" : ""} ${!item.is_read ? "unread" : ""} `} key={item.id}>
                          <div className="noti-details">
                            {/* <h6>SHK Diamond removed diamond</h6> */}
                            <p title={item.message}>{item.message}</p>
                            <span>{(formatedDate(item.created_at, `MMM DD, [at] hh:mm a`))}</span>
                            {/* <span>{!isNullUndefinedOrBlank(item.duration) ? item.duration==="0 seconds"?"now":`${item.duration} ago` : "-"}</span> */}
                          </div>
                          <div className='noti-action'>
                            {
                              item.is_read ? <>
                              </> :
                                <>
                                  <button className="btn btn-sm btn-link text-info" onClick={() => { readNotification(item.id) }}>Mark as read</button>
                                  <div className="vr"></div>
                                </>
                            }
                            <button className="btn btn-sm btn-link text-danger" onClick={() => { clearNotification(item.id) }}>Clear</button>
                          </div>
                        </li>
                      ))}

                      {/* <li className="unread">
                  <div className="noti-details">
                    <h6>SHK Diamond removed diamond</h6>
                    <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
                    <span>02 September 2023 11:30 am</span>
                  </div>
                  <div className='noti-action'>
                    <button className="btn btn-link text-info">Mark as read</button>
                    <div className="vr"></div>
                    <button className="btn btn-link text-danger">Clear</button>
                  </div>
                </li> */}

                    </ul>
                  </div>
                  :
                  <div className="no-notification">
                    <img src={notVoucherFound} alt="D Navinchandra" />
                    <p>You have no new notifications.</p>
                  </div>}
            </div>

            {!isEmptyObjectOrNullUndefiend(notificationList) ?
              <div className="bottom-button-group">
                {
                  is_readAll && <>
                    <Button type="button" className="btn btn-primary ms-auto" onClick={() => { const allId = notificationList.map((val) => { return val.id }); readNotification(allId) }}>
                      Mark all as read
                    </Button>
                  </>
                }
                <Button type="button" className="btn btn-light-white" onClick={() => { const allId = notificationList.map((val) => { return val.id }); clearNotification(allId); }}>
                  Clear All
                </Button>

              </div> : <></>
            }
          </div>
        </Offcanvas.Body>
        {/* <div className="offcanvas-footer">
         <button className="btn btn-link text-primary">View All Notification</button>
       </div> */}
      </Offcanvas>
    </>
  )
}



const mapStateToProps = (state) => ({
  userData: state.SettingsReducer.userData
})

const mapDispatchToProps = {
  getUserAPI
}

export default connect(mapStateToProps, mapDispatchToProps)(Navbar)
