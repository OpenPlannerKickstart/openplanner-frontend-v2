import React, { useState } from "react";
import { Button, Form, Modal, Table } from "react-bootstrap";
import DatePicker from "react-datepicker";

const Task = () => {
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
              <h4>All Tasks</h4>
            </div>
          </div>
          <div className="page-title-right">
            <button
              type="button"
              className="btn btn-primary"
              
            >
              Add Task{" "}
            </button>
          </div>
        </div>
        <div className="page-filters p-3 mb-0">
          <div className="page-filters-left">
            
          </div>
          <div className="page-filters-right">
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
        </div>

        <div className="content-area ">
          <div className="page-content-wrapper h-100">
            <div className="all-task-container">

                <div className="nav-tabs-outer nav-tabs-style2 page-filters">
                    <nav>
                        <div
                        className="nav nav-tabs"
                        id="nav-tab"
                        role="tablist"
                        >
                        <div className="page-filter-left">
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


                            <div className="page-filters-right">
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
                            
                        </div>
                        </div>
                        <div
                        className="tab-pane fade"
                        id="nav-Events"
                        role="tabpanel"
                        aria-labelledby="nav-Events-tab"
                        >
                        
                        </div>
                    </div>
                </div>


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
                          >
                            {" "}
                            <i className="th th-outline-edit"></i>
                          </button>
                          <button
                            className="btn btn-xs btn-icon btn-transparent"
                            onClick={handleDeleteShow}
                          >
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
                          <button
                            className="btn btn-xs btn-icon btn-transparent"
                            onClick={handleDeleteShow}
                          >
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




            {/* Delete Modal */}
            <Modal
              className="modal-theme modal-confirmation modal-reject"
              show={deleteShow}
              onHide={handleDeleteClose}
              centered
            >
              <Modal.Header>
                <h4 className="modal-title">Delete Task</h4>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleDeleteClose}
                >
                  <i className="th th-close"></i>
                </button>
              </Modal.Header>
              <Modal.Body>
                <div className="modal-confirmation-container">
                  <div className="modal-confirmation-icon">
                    <i className="th th-bold-trash"></i>
                  </div>
                  <div className="modal-confirmation-content">
                    <h5>Want to Delete?</h5>
                    <p>
                      You want to Delete <b>{"Selected Reacord"}</b> ?
                    </p>
                  </div>
                </div>
                <div className="modal-button-group modal-full-width-btn modal-footer-button">
                  <Button
                    variant="light-white"
                    className="btn-md"
                    onClick={handleDeleteClose}
                  >
                    {" "}
                    No, Change My Mind
                  </Button>
                  <Button
                    variant="danger"
                    className="btn-icon-text btn-md"
                    onClick={handleDeleteClose}
                  >
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

export default Task;
