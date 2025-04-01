import React, { useState } from 'react';
import sidebarLogoLg from "../../assets/images/sidebar-logo-lg.svg";
import sidebarLogosm from "../../assets/images/auth-logo.svg";
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
    setTimeout(() => {
      removeCookieByName("token");
    }, 2000);
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
                <li className="menu-title"><span data-key="t-menu">MAIN HOME</span></li>
                <li className="nav-item">
                  <NavLink className="nav-link menu-link " to="/page-component">
                    <i className="th-outline-home-1"></i> <span data-key="t-widgets">Components</span>
                  </NavLink>
                </li>

              </ul>
            </div>

            <div className="navbar-bottom navbar-sidemenu">
              <ul className="navbar-nav" id="navbar-nav">
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
              </ul>
              <div className="sidebar-footer">
                <p>© 2024 PureCharity</p>
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