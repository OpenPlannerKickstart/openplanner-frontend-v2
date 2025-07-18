import React, { useEffect, useState } from 'react'
import { Badge, Button, Form, Modal, OverlayTrigger, Table, Tooltip } from 'react-bootstrap'
import DatePicker from "react-datepicker";
import { formatedDate, isEmptyObjectOrNullUndefiend, isNullUndefinedOrBlank } from '../../../Utility/Helper';
import notVoucherFound from "/assets/images/not-voucher-found.svg";
import { deleteEventAPI, upadteEventStatusAPI } from '../../../redux/Service/User/DashBoard/dashboard';
import { AppDispatch } from '../../../redux/store';
import { useDispatch } from 'react-redux';
import { ENUMFORSTATUS } from '../../../interfaces/enum';

const PendingEvents = (props) => {
    let dispatch: AppDispatch = useDispatch();

    // Compated Deleted modal
    const [PendingDeleteShow, setPendingDeleteShow] = useState(false);
    const handlePendingDeleteClose = () => setPendingDeleteShow(false);
    const handlePendingDeleteShow = () => setPendingDeleteShow(true);


    const [eventData, setEventData] = useState<any>([])
    useEffect(() => {
        if (!isNullUndefinedOrBlank(props?.eventData)) {
            setEventData(props?.eventData)
        } else {
            setEventData([])
        }
    }, [props.eventData])

    /** -------------------Delete event start-------------------------*/
    const [deleteShow, setDeleteShow] = useState(false);
    const handleDeleteClose = () => {
        setDeleteShow(false);
        setTimeout(() => {
            setdeleteEventData([]);

        }, 300);
    }
    const handleDeleteShow = (data) => {
        setdeleteEventData(data)
        setDeleteShow(true)
    }
    const [deleteEventData, setdeleteEventData] = useState<Array<any>>([]);


    const handleDeleteData = async () => {
        let param = deleteEventData?.map((data) => data.id)
        const response = await dispatch(deleteEventAPI({ event_id: param }));
        if (!isNullUndefinedOrBlank(response?.payload)) {

            props?.handleEventListing();
            handleDeleteClose();

        }
    }

    /** -------------------Delete Event end-------------------------*/


    /** -------------------Event complete Start-------------------------*/

    const [SuccessShow, setSuccessShow] = useState(false);
    const handleSuccessClose = () => setSuccessShow(false);
    const handleSuccessShow = () => setSuccessShow(true);

    const handleEventCompleted = async (id, status) => {
        status = (status === ENUMFORSTATUS.COMPLETED) ? ENUMFORSTATUS.PENDING : ENUMFORSTATUS.COMPLETED
        let response = await dispatch(upadteEventStatusAPI({ event_id: id, status }));
        if (!isNullUndefinedOrBlank(response?.payload)) {
            props?.handleEventListing();
            props?.getDashboardCount();
            props?.handleEventChartData();
            // handleSuccessShow();
        }
    }



    /** -------------------Event complete End-------------------------*/

    return (
        <>
            {/* <div className="tab-top-filter">
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
            </div> */}
            <div className="table-responsive">
                {
                    !isEmptyObjectOrNullUndefiend(eventData) &&
                    <Table className="table-theme">
                        <thead>
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
                                        Action
                                    </div>
                                </th>
                                <th>Title Name</th>
                                <th>Course Name</th>
                                <th>Priority</th>
                                <th>Notes</th>
                                <th>Start Date</th>
                                <th>Due Date</th>
                                <th className="text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>

                            {
                                eventData?.map((item, index) => {
                                    return (

                                        <tr key={index}>
                                            <td className="tbl-user tbl-srno">
                                                <div className="tbl-action-group">
                                                    <OverlayTrigger
                                                        trigger={["hover", "hover"]}
                                                        placement="bottom"
                                                        overlay={<Tooltip>Complete</Tooltip>}
                                                    >
                                                        <button
                                                            className="btn btn-xs btn-icon btn-transparent check-icon" onClick={() => { handleEventCompleted([item.id], item?.status) }}
                                                        >
                                                            {" "}
                                                            <i className="material-symbols-outlined">check_circle</i>
                                                        </button>
                                                    </OverlayTrigger>

                                                </div>
                                            </td>
                                            <td className='tbl-title cursor-pointer'
                                                onClick={() => {
                                                    props.handleSelectEvent(item)
                                                }}
                                            >
                                                {!isNullUndefinedOrBlank(item.title) ? item.title : ""}
                                            </td>
                                            <td>
                                                <Badge className='course_badge' bg="" title={!isNullUndefinedOrBlank(item.course_name) ? item.course_name : "-"} style={{ backgroundColor: item.course_color ? `rgba(${parseInt(item.course_color.slice(1, 3), 16)}, ${parseInt(item.course_color.slice(3, 5), 16)}, ${parseInt(item.course_color.slice(5, 7), 16)}, 0.2)` : 'rgba(0, 0, 0, 0.2)', color: item.course_color ? `rgba(${parseInt(item.course_color.slice(1, 3), 16)}, ${parseInt(item.course_color.slice(3, 5), 16)}, ${parseInt(item.course_color.slice(5, 7), 16)})` : 'rgba(0, 0, 0, 0.2)' }}><i className="material-symbols-outlined" style={{ color: item.course_color ? `rgba(${parseInt(item.course_color.slice(1, 3), 16)}, ${parseInt(item.course_color.slice(3, 5), 16)}, ${parseInt(item.course_color.slice(5, 7), 16)})` : 'rgba(0, 0, 0, 0.2)' }}>book_2</i>
                                                    <span>{!isNullUndefinedOrBlank(item.course_name) ? item.course_name : "-"}</span></Badge>
                                            </td>
                                            <td>
                                                {!isNullUndefinedOrBlank(item?.priority) ? item?.priority : ""}
                                            </td>
                                            <td onClick={() => { props.handleShowShowNote(item.note) }}>
                                                <a >View Notes</a>
                                            </td>
                                            <td>{!isNullUndefinedOrBlank(item.start_date) ? formatedDate(item?.start_date, "MM/DD/yyyy hh:mm A") : "-"}</td>

                                            <td>{!isNullUndefinedOrBlank(item.end_date) ? formatedDate(item?.end_date, "MM/DD/yyyy hh:mm A") : "-"}</td>
                                            <td className="tbl-action">
                                                <div className="tbl-action-group">
                                                    {/* <OverlayTrigger
                                                        trigger={["hover", "hover"]}
                                                        placement="bottom"
                                                        overlay={<Tooltip>Complete</Tooltip>}
                                                    >
                                                        <button
                                                            className="btn btn-xs btn-icon btn-transparent check-icon" onClick={() => { handleEventCompleted([item.id], item?.status) }}
                                                        >
                                                            {" "}
                                                            <i className="material-symbols-outlined">check_circle</i>
                                                        </button>
                                                    </OverlayTrigger> */}
                                                    <OverlayTrigger
                                                        trigger={["hover", "hover"]}
                                                        placement="bottom"
                                                        overlay={<Tooltip>Delete</Tooltip>}
                                                    >
                                                        <button className="btn btn-xs btn-icon btn-transparent text-danger" onClick={() => { handleDeleteShow([...deleteEventData, item]) }}>
                                                            {" "}
                                                            <i className="material-symbols-outlined">delete</i>
                                                        </button>
                                                    </OverlayTrigger>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })
                            }


                        </tbody>
                    </Table>
                }
                {isEmptyObjectOrNullUndefiend(eventData)
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
                            <h5>Are you sure?</h5>
                            <p>
                                You want to delete this task ?
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
                show={PendingDeleteShow}
                onHide={handlePendingDeleteClose}
                centered
            >
                <Modal.Header>
                    <h4 className="modal-title">Task Deleted!</h4>
                    <button
                        type="button"
                        className="btn-close"
                        onClick={handlePendingDeleteClose}
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
                                Get back to My Week page to complete the other task
                            </p>
                        </div>
                    </div>
                    <div className="modal-button-group modal-full-width-btn modal-footer-button">
                        <Button
                            variant="success"
                            className="btn-icon-text btn-md"
                            onClick={handlePendingDeleteClose}
                        >
                            Done
                        </Button>
                    </div>
                </Modal.Body>
            </Modal>
            {/* Delete Modal */}

            {/* Delete Modal */}
            <Modal
                className="modal-theme modal-confirmation modal-reject"
                show={deleteShow}
                onHide={handleDeleteClose}
                centered
            >
                <Modal.Header>
                    <h4 className="modal-title"> Delete Event</h4>
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
                            <h5> Are You Sure?</h5>
                            <p>

                                You want to delete this event ?

                            </p>
                        </div>
                    </div>
                    <div className="modal-button-group modal-full-width-btn modal-footer-button">
                        {

                            <Button
                                variant="light-white"
                                className="btn-md"
                                onClick={handleDeleteClose}
                            >
                                No, Change My Mind
                            </Button>
                        }
                        <Button
                            variant="danger"
                            className="btn-icon-text btn-md"
                            onClick={() => {
                                handleDeleteData()
                            }}
                        >
                            Delete
                        </Button>
                    </div>
                </Modal.Body>
            </Modal>
            {/* Delete Modal */}

            {/* Success Modal */}
            <Modal className='modal-theme modal-confirmation modal-approve' show={SuccessShow} onHide={handleSuccessClose} centered>
                <Modal.Header >
                    <h4 className="modal-title">Event Completed!</h4>
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
                                completed  Event!</h5>
                            <p>Get back to My Week page to complete the other Event</p>
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