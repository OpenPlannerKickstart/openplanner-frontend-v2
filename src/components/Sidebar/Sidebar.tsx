import React, { useState } from 'react';
import sidebarLogoLg from "../../assets/images/sidebar-logo-lg.svg";
import sidebarLogosm from "../../assets/images/sidebar-logo-sm.svg";
import { NavLink } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../redux/store';
import { removeCookieByName } from '../../Utility/Helper';
import { logoutFromSystem } from '../../redux/Service/auth/login';
export const Sidebar = () => {
  const [SidebarSize, setSidebarSize] = useState('lg');
  const windowSize = document.documentElement.clientWidth;

  const toogleMenu = () => {
    if (windowSize > 1024) {
      setSidebarSize(SidebarSize === 'sm' ? 'lg' : 'sm');
      document.documentElement.setAttribute('data-sidebar-size', SidebarSize === 'lg' ? 'sm' : 'lg');
    }
  };
  const dispatch: AppDispatch = useDispatch();
  const callLogout = async () => {
    
    await dispatch(logoutFromSystem());
  };
  return (
    <>
      <div className="app-menu navbar-menu" >
        {/* <!-- LOGO --> */}
        < div className="navbar-brand-box" >
          <a href="index.html" className="logo logo-dark">
            {/* <span className="logo-sm">
                            <img src={sidebarLogosm} alt="logoSm" height="48" />
                        </span> */}
            <span className="logo-lg">
              <img src={sidebarLogoLg} alt="sidebarLogoLg" height="48" />
            </span>
          </a>

        </div >
        <div id="scrollbar">
          <div className="container-fluid">
            <div className="navbar-sidemenu">
              <ul className="navbar-nav" id="navbar-nav">
                {/* <li className="menu-title"><span data-key="t-menu">MAIN HOME</span></li> */}
                <li className="nav-item">
                  <NavLink className="nav-link menu-link " to="/dashboard">
                  <i className="material-symbols-outlined">cottage</i> <span data-key="t-widgets">Home</span>
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link menu-link " to="/calendar">
                  <i className="material-symbols-outlined">calendar_month</i> <span data-key="t-widgets">Calendar</span>
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link menu-link " to="/courses">
                  <i className="material-symbols-outlined">book_2</i> <span data-key="t-widgets">Courses</span>
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link menu-link " to="/task">
                    <i className="material-symbols-outlined">ballot</i> <span data-key="t-widgets">Task List</span>
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link menu-link " to="">
                    <i className="material-symbols-outlined">info</i> <span data-key="t-widgets">Help</span>
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link menu-link " to="/settings">
                    <i className="material-symbols-outlined">settings</i> <span data-key="t-widgets">Settings</span>
                  </NavLink>
                </li>
              </ul>
            </div>

            <div className="navbar-bottom navbar-sidemenu">
              {/* <ul className="navbar-nav" id="navbar-nav">
                <li className="nav-item">
                  <NavLink className="nav-link menu-link " to="/settings">
                    <i className="th-outline-setting-2"></i> <span data-key="t-widgets">Settings</span>
                  </NavLink>
                </li>
                <li className="nav-item" onClick={() => {
                  setTimeout(() => {
                    callLogout();
                  }, 200);
                }}>
                  <NavLink className="nav-link menu-link" to="">
                    <i className="th-outline-logout"></i> <span data-key="t-widgets">Logout</span>
                  </NavLink>
                </li>
              </ul> */}
              <button className="add-event-button">
                  <i className='material-symbols-outlined'>add_circle</i>
                  Add New Event/Syllabus
              </button>
              <div className="sidebar-footer">
                <p>© 2025 Open Planner</p>
              </div>
            </div>
          </div>
          {/* <!-- Sidebar --> */}
        </div>
        <div className="sidebar-background"></div>
      </div >
      {/* <!-- Left Sidebar End --> */}
    </>
  )
}

export default (Sidebar);