import React, { useState } from 'react'
import { Badge, Button, Form, Modal, OverlayTrigger, Table, Tooltip } from 'react-bootstrap'
import DatePicker from "react-datepicker";

const PendingEvents = () => {
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
        <div className="tab-top-filter">
             <div className="button-group">
             <Form.Group className="form-group form-group-sm form-group-inline-control">
                <div className="form-control-wrapper">
                    <div className="form-group-icon-start">
                    <i className="material-symbols-outlined">search</i>
                    <Form.Control type="text" placeholder="Search by name" />
                    </div>
                </div>
            </Form.Group>
             <Form.Group className="form-group form-group-sm " controlId="exampleForm.ControlInput1">
                <Form.Select aria-label="Default select example">
                    <option>Course Name</option>
                    <option value="1">Course Name1</option>
                    <option value="2">Course Name2</option>
                    <option value="3">Course Name3</option>
                </Form.Select>
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
        <div className="table-responsive">
            <Table className="table-theme">
                <thead>
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
                    <th>Title Name</th>
                    <th>Course Name</th>
                    <th>Notes</th>
                    <th>Due Date</th>
                    <th className="text-center">Action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="tbl-user tbl-srno">
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
                        <Badge bg="danger-bg"><i className="material-symbols-outlined">book_2</i>TCU Academic Calendar</Badge>
                        </td>
                        <td>
                            <a >View Notes</a>
                        </td>
                        <td>13-03-2025 - 04:50 PM</td>
                        <td className="tbl-action">
                            <div className="tbl-action-group">
                                <OverlayTrigger
                                    trigger={["hover", "hover"]}
                                    placement="bottom"
                                    overlay={<Tooltip>Add User</Tooltip>}
                                >
                                    <button
                                        className="btn btn-xs btn-icon btn-transparent check-icon" onClick={handleSuccessShow}
                                    >
                                        {" "}
                                        <i className="material-symbols-outlined">check_circle</i>
                                    </button>
                                </OverlayTrigger>
                                <OverlayTrigger
                                    trigger={["hover", "hover"]}
                                    placement="bottom"
                                    overlay={<Tooltip>Add User</Tooltip>}
                                >
                                    <button className="btn btn-xs btn-icon btn-transparent text-danger" onClick={handleDeleteShow}>
                                    {" "}
                                        <i className="material-symbols-outlined">delete</i>
                                    </button>
                                </OverlayTrigger>                             
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td className="tbl-user tbl-srno">
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
                        <td>
                            Weekly Vocabulary Builder
                        </td>
                        <td>
                           <Badge bg="primary-bg"><i className="material-symbols-outlined">book_2</i>History Unfolded</Badge>
                        </td>
                        <td>
                            <a >View Notes</a>
                        </td>
                        <td>13-03-2025 - 04:50 PM</td>
                        <td className="tbl-action">
                            <div className="tbl-action-group">
                                <OverlayTrigger
                                    trigger={["hover", "hover"]}
                                    placement="bottom"
                                    overlay={<Tooltip>Add User</Tooltip>}
                                >
                                    <button
                                        className="btn btn-xs btn-icon btn-transparent check-icon" onClick={handleSuccessShow}
                                    >
                                        {" "}
                                        <i className="material-symbols-outlined">check_circle</i>
                                    </button>
                                </OverlayTrigger>
                                <OverlayTrigger
                                    trigger={["hover", "hover"]}
                                    placement="bottom"
                                    overlay={<Tooltip>Add User</Tooltip>}
                                >
                                    <button className="btn btn-xs btn-icon btn-transparent text-danger" onClick={handleDeleteShow}>
                                    {" "}
                                        <i className="material-symbols-outlined">delete</i>
                                    </button>
                                </OverlayTrigger>                             
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td className="tbl-user tbl-srno">
                            <div className="tbl-user-checkbox-srno">
                            <div className="checkbox checkbox-primary checkbox-small">
                                <input
                                type="checkbox"
                                id="tbl-checkbox3"
                                className="material-inputs filled-in"
                                />
                                <label htmlFor="tbl-checkbox3"></label>
                            </div>
                            <span>03.</span>
                            </div>
                        </td>
                        <td>
                            Current Affairs Research Task
                        </td>
                        <td>
                            <Badge bg="success-bg"><i className="material-symbols-outlined">book_2</i>World Geography & Global Affairs</Badge>
                        </td>
                        <td>
                            <a >View Notes</a>
                        </td>
                        <td>26-03-2025 - 11:30 PM</td>
                        <td className="tbl-action">
                            <div className="tbl-action-group">
                                <OverlayTrigger
                                    trigger={["hover", "hover"]}
                                    placement="bottom"
                                    overlay={<Tooltip>Add User</Tooltip>}
                                >
                                    <button
                                        className="btn btn-xs btn-icon btn-transparent check-icon" onClick={handleSuccessShow}
                                    >
                                        {" "}
                                        <i className="material-symbols-outlined">check_circle</i>
                                    </button>
                                </OverlayTrigger>
                                <OverlayTrigger
                                    trigger={["hover", "hover"]}
                                    placement="bottom"
                                    overlay={<Tooltip>Add User</Tooltip>}
                                >
                                    <button className="btn btn-xs btn-icon btn-transparent text-danger" onClick={handleDeleteShow}>
                                    {" "}
                                        <i className="material-symbols-outlined">delete</i>
                                    </button>
                                </OverlayTrigger>                             
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td className="tbl-user tbl-srno">
                            <div className="tbl-user-checkbox-srno">
                            <div className="checkbox checkbox-primary checkbox-small">
                                <input
                                type="checkbox"
                                id="tbl-checkbox4"
                                className="material-inputs filled-in"
                                />
                                <label htmlFor="tbl-checkbox4"></label>
                            </div>
                            <span>04.</span>
                            </div>
                        </td>
                        <td>
                        The Impact of Socioeconomic Factors on Educational Outcomes
                        </td>
                        <td>
                            <Badge bg="light-grey"><i className="material-symbols-outlined">book_2</i>History Unfolded</Badge>
                        </td>
                        <td>
                            <a >View Notes</a>
                        </td>
                        <td>26-03-2025 - 11:30 PM</td>
                        <td className="tbl-action">
                            <div className="tbl-action-group">
                                <OverlayTrigger
                                    trigger={["hover", "hover"]}
                                    placement="bottom"
                                    overlay={<Tooltip>Add User</Tooltip>}
                                >
                                    <button
                                        className="btn btn-xs btn-icon btn-transparent check-icon" onClick={handleSuccessShow}
                                    >
                                        {" "}
                                        <i className="material-symbols-outlined">check_circle</i>
                                    </button>
                                </OverlayTrigger>
                                <OverlayTrigger
                                    trigger={["hover", "hover"]}
                                    placement="bottom"
                                    overlay={<Tooltip>Add User</Tooltip>}
                                >
                                    <button className="btn btn-xs btn-icon btn-transparent text-danger" onClick={handleDeleteShow}>
                                    {" "}
                                        <i className="material-symbols-outlined">delete</i>
                                    </button>
                                </OverlayTrigger>                             
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td className="tbl-user tbl-srno">
                            <div className="tbl-user-checkbox-srno">
                            <div className="checkbox checkbox-primary checkbox-small">
                                <input
                                type="checkbox"
                                id="tbl-checkbox5"
                                className="material-inputs filled-in"
                                />
                                <label htmlFor="tbl-checkbox5"></label>
                            </div>
                            <span>05.</span>
                            </div>
                        </td>
                        <td>
                        STEM Education: Preparing Students for the Future Workforce
                        </td>
                        <td>
                            <Badge bg="danger-bg"><i className="material-symbols-outlined">book_2</i>TCU Academic Calendar</Badge>
                        </td>
                        <td>
                            <a >View Notes</a>
                        </td>
                        <td>28-03-2025 - 07:00 AM</td>
                        <td className="tbl-action">
                            <div className="tbl-action-group">
                                <OverlayTrigger
                                    trigger={["hover", "hover"]}
                                    placement="bottom"
                                    overlay={<Tooltip>Add User</Tooltip>}
                                >
                                    <button
                                        className="btn btn-xs btn-icon btn-transparent check-icon" onClick={handleSuccessShow}
                                    >
                                        {" "}
                                        <i className="material-symbols-outlined">check_circle</i>
                                    </button>
                                </OverlayTrigger>
                                <OverlayTrigger
                                    trigger={["hover", "hover"]}
                                    placement="bottom"
                                    overlay={<Tooltip>Add User</Tooltip>}
                                >
                                    <button className="btn btn-xs btn-icon btn-transparent text-danger" onClick={handleDeleteShow}>
                                    {" "}
                                        <i className="material-symbols-outlined">delete</i>
                                    </button>
                                </OverlayTrigger>                             
                            </div>
                        </td>
                    </tr>
                    
                </tbody>
            </Table>
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
                <i className="material-symbols-outlined">close</i>
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
                <i className="material-symbols-outlined">close</i>
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
                <i className="material-symbols-outlined">close</i>
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
    </>
  )
}

export default PendingEvents