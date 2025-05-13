import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Form,
  Modal,
  Offcanvas,
  Row,
  Table,
} from "react-bootstrap";
import gridCardImg from "/assets/images/grid-card-img.svg";
import DatePicker from "react-datepicker";
import { connect, useDispatch, useSelector } from "react-redux";
import SyllabusDetails from "./SyllabusDetails";
import Events from "./Events";
import AddSyllabusEvents from "../../../common/AddSyllabusEvents/AddSyllabusEvents";
import { AppDispatch, RootState } from "../../../redux/store";
import { deleteSyllabusDataAPI, getCoursesListDataAPI, updateSyllabusStatusDataAPI } from "../../../redux/Service/User/Courses/courses";
import { addSyllabusData, SyllabusResponseType } from "../../../interfaces/interface";
import { formatedDate, isEmptyObjectOrNullUndefiend, isNullUndefinedOrBlank, NO_RECORD_FOUND_MSG } from "../../../Utility/Helper";
import { ENUM_FOR_DISPLAY_VIEW } from "../../../interfaces/enum";
import SyllabusCanvasDetails from "./SyllabusCanvasDetails";
import notVoucherFound from "/assets/images/not-voucher-found.svg";
import { isUpdatedSyllabus } from "../../../redux/User/Courses/coursesSlice";

const Courses = (props) => {
  const dispatch: AppDispatch = useDispatch();
  const coursesData: any = useSelector(
    (state: RootState) => state.CoursesReducer);



  const [showCourse, setShowCourse] = useState(false);
  const [showEvent, setShowEvent] = useState(false);


  const handleCloseCourse = () => { setShowCourse(false); setSelectedSyllabusObj({} as addSyllabusData); }
  const handleShowCourse = () => setShowCourse(true);

  const [selectedSyllabusObj, setSelectedSyllabusObj] = useState<addSyllabusData>({} as addSyllabusData);

  const handleUpdateCourse = (syllabusObj) => {
    handleShowCourse()
    setSelectedSyllabusObj(syllabusObj);

  }


  // Add syllabus event offcanvas
  const [showAddSyllabusEvents, setShowAddSyllabusEvents] = useState(false);

  const handleCloseAddSyllabusEvents = () => setShowAddSyllabusEvents(false);
  const toggleShowAddSyllabusEvents = () => setShowAddSyllabusEvents((s) => !s);



  /* ------------------------ Handle Display View start ----------------------- */
  const [selectedView, setSelectedView] = useState<any>(ENUM_FOR_DISPLAY_VIEW?.LIST_VIEW);
  const handleChangeView = (view) => {
    if (selectedView !== view) {
      setSelectedView(view);
    }

  }
  /* ------------------------ Handle Display View End ----------------------- */
  /* ---------------------- handle Get Course List start ---------------------- */
  const [searchValue, setSeacrhValue] = useState("");
  const [syllabusList, setSyllabusList] = useState<Array<SyllabusResponseType>>([]);
  useEffect(() => {

    const delayDebounceFn = setTimeout(() => {
      handleGetCourseList();

    }, 300);
    return () => {
      clearTimeout(delayDebounceFn);
    }
  }, [searchValue]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (coursesData.isUpdatedSyllabusData) {
        handleGetCourseList();
        setTimeout(() => {
          dispatch(isUpdatedSyllabus(false));
        }, 400);
      }

    }, 300);
    return () => {
      clearTimeout(delayDebounceFn);
    }
  }, [coursesData.isUpdatedSyllabusData])


  const handleGetCourseList = async () => {
    const reqBody = {
      search: searchValue
    }
    const response = await dispatch(getCoursesListDataAPI(reqBody));
    if (response) {
      setSyllabusList(response?.payload || [])
    }

  }

  /* ---------------------- handle Get Course List End ---------------------- */
  /** -------------------Delete Syllabus start-------------------------*/
  const [deleteShow, setDeleteShow] = useState(false);

  const handleDeleteClose = () => {
    setDeleteShow(false);
    setSelectedSyllabusObj({} as addSyllabusData);

  }
  const handleDeleteShow = (data) => {
    if (isEmptyObjectOrNullUndefiend(data)) {
      return;
    }

    setDeleteShow(true);
    setSelectedSyllabusObj(data);

  }
  const handleDeleteSyllabus = async () => {
    const reqBody = {
      id: [selectedSyllabusObj?.id],
    }
    const response = await dispatch(deleteSyllabusDataAPI(reqBody));
    if (response) {
      handleDeleteClose()
      handleGetCourseList();

    }


  }

  /** -------------------Delete Syllabus end-------------------------*/
  /** -------------------Complete syllabus start-------------------------*/
  const [completeConfirmationShow, setCompleteConfirmationShow] = useState(false);
  const handleConfirmationClose = () => {
    setCompleteSyllabusData([])
    setCompleteConfirmationShow(false);
  }
  const handleConfirmationShow = (id) => { setCompleteConfirmationShow(true); setCompleteSyllabusData([id]) }
  const [completeSyllabusData, setCompleteSyllabusData] = useState<any>([])

  const [SuccessShow, setSuccessShow] = useState(false);
  const handleSuccessClose = () => setSuccessShow(false);
  const handleSuccessShow = () => setSuccessShow(true);

  const handleSyllabusCompleted = async () => {
    let payload = {
      syllabus_id: completeSyllabusData
    }
    let response = await dispatch(updateSyllabusStatusDataAPI(payload));
    if (!isNullUndefinedOrBlank(response?.payload)) {
      handleGetCourseList();
      handleConfirmationClose();
      setTimeout(() => {
        handleSuccessShow();
      }, 300);
    }
  }
  /** -------------------Complete syllabus end-------------------------*/

  /** ----------------------refresh list start----------------------*/

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (coursesData.isUpdatedEventData) {
        handleGetCourseList();
        setTimeout(() => {
          dispatch(isUpdatedSyllabus(false));
        }, 400);
      }

    }, 300);
    return () => {
      clearTimeout(delayDebounceFn);
    }
  }, [coursesData.isUpdatedEventData])
  const [isAddNewData, setIsAddNewData] = useState(false);
  return (
    <>
      <div className="page-content">
        <div className="page-title-wrapper">
          <div className="page-title-left">
            <div className="page-title">
              <h4>All Courses</h4>
            </div>
          </div>
          <div className="page-title-right">
            <button type="button" className="btn btn-primary" onClick={() => { setShowEvent(true) }}>
              Add Syllabus{" "}
            </button>
          </div>
        </div>
        <div className="page-filters p-3 mb-0">
          <div className="page-filters-left">
            <Form.Group className="form-group form-group-sm form-group-inline-control">
              <div className="form-control-wrapper">
                <div className="form-group-icon-start">
                  <i className="material-symbols-outlined">search</i>
                  <Form.Control type="text" placeholder="Search By course name  "
                    onChange={(e) => { setSeacrhValue(e.target.value) }}
                    value={searchValue}

                  />
                </div>
              </div>
            </Form.Group>
            {/* <Form.Group className="form-group form-group-sm">
              <div className="react-datepicker-container form-group-icon-end">
                <i className="material-symbols-outlined control-icon">date_range</i>
                <DatePicker
                  dropdownMode="select"
                  isClearable={true}
                  dateFormat="dd/MM/yyyy"
                  className="form-control"
                  popperProps={{ strategy: "fixed" }}
                  placeholderText="Date Range"
                />
              </div>
            </Form.Group> */}
          </div>
          <div className="page-filters-right">
            <div className="list-view-group">
              <ul className="list-view-wrapper">
                <li className={`${selectedView === ENUM_FOR_DISPLAY_VIEW?.LIST_VIEW ? "active" : ""}`} onClick={() => { handleChangeView(ENUM_FOR_DISPLAY_VIEW?.LIST_VIEW) }}>
                  <a className="">
                    <i className="material-symbols-outlined">menu</i>
                  </a>
                </li>
                <li className={`${selectedView === ENUM_FOR_DISPLAY_VIEW?.GRID_VIEW ? "active" : ""}`}
                  onClick={() => { handleChangeView(ENUM_FOR_DISPLAY_VIEW?.GRID_VIEW) }}
                >
                  <a className="">
                    <i className="material-symbols-outlined">grid_on</i>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="content-area  content-area-title-filter">
          <div className="page-content-wrapper h-100">
            {
              selectedView === ENUM_FOR_DISPLAY_VIEW?.LIST_VIEW &&
              <>

                <div className="list-view-layout">
                  <div className="table-responsive mb-3">
                    <Table className="table-theme">
                      <thead className="border-less">
                        <tr>
                          {/* <th className="">
                        <div className="d-flex align-items-center gap-2">
                          <div className=" checkbox checkbox-primary checkbox-small">
                            <input
                              type="checkbox"
                              id="tbl-checkbox"
                              className="material-inputs filled-in"
                            />
                            <label htmlFor="tbl-checkbox"></label>
                          </div>
                          #
                        </div>
                      </th> */}
                          <th>Course Name</th>
                          <th>Course Color</th>
                          <th>No of Events</th>
                          <th>Last Update Date</th>
                          <th className="text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {

                          !isEmptyObjectOrNullUndefiend(syllabusList) ?
                            syllabusList?.map((item, index) => {
                              return (
                                <tr key={index}>
                                  {/* <td className="tbl-user">
                                <div className="tbl-user-checkbox-srno">
                                  <div className="checkbox checkbox-primary checkbox-small">
                                    <input
                                      type="checkbox"
                                      id="tbl-checkbox1"
                                      className="material-inputs filled-in"
                                    />
                                    <label htmlFor="tbl-checkbox1"></label>
                                  </div>
                                  <span>01.</span>
                                </div>
                              </td> */}
                                  <td>
                                    {item?.title || "-"}
                                  </td>
                                  <td>
                                    <span className="color-box" style={{ backgroundColor: `${item?.course_color || "#239bc266"}` }}></span>
                                  </td>
                                  <td>
                                    <a>{item?.no_of_events || "0"}</a>
                                  </td>
                                  <td>
                                    {formatedDate(item?.updated_at, " MM/DD/YYYY - hh:mm A")}

                                  </td>
                                  <td className="tbl-action">
                                    <div className="tbl-action-group">
                                      {/* <button
                                        className="btn btn-xs btn-icon btn-transparent check-icon"
                                        onClick={() => { handleConfirmationShow(item?.id) }}
                                      >
                                        <i className="material-symbols-outlined">check_circle</i>
                                      </button> */}
                                      {
                                        item?.status === "Completed" ?
                                          <button
                                            className="btn btn-xs btn-icon btn-transparent check-icon text-success "
                                          >

                                            <i className="material-symbols-outlined ">check_circle</i>
                                          </button>
                                          :
                                          <button
                                            className="btn btn-xs btn-icon btn-transparent check-icon " onClick={() => { handleConfirmationShow(item?.id) }}
                                          >
                                            <i className="material-symbols-outlined">check_circle</i>
                                          </button>
                                      }
                                      <button
                                        className="btn btn-xs btn-icon btn-transparent"
                                        onClick={() => { handleUpdateCourse(item) }}
                                      >
                                        <i className="material-symbols-outlined">edit</i>
                                      </button>
                                      <button className="btn btn-xs btn-icon btn-transparent text-danger" onClick={() => { handleDeleteShow(item) }}>
                                        <i className="material-symbols-outlined">delete</i>
                                      </button>
                                    </div>
                                  </td>
                                </tr>

                              )
                            })
                            : <>
                              <tr>
                                <td className='text-center'
                                  colSpan={35}
                                >
                                  {NO_RECORD_FOUND_MSG}
                                </td>
                              </tr>
                            </>
                        }

                      </tbody>
                    </Table>
                  </div>
                </div>

              </>

            }

            {/***** Grid layout start *****/}
            {
              selectedView === ENUM_FOR_DISPLAY_VIEW?.GRID_VIEW &&

              <div className="gird-view-layout">
                <div className="course-wrapper">
                  <Row className="course-container">
                    {
                      !isEmptyObjectOrNullUndefiend(syllabusList) ? syllabusList?.map((item, index) => {
                        return (
                          <Col md={"4"} key={index}>
                            <Card className="card-style-1">
                              <Card.Body>
                                <div className="corse-card">
                                  <div className="card-main-img" style={{ backgroundColor: `${item?.course_color || "#239bc266"}`, opacity: 0.4 }}>
                                    <img src={gridCardImg} alt="Open Planer" />
                                  </div>
                                  <div className="card-details-wrapper">
                                    <div className="card-title">
                                      <h3>{item?.title || ""}</h3>
                                    </div>
                                    <div className="selected-date-with-color">
                                      <div className="selected-date">
                                        <i className="material-symbols-outlined">calendar_month</i>
                                        <p> {formatedDate(item?.updated_at, " MM/DD/YYYY - hh:mm A")}</p>
                                      </div>
                                      <div className="selected-color">
                                        <span className="color-code" style={{ backgroundColor: `${item?.course_color || "#239bc266"}` }}></span>
                                        <p>{item?.course_color || "#239bc266"}</p>
                                      </div>
                                    </div>
                                    <div className="card-bottom">
                                      <div className="event-with-action">
                                        <div className="event">
                                          <p>
                                            <i className="material-symbols-outlined">trophy</i> Event:{" "}
                                            <span className="event-nub">{item?.no_of_events || "0"}</span>
                                          </p>
                                        </div>
                                        <div className="action-button">
                                          {
                                            item?.status === "Completed" ?
                                              <button
                                                className="btn btn-xs btn-icon btn-transparent check-icon text-success"
                                              >

                                                <i className="material-symbols-outlined">check_circle</i>
                                              </button>
                                              :
                                              <button
                                                className="btn btn-xs btn-icon btn-transparent check-icon" onClick={() => { handleConfirmationShow(item?.id) }}
                                              >
                                                <i className="material-symbols-outlined">check_circle</i>
                                              </button>
                                          }
                                          <button
                                            className="btn-icon btn-light-white btn-icon-text btn btn-white btn-sm"
                                            onClick={() => { handleUpdateCourse(item) }}
                                          >
                                            <i className="material-symbols-outlined">edit</i>
                                          </button>
                                          <button className="btn-icon btn-light-danger btn-icon-text btn btn-danger btn-sm"
                                            onClick={() => { handleDeleteShow(item) }}
                                          >
                                            <i className="material-symbols-outlined">delete</i>
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </Card.Body>
                            </Card>
                          </Col>
                        )
                      }) :
                        <>
                          <div className="no-records-found no-records-found-inner h-100">
                            <div className="no-records-found-image">
                              <img src={notVoucherFound} alt="OpenPlaner" />
                            </div>
                            <div className="no-records-found-text">
                              <h6>No data found!</h6>
                            </div>
                          </div>

                        </>
                    }


                  </Row>
                </div>
              </div>
            }
            {/***** Grid layout end *****/}

            {/***** Offcanvas start *****/}
            <SyllabusCanvasDetails handleCloseCourse={handleCloseCourse}
              selectedSyllabusObj={selectedSyllabusObj}
              showCourse={showCourse}
              handleGetCourseList={handleGetCourseList}
            />
            {/***** Offcanvas end *****/}

            <AddSyllabusEvents show={showEvent} setShowEvent={setShowEvent}
              setIsAddNewData={setIsAddNewData} isAddNewData={isAddNewData}
            />



            {/* Delete Modal */}
            <Modal className='modal-theme modal-confirmation modal-reject' show={deleteShow} onHide={handleDeleteClose} centered>
              <Modal.Header >
                <h4 className="modal-title">Delete Syllabus</h4>
                <button type="button" className="btn-close" onClick={handleDeleteClose}>
                  <i className='material-symbols-outlined'>close</i>
                </button>
              </Modal.Header>
              <Modal.Body>
                <div className="modal-confirmation-container">
                  <div className="modal-confirmation-icon">
                    <i className="material-symbols-outlined">delete</i>
                  </div>
                  <div className="modal-confirmation-content">
                    <h5>Are You Sure?</h5>
                    <p>You want to Delete this Syllabus?</p>
                  </div>
                </div>
                <div className="modal-button-group modal-full-width-btn modal-footer-button">
                  <Button variant='light-white' className="btn-md" onClick={handleDeleteClose}> No, Change My Mind</Button>
                  <Button variant='danger' className='btn-icon-text btn-md' onClick={() => { handleDeleteSyllabus() }}>
                    Delete
                  </Button>
                </div>
              </Modal.Body>
            </Modal>
            {/* Delete Modal */}



            {/* complete syllabus confirmation Modal */}
            <Modal className='modal-theme modal-confirmation modal-approve' show={completeConfirmationShow} onHide={handleConfirmationClose} centered>
              <Modal.Header >
                <h4 className="modal-title">Syllabus Completed!</h4>
                <button type="button" className="btn-close" onClick={handleConfirmationClose}>
                  <i className="material-symbols-outlined">close</i>
                </button>
              </Modal.Header>
              <Modal.Body>
                <div className="modal-confirmation-container">
                  <div className="modal-confirmation-icon">
                    <i className="material-symbols-outlined">check_circle</i>
                  </div>
                  <div className="modal-confirmation-content">

                    <h5>All the Events of this course will be marked as completed.</h5>
                    <p>Do you want to proceed?</p>

                  </div>
                </div>
                <div className="modal-button-group modal-full-width-btn modal-footer-button">
                  <Button variant="light-white"
                    className="btn-icon-text btn-md" onClick={handleConfirmationClose}> Cancel
                  </Button>
                  <Button variant="success"
                    className="btn-icon-text btn-md" onClick={() => { handleSyllabusCompleted() }}> Ok
                  </Button>
                </div>
              </Modal.Body>
            </Modal>
            {/* complete syllabus confirmation Modal */}
            {/* Success Modal */}
            <Modal className='modal-theme modal-confirmation modal-approve' show={SuccessShow} onHide={handleSuccessClose} centered>
              <Modal.Header >
                <h4 className="modal-title">Syllabus Completed!</h4>
                <button type="button" className="btn-close" onClick={handleSuccessClose}>
                  <i className="material-symbols-outlined">close</i>
                </button>
              </Modal.Header>
              <Modal.Body>
                <div className="modal-confirmation-container">
                  <div className="modal-confirmation-icon">
                    <i className="material-symbols-outlined">check_circle</i>
                  </div>
                  <div className="modal-confirmation-content">
                    <h5>You have successfully
                      completed  Syllabus!</h5>
                    <p>Get back to syllabus page to add or complete the other syllabus</p>
                  </div>
                </div>
                <div className="modal-button-group modal-full-width-btn modal-footer-button">
                  <Button variant="success"
                    className="btn-icon-text btn-md" onClick={handleSuccessClose}> Done
                  </Button>
                </div>
              </Modal.Body>
            </Modal>
            {/* Success Modal */}

          </div>
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
});

const mapDispatchToProps = {

};

export default connect(mapStateToProps, mapDispatchToProps)(Courses);
