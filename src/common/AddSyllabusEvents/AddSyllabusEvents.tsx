import React, { useEffect, useRef, useState } from 'react'
import { Button, Col, Form, Offcanvas, Overlay, Popover, Row } from 'react-bootstrap'
import DefaultAvtar from '/assets/images/avatar-default.svg'
import Select, { components, ControlProps } from "react-select";
import syllabustitleLogo from "/assets/images/syllabus-title-img.svg";
import eventtitleLogo from "/assets/images/event-title-img.svg";
import checktitleLogo from "/assets/images/title-check-icon.svg";
import DatePicker from "react-datepicker";
import { AppDispatch } from '../../redux/store';
import { useDispatch } from 'react-redux';
import { addEvenData, addSyllabusData } from '../../interfaces/interface';
import { CLASS_TIME_IS_REQUIRED, END_DATE_IS_REQUIRED, FILE_FORMATE_VALIDATION, PLEASE_ADD_VALID_PROFESSOR_NAME, PLEASE_ADD_VALID_TITLE, PROFESSOR_NAME_IS_REQUIRED, SELECTION_IS_REQUIRED, START_DATE_IS_REQUIRED, SYLLABUS_COLOR_IS_REQUIRED, SYLLABUS_DOC_IS_REQUIRED, SYLLABUS_TITLE_IS_REQUIRED, TITLE_IS_REQUIRED } from '../../Utility/Validation_Message';
import { customJsonInclude, formatedDate, getDate, isEmptyObjectOrNullUndefiend, isNullUndefinedOrBlank, renderError, SUPPORTED_SYLLABUS_UPLOAD_FORMATS } from '../../Utility/Helper';
import { FormikTouched, FormikValues, setNestedObjectValues, useFormik } from 'formik';
import * as yup from 'yup';
import { addEditEventDataAPI, addEditSyllabusDataAPI, getSyllabusDropDownDataAPI } from '../../redux/Service/User/Courses/courses';
import { MAX_1000, MAX_3, MAX_300, MAX_50, ONLY_ALPHABETS_AND_DOT, ONLY_NUMBERS } from '../../Utility/Validation_Helper';
import InputColor from 'react-input-color';
import { ENUM_FOR_EVENT_PRIORITY, ENUM_FOR_SYLLABUS_TAB, ENUMFORROUTES } from '../../interfaces/enum';
import GetImageIcon from '../GetImageIcon';
import { eventPriorityDropDownData, reminderUnitDropDownData } from '../../Utility/staticDropDown';
import { isUpdatedEvent, isUpdatedSyllabus } from '../../redux/User/Courses/coursesSlice';
import { useNavigate } from 'react-router-dom';
import { useSyllabusGroupSuggest } from '../../hooks/useSyllabusGroupSuggest';
import SyllabusGroupSuggestModal from '../../components/SyllabusGroupSuggestModal/SyllabusGroupSuggestModal';
import { useSyllabusUpload } from '../../context/SyllabusUploadContext';
import { startSyllabusUpload } from '../../Utility/syllabusUpload';
import { isGroupsEnabled } from '../../config/featureFlags';
const AddSyllabusEvents = (props) => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const [showSuggestModal, setShowSuggestModal] = useState(false);
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

  const [showAddSyllabusEvents, setShowAddSyllabusEvents] = useState(false);

  const handleCloseAddSyllabusEvents = () => {
    setShowAddSyllabusEvents(false); props.setShowEvent(false)
    setTimeout(() => {

      setSavedSyllabusFormData(initSyllabusData);
      syllabusFormData.resetForm();
      eventFormData.resetForm();
      setSavedEventFormData(initEventData);
      setSelectedTab(ENUM_FOR_SYLLABUS_TAB.SYLLABUS_DETAILS);
    }, 300);

  }
  const handleShowAddSyllabusEvents = () => setShowAddSyllabusEvents(true);
  useEffect(() => {
    if (props?.show) {
      handleShowAddSyllabusEvents();
      syllabusFormData.resetForm();
      setSavedSyllabusFormData(initSyllabusData);
      eventFormData.resetForm();
      setSavedEventFormData(initEventData);

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
    course_color: "#239BC2",
    title: "",
    professor_name: "",
    syllabus_doc: null,

  }
  const [savedSyllabusFormData, setSavedSyllabusFormData] = useState<addSyllabusData>(initSyllabusData);
  const [loading, setloading] = useState(false)
  const onSubmitForSyllabus = (values) => {
  }
  const localPlanTier = (() => {
    try {
      return localStorage.getItem("plan_tier");
    } catch {
      return null;
    }
  })();
  const isFreemiumPlan =
    props?.isFreemiumPlan ??
    (localPlanTier === "freemium");
  const hasSubscription = props?.hasSubscription ?? (() => {
    try {
      return localStorage.getItem("has_subscription") === "true";
    } catch {
      return false;
    }
  })();
  const existingSyllabusCount =
    typeof props?.existingSyllabusCount === "number"
      ? props.existingSyllabusCount
      : 0;
  // Use API-provided limit if available, otherwise fall back to hardcoded default
  const syllabusLimit = typeof props?.syllabusLimit === "number" ? props.syllabusLimit : 3;
  const remainingUploads = typeof props?.remainingUploads === "number" ? props.remainingUploads : null;
  
  // Use API-provided remainingUploads if available, otherwise calculate from count
  const freemiumUploadLocked =
    isFreemiumPlan &&
    !hasSubscription &&
    (!!props?.freemiumLimitReached ||
      (remainingUploads !== null && remainingUploads <= 0) ||
      (remainingUploads === null && existingSyllabusCount >= syllabusLimit));

  const handleUpgrade = () => {
    if (props?.onUpgradeClick) {
      props.onUpgradeClick();
      return;
    }
    navigate(ENUMFORROUTES.PLAN_DETAILS);
  };
  const validationSchemaForSyllabus = yup.object({
    title: yup.string().required(SYLLABUS_TITLE_IS_REQUIRED),
    class_time: yup.string().required(CLASS_TIME_IS_REQUIRED),
    professor_name: yup.string().matches(ONLY_ALPHABETS_AND_DOT, PLEASE_ADD_VALID_PROFESSOR_NAME).notRequired().notRequired(),
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
            : yup.object().nullable()

      }),
  })
  const syllabusFormData = useFormik({
    initialValues: savedSyllabusFormData || initSyllabusData,
    onSubmit: onSubmitForSyllabus,
    validationSchema: validationSchemaForSyllabus,
    enableReinitialize: true,
  })
  const handleSyllabusSubmit = async () => {
    if (freemiumUploadLocked) {
      handleUpgrade();
      return;
    }

    syllabusFormData.handleSubmit();
    const syllabusFormDataErrors = await syllabusFormData.validateForm();
    if (Object.keys(syllabusFormDataErrors).length > 0) {
      syllabusFormData.setTouched(
        setNestedObjectValues<
          FormikTouched<FormikValues>
        >(syllabusFormDataErrors, true))
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
      };

      // Close the offcanvas immediately - upload will continue in background
      handleCloseAddSyllabusEvents();

      try {
        // Start background upload - this opens the floating modal
        const result = await startSyllabusUpload(file, metadata, {
          startUpload: syllabusUploadContext.startUpload,
          setProgress: syllabusUploadContext.setProgress,
          setStatus: syllabusUploadContext.setStatus,
          setSyllabusId: syllabusUploadContext.setSyllabusId,
        });

        // Upload complete - show group suggestions & refresh lists
        if (result.syllabusId) {
          setSyllabusId(String(result.syllabusId));
          await fetchSuggestions(String(result.syllabusId));
          setShowSuggestModal(true);
          dispatch(isUpdatedSyllabus(true));
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
    }

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
        payload?.doc_id ||
        null;
      handleCloseAddSyllabusEvents();
      if (sid) {
        setSyllabusId(String(sid));
        await fetchSuggestions(String(sid));
        setShowSuggestModal(true);
        dispatch(isUpdatedSyllabus(true));
      } else {
        try { console.log('Syllabus save payload (no syllabusId found):', payload); } catch {}
      }
    }
    setloading(false);

  }


  const handleRemoveSyllabusDoc = () => {
    syllabusFormData.setFieldValue("syllabus_doc", null)
    syllabusFormData.setFieldValue("syllabus_doc_name", null)
    syllabusDocRef.current.value = null;
  }
  useEffect(() => {
    if (syllabusFormData?.dirty) {

      syllabusFormData.setFieldTouched("syllabus_doc", true);
    }

    return () => {

    }
  }, [syllabusFormData.values.syllabus_doc])


  /* ------------------------- Add Syllabus Data End ------------------------ */

  /* -------------------------- Add Event Data Start -------------------------- */
  const [syllabusDropDownData, setSyllabusDropDownData] = useState<any>([]);

  const handleGetSyllabusDropDownData = async (retries = 6) => {
    for (let i = 0; i < retries; i++) {
      const response = await dispatch(getSyllabusDropDownDataAPI({}));
      console.log(response?.payload)
      if (response?.payload?.length) {
        setSyllabusDropDownData(response.payload);
        return;
      }
      if (i < retries - 1) await new Promise(r => setTimeout(r, 10000));
    }
    setSyllabusDropDownData([]);
  };

  const initEventData: addEvenData = {
    start_date: null,
    end_date: null,
    title: "",
    note: "",
    is_reminder: false,
    reminder: [],
    syllabus_id: null,
    priority: ENUM_FOR_EVENT_PRIORITY.LOW

  }
  const [savedEventFormData, setSavedEventFormData] = useState<addEvenData>(initEventData);
  const onSubmitForEvent = (values) => { }
  const validationSchemaForEvent = yup.object({
    title: yup.string().required(TITLE_IS_REQUIRED),
    start_date: yup.string().required(START_DATE_IS_REQUIRED),
    // end_date: yup.string().required(END_DATE_IS_REQUIRED),
    end_date: yup
      .string()
      .required(END_DATE_IS_REQUIRED)
      .test("is-greater", "End date must be greater than start date", function (value) {
        const { start_date } = this.parent; // Access other fields in the schema
        if (!value || !start_date) return true; // Skip validation if either is missing
        return new Date(value) > new Date(start_date); // Check if end_date > start_date
      }),
    syllabus_id: yup.string().required(SELECTION_IS_REQUIRED),
    is_reminder: yup.boolean(),
    reminder: yup.array()
      .of(
        yup.object().shape({
          unit: yup
            .string()
            .nullable()
            .when("is_reminder", {
              is: (is_reminder) =>
                eventFormData?.values?.is_reminder === true,
              then: (schema) => schema.required("Unit is required"),
              otherwise: (schema) => schema.notRequired(),
            }),
          value: yup
            .string()
            .matches(ONLY_NUMBERS, "Only numbers are allowed")
            .nullable()
            .when("is_reminder", {
              is: (is_reminder) =>
                eventFormData?.values?.is_reminder === true,
              then: (schema) => schema.required("Value is required"),
              otherwise: (schema) => schema.notRequired(),
            })
        })
      )
      .nullable()
      .default([])
      .when("is_reminder", {
        is: (is_reminder) => is_reminder === true,
        then: (schema) =>
          schema
            .required("Reminder is required")
            .test("no-duplicates", "Duplicate reminders are not allowed", (reminders) => {
              if (!Array.isArray(reminders) || reminders.length === 0) return true;

              const seen = new Set();
              for (const reminder of reminders) {
                const key = `${reminder.unit}-${reminder.value}`;
                if (seen.has(key)) {
                  return false; // Duplicate found
                }
                seen.add(key);
              }
              return true; // No duplicates
            }),
        otherwise: (schema) => schema.notRequired(),
      }),

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
      start_date: getDate(eventFormData.values.start_date),
      end_date: getDate(eventFormData.values.end_date),
      note: eventFormData.values.note,
      is_reminder: eventFormData.values.is_reminder,
      reminder: eventFormData.values.reminder,
      syllabus_id: eventFormData.values.syllabus_id,


    }





    customJsonInclude(reqBody);

    const response = await dispatch(addEditEventDataAPI(reqBody));
    if (response) {
      handleCloseAddSyllabusEvents();
      dispatch(isUpdatedEvent(true));
      props?.setIsAddNewData(true);
    }
  }

  const handleChangeReminder = (is_reminder) => {
    eventFormData.setFieldValue("is_reminder", is_reminder);
    if (is_reminder) {
      addReminderList()
    } else {
      eventFormData.setFieldValue("reminder", []);
    }
  }

  const addReminderList = () => {
    let obj: any = {
      unit: "",
      value: "",
    }
    const reminder: any = [...eventFormData.values.reminder];
    const isAnyValueNull = reminder?.some((item: any) => (isNullUndefinedOrBlank(item?.unit) || isNullUndefinedOrBlank(item?.value)))
    // console.log(!isAnyValueNull, "isAnyValueNull", reminder, eventFormData?.values?.is_reminder,(isAnyValueNull && eventFormData?.values?.is_reminder));
    if (isAnyValueNull && eventFormData?.values?.is_reminder) {

      reminder?.forEach((item: any, index: number) => {
        eventFormData.setFieldTouched(`reminder.${index}.unit`, true);
        eventFormData.setFieldTouched(`reminder.${index}.value`, true);
      })

      return;

    }
    const updatedData = [...reminder, obj];
    eventFormData.setFieldValue("reminder", updatedData);
  }

  const removeReminderList = (index) => {
    let reminder: any = [...eventFormData.values.reminder];
    let errors: any = typeof eventFormData.errors.reminder !== "string" ? [...eventFormData.errors.reminder as any || []] : null;
    reminder.splice(index, 1);
    eventFormData.setFieldValue("reminder", reminder);
    const updatedErrors: any = eventFormData.errors.reminder
      ? errors?.filter((_, i) => i !== index)
      : [];
    const updatedTouched = eventFormData.touched.reminder
      ? errors?.filter((_, i) => i !== index)
      : [];

    setTimeout(() => {

      eventFormData.setErrors({
        ...eventFormData.errors,
        reminder: updatedErrors || null,
      });

      eventFormData.setTouched({
        ...eventFormData.touched,
        reminder: updatedTouched || null,
      });
      eventFormData.validateField(`reminder`);
    }, 200);


  }



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


  // Course colors matching the new design system (synced with getColorClassName in Courses.tsx)
  const colorPalette = [
    "#239BC2", // cyan (default)
    "#F97316", // orange
    "#EAB308", // yellow
    "#22C55E", // green
    "#14B8A6", // teal
    "#D97706", // gold
    "#3B82F6", // blue
    "#cddc39", // lime
    "#EF4444", // red
    "#8B5CF6", // purple
    "#EC4899", // pink
    "#6B7280", // gray
    "#78716C", // stone
    "#6366F1", // indigo
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
                            className="form-group required"

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
                            {freemiumUploadLocked && (
                              <div className="alert alert-warning d-flex align-items-center justify-content-between gap-2">
                                <div>
                                  <strong>Free plan limit reached.</strong> Upload up to 3 syllabi for free, then upgrade for unlimited uploads.
                                </div>
                                <Button size="sm" variant="primary" onClick={handleUpgrade}>
                                  View plans
                                </Button>
                              </div>
                            )}
                            <div className='attachments-container'>
                              <div className='attachments-content'>
                                <button className='btn btn-attachments'><i className="bi bi-upload"></i></button>
                                <p>Drag and Drop file here or <span className='text-primary'>Choose file</span></p>
                              </div>
                              <input className=' ' type="file"
                                accept=".pdf,.doc,.docx"
                                disabled={freemiumUploadLocked}

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
                                      {/* <div className='attachments-image'> */}
                                      {/* <img src={DefaultAvtar} alt="DefaultAvtar" /> */}
                                      {/* <GetImageIcon
                                          image={syllabusFormData?.values?.syllabus_doc_name}
                                        /> */}
                                      {/* </div> */}
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
                              <Form.Group className="form-group required">
                                <Form.Label>Class Time</Form.Label>
                                <div className="react-datepicker-container form-group-icon-start">
                                  <i className="material-symbols-outlined control-icon">schedule</i>
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
                                  // showIcon
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
                            {/* <Form.Label>Course Color</Form.Label>
                            <div className="form-color-picker color-picker-with-box ">


                              <Form.Control
                                className="course-color-input"
                                type="color"
                                title="Couse Color"
                                {...syllabusFormData.getFieldProps(
                                  "course_color"
                                )}

                                onChange={(e) => {
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
                              <Form.Group className="form-group required">
                                <Form.Label>Start Date</Form.Label>
                                <div className="react-datepicker-container form-group-icon-end">
                                  <i className="material-symbols-outlined control-icon">calendar_month</i>
                                  <DatePicker
                                    dropdownMode="select"
                                    // isClearable={true}
                                    selected={eventFormData.values.start_date}
                                    onChange={(date) => {
                                      if (date === null) {
                                        eventFormData.setFieldValue("start_date", null);
                                        eventFormData.setFieldValue("end_date", null);
                                        return;
                                      }

                                      const now = new Date();
                                      const selectedDate = new Date(date);

                                      // Check if the selected date is the current date (ignoring time)
                                      const isSameDate =
                                        now.getFullYear() === selectedDate.getFullYear() &&
                                        now.getMonth() === selectedDate.getMonth() &&
                                        now.getDate() === selectedDate.getDate();

                                      // Only apply time logic if the selected date is the current date
                                      if (isSameDate && !date?.getHours() && !date?.getMinutes()) {
                                        selectedDate.setHours(now.getHours());
                                        selectedDate.setMinutes(now.getMinutes());
                                      }

                                      eventFormData.setFieldValue("start_date", selectedDate);

                                      // Calculate the end date as 30 minutes after the start date
                                      const endDate = new Date(selectedDate.getTime() + 30 * 60 * 1000);

                                      // Set the calculated end date
                                      eventFormData.setFieldValue("end_date", endDate);
                                    }}

                                    showTimeSelect
                                    dateFormat="MM/dd/yyyy hh:mm aa"
                                    timeIntervals={15}
                                    className="form-control"
                                    popperProps={{ strategy: "fixed" }}
                                    placeholderText="Select Date"
                                    onBlur={() => {
                                      eventFormData.setFieldTouched("start_date", true)
                                    }}
                                    minDate={new Date()}
                                    filterTime={(time) => {
                                      const now = new Date();
                                      const selectedDate = eventFormData.values.start_date || new Date();

                                      // Disable times earlier than the current time for today's date
                                      if (selectedDate.toDateString() === now.toDateString()) {
                                        return time.getTime() >= now.getTime();
                                      }

                                      // Allow all times for future dates
                                      return true;
                                    }}
                                  />
                                  {eventFormData.touched.start_date &&
                                    eventFormData.errors.start_date
                                    && renderError(eventFormData.errors.start_date as any)}

                                </div>
                              </Form.Group>
                            </Col>
                            <Col md={6}>
                              <Form.Group className="form-group required">
                                <Form.Label>End Date</Form.Label>
                                <div className="react-datepicker-container form-group-icon-end">
                                  <i className="material-symbols-outlined control-icon">calendar_month</i>
                                  <DatePicker
                                    // isClearable={true}
                                    selected={eventFormData.values.end_date}
                                    onChange={(date) => eventFormData.setFieldValue("end_date", date)}
                                    showTimeSelect
                                    dateFormat="MM/dd/yyyy hh:mm aa"
                                    timeIntervals={15}
                                    className="form-control"
                                    popperProps={{ strategy: "fixed" }}
                                    placeholderText="Select Date"
                                    minDate={eventFormData.values.start_date}

                                    onBlur={() => {
                                      eventFormData.setFieldTouched("end_date", true)
                                    }}
                                    filterTime={(time) => {
                                      const now = new Date();
                                      const selectedDate = eventFormData.values.start_date || new Date();

                                      // Disable times earlier than the current time for today's date
                                      if (selectedDate.toDateString() === now.toDateString()) {
                                        return time.getTime() >= now.getTime();
                                      }

                                      // Allow all times for future dates
                                      return true;
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
                            className="form-group required"
                            controlId="exampleForm.ControlInput1"
                          >
                            <Form.Label>Title</Form.Label>
                            <div className="form-group">
                              <Form.Control type="text" placeholder="Enter Title"
                                {...eventFormData.getFieldProps("title")}
                                maxLength={MAX_1000}
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
                              <Form.Control as="textarea" rows={3} placeholder="Enter Note"
                                {...eventFormData.getFieldProps("note")}
                                maxLength={MAX_300}
                              />
                            </div>
                          </Form.Group>
                          <Form.Group className="form-group required" controlId="exampleForm.ControlInput1">
                            <Form.Label>Calendar</Form.Label>
                            <Select
                              options={syllabusDropDownData}
                              placeholder={<div>Select </div>}
                              onChange={(selectedOption) => {
                                eventFormData.setFieldValue("syllabus_id", selectedOption?.value ? selectedOption?.value : null);


                              }}
                              value={syllabusDropDownData?.filter(({ value }) => {
                                return (
                                  value ===
                                  eventFormData.values.syllabus_id
                                );
                              })}
                              // onBlur={() => {
                              //     // objectiveDetailsFormData.setFieldTouched("theme_id", true)
                              //     handleUpdateDetails()
                              // }}
                              isClearable
                              menuPosition="fixed"
                              className="react-select-container"
                            />
                            {eventFormData.touched.syllabus_id &&
                              eventFormData.errors.syllabus_id
                              && renderError(eventFormData.errors.syllabus_id as any)}
                          </Form.Group>
                          <Form.Group className="form-group" controlId="exampleForm.ControlInput1">
                            <Form.Label>Priority</Form.Label>
                            <Select
                              options={eventPriorityDropDownData}
                              placeholder={<div>Select Priority </div>}
                              onChange={(selectedOption) => {
                                eventFormData.setFieldValue("priority", selectedOption?.value ? selectedOption?.value : null);


                              }}
                              value={eventPriorityDropDownData?.filter(({ value }) => {
                                return (
                                  value ===
                                  eventFormData.values.priority
                                );
                              })}
                              // onBlur={() => {
                              //     // objectiveDetailsFormData.setFieldTouched("theme_id", true)
                              //     handleUpdateDetails()
                              // }}
                              // isClearable
                              menuPosition="fixed"
                              className="react-select-container"
                            />
                          </Form.Group>
                          <div className="Reminder-box">
                            <div className="title-with-switch">
                              <div className="title-text"><h4>Reminder (Notify me before start date)</h4></div>
                              <div className="switch-box ">
                                <label className="switch" htmlFor="switch-for-event-reminder">
                                  <input type="checkbox" id='switch-for-event-reminder'
                                    checked={eventFormData?.values?.is_reminder}
                                    onChange={() => { handleChangeReminder(!eventFormData.values.is_reminder) }}
                                  />
                                  <div className="slider round"></div>
                                </label>
                              </div>
                            </div>
                            {
                              eventFormData?.values.is_reminder && !isEmptyObjectOrNullUndefiend(eventFormData?.values.reminder) &&
                              <>
                                {
                                  eventFormData?.values?.reminder?.map((item: any, index: number) => {
                                    return (
                                      <>
                                        <div className="remider-fields" key={index}>
                                          <Form.Group className='form-group required'>
                                            <Form.Label>Unit</Form.Label>
                                            <Select
                                              options={reminderUnitDropDownData}
                                              placeholder={<div>Select Unit</div>}
                                              menuPosition="fixed"
                                              className="react-select-container"
                                              onChange={(selectedOption: any) => {
                                                eventFormData.setFieldValue(
                                                  `reminder.${index}.unit`, selectedOption.value)
                                              }}
                                              value={reminderUnitDropDownData?.filter(({ value }) => {
                                                return (
                                                  value ===
                                                  // searchByCustomer
                                                  eventFormData?.values?.reminder?.[index]?.unit
                                                );
                                              })}
                                              onBlur={() => {
                                                eventFormData.setFieldTouched(
                                                  `reminder.${index}.unit`,
                                                  true
                                                );
                                              }}
                                            />
                                            {(eventFormData?.touched?.reminder?.[index]?.unit as any) &&
                                              (eventFormData?.errors?.reminder?.[index]?.unit as any) &&
                                              renderError(eventFormData?.errors?.reminder?.[index]?.unit as any)}


                                          </Form.Group>
                                          <Form.Group className="form-group required" controlId="exampleForm.ControlInput1">
                                            <Form.Label>Value</Form.Label>
                                            <Form.Control type="text" placeholder="Enter Value"
                                              {...eventFormData.getFieldProps(`reminder.${index}.value`)}
                                              // onChange={(e) => {
                                              //   console.log(taskFormData.values.remider);
                                              // }}
                                              maxLength={MAX_3}
                                              onBlur={() => {
                                                eventFormData.setFieldTouched(
                                                  `reminder.${index}.value`,
                                                  true
                                                );
                                                // handleBlurValueUpdate(`reminder.${index}.value`);
                                              }}


                                            />
                                            {(eventFormData?.touched?.reminder?.[index]?.value as any) &&
                                              (eventFormData?.errors?.reminder?.[index]?.value as any) &&
                                              renderError(eventFormData?.errors?.reminder?.[index]?.value as any)}
                                          </Form.Group>
                                          {
                                            eventFormData?.values?.reminder?.length > 1 ?
                                              <button type="button" className="btn btn-light-danger" onClick={() => { removeReminderList(index) }}>
                                                <i className="material-symbols-outlined">delete</i>
                                              </button> : null
                                          }

                                        </div>

                                      </>
                                    )
                                  }
                                  )
                                }
                                {(eventFormData?.touched?.reminder as any) &&
                                  (eventFormData?.errors?.reminder as any) &&
                                  typeof eventFormData?.errors?.reminder === "string" &&
                                  renderError((eventFormData?.errors?.reminder as any))}
                                < div className="add-remider-filed-button">
                                  <Button variant='warning' className='btn-icon btn-icon-text'
                                    disabled={!isNullUndefinedOrBlank(eventFormData?.errors?.reminder) && typeof eventFormData?.errors?.reminder === "string"}
                                    onClick={() => { addReminderList() }}> <i className="material-symbols-outlined">add</i></Button>
                                </div>
                              </>
                            }

                          </div>
                        </div>
                      </div> : <></>
                  }
                  {/* Add Event Body detail */}
                  <div className="bottom-button-group">
                    <Button type="button" className="btn btn-light-white me-auto"
                      onClick={() => { handleCloseAddSyllabusEvents() }}
                    >
                      Cancel
                    </Button>
                    <Button type="button" className="btn btn-light-white"
                      onClick={() => { handleClearData() }}
                    >
                      Clear
                    </Button>
                    <Button type="button" className="btn btn-primary"
                      disabled={selectedTab === ENUM_FOR_SYLLABUS_TAB.SYLLABUS_DETAILS && freemiumUploadLocked}
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

      {isGroupsEnabled() && (
      <SyllabusGroupSuggestModal
        open={showSuggestModal}
        loading={loadingSuggestions || resolvingCanonical}
        candidate={hasCandidate ? (suggestion?.candidates?.[0] || null) : null}
        canonicalPreview={canonical}
        onJoin={async () => {
          const sid = hookSyllabusId;
          const result = await createAndJoin(sid);
          if (result && result.id) {
            setShowSuggestModal(false);
            resetSuggest();
            navigate(`/groups/${result.id}`);
          }
        }}
        onClose={() => { setShowSuggestModal(false); resetSuggest(); }}
      />
      )}

    </>
  )
}

export default AddSyllabusEvents
