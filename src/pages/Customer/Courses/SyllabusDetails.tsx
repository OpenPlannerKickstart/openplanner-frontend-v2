import React, { useEffect, useRef, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { connect, useDispatch } from "react-redux";
import DefaultAvtar from "../../../assets/images/avatar-default.svg";
import Select, { components, ControlProps } from "react-select";
import {
  FormikTouched,
  FormikValues,
  setNestedObjectValues,
  useFormik,
} from "formik";
import * as yup from "yup";
import { addSyllabusData } from "../../../interfaces/interface";
import {
  CLASS_TIME_IS_REQUIRED,
  FILE_FORMATE_VALIDATION,
  FILE_SIZE_VALIDATION,
  PROFESSOR_NAME_IS_REQUIRED,
  SYLLABUS_COLOR_IS_REQUIRED,
  SYLLABUS_DOC_IS_REQUIRED,
  SYLLABUS_TITLE_IS_REQUIRED,
} from "../../../Utility/Validation_Message";
import {
  customJsonInclude,
  FILE_SIZE,
  formatedDate,
  isEmptyObjectOrNullUndefiend,
  isNullUndefinedOrBlank,
  renderError,
  SUPPORTED_FORMATS,
  SUPPORTED_SYLLABUS_UPLOAD_FORMATS,
} from "../../../Utility/Helper";
import DatePicker from "react-datepicker";
import InputColor from "react-input-color";
import { MAX_50 } from "../../../Utility/Validation_Helper";
import { AppDispatch } from "../../../redux/store";
import {
  addEditSyllabusDataAPI,
  deleteSyllabusDataAPI,
} from "../../../redux/Service/User/Courses/courses";
import GetImageIcon from "../../../common/GetImageIcon";
const SyllabusDetails = (props) => {
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    if (!isEmptyObjectOrNullUndefiend(props?.selectedSyllabusObj)) {
      const newData = {
        ...props?.selectedSyllabusObj,
        class_time: props?.selectedSyllabusObj?.class_time
          ? new Date(`1970-01-01T${props?.selectedSyllabusObj?.class_time}`)
          : null,
        syllabus_doc: props?.selectedSyllabusObj?.syllabus_doc?.url,
        syllabus_doc_name:
          props?.selectedSyllabusObj?.syllabus_doc?.original_name || "",
      };
      props?.setPdfPreviewLink(props?.selectedSyllabusObj?.syllabus_doc?.url);

      setSavedSyllabusFormData(newData);
    }

    return () => { };
  }, [props?.selectedSyllabusObj]);

  const syllabusDocRef: any = useRef(null);
  const initSyllabusData: addSyllabusData = {
    class_time: "",
    course_color: "",
    title: "",
    professor_name: "",
    syllabus_doc: null,
  };
  const [savedSyllabusFormData, setSavedSyllabusFormData] =
    useState<addSyllabusData>(initSyllabusData);
  const onSubmit = (values) => { };
  const validationSchema = yup.object({
    title: yup.string().required(SYLLABUS_TITLE_IS_REQUIRED),
    class_time: yup.string().required(CLASS_TIME_IS_REQUIRED),
    professor_name: yup.string().required(PROFESSOR_NAME_IS_REQUIRED),
    course_color: yup.string().required(SYLLABUS_COLOR_IS_REQUIRED),
    syllabus_doc: yup.mixed().when(([syllabus_doc]) => {
      return typeof syllabus_doc === "object" && syllabus_doc !== null
        ? yup
          .mixed()
          .nullable()
          .test(
            "FILE_FORMAT",
            FILE_FORMATE_VALIDATION,
            (value: any) =>
              !value ||
              (value &&
                SUPPORTED_SYLLABUS_UPLOAD_FORMATS.includes(value[0].type))
          )
        : !isNullUndefinedOrBlank(syllabus_doc)
          ? yup.mixed().nullable()
          : yup.object().required(SYLLABUS_DOC_IS_REQUIRED);
    }),
  });
  const syllabusFormData = useFormik({
    initialValues: savedSyllabusFormData || initSyllabusData,
    onSubmit,
    validationSchema,
    enableReinitialize: true,
  });
  const handleSyllabusSubmit = async () => {
    syllabusFormData.handleSubmit();
    const syllabusFormDataErrors = await syllabusFormData.validateForm();
    if (Object.keys(syllabusFormDataErrors).length > 0) {
      syllabusFormData.setTouched(
        setNestedObjectValues<FormikTouched<FormikValues>>(
          syllabusFormDataErrors,
          true
        )
      );
      return;
    }

    const formData = new FormData();
    const reqBody = {
      title: syllabusFormData.values.title,
      class_time: formatedDate(syllabusFormData.values.class_time, "hh:mm:ss"),
      course_color: syllabusFormData.values.course_color,
      professor_name: syllabusFormData.values.professor_name,
      doc_id: props?.selectedSyllabusObj?.doc_id,
      id: props?.selectedSyllabusObj?.id,
    };

    if (
      !isEmptyObjectOrNullUndefiend(syllabusFormData?.values?.syllabus_doc) &&
      typeof syllabusFormData?.values?.syllabus_doc === "object"
    ) {
      formData.append(
        "syllabus_doc",
        syllabusFormData?.values?.syllabus_doc[0]
      );
    } else {
      reqBody["url"] = syllabusFormData?.values?.syllabus_doc;
    }

    customJsonInclude(reqBody);
    formData.append("syllabusDetail", JSON.stringify(reqBody) as any);
    const response = await dispatch(addEditSyllabusDataAPI(formData));
    if (response) {
      props.handleCloseSyllabusDetails();
      props.handleGetCourseList();
    }
  };

  const handleRemoveSyllabusDoc = () => {
    syllabusFormData.setFieldValue("syllabus_doc", null);
    syllabusFormData.setFieldValue("syllabus_doc_name", null);
    syllabusDocRef.current.value = null;
    props?.setPdfPreviewLink(null);
  };

  useEffect(() => {
    syllabusFormData.setFieldTouched("syllabus_doc", true);

    return () => { };
  }, [syllabusFormData.values.syllabus_doc]);

  /** -------------------Delete Syllabus start-------------------------*/
  const [deleteShow, setDeleteShow] = useState(false);

  const handleDeleteClose = () => {
    setDeleteShow(false);
  };
  const handleDeleteShow = () => {
    setDeleteShow(true);
  };
  const handleDeleteSyllabus = async () => {
    const reqBody = {
      id: [props?.selectedSyllabusObj?.id],
    };
    const response = await dispatch(deleteSyllabusDataAPI(reqBody));
    if (response) {
      props.handleCloseSyllabusDetails();
      props.handleGetCourseList();
    }
  };

  /** -------------------Delete Syllabus end-------------------------*/

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
              <Form.Control
                type="text"
                placeholder="Project Management"
                {...syllabusFormData.getFieldProps("title")}
                maxLength={MAX_50}
              />
            </div>
            {syllabusFormData.touched.title && syllabusFormData.errors.title
              ? renderError(syllabusFormData.errors.title)
              : null}
          </Form.Group>
          <Form.Group className="form-group">
            <Form.Label>Syllabus</Form.Label>
            <div className="attachments-container">
              <div className="attachments-content">
                <button className="btn btn-attachments">
                  <i className="bi bi-upload"></i>
                </button>
                <p>
                  Drag and Drop file here or{" "}
                  <span className="text-primary">Choose file</span>
                </p>
              </div>
              <input
                className=" "
                type="file"
                accept="application/pdf"
                onChange={(e: any) => {
                  if (!isEmptyObjectOrNullUndefiend(e.target?.files)) {
                    syllabusFormData.setFieldValue(
                      "syllabus_doc",
                      e.target?.files as any
                    );
                    syllabusFormData.setFieldValue(
                      "syllabus_doc_name",
                      e.target?.files[0]?.name as any
                    );
                    const url: any = URL.createObjectURL(
                      e.target?.files[0] as any
                    );
                    props?.setPdfPreviewLink(url);
                  }
                }}
                ref={syllabusDocRef}
              />
            </div>
            {!isEmptyObjectOrNullUndefiend(
              syllabusFormData?.values?.syllabus_doc_name
            ) &&
              isEmptyObjectOrNullUndefiend(
                syllabusFormData?.errors?.syllabus_doc
              ) && (
                <div className="attachments-upload-grid-container">
                  <div className="attachments-upload-row">
                    <div className="attachments-upload-col">
                      <div className="card-attachments-upload">
                        <div className="attachments-image">
                          {/* <img src={DefaultAvtar} alt="DefaultAvtar" /> */}
                          <GetImageIcon
                            image={syllabusFormData?.values?.syllabus_doc_name}
                          />
                        </div>
                        <button
                          className="btn-close"
                          onClick={() => {
                            handleRemoveSyllabusDoc();
                          }}
                        >
                          <i className="material-symbols-outlined">close</i>
                        </button>
                      </div>
                      {
                        !isNullUndefinedOrBlank(syllabusFormData?.values?.syllabus_doc_name) &&
                        <div className="attachments-text">
                          <p title={!isNullUndefinedOrBlank(syllabusFormData?.values?.syllabus_doc_name) ? syllabusFormData?.values?.syllabus_doc_name : "Open Planner"} >{!isNullUndefinedOrBlank(syllabusFormData?.values?.syllabus_doc_name) ? syllabusFormData?.values?.syllabus_doc_name : "Open Planner"}</p>
                        </div>
                      }

                    </div>
                  </div>
                </div>
              )}
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
          <Form.Group className="form-group">
            <Form.Label>Class Time</Form.Label>
            <div className="react-datepicker-container form-group-icon-start">
              <i className="material-symbols-outlined control-icon">schedule</i>
              <DatePicker
                placeholderText="Select Class Time"
                selected={syllabusFormData.values.class_time}
                onChange={(date) =>
                  syllabusFormData.setFieldValue("class_time", date)
                }
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={15}
                timeCaption="Time"
                dateFormat="h:mm aa"
                className="form-control"
              />
            </div>
            {syllabusFormData.touched.class_time &&
              syllabusFormData.errors.class_time
              ? renderError(syllabusFormData.errors.class_time)
              : null}
          </Form.Group>
          <Form.Group
            className="form-group"
            controlId="exampleForm.ControlInput1"
          >
            <Form.Label>Professor Name</Form.Label>
            <div className="form-group-icon-start">
              <i className="material-symbols-outlined">person</i>
              <Form.Control
                type="text"
                placeholder="Enter Professor Name"
                {...syllabusFormData.getFieldProps("professor_name")}
                maxLength={MAX_50}
              />
            </div>
            {syllabusFormData.touched.professor_name &&
              syllabusFormData.errors.professor_name
              ? renderError(syllabusFormData.errors.professor_name)
              : null}
          </Form.Group>
          <Form.Group className="form-group">
            <Form.Label>Course Color</Form.Label>
            <div className="form-color-picker color-picker-with-box">
              <i
                className="th-bold-mouse-square"
                style={{ color: syllabusFormData?.values?.course_color }}
              ></i>
              <InputColor
                initialValue={
                  syllabusFormData?.values?.course_color || "#239BC2"
                }
                onChange={(color) => {
                  syllabusFormData.setFieldValue("course_color", color.hex);
                }}
              />
              {!isNullUndefinedOrBlank(
                syllabusFormData?.values?.course_color
              ) && (
                  <p className="color-picker-code">
                    {syllabusFormData?.values?.course_color}
                  </p>
                )}
            </div>
          </Form.Group>
        </div>
      </div>
      <div className="bottom-button-group">
        <Button
          type="button"
          className="btn btn-light-white me-auto"
          onClick={() => {
            props.handleCloseSyllabusDetails();
          }}
        >
          Cancel
        </Button>
        <Button
          type="button"
          className="btn btn-light-danger"
          onClick={() => {
            handleDeleteShow();
          }}
        >
          Delete Syllabus
        </Button>
        <Button
          type="button"
          className="btn btn-primary"
          onClick={() => {
            handleSyllabusSubmit();
          }}
        >
          Save
        </Button>
      </div>

      {/* Delete Modal */}
      <Modal
        className="modal-theme modal-confirmation modal-reject"
        show={deleteShow}
        onHide={handleDeleteClose}
        centered
      >
        <Modal.Header>
          <h4 className="modal-title">Delete Syllabus</h4>
          <button
            type="button"
            className="btn-close"
            onClick={handleDeleteClose}
          >
            <i className="material-symbols-outlined">close</i>
          </button>
        </Modal.Header>
        <Modal.Body>
          <div className="modal-confirmation-container">
            <div className="modal-confirmation-icon">
              <i className="material-symbols-outlined">delete</i>
            </div>
            <div className="modal-confirmation-content">
              <h5> Want to Delete?</h5>
              <p>Are you sure, you want to delete this Syllabus ?</p>
            </div>
          </div>
          <div className="modal-button-group modal-full-width-btn modal-footer-button">
            <Button
              variant="light-white"
              className="btn-md"
              onClick={handleDeleteClose}
            >
              No, Change My Mind
            </Button>

            <Button
              variant={"danger"}
              className="btn-icon-text btn-md"
              onClick={() => {
                handleDeleteSyllabus();
              }}
            >
              Delete
            </Button>
          </div>
        </Modal.Body>
      </Modal>
      {/* Delete Modal */}
    </>
  );
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(SyllabusDetails);
