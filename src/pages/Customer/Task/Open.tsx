import React, { useEffect, useState } from 'react'
import { Button, Modal, Table } from 'react-bootstrap'
import { Task } from '../../../interfaces/interface';
import { formatedDate, isEmptyObjectOrNullUndefiend, isNullUndefinedOrBlank } from '../../../Utility/Helper';
import { connect, useDispatch } from 'react-redux';
import { deleteTaskAPI, upadteTaskStatusAPI } from '../../../redux/Service/task';
import { AppDispatch } from '../../../redux/store';
import notVoucherFound from "/assets/images/not-voucher-found.svg";

const Open = (props) => {
    let dispatch: AppDispatch = useDispatch()


    /** ---------------------Task Listing Start-----------------------*/

    const [taskList, setTaskList] = useState<Array<Task>>([]);

    useEffect(() => {
        if (!isEmptyObjectOrNullUndefiend(props?.taskList)) {
            setTaskList(props?.taskList)
        }
        return () => {
            setTaskList([]);

        }
    }, [props?.taskList])
    /** ---------------------Task Listing End-----------------------*/


    /** -------------------Delete Task start-------------------------*/
    // Deleted modal
    const [deleteShow, setDeleteShow] = useState(false);
    const handleDeleteClose = () => {
        setDeleteShow(false)
        setDeleteTaskData([]);
        setDeleteSuccess(false);
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
            props?.getTaskListing();
        }
    }



    /** -------------------Delete Task end-------------------------*/


    /** -------------------Task complete Start-------------------------*/

    const [SuccessShow, setSuccessShow] = useState(false);
    const handleSuccessClose = () => setSuccessShow(false);
    const handleSuccessShow = () => setSuccessShow(true);

    const handleTaskCompleted = async (id) => {
        let response = await dispatch(upadteTaskStatusAPI({ id }));
        if (!isNullUndefinedOrBlank(response?.payload)) {
            props?.getTaskListing()
            handleSuccessShow();
        }
    }



    /** -------------------Task complete End-------------------------*/

    /** -------------------Task Update Start-------------------------*/
    const handleUpdateTask = (data: Task) => {
        props?.setSavedtaskFormData({
            task_id: data.id,
            due_date: new Date(formatedDate(data.due_date, "yyyy-MM-DD HH:mm:ss")),
            task_name: data.task_name,
            note: data.note,
            is_reminder: data.is_reminder,
            reminder: data.reminder
        }),
            props?.toggleShowAddNewCourse()
    }
    /** -------------------Task Update End-------------------------*/





    return (
        <>
            <div className="table-responsive mb-5">
                <Table className="table-theme">
                    <thead className="border-less">
                        <tr>
                            <th className="">
                                <div className="d-flex align-items-center gap-2">
                                    {/* <div className=" checkbox checkbox-primary checkbox-small">
                                        <input
                                            type="checkbox"
                                            id="tbl-checkbox"
                                            className="material-inputs filled-in"
                                        />
                                        <label htmlFor="tbl-checkbox"></label>
                                    </div> */}
                                    #
                                </div>
                            </th>
                            <th>Task Name</th>
                            <th>Note</th>
                            <th>Due Date</th>
                            <th>Last Update Date</th>
                            <th className="text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            !isEmptyObjectOrNullUndefiend(taskList) && taskList?.map((taskItem, taskIndex) => {
                                return (
                                    <tr key={taskIndex}>
                                        <td className="tbl-user tbl-srno">
                                            <div className="tbl-user-checkbox-srno">
                                                {/* <div className="checkbox checkbox-primary checkbox-small">
                                                    <input
                                                        type="checkbox"
                                                        id="tbl-checkbox1"
                                                        className="material-inputs filled-in"
                                                    />
                                                    <label htmlFor="tbl-checkbox1"></label>
                                                </div> */}
                                                <span>{taskIndex + 1}</span>
                                            </div>
                                        </td>
                                        <td>
                                            {taskItem?.task_name}
                                        </td>
                                        <td>
                                            {!isNullUndefinedOrBlank(taskItem?.note) ? taskItem?.note : "-"}
                                        </td>
                                        <td>{!isNullUndefinedOrBlank(taskItem?.due_date) ? formatedDate(taskItem?.due_date, "MM/DD/yyyy hh:mm A") : "-"}</td>

                                        <td>{!isNullUndefinedOrBlank(taskItem?.updated_at) ? formatedDate(taskItem?.updated_at, "MM/DD/yyyy hh:mm A") : "-"}</td>
                                        <td className="tbl-action">
                                            <div className="tbl-action-group">
                                                <button
                                                    className="btn btn-xs btn-icon btn-transparent check-icon"
                                                    onClick={() => { handleTaskCompleted([taskItem?.id]) }}
                                                >
                                                    <i className="material-symbols-outlined">check_circle</i>
                                                </button>
                                                <button className="btn btn-xs btn-icon btn-transparent" onClick={() => { handleUpdateTask(taskItem) }}>
                                                    <i className="material-symbols-outlined">Edit</i>
                                                </button>
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
                </Table>
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
                            <h5> {!deleteSuccess ? "Are You Sure?" : "You have successfully deleted Task!"}</h5>
                            <p>
                                {!deleteSuccess ?
                                    "You want to delete this task ?" :
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
                            <i className="material-symbols-outlined">check_circle</i>
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
const mapStateToProps = (state) => ({})

const mapDispatchToProps = {
    deleteTaskAPI,
    upadteTaskStatusAPI
}

export default connect(mapStateToProps, mapDispatchToProps)(Open)

