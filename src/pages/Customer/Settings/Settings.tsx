import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getUserAPI, updateUserAPI, studentBillingPortalAPI } from '../../../redux/Service/User/Settings/settings'
import { getUniversityListAPI } from '../../../redux/Service/auth/signup'
import { AppDispatch } from '../../../redux/store'
import { isNullUndefinedOrBlank } from '../../../Utility/Helper'
import { useNavigate } from 'react-router-dom'
import { ENUMFORROUTES } from '../../../interfaces/enum'
import { logoutFromSystem } from '../../../redux/Service/auth/login'
import type { RootState } from '../../../redux/store'
import { useSidebar } from '../../../layouts/DashboardLayout'
import { useNotificationPanel } from '../../../components/Notifications/NotificationPanelContext'
import { te } from '../../../Utility/Toaster'
import ConfirmDeleteModal from '../../../components/ConfirmDeleteModal/ConfirmDeleteModal'
import { useTheme } from '../../../context/ThemeContext'
import Select from 'react-select'
import './SettingsVariables.css'
import './SettingsStatic.css'

const Settings: React.FC = () => {
  const dispatch: AppDispatch = useDispatch()
  const navigate = useNavigate()
  const { toggleSidebar } = useSidebar()
  const { open: openNotifications, unreadCount } = useNotificationPanel()
  const settingsData: any = useSelector((state: RootState) => state.SettingsReducer)
  const { theme, setTheme } = useTheme()
  
  // Tab management - using same structure as HTML
  const [selectedTab, setSelectedTab] = useState<string>('profile')
  
  // User data management
  const [userData, setUserData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [showDeleteAvatarModal, setShowDeleteAvatarModal] = useState<boolean>(false)
  const avatarFileInputRef = useRef<HTMLInputElement>(null)

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    firstname: '',
    lastname: '',
    university_name: ''
  })
  const [originalProfileForm, setOriginalProfileForm] = useState({
    firstname: '',
    lastname: '',
    university_name: ''
  })
  const [isSavingProfile, setIsSavingProfile] = useState(false)
  const [universityList, setUniversityList] = useState<Array<{value: string, label: string}>>([])

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)
  
  const getAvatarSrc = useMemo(() => {
    return (u: any) =>
      u?.profile_image ||
      u?.profileImage ||
      u?.picture ||
      u?.avatarUrl ||
      u?.avatar ||
      null;
  }, []);

  const getUserData = async () => {
    try {
      setIsLoading(true);
      const response: any = await dispatch(getUserAPI());
      if (!isNullUndefinedOrBlank(response?.payload)) {
        setUserData(response?.payload);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      // Set default data if API fails
      setUserData({
        firstname: '',
        lastname: '', 
        email: 'acmoore1250@gmail.com',
        mobile: '',
        university_name: ''
      });
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getUserData();
    // Fetch university list
    const fetchUniversities = async () => {
      const response: any = await dispatch(getUniversityListAPI());
      if (response?.payload) {
        // Sort alphabetically by label, then add "Other/Highschool" at the end
        const sorted = [...response.payload].sort((a: any, b: any) => 
          a.label.localeCompare(b.label)
        );
        const universities = [...sorted, { value: 'Other', label: 'Other/Highschool' }];
        setUniversityList(universities);
      }
    };
    fetchUniversities();
  }, []);

  // Keep header/user menu in sync with any settings updates
  useEffect(() => {
    if (!isNullUndefinedOrBlank(settingsData?.userData)) {
      setUserData(settingsData.userData)
    }
  }, [settingsData?.userData])

  // Sync profile form with userData when it loads
  useEffect(() => {
    if (userData) {
      const formValues = {
        firstname: userData.firstname || '',
        lastname: userData.lastname || '',
        university_name: userData.university_name || ''
      }
      setProfileForm(formValues)
      setOriginalProfileForm(formValues)
    }
  }, [userData])

  // Check if profile form has unsaved changes
  const hasProfileChanges = useMemo(() => {
    return (
      profileForm.firstname !== originalProfileForm.firstname ||
      profileForm.lastname !== originalProfileForm.lastname ||
      profileForm.university_name !== originalProfileForm.university_name
    )
  }, [profileForm, originalProfileForm])

  const handleProfileInputChange = (field: string, value: string) => {
    setProfileForm(prev => ({ ...prev, [field]: value }))
  }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!hasProfileChanges || isSavingProfile) return

    try {
      setIsSavingProfile(true)
      const formData = new FormData()
      formData.append('firstname', profileForm.firstname)
      formData.append('lastname', profileForm.lastname)
      formData.append('university_name', profileForm.university_name)
      if (!isNullUndefinedOrBlank(userData?.email)) formData.append('email', String(userData.email))
      if (!isNullUndefinedOrBlank(userData?.mobile)) formData.append('mobile', String(userData.mobile))

      const res: any = await dispatch(updateUserAPI(formData))
      const updated = res?.payload
      if (!isNullUndefinedOrBlank(updated)) {
        setUserData(updated)
        // Update original to match current (no more unsaved changes)
        setOriginalProfileForm({
          firstname: updated.firstname || '',
          lastname: updated.lastname || '',
          university_name: updated.university_name || ''
        })
      }
    } catch (err) {
      // Optionally show error toast
    } finally {
      setIsSavingProfile(false)
    }
  }

  const handleUserMenuToggle = () => setIsUserMenuOpen((prev) => !prev)

  const handleLogout = async () => {
    await dispatch(logoutFromSystem())
    navigate(ENUMFORROUTES.LOGIN)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false)
      }
    }

    if (isUserMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isUserMenuOpen])

  const handleChangeAvatarClick = () => {
    avatarFileInputRef.current?.click()
  }

  const handleAvatarFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    // allow selecting the same file twice
    e.target.value = ''
    if (!file) return

    const isValidType = ['image/png', 'image/jpeg', 'image/jpg'].includes(file.type)
    const maxBytes = 1024 * 1024 // 1MB
    if (!isValidType) {
      te('Please upload a PNG or JPG image.')
      return
    }
    if (file.size > maxBytes) {
      te('Image must be 1MB or smaller.')
      return
    }

    const prevUser = userData
    const prevSrc = getAvatarSrc(prevUser)
    const previewUrl = URL.createObjectURL(file)

    // optimistic preview
    setUserData((prev: any) => ({
      ...(prev || {}),
      profile_image: previewUrl,
    }))

    try {
      const formData = new FormData()
      // Try common field names the backend might expect
      formData.append('image', file)
      // updateProfile can validate other fields as required; send current values too
      if (!isNullUndefinedOrBlank(userData?.firstname)) formData.append('firstname', String(userData.firstname))
      if (!isNullUndefinedOrBlank(userData?.lastname)) formData.append('lastname', String(userData.lastname))
      if (!isNullUndefinedOrBlank(userData?.mobile)) formData.append('mobile', String(userData.mobile))
      if (!isNullUndefinedOrBlank(userData?.university_name)) formData.append('university_name', String(userData.university_name))
      // email is usually immutable, but including it is harmless if BE expects it
      if (!isNullUndefinedOrBlank(userData?.email)) formData.append('email', String(userData.email))

      const res: any = await dispatch(updateUserAPI(formData))
      const updated = res?.payload
      if (!isNullUndefinedOrBlank(updated)) {
        setUserData(updated)
        return
      }

      // rollback if BE didn't return data
      setUserData((prev: any) => ({ ...(prev || {}), profile_image: prevSrc }))
    } catch (err) {
      // rollback on error
      setUserData((prev: any) => ({ ...(prev || {}), profile_image: prevSrc }))
    } finally {
      URL.revokeObjectURL(previewUrl)
    }
  }

  const handleDeleteAvatarClick = () => {
    setShowDeleteAvatarModal(true)
  }

  const handleDeleteAvatarConfirm = async () => {
    const prevSrc = getAvatarSrc(userData)

    // Close modal immediately and optimistically remove photo
    setShowDeleteAvatarModal(false)
    setUserData((prev: any) => ({ ...(prev || {}), profile_image: null }))

    try {
      const formData = new FormData()
      formData.append('remove_profile_image', 'true')
      // Include other profile fields to avoid validation errors
      if (!isNullUndefinedOrBlank(userData?.firstname)) formData.append('firstname', String(userData.firstname))
      if (!isNullUndefinedOrBlank(userData?.lastname)) formData.append('lastname', String(userData.lastname))
      if (!isNullUndefinedOrBlank(userData?.mobile)) formData.append('mobile', String(userData.mobile))
      if (!isNullUndefinedOrBlank(userData?.university_name)) formData.append('university_name', String(userData.university_name))
      if (!isNullUndefinedOrBlank(userData?.email)) formData.append('email', String(userData.email))

      const res: any = await dispatch(updateUserAPI(formData))
      const updated = res?.payload
      if (!isNullUndefinedOrBlank(updated)) {
        setUserData(updated)
        return
      }

      // Rollback if BE didn't return data
      setUserData((prev: any) => ({ ...(prev || {}), profile_image: prevSrc }))
    } catch (err) {
      // Rollback on error
      setUserData((prev: any) => ({ ...(prev || {}), profile_image: prevSrc }))
    }
  }

  if (isLoading) {
    return (
      <>
        <header className="dashboard-header">
          <div className="dashboard-header-inner">
            <div className="dashboard-header-left">
              <button className="mobile-menu-toggle" onClick={() => toggleSidebar()}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              </button>
              <h1 className="dashboard-page-title">Settings</h1>
            </div>

            <div className="dashboard-header-right">
              <button className="notification-btn" type="button" onClick={openNotifications} aria-label="Notifications" title="Notifications">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
                {unreadCount > 0 && <span className="notification-badge"></span>}
              </button>

              <div className="user-menu-container" ref={userMenuRef}>
                <div className="user-menu" onClick={handleUserMenuToggle}>
                  <div className="user-avatar">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>
                  <span className="user-name">User</span>
                  <svg className="dropdown-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>
                <div className={`user-dropdown ${isUserMenuOpen ? 'active' : ''}`}>
                  <button
                    type="button"
                    className="user-dropdown-item"
                    onClick={() => { setSelectedTab('profile'); setIsUserMenuOpen(false); }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    Profile
                  </button>
                  <div className="user-dropdown-divider"></div>
                  <button className="user-dropdown-item logout" onClick={handleLogout}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                      <polyline points="16 17 21 12 16 7" />
                      <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="settings-page">
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <div>Loading...</div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <header className="dashboard-header">
        <div className="dashboard-header-inner">
          <div className="dashboard-header-left">
            <button className="mobile-menu-toggle" onClick={() => toggleSidebar()}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
            <h1 className="dashboard-page-title">Settings</h1>
          </div>

          <div className="dashboard-header-right">
            <button className="notification-btn" type="button" onClick={openNotifications} aria-label="Notifications" title="Notifications">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              {unreadCount > 0 && <span className="notification-badge"></span>}
            </button>

            <div className="user-menu-container" ref={userMenuRef}>
              <div className="user-menu" onClick={handleUserMenuToggle}>
                <div className="user-avatar">
                  {(() => {
                    const src =
                      (userData as any)?.profile_image ||
                      (userData as any)?.profileImage ||
                      (userData as any)?.picture ||
                      (userData as any)?.avatarUrl;
                    return src ? (
                      <img
                        src={src}
                        alt="Profile"
                        style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', objectPosition: 'center', display: 'block' }}
                      />
                    ) : (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                    );
                  })()}
                </div>
                <span className="user-name">
                  {userData?.username || userData?.email?.split('@')[0] || 'User'}
                </span>
                <svg className="dropdown-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
              <div className={`user-dropdown ${isUserMenuOpen ? 'active' : ''}`}>
                <button
                  type="button"
                  className="user-dropdown-item"
                  onClick={() => { setSelectedTab('profile'); setIsUserMenuOpen(false); }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  Profile
                </button>
                <div className="user-dropdown-divider"></div>
                <button className="user-dropdown-item logout" onClick={handleLogout}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="settings-page">
        {/* Settings Tabs - Exact match to HTML */}
        <div className="settings-tabs">
          <button 
            className={`settings-tab ${selectedTab === 'profile' ? 'active' : ''}`}
            onClick={() => setSelectedTab('profile')}
          >
            My Profile
          </button>
          <button 
            className={`settings-tab ${selectedTab === 'appearance' ? 'active' : ''}`}
            onClick={() => setSelectedTab('appearance')}
          >
            Appearance
          </button>
          <button 
            className={`settings-tab ${selectedTab === 'subscription' ? 'active' : ''}`}
            onClick={() => setSelectedTab('subscription')}
          >
            Subscription
          </button>
          <button 
            className={`settings-tab ${selectedTab === 'password' ? 'active' : ''}`}
            onClick={() => setSelectedTab('password')}
          >
            Change Password
          </button>
          <button 
            className={`settings-tab ${selectedTab === 'notifications' ? 'active' : ''}`}
            onClick={() => setSelectedTab('notifications')}
          >
            Notification Settings
          </button>
          <button 
            className={`settings-tab ${selectedTab === 'delete' ? 'active' : ''}`}
            onClick={() => setSelectedTab('delete')}
          >
            Delete Account
          </button>
        </div>

        {/* Tab Content - Exact match to HTML */}
        <div className="settings-content">
          {/* My Profile Tab */}
          {selectedTab === 'profile' && (
            <div className="tab-panel active">
              <div className="settings-card">
                <h2 className="settings-card-title">My Profile</h2>
                
                {/* Profile Avatar - Exact match */}
                <div className="profile-avatar-section">
                  <div className="profile-avatar">
                    {(() => {
                      const src = getAvatarSrc(userData)
                      return src ? (
                        <img
                          src={src}
                          alt="Profile"
                          style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', objectPosition: 'center', display: 'block' }}
                        />
                      ) : (
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                          <circle cx="12" cy="7" r="4"/>
                        </svg>
                      )
                    })()}
                  </div>
                  <div className="profile-avatar-info">
                    <span className="profile-username">
                      {userData?.firstname && userData?.lastname 
                        ? `${userData.firstname} ${userData.lastname}` 
                        : userData?.email?.split('@')[0] || 'acmoore5'}
                    </span>
                    <div className="profile-avatar-actions">
                      <button className="avatar-btn" type="button" onClick={handleChangeAvatarClick}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                          <polyline points="17 8 12 3 7 8"/>
                          <line x1="12" y1="3" x2="12" y2="15"/>
                        </svg>
                        Change
                      </button>
                      <button
                        className="avatar-btn delete"
                        type="button"
                        onClick={handleDeleteAvatarClick}
                        disabled={!getAvatarSrc(userData)}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6"/>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                          <line x1="10" y1="11" x2="10" y2="17"/>
                          <line x1="14" y1="11" x2="14" y2="17"/>
                        </svg>
                        Delete
                      </button>
                      <input
                        ref={avatarFileInputRef}
                        type="file"
                        accept="image/png,image/jpeg"
                        style={{ display: 'none' }}
                        onChange={handleAvatarFileSelected}
                      />
                    </div>
                  </div>
                </div>
                
                <p className="avatar-note">
                  <span className="note-label">Note:</span> Please upload a valid image file (PNG, JPG, JPEG) with a maximum size of 1MB.
                </p>
                
                {/* Profile Form - Exact match */}
                <form className="profile-form" onSubmit={handleSaveProfile}>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">First Name <span className="required">*</span></label>
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder="Enter First Name"
                        value={profileForm.firstname}
                        onChange={(e) => handleProfileInputChange('firstname', e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Last Name <span className="required">*</span></label>
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder="Enter Last Name"
                        value={profileForm.lastname}
                        onChange={(e) => handleProfileInputChange('lastname', e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Email Address <span className="required">*</span></label>
                    <input 
                      type="email" 
                      className="form-input disabled" 
                      value={userData?.email || ''} 
                      disabled 
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Select School Name <span className="required">*</span></label>
                    <Select
                      options={universityList}
                      placeholder={<div>Select</div>}
                      onChange={(selectedOption) => {
                        handleProfileInputChange('university_name', selectedOption?.label || '')
                      }}
                      value={universityList.filter(({ label }) => label === profileForm.university_name)}
                      isClearable
                      menuPosition="fixed"
                      className="react-select-container"
                      classNamePrefix="react-select"
                    />
                  </div>
                  
                  <div className="form-actions">
                    <button 
                      type="submit" 
                      className={`btn btn-primary${!hasProfileChanges ? ' btn-disabled' : ''}`}
                      disabled={!hasProfileChanges || isSavingProfile}
                    >
                      {isSavingProfile ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Appearance Tab */}
          {selectedTab === 'appearance' && (
            <div className="tab-panel active">
              <div className="settings-card">
                <h2 className="settings-card-title">Appearance</h2>
                <p className="settings-card-desc">Customize how Open Planner looks on your device.</p>
                
                {/* Theme Selection */}
                <div className="theme-section">
                  <h3 className="theme-section-title">Theme</h3>
                  <p className="theme-section-desc">Choose between light and dark mode, or match your system preferences.</p>
                  
                  <div className="theme-options">
                    {/* Light Mode */}
                    <label className="theme-option">
                      <input 
                        type="radio" 
                        name="theme" 
                        value="light" 
                        checked={theme === 'light'}
                        onChange={() => setTheme('light')}
                      />
                      <div className="theme-preview light-preview">
                        <div className="preview-sidebar"></div>
                        <div className="preview-content">
                          <div className="preview-header"></div>
                          <div className="preview-body">
                            <div className="preview-line"></div>
                            <div className="preview-line short"></div>
                            <div className="preview-line"></div>
                          </div>
                        </div>
                      </div>
                      <div className="theme-label">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="5"/>
                          <line x1="12" y1="1" x2="12" y2="3"/>
                          <line x1="12" y1="21" x2="12" y2="23"/>
                          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                          <line x1="1" y1="12" x2="3" y2="12"/>
                          <line x1="21" y1="12" x2="23" y2="12"/>
                          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                        </svg>
                        <span>Light</span>
                      </div>
                    </label>
                    
                    {/* Dark Mode */}
                    <label className="theme-option">
                      <input 
                        type="radio" 
                        name="theme" 
                        value="dark" 
                        checked={theme === 'dark'}
                        onChange={() => {}}
                      />
                      <div className="theme-preview dark-preview">
                        <div className="preview-sidebar"></div>
                        <div className="preview-content">
                          <div className="preview-header"></div>
                          <div className="preview-body">
                            <div className="preview-line"></div>
                            <div className="preview-line short"></div>
                            <div className="preview-line"></div>
                          </div>
                        </div>
                      </div>
                      <div className="theme-label">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                        </svg>
                        <span>Dark</span>
                      </div>
                    </label>
                    
                    {/* System */}
                    <label className="theme-option">
                      <input 
                        type="radio" 
                        name="theme" 
                        value="system" 
                        checked={theme === 'system'}
                        onChange={() => {}}
                      />
                      <div className="theme-preview system-preview">
                        <div className="preview-sidebar"></div>
                        <div className="preview-content">
                          <div className="preview-header"></div>
                          <div className="preview-body">
                            <div className="preview-line"></div>
                            <div className="preview-line short"></div>
                            <div className="preview-line"></div>
                          </div>
                        </div>
                      </div>
                      <div className="theme-label">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                          <line x1="8" y1="21" x2="16" y2="21"/>
                          <line x1="12" y1="17" x2="12" y2="21"/>
                        </svg>
                        <span>System</span>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Subscription Tab */}
          {selectedTab === 'subscription' && (
            <div className="tab-panel active">
              <div className="settings-card">
                <h2 className="settings-card-title">Subscription</h2>
                
                {/* Subscription Stats */}
                <div className="subscription-stats">
                  <div className="subscription-stat">
                    <span className="stat-label">Plan Tenure</span>
                    <span className="stat-value">One Month</span>
                  </div>
                  <div className="subscription-stat">
                    <span className="stat-label">Payment Amount</span>
                    <span className="stat-value">$3.99</span>
                  </div>
                  <div className="subscription-stat">
                    <span className="stat-label">Next invoice issue date</span>
                    <span className="stat-value">17 Dec, 2025</span>
                  </div>
                  <div className="subscription-stat">
                    <span className="stat-label">Total Billing</span>
                    <span className="stat-value">$0.00</span>
                  </div>
                  <div className="subscription-stat">
                    <span className="stat-label">Subscription Status</span>
                    <span className="stat-value status-ongoing">Ongoing</span>
                  </div>
                </div>
                
                {/* Subscription Actions */}
                <div className="subscription-actions">
                  <button className="btn btn-primary">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M23 4v6h-6"/>
                      <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
                    </svg>
                    Change Plan
                  </button>
                  <button 
                    className="btn btn-violet"
                    onClick={async () => {
                      try {
                        const returnUrl = window.location.origin + '/#/settings';
                        const data: any = await (dispatch as any)(studentBillingPortalAPI(returnUrl));
                        const url = data?.url;
                        if (url) {
                          window.location.assign(url);
                        } else {
                          te('Unable to open billing portal');
                        }
                      } catch (e) {
                        te('Failed to open billing portal');
                      }
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="2" y="5" width="20" height="14" rx="2"/>
                      <line x1="2" y1="10" x2="22" y2="10"/>
                    </svg>
                    Manage billing
                  </button>
                </div>
              </div>
              
              {/* Billing Details */}
              <div className="settings-card" style={{ marginTop: '1.5rem' }}>
                <h2 className="settings-card-title">Billing Details</h2>
                
                <div className="billing-table-container">
                  <table className="billing-table">
                    <thead>
                      <tr>
                        <th>Plan Description</th>
                        <th>Payment Date</th>
                        <th>Status</th>
                        <th>Plan Price</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>One Month Plan</td>
                        <td>15 Dec, 2025</td>
                        <td><span className="badge badge-success">Paid</span></td>
                        <td>$3.99</td>
                        <td><button className="btn-link">View</button></td>
                      </tr>
                    </tbody>
                  </table>
                  
                  <div className="billing-empty" style={{ display: 'none' }}>
                    <p>No Transaction Found</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Change Password Tab */}
          {selectedTab === 'password' && (
            <div className="tab-panel active">
              <div className="settings-card">
                <h2 className="settings-card-title">Change Password</h2>
                <form className="password-form">
                  <div className="form-group">
                    <label className="form-label">Current Password <span className="required">*</span></label>
                    <input type="password" className="form-input" placeholder="Enter current password" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">New Password <span className="required">*</span></label>
                    <input type="password" className="form-input" placeholder="Enter new password" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Confirm New Password <span className="required">*</span></label>
                    <input type="password" className="form-input" placeholder="Confirm new password" />
                  </div>
                  <div className="form-actions">
                    <button type="submit" className="btn btn-primary">Update Password</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Notification Settings Tab */}
          {selectedTab === 'notifications' && (
            <div className="tab-panel active">
              <div className="settings-card">
                <h2 className="settings-card-title">Notification Settings</h2>
                <div className="notification-options">
                  <div className="notification-option">
                    <div className="option-info">
                      <span className="option-title">Weekly Summary Notifications</span>
                      <span className="option-desc">Receive a weekly summary of your upcoming tasks and deadlines Sunday at 5pm CST</span>
                    </div>
                    <label className="toggle-switch">
                      <input type="checkbox" defaultChecked />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                  <div className="notification-option">
                    <div className="option-info">
                      <span className="option-title">Email Notifications</span>
                      <span className="option-desc">Receive email reminders for upcoming tasks</span>
                    </div>
                    <label className="toggle-switch">
                      <input type="checkbox" defaultChecked />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Delete Account Tab */}
          {selectedTab === 'delete' && (
            <div className="tab-panel active">
              <div className="settings-card danger">
                <h2 className="settings-card-title">Delete Account</h2>
                <div className="delete-warning">
                  <div className="warning-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                      <line x1="12" y1="9" x2="12" y2="13"/>
                      <line x1="12" y1="17" x2="12.01" y2="17"/>
                    </svg>
                  </div>
                  <div className="warning-content">
                    <h3>Are you sure you want to delete your account?</h3>
                    <p>This action cannot be undone. All your data, including courses, tasks, and syllabi will be permanently deleted.</p>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Enter your password to confirm <span className="required">*</span></label>
                  <input type="password" className="form-input" placeholder="Enter your password" />
                  <span className="form-error" style={{ display: 'none' }}>Please enter your password to continue</span>
                </div>
                <button className="btn btn-danger">Delete My Account</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Avatar Confirmation Modal */}
      <ConfirmDeleteModal
        show={showDeleteAvatarModal}
        onClose={() => setShowDeleteAvatarModal(false)}
        onConfirm={handleDeleteAvatarConfirm}
        bodyTitle="Remove Profile Photo?"
        message="Are you sure you want to remove your profile photo? This action cannot be undone."
        confirmText="Remove"
      />
    </>
  );
};

export default Settings;