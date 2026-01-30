import React, { useEffect, useRef, useState } from "react";
import { Button, Form, Modal, Overlay, Popover } from "react-bootstrap";
import { connect, useDispatch } from "react-redux";
import { HexColorPicker } from 'react-colorful';
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
import { isGroupsEnabled } from "../../../config/featureFlags";
const SyllabusDetails = (props) => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const [showSuggestModal, setShowSuggestModal] = useState<boolean>(false);
  const [showEditDetailsModal, setShowEditDetailsModal] = useState<boolean>(false);
  const [showColorWheel, setShowColorWheel] = useState<boolean>(false);
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
      // Handle syllabus_doc as either object with url or direct string
      const syllabusDocData = props?.selectedSyllabusObj?.syllabus_doc;
      const syllabusDocUrl = typeof syllabusDocData === 'string' 
        ? syllabusDocData 
        : syllabusDocData?.url || props?.selectedSyllabusObj?.doc_url;
      const syllabusDocName = typeof syllabusDocData === 'object' 
        ? syllabusDocData?.original_name 
        : props?.selectedSyllabusObj?.doc_name || "";
      
      const newData = {
        ...props?.selectedSyllabusObj,
        class_time: props?.selectedSyllabusObj?.class_time
          ? new Date(`1970-01-01T${props?.selectedSyllabusObj?.class_time}`)
          : null,
        syllabus_doc: syllabusDocUrl,
        syllabus_doc_name: syllabusDocName,
      };
      props?.setPdfPreviewLink(syllabusDocUrl);

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
  const upgradeRequired = !!props?.upgradeRequired;

  // View vs edit state (match new Courses tab design)
  const [isEditingDetails, setIsEditingDetails] = useState<boolean>(false);
  useEffect(() => {
    // Existing courses should open in "Course Information" view mode.
    // New course (no id) should open in edit mode.
    setIsEditingDetails(isNewSyllabus);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props?.selectedSyllabusObj?.id]);

  const closeEditDetailsModal = () => {
    setShowEditDetailsModal(false);
    // Reset any unsaved edits back to the last loaded values
    try {
      syllabusFormData.resetForm();
    } catch {}
    setIsEditingDetails(false);
  };

  const getSyllabusDocMeta = (obj: any) => {
    const syllabusDocData = obj?.syllabus_doc;
    const url =
      typeof syllabusDocData === "string"
        ? syllabusDocData
        : syllabusDocData?.url || obj?.doc_url || obj?.syllabus_doc_url;
    const name =
      typeof syllabusDocData === "object"
        ? syllabusDocData?.original_name
        : obj?.doc_name || obj?.syllabus_doc_name || "";
    return { url, name };
  };

  const formatTime = (value: any): string => {
    if (isNullUndefinedOrBlank(value)) return "";
    if (typeof value === "string") {
      // If backend already provides a display string like "TTh 2:00 PM - 3:30 PM"
      if (value.includes("-") || value.includes("–")) return value;
      // If it's SQL time "HH:mm:ss"
      const m = value.match(/^(\d{2}):(\d{2})(?::(\d{2}))?/);
      if (m) {
        const d = new Date();
        d.setHours(Number(m[1]), Number(m[2]), Number(m[3] ?? 0), 0);
        return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
      }
      return value;
    }
    if (value instanceof Date && !Number.isNaN(value.getTime())) {
      return value.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
    }
    return "";
  };

  const getLightColor = (hex: string) => {
    if (!hex || typeof hex !== "string" || !hex.startsWith("#") || hex.length < 7) {
      return "rgba(35, 155, 194, 0.15)";
    }
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    if ([r, g, b].some((n) => Number.isNaN(n))) return "rgba(35, 155, 194, 0.15)";
    return `rgba(${r}, ${g}, ${b}, 0.15)`;
  };

  const getCourseColorName = (hex?: string) => {
    if (!hex || typeof hex !== "string") return "";
    const map: Record<string, string> = {
      "#239bc2": "Cyan",
      "#f97316": "Orange",
      "#eab308": "Yellow",
      "#22c55e": "Green",
      "#14b8a6": "Teal",
      "#d97706": "Gold",
      "#3b82f6": "Blue",
      "#cddc39": "Lime",
      "#ef4444": "Red",
      "#8b5cf6": "Purple",
      "#ec4899": "Pink",
      "#6b7280": "Gray",
      "#78716c": "Stone",
      "#6366f1": "Indigo",
    };
    return map[hex.toLowerCase()] || hex;
  };

  const handleUnlockMoreUploads = () => {
    if (upgradeRequired) {
      if (props?.onUpgradeClick) {
        props.onUpgradeClick();
        return;
      }
      navigate(ENUMFORROUTES.PLAN_DETAILS);
      return;
    }
    if (props?.onReferralClick) {
      props.onReferralClick();
      return;
    }
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
  const handleSyllabusSubmit = async (): Promise<boolean> => {
    if (freemiumUploadLocked) {
      handleUnlockMoreUploads();
      return false;
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
      return false;
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
      return true;
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

      // Immediately update the currently selected syllabus object so the details view updates
      // without requiring navigation away/back.
      try {
        const mergedSelected = {
          ...(props?.selectedSyllabusObj || {}),
          title: syllabusFormData.values.title,
          professor_name: syllabusFormData.values.professor_name,
          course_color: syllabusFormData.values.course_color,
          class_time: reqBody.class_time,
          syllabus_doc: returnedUrl || (reqBody as any).url || (props?.selectedSyllabusObj as any)?.syllabus_doc,
          doc_url: returnedUrl || (props?.selectedSyllabusObj as any)?.doc_url,
          syllabus_doc_url: returnedUrl || (props?.selectedSyllabusObj as any)?.syllabus_doc_url,
          doc_name: (props?.selectedSyllabusObj as any)?.doc_name || syllabusFormData?.values?.syllabus_doc_name,
          syllabus_doc_name: syllabusFormData?.values?.syllabus_doc_name,
        };
        if (typeof props?.onSyllabusUpdated === "function") {
          props.onSyllabusUpdated(mergedSelected);
        }
        // Keep local form base data in sync for subsequent opens/resets
        const { url: nextUrl, name: nextName } = getSyllabusDocMeta(mergedSelected);
        setSavedSyllabusFormData({
          ...mergedSelected,
          class_time: mergedSelected?.class_time ? new Date(`1970-01-01T${String(mergedSelected.class_time).slice(0, 8)}`) : null,
          syllabus_doc: nextUrl,
          syllabus_doc_name: nextName,
        } as any);
      } catch {}

      // Refresh courses list for any other consumers (course cards, etc.)
      try {
        props.handleGetCourseList?.();
      } catch {}
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
    return !!response;
  };

  const handleSaveEditDetails = async () => {
    const ok = await handleSyllabusSubmit();
    if (ok) {
      closeEditDetailsModal();
    }
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
      <div className="tab-body-container">
        {/* View mode (Course Information) */}
        {!isEditingDetails && !isNewSyllabus ? (
          <>
            <div className="syllabus-details-header">
              <h3 className="syllabus-details-title">Course Information</h3>
              <button
                type="button"
                className="btn btn-secondary edit-syllabus-btn"
                onClick={() => setShowEditDetailsModal(true)}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
                Edit Details
              </button>
            </div>

            {(() => {
              const obj = props?.selectedSyllabusObj || {};
              const { url: docUrl, name: docName } = getSyllabusDocMeta(obj);
              const title = obj?.title || "";
              const professor = obj?.professor_name || "";
              const classTimeDisplay =
                obj?.class_time_display ||
                obj?.classTimeDisplay ||
                obj?.class_time ||
                "";
              const classTimeText = typeof classTimeDisplay === "string" ? classTimeDisplay : formatTime(classTimeDisplay);
              const colorHex = obj?.course_color || "";
              const colorName = getCourseColorName(colorHex);

              return (
                <div className="syllabus-details-box">
                  <div className="form-group">
                    <label className="form-label">Course Title</label>
                    <input className="form-input" value={title} readOnly />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Professor Name</label>
                      <input className="form-input" value={professor} readOnly />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Class Time</label>
                      <input className="form-input" value={classTimeText} readOnly />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Uploaded Syllabus</label>
                    <div className="syllabus-file-display">
                      <div className="file-icon" aria-hidden="true">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                          <polyline points="14 2 14 8 20 8" />
                        </svg>
                      </div>
                      <div className="file-info">
                        <div className="file-name">{!isNullUndefinedOrBlank(docName) ? docName : "No syllabus uploaded"}</div>
                        <div className="file-size">{!isNullUndefinedOrBlank(docName) ? "PDF Document" : ""}</div>
                      </div>
                      <button
                        type="button"
                        className="file-view-btn"
                        disabled={isNullUndefinedOrBlank(docUrl)}
                        title={isNullUndefinedOrBlank(docUrl) ? "No syllabus to preview" : "View syllabus"}
                        onClick={() => {
                          if (!isNullUndefinedOrBlank(docUrl)) props?.setPdfPreviewLink(docUrl);
                        }}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Course Color</label>
                    <div className="course-color-display">
                      <span className="color-swatch-large" style={{ background: colorHex || "#239BC2" }} />
                      <span className="color-name">{colorName}</span>
                    </div>
                  </div>
                </div>
              );
            })()}
          </>
        ) : (
          /* Edit mode (existing form) */
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
                  {upgradeRequired ? (
                    <>
                      <strong>Free plan limit reached.</strong> You can upload up to 3 syllabi on the free plan. Upgrade to keep adding courses.
                    </>
                  ) : (
                    <>
                      <strong>Referral required.</strong> Share your referral link to unlock uploads 2 and 3.
                    </>
                  )}
                </div>
                <Button size="sm" variant="primary" onClick={handleUnlockMoreUploads}>
                  {upgradeRequired ? "View plans" : "Share referral link"}
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
      )}
      </div>

      {/* New Frontend: Edit Course Details modal (matches Add New Syllabus modal) */}
      <Modal
        className={`add-syllabus-modal themed`}
        show={showEditDetailsModal}
        onHide={closeEditDetailsModal}
        centered
        dialogClassName="syllabus-modal"
        style={
          ({
            "--syllabus-color": syllabusFormData.values.course_color || "#239BC2",
            "--syllabus-color-light": getLightColor(syllabusFormData.values.course_color || "#239BC2"),
          } as React.CSSProperties)
        }
      >
        <Modal.Header>
          <Modal.Title>Edit Course Details</Modal.Title>
          <button type="button" className="modal-close-btn" onClick={closeEditDetailsModal}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </Modal.Header>

        <Modal.Body>
          {/* Course Title */}
          <div className="form-group">
            <label className="form-label">
              Course Title <span className="required">*</span>
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="Enter Course Title"
              {...syllabusFormData.getFieldProps("title")}
              maxLength={MAX_50}
            />
            {syllabusFormData.touched.title && syllabusFormData.errors.title
              ? renderError(syllabusFormData.errors.title as any)
              : null}
          </div>

          {/* Professor Name + Class Time */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Professor Name</label>
              <input
                type="text"
                className="form-input"
                placeholder="Enter Professor Name"
                {...syllabusFormData.getFieldProps("professor_name")}
                maxLength={MAX_50}
              />
              {syllabusFormData.touched.professor_name && syllabusFormData.errors.professor_name
                ? renderError(syllabusFormData.errors.professor_name as any)
                : null}
            </div>

            <div className="form-group">
              <label className="form-label">
                Class Time <span className="required">*</span>
              </label>
              <DatePicker
                placeholderText="Select Class Time"
                selected={syllabusFormData.values.class_time as any}
                onChange={(date) => syllabusFormData.setFieldValue("class_time", date)}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={15}
                timeCaption="Select Time"
                dateFormat="h:mm aa"
                className="form-input"
                showPopperArrow={false}
                popperClassName="syllabus-time-popper"
                calendarClassName="syllabus-time-calendar"
                onBlur={() => syllabusFormData.setFieldTouched("class_time", true)}
              />
              {syllabusFormData.touched.class_time && syllabusFormData.errors.class_time
                ? renderError(syllabusFormData.errors.class_time as any)
                : null}
            </div>
          </div>

          {/* Upload syllabus */}
          <div className="form-group">
            <label className="form-label">Upload Syllabus</label>
            <div
              className="file-upload-area"
              onClick={() => syllabusDocRef.current?.click()}
              style={{ cursor: 'pointer' }}
            >
              <div className="upload-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
              </div>
              <p className="upload-text">
                Drag and Drop file here or <span className="upload-link">Choose file</span>
              </p>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e: any) => {
                  if (!isEmptyObjectOrNullUndefiend(e.target?.files)) {
                    syllabusFormData.setFieldValue("syllabus_doc", e.target?.files as any);
                    syllabusFormData.setFieldValue("syllabus_doc_name", e.target?.files?.[0]?.name as any);
                    const url: any = URL.createObjectURL(e.target?.files?.[0] as any);
                    props?.setPdfPreviewLink(url);
                  }
                }}
                ref={syllabusDocRef}
                hidden
              />
              {!isEmptyObjectOrNullUndefiend((syllabusFormData as any)?.values?.syllabus_doc_name) ? (
                <p className="file-name">{(syllabusFormData as any)?.values?.syllabus_doc_name}</p>
              ) : null}
            </div>
            {syllabusFormData.touched.syllabus_doc && syllabusFormData.errors.syllabus_doc
              ? renderError(syllabusFormData.errors.syllabus_doc as any)
              : null}
          </div>

          {/* Course Color */}
          <div className="form-group" style={{ position: 'relative' }}>
            <label className="form-label">Course Color</label>
            <div className="color-picker-container">
              {colorPalette.map((color) => (
                <div
                  key={color}
                  className={`color-option${syllabusFormData.values.course_color === color ? " selected" : ""}`}
                  style={{ backgroundColor: color }}
                  onClick={() => {
                    syllabusFormData.setFieldValue("course_color", color);
                    setShowColorWheel(false);
                  }}
                />
              ))}
              {/* Color wheel trigger - circular button */}
              <div
                className={`color-option color-wheel-trigger${!colorPalette.includes(syllabusFormData.values.course_color) ? " selected" : ""}`}
                onClick={() => setShowColorWheel(!showColorWheel)}
                title="Pick custom color"
                style={{
                  '--selected-color': !colorPalette.includes(syllabusFormData.values.course_color) 
                    ? syllabusFormData.values.course_color 
                    : undefined
                } as React.CSSProperties}
              />
            </div>
          </div>
        </Modal.Body>

        <div className="syllabus-footer">
          <button type="button" className="btn btn-outline" onClick={closeEditDetailsModal}>
            Cancel
          </button>
          <div className="modal-footer-right">
            <button type="button" className="btn btn-primary" disabled={freemiumUploadLocked} onClick={handleSaveEditDetails}>
              Save Changes
            </button>
          </div>
        </div>
      </Modal>

      {/***** Color Wheel Modal *****/}
      <Modal
        className="modal-theme modal-confirmation color-wheel-modal"
        show={showColorWheel}
        onHide={() => setShowColorWheel(false)}
        centered
        backdrop={true}
        backdropClassName="color-wheel-modal-backdrop"
        keyboard
      >
        <Modal.Header>
          <Modal.Title>Pick a Color</Modal.Title>
          <button type="button" className="btn-close" onClick={() => setShowColorWheel(false)} aria-label="Close">
            <i className="material-symbols-outlined">close</i>
          </button>
        </Modal.Header>
        <Modal.Body>
          <div className="color-wheel-modal-content">
            <HexColorPicker
              color={syllabusFormData.values.course_color}
              onChange={(color) => syllabusFormData.setFieldValue("course_color", color)}
            />
            <div className="color-wheel-hex-input">
              <label>Hex Color</label>
              <div className="hex-input-row">
                <div 
                  className="color-preview" 
                  style={{ backgroundColor: syllabusFormData.values.course_color }}
                />
                <input
                  type="text"
                  value={syllabusFormData.values.course_color}
                  onChange={(e) => {
                    let value = e.target.value;
                    if (value && !value.startsWith('#')) {
                      value = '#' + value;
                    }
                    syllabusFormData.setFieldValue("course_color", value);
                  }}
                  placeholder="#000000"
                  maxLength={7}
                />
              </div>
            </div>
            <button
              type="button"
              className="color-wheel-done-btn"
              onClick={() => setShowColorWheel(false)}
            >
              Done
            </button>
          </div>
        </Modal.Body>
      </Modal>
      {/***** Color Wheel Modal end *****/}

      {/* Bottom buttons: only show in edit mode */}
      {isEditingDetails ? (
      <div className="bottom-button-group">
        <Button
          type="button"
          className="btn btn-light-white me-auto"
          onClick={() => {
            // Existing syllabus: return to view mode. New syllabus: close panel.
            if (!isNewSyllabus) {
              setIsEditingDetails(false);
              // Reset edits
              try {
                syllabusFormData.resetForm();
              } catch {}
              return;
            }
            props.handleCloseSyllabusDetails();
          }}
        >
          Cancel
        </Button>
        {!isNewSyllabus && (
        <Button
          type="button"
          className="btn btn-light-danger"
          onClick={() => {
            handleDeleteShow();
          }}
        >
          Delete Syllabus
        </Button>
        )}
        <Button
          type="button"
          className="btn btn-primary"
          disabled={freemiumUploadLocked}
          onClick={() => {
            void handleSyllabusSubmit();
          }}
        >
          Save
        </Button>
      </div>
      ) : null}

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
              Cancel
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
          <div className="syllabus-round-spinner" aria-label="Loading" />
        </div>
      )}

      {isGroupsEnabled() && (
      <SyllabusGroupSuggestModal
        open={showSuggestModal}
        loading={loadingSuggestions || resolvingCanonical}
        candidate={hasCandidate ? (suggestion?.candidates?.[0] || null) : null}
        canonicalPreview={canonical}
        onJoin={handleJoinClick}
        onClose={closeSuggest}
      />
      )}

    </>
  );
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(SyllabusDetails);
