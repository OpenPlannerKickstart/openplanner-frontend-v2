import React, { useEffect, useState } from "react";
import MyProfile from "./MyProfile";
import MyProfileSimple from "./MyProfileSimple";
import ChangePassword from "./ChangePassword";
import Notification from "./Notification";
import DeleteAccount from "./DeleteAccount";
import { ENUMFORACCOUNTTAB } from "../../../interfaces/enum";
import { useDispatch, useSelector } from "react-redux";
import { getUserAPI } from "../../../redux/Service/User/Settings/settings";
import { AppDispatch, RootState } from "../../../redux/store";
import { isNullUndefinedOrBlank } from "../../../Utility/Helper";
import { Button, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Subscription } from "./Subscription";
import "./Settings.css";

const Settings: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const hasUnsavedChangesRedux = useSelector(
    (state: RootState) => state.SettingsReducer.hasUnsavedChanges
  );
  const navigate = useNavigate();

  // Tab management
  const [selectedTab, setSelectedTab] = useState<string>(
    ENUMFORACCOUNTTAB.PERSONAL_DETAILS
  );
  const [pendingTabChange, setPendingTabChange] = useState<string | null>(null);

  const onChangeTab = (val: string) => {
    if (val !== selectedTab) {
      if (hasUnsavedChangesRedux) {
        setShowConfirmModal(true);
        setPendingTabChange(val);
      } else {
        setSelectedTab(val);
      }
    }
  };
  // User data management
  const [userData, setUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const getUserData = async () => {
    try {
      setIsLoading(true);
      const response: any = await dispatch(getUserAPI());
      if (!isNullUndefinedOrBlank(response?.payload)) {
        setUserData(response?.payload);
      }
    } catch (error) {
      console.error("Settings: Error fetching user data:", error);
      // Set some default data so the form still works
      setUserData({
        firstname: "",
        lastname: "",
        email: "",
        mobile: "",
        university_name: "",
        profile_image: "",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getUserData();

    // Failsafe: Force loading to end after 3 seconds
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timeout);
  }, []);

  // Unsaved changes modal management
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleConfirmNavigation = () => {
    setShowConfirmModal(false);
    setHasUnsavedChanges(false);
    if (pendingTabChange) {
      setSelectedTab(pendingTabChange);
      setPendingTabChange(null);
    }
  };

  const handleCancelNavigation = () => {
    setShowConfirmModal(false);
    setPendingTabChange(null);
  };
  if (isLoading) {
    return (
      <div className="page-content profile-content">
        <div className="page-title-wrapper">
          <div className="page-title-left">
            <div className="page-title">
              <h4>Settings</h4>
            </div>
          </div>
        </div>
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: "400px" }}
        >
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

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
                    className={`nav-link ${
                      ENUMFORACCOUNTTAB.PERSONAL_DETAILS === selectedTab
                        ? "active"
                        : ""
                    }`}
                    // id="nav-profile-tab"
                    // data-bs-toggle="tab"
                    // data-bs-target="#nav-profile"
                    // type="button"
                    // role="tab"
                    // aria-controls="nav-profile"
                    // aria-selected="true"
                    onClick={() => {
                      onChangeTab(ENUMFORACCOUNTTAB.PERSONAL_DETAILS);
                    }}
                  >
                    My Profile
                  </button>
                  <button
                    className={`nav-link ${
                      ENUMFORACCOUNTTAB.SUBSCRIPTION === selectedTab
                        ? "active"
                        : ""
                    }`}
                    onClick={() => {
                      onChangeTab(ENUMFORACCOUNTTAB.SUBSCRIPTION);
                    }}
                  >
                    Subscription
                  </button>
                  <button
                    className={`nav-link ${
                      selectedTab == ENUMFORACCOUNTTAB.CHANGE_PASSWORD
                        ? "active"
                        : ""
                    }`}
                    // id="nav-changepassword-tab"
                    // data-bs-toggle="tab"
                    // data-bs-target="#nav-changepassword"
                    // type="button"
                    // role="tab"
                    // aria-controls="nav-changepassword"
                    // aria-selected="false"
                    onClick={() => {
                      onChangeTab(ENUMFORACCOUNTTAB.CHANGE_PASSWORD);
                    }}
                  >
                    Change Password
                  </button>
                  <button
                    className={`nav-link ${
                      ENUMFORACCOUNTTAB.NOTIFICATION === selectedTab
                        ? "active"
                        : ""
                    }`}
                    // id="nav-notification-tab"
                    // data-bs-toggle="tab"
                    // data-bs-target="#nav-notification"
                    // type="button"
                    // role="tab"
                    // aria-controls="nav-notification"
                    // aria-selected="false"
                    onClick={() => {
                      onChangeTab(ENUMFORACCOUNTTAB.NOTIFICATION);
                    }}
                  >
                    Notification Settings
                  </button>
                  <button
                    className={`nav-link ${
                      ENUMFORACCOUNTTAB.DELETE_ACCOUNT === selectedTab
                        ? "active"
                        : ""
                    }`}
                    // id="nav-deleteaccount-tab"
                    // data-bs-toggle="tab"
                    // data-bs-target="#nav-deleteaccount"
                    // type="button"
                    // role="tab"
                    // aria-controls="nav-deleteaccount"
                    // aria-selected="false"
                    onClick={() => {
                      onChangeTab(ENUMFORACCOUNTTAB.DELETE_ACCOUNT);
                    }}
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
              <div style={{
                background: 'white',
                padding: '30px',
                margin: '20px 0',
                borderRadius: '12px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                border: '1px solid #E2E8F0'
              }}>
                <h2 style={{ 
                  marginBottom: '30px', 
                  color: '#334155', 
                  fontSize: '24px',
                  fontWeight: '600'
                }}>
                  Personal Information
                </h2>
                
                {/* Profile Avatar Section */}
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '20px', 
                  marginBottom: '30px',
                  paddingBottom: '20px',
                  borderBottom: '1px solid #E2E8F0'
                }}>
                  <div style={{ 
                    width: '80px', 
                    height: '80px', 
                    borderRadius: '50%', 
                    background: '#F1F5F9', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    fontSize: '32px',
                    color: '#64748B'
                  }}>
                    👤
                  </div>
                  <div>
                    <div style={{ 
                      fontSize: '18px', 
                      fontWeight: '600', 
                      marginBottom: '8px',
                      color: '#334155'
                    }}>
                      John Doe
                    </div>
                    <button style={{ 
                      padding: '8px 16px', 
                      background: '#4AAED4', 
                      color: 'white', 
                      border: 'none', 
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '500'
                    }}>
                      📤 Upload Photo
                    </button>
                  </div>
                </div>

                {/* Form Fields */}
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: '1fr 1fr', 
                  gap: '20px', 
                  marginBottom: '20px' 
                }}>
                  <div>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '8px', 
                      fontWeight: '600', 
                      color: '#334155',
                      fontSize: '14px'
                    }}>
                      First Name <span style={{ color: '#EF4444' }}>*</span>
                    </label>
                    <input 
                      type="text" 
                      placeholder="Enter your first name"
                      defaultValue="John"
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '1px solid #E2E8F0',
                        borderRadius: '8px',
                        fontSize: '14px',
                        boxSizing: 'border-box',
                        transition: 'border-color 0.2s ease',
                        outline: 'none'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '8px', 
                      fontWeight: '600', 
                      color: '#334155',
                      fontSize: '14px'
                    }}>
                      Last Name <span style={{ color: '#EF4444' }}>*</span>
                    </label>
                    <input 
                      type="text" 
                      placeholder="Enter your last name"
                      defaultValue="Doe"
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '1px solid #E2E8F0',
                        borderRadius: '8px',
                        fontSize: '14px',
                        boxSizing: 'border-box',
                        transition: 'border-color 0.2s ease',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>

                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: '1fr 1fr', 
                  gap: '20px', 
                  marginBottom: '20px' 
                }}>
                  <div>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '8px', 
                      fontWeight: '600', 
                      color: '#334155',
                      fontSize: '14px'
                    }}>
                      Email Address <span style={{ color: '#EF4444' }}>*</span>
                    </label>
                    <input 
                      type="email" 
                      defaultValue="john.doe@example.com"
                      disabled
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '1px solid #E2E8F0',
                        borderRadius: '8px',
                        fontSize: '14px',
                        background: '#F8FAFC',
                        color: '#64748B',
                        boxSizing: 'border-box',
                        cursor: 'not-allowed'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '8px', 
                      fontWeight: '600', 
                      color: '#334155',
                      fontSize: '14px'
                    }}>
                      Phone Number
                    </label>
                    <input 
                      type="text" 
                      placeholder="Enter your phone number"
                      defaultValue="+1 (555) 123-4567"
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '1px solid #E2E8F0',
                        borderRadius: '8px',
                        fontSize: '14px',
                        boxSizing: 'border-box',
                        transition: 'border-color 0.2s ease',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '30px' }}>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '8px', 
                    fontWeight: '600', 
                    color: '#334155',
                    fontSize: '14px'
                  }}>
                    University <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <select 
                    defaultValue="tcu"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '1px solid #E2E8F0',
                      borderRadius: '8px',
                      fontSize: '14px',
                      background: 'white',
                      boxSizing: 'border-box',
                      cursor: 'pointer',
                      outline: 'none'
                    }}
                  >
                    <option value="">Select your university</option>
                    <option value="ut">University of Texas</option>
                    <option value="tcu">Texas Christian University</option>
                    <option value="smu">Southern Methodist University</option>
                    <option value="baylor">Baylor University</option>
                    <option value="rice">Rice University</option>
                  </select>
                </div>

                <div style={{ 
                  display: 'flex', 
                  gap: '12px',
                  paddingTop: '20px',
                  borderTop: '1px solid #E2E8F0'
                }}>
                  <button 
                    style={{
                      padding: '14px 24px',
                      background: '#4AAED4',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: '0 2px 4px rgba(74, 174, 212, 0.3)'
                    }}
                    onClick={() => alert('Profile updated successfully!')}
                  >
                    💾 Save Changes
                  </button>
                  <button 
                    style={{
                      padding: '14px 24px',
                      background: 'transparent',
                      color: '#64748B',
                      border: '1px solid #E2E8F0',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onClick={() => {
                      // Reset form values
                      window.location.reload();
                    }}
                  >
                    🔄 Reset
                  </button>
                </div>
              </div>
              <div>
                <div className="tab-content" id="nav-tabContent">
                  <div
                    className={`tab-pane fade ${
                      ENUMFORACCOUNTTAB.PERSONAL_DETAILS === selectedTab
                        ? "show active"
                        : ""
                    }`}
                    id="nav-profile"
                    role="tabpanel"
                    aria-labelledby="nav-profile-tab"
                  >
                    <div
                      style={{
                        position: "fixed",
                        top: "100px",
                        left: "250px",
                        right: "50px",
                        bottom: "50px",
                        background: "white",
                        zIndex: 9999,
                        overflow: "auto",
                        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                        borderRadius: "12px",
                      }}
                    >
                      <MyProfile />
                    </div>
                  </div>
                  <div
                    className={`tab-pane fade ${
                      ENUMFORACCOUNTTAB.SUBSCRIPTION === selectedTab
                        ? "show active"
                        : ""
                    }`}
                    id="nav-changepassword"
                    role="tabpanel"
                    aria-labelledby="nav-changepassword-tab"
                  >
                    <div className="tab-content-container">
                      <Subscription selectedTab={selectedTab} />
                    </div>
                  </div>
                  <div
                    className={`tab-pane fade ${
                      ENUMFORACCOUNTTAB.CHANGE_PASSWORD === selectedTab
                        ? "show active"
                        : ""
                    }`}
                    id="nav-changepassword"
                    role="tabpanel"
                    aria-labelledby="nav-changepassword-tab"
                  >
                    <div className="tab-content-container">
                      <ChangePassword />
                    </div>
                  </div>
                  <div
                    className={`tab-pane fade ${
                      ENUMFORACCOUNTTAB.NOTIFICATION === selectedTab
                        ? "show active"
                        : ""
                    }`}
                    id="nav-notification"
                    role="tabpanel"
                    aria-labelledby="nav-notification-tab"
                  >
                    <div className="tab-content-container">
                      <Notification selectedTab={selectedTab} />
                    </div>
                  </div>
                  <div
                    className={`tab-pane fade ${
                      ENUMFORACCOUNTTAB.DELETE_ACCOUNT === selectedTab
                        ? "show active"
                        : ""
                    }`}
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
      <Modal show={showConfirmModal} onHide={handleCancelNavigation} centered>
        <Modal.Header closeButton>
          <Modal.Title>Unsaved Changes</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            You have unsaved changes. Are you sure you want to leave this page?
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancelNavigation}>
            Stay on Page
          </Button>
          <Button variant="primary" onClick={handleConfirmNavigation}>
            Leave Page
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Settings;
