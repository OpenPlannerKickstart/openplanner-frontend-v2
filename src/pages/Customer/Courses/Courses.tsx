import React, { useState } from "react";
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
import { connect } from "react-redux";
import SyllabusDetails from "./SyllabusDetails";
import Events from "./Events";
import AddSyllabusEvents from "../../../common/AddSyllabusEvents/AddSyllabusEvents";

const Courses = (props) => {
  const [showCourse, setShowCourse] = useState(false);
  const [showEvent, setShowEvent] = useState(false);

  const handleCloseCourse = () => setShowCourse(false);
  const toggleShowCourse = () => setShowCourse((s) => !s);


  console.log(showEvent)
  // Add syllabus event offcanvas
  const [showAddSyllabusEvents, setShowAddSyllabusEvents] = useState(false);
  
  const handleCloseAddSyllabusEvents = () => setShowAddSyllabusEvents(false);
  const toggleShowAddSyllabusEvents = () => setShowAddSyllabusEvents((s) => !s);


  // Close modal
    const [deleteShow, setDeleteShow] = useState(false);
    const handleDeleteClose = () => setDeleteShow(false);
    const handleDeleteShow = () => setDeleteShow(true);


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
            <button type="button" className="btn btn-primary"onClick={()=>{setShowEvent(true)}}>
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
                  <Form.Control type="text" placeholder="Search" />
                </div>
              </div>
            </Form.Group>
            <Form.Group className="form-group form-group-sm">
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
            </Form.Group>
          </div>
          <div className="page-filters-right">
            <div className="list-view-group">
              <ul className="list-view-wrapper">
                <li className="active">
                  <a className="">
                    <i className="material-symbols-outlined">menu</i>
                  </a>
                </li>
                <li>
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
            <div className="list-view-layout">
              <div className="table-responsive mb-5">
                <Table className="table-theme table-bordered">
                  <thead className="border-less">
                    <tr>
                      <th className="">
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
                      </th>
                      <th>Course Name</th>
                      <th>Course Color</th>
                      <th>No of Events</th>
                      <th>Last Update Date</th>
                      <th className="text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="tbl-user">
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
                      </td>
                      <td>
                        The Role of Artificial Intelligence in Personalized
                        Learning
                      </td>
                      <td>
                        <span className="color-box"></span>
                      </td>
                      <td>
                        <a>10</a>
                      </td>
                      <td>13-03-2025 - 04:50 PM</td>
                      <td className="tbl-action">
                        <div className="tbl-action-group">
                          <button
                            className="btn btn-xs btn-icon btn-transparent"
                            onClick={toggleShowCourse}
                          >
                            {" "}
                            <i className="material-symbols-outlined">edit</i>
                          </button>
                          <button className="btn btn-xs btn-icon btn-transparent text-danger" onClick={handleDeleteShow}>
                            {" "}
                            <i className="material-symbols-outlined">delete</i>
                          </button>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td className="tbl-user">
                        <div className="tbl-user-checkbox-srno">
                          <div className="checkbox checkbox-primary checkbox-small">
                            <input
                              type="checkbox"
                              id="tbl-checkbox2"
                              className="material-inputs filled-in"
                            />
                            <label htmlFor="tbl-checkbox2"></label>
                          </div>
                          <span>02.</span>
                        </div>
                      </td>
                      <td>Project Management</td>
                      <td>
                        <span className="color-box"></span>
                      </td>
                      <td>
                        <a>10</a>
                      </td>
                      <td>12-03-2025 - 12:30 PM</td>
                      <td className="tbl-action">
                        <div className="tbl-action-group">
                          <button className="btn btn-xs btn-icon btn-transparent">
                            {" "}
                            <i className="material-symbols-outlined">edit</i>
                          </button>
                          <button className="btn btn-xs btn-icon btn-transparent text-danger" onClick={handleDeleteShow}>
                            {" "}
                            <i className="material-symbols-outlined">delete</i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </div>
            </div>

            {/***** Grid layout start *****/}
            <div className="gird-view-layout">
              <div className="course-wrapper">
                <Row className="course-container">
                  <Col md={"4"}>
                    <Card className="card-style-1">
                      <Card.Body>
                        <div className="corse-card">
                          <div className="card-main-img">
                            <img src={gridCardImg} alt="Open Planer" />
                          </div>
                          <div className="card-details-wrapper">
                            <div className="card-title">
                              <h3>Project Management</h3>
                            </div>
                            <div className="selected-date-with-color">
                              <div className="selected-date">
                                <i className="material-symbols-outlined">calendar_month</i>
                                <p>12-03-2025 - 12:30 PM</p>
                              </div>
                              <div className="selected-color">
                                <span className="color-code"></span>
                                <p>#545455</p>
                              </div>
                            </div>
                            <div className="card-bottom">
                              <div className="event-with-action">
                                <div className="event">
                                  <p>
                                    <i className="material-symbols-outlined">trophy</i> Event:{" "}
                                    <span className="event-nub">10</span>
                                  </p>
                                </div>
                                <div className="action-button">
                                  <button
                                    className="btn-icon btn-light-white btn-icon-text btn btn-white btn-sm"
                                    onClick={toggleShowCourse}
                                  >
                                    <i className="material-symbols-outlined">edit</i>
                                  </button>
                                  <button className="btn-icon btn-light-danger btn-icon-text btn btn-danger btn-sm">
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
                  <Col md={"4"}>
                    <Card className="card-style-1">
                      <Card.Body>
                        <div className="corse-card">
                          <div className="card-main-img">
                            <img src={gridCardImg} alt="Open Planer" />
                          </div>
                          <div className="card-details-wrapper">
                            <div className="card-title">
                              <h3>Project Management</h3>
                            </div>
                            <div className="selected-date-with-color">
                              <div className="selected-date">
                                <i className="material-symbols-outlined">calendar_month</i>
                                <p>12-03-2025 - 12:30 PM</p>
                              </div>
                              <div className="selected-color">
                                <span className="color-code"></span>
                                <p>#545455</p>
                              </div>
                            </div>
                            <div className="card-bottom">
                              <div className="event-with-action">
                                <div className="event">
                                  <p>
                                    <i className="material-symbols-outlined">trophy</i> Event:{" "}
                                    <span className="event-nub">10</span>
                                  </p>
                                </div>
                                <div className="action-button">
                                  <button className="btn-icon btn-light-white btn-icon-text btn btn-white btn-sm">
                                  <i className="material-symbols-outlined">edit</i>
                                  </button>
                                  <button className="btn-icon btn-light-danger btn-icon-text btn btn-danger btn-sm">
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
                  <Col md={"4"}>
                    <Card className="card-style-1">
                      <Card.Body>
                        <div className="corse-card">
                          <div className="card-main-img">
                            <img src={gridCardImg} alt="Open Planer" />
                          </div>
                          <div className="card-details-wrapper">
                            <div className="card-title">
                              <h3>Project Management</h3>
                            </div>
                            <div className="selected-date-with-color">
                              <div className="selected-date">
                                <i className="material-symbols-outlined">calendar_month</i>
                                <p>12-03-2025 - 12:30 PM</p>
                              </div>
                              <div className="selected-color">
                                <span className="color-code"></span>
                                <p>#545455</p>
                              </div>
                            </div>
                            <div className="card-bottom">
                              <div className="event-with-action">
                                <div className="event">
                                  <p>
                                  <i className="material-symbols-outlined">trophy</i> Event:{" "}
                                    <span className="event-nub">10</span>
                                  </p>
                                </div>
                                <div className="action-button">
                                  <button className="btn-icon btn-light-white btn-icon-text btn btn-white btn-sm">
                                  <i className="material-symbols-outlined">edit</i>
                                  </button>
                                  <button className="btn-icon btn-light-danger btn-icon-text btn btn-danger btn-sm">
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
                  <Col md={"4"}>
                    <Card className="card-style-1">
                      <Card.Body>
                        <div className="corse-card">
                          <div className="card-main-img">
                            <img src={gridCardImg} alt="Open Planer" />
                          </div>
                          <div className="card-details-wrapper">
                            <div className="card-title">
                              <h3>Project Management</h3>
                            </div>
                            <div className="selected-date-with-color">
                              <div className="selected-date">
                                <i className="material-symbols-outlined">calendar_month</i>
                                <p>12-03-2025 - 12:30 PM</p>
                              </div>
                              <div className="selected-color">
                                <span className="color-code"></span>
                                <p>#545455</p>
                              </div>
                            </div>
                            <div className="card-bottom">
                              <div className="event-with-action">
                                <div className="event">
                                  <p>
                                  <i className="material-symbols-outlined">trophy</i> Event:{" "}
                                    <span className="event-nub">10</span>
                                  </p>
                                </div>
                                <div className="action-button">
                                  <button className="btn-icon btn-light-white btn-icon-text btn btn-white btn-sm">
                                  <i className="material-symbols-outlined">edit</i>
                                  </button>
                                  <button className="btn-icon btn-light-danger btn-icon-text btn btn-danger btn-sm">
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
                  <Col md={"4"}>
                    <Card className="card-style-1">
                      <Card.Body>
                        <div className="corse-card">
                          <div className="card-main-img">
                            <img src={gridCardImg} alt="Open Planer" />
                          </div>
                          <div className="card-details-wrapper">
                            <div className="card-title">
                              <h3>Project Management</h3>
                            </div>
                            <div className="selected-date-with-color">
                              <div className="selected-date">
                                <i className="material-symbols-outlined">calendar_month</i>
                                <p>12-03-2025 - 12:30 PM</p>
                              </div>
                              <div className="selected-color">
                                <span className="color-code"></span>
                                <p>#545455</p>
                              </div>
                            </div>
                            <div className="card-bottom">
                              <div className="event-with-action">
                                <div className="event">
                                  <p>
                                    <i className="material-symbols-outlined">trophy</i> Event:{" "}
                                    <span className="event-nub">10</span>
                                  </p>
                                </div>
                                <div className="action-button">
                                  <button className="btn-icon btn-light-white btn-icon-text btn btn-white btn-sm">
                                  <i className="material-symbols-outlined">edit</i>
                                  </button>
                                  <button className="btn-icon btn-light-danger btn-icon-text btn btn-danger btn-sm">
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
                </Row>
              </div>
            </div>
            {/***** Grid layout end *****/}

            {/***** Offcanvas start *****/}
            <div className="edit-course-canvas-wrapper">
              <Offcanvas
                className="edit-course-canvas"
                show={showCourse}
                placement={"end"}
                onHide={handleCloseCourse}
              >
                <Offcanvas.Header>
                  <Offcanvas.Title>
                    Edit <span>Project Management</span>
                  </Offcanvas.Title>
                  <button type="button" className="btn-close" onClick={handleCloseCourse}>
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
                                  className="nav-link active"
                                  id="nav-SyllabusDetails-tab"
                                  data-bs-toggle="tab"
                                  data-bs-target="#nav-SyllabusDetails"
                                  type="button"
                                  role="tab"
                                  aria-controls="nav-SyllabusDetails"
                                  aria-selected="true"
                                >
                                  {" "}
                                  Syllabus Details
                                </button>

                                <button
                                  className="nav-link"
                                  id="nav-Events-tab"
                                  data-bs-toggle="tab"
                                  data-bs-target="#nav-Events"
                                  type="button"
                                  role="tab"
                                  aria-controls="nav-Events"
                                  aria-selected="false"
                                >
                                  Events
                                </button>


                                <Button variant="primary" size="sm" className="ms-auto">Add New Event</Button>
                              </div>
                            </nav>
                            <div className="tab-content" id="nav-tabContent">
                              <div
                                className="tab-pane fade show active"
                                id="nav-SyllabusDetails"
                                role="tabpanel"
                                aria-labelledby="nav-SyllabusDetails-tab"
                              >
                                <div className="tab-content-container">
                                  <SyllabusDetails />
                                  <div className="bottom-button-group">
                                    <Button type="button" className="btn btn-light-white me-auto">
                                      Cancel
                                    </Button>
                                    <Button type="button" className="btn btn-light-danger">
                                      Delete Syllabus
                                    </Button>
                                    <Button type="button" className="btn btn-primary">
                                      Save
                                    </Button>
                                  </div>
                                </div>
                              </div>
                              <div
                                className="tab-pane fade"
                                id="nav-Events"
                                role="tabpanel"
                                aria-labelledby="nav-Events-tab"
                              >
                                <Events />
                                <div className="bottom-button-group">
                                    <Button type="button" className="btn btn-light-white me-auto">
                                      Cancel
                                    </Button>
                                    <Button type="button" className="btn btn-light-danger">
                                      Delete Syllabus
                                    </Button>
                                    <Button type="button" className="btn btn-primary">
                                      Save
                                    </Button>
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
            {/***** Offcanvas end *****/}

            <AddSyllabusEvents show={showEvent} setShowEvent={setShowEvent}/>



             {/* Delete Modal */}
              <Modal className='modal-theme modal-confirmation modal-reject' show={deleteShow} onHide={handleDeleteClose} centered>
                  <Modal.Header >
                        <h4 className="modal-title">Delete Task</h4>
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
                              <h5>Want to Delete?</h5>
                              <p>You want to Delete <b>{'Selected Reacord'}</b> ?</p>
                          </div>
                      </div>
                      <div className="modal-button-group modal-full-width-btn modal-footer-button">
                          <Button variant='light-white' className="btn-md" onClick={handleDeleteClose}> No, Change My Mind</Button>
                          <Button variant='danger' className='btn-icon-text btn-md' onClick={handleDeleteClose}>
                              Delete
                          </Button>
                      </div>
                  </Modal.Body>
              </Modal>
          {/* Delete Modal */}

          </div>
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Courses);
