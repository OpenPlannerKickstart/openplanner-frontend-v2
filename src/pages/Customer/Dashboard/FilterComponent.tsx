import React from 'react'
import { Form } from 'react-bootstrap'
import { connect } from 'react-redux'
import DatePicker from "react-datepicker";
import Select, { components, ControlProps } from "react-select";

export const FilterComponent = (props) => {
    return (
        <div className="tab-top-filter">
            <div className="button-group">
                <Form.Group className="form-group form-group-sm form-group-inline-control">
                    <div className="form-control-wrapper">
                        <div className="form-group-icon-start">
                            <i className="material-symbols-outlined">search</i>
                            <Form.Control type="text" placeholder="Search by name"
                                onChange={(e) => { props.setSearch(e.target.value) }}
                            />
                        </div>
                    </div>
                </Form.Group>
                <Form.Group className="form-group form-group-sm " controlId="exampleForm.ControlInput1">
                    <Select
                        options={props?.syllabusDropDownData}
                        placeholder={<div>Course Name</div>}
                        menuPosition="fixed"
                        className="react-select-container"
                        onChange={(selectedOption: any) => {
                            props.setSyllabusId(selectedOption?.value)
                        }}
                        isClearable={true}
                        value={props?.syllabusDropDownData?.filter(({ value }) => {
                            return (
                                value === props?.syllabusId
                            );
                        })}
                    />
                </Form.Group>
                <Form.Group className="form-group form-group-sm">
                    <div className="react-datepicker-container form-group-icon-end">
                        <i className="material-symbols-outlined control-icon">date_range</i>
                        <DatePicker
                            dropdownMode="select"
                            isClearable={true}
                            dateFormat="MM/dd/yyyy"
                            className="form-control"
                            popperProps={{ strategy: "fixed" }}
                            placeholderText="Date Range"
                            toggleCalendarOnIconClick
                            selectsRange={true}
                            onChange={(dates) => {
                                const [start, end] = dates;
                                props.setStartDate(start ? start : null);
                                props.setEndDate(end ? end : null);
                            }
                            }
                            startDate={props.startDate}
                            endDate={props.endDate}
                        />

                    </div>
                </Form.Group>
            </div >
        </div >
    )
}

const mapStateToProps = (state) => ({})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(FilterComponent)