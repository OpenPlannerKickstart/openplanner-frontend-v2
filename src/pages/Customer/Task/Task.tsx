import React, { useState } from "react";
import { Badge, Button, Form, Modal, Table } from "react-bootstrap";
import DatePicker from "react-datepicker";

const Task = () => {
     // Deleted modal
        const [deleteShow, setDeleteShow] = useState(false);
        const handleDeleteClose = () => setDeleteShow(false);
        const handleDeleteShow = () => setDeleteShow(true);
  
    // Compated Deleted modal
    const [SuccessDeleteShow, setSuccessDeleteShow] = useState(false);
    const handleSuccessDeleteClose = () => setSuccessDeleteShow(false);
    const handleSuccessDeleteShow = () => setSuccessDeleteShow(true);

    const [SuccessShow, setSuccessShow] = useState(false);
        const handleSuccessClose = () => setSuccessShow(false);
        const handleSuccessShow = () => setSuccessShow(true);
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
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSuccessDeleteShow}
            >
              Task Deleted! 
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSuccessShow}
            >
              Task Completed!
            </button>
          </div>
        </div>

        <div className="content-area task-content-area">
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
                                    open  <Badge bg="primary-bg">24</Badge>
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
                        id="nav-opentask"
                        role="tabpanel"
                        aria-labelledby="nav-opentask-tab"
                        >
                            <div className="tab-content-container">

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
                                            <th>Task Name</th>
                                            <th>Note</th>
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
                                                    Science Lab Experiment Report
                                                </td>
                                                <td>
                                                    Loream ipsum is simply dummy text
                                                </td>
                                                <td>13-03-2025 - 04:50 PM</td>
                                                <td className="tbl-action">
                                                <div className="tbl-action-group">
                                                    <button
                                                        className="btn btn-xs btn-icon btn-transparent check-icon"
                                                    >
                                                        {" "}
                                                        <i className="th th-outline-tick-circle"></i>
                                                    </button>
                                                    <button className="btn btn-xs btn-icon btn-transparent" onClick={handleDeleteShow}>
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
                                                        id="tbl-checkbox1"
                                                        className="material-inputs filled-in"
                                                        />
                                                        <label htmlFor="tbl-checkbox1"></label>
                                                    </div>
                                                    <span>02.</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    Weekly Vocabulary Builder
                                                </td>
                                                <td>
                                                    Loream ipsum is simply dummy text
                                                </td>
                                                <td>13-03-2025 - 04:50 PM</td>
                                                <td className="tbl-action">
                                                <div className="tbl-action-group">
                                                    <button
                                                        className="btn btn-xs btn-icon btn-transparent check-icon"
                                                    >
                                                        {" "}
                                                        <i className="th th-outline-tick-circle"></i>
                                                    </button>
                                                    <button className="btn btn-xs btn-icon btn-transparent" onClick={handleDeleteShow}>
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
                                                        id="tbl-checkbox1"
                                                        className="material-inputs filled-in"
                                                        />
                                                        <label htmlFor="tbl-checkbox1"></label>
                                                    </div>
                                                    <span>03.</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    Current Affairs Research Task
                                                </td>
                                                <td>
                                                    Loream ipsum is simply dummy text
                                                </td>
                                                <td>26-03-2025 - 11:30 PM</td>
                                                <td className="tbl-action">
                                                <div className="tbl-action-group">
                                                    <button
                                                        className="btn btn-xs btn-icon btn-transparent check-icon"
                                                    >
                                                        {" "}
                                                        <i className="th th-outline-tick-circle"></i>
                                                    </button>
                                                    <button className="btn btn-xs btn-icon btn-transparent" onClick={handleDeleteShow}>
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
                        </div>
                        <div
                        className="tab-pane fade"
                        id="nav-complatetask"
                        role="tabpanel"
                        aria-labelledby="nav-complatetask-tab"
                        >
                        
                        </div>
                    </div>
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
                <h4 className="modal-title">Task Completed!</h4>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleSuccessDeleteClose}
                >
                  <i className="th th-close"></i>
                </button>
              </Modal.Header>
              <Modal.Body>
                <div className="modal-confirmation-container">
                  <div className="modal-confirmation-icon">
                    <i className="th th-bold-tick"></i>
                  </div>
                  <div className="modal-confirmation-content">
                    <h5>You have successfully completed  Task!</h5>
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
                            <i className='th th-close'></i>
                        </button>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="modal-confirmation-container">
                            <div className="modal-confirmation-icon">
                                <i className="th th-bold-tick-circle"></i>
                            </div>
                            <div className="modal-confirmation-content">
                                <h5>You have successfully
                                completed  Task!</h5>
                                <p>Get back to task page to add or complete the other task</p>
                            </div>
                        </div>
                        <div className="modal-button-group modal-full-width-btn">
                            <Button variant='outline-white' onClick={handleSuccessClose}> Cancel</Button>
                            <Button variant='primary' className='btn-icon-text' onClick={handleSuccessClose}>
                                <i className="th th-outline-tick-circle"></i> Done
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
