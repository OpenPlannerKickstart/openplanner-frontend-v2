import React, { useEffect, useState } from 'react'
import { Badge, Button, Card, Col, Form, Modal, Row, Tooltip } from 'react-bootstrap';
import DatePicker from "react-datepicker";
import eventChart1 from "/assets/images/chart-1.svg";
import eventChart2 from "/assets/images/chart-2.svg";
import eventChart3 from "/assets/images/chart-3.svg";
import PendingEvents from './PendingEvents';
import CompletEvents from './CompletEvents';
import PendingTasks from './PendingTasks';
import CompletTasks from './CompletTasks';
import { AppDispatch, RootState } from '../../../redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { dashboardCoursesDataAPI, dashboardEventListingAPI, dashboardEventsDataAPI, dashboardListingCountAPI, dashboardTasksDataAPI, syllabusDropDownAPI } from '../../../redux/Service/User/DashBoard/dashboard';
import { customJsonInclude, getDate, isEmptyObjectOrNullUndefiend, isNullUndefinedOrBlank } from '../../../Utility/Helper';
import { FilterComponent } from './FilterComponent';
import { ENUMFORDASHBORD, ENUMFORSTATUS, ENUMFORTASK } from '../../../interfaces/enum';
import { taskListingAPI } from '../../../redux/Service/task';
import Select, { components, ControlProps } from "react-select";
import { chartDropDownData } from '../../../Utility/staticDropDown';
import Chart from "react-google-charts";
import notVoucherFound from "/assets/images/not-voucher-found.svg";
import { isUpdatedSyllabus } from '../../../redux/User/Courses/coursesSlice';


const Dashboard = () => {
  const dispatch: AppDispatch = useDispatch();

  const coursesData: any = useSelector(
    (state: RootState) => state.CoursesReducer);
  const getStatus = () => {
    return (selectedTab === ENUMFORDASHBORD.COMPLETED_EVENT || selectedTab === ENUMFORDASHBORD.COMPLETED_TASK) ? "Completed" : "Pending";
  };

  /** ------------------selected tab start--------------------------*/
  const [selectedTab, setSelectedTab] = useState<string>(ENUMFORDASHBORD.PENDING_EVENT)
  const onChangeTab = (val) => {
    if (selectedTab !== val) {
      setSelectedTab(val);
    }
  }
  /** ------------------selected tab end--------------------------*/

  /** -----------------event listing api start---------------------------*/
  const [eventData, setEventData] = useState<any>([]);
  const [startDate, setStartDate] = useState<any>(null);
  const [endDate, setEndDate] = useState<any>(null);
  const [syllabusId, setSyllabusId] = useState<any>(null);
  const [search, setSearch] = useState<any>("");

  const handleEventListing = async () => {
    let reqBody = {
      search,
      status: getStatus(),
      start_date: startDate ? getDate(startDate, "yyyy-MM-DD") : "",
      end_date: endDate ? getDate(endDate, "yyyy-MM-DD") : "",
      syllabus_id: syllabusId
    }
    customJsonInclude(reqBody)
    let response = await dispatch(dashboardEventListingAPI(reqBody));
    if (!isNullUndefinedOrBlank(response)) {
      setEventData(response?.payload);

      // handleEventChartData();
    }
  }
  useEffect(() => {
    if (selectedTab === ENUMFORDASHBORD.COMPLETED_EVENT || selectedTab === ENUMFORDASHBORD.PENDING_EVENT) {
      const debounce = () => {
        setTimeout(() => {
          handleEventListing()
        }, 200);
      }
      debounce();
    }
    return () => {
      setEventData([]);
    }
  }, [startDate, endDate, search, syllabusId, selectedTab])

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (coursesData.isUpdatedSyllabusData) {
        handleSyllabusChartData();
        getDashboardCount();
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
        handleEventChartData();
        getDashboardCount();
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
  const [syllabusDropDownData, setSyllabusDropDownData] = useState([]);
  const handleGetDropDownData = async () => {
    const response = await dispatch(syllabusDropDownAPI());
    if (!isNullUndefinedOrBlank(response) && !isEmptyObjectOrNullUndefiend(response?.payload)) {
      setSyllabusDropDownData(response?.payload)
    }
  }

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      handleGetDropDownData();

    }, 300);
    return () => {
      clearTimeout(delayDebounceFn);
    }

  }, [])

  /** --------------------get syllabus dropdown data end------------------------*/


  /** --------------------get task data start------------------------*/
  const [taskData, setTaskData] = useState([]);
  const handleSetTaskData = async () => {
    let requestBody = {
      status: getStatus(),
      filter: 'due_date'
    }
    const response = await dispatch(taskListingAPI(requestBody));
    if (!isNullUndefinedOrBlank(response) && !isEmptyObjectOrNullUndefiend(response?.payload?.tasks)) {
      setTaskData(response?.payload?.tasks);
      getDashboardCount();
      handleTaskChartData();
    }
  }

  useEffect(() => {
    if (selectedTab == ENUMFORDASHBORD.COMPLETED_TASK || selectedTab == ENUMFORDASHBORD.PENDING_TASK) {
      handleSetTaskData();
    }
    return () => {
      setTaskData([]);
    }

  }, [selectedTab])

  /** --------------------get task data end------------------------*/

  /** --------------------get count data start------------------------*/
  const [dashBoardCountData, setDashBoardCountData] = useState<any>(null);
  const getDashboardCount = async () => {
    const response = await dispatch(dashboardListingCountAPI());
    if (!isNullUndefinedOrBlank(response)) {
      setDashBoardCountData(response?.payload)
    }
  }

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      getDashboardCount();
    }, 300);
    return () => {
      clearTimeout(delayDebounceFn);
    }

  }, [])

  /** --------------------get syllabus dropdown data end------------------------*/



  /** ---------------------chart data api start-----------------------*/
  const [eventChartData, setEventChartData] = useState<any>([

  ]);
  const [eventChartFilter, setEventChartFilter] = useState<any>(chartDropDownData[0]?.value);
  const eventOptions = {
    pieHole: 0.6,
    is3D: false,
    tooltip: {
      trigger: "none", // Disables the tooltip
    },
    pieSliceText: "none",
    legend: { position: "none" },
    colors: ["#239BC2", "#BEE6F3"], // Custom colors for pie segments.
    chartArea: { width: "90%", height: "80%" },
  };
  const handleEventChartData = async () => {
    const reqBody = { filter: eventChartFilter };
    const response = await dispatch(dashboardEventsDataAPI(reqBody));
    if (!isNullUndefinedOrBlank(response?.payload)) {
      setEventChartData(response?.payload)
    }
  }

  const taskOptions = {
    pieHole: 0.6,
    is3D: false,
    tooltip: {
      trigger: "none", // Disables the tooltip
    },
    pieSliceText: "none",
    legend: { position: "none" },
    colors: ["#25D076", "#EAFCF2"], // Custom colors for pie segments.
    chartArea: { width: "90%", height: "80%" },
  };
  const [taskChartData, setTaskChartData] = useState<any>([]);
  const [taskChartFilter, setTaskChartFilter] = useState<any>(chartDropDownData[0]?.value)
  const handleTaskChartData = async () => {
    const reqBody = { filter: taskChartFilter };
    const response = await dispatch(dashboardTasksDataAPI(reqBody));
    if (!isNullUndefinedOrBlank(response?.payload)) {
      setTaskChartData(response?.payload)
    }
  }


  const syllabusOptions = {
    pieHole: 0.6,
    is3D: false,
    tooltip: {
      trigger: "none", // Disables the tooltip
    },
    pieSliceText: "none",
    legend: { position: "none" },
    colors: ["#33B3AA", "#EBF9F8"], // Custom colors for pie segments.
    chartArea: { width: "90%", height: "80%" },
  };
  const [syllabusChartData, setSyllabusChartData] = useState<any>([]);
  const [syllabusChartFilter, setSyllabusChartFilter] = useState<any>(chartDropDownData[0]?.value)
  const handleSyllabusChartData = async () => {
    const reqBody = { filter: syllabusChartFilter };
    const response = await dispatch(dashboardCoursesDataAPI(reqBody));
    if (!isNullUndefinedOrBlank(response?.payload)) {
      setSyllabusChartData(response?.payload)
    }
  }


  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      handleSyllabusChartData();
      handleTaskChartData();
      handleEventChartData();

    }, 300);
    return () => {
      clearTimeout(delayDebounceFn);
    }

  }, [])


  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (syllabusChartFilter) handleSyllabusChartData();
      if (taskChartFilter) handleTaskChartData();
      if (eventChartFilter) handleEventChartData();
    }, 300);
    return () => {
      clearTimeout(delayDebounceFn);
    }

  }, [eventChartFilter, taskChartFilter, syllabusChartFilter]);

  /** ---------------------chart data api end-----------------------*/


  /** -------------------- show notes start------------------------*/
  const [showNotes, setShowNotes] = useState(false);
  const [noteData, setNoteData] = useState<string>("")
  const handleCloseShowNote = () => { setShowNotes(false); setNoteData("") }
  const handleShowShowNote = (data) => { setShowNotes(true); setNoteData(data) }
  /** -------------------- show notes End------------------------*/


  return (
    <>
      <div className="page-content dashboard-main">
        <div className="content-area">
          <div className="page-title-wrapper">
            <div className="page-title-left">
              <div className="page-title">
                <h4>Dashboard</h4>
                <p>View your upcoming events and progress for the week!</p>
              </div>
            </div>
            {/* <div className="page-title-right">
              <Form.Group className="form-group form-group-sm mb-0">
                <div className="react-datepicker-container form-group-icon-start">
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
            </div> */}
          </div>
          <div className="page-content-wrapper h-100">
            <div className="dashboard-main-wrapper">
              {/* chart box section */}
              <div className="chart-main-box">
                <Row>
                  <Col md={4}>
                    <Card className="event-main-card">
                      <Card.Body>
                        <div className="card-title-dropdown">
                          <div className="title-text">
                            <h3>Events</h3>
                          </div>
                          <div className="title-dropdown">
                            <Form.Group className="form-group form-group-sm" controlId="exampleForm.ControlInput1">
                              {/* <Form.Select aria-label="Default select example">
                                <option>This Week</option>
                                <option value="1">This Week</option>
                                <option value="2">Last Week</option>
                                <option value="3">Last Day</option>
                              </Form.Select> */}
                              <Select
                                options={chartDropDownData}
                                placeholder={<div>Select</div>}
                                menuPosition="fixed"
                                className="react-select-container"
                                onChange={(selectedOption: any) => {
                                  setEventChartFilter(selectedOption?.value)
                                }}
                                isClearable={true}
                                value={chartDropDownData?.filter(({ value }) => {
                                  return (
                                    value === eventChartFilter
                                  );
                                })}
                              />
                            </Form.Group>
                          </div>
                        </div>
                        <div className="chart-with-details primary-chart">
                          {!isEmptyObjectOrNullUndefiend(eventChartData) ?
                            <>
                              <div className="chart-box">
                                {/* <img src={eventChart1} alt="OpenPlaner" /> */}

                                <Chart
                                  chartType="PieChart"
                                  height="140px"
                                  width="100%"
                                  data={eventChartData}
                                  options={eventOptions}
                                />
                              </div>
                              <div className="chart-details">
                                <div className="event-deta total-event">
                                  <div className="event-title">
                                    <h4><span></span>Total Events</h4>
                                  </div>
                                  <div className="event-nub"><h4>{!isEmptyObjectOrNullUndefiend(eventChartData) ? eventChartData[1][1] + eventChartData[2][1] : 0}</h4></div>
                                </div>
                                <div className="event-deta complet-event">
                                  <div className="event-title">
                                    <h4><span></span>Completed Events</h4>
                                  </div>
                                  <div className="event-nub"><h4>{!isEmptyObjectOrNullUndefiend(eventChartData) ? eventChartData[1][1] : 0}</h4></div>
                                </div>
                              </div>
                            </>
                            :
                            <>
                              <div className="no-records-found no-records-found-inner h-100">
                                {/* <div className="no-records-found-image">
                                  <img src={notVoucherFound} alt="OpenPlaner" />
                                </div> */}
                                <div className="no-records-found-text ">
                                  {/* <img src={notVoucherFound} alt="OpenPlaner" /> */}
                                  <h6>No data found!</h6>
                                </div>
                              </div>

                            </>
                          }
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={4}>
                    <Card className="event-main-card">
                      <Card.Body>
                        <div className="card-title-dropdown">
                          <div className="title-text">
                            <h3>Tasks</h3>
                          </div>
                          <div className="title-dropdown">
                            <Form.Group className="form-group form-group-sm" controlId="exampleForm.ControlInput1">
                              {/* <Form.Select aria-label="Default select example">
                                <option>This Week</option>
                                <option value="1">This Week</option>
                                <option value="2">Last Week</option>
                                <option value="3">Last Day</option>
                              </Form.Select> */}

                              <Select
                                options={chartDropDownData}
                                placeholder={<div>Select</div>}
                                menuPosition="fixed"
                                className="react-select-container"
                                onChange={(selectedOption: any) => {
                                  setTaskChartFilter(selectedOption?.value)
                                }}
                                isClearable={true}
                                value={chartDropDownData?.filter(({ value }) => {
                                  return (
                                    value === taskChartFilter
                                  );
                                })}
                              />
                            </Form.Group>
                          </div>
                        </div>
                        <div className="chart-with-details success-chart">

                          {!isEmptyObjectOrNullUndefiend(taskChartData) ?
                            <>

                              <div className="chart-box">
                                {/* <img src={eventChart2} alt="OpenPlaner" /> */}
                                <Chart
                                  chartType="PieChart"
                                  height="140px"
                                  width="100%"
                                  data={taskChartData}
                                  options={taskOptions}
                                />
                              </div>
                              <div className="chart-details">
                                <div className="event-deta total-event">
                                  <div className="event-title">
                                    <h4><span></span>Total Tasks</h4>
                                  </div>
                                  <div className="event-nub"><h4>{!isEmptyObjectOrNullUndefiend(taskChartData) ? taskChartData[1][1] + taskChartData[2][1] : 0}</h4></div>
                                </div>
                                <div className="event-deta complet-event">
                                  <div className="event-title">
                                    <h4><span></span>Completed Tasks</h4>
                                  </div>
                                  <div className="event-nub"><h4>{!isEmptyObjectOrNullUndefiend(taskChartData) ? taskChartData[1][1] : 0}</h4></div>
                                </div>
                              </div>
                            </> :
                            <>
                              <div className="no-records-found no-records-found-inner h-100">
                                {/* <div className="no-records-found-image">
                                  <img src={notVoucherFound} alt="OpenPlaner" />
                                </div> */}
                                <div className="no-records-found-text">
                                  <h6>No data found!</h6>
                                </div>
                              </div>

                            </>
                          }

                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={4}>
                    <Card className="event-main-card">
                      <Card.Body>
                        <div className="card-title-dropdown">
                          <div className="title-text">
                            <h3>Courses</h3>
                          </div>
                          <div className="title-dropdown">
                            <Form.Group className="form-group form-group-sm" controlId="exampleForm.ControlInput1">
                              {/* <Form.Select aria-label="Default select example">
                                <option>This Week</option>
                                <option value="1">This Week</option>
                                <option value="2">Last Week</option>
                                <option value="3">Last Day</option>
                              </Form.Select> */}


                              <Select
                                options={chartDropDownData}
                                placeholder={<div>Select</div>}
                                menuPosition="fixed"
                                className="react-select-container"
                                onChange={(selectedOption: any) => {
                                  setSyllabusChartFilter(selectedOption?.value)
                                }}
                                isClearable={true}
                                value={chartDropDownData?.filter(({ value }) => {
                                  return (
                                    value === syllabusChartFilter
                                  );
                                })}
                              />
                            </Form.Group>
                          </div>
                        </div>
                        <div className="chart-with-details warning-chart">

                          {!isEmptyObjectOrNullUndefiend(syllabusChartData) ?
                            <>

                              <div className="chart-box">
                                {/* <img src={eventChart3} alt="OpenPlaner" /> */}
                                <Chart
                                  chartType="PieChart"
                                  height="140px"
                                  width="100%"
                                  data={syllabusChartData}
                                  options={syllabusOptions}
                                />

                              </div>
                              <div className="chart-details">
                                <div className="event-deta total-event">
                                  <div className="event-title">
                                    <h4><span></span>Total Courses</h4>
                                  </div>
                                  <div className="event-nub"><h4>{!isEmptyObjectOrNullUndefiend(syllabusChartData) ? syllabusChartData[1][1] + syllabusChartData[2][1] : 0}</h4></div>
                                </div>
                                <div className="event-deta complet-event">
                                  <div className="event-title">
                                    <h4><span></span>Completed Courses</h4>
                                  </div>
                                  <div className="event-nub"><h4>{!isEmptyObjectOrNullUndefiend(syllabusChartData) ? syllabusChartData[1][1] : 0}</h4></div>
                                </div>
                              </div>
                            </> :
                            <>
                              <div className="no-records-found no-records-found-inner h-100">
                                {/* <div className="no-records-found-image">
                                  <img src={notVoucherFound} alt="OpenPlaner" />
                                </div> */}
                                <div className="no-records-found-text">
                                  <h6>No data found!</h6>
                                </div>
                              </div>

                            </>
                          }
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </div>
              {/* data-table section */}
              <div className="weekly-data-container">
                <div className="main-title">
                  <h4>My Week</h4>
                </div>
                <div className="weekly-content-box">
                  <div className="nav-tabs-outer nav-tabs-style2">
                    <nav>
                      <div className="nav nav-tabs" id="nav-tab" role="tablist">
                        <div className="button-group">
                          <button
                            className={`nav-link ${selectedTab === ENUMFORDASHBORD.PENDING_EVENT ? "active" : ""}`}
                            id="nav-pendingevent-tab"
                            data-bs-toggle="tab"
                            data-bs-target="#nav-pendingevent"
                            type="button"
                            role="tab"
                            aria-controls="nav-pendingevent"
                            aria-selected="true"
                            onClick={() => { onChangeTab(ENUMFORDASHBORD.PENDING_EVENT) }}
                          >
                            Pending Events <Badge bg="light-grey" className='rounded-pill'>{!isNullUndefinedOrBlank(dashBoardCountData?.SyllabusEvent?.pendingResult) ? dashBoardCountData?.SyllabusEvent?.pendingResult : 0}</Badge>
                          </button>
                          <button
                            className={`nav-link ${selectedTab === ENUMFORDASHBORD.COMPLETED_EVENT ? "active" : ""}`}
                            id="nav-completevent-tab"
                            data-bs-toggle="tab"
                            data-bs-target="#nav-completevent"
                            type="button"
                            role="tab"
                            aria-controls="nav-completevent"
                            aria-selected="false"
                            onClick={() => { onChangeTab(ENUMFORDASHBORD.COMPLETED_EVENT) }}
                          >
                            Completed Events <Badge bg="light-grey" className='rounded-pill'>{!isNullUndefinedOrBlank(dashBoardCountData?.SyllabusEvent?.completedResult) ? dashBoardCountData?.SyllabusEvent?.completedResult : 0}</Badge>
                          </button>
                          <button
                            className={`nav-link ${selectedTab === ENUMFORDASHBORD.PENDING_TASK ? "active" : ""}`}
                            id="nav-pendingtask-tab"
                            data-bs-toggle="tab"
                            data-bs-target="#nav-pendingtask"
                            type="button"
                            role="tab"
                            aria-controls="nav-pendingtask"
                            aria-selected="false"
                            onClick={() => { onChangeTab(ENUMFORDASHBORD.PENDING_TASK) }}
                          >
                            Pending Tasks <Badge bg="light-grey" className='rounded-pill'>{!isNullUndefinedOrBlank(dashBoardCountData?.Task?.pendingResult) ? dashBoardCountData?.Task?.pendingResult : 0}</Badge>
                          </button>
                          <button
                            className={`nav-link ${selectedTab === ENUMFORDASHBORD.COMPLETED_TASK ? "active" : ""}`}
                            id="nav-complettask-tab"
                            data-bs-toggle="tab"
                            data-bs-target="#nav-complettask"
                            type="button"
                            role="tab"
                            aria-controls="nav-complettask"
                            aria-selected="false"
                            onClick={() => { onChangeTab(ENUMFORDASHBORD.COMPLETED_TASK) }}
                          >
                            Completed Tasks <Badge bg="light-grey" className='rounded-pill'>{!isNullUndefinedOrBlank(dashBoardCountData?.Task?.completedResult) ? dashBoardCountData?.Task?.completedResult : 0}</Badge>
                          </button>
                        </div>
                      </div>
                    </nav>
                  </div>
                  <div className="dash-data-table">
                    <div>
                      <div className="tab-content" id="nav-tabContent">
                        <div
                          className={`tab-pane fade ${ENUMFORDASHBORD.PENDING_EVENT == selectedTab ? "show active" : ""}`}
                          id="nav-pendingevent"
                          role="tabpanel"
                          aria-labelledby="nav-pendingevent-tab"
                        >
                          <div className="tab-content-container">
                            <FilterComponent syllabusDropDownData={syllabusDropDownData} setStartDate={setStartDate} setEndDate={setEndDate} setSearch={setSearch} setSyllabusId={setSyllabusId} startDate={startDate} endDate={endDate} search={search} syllabusId={syllabusId} />
                            <PendingEvents eventData={eventData} handleEventListing={handleEventListing} handleShowShowNote={handleShowShowNote} handleEventChartData={handleEventChartData} getDashboardCount={getDashboardCount} />
                          </div>
                        </div>
                        <div
                          className={`tab-pane fade ${ENUMFORDASHBORD.COMPLETED_EVENT == selectedTab ? "show active" : ""}`}
                          id="nav-completevent"
                          role="tabpanel"
                          aria-labelledby="nav-completevent-tab"
                        >
                          <div className="tab-content-container">
                            <FilterComponent syllabusDropDownData={syllabusDropDownData} setStartDate={setStartDate} setEndDate={setEndDate} setSearch={setSearch} setSyllabusId={setSyllabusId} startDate={startDate} endDate={endDate} search={search} syllabusId={syllabusId} />
                            <CompletEvents eventData={eventData} handleEventListing={handleEventListing} handleShowShowNote={handleShowShowNote} getDashboardCount={getDashboardCount} handleEventChartData={handleEventChartData} />
                          </div>
                        </div>
                        <div
                          className={`tab-pane fade ${ENUMFORDASHBORD.PENDING_TASK == selectedTab ? "show active" : ""}`}
                          id="nav-pendingtask"
                          role="tabpanel"
                          aria-labelledby="nav-pendingtask-tab"
                        >
                          <div className="tab-content-container">
                            <PendingTasks taskData={taskData} handleSetTaskData={handleSetTaskData} handleTaskChartData={handleTaskChartData} getDashboardCount={getDashboardCount} />
                          </div>
                        </div>
                        <div
                          className={`tab-pane fade ${ENUMFORDASHBORD.COMPLETED_TASK == selectedTab ? "show active" : ""}`}
                          id="nav-complettask"
                          role="tabpanel"
                          aria-labelledby="nav-complettask-tab"
                        >
                          <div className="tab-content-container">
                            <CompletTasks taskData={taskData} handleSetTaskData={handleSetTaskData} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* note modal start */}
      <Modal
        className="modal-theme modal-confirmation modal-reject"
        show={showNotes}
        onHide={handleCloseShowNote}
        centered
      >
        <Modal.Header>
          <h4 className="modal-title">Your Event Note</h4>
          <button type="button" className="btn-close" onClick={handleCloseShowNote}>
            <i className="material-symbols-outlined">close</i>
          </button>
        </Modal.Header>
        <Modal.Body className='pt-0'>
          <div className="modal-event-container">
            <div>
              <p>
                {!isNullUndefinedOrBlank(noteData) ? noteData : "You have not Added any Note!!"}
              </p>
            </div>
          </div>
          <div className="modal-button-group">
            <Button
              variant="danger"
              className="btn-icon-text btn-md ms-auto"
              onClick={handleCloseShowNote}
            >
              Close
            </Button>
          </div>
        </Modal.Body>
      </Modal>
      {/* note modal end */}

    </>
  )
}

export default Dashboard;