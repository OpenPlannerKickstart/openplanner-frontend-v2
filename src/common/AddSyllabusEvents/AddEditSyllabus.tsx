import React, { useEffect, useRef, useState } from 'react'
import { Button, Modal } from 'react-bootstrap'
import { connect, useDispatch } from 'react-redux'
import * as yup from 'yup';
import { addSyllabusData } from '../../interfaces/interface';
import { CLASS_TIME_IS_REQUIRED, FILE_FORMATE_VALIDATION, PLEASE_ADD_VALID_PROFESSOR_NAME, PLEASE_ADD_VALID_TITLE, PROFESSOR_NAME_IS_REQUIRED, SYLLABUS_COLOR_IS_REQUIRED, SYLLABUS_DOC_IS_REQUIRED, SYLLABUS_TITLE_IS_REQUIRED } from '../../Utility/Validation_Message';
import { customJsonInclude, formatedDate, isEmptyObjectOrNullUndefiend, isNullUndefinedOrBlank, renderError, SUPPORTED_SYLLABUS_UPLOAD_FORMATS } from '../../Utility/Helper';
import { FormikTouched, FormikValues, setNestedObjectValues, useFormik } from 'formik';
import { AppDispatch } from '../../redux/store';
import { addEditSyllabusDataAPI, getSyllabusDropDownDataAPI } from '../../redux/Service/User/Courses/courses';
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
    const [existingSyllabusCount, setExistingSyllabusCount] = useState<number | null>(
        typeof props?.existingSyllabusCount === "number" ? props.existingSyllabusCount : null
    );
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
    const FREEMIUM_UPLOAD_LIMIT = 3;
    const effectiveSyllabusCount = typeof props?.existingSyllabusCount === "number"
        ? props.existingSyllabusCount
        : existingSyllabusCount;
    const freemiumUploadLocked =
        isFreemiumPlan &&
        !hasSubscription &&
        (!!props?.freemiumLimitReached ||
            (typeof effectiveSyllabusCount === "number" &&
                effectiveSyllabusCount >= FREEMIUM_UPLOAD_LIMIT));

    const fetchExistingSyllabusCount = async () => {
        try {
            const response: any = await dispatch(getSyllabusDropDownDataAPI({}));
            if (Array.isArray(response?.payload)) {
                setExistingSyllabusCount(response.payload.length);
            } else {
                setExistingSyllabusCount(0);
            }
        } catch (error) {
            setExistingSyllabusCount(0);
        }
    };

    useEffect(() => {
        if (typeof props?.existingSyllabusCount === "number") {
            setExistingSyllabusCount(props.existingSyllabusCount);
        }
    }, [props?.existingSyllabusCount]);

    useEffect(() => {
        if (showAddSyllabusEvents && typeof props?.existingSyllabusCount !== "number") {
            fetchExistingSyllabusCount();
        }
    }, [showAddSyllabusEvents, props?.existingSyllabusCount]);

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
            {/***** Modal start *****/}
            <Modal
                className="add-syllabus-modal"
                    show={showAddSyllabusEvents}
                    onHide={handleCloseAddSyllabusEvents}
                centered
                dialogClassName="syllabus-modal"
            >
                <Modal.Header>
                    <Modal.Title>
                        Add New <span className="title-accent">Syllabus</span>
                    </Modal.Title>
                    <button type="button" className="modal-close-btn" onClick={handleCloseAddSyllabusEvents}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 6L6 18M6 6l12 12"/>
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
                    {/* Upload Syllabus */}
                    <div className="form-group">
                        <label className="form-label">Upload Syllabus Here</label>
                        {freemiumUploadLocked && (
                            <div className="alert alert-warning d-flex align-items-center justify-content-between gap-2 mb-3">
                                <div>
                                    <strong>Free plan limit reached.</strong> Upgrade for unlimited uploads.
                                </div>
                                <Button size="sm" variant="primary" onClick={handleUpgrade}>View plans</Button>
                            </div>
                        )}
                        <div 
                            className="file-upload-area"
                            onClick={() => !freemiumUploadLocked && syllabusDocRef.current?.click()}
                            style={{ cursor: freemiumUploadLocked ? 'not-allowed' : 'pointer', opacity: freemiumUploadLocked ? 0.6 : 1 }}
                        >
                            <div className="upload-icon">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                                    <polyline points="17 8 12 3 7 8"/>
                                    <line x1="12" y1="3" x2="12" y2="15"/>
                                </svg>
                                                        </div>
                            <p className="upload-text">Drag and Drop file here or <span className="upload-link">Choose file</span></p>
                            <input type="file" accept=".pdf,.doc,.docx" disabled={freemiumUploadLocked}
                                                            onChange={(e: any) => {
                                                                if (!isEmptyObjectOrNullUndefiend(e.target?.files)) {
                                                                    syllabusFormData.setFieldValue("syllabus_doc", e.target?.files as any)
                                                                    syllabusFormData.setFieldValue("syllabus_doc_name", e.target?.files[0]?.name as any)
                                                                }
                                                            }}
                                onBlur={() => syllabusFormData.setFieldTouched("syllabus_doc", true)}
                                                            ref={syllabusDocRef}
                                hidden
                            />
                            {!isEmptyObjectOrNullUndefiend(syllabusFormData?.values?.syllabus_doc_name) && (
                                <p className="file-name">{syllabusFormData?.values?.syllabus_doc_name}</p>
                            )}
                        </div>
                        {syllabusFormData.touched.syllabus_doc && syllabusFormData.errors.syllabus_doc
                            ? renderError(syllabusFormData.errors.syllabus_doc as any) : null}
                    </div>
                    {/* Class Time & Professor Name Row */}
                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">Class Time <span className="required">*</span></label>
                                                                <DatePicker
                                                                    placeholderText="Select Class Time"
                                                                    selected={syllabusFormData.values.class_time}
                                onChange={(date) => syllabusFormData.setFieldValue("class_time", date)}
                                                                    showTimeSelect
                                                                    showTimeSelectOnly
                                                                    timeIntervals={15}
                                                                    timeCaption="Time"
                                                                    dateFormat="hh:mm aa"
                                className="form-input"
                                onBlur={() => syllabusFormData.setFieldTouched("class_time", true)}
                            />
                            {syllabusFormData.touched.class_time && syllabusFormData.errors.class_time
                                ? renderError(syllabusFormData.errors.class_time) : null}
                                                            </div>
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
                                ? renderError(syllabusFormData.errors.professor_name) : null}
                        </div>
                                                            </div>
                    {/* Course Color */}
                    <div className="form-group">
                        <label className="form-label">Course Color</label>
                        <div className="color-picker-container">
                                                                        {colorPalette.map((color) => (
                                <div
                                                                                key={color}
                                    className={`color-option${syllabusFormData.values.course_color === color ? " selected" : ""}`}
                                    style={{ backgroundColor: color }}
                                    onClick={() => syllabusFormData.setFieldValue("course_color", color)}
                                />
                                                                        ))}
                                                                    </div>
                                                    </div>
                </Modal.Body>
                <div className="syllabus-footer">
                    <button type="button" className="btn btn-outline" onClick={handleCloseAddSyllabusEvents}>
                                            Cancel
                    </button>
                    <div className="modal-footer-right">
                        <button type="button" className="btn btn-outline" onClick={handleClearData}>
                                            Clear
                        </button>
                        <button type="button" className="btn btn-primary" disabled={freemiumUploadLocked} onClick={handleSyllabusSubmit}>
                                            Save
                        </button>
                                    </div>
                                </div>
            </Modal>
            {/***** Modal end *****/}

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
