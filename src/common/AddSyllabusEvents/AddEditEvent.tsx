import React, { useEffect, useState } from 'react'
import { connect, useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../../redux/store';
import { getSyllabusDropDownDataAPI } from '../../redux/Service/User/Calender/calender';
import { addEvenData } from '../../interfaces/interface';
import { END_DATE_IS_REQUIRED, SELECTION_IS_REQUIRED, START_DATE_IS_REQUIRED, TITLE_IS_REQUIRED } from '../../Utility/Validation_Message';
import * as yup from 'yup';
import { MAX_1000, MAX_3, MAX_300, MAX_50, ONLY_NUMBERS } from '../../Utility/Validation_Helper';
import { FormikTouched, FormikValues, setNestedObjectValues, useFormik } from 'formik';
import { customJsonInclude, formatedDate, getDate, isEmptyObjectOrNullUndefiend, isNullUndefinedOrBlank, renderError } from '../../Utility/Helper';
import { addEditEventDataAPI, deleteEventDataAPI, updateEventStatusDataAPI } from '../../redux/Service/User/Courses/courses';
import { addEditTaskAPI, deleteTaskAPI, upadteTaskStatusAPI } from '../../redux/Service/task';
import { Button, Modal } from 'react-bootstrap';
import DatePicker from "react-datepicker";
import Select, { components, ControlProps } from "react-select";
import { eventPriorityDropDownData, reminderUnitDropDownData } from '../../Utility/staticDropDown';
import moment from 'moment';
import 'add-to-calendar-button';
import appleLogo from '../../assets/images/apple-logo.svg';
import googleCalendarIcon from '../../assets/images/google-calendar-icon.svg';
import outlookLogo from '../../assets/images/outlook-logo.svg';
import { isUpdatedEvent } from '../../redux/User/Courses/coursesSlice';
import { ENUMFORSTATUS, ENUM_FOR_EVENT_PRIORITY } from '../../interfaces/enum';


export const AddEditEvent = (props) => {
    const dispatch: AppDispatch = useDispatch();
    const [showAddSyllabusEvents, setShowAddSyllabusEvents] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const entityType: 'event' | 'task' = props?.entityType === 'task' ? 'task' : 'event';

    /**
     * react-select inside Bootstrap modal:
     * Our modals use a scale transform animation. Any ancestor `transform` breaks `position: fixed`
     * (it becomes relative to the transformed ancestor). We portal menus to `document.body`
     * so the menu positions correctly under the control.
     */
    const selectMenuPortalTarget = typeof document !== 'undefined' ? document.body : null;
    const selectStyles: any = {
        menuPortal: (base: any) => ({ ...base, zIndex: 2000 }),
        control: (base: any, state: any) => ({
            ...base,
            borderRadius: 16,
            overflow: 'hidden',
            boxShadow: state.isFocused ? '0 0 0 4px rgba(35, 155, 194, 0.18)' : base.boxShadow,
        }),
        menu: (base: any) => ({
            ...base,
            borderRadius: 16,
            overflow: 'hidden',
        }),
        menuList: (base: any) => ({
            ...base,
            paddingTop: 0,
            paddingBottom: 0,
        }),
        option: (base: any, state: any) => {
            const brand = '#239BC2'; // match Save button / new frontend primary
            const brandSoft = 'rgba(35, 155, 194, 0.12)';
            return {
                ...base,
                backgroundColor: state.isSelected ? brand : state.isFocused ? brandSoft : base.backgroundColor,
                color: state.isSelected ? '#ffffff' : base.color,
                cursor: 'pointer',
                ':active': {
                    ...base[':active'],
                    backgroundColor: state.isSelected ? brand : brandSoft,
                },
            };
        },
    };
    
    // Get courses list from Redux for color lookup
    const coursesListData = useSelector((state: RootState) => (state.CoursesReducer as any)?.getCoursesListData);

    const safeToDate = (value: any): Date => {
        if (!value) return new Date();
        const d = value instanceof Date ? value : new Date(value);
        return Number.isFinite(d.getTime()) ? d : new Date();
    };

    const formatUtcForGoogle = (d: Date) => moment(d).utc().format('YYYYMMDDTHHmmss[Z]');

    const buildGoogleCalendarUrl = (args: {
        title: string;
        start: Date;
        end: Date;
        description?: string;
    }) => {
        const text = encodeURIComponent(args.title || 'Event');
        const dates = `${formatUtcForGoogle(args.start)}/${formatUtcForGoogle(args.end)}`;
        const details = encodeURIComponent(args.description || '');
        return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${dates}&details=${details}`;
    };

    const buildOutlookCalendarUrl = (args: {
        title: string;
        start: Date;
        end: Date;
        description?: string;
    }) => {
        const subject = encodeURIComponent(args.title || 'Event');
        const startdt = encodeURIComponent(args.start.toISOString());
        const enddt = encodeURIComponent(args.end.toISOString());
        const body = encodeURIComponent(args.description || '');
        return `https://outlook.live.com/calendar/0/deeplink/compose?subject=${subject}&startdt=${startdt}&enddt=${enddt}&body=${body}`;
    };

    const sanitizeFilename = (name: string) =>
        (name || 'event')
            .replace(/[\/\\?%*:|"<>]/g, '-')
            .replace(/\s+/g, ' ')
            .trim()
            .slice(0, 80);

    const buildIcsContent = (args: {
        uid: string;
        title: string;
        start: Date;
        end: Date;
        description?: string;
    }) => {
        const dtstamp = moment().utc().format('YYYYMMDDTHHmmss[Z]');
        const dtstart = formatUtcForGoogle(args.start);
        const dtend = formatUtcForGoogle(args.end);
        const escapeIcs = (s: string) =>
            (s || '')
                .replace(/\\/g, '\\\\')
                .replace(/\n/g, '\\n')
                .replace(/,/g, '\\,')
                .replace(/;/g, '\\;');

        return [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'PRODID:-//OpenPlanner//EN',
            'CALSCALE:GREGORIAN',
            'METHOD:PUBLISH',
            'BEGIN:VEVENT',
            `UID:${escapeIcs(args.uid)}`,
            `DTSTAMP:${dtstamp}`,
            `DTSTART:${dtstart}`,
            `DTEND:${dtend}`,
            `SUMMARY:${escapeIcs(args.title || 'Event')}`,
            args.description ? `DESCRIPTION:${escapeIcs(args.description)}` : '',
            'END:VEVENT',
            'END:VCALENDAR',
        ]
            .filter(Boolean)
            .join('\r\n');
    };

    const downloadIcs = (args: { title: string; uid: string; start: Date; end: Date; description?: string }) => {
        if (typeof window === 'undefined') return;
        const ics = buildIcsContent(args);
        const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${sanitizeFilename(args.title)}.ics`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 0);
    };

    const handleCloseAddSyllabusEvents = () => {
        setShowAddSyllabusEvents(false);
        setIsEditMode(false);
        props?.setShow(false)
        setTimeout(() => {
            eventFormData.resetForm();
            setSavedEventFormData(initEventData);
            props?.setEditEventFormData(null)
        }, 300);

    }
    const handleShowAddSyllabusEvents = () => setShowAddSyllabusEvents(true);

    useEffect(() => {
        if (props?.show) {
            handleShowAddSyllabusEvents();
            eventFormData.resetForm();
            // If editing an existing event, start in view mode
            // If adding new event, start in edit mode
            if (!isNullUndefinedOrBlank(props?.editEventFormData?.id)) {
                setIsEditMode(false);
            } else {
                setIsEditMode(true);
            }
            if (!isNullUndefinedOrBlank(props?.selectedCourse)) {
                setSavedEventFormData({ ...initEventData, syllabus_id: props?.selectedCourse?.id });
            } else {
                setSavedEventFormData(initEventData)
            }
            handleGetSyllabusDropDownData();
        }
        return () => {

        }
    }, [props?.show, props?.selectedCourse])


    useEffect(() => {
        if (!isNullUndefinedOrBlank(props?.editEventFormData)) {
            setSavedEventFormData(props?.editEventFormData)
        } else {
            setSavedEventFormData(initEventData)
        }
    }, [props.editEventFormData])

    /* -------------------------- Add Event Data Start -------------------------- */
    const [syllabusDropDownData, setSyllabusDropDownData] = useState<any>([]);
    const handleGetSyllabusDropDownData = async (retries = 6) => {
        for (let i = 0; i < retries; i++) {
            const response = await dispatch(getSyllabusDropDownDataAPI({}));
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
        is_reminder: yup.boolean(),
        syllabus_id:
            entityType === 'task'
                ? yup.mixed().notRequired()
                : yup.string().required(SELECTION_IS_REQUIRED),
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
        if (entityType === 'task') {
            const reqBody: any = {
                task_name: eventFormData.values.title,
                // Tasks only have due_date; map from the modal's End Date
                due_date: eventFormData.values.end_date ? getDate(eventFormData.values.end_date) : null,
                note: eventFormData.values.note,
                is_reminder: eventFormData.values.is_reminder,
                reminder: eventFormData.values.reminder,
                ...(eventFormData.values.id ? { task_id: eventFormData.values.id } : {}),
            };
            customJsonInclude(reqBody);
            const response = await dispatch(addEditTaskAPI(reqBody));
            if (response) {
                handleCloseAddSyllabusEvents();
                props?.handleGetData?.();
            }
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
            event_id: eventFormData.values.id,
            is_all_day_event: eventFormData?.values?.is_all_day_event,
            priority: eventFormData?.values?.priority

        }
        customJsonInclude(reqBody);

        const response = await dispatch(addEditEventDataAPI(reqBody));
        if (response) {
            handleCloseAddSyllabusEvents();
            dispatch(isUpdatedEvent(true));
            props?.handleGetData();
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

    const handleClearData = () => {

        eventFormData.resetForm();
        setSavedEventFormData(initEventData);

    }

    const handleMarkAllDayEvent = (value) => {
        eventFormData.setFieldValue('is_all_day_event', value);
        if (value) {
            const startDate = moment(eventFormData?.values?.start_date);
            const startOfDay = startDate.clone().startOf('day');
            const endOfDay = startDate.clone().endOf('day');
            eventFormData.setFieldValue('start_date', new Date(startOfDay.toISOString()));
            eventFormData.setFieldValue('end_date', new Date(endOfDay.toISOString()));
        }
    }

    const handleCancelEdit = () => {
        // Reset form to saved data and exit edit mode
        eventFormData.setValues(savedEventFormData);
        setIsEditMode(false);
    }

    const isExistingEvent = !isNullUndefinedOrBlank(eventFormData?.values?.id);

    // Get course color for Event Details modal border and header gradient
    const getCourseColor = () => {
        // 1. Try to get from editEventFormData (event object now has course_color directly)
        if (props?.editEventFormData?.course_color) {
            return props.editEventFormData.course_color;
        }
        // 2. Try nested syllabus object on event (backward compatibility)
        if (props?.editEventFormData?.syllabus?.course_color) {
            return props.editEventFormData.syllabus.course_color;
        }
        // 3. Try to get from selectedCourse
        if (props?.selectedCourse?.course_color) {
            return props.selectedCourse.course_color;
        }
        // 4. Look up from syllabusDropDownData based on syllabus_id (now has top-level course_color)
        const syllabusId = eventFormData?.values?.syllabus_id;
        if (syllabusId && syllabusDropDownData?.length) {
            const syllabus = syllabusDropDownData.find((s: any) => s.value === syllabusId);
            // Try top-level first, then nested other.course_color
            if (syllabus?.course_color) {
                return syllabus.course_color;
            }
            if (syllabus?.other?.course_color) {
                return syllabus.other.course_color;
            }
        }
        // 5. Look up from courses list in Redux based on syllabus_id
        if (syllabusId && coursesListData?.length) {
            const course = coursesListData.find((c: any) => c.id === syllabusId);
            if (course?.course_color) {
                return course.course_color;
            }
        }
        // Default to yellow for existing events without a color
        return isExistingEvent ? '#EAB308' : null;
    };

    const courseColor = getCourseColor();
    const themedCourseColor = entityType === 'task' ? null : courseColor;

    // Helper to lighten a hex color for the gradient
    const getLightColor = (hex: string) => {
        // Convert hex to RGB, make it lighter, return as rgba
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, 0.15)`;
    };

    /* -------------------------- Add Event Data End -------------------------- */
    /** -------------------Delete event start-------------------------*/
    const [deleteShow, setDeleteShow] = useState(false);
    const [selectedEventObj, setSelectedEventObj] = useState<any>(null);

    const handleDeleteClose = () => {
        setDeleteShow(false);
        setTimeout(() => {
            setSelectedEventObj(null);
            setDeleteSuccess(false);
        }, 300);
    }
    const handleDeleteShow = (data) => {
        setDeleteShow(true)
        setSelectedEventObj(data);
    }

    const [deleteSuccess, setDeleteSuccess] = useState<boolean>(false);

    const handleDeleteData = async (eventId) => {
        if (entityType === 'task') {
            const task_id = eventId instanceof Array ? eventId : [eventId];
            const response = await dispatch(deleteTaskAPI({ task_id }));
            if (!isNullUndefinedOrBlank(response?.payload)) {
                handleCloseAddSyllabusEvents();
                props?.handleGetData?.();
                handleDeleteClose();
            }
            return;
        }

        let event_id: any = [];
        if (eventId instanceof Array) {
            event_id = eventId;
        }
        else {
            event_id = [eventId];
        }
        const reqBody = {
            event_id: event_id,
        }

        const response = await dispatch(deleteEventDataAPI(reqBody));
        if (!isNullUndefinedOrBlank(response?.payload)) {
            handleCloseAddSyllabusEvents();
            dispatch(isUpdatedEvent(true));
            props?.handleGetData();
            handleDeleteClose();
        }
    }

    /** -------------------Delete Event end-------------------------*/

    const handleMarkComplete = async () => {
        if (!isExistingEvent) return;
        const rawId =
            (eventFormData?.values as any)?.id ??
            (eventFormData?.values as any)?.event_id ??
            (eventFormData?.values as any)?.eventData?.id ??
            (eventFormData?.values as any)?.event_data?.id ??
            (eventFormData?.values as any)?.event?.id;
        const idNum =
            typeof rawId === 'string' ? parseInt(rawId, 10) : rawId;
        if (!idNum || Number.isNaN(idNum)) return;

        const currentStatus = String((eventFormData?.values as any)?.status || '');
        const isCompleted =
            currentStatus.toLowerCase() === String(ENUMFORSTATUS.COMPLETED).toLowerCase();
        const nextStatus = isCompleted ? ENUMFORSTATUS.PENDING : ENUMFORSTATUS.COMPLETED;

        if (entityType === 'task') {
            const response = await dispatch(upadteTaskStatusAPI({ id: [idNum], status: nextStatus }));
            if (!isNullUndefinedOrBlank(response?.payload)) {
                eventFormData.setFieldValue('status', nextStatus);
                props?.handleGetData?.();
                handleCloseAddSyllabusEvents();
            }
            return;
        }

        // Event: toggle status via event status endpoint (silent; we don't want the success toast)
        const response = await dispatch(updateEventStatusDataAPI({ event_id: [idNum], status: nextStatus }, { silent: true }));
        if (!isNullUndefinedOrBlank(response?.payload)) {
            eventFormData.setFieldValue('status', nextStatus);
            dispatch(isUpdatedEvent(true));
            props?.handleGetData?.();
            handleCloseAddSyllabusEvents();
        }
    };

    const isCompletedNow =
        String((eventFormData?.values as any)?.status || '').toLowerCase() ===
        String(ENUMFORSTATUS.COMPLETED).toLowerCase();

    return (
        <>
            {/***** Modal start *****/}
            <Modal
                className={`add-event-modal-wrapper ${isExistingEvent && entityType !== 'task' ? 'event-details-wrapper' : ''} ${!isExistingEvent ? 'add-new-event-wrapper' : ''} ${themedCourseColor ? 'themed' : ''} ${isExistingEvent && isCompletedNow ? 'completed' : ''}`}
                show={showAddSyllabusEvents}
                onHide={handleCloseAddSyllabusEvents}
                centered
                dialogClassName={`add-event-modal ${isExistingEvent ? 'event-details-modal' : ''} ${isEditMode ? 'edit-mode' : ''}`}
                style={themedCourseColor ? { '--event-color': themedCourseColor, '--event-color-light': getLightColor(themedCourseColor) } as React.CSSProperties : undefined}
            >
                <Modal.Header style={themedCourseColor ? { background: `linear-gradient(to right, ${getLightColor(themedCourseColor)}, #fff)` } : undefined}>
                    <Modal.Title>
                        {isExistingEvent ? (
                            <>
                                Event Details
                                {isCompletedNow ? <span className="completed-tag">(Completed)</span> : null}
                            </>
                        ) : (
                            "Add New Event"
                        )}
                    </Modal.Title>
                    <div className="modal-actions">
                        {isExistingEvent && (
                            <button 
                                type="button" 
                                className={`edit-toggle-btn ${isEditMode ? 'active' : ''}`}
                                onClick={() => setIsEditMode(!isEditMode)}
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                                </svg>
                                <span>{isEditMode ? 'Editing' : 'Edit'}</span>
                            </button>
                        )}
                        <button type="button" className="modal-close-btn" onClick={handleCloseAddSyllabusEvents}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="18" y1="6" x2="6" y2="18"/>
                                <line x1="6" y1="6" x2="18" y2="18"/>
                            </svg>
                        </button>
                    </div>
                </Modal.Header>
                <Modal.Body>
                    {/* Start Date */}
                    <div className="form-group">
                        <label className="form-label">Start Date{(isEditMode || !isExistingEvent) && <span className="required-asterisk">*</span>}</label>
                        {isEditMode || !isExistingEvent ? (
                            <div className="date-input-wrapper">
                                <DatePicker
                                    dropdownMode="select"
                                    selected={eventFormData.values.start_date}
                                    onChange={(date) => {
                                        if (date === null) {
                                            eventFormData.setFieldValue("start_date", null);
                                            eventFormData.setFieldValue("end_date", null);
                                            return;
                                        }
                                        const now = new Date();
                                        const selectedDate = new Date(date);
                                        const isSameDate = now.getFullYear() === selectedDate.getFullYear() &&
                                            now.getMonth() === selectedDate.getMonth() &&
                                            now.getDate() === selectedDate.getDate();
                                        if (isSameDate && !date?.getHours() && !date?.getMinutes()) {
                                            selectedDate.setHours(now.getHours());
                                            selectedDate.setMinutes(now.getMinutes());
                                        }
                                        eventFormData.setFieldValue("start_date", selectedDate);
                                        const endDate = new Date(selectedDate.getTime() + 30 * 60 * 1000);
                                        eventFormData.setFieldValue("end_date", endDate);
                                    }}
                                    showTimeSelect
                                    dateFormat="MM/dd/yyyy h:mm aa"
                                    timeIntervals={30}
                                    className="form-input"
                                    popperProps={{ strategy: "fixed" }}
                                    popperPlacement="bottom-start"
                                    popperClassName="task-date-popper"
                                    calendarClassName="task-date-calendar"
                                    wrapperClassName="task-date-wrapper"
                                    showPopperArrow={false}
                                    placeholderText="Select Date"
                                    onBlur={() => eventFormData.setFieldTouched("start_date", true)}
                                    minDate={entityType === 'task' ? undefined : new Date()}
                                    disabled={eventFormData?.values?.is_all_day_event}
                                    filterTime={(time) => {
                                        if (entityType === 'task') return true;
                                        const now = new Date();
                                        const selectedDate = eventFormData.values.start_date || new Date();
                                        if (selectedDate.toDateString() === now.toDateString()) {
                                            return time.getTime() >= now.getTime();
                                        }
                                        return true;
                                    }}
                                />
                                <svg className="date-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                                    <line x1="16" y1="2" x2="16" y2="6"/>
                                    <line x1="8" y1="2" x2="8" y2="6"/>
                                    <line x1="3" y1="10" x2="21" y2="10"/>
                                </svg>
                            </div>
                        ) : (
                            <input 
                                type="text" 
                                className="form-input" 
                                value={eventFormData.values.start_date ? formatedDate(eventFormData.values.start_date, 'MM/DD/yyyy hh:mm A') : ''} 
                                readOnly 
                            />
                        )}
                        {eventFormData.touched.start_date && eventFormData.errors.start_date && renderError(eventFormData.errors.start_date as any)}
                    </div>

                    {/* End Date */}
                    <div className="form-group">
                        <label className="form-label">End Date{(isEditMode || !isExistingEvent) && <span className="required-asterisk">*</span>}</label>
                        {isEditMode || !isExistingEvent ? (
                            <div className="date-input-wrapper">
                                <DatePicker
                                    selected={eventFormData.values.end_date}
                                    onChange={(date) => eventFormData.setFieldValue("end_date", date)}
                                    showTimeSelect
                                    dateFormat="MM/dd/yyyy h:mm aa"
                                    timeIntervals={30}
                                    className="form-input"
                                    popperProps={{ strategy: "fixed" }}
                                    popperPlacement="bottom-start"
                                    popperClassName="task-date-popper"
                                    calendarClassName="task-date-calendar"
                                    wrapperClassName="task-date-wrapper"
                                    showPopperArrow={false}
                                    placeholderText="Select Date"
                                    onBlur={() => eventFormData.setFieldTouched("end_date", true)}
                                    disabled={eventFormData?.values?.is_all_day_event}
                                    minDate={entityType === 'task' ? undefined : eventFormData?.values?.start_date}
                                    filterTime={(time) => {
                                        if (entityType === 'task') return true;
                                        const now = new Date();
                                        const selectedDate = eventFormData.values.start_date || new Date();
                                        if (selectedDate.toDateString() === now.toDateString()) {
                                            return time.getTime() >= now.getTime();
                                        }
                                        return true;
                                    }}
                                />
                                <svg className="date-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                                    <line x1="16" y1="2" x2="16" y2="6"/>
                                    <line x1="8" y1="2" x2="8" y2="6"/>
                                    <line x1="3" y1="10" x2="21" y2="10"/>
                                </svg>
                            </div>
                        ) : (
                            <input 
                                type="text" 
                                className="form-input" 
                                value={eventFormData.values.end_date ? formatedDate(eventFormData.values.end_date, 'MM/DD/yyyy hh:mm A') : ''} 
                                readOnly 
                            />
                        )}
                        {eventFormData.touched.end_date && eventFormData.errors.end_date && renderError(eventFormData.errors.end_date as any)}
                    </div>

                    {/* Title */}
                    <div className="form-group">
                        <label className="form-label">Title{(isEditMode || !isExistingEvent) && <span className="required-asterisk">*</span>}</label>
                        {isEditMode || !isExistingEvent ? (
                            <textarea
                                className="form-input form-textarea"
                                placeholder="Enter Title"
                                {...eventFormData.getFieldProps("title")}
                                maxLength={MAX_1000}
                            />
                        ) : (
                            <textarea
                                className="form-input form-textarea"
                                value={eventFormData.values.title || ''}
                                readOnly
                            />
                        )}
                        {eventFormData.touched.title && eventFormData.errors.title && renderError(eventFormData.errors.title as any)}
                    </div>

                    {/* Note */}
                    <div className="form-group">
                        <label className="form-label">Note</label>
                        {isEditMode || !isExistingEvent ? (
                            <textarea
                                className="form-input form-textarea"
                                placeholder="Enter Note"
                                rows={4}
                                {...eventFormData.getFieldProps("note")}
                                maxLength={MAX_300}
                            />
                        ) : (
                            <textarea
                                className="form-input form-textarea"
                                value={eventFormData.values.note || ''}
                                rows={4}
                                readOnly
                            />
                        )}
                    </div>

                    {/* Calendar & Priority Row */}
                    {entityType === 'task' ? (
                        <div className="form-group">
                            <label className="form-label">Priority</label>
                            {isEditMode || !isExistingEvent ? (
                                <Select
                                    options={eventPriorityDropDownData}
                                    placeholder="Select Priority"
                                    onChange={(selectedOption) => eventFormData.setFieldValue("priority", selectedOption?.value || null)}
                                    value={eventPriorityDropDownData?.filter(({ value }) => value === eventFormData.values.priority)}
                                    menuPosition="fixed"
                                    menuPortalTarget={selectMenuPortalTarget}
                                    styles={selectStyles}
                                    className="react-select-container"
                                    classNamePrefix="react-select"
                                />
                            ) : (
                                <div className="form-select-wrapper">
                                    <select className="form-input form-select" disabled>
                                        <option>{eventPriorityDropDownData?.find(({ value }) => value === eventFormData.values.priority)?.label || 'Low'}</option>
                                    </select>
                                    <svg className="select-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <polyline points="6 9 12 15 18 9"/>
                                    </svg>
                                </div>
                            )}
                        </div>
                    ) : (
                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">Calendar{(isEditMode || !isExistingEvent) && <span className="required-asterisk">*</span>}</label>
                            {isEditMode || !isExistingEvent ? (
                                <Select
                                    options={syllabusDropDownData}
                                    placeholder="Select"
                                    onChange={(selectedOption) => eventFormData.setFieldValue("syllabus_id", selectedOption?.value || null)}
                                    value={syllabusDropDownData?.filter(({ value }) => value === eventFormData.values.syllabus_id)}
                                    isDisabled={!isNullUndefinedOrBlank(props?.selectedCourse)}
                                    isClearable
                                    menuPosition="fixed"
                                    menuPortalTarget={selectMenuPortalTarget}
                                    styles={selectStyles}
                                    className="react-select-container"
                                    classNamePrefix="react-select"
                                />
                            ) : (
                                <div className="form-select-wrapper">
                                    <select className="form-input form-select" disabled>
                                        <option>{syllabusDropDownData?.find(({ value }) => value === eventFormData.values.syllabus_id)?.label || 'N/A'}</option>
                                    </select>
                                    <svg className="select-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <polyline points="6 9 12 15 18 9"/>
                                    </svg>
                                </div>
                            )}
                            {eventFormData.touched.syllabus_id && eventFormData.errors.syllabus_id && renderError(eventFormData.errors.syllabus_id as any)}
                        </div>

                        <div className="form-group">
                            <label className="form-label">Priority</label>
                            {isEditMode || !isExistingEvent ? (
                                <Select
                                    options={eventPriorityDropDownData}
                                    placeholder="Select Priority"
                                    onChange={(selectedOption) => eventFormData.setFieldValue("priority", selectedOption?.value || null)}
                                    value={eventPriorityDropDownData?.filter(({ value }) => value === eventFormData.values.priority)}
                                    menuPosition="fixed"
                                    menuPortalTarget={selectMenuPortalTarget}
                                    styles={selectStyles}
                                    className="react-select-container"
                                    classNamePrefix="react-select"
                                />
                            ) : (
                                <div className="form-select-wrapper">
                                    <select className="form-input form-select" disabled>
                                        <option>{eventPriorityDropDownData?.find(({ value }) => value === eventFormData.values.priority)?.label || 'Low'}</option>
                                    </select>
                                    <svg className="select-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <polyline points="6 9 12 15 18 9"/>
                                    </svg>
                                </div>
                            )}
                        </div>
                    </div>
                    )}

                    {/* Reminders Section */}
                    {isExistingEvent && !isEditMode ? (
                        /* View mode: show reminders in read-only format */
                        eventFormData?.values?.reminder?.length > 0 && (
                            <div className="form-group">
                                <label className="form-label">
                                    Reminders (Notify me before start date) 
                                    <span className="notification-count">{eventFormData?.values?.reminder?.length || 0}/3</span>
                                </label>
                                <div className="notifications-container">
                                    {eventFormData?.values?.reminder?.map((item: any, index: number) => (
                                        <div className="notification-row" key={index}>
                                            <div className="reminder-fields-row">
                                                <div className="reminder-field">
                                                    <span className="reminder-field-label">Unit</span>
                                                    <div className="form-select-wrapper">
                                                        <select className="form-input form-select" disabled>
                                                            <option>{reminderUnitDropDownData?.find(({ value }) => value === item.unit)?.label || item.unit}</option>
                                                        </select>
                                                        <svg className="select-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                            <polyline points="6 9 12 15 18 9"/>
                                                        </svg>
                                                    </div>
                                                </div>
                                                <div className="reminder-field">
                                                    <span className="reminder-field-label">Value</span>
                                                    <input type="number" className="form-input" value={item.value} readOnly />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )
                    ) : (
                        /* Edit mode: show toggle and editable reminders */
                        <>
                            <div className="form-group reminder-toggle-group">
                                <span className="reminder-label">Reminder (Notify me before start date)</span>
                                <label className="toggle-switch">
                                    <input
                                        type="checkbox"
                                        checked={eventFormData?.values?.is_reminder}
                                        onChange={() => handleChangeReminder(!eventFormData.values.is_reminder)}
                                    />
                                    <span className="toggle-slider"></span>
                                </label>
                            </div>
                            {eventFormData?.values.is_reminder && !isEmptyObjectOrNullUndefiend(eventFormData?.values.reminder) && (
                                <div className="form-group">
                                    <div className="notifications-container">
                                        {eventFormData?.values?.reminder?.map((item: any, index: number) => (
                                            <div className="notification-row" key={index}>
                                                <div className="reminder-fields-row">
                                                    <div className="reminder-field">
                                                        <span className="reminder-field-label">Unit</span>
                                                        <Select
                                                            options={reminderUnitDropDownData}
                                                            placeholder="Select Unit"
                                                            menuPosition="fixed"
                                                            menuPortalTarget={selectMenuPortalTarget}
                                                            styles={selectStyles}
                                                            className="react-select-container"
                                                            classNamePrefix="react-select"
                                                            onChange={(selectedOption: any) => eventFormData.setFieldValue(`reminder.${index}.unit`, selectedOption.value)}
                                                            value={reminderUnitDropDownData?.filter(({ value }) => value === eventFormData?.values?.reminder?.[index]?.unit)}
                                                            onBlur={() => eventFormData.setFieldTouched(`reminder.${index}.unit`, true)}
                                                        />
                                                        {(eventFormData?.touched?.reminder?.[index]?.unit as any) && (eventFormData?.errors?.reminder?.[index]?.unit as any) && renderError(eventFormData?.errors?.reminder?.[index]?.unit as any)}
                                                    </div>
                                                    <div className="reminder-field">
                                                        <span className="reminder-field-label">Value</span>
                                                        <input
                                                            type="number"
                                                            className="form-input"
                                                            placeholder="Enter Value"
                                                            {...eventFormData.getFieldProps(`reminder.${index}.value`)}
                                                            maxLength={MAX_3}
                                                            onBlur={() => eventFormData.setFieldTouched(`reminder.${index}.value`, true)}
                                                        />
                                                        {(eventFormData?.touched?.reminder?.[index]?.value as any) && (eventFormData?.errors?.reminder?.[index]?.value as any) && renderError(eventFormData?.errors?.reminder?.[index]?.value as any)}
                                                    </div>
                                                </div>
                                                {eventFormData?.values?.reminder?.length > 1 && (
                                                    <button type="button" className="remove-notification-btn" onClick={() => removeReminderList(index)}>
                                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                            <line x1="18" y1="6" x2="6" y2="18"/>
                                                            <line x1="6" y1="6" x2="18" y2="18"/>
                                                        </svg>
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    {(eventFormData?.touched?.reminder as any) && (eventFormData?.errors?.reminder as any) && typeof eventFormData?.errors?.reminder === "string" && renderError((eventFormData?.errors?.reminder as any))}
                                    <button
                                        type="button"
                                        className="add-notification-btn"
                                        disabled={!isNullUndefinedOrBlank(eventFormData?.errors?.reminder) && typeof eventFormData?.errors?.reminder === "string"}
                                        onClick={() => addReminderList()}
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <line x1="12" y1="5" x2="12" y2="19"/>
                                            <line x1="5" y1="12" x2="19" y2="12"/>
                                        </svg>
                                        Add Another Notification <span className="notification-count">({eventFormData?.values?.reminder?.length || 0}/3)</span>
                                    </button>
                                </div>
                            )}
                        </>
                    )}

                    {/* Add to Calendar - show for existing events */}
                    {isExistingEvent && (
                        <div className="form-group">
                            <label className="form-label">Add to Calendar</label>
                            <div className="calendar-buttons calendar-options">
                                {(() => {
                                    const title = String(eventFormData?.values?.title || 'Event');
                                    const description = String(eventFormData?.values?.note || '');
                                    const start = safeToDate(eventFormData?.values?.start_date);
                                    const end = safeToDate(eventFormData?.values?.end_date);
                                    const uid = `op-${String(eventFormData?.values?.id || '') || 'event'}@openplanner`;
                                    const googleHref = buildGoogleCalendarUrl({ title, start, end, description });
                                    const outlookHref = buildOutlookCalendarUrl({ title, start, end, description });

                                    return (
                                        <>
                                            <button
                                                type="button"
                                                className="calendar-option-btn"
                                                onClick={() => downloadIcs({ title, uid, start, end, description })}
                                                aria-label="Download .ics for Apple Calendar"
                                                title="Apple Calendar"
                                            >
                                                <img src={appleLogo} alt="" className="calendar-icon calendar-icon--apple" />
                                            </button>

                                            <a
                                                className="calendar-option-btn"
                                                href={googleHref}
                                                target="_blank"
                                                rel="noreferrer"
                                                aria-label="Add to Google Calendar"
                                                title="Google Calendar"
                                            >
                                                <img src={googleCalendarIcon} alt="" />
                                            </a>

                                            <a
                                                className="calendar-option-btn"
                                                href={outlookHref}
                                                target="_blank"
                                                rel="noreferrer"
                                                aria-label="Add to Outlook Calendar"
                                                title="Outlook"
                                            >
                                                <img src={outlookLogo} alt="" className="calendar-icon calendar-icon--outlook" />
                                            </a>
                                        </>
                                    );
                                })()}
                            </div>
                        </div>
                    )}
                </Modal.Body>
                <div className="modal-footer event-details-footer">
                    <div className="modal-footer-left">
                        {isExistingEvent && (
                            <>
                                <button
                                    type="button"
                                    className="btn btn-success"
                                    onClick={handleMarkComplete}
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        {isCompletedNow ? (
                                            <>
                                                {/* Use slightly inset refresh icon so strokes don't clip */}
                                                <polyline points="21 3 21 9 15 9" />
                                                <path d="M21 12a9 9 0 1 1-2.64-6.36" />
                                            </>
                                        ) : (
                                            <polyline points="20 6 9 17 4 12" />
                                        )}
                                    </svg>
                                    {isCompletedNow ? 'Mark Incomplete' : 'Mark Complete'}
                                </button>
                                <button type="button" className="btn btn-danger" onClick={() => handleDeleteShow(eventFormData.values)}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <polyline points="3 6 5 6 21 6"/>
                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                                        <line x1="10" y1="11" x2="10" y2="17" />
                                        <line x1="14" y1="11" x2="14" y2="17" />
                                    </svg>
                                    Delete
                                </button>
                            </>
                        )}
                        {!isExistingEvent && (
                            <button type="button" className="btn btn-outline" onClick={handleCloseAddSyllabusEvents}>
                                Cancel
                            </button>
                        )}
                    </div>
                    <div className="modal-footer-right">
                        {isEditMode && isExistingEvent && (
                            <button type="button" className="btn btn-outline" onClick={handleCancelEdit}>
                                Cancel
                            </button>
                        )}
                        {!isExistingEvent && (
                            <button type="button" className="btn btn-outline" onClick={handleClearData}>
                                Clear
                            </button>
                        )}
                        {(isEditMode || !isExistingEvent) && (
                            <button type="button" className="btn btn-primary" onClick={handleEventSubmit}>
                                {isExistingEvent ? 'Save Changes' : 'Save'}
                            </button>
                        )}
                    </div>
                </div>
            </Modal>
            {/***** Modal end *****/}
            {/* Delete Modal */}
            <Modal
                className="modal-theme modal-confirmation modal-reject"
                show={deleteShow}
                onHide={handleDeleteClose}
                centered
                backdropClassName="modal-confirmation-backdrop"
            >
                <Modal.Header>
                    <h4 className="modal-title">{entityType === 'task' ? 'Delete Task' : 'Delete Event'}</h4>
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
                            <h5> Are You Sure?</h5>
                            <p>  You want to delete this {entityType === 'task' ? 'task' : 'event'} ?

                            </p>
                        </div>
                    </div>
                    <div className="modal-button-group modal-full-width-btn modal-footer-button">
                        {
                            // !deleteSuccess &&
                            <Button
                                variant="light-white"
                                className="btn-md"
                                onClick={handleDeleteClose}
                            >
                                Cancel
                            </Button>
                        }
                        <Button
                            variant={"danger"}
                            className="btn-icon-text btn-md"
                            onClick={() => {
                                handleDeleteData(selectedEventObj?.id)
                            }}
                        >
                            Delete
                        </Button>
                    </div>
                </Modal.Body>
            </Modal>
            {/* Delete Modal */}
        </>
    )
}

const mapStateToProps = (state) => ({})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(AddEditEvent)
