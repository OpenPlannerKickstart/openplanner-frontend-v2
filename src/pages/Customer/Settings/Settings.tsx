import React from 'react'
import MyProfile from './MyProfile'
import ChangePassword from './ChangePassword'
import Notification from './Notification'
import DeleteAccount from './DeleteAccount'

const Settings = () => {
  return (
    <>
         <div className="page-content profile-content">
            <div className="page-title-wrapper">
                <div className="page-title-left">
                    <div className="page-title">
                        <h4>Settings</h4>
                    </div>
                </div>
            </div>
            <div className="page-filters">
                <div className="nav-tabs-outer nav-tabs-style2">
                    <nav>
                        <div className="nav nav-tabs" id="nav-tab" role="tablist">
                            <div className="button-group">
                                <button
                                    className="nav-link active"
                                    id="nav-profile-tab"
                                    data-bs-toggle="tab"
                                    data-bs-target="#nav-profile"
                                    type="button"
                                    role="tab"
                                    aria-controls="nav-profile"
                                    aria-selected="true"
                                >
                                    {" "}
                                    My Profile 
                                </button>
                                <button
                                    className="nav-link"
                                    id="nav-changepassword-tab"
                                    data-bs-toggle="tab"
                                    data-bs-target="#nav-changepassword"
                                    type="button"
                                    role="tab"
                                    aria-controls="nav-changepassword"
                                    aria-selected="false"
                                >
                                    Change Password
                                </button>
                                <button
                                    className="nav-link"
                                    id="nav-notification-tab"
                                    data-bs-toggle="tab"
                                    data-bs-target="#nav-notification"
                                    type="button"
                                    role="tab"
                                    aria-controls="nav-notification"
                                    aria-selected="false"
                                >
                                    Notification Setting
                                </button>
                                <button
                                    className="nav-link"
                                    id="nav-deleteaccount-tab"
                                    data-bs-toggle="tab"
                                    data-bs-target="#nav-deleteaccount"
                                    type="button"
                                    role="tab"
                                    aria-controls="nav-deleteaccount"
                                    aria-selected="false"
                                >
                                    Delete Account
                                </button>
                            </div>
                        </div>
                    </nav>
                </div>
            </div>
            <div className="content-area profile-content-area content-area-title-filter">
                <div className="page-content-wrapper h-100">
                    <div className="setting-main-wrapper">
                        <div>                            
                            <div className="tab-content" id="nav-tabContent">
                                <div
                                className="tab-pane fade show active"
                                id="nav-profile"
                                role="tabpanel"
                                aria-labelledby="nav-profile-tab"
                                >
                                    <div className="tab-content-container">  
                                        <MyProfile/>                              
                                    </div>
                                </div>
                                <div
                                className="tab-pane fade"
                                id="nav-changepassword"
                                role="tabpanel"
                                aria-labelledby="nav-changepassword-tab"
                                >
                                    <div className="tab-content-container">
                                        <ChangePassword/>
                                    </div>
                                </div>
                                <div
                                className="tab-pane fade"
                                id="nav-notification"
                                role="tabpanel"
                                aria-labelledby="nav-notification-tab"
                                >
                                    <div className="tab-content-container">
                                        <Notification/>
                                    </div>
                                </div>
                                <div
                                className="tab-pane fade"
                                id="nav-deleteaccount"
                                role="tabpanel"
                                aria-labelledby="nav-deleteaccount-tab"
                                >
                                    <div className="tab-content-container">
                                        <DeleteAccount/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
  )
}

export default Settings