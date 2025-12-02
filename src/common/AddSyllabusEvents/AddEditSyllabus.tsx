import React, { useEffect, useRef, useState } from 'react'
import { Button, Col, Form, Offcanvas, Overlay, Popover, Row } from 'react-bootstrap'
import { connect, useDispatch } from 'react-redux'
import * as yup from 'yup';
import { addSyllabusData } from '../../interfaces/interface';
import { CLASS_TIME_IS_REQUIRED, FILE_FORMATE_VALIDATION, PLEASE_ADD_VALID_PROFESSOR_NAME, PLEASE_ADD_VALID_TITLE, PROFESSOR_NAME_IS_REQUIRED, SYLLABUS_COLOR_IS_REQUIRED, SYLLABUS_DOC_IS_REQUIRED, SYLLABUS_TITLE_IS_REQUIRED } from '../../Utility/Validation_Message';
import { customJsonInclude, formatedDate, isEmptyObjectOrNullUndefiend, isNullUndefinedOrBlank, renderError, SUPPORTED_SYLLABUS_UPLOAD_FORMATS } from '../../Utility/Helper';
import { FormikTouched, FormikValues, setNestedObjectValues, useFormik } from 'formik';
import { AppDispatch } from '../../redux/store';
import { addEditSyllabusDataAPI } from '../../redux/Service/User/Courses/courses';
import { MAX_50, ONLY_ALPHABETS_AND_DOT } from '../../Utility/Validation_Helper';
import GetImageIcon from '../GetImageIcon';
import DatePicker from "react-datepicker";
import InputColor from 'react-input-color';
import { isUpdatedSyllabus } from '../../redux/User/Courses/coursesSlice';
import { useNavigate } from 'react-router-dom';
import { ENUMFORROUTES } from '../../interfaces/enum';
import { useSyllabusGroupSuggest } from '../../hooks/useSyllabusGroupSuggest';
import SyllabusGroupSuggestModal from '../../components/SyllabusGroupSuggestModal/SyllabusGroupSuggestModal';
import { useSyllabusUpload } from '../../context/SyllabusUploadContext';
import { startSyllabusUpload } from '../../Utility/syllabusUpload';

export const AddEditSyllabus = (props) => {
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
        setShowAddSyllabusEvents(false);
        props.setShowSyllabus(false)
        setTimeout(() => {

            setSavedSyllabusFormData(initSyllabusData);
            syllabusFormData.resetForm();

        }, 300);

    }
    const handleShowAddSyllabusEvents = () => setShowAddSyllabusEvents(true);
    useEffect(() => {
        if (props?.showSyllabus) {
            handleShowAddSyllabusEvents();
            syllabusFormData.resetForm();
            setSavedSyllabusFormData(initSyllabusData);

        }


        return () => {

        }
    }, [props?.showSyllabus])


    /* ------------------------- Add Syllabus Data Start ------------------------ */

    const syllabusDocRef: any = useRef(null);
    const initSyllabusData: addSyllabusData = {
        class_time: "",
        course_color: "#239BC2",
        title: "",
        professor_name: "",
        syllabus_doc: null,

    }
    const [loading, setloading] = useState(false)
    const [savedSyllabusFormData, setSavedSyllabusFormData] = useState<addSyllabusData>(initSyllabusData);
    const onSubmitForSyllabus = (values) => {
    }
    const hasSubscription = props?.hasSubscription ?? (() => {
        try {
            return localStorage.getItem("has_subscription") === "true";
        } catch {
            return false;
        }
    })();
    const freemiumUploadLocked =
        !hasSubscription &&
        (!!props?.freemiumLimitReached ||
            (typeof props?.existingSyllabusCount === "number" &&
                props.existingSyllabusCount >= 1));

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
            props?.handleGetData();
            dispatch(isUpdatedSyllabus(true));

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
            props?.handleGetData();
            dispatch(isUpdatedSyllabus(true));
            if (sid) {
                setSyllabusId(String(sid));
                await fetchSuggestions(String(sid));
                setShowSuggestModal(true);
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


    const handleClearData = () => {

        syllabusFormData.resetForm();
        setSavedSyllabusFormData(initSyllabusData);
        syllabusDocRef.current.value = null;

    }

    /* ------------------------- Add Syllabus Data End ------------------------ */

    const colorPalette = [
        "#239BC2", "#e91e63", "#9c27b0", "#673ab7", "#3f51b5", "#2196f3",
        "#03a9f4", "#00bcd4", "#009688", "#4caf50", "#8bc34a", "#cddc39",
        "#ffeb3b", "#ffc107", "#ff9800", "#ff5722", "#795548", "#607d8b"
    ];

    // const [showColorPopover, setShowColorPopover] = useState(false);
    // const colorInputRef = useRef(null);
    // useEffect(() => {
    //     function handleClickOutside(event) {
    //         if (
    //             colorInputRef.current &&
    //             !(colorInputRef.current as HTMLElement)?.contains(event.target) &&
    //             !event.target.closest('.color-palette-popover')
    //         ) {
    //             setShowColorPopover(false);
    //         }
    //     }
    //     if (showColorPopover) {
    //         document.addEventListener("mousedown", handleClickOutside);
    //     } else {
    //         document.removeEventListener("mousedown", handleClickOutside);
    //     }
    //     return () => {
    //         document.removeEventListener("mousedown", handleClickOutside);
    //     };
    // }, [showColorPopover]);


    const [showColorPopover, setShowColorPopover] = useState(false);
    const [popoverTarget, setPopoverTarget] = useState<any>(null);
    const colorInputRef = useRef(null);
    const closeSuggest = () => { setShowSuggestModal(false); resetSuggest(); };
    const handleJoinClick = async () => {
        const sid = hookSyllabusId;
        const result = await createAndJoin(sid);
        if (result && result.id) {
            closeSuggest();
            navigate(`/groups/${result.id}`);
        }
    };

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
                            Add New <span>Syllabus</span>
                        </Offcanvas.Title>
                        <button type="button" className="btn-close" onClick={handleCloseAddSyllabusEvents}>
                            <i className="material-symbols-outlined">close</i>
                        </button>
                    </Offcanvas.Header>
                    <Offcanvas.Body>
                        <div className="add-syllabus-container">

                            <div className="main-syllabus-container">
                                <div className="syllabus-details-container">

                                    {

                                        <div className="Add-new-task-container op-offcanvas-body-container">
                                            <div className="syllabus-detail-body">
                                                {/* <div className="title-text">
                                                    <h4>Syllabus Details</h4>
                                                </div> */}
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
                                                                <strong>Free plan limit reached.</strong> Upload one syllabus for free, then upgrade for unlimited uploads.
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
                                                                    onChange={(date) => {
                                                                        const sanitize = (s: string) => typeof s === "string" ? s.replace(/[\r\n\u2028\u2029]+/g, " ") : s;
                                                                        console.log("first", sanitize(String(date)));
                                                                        syllabusFormData.setFieldValue("class_time", date);
                                                                    }}
                                                                    showTimeSelect
                                                                    showTimeSelectOnly
                                                                    timeIntervals={15}
                                                                    timeCaption="Time"
                                                                    dateFormat="hh:mm aa"
                                                                    className="form-control"
                                                                    onBlur={() => {
                                                                        syllabusFormData.setFieldTouched("class_time", true);
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
                                                {/* <Form.Group className='form-group'>
                                                    <Form.Label>Course Color</Form.Label>
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
                                            disabled={freemiumUploadLocked}
                                            onClick={() => { handleSyllabusSubmit() }}
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

            <SyllabusGroupSuggestModal
                open={showSuggestModal}
                loading={loadingSuggestions || resolvingCanonical}
                candidate={hasCandidate ? (suggestion?.candidates?.[0] || null) : null}
                canonicalPreview={canonical}
                onJoin={handleJoinClick}
                onClose={closeSuggest}
            />

        </>
    )
}

const mapStateToProps = (state) => ({})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(AddEditSyllabus)
