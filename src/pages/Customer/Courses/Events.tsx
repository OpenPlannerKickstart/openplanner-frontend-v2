import React, { useEffect, useState } from 'react'
import { Badge, Button, Collapse, Modal, OverlayTrigger, Table, Tooltip } from 'react-bootstrap'
import { connect, useDispatch } from 'react-redux'
import { AppDispatch } from '../../../redux/store'
import { deleteEventDataAPI, getEventListDataAPI, updateEventStatusDataAPI } from '../../../redux/Service/User/Courses/courses'
import { ENUM_FOR_SYLLABUS_TAB } from '../../../interfaces/enum'
import { EventResponseType } from '../../../interfaces/interface'
import { formatedDate, getDate, isEmptyObjectOrNullUndefiend, isNullUndefinedOrBlank, NO_RECORD_FOUND_MSG } from '../../../Utility/Helper'
import { NO_END_DATE_ADDED, NO_START_DATE_ADDED } from '../../../Utility/Validation_Message'
import notVoucherFound from "/assets/images/not-voucher-found.svg";

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
      setDeleteSuccess(false);
    }, 300);
  }
  const handleDeleteShow = (data) => {
    setDeleteShow(true)
    setSelectedEventObj(data);
  }

  const [deleteSuccess, setDeleteSuccess] = useState<boolean>(false);

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
      setDeleteSuccess(true);
    }
  }

  /** -------------------Delete Event end-------------------------*/


  /** -------------------Event complete Start-------------------------*/

  const [successShow, setSuccessShow] = useState(false);
  const handleSuccessClose = () => setSuccessShow(false);
  const handleSuccessShow = () => setSuccessShow(true);

  const handleEventCompleted = async (id) => {
    let event_id: any = [];
    if (id instanceof Array) {
      event_id = id;
    }
    else {
      event_id = [id];
    }
    const reqBody = {
      event_id: event_id,
    }
    let response = await dispatch(updateEventStatusDataAPI(reqBody));
    if (!isNullUndefinedOrBlank(response?.payload)) {
      getEventListData();
      handleSuccessShow();
    }
  }



  /** -------------------Event complete End-------------------------*/

  useEffect(() => {
    if (!isEmptyObjectOrNullUndefiend(props?.eventData)) {
      setEventListData(props?.eventData)
    }
  }, [props?.eventData])


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
                                  <th>Start Date</th>
                                  <th>End Date</th>
                                  <th className="text-center">Actions</th>
                                </tr>
                              </thead>
                              <tbody>

                                {
                                  parentItem?.eventData?.map((childItem, index) => {
                                    return (
                                      <tr className={`${childItem?.status === "Completed" ? "active-table" : ""}`} key={index}>
                                        <td>
                                          <div className="event-name-tooltip">
                                            <div className="enevt-name"><h3>{childItem?.title || ""}</h3></div>
                                            <div className="event-tool">
                                              <Badge bg="" style={{ backgroundColor: childItem.syllabus?.course_color ? `rgba(${parseInt(childItem.syllabus?.course_color?.slice(1, 3), 16)}, ${parseInt(childItem.syllabus?.course_color?.slice(3, 5), 16)}, ${parseInt(childItem.syllabus?.course_color.slice(5, 7), 16)}, 0.2)` : 'rgba(0, 0, 0, 0.2)', color: childItem.syllabus?.course_color ? `rgba(${parseInt(childItem.syllabus?.course_color.slice(1, 3), 16)}, ${parseInt(childItem.syllabus?.course_color.slice(3, 5), 16)}, ${parseInt(childItem.syllabus?.course_color.slice(5, 7), 16)})` : 'rgba(0, 0, 0, 0.2)' }}><i className="material-symbols-outlined" style={{ color: childItem.syllabus?.course_color ? `rgba(${parseInt(childItem.syllabus?.course_color.slice(1, 3), 16)}, ${parseInt(childItem.syllabus?.course_color.slice(3, 5), 16)}, ${parseInt(childItem.syllabus?.course_color.slice(5, 7), 16)})` : 'rgba(0, 0, 0, 0.2)' }}>book_2</i>{!isNullUndefinedOrBlank(childItem.syllabus?.title) ? childItem.syllabus?.title : "-"}</Badge>

                                              {/* <Badge style={{ backgroundColor: `${childItem?.syllabus?.course_color || "#239bc266"}`, opacity: 0.4 }}><i className="material-symbols-outlined">book_2</i>{childItem?.syllabus?.title || ""}</Badge> */}
                                            </div>
                                          </div>
                                        </td>
                                        <td>{!isNullUndefinedOrBlank(childItem?.start_date) ? formatedDate(childItem?.start_date, "DD-MM-yyyy") : NO_START_DATE_ADDED}</td>
                                        <td>{!isNullUndefinedOrBlank(childItem?.end_date) ? formatedDate(childItem?.end_date, "DD-MM-yyyy") : NO_END_DATE_ADDED}</td>
                                        <td className="tbl-action">
                                          <div className="tbl-action-group">


                                            {
                                              childItem?.status === "Completed" ?

                                                <OverlayTrigger
                                                  trigger={["hover", "hover"]}
                                                  placement="bottom"
                                                  overlay={<Tooltip>Completed</Tooltip>}
                                                >
                                                  <button
                                                    className="btn btn-xs btn-icon btn-transparent check-icon"
                                                  >
                                                    {" "}
                                                    <i className="material-symbols-outlined">check_circle</i>
                                                  </button>
                                                </OverlayTrigger> :
                                                <OverlayTrigger
                                                  trigger={["hover", "hover"]}
                                                  placement="bottom"
                                                  overlay={<Tooltip>Update Status</Tooltip>}
                                                >
                                                  <button className="btn btn-xs btn-icon btn-transparent check-icon" onClick={() => {

                                                    handleEventCompleted(childItem?.id)
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
                                      <th>Start Date</th>
                                      <th>End Date</th>
                                      <th className="text-center">Actions</th>
                                    </tr>
                                  </thead>
                                  <tbody>

                                    {!isEmptyObjectOrNullUndefiend(eventListData?.pastEventData) ? eventListData?.pastEventData?.map((parentItem, index) => {
                                      return (

                                        <tr className={`${parentItem?.status === "Completed" ? "active-table" : ""}`} key={index}>
                                          <td>
                                            <div className="event-name-tooltip">
                                              <div className="enevt-name"><h3>{parentItem?.title || ""} </h3></div>
                                              <div className="event-tool">
                                                <Badge style={{ backgroundColor: `${parentItem?.syllabus?.course_color || "#239bc266"}`, opacity: 0.4 }}><i className="material-symbols-outlined">book_2</i>{parentItem?.syllabus?.title || ""}</Badge>
                                              </div>
                                            </div>
                                          </td>
                                          <td>{!isNullUndefinedOrBlank(parentItem?.start_date) ? formatedDate(parentItem?.start_date?.split("T")[0], "DD-MM-yyyy") : NO_START_DATE_ADDED}</td>
                                          <td>{!isNullUndefinedOrBlank(parentItem?.end_date) ? formatedDate(parentItem?.end_date?.split("T")[0], "DD-MM-yyyy") : NO_END_DATE_ADDED}</td>
                                          <td className="tbl-action">
                                            <div className="tbl-action-group">

                                              {
                                                parentItem?.status === "Completed" ?

                                                  <OverlayTrigger
                                                    trigger={["hover", "hover"]}
                                                    placement="bottom"
                                                    overlay={<Tooltip>Completed</Tooltip>}
                                                  >
                                                    <button
                                                      className="btn btn-xs btn-icon btn-transparent check-icon"
                                                    >
                                                      {" "}
                                                      <i className="material-symbols-outlined">check_circle</i>
                                                    </button>
                                                  </OverlayTrigger> :
                                                  <OverlayTrigger
                                                    trigger={["hover", "hover"]}
                                                    placement="bottom"
                                                    overlay={<Tooltip>Update Status</Tooltip>}
                                                  >
                                                    <button
                                                      className="btn btn-xs btn-icon btn-transparent check-icon" onClick={handleSuccessShow}
                                                    >
                                                      {" "}
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
                  <h5> {!deleteSuccess ? "Want to Delete?" : "You have successfully deleted Event!"}</h5>
                  <p>
                    {!deleteSuccess ?
                      "Are you sure, you want to delete this event ?" :
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
                    !deleteSuccess ? handleDeleteData(selectedEventObj?.id) : handleDeleteClose()
                  }}
                >
                  {!deleteSuccess ? "Delete" : "Ok"}
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
          <Modal className='modal-theme modal-confirmation modal-approve' show={successShow} onHide={handleSuccessClose} centered>
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
                    completed  Event!</h5>
                  <p>Get back to Event page to add or complete the other Event</p>
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
    </>
  )
}

const mapStateToProps = (state) => ({
  eventData: state?.CoursesReducer?.getEventListData
})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(Events)