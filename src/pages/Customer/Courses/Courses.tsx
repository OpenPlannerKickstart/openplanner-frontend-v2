import React from "react";
import { Form } from "react-bootstrap";

import DatePicker from "react-datepicker";
import { connect } from "react-redux";

const Courses = (props) => {
  return (
    <>
      <div className="page-content">
        <div className="page-title-wrapper">
          <div className="page-title-left">
            <div className="page-title">
              <h4>All Courses</h4>
            </div>
          </div>
          <div className="page-title-right">
            <button type="button" className="btn btn-primary">
              Add Syllabus{" "}
            </button>
          </div>
        </div>
        <div className="page-filters p-3 mb-0">
          <div className="page-filters-left">
            <Form.Group className="form-group form-group-sm form-group-inline-control">
              <div className="form-control-wrapper">
                <div className="form-group-icon-start">
                  <i className="th th-outline-search-normal"></i>
                  <Form.Control type="text" placeholder="Search" />
                </div>
              </div>
            </Form.Group>
            <Form.Group className="form-group required">
              <div className="react-datepicker-container form-group-icon-end">
                <i className="th th-outline-calendar"></i>
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
          <div className="page-filters-right">
            <div className="dropdown export-dropdown">
              <button
                type="button"
                className="btn btn-sm btn-outline-white dropdown-toggle"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Export
              </button>
              <ul className="dropdown-menu">
                <li>
                  <a className="dropdown-item" href="#">
                    Action
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    Another action
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    Something else here
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="content-area ">
          <div className="page-content-wrapper h-100">gtehryhd</div>
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Courses);
