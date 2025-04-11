import React, { useState } from 'react'
import { Badge, Button, Modal, OverlayTrigger, Table, Tooltip } from 'react-bootstrap'

const PendingTasks = () => {

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
                    <th>Task Name</th>                    
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
                           Assignment Submission Tracking
                        </td>                        
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
                        Grade Calculation and Report Generation
                        </td>                        
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
                        Homework Review and Feedback
                        </td>                        
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

export default PendingTasks