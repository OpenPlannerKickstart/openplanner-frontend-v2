import React, { useEffect, useState } from 'react'
import { Badge, Button, Collapse, Modal, OverlayTrigger, Table, Tooltip } from 'react-bootstrap'
import { connect, useDispatch } from 'react-redux'
import { AppDispatch } from '../../../redux/store'
import { deleteEventDataAPI, getEventListDataAPI, updateEventStatusDataAPI } from '../../../redux/Service/User/Courses/courses'
import { ENUM_FOR_SYLLABUS_TAB, ENUMFORSTATUS } from '../../../interfaces/enum'
import { EventResponseType } from '../../../interfaces/interface'
import { formatedDate, getDate, isEmptyObjectOrNullUndefiend, isNullUndefinedOrBlank, NO_RECORD_FOUND_MSG } from '../../../Utility/Helper'
import { NO_END_DATE_ADDED, NO_START_DATE_ADDED } from '../../../Utility/Validation_Message'
import notVoucherFound from "/assets/images/not-voucher-found.svg";
import { isUpdatedEvent } from '../../../redux/User/Courses/coursesSlice'

const Events = (props) => {
  const dispatch: AppDispatch = useDispatch();
  const [open, setOpen] = useState(false);

  // Deleted modal


  // Compated Deleted modal



  /* ------------------ handle Get Event List Data API Start ------------------ */
  const [eventListData, setEventListData] = useState<EventResponseType>({} as EventResponseType);
  useEffect(() => {
    if (props?.selectedSyllabusObj?.id && props?.selectedTab === ENUM_FOR_SYLLABUS_TAB.EVENT_DETAILS) {
      getEventListData();
    }

    return () => {
      setTimeout(() => {
        setEventListData({} as EventResponseType);
      }, 200);
    }
  }, [props?.selectedSyllabusObj?.id, props?.selectedTab])

  const getEventListData = async () => {

    const reqBody = {
      syllabus_id: props?.selectedSyllabusObj?.id
    }
    const response = await dispatch(getEventListDataAPI(reqBody));
    if (response) {
      setEventListData(response?.payload);
    }

  }


  /* ------------------ handle Get Event List Data API End ------------------ */
  /** -------------------Delete event start-------------------------*/
  const [deleteShow, setDeleteShow] = useState(false);
  const [selectedEventObj, setSelectedEventObj] = useState<any>(null);

  const handleDeleteClose = () => {
    setDeleteShow(false);
    setTimeout(() => {
      setSelectedEventObj(null);
    }, 300);
  }
  const handleDeleteShow = (data) => {
    setDeleteShow(true)
    setSelectedEventObj(data);
  }



  const handleDeleteData = async (eventId) => {
    let event_id: any = [];
    if (eventId instanceof Array) {
      event_id = eventId;
    }
    else {
      event_id = [eventId];
    }
    const reqBody = {
      event_id: event_id,
    }

    const response = await dispatch(deleteEventDataAPI(reqBody));
    if (!isNullUndefinedOrBlank(response?.payload)) {
      getEventListData();
      handleDeleteClose();
    }
  }

  /** -------------------Delete Event end-------------------------*/


  /** -------------------Event complete Start-------------------------*/

  const [successShow, setSuccessShow] = useState(false);
  const handleSuccessClose = () => { setSuccessShow(false); setEventStatus(null) }
  const handleSuccessShow = () => setSuccessShow(true);
  const [eventStatus, setEventStatus] = useState(null)

  const handleEventCompleted = async (id, status) => {
    // console.log("handleEventCompleted", id, status)
    let event_id: any = [];
    if (id instanceof Array) {
      event_id = id;
    }
    else {
      event_id = [id];
    }
    const reqBody = {
      event_id: event_id,
      status: status === ENUMFORSTATUS.COMPLETED ? ENUMFORSTATUS.PENDING : ENUMFORSTATUS.COMPLETED,
    }
    let response = await dispatch(updateEventStatusDataAPI(reqBody));
    if (!isNullUndefinedOrBlank(response?.payload)) {
      getEventListData();
      await dispatch(isUpdatedEvent(true));
      setEventStatus(status);
      // handleSuccessShow();
    }
  }



  /** -------------------Event complete End-------------------------*/

  useEffect(() => {
    if (!isEmptyObjectOrNullUndefiend(props?.eventData)) {
      setEventListData(props?.eventData)
    } else {
      setEventListData({} as EventResponseType);
    }
  }, [props?.eventData])

  const getPriorityColour = (priority) => {
    const priorityLower = priority.toLowerCase();
    const priorityMap = {
      high: 'priority-high',
      medium: 'priority-medium',
      low: 'priority-low',
    };

    return priorityMap[priorityLower] || '';
  };

  return (
    <>
      <div className="tab-body-container">
        <div className="event-main-wrapper">
          {!isEmptyObjectOrNullUndefiend(eventListData?.dueEventData) || !isEmptyObjectOrNullUndefiend(eventListData?.pastEventData) ?
            <>

              {
                eventListData?.dueEventData ? eventListData?.dueEventData?.map((parentItem, index) => {
                  return (

                    <div className="event-card">
                      <div className="due-event-box">
                        <div className="card-title">
                          <h4>Due on {formatedDate(parentItem?.due_date, 'DD, MMMM YYYY')}</h4>
                        </div>
                        <div className="card-body">
                          <div className="table-responsive">
                            <Table className="table-theme">
                              <thead className="border-less">
                                <tr>
                                  <th>Event Name</th>
                                  <th>Priority</th>
                                  <th>Start Time</th>
                                  <th>End Time</th>
                                  <th className="text-center">Actions</th>
                                </tr>
                              </thead>
                              <tbody>

                                {
                                  parentItem?.eventData?.map((childItem, index) => {
                                    return (
                                      <tr className={`${childItem?.status === "Completed" ? "selected" : ""}`} key={index}>
                                        <td>
                                          <div className="event-name-tooltip">
                                            <div className="enevt-name cursor-pointer" onClick={() => { props.handleSelectEvent(childItem) }} style={{ textDecoration: childItem?.status == ENUMFORSTATUS.COMPLETED ? 'line-through' : "none" }}><h3>{childItem?.title || ""}</h3></div>
                                            <div className="event-tool">
                                              <Badge className='course_badge' title={!isNullUndefinedOrBlank(childItem.syllabus?.title) ? childItem.syllabus?.title : "-"} bg="" style={{ backgroundColor: childItem.syllabus?.course_color ? `rgba(${parseInt(childItem.syllabus?.course_color?.slice(1, 3), 16)}, ${parseInt(childItem.syllabus?.course_color?.slice(3, 5), 16)}, ${parseInt(childItem.syllabus?.course_color.slice(5, 7), 16)}, 0.2)` : 'rgba(0, 0, 0, 0.2)', color: childItem.syllabus?.course_color ? `rgba(${parseInt(childItem.syllabus?.course_color.slice(1, 3), 16)}, ${parseInt(childItem.syllabus?.course_color.slice(3, 5), 16)}, ${parseInt(childItem.syllabus?.course_color.slice(5, 7), 16)})` : 'rgba(0, 0, 0, 0.2)' }}>
                                                <i className="material-symbols-outlined" style={{ color: childItem.syllabus?.course_color ? `rgba(${parseInt(childItem.syllabus?.course_color.slice(1, 3), 16)}, ${parseInt(childItem.syllabus?.course_color.slice(3, 5), 16)}, ${parseInt(childItem.syllabus?.course_color.slice(5, 7), 16)})` : 'rgba(0, 0, 0, 0.2)' }}>book_2</i>
                                                <span>{!isNullUndefinedOrBlank(childItem.syllabus?.title) ? childItem.syllabus?.title : "-"}</span>
                                              </Badge>

                                              {/* <Badge style={{ backgroundColor: `${childItem?.syllabus?.course_color || "#239bc266"}`, opacity: 0.4 }}><i className="material-symbols-outlined">book_2</i>{childItem?.syllabus?.title || ""}</Badge> */}
                                            </div>
                                          </div>
                                        </td>
                                        <td className={`${getPriorityColour(childItem?.priority)}`}>
                                          {!isNullUndefinedOrBlank(childItem?.priority) ? childItem?.priority : ""}
                                        </td>
                                        <td>{!isNullUndefinedOrBlank(childItem?.start_date) ? formatedDate(childItem?.start_date, "hh:mm a") : NO_START_DATE_ADDED}</td>
                                        <td>{!isNullUndefinedOrBlank(childItem?.end_date) ? formatedDate(childItem?.end_date, "hh:mm a") : NO_END_DATE_ADDED}</td>
                                        <td className="tbl-action">
                                          <div className="tbl-action-group">


                                            {
                                              childItem?.status === "Completed" ?

                                                <OverlayTrigger
                                                  trigger={["hover", "hover"]}
                                                  placement="bottom"
                                                  overlay={<Tooltip>Pending</Tooltip>}
                                                >
                                                  <button
                                                    className="btn btn-xs btn-icon btn-transparent check-icon"
                                                    onClick={() => {
                                                      // console.log("childItem?.status", childItem?.status)
                                                      handleEventCompleted(childItem?.id, childItem?.status)
                                                    }}
                                                  >

                                                    <i className="material-symbols-outlined">unpublished</i>
                                                  </button>
                                                </OverlayTrigger> :
                                                <OverlayTrigger
                                                  trigger={["hover", "hover"]}
                                                  placement="bottom"
                                                  overlay={<Tooltip>Complete</Tooltip>}
                                                >
                                                  <button className="btn btn-xs btn-icon btn-transparent check-icon" onClick={() => {

                                                    handleEventCompleted(childItem?.id, childItem?.status)
                                                  }}
                                                  >
                                                    <i className="material-symbols-outlined">check_circle</i>
                                                  </button>
                                                </OverlayTrigger>

                                            }

                                            <OverlayTrigger
                                              trigger={["hover", "hover"]}
                                              placement="bottom"
                                              overlay={<Tooltip>Delete</Tooltip>}
                                            >
                                              <button className="btn btn-xs btn-icon btn-transparent text-danger" onClick={() => handleDeleteShow(childItem)}>

                                                <i className="material-symbols-outlined">delete</i>
                                              </button>
                                            </OverlayTrigger>
                                          </div>
                                        </td>
                                      </tr>
                                    )
                                  })}


                              </tbody>
                            </Table>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                }) : <>


                </>
              }

              {
                !isEmptyObjectOrNullUndefiend(eventListData?.pastEventData) ?
                  <>
                    <div className="event-card">
                      <div className="due-event-box post-event">
                        <div className="card-title">
                          <Button className='event-collapes-btn'
                            onClick={() => setOpen(!open)}
                            aria-controls="example-collapse-text"
                            aria-expanded={open}
                          >
                            Past Events
                            <button className="btn btn-xs btn-icon btn-transparent collapes-btn"><i className="material-symbols-outlined">keyboard_arrow_right</i></button>
                          </Button>
                        </div>
                        <div className="card-body">
                          <Collapse in={open}>
                            <div id="example-collapse-text">
                              <div className="table-responsive">
                                <Table className="table-theme">
                                  <thead className="border-less">
                                    <tr>
                                      <th>Event Name</th>
                                      <th>Priority</th>
                                      <th>Start Date</th>
                                      <th>End Date</th>
                                      <th className="text-center">Actions</th>
                                    </tr>
                                  </thead>
                                  <tbody>

                                    {!isEmptyObjectOrNullUndefiend(eventListData?.pastEventData) ? eventListData?.pastEventData?.map((parentItem, index) => {
                                      return (

                                        <tr className={`${parentItem?.status === "Completed" ? "selected" : ""}`} key={index}>
                                          <td>
                                            <div className="event-name-tooltip">
                                              <div className="enevt-name cursor-pointer" onClick={() => { props.handleSelectEvent(parentItem) }} style={{ textDecoration: parentItem?.status == ENUMFORSTATUS.COMPLETED ? 'line-through' : "none" }}><h3>{parentItem?.title || ""} </h3></div>
                                              <div className="event-tool">
                                                <Badge className='course_badge' title={parentItem?.syllabus?.title || ""} style={{ backgroundColor: `${parentItem?.syllabus?.course_color || "#239bc266"}`, opacity: 0.4 }}><i className="material-symbols-outlined">book_2</i><span>{parentItem?.syllabus?.title || ""}</span></Badge>
                                              </div>
                                            </div>
                                          </td>
                                          <td className={`${getPriorityColour(parentItem?.priority)}`}>
                                            {!isNullUndefinedOrBlank(parentItem?.priority) ? parentItem?.priority : ""}
                                          </td>
                                          <td>{!isNullUndefinedOrBlank(parentItem?.start_date) ? formatedDate(parentItem?.start_date, "MM/DD/yyyy hh:mm a") : NO_START_DATE_ADDED}</td>
                                          <td>{!isNullUndefinedOrBlank(parentItem?.end_date) ? formatedDate(parentItem?.end_date, "MM/DD/yyyy hh:mm a") : NO_END_DATE_ADDED}</td>
                                          <td className="tbl-action">
                                            <div className="tbl-action-group">

                                              {
                                                parentItem?.status === "Completed" ?

                                                  <OverlayTrigger
                                                    trigger={["hover", "hover"]}
                                                    placement="bottom"
                                                    overlay={<Tooltip>Pending</Tooltip>}
                                                  >
                                                    <button
                                                      className="btn btn-xs btn-icon btn-transparent check-icon"
                                                      onClick={() => {
                                                        console.log("childItem?.status", parentItem?.status)
                                                        handleEventCompleted(parentItem?.id, parentItem?.status)
                                                      }}
                                                    >

                                                      <i className="material-symbols-outlined">unpublished</i>
                                                    </button>
                                                  </OverlayTrigger> :
                                                  <OverlayTrigger
                                                    trigger={["hover", "hover"]}
                                                    placement="bottom"
                                                    overlay={<Tooltip>Complete</Tooltip>}
                                                  >
                                                    <button className="btn btn-xs btn-icon btn-transparent check-icon" onClick={() => {

                                                      handleEventCompleted(parentItem?.id, parentItem?.status)
                                                    }}
                                                    >
                                                      <i className="material-symbols-outlined">check_circle</i>
                                                    </button>
                                                  </OverlayTrigger>

                                              }
                                              <OverlayTrigger
                                                trigger={["hover", "hover"]}
                                                placement="bottom"
                                                overlay={<Tooltip>Delete</Tooltip>}
                                              >
                                                <button className="btn btn-xs btn-icon btn-transparent text-danger" onClick={() => handleDeleteShow(parentItem)}>
                                                  {" "}
                                                  <i className="material-symbols-outlined">delete</i>
                                                </button>
                                              </OverlayTrigger>
                                            </div>
                                          </td>
                                        </tr>
                                      )
                                    })
                                      : <tr>
                                        <td className='text-center'
                                          colSpan={35}
                                        >
                                          {NO_RECORD_FOUND_MSG}
                                        </td>
                                      </tr>
                                    }
                                  </tbody>
                                </Table>
                              </div>
                            </div>
                          </Collapse>
                        </div>
                      </div>



                    </div>
                  </>
                  :
                  <>
                  </>
              }
            </> :
            <div className="no-records-found no-records-found-inner h-100">
              <div className="no-records-found-image">
                <img src={notVoucherFound} alt="OpenPlaner" />
              </div>
              <div className="no-records-found-text">
                <h6>No data found!</h6>
              </div>
            </div>
          }




          {/* Delete Modal */}
          <Modal
            className="modal-theme modal-confirmation modal-reject"
            show={deleteShow}
            onHide={handleDeleteClose}
            centered
          >
            <Modal.Header>
              <h4 className="modal-title">Delete Event</h4>
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
                    handleDeleteData(selectedEventObj?.id)
                  }}
                >
                  Delete
                </Button>
              </div>
            </Modal.Body>
          </Modal>
          {/* Delete Modal */}

          {/* Compated Delete Modal */}
          {/* <Modal
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
          </Modal> */}
          {/* Delete Modal */}


          {/* Success Modal */}
          <Modal
            className='modal-theme modal-confirmation modal-approve'
            show={successShow}
            onHide={handleSuccessClose}
            centered
          >
            <Modal.Header>
              <h4 className="modal-title">
                {eventStatus === ENUMFORSTATUS.PENDING ? 'Event Completed!' : 'Event Pending'}
              </h4>
              <button type="button" className="btn-close" onClick={handleSuccessClose}>
                <i className="material-symbols-outlined">close</i>
              </button>
            </Modal.Header>

            <Modal.Body>
              <div className="modal-confirmation-container">
                <div className="modal-confirmation-icon">
                  <i className="material-symbols-outlined">
                    {eventStatus === ENUMFORSTATUS.PENDING ? 'mood' : 'mood_bad'}
                  </i>
                </div>
                <div className="modal-confirmation-content">
                  {eventStatus === ENUMFORSTATUS.PENDING ? (
                    <>
                      <h5>You have successfully completed the Event!</h5>
                      <p>Get back to the Event page to add or complete the other Event.</p>
                    </>
                  ) : (
                    <>
                      <h5>Event is still Pending!</h5>
                      <p>Complete the event to move forward with the syllabus.</p>
                    </>
                  )}
                </div>
              </div>

              <div className="modal-button-group modal-full-width-btn modal-footer-button">
                <Button
                  variant={eventStatus === ENUMFORSTATUS.PENDING ? 'success' : 'warning'}
                  className="btn-icon-text btn-md"
                  onClick={handleSuccessClose}
                >
                  {eventStatus === ENUMFORSTATUS.PENDING ? 'Done' : 'Done'}
                </Button>
              </div>
            </Modal.Body>
          </Modal>

          {/* Success Modal */}
        </div>
      </div>
    </>
  )
}

const mapStateToProps = (state) => ({
  eventData: state?.CoursesReducer?.getEventListData
})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(Events)