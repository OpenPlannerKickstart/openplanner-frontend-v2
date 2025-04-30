import React, { ReactElement, useEffect, useState } from 'react'
import SyllabusDetails from './SyllabusDetails'
import { Button, Modal, Offcanvas } from 'react-bootstrap'
import Events from './Events';
import notVoucherFound from "/assets/images/not-voucher-found.svg";
import { ENUM_FOR_SYLLABUS_TAB } from '../../../interfaces/enum';
import AddEditEvent from '../../../common/AddSyllabusEvents/AddEditEvent';
import { isNullUndefinedOrBlank } from '../../../Utility/Helper';
import { getEventListDataAPI } from '../../../redux/Service/User/Courses/courses';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../redux/store';
import { fullScreenPlugin } from '@react-pdf-viewer/full-screen';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';


import { Viewer } from '@react-pdf-viewer/core';
import { isPdfFile } from 'pdfjs-dist';
const SyllabusCanvasDetails = (props) => {

    const dispatch: AppDispatch = useDispatch();
    const [showDetails, setShowDetails] = useState(false);
    const handleCloseSyllabusDetails = () => {
        setShowDetails(false);
        props.handleCloseCourse();
        setTimeout(() => {

            setSelectedTab(ENUM_FOR_SYLLABUS_TAB.SYLLABUS_DETAILS);
        }, 200);

    }
    const handleShowSyllabusDetails = () => setShowDetails(true);

    useEffect(() => {
        if (props.showCourse) {
            handleShowSyllabusDetails();
        }

        return () => {

        }
    }, [props?.showCourse])
    /* --------------------------- selected Tab Start --------------------------- */
    const [selectedTab, setSelectedTab] = useState<any>(ENUM_FOR_SYLLABUS_TAB.SYLLABUS_DETAILS);
    const handleTabChange = (tabName) => {
        if (selectedTab !== tabName) {
            setSelectedTab(tabName);
        }
    }
    /* --------------------------- selected Tab End --------------------------- */
    const [showAddEvent, setAddEventShow] = useState(false);

    const handleAddEventClose = () => setAddEventShow(false);
    const handleAddEventShow = () => setAddEventShow(true);


    const [selectedCourse, setSelectedCourse] = useState(null);
    useEffect(() => {
        if (!isNullUndefinedOrBlank(props?.selectedSyllabusObj)) {
            setSelectedCourse(props?.selectedSyllabusObj)
        }
    }, [props?.selectedSyllabusObj]);


    /** --------------------get eventData------------------------*/

    const handleGetEventData = async () => {
        if (!isNullUndefinedOrBlank(props?.selectedSyllabusObj?.id)) {
            await dispatch(getEventListDataAPI({ syllabus_id: props?.selectedSyllabusObj?.id }))
        }
    }


    const [pdfPreviewLink, setPdfPreviewLink] = useState("");
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
                    } = slots;
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
                    );
                }}
            </Toolbar>
        ),
        sidebarTabs: (defaultTabs) => [

            defaultTabs[0], // Bookmarks tab
            defaultTabs[1], // Thumbnails tab
        ],
    });



    return (
        <>
            <div className="edit-course-canvas-wrapper">
                <Offcanvas
                    className="edit-course-canvas"
                    show={showDetails}
                    placement={"end"}
                    onHide={handleCloseSyllabusDetails}
                >
                    <Offcanvas.Header>
                        <Offcanvas.Title>
                            Edit <span>Course</span>
                        </Offcanvas.Title>
                        <button type="button" className="btn-close" onClick={handleCloseSyllabusDetails}>
                            <i className='material-symbols-outlined'>close</i>
                        </button>
                    </Offcanvas.Header>
                    <Offcanvas.Body>
                        <div className={`edit-course-wrapper ${!isShowPdf ? "abc" : ""}`}>
                            <div className="course-edit-container">
                                <div className="syllabus-tab-wrapper">
                                    <div className="course-detail-box">
                                        <div className="nav-tabs-outer nav-tabs-style2">
                                            <nav>
                                                <div
                                                    className="nav nav-tabs"
                                                    id="nav-tab"
                                                    role="tablist"
                                                >
                                                    <button
                                                        className={`nav-link ${selectedTab === ENUM_FOR_SYLLABUS_TAB.SYLLABUS_DETAILS ? "active" : ""}`}
                                                        id="nav-SyllabusDetails-tab"
                                                        type="button"
                                                        role="tab"

                                                        onClick={() => handleTabChange(ENUM_FOR_SYLLABUS_TAB.SYLLABUS_DETAILS)}
                                                    >
                                                        Syllabus Details
                                                    </button>

                                                    <button
                                                        className={`nav-link ${selectedTab === ENUM_FOR_SYLLABUS_TAB.EVENT_DETAILS ? "active" : ""}`}
                                                        id="nav-Events-tab"
                                                        type="button"
                                                        role="tab"

                                                        onClick={() => handleTabChange(ENUM_FOR_SYLLABUS_TAB.EVENT_DETAILS)}
                                                    >
                                                        Events
                                                    </button>


                                                    <Button variant="primary" size="sm" className="ms-auto" onClick={() => { handleAddEventShow() }}>Add New Event</Button>
                                                    <a className="hide-btn" onClick={() => { setIsShowPdf(!isShowPdf) }}>{isShowPdf ? "Hide Preview" : "View Preview"}</a>
                                                </div>
                                            </nav>
                                            <div className="tab-content" id="nav-tabContent">
                                                <div
                                                    className={`tab-pane fade   ${selectedTab === ENUM_FOR_SYLLABUS_TAB.SYLLABUS_DETAILS ? "show active" : ""}`}
                                                    id="nav-SyllabusDetails"
                                                    role="tabpanel"
                                                    aria-labelledby="nav-SyllabusDetails-tab"
                                                >
                                                    <div className="tab-content-container">
                                                        <SyllabusDetails selectedSyllabusObj={props.selectedSyllabusObj}
                                                            handleGetCourseList={props.handleGetCourseList}
                                                            handleCloseSyllabusDetails={handleCloseSyllabusDetails}
                                                            setPdfPreviewLink={setPdfPreviewLink}
                                                            pdfPreviewLink={pdfPreviewLink}
                                                        />

                                                    </div>
                                                </div>
                                                <div
                                                    className={`tab-pane fade   ${selectedTab === ENUM_FOR_SYLLABUS_TAB.EVENT_DETAILS ? "show active" : ""}`}
                                                    id="nav-Events"
                                                    role="tabpanel"
                                                    aria-labelledby="nav-Events-tab"
                                                >
                                                    <Events
                                                        selectedSyllabusObj={props.selectedSyllabusObj}
                                                        selectedTab={selectedTab}
                                                    />
                                                    <div className="bottom-button-group">
                                                        {/* <Button type="button" className="btn btn-light-white me-auto">
                                            Cancel
                                          </Button>
                                          <Button type="button" className="btn btn-light-danger">
                                            Delete Syllabus
                                          </Button>
                                          <Button type="button" className="btn btn-primary">
                                            Save
                                          </Button> */}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className={`syllabus-pdf-container `}>
                                    <div className="syllabus-preview-wrapper">
                                        <div className="title-text">
                                            <h4>Syllabus Preview</h4>
                                            <a className="hide-btn" onClick={() => { setIsShowPdf(!isShowPdf) }}>{isShowPdf ? "Hide Preview" : "View Preview"}</a>

                                        </div>
                                        {/* pdf viewer */}
                                        {!isNullUndefinedOrBlank(pdfPreviewLink) &&
                                            isShowPdf ?
                                            <div className={`syllabus-view-box ${isShowPdf ? " d-block" : "d-none"}`}>

                                                <div
                                                    style={{
                                                        border: '1px solid #E6EAEE',
                                                        height: 'calc(100vh - 145px)',
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

                                            : <><div className="no-preview-box">
                                                <div className="no-records-found no-records-found-inner h-100">
                                                    <div className="no-records-found-image">
                                                        <img src={notVoucherFound} alt="OpenPlaner" />
                                                    </div>
                                                    <div className="no-records-found-text">
                                                        <h6>No preview available!</h6>
                                                    </div>
                                                </div>
                                            </div>
                                            </>



                                        }
                                    </div>

                                </div>
                            </div>
                        </div>
                    </Offcanvas.Body>
                </Offcanvas>
            </div>
            {/* Add/Edit event Start */}
            <AddEditEvent show={showAddEvent} setShow={setAddEventShow} handleGetData={async () => { handleGetEventData() }} setEditEventFormData={() => { }} editEventFormData={null} selectedCourse={props?.selectedSyllabusObj} />
            {/* Add/Edit event Event */}


        </>
    )
}

export default SyllabusCanvasDetails