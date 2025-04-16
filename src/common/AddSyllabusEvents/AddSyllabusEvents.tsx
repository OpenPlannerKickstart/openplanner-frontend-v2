import React, { useEffect, useRef, useState } from 'react'
import { Button, Col, Form, Offcanvas, Row } from 'react-bootstrap'
import DefaultAvtar from '/assets/images/avatar-default.svg'
import Select, { components, ControlProps } from "react-select";
import syllabustitleLogo from "/assets/images/syllabus-title-img.svg";
import eventtitleLogo from "/assets/images/event-title-img.svg";
import checktitleLogo from "/assets/images/title-check-icon.svg";
import DatePicker from "react-datepicker";
import { AppDispatch } from '../../redux/store';
import { useDispatch } from 'react-redux';
import { addEvenData, addSyllabusData } from '../../interfaces/interface';
import { CLASS_TIME_IS_REQUIRED, END_DATE_IS_REQUIRED, FILE_FORMATE_VALIDATION, PROFESSOR_NAME_IS_REQUIRED, START_DATE_IS_REQUIRED, SYLLABUS_COLOR_IS_REQUIRED, SYLLABUS_DOC_IS_REQUIRED, SYLLABUS_TITLE_IS_REQUIRED, TITLE_IS_REQUIRED } from '../../Utility/Validation_Message';
import { customJsonInclude, formatedDate, isEmptyObjectOrNullUndefiend, isNullUndefinedOrBlank, renderError, SUPPORTED_SYLLABUS_UPLOAD_FORMATS } from '../../Utility/Helper';
import { FormikTouched, FormikValues, setNestedObjectValues, useFormik } from 'formik';
import * as yup from 'yup';
import { addEditEventDataAPI, addEditSyllabusDataAPI, getSyllabusDropDownDataAPI } from '../../redux/Service/User/Courses/courses';
import { MAX_50 } from '../../Utility/Validation_Helper';
import InputColor from 'react-input-color';
import { ENUM_FOR_SYLLABUS_TAB } from '../../interfaces/enum';
import GetImageIcon from '../GetImageIcon';
const AddSyllabusEvents = (props) => {
  const dispatch: AppDispatch = useDispatch();

  const [showAddSyllabusEvents, setShowAddSyllabusEvents] = useState(false);

  const handleCloseAddSyllabusEvents = () => {
    setShowAddSyllabusEvents(false); props.setShowEvent(false)
    setTimeout(() => {

      setSavedSyllabusFormData(initSyllabusData);
      syllabusFormData.resetForm();
      syllabusDocRef.current.value = null;
    }, 300);

  }
  const handleShowAddSyllabusEvents = () => setShowAddSyllabusEvents(true);
  useEffect(() => {
    if (props?.show) {
      handleShowAddSyllabusEvents();
      syllabusFormData.resetForm();
      setSavedSyllabusFormData(initSyllabusData);

      handleGetSyllabusDropDownData();
    }


    return () => {

    }
  }, [props?.show])

  /* ------------------------- handle Select Tab Start ------------------------ */
  const [selectedTab, setSelectedTab] = useState<any>(ENUM_FOR_SYLLABUS_TAB.SYLLABUS_DETAILS);
  const handleSelectTab = (tab) => {
    if (tab !== selectedTab) {
      setSelectedTab(tab);
    }
  };
  /* ------------------------- handle Select Tab end ------------------------ */

  /* ------------------------- Add Syllabus Data Start ------------------------ */

  const syllabusDocRef: any = useRef(null);
  const initSyllabusData: addSyllabusData = {
    class_time: "",
    course_color: "",
    title: "",
    professor_name: "",
    syllabus_doc: null,

  }
  const [savedSyllabusFormData, setSavedSyllabusFormData] = useState<addSyllabusData>(initSyllabusData);
  const onSubmitForSyllabus = (values) => {
  }
  const validationSchemaForSyllabus = yup.object({
    title: yup.string().required(SYLLABUS_TITLE_IS_REQUIRED),
    class_time: yup.string().required(CLASS_TIME_IS_REQUIRED),
    professor_name: yup.string().required(PROFESSOR_NAME_IS_REQUIRED),
    course_color: yup.string().required(SYLLABUS_COLOR_IS_REQUIRED),
    syllabus_doc: yup.mixed()
      .when(([syllabus_doc]) => {
        return typeof syllabus_doc === "object" && syllabus_doc !== null ?
          yup.mixed().nullable()
            .test("FILE_FORMAT", FILE_FORMATE_VALIDATION,
              (value: any) => !value || (value && SUPPORTED_SYLLABUS_UPLOAD_FORMATS.includes(value[0].type))
            )
          :
          !isNullUndefinedOrBlank(syllabus_doc) ?
            yup.mixed().nullable()
            : yup.object().required(SYLLABUS_DOC_IS_REQUIRED)

      }),
  })
  const syllabusFormData = useFormik({
    initialValues: savedSyllabusFormData || initSyllabusData,
    onSubmit: onSubmitForSyllabus,
    validationSchema: validationSchemaForSyllabus,
    enableReinitialize: true,
  })
  const handleSyllabusSubmit = async () => {
    syllabusFormData.handleSubmit();
    if (isEmptyObjectOrNullUndefiend(syllabusFormData?.values?.syllabus_doc)) {

    }
    const syllabusFormDataErrors = await syllabusFormData.validateForm();
    if (Object.keys(syllabusFormDataErrors).length > 0) {
      syllabusFormData.setTouched(
        setNestedObjectValues<
          FormikTouched<FormikValues>
        >(syllabusFormDataErrors, true))
      return;
    }

    const formData = new FormData();
    const reqBody = {
      title: syllabusFormData.values.title,
      class_time: formatedDate(syllabusFormData.values.class_time, "hh:mm:ss"),
      course_color: syllabusFormData.values.course_color,
      professor_name: syllabusFormData.values.professor_name,
    }



    if (!isEmptyObjectOrNullUndefiend(syllabusFormData?.values?.syllabus_doc) && typeof syllabusFormData?.values?.syllabus_doc === "object") {

      formData.append("syllabus_doc", syllabusFormData?.values?.syllabus_doc[0]);
    }

    customJsonInclude(reqBody);
    formData.append("syllabusDetail", JSON.stringify(reqBody) as any);
    const response = await dispatch(addEditSyllabusDataAPI(formData));
    if (response) {
      handleCloseAddSyllabusEvents();
      props?.setIsAddNewData(true);
    }


  }


  const handleRemoveSyllabusDoc = () => {
    syllabusFormData.setFieldValue("syllabus_doc", null)
    syllabusFormData.setFieldValue("syllabus_doc_name", null)
    syllabusDocRef.current.value = null;
  }
  useEffect(() => {

    syllabusFormData.setFieldTouched("syllabus_doc", true);
    return () => {

    }
  }, [syllabusFormData.values.syllabus_doc])
  /* ------------------------- Add Syllabus Data End ------------------------ */

  /* -------------------------- Add Event Data Start -------------------------- */
  const [syllabusDropDownData,setSyllabusDropDownData] = useState<any>([]);
  const handleGetSyllabusDropDownData = async() => {

    const response = await dispatch(getSyllabusDropDownDataAPI({}));
    if (response) {
      setSyllabusDropDownData(response?.payload||[]);
    
    }
  }

  const initEventData: addEvenData = {
    start_date: null,
    end_date: null,
    title: "",
    note: "",
    is_reminder: false,
    reminder: [],

  }
  const [savedEventFormData, setSavedEventFormData] = useState<addEvenData>(initEventData);
  const onSubmitForEvent = (values) => { }
  const validationSchemaForEvent = yup.object({
    title: yup.string().required(TITLE_IS_REQUIRED),
    start_date: yup.string().required(START_DATE_IS_REQUIRED),
    end_date: yup.string().required(END_DATE_IS_REQUIRED),
  })
  const eventFormData = useFormik({
    initialValues: savedEventFormData || initEventData,
    onSubmit: onSubmitForEvent,
    validationSchema: validationSchemaForEvent,
    enableReinitialize: true,
  })
  const handleEventSubmit = async () => {

    eventFormData.handleSubmit();
    const eventFormDataErrors = await eventFormData.validateForm();
    if (Object.keys(eventFormDataErrors).length > 0) {
      eventFormData.setTouched(
        setNestedObjectValues<
          FormikTouched<FormikValues>
        >(eventFormDataErrors, true))
      return;
    }
    const reqBody = {
      title: eventFormData.values.title,
      start_date: formatedDate(eventFormData.values.start_date, "yyyy-MM-dd"),
      end_date: formatedDate(eventFormData.values.end_date, "yyyy-MM-dd"),
      note: eventFormData.values.note,
      is_reminder: eventFormData.values.is_reminder,
      reminder: eventFormData.values.reminder,
      syllabus_id: eventFormData.values.syllabus_id,


    }





    customJsonInclude(reqBody);

    const response = await dispatch(addEditEventDataAPI(reqBody));
    if (response) {
      handleCloseAddSyllabusEvents();
      props?.setIsAddNewData(true);
    }
  }

  /* -------------------------- Add Event Data End -------------------------- */



  const handleSubmitData = () => {
    switch (selectedTab) {
      case ENUM_FOR_SYLLABUS_TAB.SYLLABUS_DETAILS:
        handleSyllabusSubmit()
        break;
      case ENUM_FOR_SYLLABUS_TAB.EVENT_DETAILS:
        handleEventSubmit();
        break;
      default:
        break;
    }
  }

  const handleClearData = () => {
    switch (selectedTab) {
      case ENUM_FOR_SYLLABUS_TAB.SYLLABUS_DETAILS:
        syllabusFormData.resetForm();
        setSavedSyllabusFormData(initSyllabusData);
        syllabusDocRef.current.value = null;
        break;
      case ENUM_FOR_SYLLABUS_TAB.EVENT_DETAILS:
        eventFormData.resetForm();
        setSavedEventFormData(initEventData);
        break;
      default:
        break;
    }
  }

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
                    <div className={`add-syllabus-event-btn ${selectedTab === ENUM_FOR_SYLLABUS_TAB?.SYLLABUS_DETAILS ? "active" : ""}`} onClick={() => handleSelectTab(ENUM_FOR_SYLLABUS_TAB.SYLLABUS_DETAILS)}>
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
                    <div className={`add-syllabus-event-btn ${selectedTab === ENUM_FOR_SYLLABUS_TAB?.EVENT_DETAILS ? "active" : ""}`} onClick={() => handleSelectTab(ENUM_FOR_SYLLABUS_TAB.EVENT_DETAILS)}>
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

                  {
                    selectedTab === ENUM_FOR_SYLLABUS_TAB.SYLLABUS_DETAILS ?
                      <div className="detail-body-container">
                        <div className="syllabus-detail-body">
                          <div className="title-text">
                            <h4>Syllabus Details</h4>
                          </div>
                          <Form.Group
                            className="form-group"

                          >
                            <Form.Label>Course Title</Form.Label>
                            <div className="form-group-icon-start">
                              <i className="material-symbols-outlined">menu_book</i>
                              <Form.Control type="text" placeholder="Enter Course Title"  {...syllabusFormData.getFieldProps("title")}
                                maxLength={MAX_50}
                              />
                            </div>
                            {syllabusFormData.touched.title &&
                              syllabusFormData.errors.title
                              ? renderError(syllabusFormData.errors.title as any)
                              : null}
                          </Form.Group>
                          <Form.Group className="form-group">
                            <Form.Label>Upload Syllabus Here</Form.Label>
                            <div className='attachments-container'>
                              <div className='attachments-content'>
                                <button className='btn btn-attachments'><i className="bi bi-upload"></i></button>
                                <p>Drag and Drop file here or <span className='text-primary'>Choose file</span></p>
                              </div>
                              <input className=' ' type="file"
                                accept="application/pdf"

                                onChange={(e: any) => {
                                  if (!isEmptyObjectOrNullUndefiend(e.target?.files)) {
                                    syllabusFormData.setFieldValue("syllabus_doc", e.target?.files as any)
                                    syllabusFormData.setFieldValue("syllabus_doc_name", e.target?.files[0]?.name as any)
                                  }
                                }}
                                onBlur={() => {
                                  syllabusFormData.setFieldTouched("syllabus_doc", true);
                                }}

                                ref={syllabusDocRef}
                              />
                            </div>
                            {
                              !isEmptyObjectOrNullUndefiend(syllabusFormData?.values?.syllabus_doc_name) && isEmptyObjectOrNullUndefiend(syllabusFormData?.errors?.syllabus_doc) &&
                              <div className='attachments-upload-grid-container'>
                                <div className='attachments-upload-row'>
                                  <div className='attachments-upload-col'>
                                    <div className='card-attachments-upload'>
                                      <div className='attachments-image'>
                                        {/* <img src={DefaultAvtar} alt="DefaultAvtar" /> */}
                                        <GetImageIcon
                                          image={syllabusFormData?.values?.syllabus_doc_name}
                                        />
                                      </div>
                                      <button className="btn-close"
                                        onClick={() => { handleRemoveSyllabusDoc() }}
                                      ><i className='material-symbols-outlined'>close</i></button>
                                    </div>
                                  </div>

                                </div>
                              </div>
                            }
                            {/* <div className="file-notification">
                          <p>Accepted file types: pdf</p>
                          <p>Please allow 1 to 2 minutes for the syllabus to be processed.</p>
                        </div> */}
                            {syllabusFormData.touched.syllabus_doc &&
                              syllabusFormData.errors.syllabus_doc
                              ? renderError(syllabusFormData.errors.syllabus_doc as any)
                              : null}
                          </Form.Group>
                          {/* <div className="Reminder-box">
                        <div className="title-with-switch">
                          <div className="title-text"><h4>Reminder (Notify me before start date)</h4></div>
                          <div className="switch-box ">
                            <label className="switch" htmlFor="switch">
                              <input type="checkbox" id='switch' />
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
                      </div> */}
                          <Row>
                            <Col md={6}>
                              <Form.Group className="form-group">
                                <Form.Label>Class Time</Form.Label>
                                <div className="form-group-icon-start">
                                  <i className="material-symbols-outlined">menu_book</i>
                                  <DatePicker
                                    placeholderText="Select Class Time"
                                    selected={syllabusFormData.values.class_time}
                                    onChange={(date) => syllabusFormData.setFieldValue("class_time", date)}
                                    showTimeSelect
                                    showTimeSelectOnly
                                    timeIntervals={15}
                                    timeCaption="Time"
                                    dateFormat="h:mm aa"
                                    className="form-control"
                                    onBlur={() => {
                                      syllabusFormData.setFieldTouched("class_time", true)
                                    }}
                                  />
                                </div>
                                {syllabusFormData.touched.class_time &&
                                  syllabusFormData.errors.class_time
                                  ? renderError(syllabusFormData.errors.class_time)
                                  : null}
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
                                  <Form.Control type="text" placeholder="Enter Professor Name"
                                    {...syllabusFormData.getFieldProps("professor_name")}
                                    maxLength={MAX_50}
                                  />
                                </div>
                                {syllabusFormData.touched.professor_name &&
                                  syllabusFormData.errors.professor_name
                                  ? renderError(syllabusFormData.errors.professor_name)
                                  : null}
                              </Form.Group>
                            </Col>
                          </Row>
                          <Form.Group className='form-group'>
                            <Form.Label>Course Color</Form.Label>
                            <div className="form-control-icon icon-start">
                              <i className='th-bold-mouse-square' style={{ color: syllabusFormData?.values?.course_color }}></i>
                              <div className="form-color-picker">
                                <InputColor
                                  initialValue={syllabusFormData?.values?.course_color || "#7209B7"}
                                  onChange={(color) => {
                                    syllabusFormData.setFieldValue("course_color", color.hex);
                                  }}
                                />
                              </div>
                            </div>
                          </Form.Group>
                        </div>
                      </div> : <></>
                  }
                  {
                    selectedTab === ENUM_FOR_SYLLABUS_TAB.EVENT_DETAILS ?
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
                                    selected={eventFormData.values.start_date}
                                    onChange={(date) => eventFormData.setFieldValue("start_date", date)}
                                    showTimeSelect
                                    dateFormat="dd/MM/yyyy hh:mm aa"
                                    timeIntervals={15}
                                    className="form-control"
                                    popperProps={{ strategy: "fixed" }}
                                    placeholderText="Select Date"
                                    onBlur={() => {
                                      eventFormData.setFieldTouched("start_date", true)
                                    }}

                                  />
                                  {eventFormData.touched.start_date &&
                                    eventFormData.errors.start_date
                                    && renderError(eventFormData.errors.start_date as any)}

                                </div>
                              </Form.Group>
                            </Col>
                            <Col md={6}>
                              <Form.Group className="form-group">
                                <Form.Label>End Date</Form.Label>
                                <div className="react-datepicker-container form-group-icon-end">
                                  <i className="material-symbols-outlined control-icon">calendar_month</i>
                                  <DatePicker
                                    isClearable={true}
                                    selected={eventFormData.values.end_date}
                                    onChange={(date) => eventFormData.setFieldValue("end_date", date)}
                                    showTimeSelect
                                    dateFormat="dd/MM/yyyy hh:mm aa"
                                    timeIntervals={15}
                                    className="form-control"
                                    popperProps={{ strategy: "fixed" }}
                                    placeholderText="Select Date"
                                    minDate={eventFormData.values.start_date}
                                    onBlur={() => {
                                      eventFormData.setFieldTouched("end_date", true)
                                    }}
                                  />
                                  {eventFormData.touched.end_date &&
                                    eventFormData.errors.end_date
                                    && renderError(eventFormData.errors.end_date as any)}
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
                              <Form.Control type="text" placeholder="Enter Title"
                                {...eventFormData.getFieldProps("title")}
                                maxLength={MAX_50}
                              />
                              {eventFormData.touched.title &&
                                eventFormData.errors.title
                                && renderError(eventFormData.errors.title as any)}
                            </div>
                          </Form.Group>
                          <Form.Group
                            className="form-group"
                            controlId="exampleForm.ControlInput1"
                          >
                            <Form.Label>Note</Form.Label>
                            <div className="form-group">
                              <Form.Control type="text" placeholder="Enter Note"
                                {...eventFormData.getFieldProps("note")}
                                maxLength={MAX_50}
                              />
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
                                  <input type="checkbox" id='switch' />
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
                      </div> : <></>
                  }
                  {/* Add Event Body detail */}
                  <div className="bottom-button-group">
                    <Button type="button" className="btn btn-light-white me-auto">
                      Cancel
                    </Button>
                    <Button type="button" className="btn btn-light-white"
                      onClick={() => { handleClearData() }}
                    >
                      Clear
                    </Button>
                    <Button type="button" className="btn btn-primary"
                      onClick={() => { handleSubmitData() }}
                    >
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