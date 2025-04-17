import React, { useEffect, useState } from 'react'
import { Badge, Button, Modal, OverlayTrigger, Table, Tooltip } from 'react-bootstrap'
import { isEmptyObjectOrNullUndefiend, isNullUndefinedOrBlank } from '../../../Utility/Helper';
import { Task } from '../../../interfaces/interface';
import notVoucherFound from "/assets/images/not-voucher-found.svg";
import { deleteTaskAPI } from '../../../redux/Service/task';
import { AppDispatch } from '../../../redux/store';
import { useDispatch } from 'react-redux';

const CompletTasks = (props) => {

    let dispatch: AppDispatch = useDispatch();

    // Compated Deleted modal
    const [SuccessDeleteShow, setSuccessDeleteShow] = useState(false);
    const handleSuccessDeleteClose = () => setSuccessDeleteShow(false);
    const handleSuccessDeleteShow = () => setSuccessDeleteShow(true);

    const [SuccessShow, setSuccessShow] = useState(false);
    const handleSuccessClose = () => setSuccessShow(false);
    const handleSuccessShow = () => setSuccessShow(true);


    const [taskList, setTaskList] = useState<Array<Task>>([]);

    useEffect(() => {
        if (!isEmptyObjectOrNullUndefiend(props?.taskData)) {
            setTaskList(props?.taskData)
            return () => {
                setTaskList([]);

            }
        }
    }, [props?.taskData]);



    /** -------------------Delete Task start-------------------------*/
    const [deleteShow, setDeleteShow] = useState(false);
    const handleDeleteClose = () => {
        setDeleteShow(false);
        setTimeout(() => {
            setDeleteTaskData([]);
            setDeleteSuccess(false);
        }, 300);
    }
    const handleDeleteShow = (data) => {
        setDeleteTaskData(data)
        setDeleteShow(true)
    }
    const [deleteTaskData, setDeleteTaskData] = useState<Array<Task>>([]);
    const [deleteSuccess, setDeleteSuccess] = useState<boolean>(false);

    const handleDeleteData = async () => {
        let param = deleteTaskData?.map((data) => data.id)
        const response = await dispatch(deleteTaskAPI({ task_id: param }));
        if (!isNullUndefinedOrBlank(response?.payload)) {
            setDeleteSuccess(true);
            props?.handleSetTaskData();

        }
    }

    /** -------------------Delete Task end-------------------------*/



    return (
        <>
            <div className="table-responsive">
                {!isEmptyObjectOrNullUndefiend(taskList) &&
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
                            {/* <tr>
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
                        </tr> */}
                            {
                                taskList?.map((taskItem, taskIndex) => {
                                    return (
                                        <tr key={taskIndex}>
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
                                                    <span>{taskIndex + 1}</span>
                                                </div>
                                            </td>
                                            <td>
                                                {taskItem?.task_name}
                                            </td>

                                            <td className="tbl-action">
                                                <div className="tbl-action-group">
                                                    {/* <button
                          className="btn btn-xs btn-icon btn-transparent check-icon"
                          onClick={() => { handleTaskCompleted([taskItem?.id]) }}
                        >
                          <i className="material-symbols-outlined">check_circle</i>
                        </button> */}
                                                    <button className="btn btn-xs btn-icon btn-transparent text-danger" onClick={() => { handleDeleteShow([...deleteTaskData, taskItem]) }}>
                                                        <i className="material-symbols-outlined">delete</i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })

                            }

                        </tbody>
                    </Table>}

                {isEmptyObjectOrNullUndefiend(taskList)
                    &&

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
            </div>
            {/* Delete Modal */}
            <Modal
                className="modal-theme modal-confirmation modal-reject"
                show={deleteShow}
                onHide={handleDeleteClose}
                centered
            >
                <Modal.Header>
                    <h4 className="modal-title">{deleteSuccess ? "Task Deleted!" : "Delete Task"}</h4>
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
                            <h5> {!deleteSuccess ? "Want to Delete?" : "You have successfully deleted Task!"}</h5>
                            <p>
                                {!deleteSuccess ?
                                    "Are you sure, you want to delete this task ?" :
                                    "Get back to task page to add or complete the other task"
                                }

                            </p>
                        </div>
                    </div>
                    <div className="modal-button-group modal-full-width-btn modal-footer-button">
                        {
                            !deleteSuccess &&
                            <Button
                                variant="light-white"
                                className="btn-md"
                                onClick={handleDeleteClose}
                            >
                                No, Change My Mind
                            </Button>
                        }
                        <Button
                            variant={!deleteSuccess ? "danger" : "success"}
                            className="btn-icon-text btn-md"
                            onClick={() => {
                                !deleteSuccess ? handleDeleteData() : handleDeleteClose()
                            }}
                        >
                            {!deleteSuccess ? "Delete" : "Ok"}
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

export default CompletTasks