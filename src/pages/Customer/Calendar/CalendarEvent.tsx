import React, { useEffect, useState } from "react";
import {
  customJsonInclude,
  formatedDate,
  getDate,
  isEmptyObjectOrNullUndefiend,
  isNullUndefinedOrBlank,
} from "../../../Utility/Helper";
import moment from "moment";
import { momentLocalizer } from "react-big-calendar";

import { AppDispatch, RootState } from "../../../redux/store";
import { connect, useDispatch, useSelector } from "react-redux";
import {
  getCalenderDataAPI,
  getSyllabusDropDownDataAPI,
} from "../../../redux/Service/User/Calender/calender";
import DatePicker from "react-datepicker";
import { Button, Form, Modal, OverlayTrigger, Popover } from "react-bootstrap";
import AddEditEvent from "../../../common/AddSyllabusEvents/AddEditEvent";
import AddEditSyllabus from "../../../common/AddSyllabusEvents/AddEditSyllabus";
import notVoucherFound from "/assets/images/not-voucher-found.svg";
import { isUpdatedEvent, isUpdatedSyllabus } from "../../../redux/User/Courses/coursesSlice";
import { Calendar } from 'react-big-calendar';
import DnDCalendar from 'react-big-calendar/lib/addons/dragAndDrop';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { addEditEventDataAPI, deleteEventDataAPI } from "../../../redux/Service/User/Courses/courses";


const DragAndDropCalendar = DnDCalendar(Calendar);
const localizer: any = momentLocalizer(moment);
const CalenderEvent = () => {
  const coursesData: any = useSelector(
    (state: RootState) => state.CoursesReducer);

  const dispatch: AppDispatch = useDispatch();

  const customToolbar = ({ date, onNavigate, onView, view = "month" }) => {
    const goToBack = () => {
      onNavigate("PREV");
    };
    const goToNext = () => {
      onNavigate("NEXT");
    };
    const goToToday = () => {
      onNavigate("TODAY");
    };

    const changeView = (newView) => {
      onView(newView);
    };
    const formatDateByView = (view, date) => {
      const momentDate = moment(date);

      if (view === 'day') {
        return momentDate.format("DD, MMMM YYYY"); // Example: 18, April 2025
      }

      if (view === 'week') {
        const startDay = momentDate.startOf('week').format("DD MMM"); // Start of the week
        const endDay = momentDate.endOf('week').format("DD MMM"); // End of the week
        return `${startDay} - ${endDay}`; // Example: 14 Apr - 20 Apr 2025
      }

      return momentDate.format("MMMM YYYY"); // Default to month view: April 2025
    };
    return (
      <div className="calendar-header">
        <div className="rbc-toolbar">
          <div className="calendar-views">
            <button className="btn btn-sm today-btn" onClick={goToToday}>
              Today
            </button>
            <button
              className={`${view === 'month' ? 'active' : ''} btn btn-sm`}
              onClick={() => changeView("month")}
            >
              Month
            </button>
            <button
              className={`${view === 'week' ? 'active' : ''} btn btn-sm`}
              onClick={() => changeView("week")}
            >
              Week
            </button>
            <button
              className={`${view === 'day' ? 'active' : ''} btn btn-sm`}
              onClick={() => changeView("day")}
            >
              Day
            </button>
            {/* <button
              className={`${view === 'agenda' ? 'active' : ''} btn btn-sm`}
              onClick={() => changeView("agenda")}
            >
              Agenda
            </button> */}
          </div>
          <div className="calendar-month">
            <button className="btn btn-sm" onClick={goToBack}>
              <i className="material-symbols-outlined">keyboard_arrow_left</i>
            </button>
            <span className="selected_month">
              {formatDateByView(view, date)}

            </span>
            <button className="btn btn-sm" onClick={goToNext}>
              <i className="material-symbols-outlined">keyboard_arrow_right</i>
            </button>
          </div>
        </div>
        <div className="hide-filter-button button-group">
          <Button
            variant="outline-white"
            className="btn-icon-text "
            onClick={() => {
              handleSideBar(isSideBarOpen);
            }}
          >
            <i className="material-symbols-outlined btn-outline">
              {isSideBarOpen ? "keyboard_backspace" : "menu"}
            </i>
            {isSideBarOpen ? "Hide Filter" : "Show Filter"}
          </Button>
          {/* <Button variant="outline-white" className="btn-icon-text ">
                        <i className="material-symbols-outlined btn-outline"> keyboard_backspace </i>Show Filter
                    </Button> */}
        </div>
      </div>
    );
  };

  /** ---------------Edit event start-----------------------------*/
  const [editEventFormData, setEditEventFormData] = useState<any>(null);
  // const handleSelectEvent = (event) => {
  //   handleShow();
  //   setEditEventFormData({
  //     ...event?.event_data, start_date: new Date(formatedDate(event?.event_data?.start_date, "yyyy-MM-DD HH:mm:ss")),
  //     end_date: new Date(formatedDate(event?.event_data?.end_date, "yyyy-MM-DD HH:mm:ss")),

  //   })
  // };
  /** --------------------Edit event End------------------------*/
  function customEventView({ event }) {
    const isCompleted = event?.event_data?.status === "Completed" ? true : false
    // console.log(isCompleted, "isCompleted", event?.event_data)
    return (
      <div key={Math.random()}>
        <div
          className={`rbc-event-primary`}
          style={{
            backgroundColor: event?.event_data?.course_color ? `rgba(${parseInt(event.event_data.course_color.slice(1, 3), 16)}, ${parseInt(event.event_data.course_color.slice(3, 5), 16)}, ${parseInt(event.event_data.course_color.slice(5, 7), 16)}, 0.2)` : 'rgba(0, 0, 0, 0.2)',
            borderColor: event?.event_data?.course_color,
          }}
        >
          <p>
            <b className="text-black" style={{ textDecoration: isCompleted ? 'line-through' : "none" }}>{event.title} </b>
          </p>
        </div>
      </div>
    );
  }

  /** ----------------------get CalenderData Start----------------------*/
  const [searchByStartDate, setSearchByStartDate] = useState<any>(null);
  const [searchByEndDate, setSearchByEndDate] = useState<any>(null);
  const [syllabusId, setSyllabusId] = useState<any>([]);
  const [calenderData, setCalenderData] = useState<any>([]);
  function formatDate(dateStr) {
    const date = moment(dateStr).utc();

    const year = date.year();
    const month = date.month(); // No need to add 1 because `moment` handles it properly when creating a new Date
    const day = date.date();
    const hours = date.hour();
    const minutes = date.minute();
    const seconds = date.second();

    // Return a Date object directly
    const dateStrVal = moment(Date.UTC(year, month, day, hours, minutes, seconds)).format("YYYY-MM-DD HH:mm:ss")

    return new Date(dateStrVal);
  }

  const handleGetCalenderData = async () => {
    let reqBody: any = {
      syllabus_id: syllabusId,
    };

    customJsonInclude(reqBody);
    if (!isNullUndefinedOrBlank(searchByStartDate)) {
      reqBody.start_date = getDate(searchByStartDate, "yyyy-MM-DD");
    }
    if (!isNullUndefinedOrBlank(searchByStartDate)) {
      reqBody.end_date = getDate(searchByEndDate, "yyyy-MM-DD");
    }
    const response = await dispatch(getCalenderDataAPI(reqBody));
    if (!isNullUndefinedOrBlank(response?.payload)) {
      const eventData = response?.payload?.map((item) => {
        return {
          ...item,
          start: formatDate(item.start),
          end: formatDate(item.end),
        };
      });
      setCalenderData(eventData);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {

      handleGetCalenderData();
    }, 300);
    return () => {
      clearTimeout(delayDebounceFn);
    }
  }, [searchByStartDate, searchByEndDate, syllabusId]);

  /** ----------------------get CalenderData End----------------------*/

  /** ---------------------get syllabus dropdown Start-----------------------*/
  const [syllabusDropDownData, setSyllabusDropDownData] = useState<any>([]);
  const handleGetDropDownData = async () => {
    const response = await dispatch(getSyllabusDropDownDataAPI());
    if (!isNullUndefinedOrBlank(response?.payload)) {
      setSyllabusDropDownData(response?.payload);
      const syllabusId = response?.payload?.map((item) => item.value);
      setSyllabusId(syllabusId);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      handleGetDropDownData();

    }, 300);
    return () => {
      clearTimeout(delayDebounceFn);
    }

  }, []);

  const handleCheckSyllabusID = (id) => {
    let newSyllabusId = [...syllabusId];
    if (syllabusId.includes(id)) {
      newSyllabusId = syllabusId.filter((data) => data !== id);
    } else {
      newSyllabusId = [...syllabusId, id];
    }
    setSyllabusId(newSyllabusId);
  };

  /** ---------------------get syllabus dropdown End-----------------------*/

  /** ------------------reset filter start--------------------------*/
  const handleResetFilter = () => {
    setSearchByStartDate(null);
    setSearchByEndDate(null);
    setCurrentDate(new Date());
    const syllabusId = syllabusDropDownData?.map((item) => item.value);
    setSyllabusId(syllabusId);
  };
  /** ------------------reset filter end--------------------------*/

  /** ----------------- sidebar logic start---------------------------*/
  const [isSideBarOpen, setIsSideBarOpen] = useState(true);

  const handleSideBar = (value) => {
    setIsSideBarOpen(!value);
    if (isSideBarOpen) {
      handleResetFilter();
    }
  };
  /** ----------------- sidebar logic end---------------------------*/


  /** -----------------Add/Edit Event start---------------------------*/
  const [show, setShow] = useState(false);
  const handleShow = () => setShow(true);
  /** -----------------Add/Edit Event end---------------------------*/


  /** -----------------Add/Edit syllabus start---------------------------*/
  const [showSyllabus, setShowSyllabus] = useState(false);
  const handleSyllabusShow = () => setShowSyllabus(true);
  /** -----------------Add/Edit Syllabus end---------------------------*/

  const [currentView, setCurrentView] = useState('month'); // Initial view
  const [currentDate, setCurrentDate] = useState(new Date()); // Initial date

  const handleDateClick = (date) => {
    setCurrentView('day'); // Change to Day view
    setCurrentDate(date); // Set the clicked date
  };
  const CustomDateHeader = ({ date }) => {
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);

    return (
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 0px",
          height: "100%", // Ensure it stretches the full cell height
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Date on the left */}
        <span onClick={() => { handleDateClick(date) }} style={{ cursor: "pointer" }}><b>{date.getDate()}</b> </span>

        {/* Button on the right */}
        <button
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "22px",
            height: "22px",
            fontSize: "16px",
            backgroundColor: "#374151",
            color: "white",
            border: "none",
            borderRadius: "50%",
            cursor: "pointer",
            visibility: isHovered ? "visible" : "hidden", // Reserve space
            opacity: isHovered ? 1 : 0, // Smooth transition
            transition: "0.2s all",

          }}

          onClick={(e) => {
            e.stopPropagation();
            const startDate = new Date(date); // Start date at 12:00 AM
            const endDate = new Date(date); // Clone the date for end time
            endDate.setHours(23, 59, 59, 999); // Set end time to 11:59:59 PM

            setEditEventFormData({
              ...editEventFormData,
              start_date: startDate,
              end_date: endDate,
              is_reminder: false,
              reminder: [],
            });
            handleShow();
          }}

        >
          +
        </button>
      </div>
    );
  };

  const CustomShowMore = ({ events, date, onClose }) => {

    return (
      <div>
        <h4>Events on {date.toLocaleDateString()}</h4>
        <ul>
          {events.map((event, index) => (
            <li key={index}>{event.title}</li>
          ))}
        </ul>
        <button onClick={onClose}>Close</button>
      </div>
    );
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (coursesData.isUpdatedEventData) {
        handleGetCalenderData();
        setTimeout(() => {
          dispatch(isUpdatedEvent(false));
        }, 400);
      }

    }, 300);
    return () => {
      clearTimeout(delayDebounceFn);
    }
  }, [coursesData.isUpdatedEventData])

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
  }, [coursesData.isUpdatedSyllabusData]);


  /** -------------------drag and drop start-------------------------*/
  const handleEventDrop = async ({ event, start, end }) => {
    // console.log("Event dropped:", event, "Start:", start, "End:", end);
    // Step 1: Update the event in the local state
    // const updatedEvents = calenderData.map((existingEvent) => {
    //   if (existingEvent.id === event.id) {
    //     return { ...existingEvent, start, end }; // Update the event with new dates
    //   }
    //   return existingEvent;
    // });
    // setCalenderData(updatedEvents);

    // Step 2: Prepare the request body for the API
    const reqBody = {
      event_id: event?.event_data?.id,
      title: event?.event_data?.title,
      start_date: start.toISOString(), // Convert to ISO string
      end_date: end.toISOString(), // Convert to ISO string
      syllabus_id: event?.event_data?.syllabus_id,
      is_all_day_event: event?.event_data?.is_all_day_event,
      is_reminder: event?.event_data?.is_reminder,
      note: event?.event_data?.note,
      priority: event?.event_data?.priority,
      reminder: event?.event_data?.reminder,
    };
    customJsonInclude(reqBody)
    try {
      // Step 3: Call the editEvent API
      const response = await dispatch(addEditEventDataAPI(reqBody));

      if (response) {
        // Step 4: Fetch the latest calendar data
        // await props.handleGetData(); // Assuming this fetches the updated calendar data
        handleGetCalenderData();
      }
    } catch (error) {
      console.error("Error updating the event:", error);
    }
  };

  /** ----------------------drag and drop end----------------------*/

  /** --------------------add event start------------------------*/
  const handleSelectSlot = ({ start }) => {

    const startDate = new Date(start); // Start date at 12:00 AM
    const endDate = new Date(start); // Clone the date for end time
    endDate.setMinutes(30, 0); // Set end time to 11:59:59 PM

    setEditEventFormData({
      ...editEventFormData,
      start_date: startDate,
      end_date: endDate,
      is_reminder: false,
      reminder: [],
    });
    handleShow();
  };

  /** --------------------add event end------------------------*/


  /** ---------------------preview Data start-----------------------*/
  const handleEditEvent = (event) => {

    handleCloseModal();
    handleShow();
    setEditEventFormData({
      ...event?.event_data, start_date: new Date(formatedDate(event?.event_data?.start_date, "yyyy-MM-DD HH:mm:ss")),
      end_date: new Date(formatedDate(event?.event_data?.end_date, "yyyy-MM-DD HH:mm:ss")),

    })
  };

  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  const handleSelectEvent = (event) => {
    setSelectedEvent(event); // Set the selected event
    setShowModal(true); // Show the modal
  };

  const handleCloseModal = () => {
    setSelectedEvent(null);
    setShowModal(false); // Hide the modal
  };

  /** ---------------------preview Data end-----------------------*/



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
    // console.log(data)
    setDeleteShow(true)
    setSelectedEventObj(data);
  }

  const [deleteSuccess, setDeleteSuccess] = useState<boolean>(false);

  const handleDeleteData = async (eventId) => {
    // console.log(eventId)
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
      handleGetCalenderData();
      handleDeleteClose();
      handleCloseModal();
    }
  }

  /** -------------------Delete Event end-------------------------*/


  return (
    <>
      <div className="page-content">
        <div className="page-title-wrapper">
          <div className="page-title-left">
            <div className="page-title">
              <h4>Calendar</h4>
            </div>
          </div>
          <div className="page-title-right">
            <button type="button" className="btn btn-primary" onClick={() => { handleShow() }}>
              Add Event
            </button>
            <button type="button" className="btn btn-warning" onClick={() => { handleSyllabusShow() }}>
              Add Syllabus
            </button>
            {/* <button
              type="button"
              className="btn btn-primary"
              onClick={toggleShowEditEvent}
            >
              Edit Event
            </button> */}
          </div>
        </div>

        <div className="content-area  content-area-title calender-content-area">
          <div className="page-content-wrapper h-100">
            <div className="sidebar-with-calendar">
              <div
                className={`sider-bar ${isSideBarOpen ? "d-block" : "d-none"}`}
              >
                <div className="cal-side-title">
                  <div className="title-text">
                    <h4>Filter</h4>
                  </div>
                  <div
                    className="reset-btn"
                    onClick={() => {
                      handleResetFilter();
                    }}
                  >
                    <a>Reset Filters </a>
                  </div>
                </div>
                <div className="cal-side-body">
                  <div className="filter-date">
                    <div className="title-text">
                      <h4>Date</h4>
                    </div>
                    <Form.Group className="form-group">
                      <div className="react-datepicker-container filter-calendar">

                        <DatePicker
                          toggleCalendarOnIconClick
                          selectsRange={true}
                          onChange={(dates) => {
                            const [start, end] = dates;
                            setSearchByStartDate(start ? start : null);
                            setCurrentDate(start ? start : currentDate);
                            setSearchByEndDate(end ? end : null);
                          }}

                          open={true}
                          startDate={searchByStartDate}
                          endDate={searchByEndDate}
                          isClearable={false}
                          dateFormat="MM/dd/yyyy"
                          className="form-control"
                          placeholderText="Select a Date"
                          inline
                        />
                      </div>
                    </Form.Group>
                  </div>
                  <div className="classes-wrapper">
                    <div className="title-with-counter">
                      <div className="title-text">
                        <h4>My Classes</h4>
                      </div>
                      <div className="counter-title">
                        <h4>
                          {" "}
                          {!isEmptyObjectOrNullUndefiend(syllabusDropDownData)
                            ? `${syllabusDropDownData.length} Classes`
                            : "0 Class"}{" "}
                        </h4>
                      </div>
                    </div>
                    <div className="classes-details-wrapper">
                      <div className="classes-details">
                        {!isEmptyObjectOrNullUndefiend(syllabusDropDownData) ?
                          syllabusDropDownData?.map((item, index) => {
                            return (
                              <>
                                <div className="class-main">
                                  <div className="checkbox checkbox-primary classes-checkbox checkbox-small">
                                    {/* <input
                                      id={`${index} -checkbox`}
                                      className="material-inputs filled-in"
                                      type="checkbox"
                                      // name={`syllabus-${item.value}`}

                                      onChange={() => {
                                        handleCheckSyllabusID(item.value);
                                      }}
                                      checked={syllabusId.includes(item.value)}
                                    /> */}
                                    <div
                                      className={`check-box ${syllabusId.includes(item.value) ? "active" : ""}`}
                                      onClick={() => {
                                        handleCheckSyllabusID(item.value);
                                      }}
                                      style={{
                                        // @ts-ignore
                                        ["--course-color" as any]: item.other.course_color, // Pass dynamic color as a CSS variable
                                      }}
                                    >
                                      {syllabusId.includes(item.value) && <i className="material-symbols-outlined">check</i>}
                                    </div>

                                    <label htmlFor={`${index} -checkbox`}>
                                      {item.label}
                                    </label>
                                  </div>
                                </div>

                              </>
                            );
                          })
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

                          </>
                        }
                        {/* <div className="class-main">
                                                <div className="checkbox checkbox-primary classes-checkbox">
                                                    <input
                                                        type="checkbox"
                                                        id="checkbox"
                                                        className="material-inputs filled-in"
                                                    />
                                                    <label htmlFor="checkbox">Project Management</label>
                                                </div>
                                                <div className="color-box">
                                                    <span></span>
                                                </div>
                                            </div>
                                            <div className="class-main">
                                                <div className="checkbox checkbox-primary classes-checkbox">
                                                    <input
                                                        type="checkbox"
                                                        id="checkbox"
                                                        className="material-inputs filled-in"
                                                    />
                                                    <label htmlFor="checkbox">Project Management</label>
                                                </div>
                                                <div className="color-box">
                                                    <span></span>
                                                </div>
                                            </div> */}
                      </div>
                    </div>
                  </div>
                  {/* <div>
                    {!isEmptyObjectOrNullUndefiend(syllabusDropDownData) &&
                      syllabusDropDownData?.map((item, index) => {
                        return (
                          <>
                            <div>
                              <input
                                type="checkbox"
                                name={`syllabus-${item.value}`}
                                id=""
                                onChange={() => {
                                  handleCheckSyllabusID(item.value);
                                }}
                                checked={syllabusId.includes(item.value)}
                              />
                              <span>{item.label}</span>
                            </div>
                          </>
                        );
                      })}
                  </div> */}
                </div>
              </div>
              {/* <div className="calendar-outer">
                <Calendar
                  // scrollToTime={new Date(new Date().setHours(12, 50, 0, 0))}
                  localizer={localizer}
                  events={calenderData}
                  startAccessor="start"
                  endAccessor="end"
                  onSelectEvent={(event) => {
                    handleSelectEvent(event);
                  }}
                  view={currentView}
                  date={currentDate}
                  onView={(view) => setCurrentView(view)} // Sync view change
                  onNavigate={(date) => setCurrentDate(date)} // Sync date chang
                  selectable={true}
                  components={{

                    month: {
                      dateHeader: CustomDateHeader,
                    },
                    event: customEventView,
                    toolbar: customToolbar,

                  }}
                  // popup={true}
                  showAllEvents={true}
                // showMoreLabel="Show More"
                // style={{ height: "100%", width: "100%" }}

                />
              </div> */}
              {/* <div className="calendar-outer2">
                <Calendar
                  scrollToTime={new Date(new Date().setHours(12, 50, 0, 0))}
                  localizer={localizer}
                  events={calenderData}
                  startAccessor="start"
                  endAccessor="end"
                  onSelectEvent={(event) => {
                    handleSelectEvent(event);
                  }}
                  view={currentView}
                  date={currentDate}
                  onView={(view) => setCurrentView(view)} // Sync view change
                  onNavigate={(date) => setCurrentDate(date)} // Sync date chang
                  selectable={true}
                  components={{
                    showMore: CustomShowMore,
                    month: {
                      dateHeader: CustomDateHeader,
                    },
                    event: customEventView,
                    toolbar: customToolbar,

                  }}
                  // popup={true}
                  // showAllEvents={true}
                  showMoreLabel="Show More"
                  style={{ height: "100vh", width: "100%" }}

                />
              </div> */}
              <div className="calendar-outer2">
                <DndProvider backend={HTML5Backend}>
                  <DragAndDropCalendar
                    scrollToTime={new Date(new Date().setHours(12, 50, 0, 0))}
                    localizer={localizer}
                    events={calenderData}
                    onSelectSlot={handleSelectSlot}
                    onEventDrop={handleEventDrop} // Handle drag-and-drop events
                    // onSelectEvent={(event) => handleSelectEvent(event)}
                    onSelectEvent={handleSelectEvent}
                    showAllEvents={true}
                    date={currentDate}
                    onView={(view) => setCurrentView(view)} // Sync view change
                    onNavigate={(date) => setCurrentDate(date)} // Sync date change
                    selectable={true}
                    components={{

                      month: {
                        dateHeader: CustomDateHeader,
                      },
                      event: customEventView,
                      toolbar: customToolbar,
                    }}

                    style={{ height: "100vh", width: "100%" }}
                  />
                </DndProvider>
              </div>
            </div>
          </div>


        </div>
      </div>

      {/* Add/Edit event Start */}
      <AddEditEvent show={show} setShow={setShow} handleGetData={handleGetCalenderData} setEditEventFormData={setEditEventFormData} editEventFormData={editEventFormData} />
      {/* Add/Edit event Event */}

      {/* Add/Edit event Start */}
      <AddEditSyllabus showSyllabus={showSyllabus} setShowSyllabus={setShowSyllabus} handleGetData={handleGetDropDownData} />
      {/* Add/Edit event Event */}


      {/* Modal for Event Details */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{selectedEvent?.event_data.title || "Event Details"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedEvent ? (
            <>
              <p>
                <strong>Start:</strong>{" "}
                {new Date(selectedEvent.start).toLocaleString()}
              </p>
              <p>
                <strong>End:</strong>{" "}
                {new Date(selectedEvent.end).toLocaleString()}
              </p>
              <p>
                <strong>Description:</strong>{" "}
                {selectedEvent.event_data.note || "No description available"}
              </p>
            </>
          ) : (
            <p>No event selected.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => { handleEditEvent(selectedEvent) }}>
            Edit
          </Button>
          <Button variant="primary" onClick={() => { handleDeleteShow(selectedEvent) }}>
            Delete
          </Button>
          <Button variant="primary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

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
              <h5> {!deleteSuccess ? "Are You Sure?" : "You have successfully deleted Event!"}</h5>
              <p>
                {!deleteSuccess ?
                  "You want to delete this event ?" :
                  "Get back to Event page to add or complete the other event"
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
                !deleteSuccess ? handleDeleteData(selectedEventObj?.event_data?.id) : handleDeleteClose()
              }}
            >
              {!deleteSuccess ? "Delete" : "Ok"}
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};
const mapStateToProps = (state) => ({});

const mapDispatchToProps = {
  getCalenderDataAPI,
  getSyllabusDropDownDataAPI,
};

export default connect(mapStateToProps, mapDispatchToProps)(CalenderEvent);
