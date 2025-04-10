import React from 'react'
import { Badge, Card, Col, Form, Row } from 'react-bootstrap';
import DatePicker from "react-datepicker";
import eventChart1 from "/assets/images/chart-1.svg";
import eventChart2 from "/assets/images/chart-2.svg";
import eventChart3 from "/assets/images/chart-3.svg";
import PendingEvents from './PendingEvents';
import CompletEvents from './CompletEvents';
import PendingTasks from './PendingTasks';
import CompletTasks from './CompletTasks';

const Dashboard = () => {
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
                <div className="page-title-right">
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
                </div>
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
                                      <Form.Group className="form-group" controlId="exampleForm.ControlInput1">
                                        <Form.Select aria-label="Default select example">
                                            <option>This Week</option>
                                            <option value="1">This Week</option>
                                            <option value="2">Last Week</option>
                                            <option value="3">Last Day</option>
                                        </Form.Select>
                                      </Form.Group>
                                    </div>
                                </div>
                                <div className="chart-with-details primary-chart">
                                  <div className="chart-box">
                                    <img src={eventChart1} alt="OpenPlaner" />
                                  </div>
                                  <div className="chart-details">
                                    <div className="event-deta total-event">
                                      <div className="event-title">
                                        <h4><span></span>Total Events</h4>
                                      </div>
                                      <div className="event-nub"><h4>50</h4></div>
                                    </div>
                                    <div className="event-deta complet-event">
                                      <div className="event-title">
                                        <h4><span></span>Completed Events</h4>
                                      </div>
                                      <div className="event-nub"><h4>15</h4></div>
                                    </div>
                                  </div>
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
                                      <Form.Group className="form-group" controlId="exampleForm.ControlInput1">
                                        <Form.Select aria-label="Default select example">
                                            <option>This Week</option>
                                            <option value="1">This Week</option>
                                            <option value="2">Last Week</option>
                                            <option value="3">Last Day</option>
                                        </Form.Select>
                                      </Form.Group>
                                    </div>
                                </div>
                                <div className="chart-with-details success-chart">
                                  <div className="chart-box">
                                    <img src={eventChart2} alt="OpenPlaner" />
                                  </div>
                                  <div className="chart-details">
                                    <div className="event-deta total-event">
                                      <div className="event-title">
                                        <h4><span></span>Total Tasks</h4>
                                      </div>
                                      <div className="event-nub"><h4>250</h4></div>
                                    </div>
                                    <div className="event-deta complet-event">
                                      <div className="event-title">
                                        <h4><span></span>Completed Tasks</h4>
                                      </div>
                                      <div className="event-nub"><h4>200</h4></div>
                                    </div>
                                  </div>
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
                                      <Form.Group className="form-group" controlId="exampleForm.ControlInput1">
                                        <Form.Select aria-label="Default select example">
                                            <option>This Week</option>
                                            <option value="1">This Week</option>
                                            <option value="2">Last Week</option>
                                            <option value="3">Last Day</option>
                                        </Form.Select>
                                      </Form.Group>
                                    </div>
                                </div>
                                <div className="chart-with-details warning-chart">
                                  <div className="chart-box">
                                    <img src={eventChart3} alt="OpenPlaner" />
                                  </div>
                                  <div className="chart-details">
                                    <div className="event-deta total-event">
                                      <div className="event-title">
                                        <h4><span></span>Total Courses</h4>
                                      </div>
                                      <div className="event-nub"><h4>5</h4></div>
                                    </div>
                                    <div className="event-deta complet-event">
                                      <div className="event-title">
                                        <h4><span></span>Completed Courses</h4>
                                      </div>
                                      <div className="event-nub"><h4>3</h4></div>
                                    </div>
                                  </div>
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
                                            className="nav-link active"
                                            id="nav-pendingevent-tab"
                                            data-bs-toggle="tab"
                                            data-bs-target="#nav-pendingevent"
                                            type="button"
                                            role="tab"
                                            aria-controls="nav-pendingevent"
                                            aria-selected="true"
                                        >
                                            {" "}
                                            Pending Events <Badge bg="light-grey" className='rounded-pill'>5</Badge>
                                        </button>
                                        <button
                                            className="nav-link"
                                            id="nav-completevent-tab"
                                            data-bs-toggle="tab"
                                            data-bs-target="#nav-completevent"
                                            type="button"
                                            role="tab"
                                            aria-controls="nav-completevent"
                                            aria-selected="false"
                                        >
                                            Completed Events <Badge bg="light-grey" className='rounded-pill'>3</Badge>
                                        </button>
                                        <button
                                            className="nav-link"
                                            id="nav-pendingtask-tab"
                                            data-bs-toggle="tab"
                                            data-bs-target="#nav-pendingtask"
                                            type="button"
                                            role="tab"
                                            aria-controls="nav-pendingtask"
                                            aria-selected="false"
                                        >
                                            Pending Tasks <Badge bg="light-grey" className='rounded-pill'>4</Badge>
                                        </button>
                                        <button
                                            className="nav-link"
                                            id="nav-complettask-tab"
                                            data-bs-toggle="tab"
                                            data-bs-target="#nav-complettask"
                                            type="button"
                                            role="tab"
                                            aria-controls="nav-complettask"
                                            aria-selected="false"
                                        >
                                            Completed Tasks <Badge bg="light-grey" className='rounded-pill'>2</Badge>
                                        </button>
                                    </div>
                                </div>
                            </nav>
                          </div>
                          <div className="dash-data-table">
                            <div>                            
                              <div className="tab-content" id="nav-tabContent">
                                  <div
                                  className="tab-pane fade show active"
                                  id="nav-pendingevent"
                                  role="tabpanel"
                                  aria-labelledby="nav-pendingevent-tab"
                                  >
                                      <div className="tab-content-container">  
                                          <PendingEvents/>
                                      </div>
                                  </div>
                                  <div
                                  className="tab-pane fade"
                                  id="nav-completevent"
                                  role="tabpanel"
                                  aria-labelledby="nav-completevent-tab"
                                  >
                                      <div className="tab-content-container">
                                          <CompletEvents/>
                                      </div>
                                  </div>
                                  <div
                                  className="tab-pane fade"
                                  id="nav-pendingtask"
                                  role="tabpanel"
                                  aria-labelledby="nav-pendingtask-tab"
                                  >
                                      <div className="tab-content-container">
                                          <PendingTasks/>
                                      </div>
                                  </div>
                                  <div
                                  className="tab-pane fade"
                                  id="nav-complettask"
                                  role="tabpanel"
                                  aria-labelledby="nav-complettask-tab"
                                  >
                                      <div className="tab-content-container">
                                        <CompletTasks/>
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
    </>
  )
}

export default Dashboard;