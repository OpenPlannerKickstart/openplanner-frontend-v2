import React, { useEffect, useState } from "react";
import {
  customJsonInclude,
  formatedDate,
  getDate,
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

  // const customToolbar = ({ date, onNavigate }) => {
  //     const goToBack = () => {
  //         onNavigate("PREV");
  //     };
  //     const goToNext = () => {
  //         onNavigate("NEXT");
  //     };

  //     const goToToday = () => {
  //         onNavigate("TODAY");
  //     };
  //     return (
  //         <div className='calendar-header'>
  //             <div className="rbc-toolbar">
  //                 <div className="calendar-month">
  //                     <button onClick={() => { goToToday() }}>
  //                         Today
  //                     </button>
  //                     <button onClick={() => { goToBack() }}>
  //                         {'<'}
  //                     </button>
  //                     <span>{formatedDate(date, 'MMMM YYYY')}</span>
  //                     {/* <span>{`${moment(toolbar.date)}`}</span> */}
  //                     <button onClick={() => { goToNext() }}>
  //                         {'>'}
  //                     </button>
  //                 </div>

  //             </div>

  //         </div>
  //     );
  // };

  const CustomDateCellWrapper = ({ children }) => {
    return (
      <div
        className="rbc-day-bg rbc-date-cell custom-date-cell"
        style={{ position: "relative", padding: "10px" }}
      >
        {children}
        <div className="button-wrapper">
          <button
            className="add-button"
            onClick={(e) => {
              e.stopPropagation(); // Prevents event bubbling
              alert("Add button clicked!");
            }}
          >
            +
          </button>
        </div>
      </div>
    );
  };

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
          <Button variant="outline-white" className="btn-icon-text ">
            {" "}
            <i className="material-symbols-outlined btn-outline">menu</i>Hide
            Filter
          </Button>
          <Button variant="outline-white" className="btn-icon-text ">
            {" "}
            <i className="material-symbols-outlined btn-outline">
              keyboard_backspace
            </i>
            Show Filter
          </Button>
        </div>
      </div>
    );
  };

  const handleSelectEvent = (event) => {
    console.log(event);
  };
  const [selectedMonth, setSelectedMonth] = useState<any>(null);
  const handleNavigateEvent = (event) => {
    const currentMonth = formatedDate(new Date(event), "YYYY-MM");
    setSelectedMonth(currentMonth);
  };

  function customEventView({ event }) {
    return (
      <div key={Math.random()}>
        <div className={`rbc-event-primary`}>
          <p>
            {" "}
            <b className="text-black">{event.title} </b>{" "}
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
              <div className="sider-bar">
                <div className="cal-side-title">
                  <div className="title-text">
                    <h4>Filter</h4>
                  </div>
                  <div className="reset-btn">
                    <a href="">Reset Filters </a>
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
                        <h4>24 Classes</h4>
                      </div>
                    </div>
                    <div className="classes-details">
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
                  components={{
                    event: customEventView,
                    toolbar: customToolbar,
                    // dateCellWrapper: CustomDateCellWrapper
                  }}
                  popup
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
