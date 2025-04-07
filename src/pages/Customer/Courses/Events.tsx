import React, { useState } from 'react'
import { Badge, Button, Collapse, Table } from 'react-bootstrap'
import { connect } from 'react-redux'

const Events = (props) => {
  const [open, setOpen] = useState(false);
  return (
    <>
    <div className="tab-body-container">    
      <div className="event-main-wrapper">
        <div className="event-card">
          <div className="due-event-box">
            <div className="card-title">
              <h4>Due on Friday, March 7</h4>
            </div>
            <div className="card-body">
            <div className="table-responsive">
                <Table className="table-theme table-bordered">
                  <thead className="border-less">
                    <tr>                      
                      <th>Event Name</th>
                      <th>Time</th>
                      <th className="text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>                      
                      <td>
                        <div className="event-name-tooltip">
                            <div className="enevt-name"><h3>Innovative Approaches to Modern Education</h3></div>
                            <div className="event-tool">                                                         
                              <Badge bg="danger-bg"><i className="th th-outline-book"></i>TCU Academic Calendar</Badge>
                            </div>
                        </div>
                      </td>                      
                      <td>4:40 PM - 4:40 PM</td>
                      <td className="tbl-action">
                        <div className="tbl-action-group">
                          <button
                            className="btn btn-xs btn-icon btn-transparent check-icon"
                          >
                            {" "}
                            <i className="th th-outline-tick-circle"></i>
                          </button>
                          <button className="btn btn-xs btn-icon btn-transparent">
                            {" "}
                            <i className="th th-outline-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                    <tr className='active-table'>                      
                      <td>
                        <div className="event-name-tooltip">
                            <div className="enevt-name"><h3>Innovative Approaches to Modern Education</h3></div>
                            <div className="event-tool">
                              <Badge bg="primary-bg"><i className="th th-outline-book"></i>History Unfolded</Badge>
                            </div>
                        </div>
                      </td>                      
                      <td>4:40 PM - 4:40 PM</td>
                      <td className="tbl-action">
                        <div className="tbl-action-group">
                          <button
                            className="btn btn-xs btn-icon btn-transparent check-icon"
                          >
                            {" "}
                            <i className="th th-outline-tick-circle"></i>
                          </button>
                          <button className="btn btn-xs btn-icon btn-transparent">
                            {" "}
                            <i className="th th-outline-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </div>
            </div>
          </div>
        </div>
        <div className="event-card">
          <div className="due-event-box">
            <div className="card-title">
              <h4>Due on Friday, March 7</h4>
            </div>
            <div className="card-body">
            <div className="table-responsive">
                <Table className="table-theme table-bordered">
                  <thead className="border-less">
                    <tr>                      
                      <th>Event Name</th>
                      <th>Time</th>
                      <th className="text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>                      
                      <td>
                        <div className="event-name-tooltip">
                            <div className="enevt-name"><h3>Innovative Approaches to Modern Education</h3></div>
                            <div className="event-tool">
                            <Badge bg="danger-bg"><i className="th th-outline-book"></i>TCU Academic Calendar</Badge>
                            </div>
                        </div>
                      </td>                      
                      <td>4:40 PM - 4:40 PM</td>
                      <td className="tbl-action">
                        <div className="tbl-action-group">
                          <button
                            className="btn btn-xs btn-icon btn-transparent check-icon"
                          >
                            {" "}
                            <i className="th th-outline-tick-circle"></i>
                          </button>
                          <button className="btn btn-xs btn-icon btn-transparent">
                            {" "}
                            <i className="th th-outline-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                    <tr className='active-table'>                      
                      <td>
                        <div className="event-name-tooltip">
                            <div className="enevt-name"><h3>Innovative Approaches to Modern Education</h3></div>
                            <div className="event-tool">
                            <Badge bg="primary-bg"><i className="th th-outline-book"></i>History Unfolded</Badge>
                            </div>
                        </div>
                      </td>                      
                      <td>4:40 PM - 4:40 PM</td>
                      <td className="tbl-action">
                        <div className="tbl-action-group">
                          <button
                            className="btn btn-xs btn-icon btn-transparent check-icon"
                          >
                            {" "}
                            <i className="th th-outline-tick-circle"></i>
                          </button>
                          <button className="btn btn-xs btn-icon btn-transparent">
                            {" "}
                            <i className="th th-outline-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </div>
            </div>
          </div>
        </div>
        <div className="event-card">
          <div className="due-event-box post-event">
            <div className="card-title">
              <Button className='event-collapes-btn'
                  onClick={() => setOpen(!open)}
                  aria-controls="example-collapse-text"
                  aria-expanded={open}
                >
                  Past Events
                  <button className="btn btn-xs btn-icon btn-transparent collapes-btn"><i className="th th-outline-arrow-right-3"></i></button>
              </Button>
            </div>
            <div className="card-body">
              <Collapse in={open}>
                <div id="example-collapse-text">
                  <div className="table-responsive">
                    <Table className="table-theme table-bordered">
                      <thead className="border-less">
                        <tr>                      
                          <th>Event Name</th>
                          <th>Time</th>
                          <th className="text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className='active-table'>                      
                          <td>
                            <div className="event-name-tooltip">
                                <div className="enevt-name"><h3>Innovative Approaches to Modern Education</h3></div>
                                <div className="event-tool">
                                <Badge bg="primary-bg"><i className="th th-outline-book"></i>History Unfolded</Badge>
                                </div>
                            </div>
                          </td>                      
                          <td>4:40 PM - 4:40 PM</td>
                          <td className="tbl-action">
                            <div className="tbl-action-group">
                              <button
                                className="btn btn-xs btn-icon btn-transparent check-icon"
                              >
                                {" "}
                                <i className="th th-outline-tick-circle"></i>
                              </button>
                              <button className="btn btn-xs btn-icon btn-transparent">
                                {" "}
                                <i className="th th-outline-trash"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                        <tr>                      
                          <td>
                            <div className="event-name-tooltip">
                                <div className="enevt-name"><h3>Innovative Approaches to Modern Education</h3></div>
                                <div className="event-tool">
                                <Badge bg="danger-bg"><i className="th th-outline-book"></i>TCU Academic Calendar</Badge>
                                </div>
                            </div>
                          </td>                      
                          <td>4:40 PM - 4:40 PM</td>
                          <td className="tbl-action">
                            <div className="tbl-action-group">
                              <button
                                className="btn btn-xs btn-icon btn-transparent check-icon"
                              >
                                {" "}
                                <i className="th th-outline-tick-circle"></i>
                              </button>
                              <button className="btn btn-xs btn-icon btn-transparent">
                                {" "}
                                <i className="th th-outline-trash"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </Table>
                  </div>
                </div>
              </Collapse>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}

const mapStateToProps = (state) => ({})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(Events)