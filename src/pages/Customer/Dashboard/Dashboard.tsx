import React, { useEffect, useState } from 'react'
import { Badge, Button, Card, Col, Form, Modal, Row, Table, Tooltip } from 'react-bootstrap';
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
import { customJsonInclude, formatedDate, getDate, isEmptyObjectOrNullUndefiend, isNullUndefinedOrBlank } from '../../../Utility/Helper';
import { FilterComponent } from './FilterComponent';
import { ENUMFORDASHBORD, ENUMFORSTATUS, ENUMFORTASK } from '../../../interfaces/enum';
import { taskListingAPI } from '../../../redux/Service/task';
import Select, { components, ControlProps } from "react-select";
import { chartDropDownData } from '../../../Utility/staticDropDown';
import Chart from "react-google-charts";
import notVoucherFound from "/assets/images/not-voucher-found.svg";
import { isUpdatedSyllabus } from '../../../redux/User/Courses/coursesSlice';
import AddEditEvent from '../../../common/AddSyllabusEvents/AddEditEvent';
import AddEditSyllabus from '../../../common/AddSyllabusEvents/AddEditSyllabus';


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
  const [eventPriority, setEventPriority] = useState<any>(null);
  const [search, setSearch] = useState<any>("");

  const handleEventListing = async () => {
    let reqBody = {
      search,
      status: getStatus(),
      start_date: startDate ? getDate(startDate, "yyyy-MM-DD") : "",
      end_date: endDate ? getDate(endDate, "yyyy-MM-DD") : "",
      syllabus_id: syllabusId,
      priority: eventPriority
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
  }, [startDate, endDate, search, syllabusId, selectedTab, eventPriority])

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
    if (!isNullUndefinedOrBlank(response)) {
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
    if (!isNullUndefinedOrBlank(response)) {
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


  // useEffect(() => {
  //   const delayDebounceFn = setTimeout(() => {
  //     handleSyllabusChartData();
  //     handleTaskChartData();
  //     handleEventChartData();

  //   }, 300);
  //   return () => {
  //     clearTimeout(delayDebounceFn);
  //   }

  // }, [])


  // useEffect(() => {
  //   const delayDebounceFn = setTimeout(() => {
  //     if (syllabusChartFilter) handleSyllabusChartData();
  //     if (taskChartFilter) handleTaskChartData();
  //     if (eventChartFilter) handleEventChartData();
  //   }, 300);
  //   return () => {
  //     clearTimeout(delayDebounceFn);
  //   }

  // }, [eventChartFilter, taskChartFilter, syllabusChartFilter]);

  /** ---------------------chart data api end-----------------------*/


  /** -------------------- show notes start------------------------*/
  const [showNotes, setShowNotes] = useState(false);
  const [noteData, setNoteData] = useState<string>("")
  const handleCloseShowNote = () => { setShowNotes(false); setNoteData("") }
  const handleShowShowNote = (data) => { setShowNotes(true); setNoteData(data) }
  /** -------------------- show notes End------------------------*/


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
    getDashboardCount();
    handleEventChartData();
  }
  /** --------------------Edit event End------------------------*/
  /** -----------------Add/Edit syllabus start---------------------------*/
  const [showSyllabus, setShowSyllabus] = useState(false);
  const handleSyllabusShow = () => setShowSyllabus(true);
  /** -----------------Add/Edit Syllabus end---------------------------*/
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
                        <button type="button" className="btn btn-outline-primary">
                          Today
                        </button>
                        <div className="weekly-shuffle-date-action">
                          <button type="button" className="btn btn-outline-white">
                            <span className="material-symbols-outlined">
                            arrow_forward_ios
                            </span>
                          </button>
                            March 01 - March 07
                          <button type="button" className="btn btn-outline-white">
                            <span className="material-symbols-outlined">
                            arrow_back_ios
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
                  <Badge bg='none'>
                    <span className="badge-color" style={{background:"#E890E7"}}></span>
                    <span className="badge-text">TCU Academic Calendar</span>
                  </Badge>
                  <Badge bg='none'>
                    <span className="badge-color" style={{background:"#CDDC39"}}></span>
                    <span className="badge-text">History Unfolded</span>
                  </Badge>
                </div>
                
                {/* WEEKLY TO-DO's */}
                <div className="weekly-content-box">
                  <Table responsive className="table-responsive table-borderless table-weekly-event">
                    <thead>
                      <tr>
                        <th>Actions</th>
                        <th>Time</th>
                        <th>Priority</th>
                        <th>Event Name</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>

                      {/* GROUP 1 */}
                      <tr className='table-row-blank-timestamp'>
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
                            <div className="content-identifier-bar" style={{background: "#E890E7"}}></div>
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
                            <div className="content-identifier-bar" style={{background: "#CDDC39"}}></div>
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
                      </tr>

                      {/* GROUP 2 */}
                      <tr className='table-row-blank-timestamp'>
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
                            <div className="content-identifier-bar" style={{background: "#E890E7"}}></div>
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
                            <div className="content-identifier-bar" style={{background: "#CDDC39"}}></div>
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
                      </tr>
                    </tbody>
                      </Table>
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
              <div className='notes'>
                {!isNullUndefinedOrBlank(noteData) ? noteData : "You have not Added any Note!!"}
              </div>
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
      {/* Add/Edit event Start */}
      <AddEditEvent show={show} setShow={setShow} handleGetData={handleGetUpdatedData} setEditEventFormData={setEditEventFormData} editEventFormData={editEventFormData} />
      {/* Add/Edit event Event */}
      {/* Add/Edit event Start */}
      <AddEditSyllabus showSyllabus={showSyllabus} setShowSyllabus={setShowSyllabus} handleGetData={handleGetUpdatedData} />
      {/* Add/Edit event Event */}
    </>
  )
}

export default Dashboard;