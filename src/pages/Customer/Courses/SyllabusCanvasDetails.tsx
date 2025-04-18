import React, { useEffect, useState } from 'react'
import SyllabusDetails from './SyllabusDetails'
import { Button, Offcanvas } from 'react-bootstrap'
import Events from './Events';
import { ENUM_FOR_SYLLABUS_TAB } from '../../../interfaces/enum';

const SyllabusCanvasDetails = (props) => {
    const [showDetails, setShowDetails] = useState(false);
    const handleCloseSyllabusDetails = () => { setShowDetails(false);
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
                            Edit <span>Project Management</span>
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
                                                        className={`nav-link ${selectedTab===ENUM_FOR_SYLLABUS_TAB.SYLLABUS_DETAILS?"active":""}`}
                                                        id="nav-SyllabusDetails-tab"                                                        
                                                        type="button"
                                                        role="tab"
                                                        
                                                        onClick={() => handleTabChange(ENUM_FOR_SYLLABUS_TAB.SYLLABUS_DETAILS)}
                                                    >
                                                        Syllabus Details
                                                    </button>

                                                    <button
                                                        className={`nav-link ${selectedTab=== ENUM_FOR_SYLLABUS_TAB.EVENT_DETAILS?"active":""}`}
                                                        id="nav-Events-tab"                                                       
                                                        type="button"
                                                        role="tab"
                                                        
                                                        onClick={() => handleTabChange(ENUM_FOR_SYLLABUS_TAB.EVENT_DETAILS)}
                                                    >
                                                        Events
                                                    </button>


                                                    <Button variant="primary" size="sm" className="ms-auto">Add New Event</Button>
                                                </div>
                                            </nav>
                                            <div className="tab-content" id="nav-tabContent">
                                                <div
                                                    className={`tab-pane fade   ${selectedTab===ENUM_FOR_SYLLABUS_TAB.SYLLABUS_DETAILS?"show active":""}`}
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
                                                    className={`tab-pane fade   ${selectedTab===ENUM_FOR_SYLLABUS_TAB.EVENT_DETAILS?"show active":""}`}
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

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Offcanvas.Body>
                </Offcanvas>
            </div>
        </>
    )
}

export default SyllabusCanvasDetails