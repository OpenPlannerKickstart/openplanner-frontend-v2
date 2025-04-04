import React from "react";
import { Form } from "react-bootstrap";
import { connect } from "react-redux";
import DefaultAvtar from '../../../assets/images/avatar-default.svg'
import Select, { components, ControlProps } from "react-select";

const SyllabusDetails = (props) => {
  return (
    <>
      <div className="syllabus-details-box">
        <Form.Group
          className="form-group"
          controlId="exampleForm.ControlInput1"
        >
          <Form.Label>Course Title</Form.Label>
          <div className="form-group-icon-start">
            <i className="th th-outline-book"></i>
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
                            <button className="btn-close"><i className='th th-close'></i></button>
                        </div>
                    </div>
                    <div className='attachments-upload-col'>
                        <div className='card-attachments-upload'>
                            <div className='attachments-image'>
                                <img src={DefaultAvtar} alt="DefaultAvtar" />
                            </div>
                            <button className="btn-close"><i className='th th-close'></i></button>
                        </div>
                    </div>
                    <div className='attachments-upload-col'>
                        <div className='card-attachments-upload'>
                            <div className='attachments-image'>
                                <img src={DefaultAvtar} alt="DefaultAvtar" />
                            </div>
                            <button className="btn-close"><i className='th th-close'></i></button>
                        </div>
                    </div>
                </div>
            </div>
        </Form.Group>
        <Form.Group className="form-group">
          <Form.Label>Class Time</Form.Label>
          <div className="form-group-icon-start">
            <i className="th th-outline-calendar"></i>
            <Form.Control type="text" placeholder="MM-DD-YY" />
          </div>
        </Form.Group>

        <Form.Group
          className="form-group"
          controlId="exampleForm.ControlInput1"
        >
          <Form.Label>Professor Name</Form.Label>
          <div className="form-group-icon-start">
            <i className="th th-outline-user"></i>
            <Form.Control type="text" placeholder="Enter Professor Name" />
          </div>
        </Form.Group>
        <Form.Group className='form-group'>
            <Form.Label>React Select</Form.Label>
            <Select
                    placeholder={<div>Select Work Space</div>}
                    menuPosition="fixed"
                    className="react-select-container"
                />
        </Form.Group>
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(SyllabusDetails);
