import React, { useEffect, useRef, useState } from "react";
import { Button, Form, Modal, Overlay, Popover } from "react-bootstrap";
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
  PLEASE_ADD_VALID_PROFESSOR_NAME,
  PLEASE_ADD_VALID_TITLE,
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
import { MAX_50, ONLY_ALPHABETS_AND_DOT } from "../../../Utility/Validation_Helper";
import { AppDispatch } from "../../../redux/store";
import {
  addEditSyllabusDataAPI,
  deleteSyllabusDataAPI,
} from "../../../redux/Service/User/Courses/courses";
import GetImageIcon from "../../../common/GetImageIcon";
import { DELETE_DOCUMENT_TYPE, ENUMFORROUTES } from "../../../interfaces/enum";
import { useNavigate } from "react-router-dom";
import SyllabusGroupSuggestModal from "../../../components/SyllabusGroupSuggestModal/SyllabusGroupSuggestModal";
import { useSyllabusGroupSuggest } from "../../../hooks/useSyllabusGroupSuggest";
import { useSyllabusUpload } from "../../../context/SyllabusUploadContext";
import { startSyllabusUpload } from "../../../Utility/syllabusUpload";
const SyllabusDetails = (props) => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const [showSuggestModal, setShowSuggestModal] = useState<boolean>(false);
  const {
    syllabusId: hookSyllabusId,
    setSyllabusId,
    loadingSuggestions,
    suggestion,
    hasCandidate,
    fetchSuggestions,
    resolvingCanonical,
    canonical,
    createAndJoin,
    reset: resetSuggest,
  } = useSyllabusGroupSuggest();
  
  // Syllabus upload context for background upload
  const syllabusUploadContext = useSyllabusUpload();

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
    course_color: "#239BC2",
    title: "",
    professor_name: "",
    syllabus_doc: null,
  };
  const [savedSyllabusFormData, setSavedSyllabusFormData] =
    useState<addSyllabusData>(initSyllabusData);
  const [loading, setloading] = useState(false)
  const onSubmit = (values) => { };
  const hasSubscription = props?.hasSubscription ?? (() => {
    try {
      return localStorage.getItem("has_subscription") === "true";
    } catch {
      return false;
    }
  })();
  const isNewSyllabus = isNullUndefinedOrBlank(props?.selectedSyllabusObj?.id);
  const freemiumUploadLocked =
    isNewSyllabus && !hasSubscription && !!props?.freemiumLimitReached;

  const handleUpgrade = () => {
    if (props?.onUpgradeClick) {
      props.onUpgradeClick();
      return;
    }
    navigate(ENUMFORROUTES.PLAN_DETAILS);
  };
  const validationSchema = yup.object({
    title: yup.string().required(SYLLABUS_TITLE_IS_REQUIRED),
    class_time: yup.string().required(CLASS_TIME_IS_REQUIRED),
    professor_name: yup.string().matches(ONLY_ALPHABETS_AND_DOT, PLEASE_ADD_VALID_PROFESSOR_NAME).notRequired().notRequired(),
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
          : yup.object().nullable();
    }),
  });
  const syllabusFormData = useFormik({
    initialValues: savedSyllabusFormData || initSyllabusData,
    onSubmit,
    validationSchema,
    enableReinitialize: true,
  });
  const handleSyllabusSubmit = async () => {
    if (freemiumUploadLocked) {
      handleUpgrade();
      return;
    }

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

    const hasNewFile = !isEmptyObjectOrNullUndefiend(syllabusFormData?.values?.syllabus_doc) &&
      typeof syllabusFormData?.values?.syllabus_doc === "object";

    // Use async background upload flow when there's a new file
    if (hasNewFile) {
      const file = syllabusFormData?.values?.syllabus_doc[0] as File;
      const metadata = {
        title: syllabusFormData.values.title,
        class_time: formatedDate(syllabusFormData.values.class_time, "HH:mm:ssZ"),
        course_color: syllabusFormData.values.course_color,
        professor_name: syllabusFormData.values.professor_name || undefined,
        id: props?.selectedSyllabusObj?.id, // Include ID for updates
      };

      // Close the details panel immediately - upload will continue in background
      props.handleCloseSyllabusDetails();
      props.handleGetCourseList();

      try {
        // Start background upload - this opens the floating modal
        const result = await startSyllabusUpload(file, metadata, {
          startUpload: syllabusUploadContext.startUpload,
          setProgress: syllabusUploadContext.setProgress,
          setStatus: syllabusUploadContext.setStatus,
          setSyllabusId: syllabusUploadContext.setSyllabusId,
        });

        // Upload complete - show group suggestions
        if (result.syllabusId) {
          setSyllabusId(String(result.syllabusId));
          await fetchSuggestions(String(result.syllabusId));
          setShowSuggestModal(true);
        }
      } catch (error) {
        // Error is already handled in startSyllabusUpload (toast + modal state)
        console.error('Syllabus upload failed:', error);
      }
      return;
    }

    // Legacy flow for metadata-only updates (no new file)
    const formData = new FormData();
    const reqBody = {
      title: syllabusFormData.values.title,
      class_time: formatedDate(syllabusFormData.values.class_time, "HH:mm:ssZ"),
      course_color: syllabusFormData.values.course_color,
      professor_name: syllabusFormData.values.professor_name,
      doc_id: props?.selectedSyllabusObj?.doc_id,
      id: props?.selectedSyllabusObj?.id,
    };

      reqBody["url"] = syllabusFormData?.values?.syllabus_doc;

    customJsonInclude(reqBody);
    formData.append("syllabusDetail", JSON.stringify(reqBody) as any);
    setloading(true);
    const response: any = await dispatch(addEditSyllabusDataAPI(formData));
    if (response) {
      const payload = response?.payload ?? null;
      const sid =
        payload?.syllabusId ||
        payload?.syllabus_id ||
        payload?.id ||
        payload?.syllabus?.id ||
        payload?.data?.id ||
        payload?.result?.id ||
        payload?.doc_id || // fallback if BE returns doc id
        null;
      // If BE returned a persisted doc URL, show it immediately in the preview
      const returnedUrl =
        payload?.syllabus_doc?.url ||
        payload?.data?.syllabus_doc?.url ||
        payload?.result?.syllabus_doc?.url ||
        null;
      props.handleCloseSyllabusDetails();
      props.handleGetCourseList();
      if (returnedUrl) {
        try { props?.setPdfPreviewLink(returnedUrl); } catch {}
      }
      if (sid) {
        setSyllabusId(String(sid));
        await fetchSuggestions(String(sid));
        setShowSuggestModal(true);
      } else {
        try { console.log('Syllabus save payload (no syllabusId found):', payload); } catch {}
      }
    }
    setloading(false);
  };

  const handleRemoveSyllabusDoc = () => {
    syllabusFormData.setFieldValue("syllabus_doc", null);
    syllabusFormData.setFieldValue("syllabus_doc_name", null);
    if (syllabusDocRef.current) {
      syllabusDocRef.current.value = null;
    }
    // syllabusDocRef.current.value = null;
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

  const closeSuggest = () => {
    setShowSuggestModal(false);
    resetSuggest();
  };

  const handleJoinClick = async () => {
    const sid = hookSyllabusId;
    const result = await createAndJoin(sid);
    if (result && result.id) {
      closeSuggest();
      navigate(`/groups/${result.id}`);
    }
  };

  /** -----------------edit document alert start---------------------------*/
  const [show, setShow] = useState(false);

  const handleClose = () => { setShow(false); }

  const handleShow = () => { setShow(true); }
  /** -----------------edit document alert start---------------------------*/

  const colorPalette = [
    "#239BC2", "#e91e63", "#9c27b0", "#673ab7", "#3f51b5", "#2196f3",
    "#03a9f4", "#00bcd4", "#009688", "#4caf50", "#8bc34a", "#cddc39",
    "#ffeb3b", "#ffc107", "#ff9800", "#ff5722", "#795548", "#607d8b"
  ];

  // const [showColorPopover, setShowColorPopover] = useState(false);
  // const colorInputRef = useRef(null);
  // useEffect(() => {
  //   function handleClickOutside(event) {
  //     if (
  //       colorInputRef.current &&
  //       !(colorInputRef.current as HTMLElement)?.contains(event.target) &&
  //       !event.target.closest('.color-palette-popover')
  //     ) {
  //       setShowColorPopover(false);
  //     }
  //   }
  //   if (showColorPopover) {
  //     document.addEventListener("mousedown", handleClickOutside);
  //   } else {
  //     document.removeEventListener("mousedown", handleClickOutside);
  //   }
  //   return () => {
  //     document.removeEventListener("mousedown", handleClickOutside);
  //   };
  // }, [showColorPopover]);

  const [showColorPopover, setShowColorPopover] = useState(false);
  const [popoverTarget, setPopoverTarget] = useState<any>(null);
  const colorInputRef = useRef(null);

  return (
    <>
      <div className="tab-body-container">
        <div className="syllabus-details-box">
          <Form.Group
            className="form-group required"
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
            {freemiumUploadLocked && (
              <div className="alert alert-warning d-flex align-items-center justify-content-between gap-2">
                <div>
                  <strong>Free plan limit reached.</strong> Upload one syllabus for free, then upgrade for unlimited uploads.
                </div>
                <Button size="sm" variant="primary" onClick={handleUpgrade}>
                  View plans
                </Button>
              </div>
            )}
            {
              isNullUndefinedOrBlank(syllabusFormData?.values?.syllabus_doc_name) &&

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
                  accept=".pdf,.doc,.docx"
                  disabled={freemiumUploadLocked}
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
            }
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
                        {/* <div className="attachments-image"> */}
                        {/* <img src={DefaultAvtar} alt="DefaultAvtar" /> */}
                        {/* <GetImageIcon
                            image={syllabusFormData?.values?.syllabus_doc_name}
                          /> */}
                        {/* </div> */}
                        {/* <button
                          className="btn-close"
                          onClick={() => {
                            handleShow();
                            // handleRemoveSyllabusDoc();
                          }}
                        >
                          <i className="material-symbols-outlined">close</i>
                        </button> */}
                        {
                          !isNullUndefinedOrBlank(syllabusFormData?.values?.syllabus_doc_name) &&
                          <div className="attachments-text">
                            <p title={!isNullUndefinedOrBlank(syllabusFormData?.values?.syllabus_doc_name) ? syllabusFormData?.values?.syllabus_doc_name : "Open Planner"} >{!isNullUndefinedOrBlank(syllabusFormData?.values?.syllabus_doc_name) ? syllabusFormData?.values?.syllabus_doc_name : "Open Planner"}</p>
                          </div>
                        }
                        <button className="btn-close"
                          onClick={() => { handleRemoveSyllabusDoc() }}
                        ><i className='material-symbols-outlined'>close</i></button>
                      </div>
                      {/* {
                        !isNullUndefinedOrBlank(syllabusFormData?.values?.syllabus_doc_name) &&
                        <div className="attachments-text">
                          <p title={!isNullUndefinedOrBlank(syllabusFormData?.values?.syllabus_doc_name) ? syllabusFormData?.values?.syllabus_doc_name : "Open Planner"} >{!isNullUndefinedOrBlank(syllabusFormData?.values?.syllabus_doc_name) ? syllabusFormData?.values?.syllabus_doc_name : "Open Planner"}</p>
                        </div>
                      } */}

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
          <Form.Group className="form-group required">
            <Form.Label>Class Time</Form.Label>
            <div className="react-datepicker-container form-group-icon-start">
              <i className="material-symbols-outlined control-icon">schedule</i>
              <DatePicker
                placeholderText="Select Class Time"
                selected={syllabusFormData.values.class_time}
                onChange={(date) => { syllabusFormData.setFieldValue("class_time", date) }}
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

          {/* <Form.Label>Course Color</Form.Label>
            <div className="form-color-picker color-picker-with-box">


              <Form.Control
                className="course-color-input"
                type="color"
                title="Course Color"
                {...syllabusFormData.getFieldProps(
                  "course_color"
                )}

                onChange={(e) => {
                  console.log(e)
                  syllabusFormData.setFieldValue("course_color", e.target.value);
                }}
              />
              {!isNullUndefinedOrBlank(
                syllabusFormData?.values?.course_color
              ) && (
                  <p className="color-picker-code">
                    {syllabusFormData?.values?.course_color}
                  </p>
                )}
            </div> */}
          {/* <div className="form-color-picker color-picker-with-box">
              <i
                className="th-bold-mouse-square"
                style={{ color: syllabusFormData?.values?.course_color }}
              ></i>
              <InputColor
                initialValue={
                  syllabusFormData?.values?.course_color || "#239BC2"
                }
                onChange={(color) => {
                  console.log(color)
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
            </div> */}
          <Form.Group className='form-group'>
            <Form.Label>Course Color</Form.Label>
            <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 8 }}>
              {/* Color preview square */}
              <span
                className="color-square"
                style={{
                  background: syllabusFormData.values.course_color,
                  width: 32,
                  height: 32,
                  borderRadius: "9px",
                  border: "2px solid #ccc",
                  cursor: "pointer",
                  display: "inline-block"
                }}
                ref={colorInputRef}
                onClick={e => {
                  setPopoverTarget(e.target);
                  setShowColorPopover(!showColorPopover);
                }}
                title="Pick a color"
              />
              {/* Input box for hex code */}
              <input
                type="text"
                className="form-control w-100"
                style={{ width: 120 }}
                value={syllabusFormData.values.course_color}
                onChange={e => syllabusFormData.setFieldValue("course_color", e.target.value)}
                onClick={e => {
                  setPopoverTarget(e.target);
                  setShowColorPopover(true);
                }}
                placeholder="#hexcode"
                readOnly
              />

              {/* Bootstrap Popover */}
              <Overlay
                show={showColorPopover}
                target={popoverTarget}
                placement="top"
                containerPadding={20}
                rootClose
                onHide={() => setShowColorPopover(false)}
              >
                <Popover id="color-popover">
                  <Popover.Body>
                    <div style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(6, 32px)",
                      gridTemplateRows: "repeat(3, 32px)",
                      gap: 8,
                      marginBottom: 8,
                    }}>
                      {colorPalette.map((color) => (
                        <span
                          key={color}
                          className={`color-square${syllabusFormData.values.course_color === color ? " selected" : ""}`}
                          style={{
                            background: color,
                            width: 32,
                            height: 32,
                            borderRadius: "9px",
                            border: syllabusFormData.values.course_color === color ? "3px solid #000" : "2px solid #fff",
                            boxShadow: "0 0 2px #aaa",
                            cursor: "pointer",
                            display: "inline-block",
                            position: "relative"
                          }}
                          onClick={() => {
                            syllabusFormData.setFieldValue("course_color", color);
                            setShowColorPopover(false);
                          }}
                        >
                          {syllabusFormData.values.course_color === color && (
                            <span
                              style={{
                                position: "absolute",
                                top: 4,
                                right: 4,
                                color: "#fff",
                                background: "#000a",
                                borderRadius: "50%",
                                width: 18,
                                height: 18,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: 14,
                              }}
                            >
                              <i className="material-symbols-outlined" style={{ fontSize: 16 }}>check</i>
                            </span>
                          )}
                        </span>
                      ))}
                    </div>
                  </Popover.Body>
                </Popover>
              </Overlay>
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
          disabled={freemiumUploadLocked}
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
              <h5>Are You Sure?</h5>
              <p>You want to delete this Syllabus ?</p>
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
      {/* Success Modal */}
      <Modal
        className='modal-theme modal-confirmation modal-approve'
        show={show}
        onHide={handleClose}
        centered
      >
        <Modal.Header>
          <h4 className="modal-title">
            Syllabus Document Update!
          </h4>
          <button type="button" className="btn-close" onClick={handleClose}>
            <i className="material-symbols-outlined">close</i>
          </button>
        </Modal.Header>

        <Modal.Body>
          <div className="modal-confirmation-container">
            <div className="modal-confirmation-icon">
              <i className="material-symbols-outlined">
                mood_bad
              </i>
            </div>
            <div className="modal-confirmation-content">

              <>
                <h5>If you update this document, all the events will be removed.</h5>
                <p>If you do not want to delete the events, please cancel the process.</p>
              </>

            </div>
          </div>

          <div className="modal-button-group modal-full-width-btn modal-footer-button">
            <Button
              variant={'warning'}
              className="btn-icon-text btn-md"
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              variant={'warning'}
              className="btn-icon-text btn-md"
              onClick={() => {
                handleRemoveSyllabusDoc();
                handleClose()
              }}
            >
              Ok
            </Button>
          </div>
        </Modal.Body>
      </Modal>

      {/* Success Modal */}

      {loading && (
        <div className="loader-container">
          <svg className="inner-container" viewBox="0 0 35 35" height="35" width="35">
            <rect
              className="track"
              x="2.5"
              y="2.5"
              fill="none"
              stroke-width="5px"
              width="32.5"
              height="32.5"
            />
            <rect
              className="car"
              x="2.5"
              y="2.5"
              fill="none"
              stroke-width="5px"
              width="32.5"
              height="32.5"
              pathLength="100"
            />
          </svg>
        </div>
      )}

      <SyllabusGroupSuggestModal
        open={showSuggestModal}
        loading={loadingSuggestions || resolvingCanonical}
        candidate={hasCandidate ? (suggestion?.candidates?.[0] || null) : null}
        canonicalPreview={canonical}
        onJoin={handleJoinClick}
        onClose={closeSuggest}
      />

    </>
  );
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(SyllabusDetails);
