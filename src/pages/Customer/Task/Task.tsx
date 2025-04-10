import React, { useState } from "react";
import { Badge, Button, Form, Modal, Offcanvas } from "react-bootstrap";
import DatePicker from "react-datepicker";
import Select, { components, ControlProps } from "react-select";
import Open from "./Open";
import Complete from "./Complete";

const Task = () => {
    // Deleted modal
    const [deleteShow, setDeleteShow] = useState(false);
    const handleDeleteClose = () => setDeleteShow(false);
    const handleDeleteShow = () => setDeleteShow(true);
  
    // Compated Deleted modal
    const [SuccessDeleteShow, setSuccessDeleteShow] = useState(false);
    const handleSuccessDeleteClose = () => setSuccessDeleteShow(false);
    const handleSuccessDeleteShow = () => setSuccessDeleteShow(true);

    // Success modal
    const [SuccessShow, setSuccessShow] = useState(false);
    const handleSuccessClose = () => setSuccessShow(false);
    const handleSuccessShow = () => setSuccessShow(true);

    // ADD new task offcanvas
    const [showAddNewCourse, setShowAddNewCourse] = useState(false);
    const handleCloseAddNewCourse = () => setShowAddNewCourse(false);
    const toggleShowAddNewCourse = () => setShowAddNewCourse(true);

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
              onClick={toggleShowAddNewCourse}
            >
              Add Task{" "}
            </button>            
          </div>
        </div>

        <div className="content-area task-content-area content-area-title-filter">
            <div className="page-content-wrapper h-100">
            <div className="all-task-container">

                <div className="nav-tabs-outer nav-tabs-style2">
                    <nav>
                        <div
                        className="nav nav-tabs page-filters"
                        id="nav-tab"
                        role="tablist"
                        >
                            <div className="page-filters-left">
                                <button
                                    className="nav-link active"
                                    id="nav-opentask-tab"
                                    data-bs-toggle="tab"
                                    data-bs-target="#nav-opentask"
                                    type="button"
                                    role="tab"
                                    aria-controls="nav-opentask"
                                    aria-selected="true"
                                >
                                    {" "}
                                    open  <Badge bg="light-grey">24</Badge>
                                </button>

                                <button
                                    className="nav-link"
                                    id="nav-complatetask-tab"
                                    data-bs-toggle="tab"
                                    data-bs-target="#nav-complatetask"
                                    type="button"
                                    role="tab"
                                    aria-controls="nav-complatetask"
                                    aria-selected="false"
                                >
                                    Completed
                                </button>
                            </div>
                            <div className="page-filters-right">
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
                        </div>
                    </nav>
                    <div className="tab-content" id="nav-tabContent">
                        <div
                        className="tab-pane fade show active"
                        id="nav-opentask"
                        role="tabpanel"
                        aria-labelledby="nav-opentask-tab"
                        >
                            <div className="tab-content-container">                                
                                <Open/>
                            </div>
                        </div>
                        <div
                        className="tab-pane fade"
                        id="nav-complatetask"
                        role="tabpanel"
                        aria-labelledby="nav-complatetask-tab"
                        >
                          <div className="tab-content-container">
                            <Complete/>
                          </div>
                        </div>
                    </div>
                </div>
            </div>



           {/***** Offcanvas start *****/}
           <div className="add-syllabus-event-wrapper">
              <Offcanvas
                className="op-offcanvas style-1"
                show={showAddNewCourse}
                placement={"end"}
                onHide={handleCloseAddNewCourse}
              >
                <Offcanvas.Header>
                  <Offcanvas.Title>
                  Add New <span>Task</span>
                  </Offcanvas.Title>
                  <button type="button" className="btn-close" onClick={handleCloseAddNewCourse}>
                  <i className='material-symbols-outlined'>close</i>
                  </button>
                </Offcanvas.Header>
                <Offcanvas.Body>   
                    <div className="Add-new-task-container">
                        <div className="op-offcanvas-body-container">
                            <Form.Group
                              className="form-group"
                              controlId="exampleForm.ControlInput1"
                            >
                              <Form.Label>Task Name</Form.Label>
                              <div className="form-group">
                                <Form.Control type="text" placeholder="Enter task name" />
                              </div>
                            </Form.Group>
                            <Form.Group className="form-group">
                              <Form.Label>Due Date</Form.Label>
                              <div className="react-datepicker-container form-group-icon-end">
                                <i className="material-symbols-outlined control-icon">calendar_month</i>
                                <DatePicker
                                  dropdownMode="select"
                                  isClearable={true}
                                  dateFormat="dd/MM/yyyy"
                                  className="form-control"
                                  popperProps={{ strategy: "fixed" }}
                                  placeholderText="10-03-2025 12:17 AM"
                                />
                              </div>
                            </Form.Group>
                            <Form.Group
                              className="form-group"
                              controlId="exampleForm.ControlInput1"
                            >
                              <Form.Label>Note</Form.Label>
                              <div className="form-group">
                                <Form.Control as="textarea" rows={3} placeholder="Enter note" />
                              </div>
                            </Form.Group>
                            <div className="Reminder-box">
                              <div className="title-with-switch">
                                <div className="title-text"><h4>Reminder (Notify me before start date)</h4></div>
                                <div className="switch-box ">
                                    <label className="switch" htmlFor="switch">
                                        <input type="checkbox" id='switch'/>
                                        <div className="slider round"></div>
                                    </label>
                                </div>
                              </div>
                              <div className="remider-fields">
                                <Form.Group className='form-group'>
                                  <Form.Label>Unit</Form.Label>
                                  <Select
                                          placeholder={<div>Days</div>}
                                          menuPosition="fixed"
                                          className="react-select-container"
                                      />
                                </Form.Group>
                                  <Form.Group className="form-group" controlId="exampleForm.ControlInput1">
                                    <Form.Label>Value</Form.Label>
                                    <Form.Select aria-label="Default select example">
                                        <option>5</option>
                                        <option value="1">1</option>
                                        <option value="2">2</option>
                                        <option value="3">3</option>
                                    </Form.Select>
                                </Form.Group>
                                <button type="button" className="btn btn-light-danger">
                                  <i className="material-symbols-outlined">delete</i>
                                </button>
                              </div>
                              <div className="remider-fields">
                                <Form.Group className='form-group'>
                                  <Form.Label>Unit</Form.Label>
                                  <Select
                                          placeholder={<div>Hours</div>}
                                          menuPosition="fixed"
                                          className="react-select-container"
                                      />
                                </Form.Group>
                                  <Form.Group className="form-group" controlId="exampleForm.ControlInput1">
                                    <Form.Label>Value</Form.Label>
                                    <Form.Select aria-label="Default select example">
                                        <option>1</option>
                                        <option value="1">1</option>
                                        <option value="2">2</option>
                                        <option value="3">3</option>
                                    </Form.Select>
                                </Form.Group>
                                <button type="button" className="btn btn-light-danger">
                                  <i className="material-symbols-outlined">delete</i>
                                </button>
                              </div>
                              <div className="add-remider-filed-button">
                                <Button variant='warning' className='btn-icon btn-icon-text'> <i className="material-symbols-outlined">add</i></Button>
                              </div>
                            </div>
                        </div>
                        <div className="bottom-button-group">
                          <Button type="button" className="btn btn-light-white me-auto">
                              Cancel
                          </Button>
                          <Button type="button" className="btn btn-light-white">
                            Clear
                          </Button>
                          <Button type="button" className="btn btn-primary">
                              Save
                          </Button>
                        </div>
                    </div>
                </Offcanvas.Body>
              </Offcanvas>
            </div>
            {/***** Offcanvas end *****/}


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
                    <p>
                    Are you sure, you want to delete this task ? 
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
            
            {/* Compated Delete Modal */}
            <Modal
              className="modal-theme modal-confirmation modal-reject"
              show={SuccessDeleteShow}
              onHide={handleSuccessDeleteClose}
              centered
            >
              <Modal.Header>
                <h4 className="modal-title">Task Deleted!</h4>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleSuccessDeleteClose}
                >
                  <i className='material-symbols-outlined'>close</i>
                </button>
              </Modal.Header>
              <Modal.Body>
                <div className="modal-confirmation-container">
                  <div className="modal-confirmation-icon">
                    <i className="material-symbols-outlined">delete</i>
                  </div>
                  <div className="modal-confirmation-content">
                    <h5>You have successfully
                    deleted Task!</h5>
                    <p>
                    Get back to task page to add or complete the other task
                    </p>
                  </div>
                </div>
                <div className="modal-button-group modal-full-width-btn modal-footer-button">
                  <Button
                    variant="success"
                    className="btn-icon-text btn-md"
                    onClick={handleSuccessDeleteClose}
                  >
                    Done
                  </Button>
                </div>
              </Modal.Body>
            </Modal>
            {/* Delete Modal */} 


            {/* Success Modal */}
                <Modal className='modal-theme modal-confirmation modal-approve' show={SuccessShow} onHide={handleSuccessClose} centered>
                    <Modal.Header >
                        <h4 className="modal-title">Task Completed!</h4>
                        <button type="button" className="btn-close" onClick={handleSuccessClose}>
                        <i className='material-symbols-outlined'>close</i>
                        </button>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="modal-confirmation-container">
                            <div className="modal-confirmation-icon">
                                <i className="material-symbols-outlined">mood</i>
                            </div>
                            <div className="modal-confirmation-content">
                                <h5>You have successfully
                                completed  Task!</h5>
                                <p>Get back to task page to add or complete the other task</p>
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

export default Task;
