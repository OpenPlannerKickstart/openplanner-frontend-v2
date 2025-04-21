import React, { ReactElement, useEffect, useState } from 'react'
import SyllabusDetails from './SyllabusDetails'
import { Button, Offcanvas } from 'react-bootstrap'
import Events from './Events';
import { ENUM_FOR_SYLLABUS_TAB } from '../../../interfaces/enum';
import AddEditEvent from '../../../common/AddSyllabusEvents/AddEditEvent';
import { isNullUndefinedOrBlank } from '../../../Utility/Helper';
import { getEventListDataAPI } from '../../../redux/Service/User/Courses/courses';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../redux/store';
import { fullScreenPlugin } from '@react-pdf-viewer/full-screen';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
// import { Worker, Viewer } from "@react-pdf-viewer/core";
// import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
// import { toolbarPlugin, ToolbarProps, ToolbarSlot } from "@react-pdf-viewer/toolbar";

// import "@react-pdf-viewer/core/lib/styles/index.css";
// import "@react-pdf-viewer/default-layout/lib/styles/index.css";


// import { Document, Page, pdfjs } from 'react-pdf';
// import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.js';

// pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker;
import { Viewer } from '@react-pdf-viewer/core';
const SyllabusCanvasDetails = (props) => {
    // const renderToolbar = (Toolbar: (props: ToolbarProps) => ReactElement) => (
    //     <Toolbar>
    //         {(slots: ToolbarSlot) => {
    //             const { ZoomOut } = slots;
    //             return (
    //                 <div
    //                     style={{
    //                         alignItems: "center",
    //                         display: "flex"
    //                     }}
    //                 >
    //                     <div style={{ padding: "0px 2px" }}>
    //                         <ZoomOut>
    //                             {(props) => (
    //                                 <button
    //                                     style={{
    //                                         backgroundColor: "#357edd",
    //                                         border: "none",
    //                                         borderRadius: "4px",
    //                                         color: "#ffffff",
    //                                         cursor: "pointer",
    //                                         padding: "8px"
    //                                     }}
    //                                     onClick={props.onClick}
    //                                 >
    //                                     Zoom out
    //                                 </button>
    //                             )}
    //                         </ZoomOut>
    //                     </div>
    //                     ...
    //                 </div>
    //             );
    //         }}
    //     </Toolbar>
    // );

    // const defaultLayoutPluginInstance = defaultLayoutPlugin();
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


    const [numPages, setNumPages] = useState(0);
    const [pageNumber, setPageNumber] = useState(1);

    const onDocumentLoadSuccess = ({ numPages }) => {
        console.log(numPages)
        setNumPages(numPages);
    };
    const defaultLayoutPluginInstance = defaultLayoutPlugin({
        renderToolbar: (Toolbar) => (
            <Toolbar>
                {(slots) => {
                    const {
                        Open, // We will skip rendering this
                        Download,
                        EnterFullScreen,
                        GoToNextPage,
                        GoToPreviousPage,
                        NumberOfPages,
                        Zoom,
                        CurrentPageInput,
                        // ... other controls
                    } = slots;
                    return (
                        <>

                            <GoToPreviousPage />
                            <CurrentPageInput />
                            <NumberOfPages />
                            <GoToNextPage />
                            <Zoom />
                            <EnterFullScreen />
                            <Download />
                        </>
                    );
                }}
            </Toolbar>
        )
    });

    // console.log(props?.selectedSyllabusObj?.syllabus_doc?.url)
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
                        <div className="edit-course-wrapper">
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
                                <div className="syllabus-pdf-container">
                                    <div className="syllabus-preview-wrapper">
                                        <div className="title-text">
                                            <h4>Syllabus Preview</h4>
                                            <a className="hide-btn">Hide Preview</a>
                                        </div>
                                        {/* pdf viewer */}
                                        <div className="syllabus-view-box">
                                            {/* <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.6.347/build/pdf.worker.min.js">
                                                <div style={{ height: "720px" }}>
                                                    <Viewer fileUrl={props.selectedSyllabusObj?.syllabus_doc?.url} plugins={[defaultLayoutPluginInstance]} />
                                                </div>
                                            </Worker> */}
                                            {/* <Document
                                                file="http://192.168.1.116:4003/images/250421_123203_VUVOSY.pdf"// Path to your PDF file
                                                onLoadSuccess={onDocumentLoadSuccess}
                                            >
                                                <Page pageNumber={pageNumber} />
                                            </Document> */}
                                            <div
                                                style={{
                                                    border: '1px solid rgba(0, 0, 0, 0.3)',
                                                    height: '100%',
                                                    width: '100%'
                                                }}
                                            >
                                                <Viewer
                                                    fileUrl={props.selectedSyllabusObj?.syllabus_doc?.url}
                                                    plugins={[defaultLayoutPluginInstance]}
                                                />
                                            </div>

                                        </div>
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