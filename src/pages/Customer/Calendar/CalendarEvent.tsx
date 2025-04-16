import React, { useEffect, useState } from "react";
import {
  customJsonInclude,
  formatedDate,
  getDate,
  hexToRgb,
  isEmptyObjectOrNullUndefiend,
  isNullUndefinedOrBlank,
} from "../../../Utility/Helper";
import Select, { components, ControlProps } from "react-select";
import moment from "moment";
import { Calendar, momentLocalizer } from "react-big-calendar";
import appleLogo from "/assets/images/apple-logo.svg";
import calendarLogo from "/assets/images/calendar-logo.svg";
import outlookLogo from "/assets/images/outlook-logo.svg";
import { AppDispatch } from "../../../redux/store";
import { connect, useDispatch } from "react-redux";
import {
  getCalenderDataAPI,
  getSyllabusDropDownDataAPI,
} from "../../../redux/Service/calender";
import DatePicker from "react-datepicker";
import { Button, Col, Form, Offcanvas, Row } from "react-bootstrap";

const localizer: any = momentLocalizer(moment);
const CalenderEvent = () => {
  // ADD new task offcanvas
  const [showEditEvent, setShowEditEvent] = useState(false);
  const handleCloseEditEvent = () => setShowEditEvent(false);
  const toggleShowEditEvent = () => setShowEditEvent(true);

  const dispatch: AppDispatch = useDispatch();

  const customToolbar = ({ date, onNavigate, onView, view }) => {
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

    return (
      <div className="calendar-header">
        <div className="rbc-toolbar">
          <div className="calendar-views">
            <button className="btn btn-sm today-btn" onClick={goToToday}>
              Today
            </button>
            <button
              className="{view === 'month' ? 'active' : ''} btn btn-sm"
              onClick={() => changeView("month")}
            >
              Month
            </button>
            <button
              className="{view === 'week' ? 'active' : ''} btn btn-sm"
              onClick={() => changeView("week")}
            >
              Week
            </button>
            <button
              className="{view === 'day' ? 'active' : ''} btn btn-sm"
              onClick={() => changeView("day")}
            >
              Day
            </button>
            <button
              className="{view === 'agenda' ? 'active' : ''} btn btn-sm"
              onClick={() => changeView("agenda")}
            >
              Agenda
            </button>
          </div>
          <div className="calendar-month">
            <button className="btn btn-sm" onClick={goToBack}>
              <i className="material-symbols-outlined">keyboard_arrow_left</i>
            </button>
            <span className="selected_month">
              {formatedDate(date, "MMMM YYYY")}
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

  const handleSelectEvent = (event) => {
    console.log(event);
  };

  function customEventView({ event }) {
    return (
      <div key={Math.random()}>
        <div
          className={`rbc-event-primary`}
          style={{
            backgroundColor: `rgba(${hexToRgb(
              event.event_data.course_color
            )}, 0.2)`,
            borderColor: `rgba(${hexToRgb(event.event_data.course_color)})`,
          }}
        >
          <p>
            <b className="text-black">{event.title} </b>
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
    return new Date(Date.UTC(year, month, day, hours, minutes, seconds));
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
    handleGetCalenderData();
  }, [searchByStartDate, searchByEndDate, syllabusId]);

  /** ----------------------get CalenderData End----------------------*/

  /** ---------------------get syllabus dropdown Start-----------------------*/
  const [syllabusDropDownData, setSyllabusDropDownData] = useState<any>([]);
  const handleGetDropDownData = async () => {
    const response = await dispatch(getSyllabusDropDownDataAPI());
    if (!isNullUndefinedOrBlank(response?.payload)) {
      setSyllabusDropDownData(response?.payload);
    }
  };

  useEffect(() => {
    handleGetDropDownData();
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
    setSyllabusId([]);
  };
  /** ------------------reset filter end--------------------------*/

  /** ----------------- sidebar logic start---------------------------*/
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);

  const handleSideBar = (value) => {
    setIsSideBarOpen(!value);
    if (isSideBarOpen) {
      handleResetFilter();
    }
  };
  /** ----------------- sidebar logic end---------------------------*/
  // const CustomDateCell = ({ children, className, value, onClick }) => {
  //     return (
  //         <div
  //             className={className} // Preserve all existing classes
  //             onClick={() => onClick(value)}
  //             style={{ position: 'relative', overflow: 'hidden' }} // Ensure relative positioning and clipping
  //         >
  //             {children}
  //             <button
  //                 className="custom-date-button"
  //                 onClick={(e) => {
  //                     e.stopPropagation(); // Prevent triggering the cell click
  //                     alert(`Button clicked on ${value}`);
  //                 }}
  //                 style={{
  //                     position: 'absolute',
  //                     bottom: '5px',
  //                     right: '5px',
  //                     zIndex: 10,
  //                     padding: '4px 8px',
  //                     backgroundColor: '#007BFF',
  //                     color: 'white',
  //                     border: 'none',
  //                     borderRadius: '4px',
  //                     cursor: 'pointer',
  //                 }}
  //             >
  //                 +
  //             </button>
  //         </div>
  //     );
  // };
  const [currentMonth, setCurrentMonth] = useState(moment().startOf("month"));

  // Function to handle navigation (change of month)
  const handleNavigateEvent = (date) => {
    setCurrentMonth(moment(date).startOf("month"));
  };
  // const CustomDateCellWrapperTest = ({ children, value }) => {
  //     const isInCurrentMonth = moment(value).isSame(currentMonth, 'month');

  //     return (
  //         <div
  //             style={{
  //                 position: "relative",
  //                 height: "100%",
  //                 width: "100%",
  //                 overflow: "hidden",
  //                 // boxSizing: "border-box",
  //                 border: "1px solid #ddd",
  //                 // padding: "5px",
  //                 // textAlign: "left",
  //                 // verticalAlign: "top",
  //             }}

  //         >
  //             <div
  //                 className={`rbc-day-bg rbc-date-cell custom-date-cell`}
  //                 style={{
  //                     position: "relative",
  //                     padding: "10px",
  //                     opacity: isInCurrentMonth ? 1 : 0.3, // Apply opacity based on the month check
  //                 }}
  //             >
  //                 {children}
  //                 {isInCurrentMonth && ( // Only show the button for dates in the current month
  //                     <div >
  //                         <button
  //                             style={{
  //                                 position: "absolute",
  //                                 // top: "10px",
  //                                 right: "0px",
  //                                 bottom: "-141px",
  //                                 backgroundColor: "#3174ad",
  //                                 color: "white",
  //                                 border: "none",
  //                                 // borderRadius: "50%",
  //                                 // width: "20px",
  //                                 // height: "20px",
  //                                 textAlign: "center",
  //                                 lineHeight: "20px",
  //                                 fontSize: "12px",
  //                                 cursor: "pointer",
  //                                 zIndex: "100"
  //                             }}
  //                             onClick={(e) => {
  //                                 e.stopPropagation(); // Prevents event bubbling
  //                                 alert("Add button clicked!");
  //                             }}
  //                         >
  //                             +
  //                         </button>
  //                     </div>
  //                 )}
  //             </div>
  //         </div>
  //     );
  // };

  const CustomDateCellWrapper2 = ({ children, value }) => {
    //
    const isInCurrentMonth = moment(value).isSame(currentMonth, "month");
    const [isHovered, setIsHovered] = useState(false);

    const handleAddClick = (date) => {
      console.log("Add event for date:", date);
      alert(`Add event for: ${date.toDateString()}`);
    };

    return (
      <div
        className="button-wrapper"
        style={{
          backgroundColor: !isInCurrentMonth ? "#F9FAFB" : "white",
          // opacity: isInCurrentMonth ? 1 : 0.1, // Apply opacity based on the month check

          // boxSizing: "border-box",
          // border: "1px solid #ddd",
          // padding: "5px",
          // textAlign: "left",
          // verticalAlign: "top",
        }}
      >
        {isInCurrentMonth && (
          <button
            className="add-button"
            onClick={(e) => {
              e.stopPropagation();
              alert(`Add event for ${value.toDateString()}`);
            }}
          >
            +
          </button>
        )}
      </div>
    );
  };

  // const CustomDateCellWrapper = ({ children, value }) => {
  //     const isInCurrentMonth = moment(value).isSame(currentMonth, 'month');

  //     return (
  //         <div
  //             className={`rbc-day-bg rbc-date-cell custom-date-cell`}
  //             style={{
  //                 position: "relative",
  //                 padding: "10px",
  //                 opacity: isInCurrentMonth ? 1 : 0.3, // Apply opacity based on the month check
  //             }}
  //         >
  //             {children}
  //             {isInCurrentMonth && ( // Only show the button for dates in the current month
  //                 <div className="button-wrapper">
  //                     <button
  //                         className="add-button"
  //                         onClick={(e) => {
  //                             e.stopPropagation(); // Prevents event bubbling
  //                             alert("Add button clicked!");
  //                         }}
  //                     >
  //                         +
  //                     </button>
  //                 </div>
  //             )}
  //         </div>
  //     );
  // };

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
            <button type="button" className="btn btn-primary">
              Add Event
            </button>
            <button type="button" className="btn btn-warning">
              Add Syllabus
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={toggleShowEditEvent}
            >
              Edit Event
            </button>
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
                      <div className="react-datepicker-container">
                        <DatePicker
                          toggleCalendarOnIconClick
                          selectsRange={true}
                          onChange={(dates) => {
                            const [start, end] = dates;
                            setSearchByStartDate(start ? start : null);
                            setSearchByEndDate(end ? end : null);
                          }}
                          open={true}
                          startDate={searchByStartDate}
                          endDate={searchByEndDate}
                          isClearable={false}
                          dateFormat="dd-MM-yyyy"
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
                    <div className="classes-details">
                      {!isEmptyObjectOrNullUndefiend(syllabusDropDownData) &&
                        syllabusDropDownData?.map((item, index) => {
                          return (
                            <>
                              <div className="class-main">
                                <div className="checkbox checkbox-primary classes-checkbox checkbox-small">
                                  <input
                                    id={`${index} -checkbox`}
                                    className="material-inputs filled-in"
                                    type="checkbox"
                                    // name={`syllabus-${item.value}`}

                                    onChange={() => {
                                      handleCheckSyllabusID(item.value);
                                    }}
                                    checked={syllabusId.includes(item.value)}
                                  />
                                  <label htmlFor={`${index} -checkbox`}>
                                    {item.label}
                                  </label>
                                </div>
                                <div className="color-box">
                                  <span
                                    style={{
                                      backgroundColor: `${
                                        !isNullUndefinedOrBlank(
                                          item.other.course_color
                                        )
                                          ? item?.other?.course_color
                                          : "#000000"
                                      }`,
                                    }}
                                  ></span>
                                </div>
                              </div>
                            </>
                          );
                        })}
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
              <div className="calendar-outer">
                <Calendar
                  localizer={localizer}
                  events={calenderData}
                  startAccessor="start"
                  endAccessor="end"
                  onSelectEvent={(event) => {
                    handleSelectEvent(event);
                  }}
                  onNavigate={(e) => {
                    handleNavigateEvent(e);
                  }}
                  // views={['month', '']}
                  showAllEvents={true}
                  popup
                  components={{
                    // event: customEventView,
                    // toolbar: customToolbar,

                    // dateCellWrapper: CustomDateCellWrapper2
                    // dateCellWrapper: CustomDateCellWrapper,
                    timeSlotWrapper: (props) => (
                      <CustomTimeSlot {...props} onClick={handleSelectEvent} />
                    ),
                    // month: {
                    //   dateHeader: (props) => <DayCell {...props} />, //  this is how you control the header cell for each one in month view
                    // },
                  }}
                />
              </div>
            </div>
          </div>

          {/* EDIT EVENT OFFCANVAS */}
          <Offcanvas
            className="edit-event-canvas style-1"
            show={showEditEvent}
            placement={"end"}
            onHide={handleCloseEditEvent}
          >
            <Offcanvas.Header>
              <Offcanvas.Title>
                Edit <span>Event</span>
              </Offcanvas.Title>
              <button
                type="button"
                className="btn-close"
                onClick={handleCloseEditEvent}
              >
                <i className="material-symbols-outlined">close</i>
              </button>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <div className="Add-new-task-container">
                <div className="op-offcanvas-body-container">
                  <Row>
                    <Col md={6}>
                      <Form.Group className="form-group">
                        <Form.Label>Start Date</Form.Label>
                        <div className="react-datepicker-container form-group-icon-end">
                          <i className="material-symbols-outlined control-icon">
                            calendar_month
                          </i>
                          <DatePicker
                            dropdownMode="select"
                            isClearable={true}
                            dateFormat="dd/MM/yyyy"
                            className="form-control"
                            popperProps={{ strategy: "fixed" }}
                            placeholderText="Select Date"
                          />
                        </div>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="form-group">
                        <Form.Label>End Date</Form.Label>
                        <div className="react-datepicker-container form-group-icon-end">
                          <i className="material-symbols-outlined control-icon">
                            calendar_month
                          </i>
                          <DatePicker
                            dropdownMode="select"
                            isClearable={true}
                            dateFormat="dd/MM/yyyy"
                            className="form-control"
                            popperProps={{ strategy: "fixed" }}
                            placeholderText="Select Date"
                          />
                        </div>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Form.Group
                    className="form-group"
                    controlId="exampleForm.ControlInput1"
                  >
                    <Form.Label>Title</Form.Label>
                    <div className="form-group">
                      <Form.Control
                        type="text"
                        placeholder="Unsatisfactory grades due to registrar"
                      />
                    </div>
                  </Form.Group>
                  <Form.Group
                    className="form-group"
                    controlId="exampleForm.ControlInput1"
                  >
                    <Form.Label>Note</Form.Label>
                    <div className="form-group">
                      <Form.Control
                        as="textarea"
                        rows={3}
                        placeholder="Loreamipsumis"
                      />
                    </div>
                  </Form.Group>
                  <Form.Group className="form-group">
                    <Form.Label>Calendar</Form.Label>
                    <Select
                      placeholder={<div>Project Management</div>}
                      menuPosition="fixed"
                      className="react-select-container"
                    />
                  </Form.Group>
                  <div className="Reminder-box">
                    <div className="title-with-switch">
                      <div className="title-text">
                        <h4>Reminder (Notify me before start date)</h4>
                      </div>
                      <div className="switch-box ">
                        <label className="switch" htmlFor="switch">
                          <input type="checkbox" id="switch" />
                          <div className="slider round"></div>
                        </label>
                      </div>
                    </div>
                    <div className="remider-fields">
                      <Form.Group className="form-group">
                        <Form.Label>Unit</Form.Label>
                        <Select
                          placeholder={<div>Days</div>}
                          menuPosition="fixed"
                          className="react-select-container"
                        />
                      </Form.Group>
                      <Form.Group
                        className="form-group"
                        controlId="exampleForm.ControlInput1"
                      >
                        <Form.Label>Value</Form.Label>
                        <Form.Select aria-label="Default select example">
                          <option>5</option>
                          <option value="1">1</option>
                          <option value="2">2</option>
                          <option value="3">3</option>
                        </Form.Select>
                      </Form.Group>
                      <button
                        type="button"
                        className="btn btn-light-white btn-outline-white"
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                  <div className="form-group default-cal-group">
                    <div className="title-text">
                      <h4>Add On Your Default Calender</h4>
                    </div>
                    <div className="button-group social-cal">
                      <Button
                        variant="outline-white"
                        className="btn-icon-text "
                      >
                        <img src={appleLogo} alt="" />
                        Apple Calendar
                      </Button>
                      <Button
                        variant="outline-white"
                        className="btn-icon-text "
                      >
                        <img src={calendarLogo} alt="" />
                        Google Calendar
                      </Button>
                      <Button
                        variant="outline-white"
                        className="btn-icon-text "
                      >
                        <img src={outlookLogo} alt="" />
                        Outlook
                      </Button>
                    </div>
                  </div>
                  <div className="checkbox checkbox-primary all-event-checkbox">
                    <input
                      type="checkbox"
                      id="checkbox"
                      className="material-inputs filled-in"
                    />
                    <label htmlFor="checkbox">Mark as all day Event</label>
                  </div>
                </div>
                <div className="bottom-button-group">
                  <Button
                    type="button"
                    className="btn btn-light-white me-auto"
                    onClick={handleCloseEditEvent}
                  >
                    Cancel
                  </Button>
                  <Button type="button" className="btn btn-light-danger">
                    Delete
                  </Button>
                  <Button type="button" className="btn btn-success">
                    Mark As Complated
                  </Button>
                  <Button type="button" className="btn btn-primary">
                    Save
                  </Button>
                </div>
              </div>
            </Offcanvas.Body>
          </Offcanvas>
        </div>
      </div>
    </>
  );
};
const mapStateToProps = (state) => ({});

const mapDispatchToProps = {
  getCalenderDataAPI,
  getSyllabusDropDownDataAPI,
};

export default connect(mapStateToProps, mapDispatchToProps)(CalenderEvent);

const CustomTimeSlot = ({ children, value, resource, onClick }) => {
  // displaying default time from left column
  if (resource === undefined) return children;
  // your jsx below
  return (
    <div>
      <button onClick={() => onClick({ date: value, resource })}>Vikas</button>
    </div>
  );
};
const DayCell = ({ children, value, resource, onClick }) => {
  // displaying default time from left column
  if (resource === undefined) return children;
  // your jsx below
  return (
    <div>
      <button onClick={() => onClick({ date: value, resource })}>Vikas</button>
    </div>
  );
};
const CustomDateCellWrapper = ({ value, children }) => {
  return (
    <div style={{ position: "relative" }}>
      {children}
      <button
        style={{
          position: "absolute",
          top: 2,
          right: 2,
          backgroundColor: "#3498db",
          color: "white",
          border: "none",
          borderRadius: "4px",
          padding: "2px 6px",
          fontSize: "10px",
          cursor: "pointer",
        }}
        onClick={() => console.log("Button clicked on date:", value)}
      >
        +
      </button>
    </div>
  );
};
