import React, { useEffect, useState } from 'react'
import MyProfile from './MyProfile'
import ChangePassword from './ChangePassword'
import Notification from './Notification'
import DeleteAccount from './DeleteAccount'
import { ENUMFORACCOUNTTAB } from '../../../interfaces/enum'
import { connect, useDispatch, useSelector } from 'react-redux'
import { getUserAPI } from '../../../redux/Service/User/Settings/settings'
import { AppDispatch, RootState } from '../../../redux/store'
import { isNullUndefinedOrBlank } from '../../../Utility/Helper'
import { Button, Modal } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'

const Settings = () => {
    const dispatch: AppDispatch = useDispatch()
    const hasUnsavedChangesRedux = useSelector(
        (state: RootState) => state.SettingsReducer.hasUnsavedChanges
    );
    const navigate = useNavigate();
    /** ------------------Change tab start--------------------------*/
    const [selectedTab, setSelectedTab] = useState<string>(ENUMFORACCOUNTTAB.PERSONAL_DETAILS)
    const [pendingTabChange, setPendingTabChange] = useState<string | null>(null); // Add this
    const onChangeTab = (val) => {
        if (val !== selectedTab) {
            if (hasUnsavedChanges) {
                setShowConfirmModal(true);
                setPendingTabChange(val); // Store the pending tab change
            } else {
                setSelectedTab(val)
            }
        }
    }
    /** ------------------Change tab End--------------------------*/

    /** ------------------ Get user data Start--------------------------*/
    const [userData, setUserData] = useState<any>(null)
    const getUserData = async () => {
        let response: any = await dispatch(getUserAPI());
        if (!isNullUndefinedOrBlank(response?.payload)) {
            setUserData(response?.payload)
        }
    }

    useEffect(() => {
        getUserData()
    }, []);


    /** ------------------------Add a confirmation pop to save the changes, if users tries to navaigates towards other pages without 'updating profile'--------------------*/
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    // Track if form has unsaved changes
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    const path = window.location.href;

    // useEffect(() => {

    //     if (hasUnsavedChanges && selectedTab !== ENUMFORACCOUNTTAB.PERSONAL_DETAILS) {
    //         setShowConfirmModal(true);
    //     }
    //     return () => {

    //     }
    // }, [path, selectedTab])







    /** -------------------------Add a confirmation pop to save the changes, if users tries to navaigates towards other pages without 'updating profile' end-------------------*/
    /** ------------------ Get user data End--------------------------*/
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
                                        className={`nav-link ${ENUMFORACCOUNTTAB.PERSONAL_DETAILS === selectedTab ? "active" : ""}`}
                                        // id="nav-profile-tab"
                                        // data-bs-toggle="tab"
                                        // data-bs-target="#nav-profile"
                                        // type="button"
                                        // role="tab"
                                        // aria-controls="nav-profile"
                                        // aria-selected="true"
                                        onClick={() => { onChangeTab(ENUMFORACCOUNTTAB.PERSONAL_DETAILS) }}
                                    >
                                        My Profile
                                    </button>
                                    <button
                                        className={`nav-link ${selectedTab == ENUMFORACCOUNTTAB.CHANGE_PASSWORD ? "active" : ""}`}
                                        // id="nav-changepassword-tab"
                                        // data-bs-toggle="tab"
                                        // data-bs-target="#nav-changepassword"
                                        // type="button"
                                        // role="tab"
                                        // aria-controls="nav-changepassword"
                                        // aria-selected="false"
                                        onClick={() => { onChangeTab(ENUMFORACCOUNTTAB.CHANGE_PASSWORD) }}
                                    >
                                        Change Password
                                    </button>
                                    <button
                                        className={`nav-link ${ENUMFORACCOUNTTAB.NOTIFICATION === selectedTab ? "active" : ""}`}
                                        // id="nav-notification-tab"
                                        // data-bs-toggle="tab"
                                        // data-bs-target="#nav-notification"
                                        // type="button"
                                        // role="tab"
                                        // aria-controls="nav-notification"
                                        // aria-selected="false"
                                        onClick={() => { onChangeTab(ENUMFORACCOUNTTAB.NOTIFICATION) }}

                                    >
                                        Notification Settings
                                    </button>
                                    <button
                                        className={`nav-link ${ENUMFORACCOUNTTAB.DELETE_ACCOUNT === selectedTab ? "active" : ""}`}
                                        // id="nav-deleteaccount-tab"
                                        // data-bs-toggle="tab"
                                        // data-bs-target="#nav-deleteaccount"
                                        // type="button"
                                        // role="tab"
                                        // aria-controls="nav-deleteaccount"
                                        // aria-selected="false"
                                        onClick={() => { onChangeTab(ENUMFORACCOUNTTAB.DELETE_ACCOUNT) }}

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
                                        className={`tab-pane fade ${ENUMFORACCOUNTTAB.PERSONAL_DETAILS === selectedTab ? "show active" : ""}`}
                                        id="nav-profile"
                                        role="tabpanel"
                                        aria-labelledby="nav-profile-tab"
                                    >
                                        <div className="tab-content-container">
                                            <MyProfile userData={userData} getUserData={getUserData} selectedTab={selectedTab} setSelectedTab={setSelectedTab} setHasUnsavedChanges={setHasUnsavedChanges} />
                                        </div>
                                    </div>
                                    <div
                                        className={`tab-pane fade ${ENUMFORACCOUNTTAB.CHANGE_PASSWORD === selectedTab ? "show active" : ""}`}
                                        id="nav-changepassword"
                                        role="tabpanel"
                                        aria-labelledby="nav-changepassword-tab"
                                    >
                                        <div className="tab-content-container">
                                            <ChangePassword />
                                        </div>
                                    </div>
                                    <div
                                        className={`tab-pane fade ${ENUMFORACCOUNTTAB.NOTIFICATION === selectedTab ? "show active" : ""}`}
                                        id="nav-notification"
                                        role="tabpanel"
                                        aria-labelledby="nav-notification-tab"
                                    >
                                        <div className="tab-content-container">
                                            <Notification selectedTab={selectedTab} />
                                        </div>
                                    </div>
                                    <div
                                        className={`tab-pane fade ${ENUMFORACCOUNTTAB.DELETE_ACCOUNT === selectedTab ? "show active" : ""}`}
                                        id="nav-deleteaccount"
                                        role="tabpanel"
                                        aria-labelledby="nav-deleteaccount-tab"
                                    >
                                        <div className="tab-content-container">
                                            <DeleteAccount />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Unsaved Changes</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>You have unsaved changes. Are you sure you want to leave this page?</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => {
                        setShowConfirmModal(false);
                    }}>
                        Stay on Page
                    </Button>
                    <Button variant="primary" onClick={() => {
                        setShowConfirmModal(false);
                        setHasUnsavedChanges(false);
                        setSelectedTab(pendingTabChange || ENUMFORACCOUNTTAB.PERSONAL_DETAILS); // Use pending tab change or default to personal details
                        setPendingTabChange(null); // Reset pending tab change
                    }}>
                        Leave Page
                    </Button>
                </Modal.Footer>
            </Modal> */}
        </>
    )
}

const mapStateToProps = (state) => ({})

const mapDispatchToProps = {
    getUserAPI
}

export default connect(mapStateToProps, mapDispatchToProps)(Settings)

