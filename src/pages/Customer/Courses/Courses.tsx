import React, { useState } from "react";
import {
  Button,
  Card,
  Col,
  Form,
  Offcanvas,
  Row,
  Table,
} from "react-bootstrap";
import gridCardImg from "/assets/images/grid-card-img.svg";
import DatePicker from "react-datepicker";
import { connect } from "react-redux";
import SyllabusDetails from "./SyllabusDetails";
import Events from "./Events";

const Courses = (props) => {
  const [showCourse, setShowCourse] = useState(false);

  const handleCloseCourse = () => setShowCourse(false);
  const toggleShowCourse = () => setShowCourse((s) => !s);

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
            <button type="button" className="btn btn-primary">
              Add Syllabus{" "}
            </button>
          </div>
        </div>
        <div className="page-filters p-3 mb-0">
          <div className="page-filters-left">
            <Form.Group className="form-group form-group-sm form-group-inline-control">
              <div className="form-control-wrapper">
                <div className="form-group-icon-start">
                  <i className="th th-outline-search-normal"></i>
                  <Form.Control type="text" placeholder="Search" />
                </div>
              </div>
            </Form.Group>
            <Form.Group className="form-group form-group-sm">
              <div className="react-datepicker-container form-group-icon-end">
                <i className="th th-outline-calendar-1 control-icon"></i>
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
                    <i className="th th-list"></i>
                  </a>
                </li>
                <li>
                  <a className="">
                    <i className="th th-outline-grid-1"></i>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="content-area ">
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
                            <i className="th th-outline-edit"></i>
                          </button>
                          <button className="btn btn-xs btn-icon btn-transparent">
                            {" "}
                            <i className="th th-outline-trash"></i>
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
                            <i className="th th-outline-edit"></i>
                          </button>
                          <button className="btn btn-xs btn-icon btn-transparent">
                            {" "}
                            <i className="th th-outline-trash"></i>
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
                            <img src={gridCardImg} alt="" />
                          </div>
                          <div className="card-details-wrapper">
                            <div className="card-title">
                              <h3>Project Management</h3>
                            </div>
                            <div className="selected-date-with-color">
                              <div className="selected-date">
                                <i className="th th-outline-calendar-1"></i>
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
                                    <i className="th th-outline-cup"></i> Event:{" "}
                                    <span className="event-nub">10</span>
                                  </p>
                                </div>
                                <div className="action-button">
                                  <button
                                    className="btn-icon btn-light-white btn-icon-text btn btn-white btn-sm"
                                    onClick={toggleShowCourse}
                                  >
                                    <i className="th th-outline-edit"></i>
                                  </button>
                                  <button className="btn-icon btn-light-white btn-icon-text btn btn-white btn-sm">
                                    <i className="th th-outline-trash"></i>
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
                            <img src={gridCardImg} alt="" />
                          </div>
                          <div className="card-details-wrapper">
                            <div className="card-title">
                              <h3>Project Management</h3>
                            </div>
                            <div className="selected-date-with-color">
                              <div className="selected-date">
                                <i className="th th-outline-calendar-1"></i>
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
                                    <i className="th th-outline-cup"></i> Event:{" "}
                                    <span className="event-nub">10</span>
                                  </p>
                                </div>
                                <div className="action-button">
                                  <button className="btn-icon btn-light-white btn-icon-text btn btn-white btn-sm">
                                    <i className="th th-outline-edit"></i>
                                  </button>
                                  <button className="btn-icon btn-light-white btn-icon-text btn btn-white btn-sm">
                                    <i className="th th-outline-trash"></i>
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
                            <img src={gridCardImg} alt="" />
                          </div>
                          <div className="card-details-wrapper">
                            <div className="card-title">
                              <h3>Project Management</h3>
                            </div>
                            <div className="selected-date-with-color">
                              <div className="selected-date">
                                <i className="th th-outline-calendar-1"></i>
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
                                    <i className="th th-outline-cup"></i> Event:{" "}
                                    <span className="event-nub">10</span>
                                  </p>
                                </div>
                                <div className="action-button">
                                  <button className="btn-icon btn-light-white btn-icon-text btn btn-white btn-sm">
                                    <i className="th th-outline-edit"></i>
                                  </button>
                                  <button className="btn-icon btn-light-white btn-icon-text btn btn-white btn-sm">
                                    <i className="th th-outline-trash"></i>
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
                            <img src={gridCardImg} alt="" />
                          </div>
                          <div className="card-details-wrapper">
                            <div className="card-title">
                              <h3>Project Management</h3>
                            </div>
                            <div className="selected-date-with-color">
                              <div className="selected-date">
                                <i className="th th-outline-calendar-1"></i>
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
                                    <i className="th th-outline-cup"></i> Event:{" "}
                                    <span className="event-nub">10</span>
                                  </p>
                                </div>
                                <div className="action-button">
                                  <button className="btn-icon btn-light-white btn-icon-text btn btn-white btn-sm">
                                    <i className="th th-outline-edit"></i>
                                  </button>
                                  <button className="btn-icon btn-light-white btn-icon-text btn btn-white btn-sm">
                                    <i className="th th-outline-trash"></i>
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
                            <img src={gridCardImg} alt="" />
                          </div>
                          <div className="card-details-wrapper">
                            <div className="card-title">
                              <h3>Project Management</h3>
                            </div>
                            <div className="selected-date-with-color">
                              <div className="selected-date">
                                <i className="th th-outline-calendar-1"></i>
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
                                    <i className="th th-outline-cup"></i> Event:{" "}
                                    <span className="event-nub">10</span>
                                  </p>
                                </div>
                                <div className="action-button">
                                  <button className="btn-icon btn-light-white btn-icon-text btn btn-white btn-sm">
                                    <i className="th th-outline-edit"></i>
                                  </button>
                                  <button className="btn-icon btn-light-white btn-icon-text btn btn-white btn-sm">
                                    <i className="th th-outline-trash"></i>
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
            <div className="edit-course-canvas">
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
                      <i className='th th-close'></i>
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
                                    <button type="button" className="btn btn-light-white me-auto">
                                      Cancel
                                    </button>
                                    <button type="button" className="btn btn-light-danger">
                                      Delete Syllabus
                                    </button>
                                    <button type="button" className="btn btn-primary">
                                      Save
                                    </button>
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
          </div>
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Courses);
