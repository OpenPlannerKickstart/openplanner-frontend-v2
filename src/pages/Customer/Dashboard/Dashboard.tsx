import React from 'react'
import { Card, Col, Form, Row } from 'react-bootstrap';
import DatePicker from "react-datepicker";
import eventChart1 from "/assets/images/chart-1.svg";
import eventChart2 from "/assets/images/chart-2.svg";
import eventChart3 from "/assets/images/chart-3.svg";

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
                    </div>
                </div>
            </div>
        </div>
    </>
  )
}

export default Dashboard;