import React, { useEffect, useState } from 'react'
import SyllabusDetails from './SyllabusDetails'
import Events from './Events'
import { Button } from 'react-bootstrap'
import { ENUM_FOR_SYLLABUS_TAB, ENUMFORROUTES } from '../../../interfaces/enum'
import AddEditEvent from '../../../common/AddSyllabusEvents/AddEditEvent'
import { formatedDate, isNullUndefinedOrBlank } from '../../../Utility/Helper'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../../redux/store'
import { getEventListDataAPI } from '../../../redux/Service/User/Courses/courses'
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout'
import { Viewer } from '@react-pdf-viewer/core'
import { useLocation, useNavigate } from 'react-router-dom'

const EditCourse = (props) => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  // You may want to get this from route params or redux
  const location = useLocation();
  const [selectedSyllabusObj, setSelectedSyllabusObj] = useState<any>({});

  useEffect(() => {
    if (location.state?.syllabusObj) {
      setSelectedSyllabusObj(location.state.syllabusObj);
    }
  }, [location.state]);

  // Tab logic
  const [selectedTab, setSelectedTab] = useState<any>(ENUM_FOR_SYLLABUS_TAB.EVENT_DETAILS)
  const handleTabChange = (tabName) => {
    if (selectedTab !== tabName) setSelectedTab(tabName)
  }

  // Add/Edit Event logic
  const [showAddEvent, setAddEventShow] = useState(false)
  const handleAddEventClose = () => setAddEventShow(false)
  const handleAddEventShow = () => setAddEventShow(true)
  const [editEventFormData, setEditEventFormData] = useState<any>(null)

  const handleSelectEvent = (event) => {
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
            <>
              <ShowSearchPopover />
              <GoToPreviousPage />
              <CurrentPageInput />
              <NumberOfPages />
              <GoToNextPage />
              <ZoomOut />
              <ZoomIn />
              <EnterFullScreen />
              <Download />
              <ShowProperties />
            </>
          )
        }}
      </Toolbar>
    ),
    sidebarTabs: (defaultTabs) => [
      defaultTabs[0], // Bookmarks
      defaultTabs[1], // Thumbnails
    ],
  })

  // You may want to fetch the course details here if needed
  useEffect(() => {
    // Example: setSelectedSyllabusObj(props.location.state?.syllabusObj)
    // Or fetch from API if you have an ID in the route
  }, [])

  return (
    <div className="page-content edit-course-canvas-wrapper page-content-wrapper edit-course-box-wrapper">
      <div className="edit-course-canvas">
        <div className="edit-course-header page-title-wrapper">
          <div className="page-title-left">
            <div className="page-title d-flex align-items-center">
              <Button variant="primary" size="sm" className="me-3" onClick={() => {
                navigate(ENUMFORROUTES.COURSES)
              }}>
                 <i className="material-symbols-outlined">arrow_back_ios</i> Back
              </Button>
              <h4>Edit <span>Course</span></h4>
            </div>
          </div>
          <div className="page-title-right">
            {/* Add any header actions if needed */}
          </div>
        </div>
        <div className="content-area">
          <div className="page-content-wrapper h-100">
            <div className={`edit-course-wrapper ${!isShowPdf ? "hide-syllabus-preview" : ""}`}>
                <div className="course-edit-container">
                    <div className="syllabus-tab-wrapper">
                    <div className="course-detail-box">
                        <div className="nav-tabs-outer nav-tabs-style2">
                        <nav>
                            <div className="nav nav-tabs" id="nav-tab" role="tablist">
                            <button
                                className={`nav-link ${selectedTab === ENUM_FOR_SYLLABUS_TAB.EVENT_DETAILS ? "active" : ""}`}
                                id="nav-Events-tab"
                                type="button"
                                role="tab"
                                onClick={() => handleTabChange(ENUM_FOR_SYLLABUS_TAB.EVENT_DETAILS)}
                            >
                                Events
                            </button>
                            <button
                                className={`nav-link ${selectedTab === ENUM_FOR_SYLLABUS_TAB.SYLLABUS_DETAILS ? "active" : ""}`}
                                id="nav-SyllabusDetails-tab"
                                type="button"
                                role="tab"
                                onClick={() => handleTabChange(ENUM_FOR_SYLLABUS_TAB.SYLLABUS_DETAILS)}
                            >
                                Syllabus Details
                            </button>
                            <Button variant="primary" size="sm" className="ms-auto" onClick={handleAddEventShow}>
                                Add New Event
                            </Button>
                            <a className="hide-btn" onClick={() => setIsShowPdf(!isShowPdf)}>
                                {isShowPdf ? "Hide Preview" : "View Preview"}
                            </a>
                            </div>
                        </nav>
                        <div className="tab-content" id="nav-tabContent">
                            <div
                            className={`tab-pane fade ${selectedTab === ENUM_FOR_SYLLABUS_TAB.SYLLABUS_DETAILS ? "show active" : ""}`}
                            id="nav-SyllabusDetails"
                            role="tabpanel"
                            aria-labelledby="nav-SyllabusDetails-tab"
                            >
                            <div className="tab-content-container">
                                <SyllabusDetails
                                selectedSyllabusObj={selectedSyllabusObj}
                                handleGetCourseList={() => {}} // Implement as needed
                                handleCloseSyllabusDetails={() => {}} // Implement as needed
                                setPdfPreviewLink={setPdfPreviewLink}
                                pdfPreviewLink={pdfPreviewLink}
                                />
                            </div>
                            </div>
                            <div
                            className={`tab-pane fade ${selectedTab === ENUM_FOR_SYLLABUS_TAB.EVENT_DETAILS ? "show active" : ""}`}
                            id="nav-Events"
                            role="tabpanel"
                            aria-labelledby="nav-Events-tab"
                            >
                            <Events
                                selectedSyllabusObj={selectedSyllabusObj}
                                selectedTab={selectedTab}
                                handleSelectEvent={handleSelectEvent}
                            />
                            <div className="bottom-button-group">
                                {/* Add any bottom buttons if needed */}
                            </div>
                            </div>
                        </div>
                        </div>
                    </div>
                    </div>
                    <div className={`syllabus-pdf-container`}>
                    <div className="syllabus-preview-wrapper">
                        <div className="title-text">
                        <h4>Syllabus Preview</h4>
                        <a className="hide-btn" onClick={() => setIsShowPdf(!isShowPdf)}>
                            {isShowPdf ? "Hide Preview" : "View Preview"}
                        </a>
                        </div>
                        {/* PDF viewer */}
                        {!isNullUndefinedOrBlank(pdfPreviewLink) && isShowPdf && (
                        <div className={`syllabus-view-box ${isShowPdf ? " d-block" : "d-none"}`}>
                            <div
                            style={{
                                border: '1px solid #E6EAEE',
                                height: 'calc(100vh - 224px)',
                                width: '100%',
                                overflowY: 'auto'
                            }}
                            >
                            <Viewer
                                fileUrl={pdfPreviewLink}
                                plugins={[defaultLayoutPluginInstance]}
                            />
                            </div>
                        </div>
                        )}
                    </div>
                    </div>
                </div>
            </div>
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
      </div>
    </div>
  )
}

export default EditCourse