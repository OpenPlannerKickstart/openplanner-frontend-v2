import React, { useCallback, useEffect, useState } from 'react'
// import logo from "../../assets/images/dummy-logo.svg";
import defaultAvatar from "../../assets/images/avatar-default.svg";
import { Button, Form } from 'react-bootstrap';
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
import { get, post } from '../../Utility/httpInterceptor';
import { useNotifications } from '../../context/SocketContext';
const SIDEBAR_BREAKPOINT = 1024;

const Navbar = (props) => {
  const [SidebarSize, setSidebarSize] = useState(() => window.innerWidth > SIDEBAR_BREAKPOINT ? 'lg' : 'sm');
  const [isMobileView, setIsMobileView] = useState(() => window.innerWidth <= SIDEBAR_BREAKPOINT);

  // Keep SidebarSize in sync with document attribute changes (from Sidebar auto-toggle)
  // Also track mobile view state for hiding hamburger button
  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'data-sidebar-size') {
          const currentSize = document.documentElement.getAttribute('data-sidebar-size') || 'lg';
          setSidebarSize(currentSize);
        }
      });
    });
    observer.observe(document.documentElement, { attributes: true });

    const handleResize = () => {
      setIsMobileView(window.innerWidth <= SIDEBAR_BREAKPOINT);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const toggleMenu = () => {
    if (window.innerWidth > SIDEBAR_BREAKPOINT) {
      const newSize = SidebarSize === 'sm' ? 'lg' : 'sm';
      setSidebarSize(newSize);
      document.documentElement.setAttribute('data-sidebar-size', newSize);
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
    // Always show the panel first
    handleNotificationsShow();
    
    // Then fetch data in the background
    try {
      await dispatch(getAllNotificationAPI());
      countUnreadNotification();
    } catch (err) {
      // Panel is already open, just continue
    }
    fetchInvites();
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
  // --- Invites inbox state (for notifications panel) ---
  type InviteItem = { id: string; groupId: string; fromUserId?: string; fromUsername?: string; groupName?: string; fromName?: string; message?: string; createdAt?: any; read?: boolean };
  const [invites, setInvites] = useState<Array<InviteItem>>([]);
  // Persist read state locally so the blue background can be cleared without removing the invite
  const getInviteReadSet = () => { try { return new Set<string>(JSON.parse(localStorage.getItem('op_invite_read') || '[]')); } catch { return new Set<string>(); } };
  const setInviteReadSet = (s: Set<string>) => { try { localStorage.setItem('op_invite_read', JSON.stringify(Array.from(s))); } catch {} };
  const fetchInvites = async () => {
    try {
      const res: any = await get('invites');
      const data = res?.data ?? res;
      const list: any[] = data?.invites ?? [];
      const readSet = getInviteReadSet();
      const enriched = await Promise.all(list.map(async (inv) => {
        let groupName = inv?.groupName;
        if (!groupName && inv?.groupId) {
          try {
            const gres: any = await get(`groups/${inv.groupId}`);
            const g = gres?.data ?? gres;
            if (g?.name) groupName = g.name;
          } catch {}
        }
        return {
          ...inv,
          groupName,
          fromName: inv?.from?.displayName || inv?.fromUsername || inv?.from?.username,
          read: readSet.has(inv.id)
        } as InviteItem;
      }));
      setInvites(enriched);
    } catch {}
  };

  // Badge = unread notifications (redux) + unread group invites
  useEffect(() => {
    const base = !isNullUndefinedOrBlank(countOfUnreadNotificationData) ? countOfUnreadNotificationData : 0;
    const unreadInvites = (invites || []).filter(it => !it.read).length;
    setNotificationCount(base + unreadInvites);
  }, [countOfUnreadNotificationData, invites])

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

  // Direct invite socket → update invites and badge
  useEffect(() => {
    const uid = getUserSubId();
    if (!uid) return;
    const path = `user:${uid}:invite`;
    const onInvite = (payload: any) => {
      if (!payload || !payload.id) return;
      (async () => {
        let name = payload.groupName as string | undefined;
        if (!name && payload.groupId) {
          try {
            const gres: any = await get(`groups/${payload.groupId}`);
            const g = gres?.data ?? gres; if (g?.name) name = g.name;
          } catch {}
        }
        const readSet = getInviteReadSet();
        setInvites(prev => [{
          id: payload.id,
          groupId: payload.groupId,
          fromUserId: payload.from?.id,
          fromUsername: payload.from?.username,
          groupName: name,
          fromName: payload.from?.displayName || payload.from?.username,
          message: payload.message,
          createdAt: payload.createdAt,
          read: readSet.has(payload.id) ? true : false
        }, ...prev]);
        setNotificationAlert(true);
        setTimeout(() => setNotificationAlert(false), 5000);
        // badge updates via invites effect (combined with unread)
      })();
    };
    subscribeToPath(path, onInvite);
    return () => { unsubscribeFromPath(path, onInvite); };
  }, [subscribeToPath, unsubscribeFromPath]);

  // Prefetch invites at mount so they render immediately when panel opens
  useEffect(() => { fetchInvites(); }, []);
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

              {/* Hide hamburger button on mobile when sidebar is locked collapsed */}
              {!isMobileView && (
              <Button variant='primary' className="btn-icon btn-secondary-two" id="topnav-hamburger-icon" onClick={toggleMenu}>
                <i className='material-symbols-outlined'>menu</i>
              </Button>
              )}

              {/* <!-- App Search--> */}


              {/* <div className="header-item navbar-add-btn">
                <Button variant='primary' className='btn-icon-text btn-secondary-two'> <i className='material-symbols-outlined'>add_circle</i> Add New Event/Syllabus</Button>
              </div> */}
            </div>

            <div className="navbar-header-right d-flex align-items-center">

              <div className="dropdown topbar-head-dropdown notification-button header-item" id="notificationDropdown">
                <button 
                  type="button" 
                  className={`btn btn-lg btn-outline-white btn-icon rounded-pill ${notificationAlert ? "new-notification" : ""}`} 
                  onClick={() => {
                    setNotificationShow(true);
                    openNotificationModal();
                  }}
                >
                  <i className="material-symbols-outlined">notifications</i>
                  {notificationCount > 0 && (
                    <div className='header-counter'>{notificationCount}</div>
                  )}
                </button>
              </div>
              <div className="dropdown header-item topbar-user">
                <button type="button" className="topbar-user-btn" id="page-header-user-dropdown" data-bs-toggle="dropdown"
                  aria-haspopup="true" aria-expanded="false">
                  <span className="d-flex align-items-center">
                    <img
                      className="rounded-circle header-profile-user"
                      style={{ width: 40, height: 40, objectFit: 'cover', objectPosition: 'center' }}
                      src={!isNullUndefinedOrBlank(userData?.profile_image) ? userData?.profile_image : defaultAvatar}
                      alt="Header Avatar"
                    />
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
      {/* Notification Panel Backdrop */}
      <div 
        className={`notification-panel-backdrop ${notificationShow ? 'active' : ''}`} 
        onClick={handleNotificationClose}
      />
      
      {/* Notification Panel */}
      <div className={`notification-panel ${notificationShow ? 'active' : ''}`}>
        <div className="notification-panel-header">
          <h3 className="notification-panel-title">Notifications</h3>
          <div className="notification-panel-actions">
            {(!isEmptyObjectOrNullUndefiend(notificationList) || (invites && invites.length > 0)) && (
              <button 
                className="clear-all-btn" 
                onClick={() => { 
                  const allId = notificationList.map((val) => val.id); 
                  clearNotification(allId); 
                }}
              >
                Clear All
              </button>
            )}
            <button className="close-panel-btn" onClick={handleNotificationClose}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </div>
        <div className="notification-panel-body">
          {/* Pending group invites */}
          {invites && invites.length > 0 && invites.map((it) => {
            const created = (it as any).createdAt || (it as any).created_at || Date.now();
            return (
              <div key={it.id} className={`notification-item ${!it.read ? 'unread' : ''}`}>
                <div className="notification-icon event">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                </div>
                <div className="notification-content">
                  <div className="notification-title">Group Invite</div>
                  <p className="notification-message">{(it.fromUsername || it.fromName || 'Someone')} invited you to join {it.groupName || 'a group'}</p>
                  <span className="notification-time">{formatedDate(created, `MMM DD, [at] hh:mm a`)}</span>
                  <div className="notification-actions">
                    <button 
                      className="btn-accept" 
                      onClick={async () => { 
                        try { 
                          const res: any = await post(`invites/${it.id}/accept`, {}); 
                          const data = res?.data ?? res; 
                          handleNotificationClose(); 
                          if (data?.groupId) { 
                            navigate(`/groups/${data.groupId}?tab=groups`); 
                          } else { 
                            navigate(`/groups?tab=groups`); 
                          } 
                        } catch {} 
                      }}
                    >
                      Join
                    </button>
                    <button 
                      className="btn-decline"
                      onClick={async () => { 
                        try { 
                          await post(`invites/${it.id}/decline`, {}); 
                          fetchInvites(); 
                        } catch {} 
                      }}
                    >
                      Decline
                    </button>
                  </div>
                </div>
                <button 
                  className="notification-dismiss"
                  onClick={() => { 
                    const r = getInviteReadSet(); 
                    r.add(it.id); 
                    setInviteReadSet(r); 
                    setInvites(prev => prev.map(x => x.id === it.id ? { ...x, read: true } : x)); 
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6L6 18M6 6l12 12"/>
                  </svg>
                </button>
              </div>
            );
          })}
          
          {/* Regular notifications */}
          {!isEmptyObjectOrNullUndefiend(notificationList) && notificationList.map((item) => {
            // Determine notification type based on message content
            const getNotificationType = (msg: string) => {
              const lowerMsg = msg?.toLowerCase() || '';
              if (lowerMsg.includes('assignment') || lowerMsg.includes('due')) return 'reminder';
              if (lowerMsg.includes('class') || lowerMsg.includes('event')) return 'event';
              if (lowerMsg.includes('course') || lowerMsg.includes('material')) return 'course';
              return 'alert';
            };
            const notifType = getNotificationType(item.message);
            
            // Get icon based on type
            const getIcon = (type: string) => {
              switch(type) {
                case 'reminder':
                  return (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/>
                      <polyline points="12 6 12 12 16 14"/>
                    </svg>
                  );
                case 'event':
                  return (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                      <line x1="16" y1="2" x2="16" y2="6"/>
                      <line x1="8" y1="2" x2="8" y2="6"/>
                      <line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>
                  );
                case 'course':
                  return (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                    </svg>
                  );
                default:
                  return (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="12" y1="8" x2="12" y2="12"/>
                      <line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                  );
              }
            };
            
            return (
              <div key={item.id} className={`notification-item ${!item.is_read ? 'unread' : ''}`}>
                <div className={`notification-icon ${notifType}`}>
                  {getIcon(notifType)}
                </div>
                <div className="notification-content">
                  <div className="notification-title">
                    {notifType === 'reminder' ? 'Reminder' : 
                     notifType === 'event' ? 'Event' : 
                     notifType === 'course' ? 'Course Update' : 'Alert'}
                  </div>
                  <p className="notification-message" title={item.message}>{item.message}</p>
                  <span className="notification-time">{formatedDate(item.created_at, `MMM DD, [at] hh:mm a`)}</span>
                </div>
                <button 
                  className="notification-dismiss"
                  onClick={() => clearNotification(item.id)}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6L6 18M6 6l12 12"/>
                  </svg>
                </button>
              </div>
            );
          })}
          
          {/* Empty state */}
          {isEmptyObjectOrNullUndefiend(notificationList) && (!invites || invites.length === 0) && (
            <div className="notification-empty">
              <div className="notification-empty-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                </svg>
              </div>
              <p className="notification-empty-text">You have no new notifications</p>
            </div>
          )}
        </div>
      </div>
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
