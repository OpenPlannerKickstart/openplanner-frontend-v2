import React, { useEffect, useState } from 'react'
import { Badge, Button, Modal, Table } from 'react-bootstrap';
import { AppDispatch, RootState } from '../../../redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { dashboardCoursesDataAPI, dashboardEventListingAPI, dashboardEventsDataAPI, dashboardListingCountAPI, dashboardTasksDataAPI, deleteEventAPI, syllabusDropDownAPI } from '../../../redux/Service/User/DashBoard/dashboard';
import { customJsonInclude, formatedDate, getDate, isEmptyObjectOrNullUndefiend, isNullUndefinedOrBlank } from '../../../Utility/Helper';
import { isUpdatedEvent, isUpdatedSyllabus } from '../../../redux/User/Courses/coursesSlice';
import AddEditEvent from '../../../common/AddSyllabusEvents/AddEditEvent';
import AddEditSyllabus from '../../../common/AddSyllabusEvents/AddEditSyllabus';

import moment from "moment";
import { ENUMFORSTATUS } from '../../../interfaces/enum';
import notVoucherFound from "/assets/images/not-voucher-found.svg";
import { updateEventStatusDataAPI } from '../../../redux/Service/User/Courses/courses';
const Dashboard = () => {
  const dispatch: AppDispatch = useDispatch();

  const coursesData: any = useSelector(
    (state: RootState) => state.CoursesReducer);



  /** -----------------event listing api start---------------------------*/
  const [eventData, setEventData] = useState<any>([]);
  const [todayDate, setTodayDate] = useState<any>(null);
  const [startDate, setStartDate] = useState(moment().startOf("week").format("YYYY-MM-DD"));
  const [endDate, setEndDate] = useState(moment().endOf("week").format("YYYY-MM-DD"));

  const handleDateChange = (type) => {
    let start, end;

    if (type === "today") {
      const today = moment();
      start = today.clone().startOf("week");
      end = today.clone().endOf("week");
      setTodayDate(today.format("YYYY-MM-DD"));
    } else if (type === "nextWeek") {
      const nextWeek = moment(startDate).add(1, "week");
      start = nextWeek.clone().startOf("week");
      end = nextWeek.clone().endOf("week");
      setTodayDate(null);
    } else if (type === "prevWeek") {
      const prevWeek = moment(startDate).subtract(1, "week");
      start = prevWeek.clone().startOf("week");
      end = prevWeek.clone().endOf("week");
      setTodayDate(null);
    }

    setStartDate(start.format("YYYY-MM-DD"));
    setEndDate(end.format("YYYY-MM-DD"));
  };

  const handleEventListing = async () => {
    const start_date = getDate(startDate);

    const end_date = getDate(endDate);

    const reqBody = { start_date, end_date };

    customJsonInclude(reqBody);

    try {
      const response = await dispatch(dashboardEventListingAPI(reqBody));
      if (!isNullUndefinedOrBlank(response)) {
        setEventData(response?.payload?.dueEventData);
      }
    } catch (error) {
      console.error("Error fetching event data:", error);
    }
  };



  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (coursesData.isUpdatedSyllabusData) {
        handleGetDropDownData();
        setTimeout(() => {
          dispatch(isUpdatedSyllabus(false));
        }, 400);
      }

    }, 300);
    return () => {
      clearTimeout(delayDebounceFn);
    }
  }, [coursesData.isUpdatedSyllabusData])


  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (coursesData.isUpdatedEventData) {
        handleEventListing();
        setTimeout(() => {
          dispatch(isUpdatedSyllabus(false));
        }, 400);
      }

    }, 300);
    return () => {
      clearTimeout(delayDebounceFn);
    }
  }, [coursesData.isUpdatedEventData])
  /** -----------------event listing api end---------------------------*/

  /** --------------------get syllabus dropdown data start------------------------*/
  const [syllabusDropDownData, setSyllabusDropDownData] = useState<any>([]);
  const handleGetDropDownData = async () => {
    const response = await dispatch(syllabusDropDownAPI());
    if (!isNullUndefinedOrBlank(response)) {
      setSyllabusDropDownData(response?.payload)
    }
  }

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      handleGetDropDownData();
      handleEventListing();
    }, 300);
    return () => {
      clearTimeout(delayDebounceFn);
    }
  }, [])
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      handleEventListing();
    }, 300);
    return () => {
      clearTimeout(delayDebounceFn);
    }
  }, [todayDate, startDate, endDate])
  /** --------------------get syllabus dropdown data end------------------------*/


  /** -----------------Add/Edit Event start---------------------------*/
  const [show, setShow] = useState(false);
  const handleShow = () => setShow(true);
  /** -----------------Add/Edit Event end---------------------------*/
  /** ---------------Edit event start-----------------------------*/
  const [editEventFormData, setEditEventFormData] = useState<any>(null);
  const handleSelectEvent = (event) => {
    handleShow();
    setEditEventFormData({

      ...event, start_date: new Date(formatedDate(event?.start_date, "yyyy-MM-DD HH:mm:ss")),
      end_date: new Date(formatedDate(event?.end_date, "yyyy-MM-DD HH:mm:ss")),

    })
  };
  const handleGetUpdatedData = () => {
    handleEventListing();
  }
  /** --------------------Edit event End------------------------*/
  /** -----------------Add/Edit syllabus start---------------------------*/
  const [showSyllabus, setShowSyllabus] = useState(false);
  const handleSyllabusShow = () => setShowSyllabus(true);
  /** -----------------Add/Edit Syllabus end---------------------------*/

  /** --------------------get Priority Class start------------------------*/

  const getPriorityColour = (priority) => {
    const priorityLower = priority.toLowerCase();
    const priorityMap = {
      high: 'priority-high',
      medium: 'priority-medium',
      low: 'priority-low',
    };

    return priorityMap[priorityLower] || '';
  };

  /** --------------------get Priority Class end------------------------*/


  /** -------------------Event complete Start-------------------------*/



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
      handleEventListing();
      // await dispatch(isUpdatedEvent(true));
      // setEventStatus(status);
      // handleSuccessShow();
    }
  }



  /** -------------------Event complete End-------------------------*/

  /** -------------------Delete event start-------------------------*/
  const [deleteShow, setDeleteShow] = useState(false);
  const handleDeleteClose = () => {
    setDeleteShow(false);
    setTimeout(() => {
      setdeleteEventData([]);
      // setDeleteSuccess(false);
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
      handleDeleteClose();
      handleEventListing();

    }
  }

  /** -------------------Delete Event end-------------------------*/

  return (
    <>
      <div className="page-content dashboard-main">
        <div className="content-area">
          <div className="page-content-wrapper h-100">
            <div className="dashboard-main-wrapper">
              <div className="weekly-data-container">

                {/* PAGE HEADER */}
                <div className="weekly-page-header">
                  <div className="weekly-page-content-left">
                    <div className="weekly-page-content-header-group">
                      <h4 className='d-inline-block mb-0'>My Week</h4>
                      <div className='weekly-page-content-calendar'>
                        <button type="button" className="btn btn-outline-primary clnd-today-btn" onClick={() => { handleDateChange("today") }}>
                          Today
                        </button>
                        <div className="weekly-shuffle-date-action">
                          <button type="button" className="btn btn-outline-white" onClick={() => { handleDateChange("prevWeek") }}>
                            <span className="material-symbols-outlined fs-4" >
                              keyboard_arrow_left
                            </span>

                          </button>
                          {formatedDate(startDate, "MMM DD")} - {formatedDate(endDate, "MMM DD")}
                          <button type="button" className="btn btn-outline-white" onClick={() => handleDateChange("nextWeek")}>
                            <span className="material-symbols-outlined fs-4">
                              keyboard_arrow_right
                            </span>
                          </button>
                        </div>


                      </div>
                    </div>
                  </div>

                  <div className="weekly-page-content-right">
                    <div className="weekly-page-cta-button-group">
                      <button type="button" className="btn btn-primary" onClick={() => { handleShow() }}>
                        Add Event
                      </button>
                      <button type="button" className="btn btn-warning" onClick={() => { handleSyllabusShow() }}>
                        Add Syllabus
                      </button>
                      {/* <button type="button" className="btn btn-primary" onClick={toggleShowEditEvent}>
                        Edit Event
                      </button> */}
                    </div>
                  </div>
                </div>

                {/* VARIOUS BADGES */}
                <div className="weekly-page-badge-group">
                  {!isEmptyObjectOrNullUndefiend(syllabusDropDownData) &&
                    syllabusDropDownData?.map((item, index) => {
                      return (

                        <Badge bg='none' key={index}>
                          <span className="badge-color" style={{ background: item?.other?.course_color }}></span>
                          <span className="badge-text">{item?.label}</span>
                        </Badge>
                      )
                    })
                  }
                  {/* <Badge bg='none'>
                    <span className="badge-color" style={{ background: "#CDDC39" }}></span>
                    <span className="badge-text">History Unfolded</span>
                  </Badge> */}
                </div>

                {/* WEEKLY TO-DO's */}
                {
                  (!isEmptyObjectOrNullUndefiend(eventData) ?

                    <div className="weekly-content-box">
                      <Table responsive className="table-responsive table-borderless table-weekly-event">
                        <thead>
                          <tr>
                            <th>Actions</th>
                            <th>Time</th>
                            <th>Priority</th>
                            <th>Course Name</th>
                            <th>Event Name</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>

                          {/* GROUP 1 */}

                          {
                            eventData?.map((item, index) => {
                              return (
                                <>
                                  <tr className='table-row-blank-timestamp' key={index}>
                                    <td colSpan={5}>Due on  {!isNullUndefinedOrBlank(item?.due_date) ? formatedDate(item?.due_date, 'dddd, MMM DD') : "-"}</td>
                                  </tr>
                                  {
                                    item?.eventData?.map((eventData, eventIndex) => {
                                      return (

                                        <tr className={`table-row-bordered  cursor-pointer ${eventData?.status == ENUMFORSTATUS.COMPLETED ? 'selected' : ''} `} onClick={() => { handleSelectEvent(eventData) }}>
                                          <td className="text-center">
                                            <div className="checkbox checkbox-primary checkbox-small">
                                              <button className="btn btn-xs btn-icon btn-transparent check-icon" onClick={(e) => { e.stopPropagation(); handleEventCompleted([eventData?.id], eventData?.status) }}>
                                                {
                                                  eventData?.status === ENUMFORSTATUS.COMPLETED ? <i className="material-symbols-outlined">unpublished</i> :
                                                    <i className="material-symbols-outlined">check_circle</i>
                                                }
                                              </button>
                                            </div>
                                          </td>
                                          <td className='position-relative'>
                                            <div className='d-flex gap-2 align-items-center ps-4'>
                                              <div className="content-identifier-bar" style={{ background: eventData?.syllabus?.course_color }}></div>
                                              <div>{formatedDate(eventData?.start_date, "hh:mm A")} - {formatedDate(eventData?.end_date, "hh:mm A")}</div>
                                            </div>
                                          </td>
                                          <td className={`weekly-task-priority ${getPriorityColour(eventData?.priority)}`}>{eventData?.priority}</td>
                                          <td >{eventData?.syllabus?.title}</td>
                                          <td style={{ textDecoration: eventData?.status == ENUMFORSTATUS.COMPLETED ? 'line-through' : "none" }}>{eventData?.title}</td>
                                          <td>
                                            <button className="btn btn-xs btn-icon btn-transparent text-danger" onClick={(e) => { e.stopPropagation(); handleDeleteShow([...deleteEventData, eventData]) }}>
                                              <i className="material-symbols-outlined">delete</i>
                                            </button>
                                          </td>
                                        </tr>
                                      )
                                    })
                                  }

                                </>
                              )
                            })
                          }

                          {/* GROUP 2 */}
                          {/* <tr className='table-row-blank-timestamp'>
                            <td colSpan={5}>Due on Friday, March 7</td>
                          </tr>
                          <tr className='table-row-bordered selected'>
                            <td className="text-center">
                              <div className="checkbox checkbox-primary checkbox-small">
                                <button className="btn btn-xs btn-icon btn-transparent check-icon">
                                  <i className="material-symbols-outlined">check_circle</i>
                                </button>
                              </div>
                            </td>
                            <td className='position-relative'>
                              <div className='d-flex gap-2 align-items-center ps-4'>
                                <div className="content-identifier-bar" style={{ background: "#E890E7" }}></div>
                                <div>08:25 PM 02:36 PM</div>
                              </div>
                            </td>
                            <td className="weekly-task-priority weekly-task-priority-high">High</td>
                            <td>Innovative Approaches to Modern Education</td>
                            <td>
                              <button className="btn btn-xs btn-icon btn-transparent text-danger">
                                <i className="material-symbols-outlined">delete</i>
                              </button>
                            </td>
                          </tr>
                          <tr className='table-row-bordered'>
                            <td className="text-center">
                              <div className="checkbox checkbox-primary checkbox-small">
                                <button className="btn btn-xs btn-icon btn-transparent check-icon">
                                  <i className="material-symbols-outlined">check_circle</i>
                                </button>
                              </div>
                            </td>
                            <td className='position-relative'>
                              <div className='d-flex gap-2 align-items-center ps-4'>
                                <div className="content-identifier-bar" style={{ background: "#CDDC39" }}></div>
                                <div>08:25 PM 02:36 PM</div>
                              </div>
                            </td>
                            <td className="weekly-task-priority weekly-task-priority-medium">Medium</td>
                            <td>Innovative Approaches to Modern Education</td>
                            <td>
                              <button className="btn btn-xs btn-icon btn-transparent text-danger">
                                <i className="material-symbols-outlined">delete</i>
                              </button>
                            </td>
                          </tr> */}
                        </tbody>
                      </Table>
                    </div>
                    :
                    <>
                      <div className="no-records-found no-records-found-inner h-100">
                        <div className="no-records-found-image">
                          <img src={notVoucherFound} alt="OpenPlaner" />
                        </div>
                        <div className="no-records-found-text">
                          <h6>No data found!</h6>
                        </div>
                      </div>
                    </>)
                }

              </div>
            </div>
          </div>
        </div>
      </div>


      {/* note modal end */}
      {/* Add/Edit event Start */}
      <AddEditEvent show={show} setShow={setShow} handleGetData={handleGetUpdatedData} setEditEventFormData={setEditEventFormData} editEventFormData={editEventFormData} />
      {/* Add/Edit event Event */}
      {/* Add/Edit event Start */}
      <AddEditSyllabus showSyllabus={showSyllabus} setShowSyllabus={setShowSyllabus} handleGetData={handleGetUpdatedData} />
      {/* Add/Edit event Event */}

      {/* Delete Modal */}
      < Modal
        className="modal-theme modal-confirmation modal-reject"
        show={deleteShow}
        onHide={handleDeleteClose}
        centered
      >
        <Modal.Header>
          <h4 className="modal-title">{"Delete Event"}</h4>
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
              <h5> Are You Sure?
              </h5>
              <p> You want to delete this event ?
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
      </Modal >
      {/* Delete Modal */}
    </>
  )
}

export default Dashboard;