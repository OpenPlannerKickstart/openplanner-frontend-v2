import React, { useEffect, useState, useRef } from 'react'
import SyllabusDetails from './SyllabusDetails'
import Events from './Events'
import { ENUM_FOR_SYLLABUS_TAB, ENUMFORROUTES, ENUMFORSTATUS } from '../../../interfaces/enum'
import AddEditEvent from '../../../common/AddSyllabusEvents/AddEditEvent'
import { formatedDate, isNullUndefinedOrBlank } from '../../../Utility/Helper'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../../redux/store'
import { getEventListDataAPI, updateEventStatusDataAPI } from '../../../redux/Service/User/Courses/courses'
import { useCourses } from '../../../hooks/queries/useCourses'
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout'
import { Viewer } from '@react-pdf-viewer/core'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { ts } from '../../../Utility/Toaster'

const EditCourse = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedSyllabusObj, setSelectedSyllabusObj] = useState<any>({});
  const hasHandledActionRef = useRef(false);

  // Courses data - cached and shared across pages (used for fallback on page refresh)
  const { data: courses = [] } = useCourses();

  // Add body class for responsive styling
  useEffect(() => {
    document.body.classList.add('edit-course-body');
    return () => {
      document.body.classList.remove('edit-course-body');
    };
  }, []);

  // Handle email deep link action=complete parameter
  useEffect(() => {
    const action = searchParams.get('action');
    const eventId = searchParams.get('id');
    
    // Only process once per mount
    if (action === 'complete' && eventId && !hasHandledActionRef.current) {
      hasHandledActionRef.current = true;
      
      const markEventComplete = async () => {
        const idNum = parseInt(eventId, 10);
        if (!idNum || Number.isNaN(idNum)) return;
        
        try {
          // Mark the event as complete
          const response = await dispatch(updateEventStatusDataAPI(
            { event_id: [idNum], status: ENUMFORSTATUS.COMPLETED },
            { silent: true }
          ));
          
          if (!isNullUndefinedOrBlank(response?.payload)) {
            ts('Assignment marked as complete!');
          }
        } catch (error) {
          console.error('[EditCourse] Failed to mark event complete:', error);
        }
        
        // Clean up the URL by removing the action parameter
        const newParams = new URLSearchParams(searchParams);
        newParams.delete('action');
        setSearchParams(newParams, { replace: true });
      };
      
      markEventComplete();
    }
  }, [searchParams, dispatch, setSearchParams]);

  // Load course data from state or find from cached courses (e.g., page refresh)
  useEffect(() => {
    if (location.state?.syllabusObj) {
      // Coming from Courses page - use passed data
      setSelectedSyllabusObj(location.state.syllabusObj);
    } else if (courses.length > 0) {
      // Fallback: find course from cached courses list
      const courseId = searchParams.get('id');
      if (courseId) {
        const course = courses.find((c: any) => c.id === parseInt(courseId));
        if (course) {
          setSelectedSyllabusObj(course);
        }
      }
    }
  }, [location.state, searchParams, courses]);

  // Tab logic
  const [selectedTab, setSelectedTab] = useState<any>(ENUM_FOR_SYLLABUS_TAB.EVENT_DETAILS)
  const handleTabChange = (tabName: string) => {
    if (selectedTab !== tabName) setSelectedTab(tabName)
  }

  // Add/Edit Event logic
  const [showAddEvent, setAddEventShow] = useState(false)
  const handleAddEventShow = () => setAddEventShow(true)
  const [editEventFormData, setEditEventFormData] = useState<any>(null)

  const handleSelectEvent = (event: any) => {
    handleAddEventShow()
    setEditEventFormData({
      ...event,
      start_date: new Date(formatedDate(event?.start_date, "yyyy-MM-DD HH:mm:ss")),
      end_date: new Date(formatedDate(event?.end_date, "yyyy-MM-DD HH:mm:ss")),
    })
  }

  // Get event data
  const handleGetEventData = async () => {
    if (!isNullUndefinedOrBlank(selectedSyllabusObj?.id)) {
      await dispatch(getEventListDataAPI({ syllabus_id: selectedSyllabusObj?.id }))
    }
  }

  // PDF Preview logic
  const [pdfPreviewLink, setPdfPreviewLink] = useState("")
  const [isShowPdf, setIsShowPdf] = useState(true)

  const defaultLayoutPluginInstance = defaultLayoutPlugin({
    renderToolbar: (Toolbar) => (
      <Toolbar>
        {(slots) => {
          const {
            GoToPreviousPage,
            CurrentPageInput,
            NumberOfPages,
            GoToNextPage,
            ZoomOut,
            ZoomIn,
            EnterFullScreen,
            Download,
            ShowSearchPopover,
            ShowProperties,
          } = slots
          return (
            <div className="custom-pdf-toolbar">
              <div className="toolbar-left">
                <ShowSearchPopover />
                <GoToPreviousPage />
                <GoToNextPage />
                <div className="page-info">
                  <CurrentPageInput />
                  <NumberOfPages />
                </div>
              </div>
              <div className="toolbar-right">
                <ZoomOut />
                <ZoomIn />
                <EnterFullScreen />
                <Download />
                <ShowProperties />
              </div>
            </div>
          )
        }}
      </Toolbar>
    ),
    // Hide sidebar completely - no thumbnails or bookmarks
    sidebarTabs: () => [],
  })

  return (
    <>
      {/* Top Header */}
      <header className="dashboard-header">
        <div className="dashboard-header-inner">
          <div className="dashboard-header-left">
            <button 
              className="back-btn" 
              onClick={() => navigate(ENUMFORROUTES.COURSES)}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6" />
              </svg>
              Back
            </button>
            <h1 className="dashboard-page-title">Edit Course</h1>
          </div>
          
          <div className="dashboard-header-right">
            {/* Header right actions can go here */}
          </div>
        </div>
      </header>

      {/* Edit Course Content */}
      <div className="edit-course-page">
        <div className={`edit-course-content ${!isShowPdf ? 'preview-hidden' : ''}`}>
          {/* Left Panel - Events */}
          <div className={`events-panel ${!isShowPdf ? 'full-width' : ''}`}>
            {/* Tabs */}
            <div className="course-tabs">
              <div className="tabs-left">
                            <button
                  className={`tab-btn ${selectedTab === ENUM_FOR_SYLLABUS_TAB.EVENT_DETAILS ? 'active' : ''}`}
                                onClick={() => handleTabChange(ENUM_FOR_SYLLABUS_TAB.EVENT_DETAILS)}
                            >
                                Events
                            </button>
                            <button
                  className={`tab-btn ${selectedTab === ENUM_FOR_SYLLABUS_TAB.SYLLABUS_DETAILS ? 'active' : ''}`}
                                onClick={() => handleTabChange(ENUM_FOR_SYLLABUS_TAB.SYLLABUS_DETAILS)}
                            >
                                Syllabus Details
                            </button>
                            </div>
              <div className="tabs-right">
                {!isShowPdf && (
                  <button 
                    className="btn btn-secondary show-preview-btn"
                    onClick={() => setIsShowPdf(true)}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                    Show Preview
                  </button>
                )}
                <button 
                  className="btn btn-accent add-event-btn"
                  onClick={handleAddEventShow}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="5" x2="12" y2="19"/>
                    <line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                  Add New Event
                </button>
                            </div>
                            </div>

            {/* Tab Content */}
            <div className={`tab-content ${selectedTab === ENUM_FOR_SYLLABUS_TAB.EVENT_DETAILS ? 'active' : ''}`}>
                            <Events
                                selectedSyllabusObj={selectedSyllabusObj}
                                selectedTab={selectedTab}
                                handleSelectEvent={handleSelectEvent}
                                onAddEvent={handleAddEventShow}
                            />
                            </div>

            <div className={`tab-content ${selectedTab === ENUM_FOR_SYLLABUS_TAB.SYLLABUS_DETAILS ? 'active' : ''}`}>
              <div className="syllabus-details-form">
                <SyllabusDetails
                  selectedSyllabusObj={selectedSyllabusObj}
                  handleGetCourseList={() => {}}
                  handleCloseSyllabusDetails={() => {}}
                  onSyllabusUpdated={(updated: any) => setSelectedSyllabusObj(updated)}
                  setPdfPreviewLink={setPdfPreviewLink}
                  pdfPreviewLink={pdfPreviewLink}
                />
                            </div>
                        </div>
                        </div>

          {/* Right Panel - Syllabus Preview */}
          {isShowPdf && (
            <div className="syllabus-preview-panel">
              <div className="preview-header">
                <h2 className="preview-title">Syllabus Preview</h2>
                <button 
                  className="hide-preview-btn"
                  onClick={() => setIsShowPdf(false)}
                >
                  Hide Preview
                </button>
                    </div>
              
              {/* PDF Viewer */}
              {!isNullUndefinedOrBlank(pdfPreviewLink) ? (
                <div className="preview-content pdf-viewer-container">
                  <Viewer
                    fileUrl={pdfPreviewLink}
                    plugins={[defaultLayoutPluginInstance]}
                  />
                </div>
              ) : (
                <div className="preview-content">
                  <div className="pdf-placeholder empty-state">
                    <div className="empty-state-icon">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                        <polyline points="14 2 14 8 20 8"/>
                        <line x1="16" y1="13" x2="8" y2="13"/>
                        <line x1="16" y1="17" x2="8" y2="17"/>
                        <polyline points="10 9 9 9 8 9"/>
                      </svg>
                    </div>
                    <p className="empty-state-title">No syllabus uploaded</p>
                    <p className="empty-state-text">Upload a syllabus to see the preview here</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        </div>

        {/* Add/Edit Event Modal */}
        <AddEditEvent
          show={showAddEvent}
          setShow={setAddEventShow}
          handleGetData={handleGetEventData}
          setEditEventFormData={setEditEventFormData}
          editEventFormData={editEventFormData}
          selectedCourse={selectedSyllabusObj}
        />
    </>
  )
}

export default EditCourse
