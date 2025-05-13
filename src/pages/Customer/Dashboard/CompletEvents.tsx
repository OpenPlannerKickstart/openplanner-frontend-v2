import React, { useEffect, useState } from 'react'
import { Badge, Button, Form, Modal, OverlayTrigger, Table, Tooltip } from 'react-bootstrap'
import DatePicker from "react-datepicker";
import { formatedDate, isEmptyObjectOrNullUndefiend, isNullUndefinedOrBlank } from '../../../Utility/Helper';
import notVoucherFound from "/assets/images/not-voucher-found.svg";
import { deleteEventAPI, upadteEventStatusAPI } from '../../../redux/Service/User/DashBoard/dashboard';
import { AppDispatch } from '../../../redux/store';
import { useDispatch } from 'react-redux';
import { ENUMFORSTATUS } from '../../../interfaces/enum';

const CompletEvents = (props) => {
    let dispatch: AppDispatch = useDispatch();





    const [eventData, setEventData] = useState<any>([])
    useEffect(() => {
        if (!isEmptyObjectOrNullUndefiend(props?.eventData)) {
            setEventData(props?.eventData)
        } else {
            setEventData([])
        }

    }, [props.eventData]);



    /** -------------------Delete event start-------------------------*/
    const [deleteShow, setDeleteShow] = useState(false);
    const handleDeleteClose = () => {
        setDeleteShow(false);
        setTimeout(() => {
            setdeleteEventData([]);
            setDeleteSuccess(false);
        }, 300);
    }
    const handleDeleteShow = (data) => {
        setdeleteEventData(data)
        setDeleteShow(true)
    }
    const [deleteEventData, setdeleteEventData] = useState<Array<any>>([]);
    const [deleteSuccess, setDeleteSuccess] = useState<boolean>(false);

    const handleDeleteData = async () => {
        let param = deleteEventData?.map((data) => data.id)
        const response = await dispatch(deleteEventAPI({ event_id: param }));
        if (!isNullUndefinedOrBlank(response?.payload)) {
            setDeleteSuccess(true);
            props?.handleEventListing();

        }
    }

    /** -------------------Delete Event end-------------------------*/

    /** -------------------Event Pending Start-------------------------*/

    const [SuccessShow, setSuccessShow] = useState(false);
    const handleSuccessClose = () => setSuccessShow(false);
    const handleSuccessShow = () => setSuccessShow(true);

    const handleEventPending = async (id, status) => {
        status = (status === ENUMFORSTATUS.COMPLETED) ? ENUMFORSTATUS.PENDING : ENUMFORSTATUS.COMPLETED
        let response = await dispatch(upadteEventStatusAPI({ event_id: id, status }));
        if (!isNullUndefinedOrBlank(response?.payload)) {
            props?.handleEventListing();
            props?.getDashboardCount();
            props?.handleEventChartData();
            handleSuccessShow();
        }
    }



    /** -------------------Event complete End-------------------------*/

    return (
        <>

            <div className="table-responsive">
                {!isEmptyObjectOrNullUndefiend(eventData) &&
                    <Table className="table-theme">
                        <thead >
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
                                <th>Title Name</th>
                                <th>Course Name</th>
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
                                                <div className="tbl-user-checkbox-srno">
                                                    {/* <div className="checkbox checkbox-primary checkbox-small">
                                                        <input
                                                            type="checkbox"
                                                            id="tbl-checkbox1"
                                                            className="material-inputs filled-in"
                                                        />
                                                        <label htmlFor="tbl-checkbox1"></label>
                                                    </div> */}
                                                    <span>{index + 1}.</span>
                                                </div>
                                            </td>
                                            <td className='tbl-title'>
                                                {!isNullUndefinedOrBlank(item.title) ? item.title : ""}
                                            </td>
                                            <td>
                                                <Badge className='course_badge' title={!isNullUndefinedOrBlank(item.course_name) ? item.course_name : "-"} bg="" style={{ backgroundColor: item.course_color ? `rgba(${parseInt(item.course_color.slice(1, 3), 16)}, ${parseInt(item.course_color.slice(3, 5), 16)}, ${parseInt(item.course_color.slice(5, 7), 16)}, 0.2)` : 'rgba(0, 0, 0, 0.2)', color: item.course_color ? `rgba(${parseInt(item.course_color.slice(1, 3), 16)}, ${parseInt(item.course_color.slice(3, 5), 16)}, ${parseInt(item.course_color.slice(5, 7), 16)})` : 'rgba(0, 0, 0, 0.2)' }}><i className="material-symbols-outlined" style={{ color: item.course_color ? `rgba(${parseInt(item.course_color.slice(1, 3), 16)}, ${parseInt(item.course_color.slice(3, 5), 16)}, ${parseInt(item.course_color.slice(5, 7), 16)})` : 'rgba(0, 0, 0, 0.2)' }}>book_2</i><span>{!isNullUndefinedOrBlank(item.course_name) ? item.course_name : "-"}</span></Badge>
                                            </td>
                                            <td onClick={() => { props.handleShowShowNote(item.note) }}>
                                                <a >View Notes</a>
                                            </td>
                                            <td>{!isNullUndefinedOrBlank(item.start_date) ? formatedDate(item?.start_date, "MM/DD/yyyy hh:mm A") : "-"}</td>
                                            <td>{!isNullUndefinedOrBlank(item.end_date) ? formatedDate(item?.end_date, "MM/DD/yyyy hh:mm A") : "-"}</td>
                                            <td className="tbl-action">
                                                <div className="tbl-action-group">
                                                    <OverlayTrigger
                                                        trigger={["hover", "hover"]}
                                                        placement="bottom"
                                                        overlay={<Tooltip>Pending Event</Tooltip>}
                                                    >
                                                        <button
                                                            className="btn btn-xs btn-icon btn-transparent check-icon" onClick={() => { handleEventPending([item.id], item.status) }}
                                                        >
                                                            {" "}
                                                            <i className="material-symbols-outlined">unpublished</i>
                                                        </button>
                                                    </OverlayTrigger>
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
            </div >

            {/* Delete Modal */}
            < Modal
                className="modal-theme modal-confirmation modal-reject"
                show={deleteShow}
                onHide={handleDeleteClose}
                centered
            >
                <Modal.Header>
                    <h4 className="modal-title">{deleteSuccess ? "Event Deleted!" : "Delete Event"}</h4>
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
                            <h5> {!deleteSuccess ? "Are You Sure?" : "You have successfully deleted Event!"}</h5>
                            <p>
                                {!deleteSuccess ?
                                    "You want to delete this event ?" :
                                    "Get back to task page to add or complete the other event"
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
            </Modal >
            {/* Delete Modal */}


            {/* Success Modal */}
            <Modal className='modal-theme modal-confirmation modal-approve' show={SuccessShow} onHide={handleSuccessClose} centered>
                <Modal.Header>
                    <h4 className="modal-title">Event Pending!</h4>
                    <button type="button" className="btn-close" onClick={handleSuccessClose}>
                        <i className="material-symbols-outlined">close</i>
                    </button>
                </Modal.Header>
                <Modal.Body>
                    <div className="modal-confirmation-container">
                        <div className="modal-confirmation-icon">
                            <i className="material-symbols-outlined">schedule</i>
                        </div>
                        <div className="modal-confirmation-content">
                            <h5>The event is now marked as pending!</h5>
                            <p>You can resume this event whenever you are ready.</p>
                        </div>
                    </div>
                    <div className="modal-button-group modal-full-width-btn modal-footer-button">
                        <Button variant="warning" className="btn-icon-text btn-md" onClick={handleSuccessClose}>Ok</Button>
                    </div>
                </Modal.Body>
            </Modal>
            {/* Success Modal */}

        </>
    )
}

export default CompletEvents