import React, { useState } from 'react'
import { Button, Collapse, Table } from 'react-bootstrap'
import { connect } from 'react-redux'

const Events = (props) => {
  const [open, setOpen] = useState(false);
  return (
    <>
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
                              <button type="button" className="btn btn-icon-text btn-light-danger btn-xs">
                              <i className="th th-outline-book"></i>TCU Academic Calendar
                              </button>
                            </div>
                        </div>
                      </td>                      
                      <td>4:40 PM - 4:40 PM</td>
                      <td className="tbl-action">
                        <div className="tbl-action-group">
                          <button
                            className="btn btn-xs btn-icon btn-transparent"
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
                              <button type="button" className="btn btn-icon-text btn-light-white text-primary btn-xs">
                              <i className="th th-outline-book"></i>TCU Academic Calendar
                              </button>
                            </div>
                        </div>
                      </td>                      
                      <td>4:40 PM - 4:40 PM</td>
                      <td className="tbl-action">
                        <div className="tbl-action-group">
                          <button
                            className="btn btn-xs btn-icon btn-transparent"
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
                              <button type="button" className="btn btn-icon-text btn-light-white text-primary btn-xs">
                              <i className="th th-outline-book"></i>TCU Academic Calendar
                              </button>
                            </div>
                        </div>
                      </td>                      
                      <td>4:40 PM - 4:40 PM</td>
                      <td className="tbl-action">
                        <div className="tbl-action-group">
                          <button
                            className="btn btn-xs btn-icon btn-transparent"
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
                              <button type="button" className="btn btn-icon-text btn-light-danger btn-xs">
                              <i className="th th-outline-book"></i>TCU Academic Calendar
                              </button>
                            </div>
                        </div>
                      </td>                      
                      <td>4:40 PM - 4:40 PM</td>
                      <td className="tbl-action">
                        <div className="tbl-action-group">
                          <button
                            className="btn btn-xs btn-icon btn-transparent"
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
              <Button className='event-collapes-btn'
                  onClick={() => setOpen(!open)}
                  aria-controls="example-collapse-text"
                  aria-expanded={open}
                >
                  Past Events
                  <button className="btn btn-sm btn-icon btn-outline-white"><i className="th th-outline-add-circle"></i></button>
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
                        <tr>                      
                          <td>
                            <div className="event-name-tooltip">
                                <div className="enevt-name"><h3>Innovative Approaches to Modern Education</h3></div>
                                <div className="event-tool">
                                  <button type="button" className="btn btn-icon-text btn-light-white text-primary btn-xs">
                                  <i className="th th-outline-book"></i>TCU Academic Calendar
                                  </button>
                                </div>
                            </div>
                          </td>                      
                          <td>4:40 PM - 4:40 PM</td>
                          <td className="tbl-action">
                            <div className="tbl-action-group">
                              <button
                                className="btn btn-xs btn-icon btn-transparent"
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
                                  <button type="button" className="btn btn-icon-text btn-light-danger btn-xs">
                                  <i className="th th-outline-book"></i>TCU Academic Calendar
                                  </button>
                                </div>
                            </div>
                          </td>                      
                          <td>4:40 PM - 4:40 PM</td>
                          <td className="tbl-action">
                            <div className="tbl-action-group">
                              <button
                                className="btn btn-xs btn-icon btn-transparent"
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
    </>
  )
}

const mapStateToProps = (state) => ({})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(Events)