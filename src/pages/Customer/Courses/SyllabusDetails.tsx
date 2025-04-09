import React from "react";
import { Form } from "react-bootstrap";
import { connect } from "react-redux";
import DefaultAvtar from '../../../assets/images/avatar-default.svg'
import Select, { components, ControlProps } from "react-select";

const SyllabusDetails = (props) => {
  return (
    <>
      <div className="tab-body-container">      
        <div className="syllabus-details-box">
          <Form.Group
            className="form-group"
            controlId="exampleForm.ControlInput1"
          >
            <Form.Label>Course Title</Form.Label>
            <div className="form-group-icon-start">
              <i className="material-symbols-outlined">menu_book</i>
              <Form.Control type="text" placeholder="Project Management" />
            </div>
          </Form.Group>
          <Form.Group className="form-group">
              <Form.Label>Syllabus</Form.Label>
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
                              <button className="btn-close"><i className='material-symbols-outlined'>close</i></button>
                          </div>
                      </div>
                      <div className='attachments-upload-col'>
                          <div className='card-attachments-upload'>
                              <div className='attachments-image'>
                                  <img src={DefaultAvtar} alt="DefaultAvtar" />
                              </div>
                              <button className="btn-close"><i className='material-symbols-outlined'>close</i></button>
                          </div>
                      </div>
                      <div className='attachments-upload-col'>
                          <div className='card-attachments-upload'>
                              <div className='attachments-image'>
                                  <img src={DefaultAvtar} alt="DefaultAvtar" />
                              </div>
                              <button className="btn-close"><i className='material-symbols-outlined'>close</i></button>
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
          <Form.Group className="form-group">
            <Form.Label>Class Time</Form.Label>
            <div className="form-group-icon-start">
              <i className="material-symbols-outlined">menu_book</i>
              <Form.Control type="text" placeholder="MM-DD-YY" />
            </div>
          </Form.Group>
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
    </>
  );
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(SyllabusDetails);
