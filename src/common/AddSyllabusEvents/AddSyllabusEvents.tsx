import React, { useEffect, useState } from 'react'
import { Button, Col, Form, Offcanvas, Row } from 'react-bootstrap'
import DefaultAvtar from '/assets/images/avatar-default.svg'
import Select, { components, ControlProps } from "react-select";
import syllabustitleLogo from "/assets/images/syllabus-title-img.svg";
import eventtitleLogo from "/assets/images/event-title-img.svg";
import checktitleLogo from "/assets/images/title-check-icon.svg";
import DatePicker from "react-datepicker";

const AddSyllabusEvents = (props) => {

    console.log(props)
 const [showAddSyllabusEvents, setShowAddSyllabusEvents] = useState(false);

  const handleCloseAddSyllabusEvents = () => {setShowAddSyllabusEvents(false);props.setShowEvent(false)}
  const toggleShowAddSyllabusEvents = () => setShowAddSyllabusEvents((s) => !s);
  useEffect(() => {
    if(props?.show){
        setShowAddSyllabusEvents(props?.show);
    }

  
    return () => {
      
    }
  }, [props?.show])
  

  return (
    <>
          {/***** Offcanvas start *****/}
          <div className="add-syllabus-event-wrapper">
              <Offcanvas
                className="edit-course-canvas add-syllabus-event"
                show={showAddSyllabusEvents}
                placement={"end"}
                onHide={handleCloseAddSyllabusEvents}
              >
                <Offcanvas.Header>
                  <Offcanvas.Title>
                  Add New <span>Syllabus</span> / <span>Event</span>
                  </Offcanvas.Title>
                  <button type="button" className="btn-close" onClick={handleCloseAddSyllabusEvents}>
                  <i className="material-symbols-outlined">close</i>
                  </button>
                </Offcanvas.Header>
                <Offcanvas.Body>                  
                     <div className="add-syllabus-container">
                        <div className="main-title">
                            <div className="title-text">
                                <h4>Choose any option to add information according to the needs</h4>
                                <div className="title-with-img">
                                    <div className="add-syllabus-event-btn active">
                                        <div className="event-img">
                                          <img src={syllabustitleLogo} alt="Open Planer" />
                                        </div>
                                        <div className="syllabus-title-with-check">
                                          <h4>Add Syllabus</h4>
                                          <div className="check-icon">
                                            <img src={checktitleLogo} alt="Open Planer" />
                                          </div>
                                        </div>
                                    </div>
                                    <div className="add-syllabus-event-btn">
                                        <div className="event-img">
                                          <img src={eventtitleLogo} alt="Open Planer" />
                                        </div>
                                        <div className="syllabus-title-with-check">
                                          <h4>Add Event</h4>
                                          <div className="check-icon">
                                            <img src={checktitleLogo} alt="Open Planer" />
                                          </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="main-syllabus-container">
                            <div className="syllabus-details-container">
                                <div className="detail-body-container">
                                  <div className="syllabus-detail-body">
                                    <div className="title-text">
                                      <h4>Syllabus Details</h4>
                                    </div>
                                    <Form.Group
                                      className="form-group"
                                      controlId="exampleForm.ControlInput1"
                                    >
                                      <Form.Label>Course Title</Form.Label>
                                      <div className="form-group-icon-start">
                                        <i className="material-symbols-outlined">menu_book</i>
                                        <Form.Control type="text" placeholder="Enter Course Title" />
                                      </div>
                                    </Form.Group>
                                    <Form.Group className="form-group">
                                    <Form.Label>Upload Syllabus Here</Form.Label>
                                    <div className='attachments-container'>
                                        <div className='attachments-content'>
                                            <button className='btn btn-attachments'><i className="bi bi-upload"></i></button>
                                            <p>Drag and Drop file here or <span className='text-primary'>Choose file</span></p>
                                        </div>
                                        <Form.Control type="file" multiple />
                                    </div>
                                    <div className='attachments-upload-grid-container'>
                                        <div className='attachments-upload-row'>
                                            <div className='attachments-upload-col'>
                                                <div className='card-attachments-upload'>
                                                    <div className='attachments-image'>
                                                        <img src={DefaultAvtar} alt="DefaultAvtar" />
                                                    </div>
                                                    <button className="btn-close"><i className="material-symbols-outlined">close</i></button>
                                                </div>
                                            </div>
                                            <div className='attachments-upload-col'>
                                                <div className='card-attachments-upload'>
                                                    <div className='attachments-image'>
                                                        <img src={DefaultAvtar} alt="DefaultAvtar" />
                                                    </div>
                                                    <button className="btn-close"><i className="material-symbols-outlined">close</i></button>
                                                </div>
                                            </div>
                                            <div className='attachments-upload-col'>
                                                <div className='card-attachments-upload'>
                                                    <div className='attachments-image'>
                                                        <img src={DefaultAvtar} alt="DefaultAvtar" />
                                                    </div>
                                                    <button className="btn-close"><i className="material-symbols-outlined">close</i></button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="file-notification">
                                      <p>Accepted file types: pdf</p>
                                      <p>Please allow 1 to 2 minutes for the syllabus to be processed.</p>
                                    </div>
                                    </Form.Group>
                                    <div className="Reminder-box">
                                      <div className="title-with-switch">
                                        <div className="title-text"><h4>Reminder (Notify me before start date)</h4></div>
                                        <div className="switch-box ">
                                            <label className="switch" htmlFor="switch">
                                                <input type="checkbox" id='switch'/>
                                                <div className="slider round"></div>
                                            </label>
                                        </div>
                                      </div>
                                      <div className="remider-fields">
                                        <Form.Group className='form-group'>
                                          <Form.Label>Unit</Form.Label>
                                          <Select
                                                  placeholder={<div>Days</div>}
                                                  menuPosition="fixed"
                                                  className="react-select-container"
                                              />
                                        </Form.Group>
                                          <Form.Group className="form-group" controlId="exampleForm.ControlInput1">
                                            <Form.Label>Value</Form.Label>
                                            <Form.Select aria-label="Default select example">
                                                <option>5</option>
                                                <option value="1">1</option>
                                                <option value="2">2</option>
                                                <option value="3">3</option>
                                            </Form.Select>
                                        </Form.Group>
                                        <button type="button" className="btn btn-light-white btn-outline-white">
                                          Clear
                                        </button>
                                      </div>
                                    </div>
                                      <Row>
                                        <Col md={6}>
                                          <Form.Group className="form-group">
                                            <Form.Label>Class Time</Form.Label>
                                            <div className="form-group-icon-start">
                                              <i className="material-symbols-outlined">menu_book</i>
                                              <Form.Control type="text" placeholder="MM-DD-YY" />
                                            </div>
                                          </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                        <Form.Group
                                            className="form-group"
                                            controlId="exampleForm.ControlInput1"
                                          >
                                            <Form.Label>Professor Name</Form.Label>
                                            <div className="form-group-icon-start">
                                              <i className="material-symbols-outlined">person</i>
                                              <Form.Control type="text" placeholder="Enter Professor Name" />
                                            </div>
                                          </Form.Group>
                                        </Col>
                                      </Row>
                                      <Form.Group className='form-group'>
                                        <Form.Label>Course Color</Form.Label>
                                        <Select
                                                placeholder={<div>#5485452</div>}
                                                menuPosition="fixed"
                                                className="react-select-container"
                                            />
                                      </Form.Group>    
                                  </div>
                                </div>
                                {/* Add Event Body detail */}
                                <div className="detail-body-container">
                                  <div className="syllabus-detail-body">
                                    <div className="title-text">
                                      <h4>Event Details</h4>
                                    </div>
                                    <Row>
                                      <Col md={6}>
                                        <Form.Group className="form-group">
                                          <Form.Label>Start Date</Form.Label>
                                          <div className="react-datepicker-container form-group-icon-end">
                                            <i className="material-symbols-outlined control-icon">calendar_month</i>
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
                                            <i className="material-symbols-outlined control-icon">calendar_month</i>
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
                                        <Form.Control type="text" placeholder="Enter Title" />
                                      </div>
                                    </Form.Group>                                    
                                    <Form.Group
                                      className="form-group"
                                      controlId="exampleForm.ControlInput1"
                                    >
                                      <Form.Label>Note</Form.Label>
                                      <div className="form-group">
                                        <Form.Control type="text" placeholder="Enter Note" />
                                      </div>
                                    </Form.Group> 
                                    <Form.Group className="form-group" controlId="exampleForm.ControlInput1">
                                        <Form.Label>Calender</Form.Label>
                                        <Form.Select aria-label="Default select example">
                                            <option>Select</option>
                                            <option value="1">option 1</option>
                                            <option value="2">option 2</option>
                                            <option value="3">option 3</option>
                                        </Form.Select>
                                    </Form.Group>                                   
                                    <div className="Reminder-box">
                                      <div className="title-with-switch">
                                        <div className="title-text"><h4>Reminder (Notify me before start date)</h4></div>
                                        <div className="switch-box ">
                                            <label className="switch" htmlFor="switch">
                                                <input type="checkbox" id='switch'/>
                                                <div className="slider round"></div>
                                            </label>
                                        </div>
                                      </div>
                                      <div className="remider-fields">
                                        <Form.Group className='form-group'>
                                          <Form.Label>Unit</Form.Label>
                                          <Select
                                                  placeholder={<div>Days</div>}
                                                  menuPosition="fixed"
                                                  className="react-select-container"
                                              />
                                        </Form.Group>
                                          <Form.Group className="form-group" controlId="exampleForm.ControlInput1">
                                            <Form.Label>Value</Form.Label>
                                            <Form.Select aria-label="Default select example">
                                                <option>5</option>
                                                <option value="1">1</option>
                                                <option value="2">2</option>
                                                <option value="3">3</option>
                                            </Form.Select>
                                        </Form.Group>
                                        <button type="button" className="btn btn-light-white btn-outline-white">
                                          Clear
                                        </button>
                                      </div>
                                    </div>          
                                  </div>
                                </div>
                                <div className="bottom-button-group">
                                    <Button type="button" className="btn btn-light-white me-auto">
                                        Cancel
                                    </Button>
                                    <Button type="button" className="btn btn-light-white">
                                      Clear
                                    </Button>
                                    <Button type="button" className="btn btn-primary">
                                        Save
                                    </Button>
                                </div>
                            </div>
                        </div>
                     
                     </div>
                </Offcanvas.Body>
              </Offcanvas>
            </div>
            {/***** Offcanvas end *****/}
    </>
  )
}

export default AddSyllabusEvents