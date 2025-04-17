import React, { useEffect, useState } from 'react'
// import logo from "../../assets/images/dummy-logo.svg";
import defaultAvatar from "../../assets/images/avatar-default.svg";
import { Button, Form } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import { getUserFirstLastName, removeCookieByName } from '../../Utility/Helper';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../redux/store';
import { logoutFromSystem } from '../../redux/Service/auth/login';
import { ENUMFORROUTES } from '../../interfaces/enum';

const Navbar = () => {
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


              <div className="header-item navbar-add-btn">
                <Button variant='primary' className='btn-icon-text btn-secondary-two'> <i className='material-symbols-outlined'>add_circle</i> Add New Event/Syllabus</Button>
              </div>
            </div>

            <div className="navbar-header-right d-flex align-items-center">

              <div className="dropdown topbar-head-dropdown notification-button header-item" id="notificationDropdown">
                <button type="button" className="btn btn-lg btn-outline-white btn-icon rounded-pill " >
                  <i className="material-symbols-outlined">notifications</i>
                </button>
              </div>
              <div className="dropdown header-item topbar-user">
                <button type="button" className="topbar-user-btn" id="page-header-user-dropdown" data-bs-toggle="dropdown"
                  aria-haspopup="true" aria-expanded="false">
                  <span className="d-flex align-items-center">
                    <img className="rounded-circle header-profile-user"
                      src={defaultAvatar} alt="Header Avatar" />
                    <span className="text-start">
                      <span className="d-none d-xl-inline-block  user-name-text">{getUserFirstLastName()}</span>
                      <span className="d-none d-xl-block  user-name-sub-text">Student</span>
                    </span>
                  </span>
                </button>
                <div className="dropdown-menu dropdown-menu-end">
                  <h6 className="dropdown-header">Welcome {getUserFirstLastName()}!</h6>
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
    </>
  )
}

export default Navbar 