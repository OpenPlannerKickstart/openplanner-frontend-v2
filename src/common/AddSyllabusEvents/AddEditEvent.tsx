import React, { useEffect, useState } from 'react'
import { connect, useDispatch } from 'react-redux'
import { AppDispatch } from '../../redux/store';
import { getSyllabusDropDownDataAPI } from '../../redux/Service/User/Calender/calender';
import { addEvenData } from '../../interfaces/interface';
import { END_DATE_IS_REQUIRED, SELECTION_IS_REQUIRED, START_DATE_IS_REQUIRED, TITLE_IS_REQUIRED } from '../../Utility/Validation_Message';
import * as yup from 'yup';
import { MAX_1000, MAX_3, MAX_300, MAX_50, ONLY_NUMBERS } from '../../Utility/Validation_Helper';
import { FormikTouched, FormikValues, setNestedObjectValues, useFormik } from 'formik';
import { customJsonInclude, formatedDate, getDate, isEmptyObjectOrNullUndefiend, isNullUndefinedOrBlank, renderError } from '../../Utility/Helper';
import { addEditEventDataAPI, deleteEventDataAPI } from '../../redux/Service/User/Courses/courses';
import { Button, Modal } from 'react-bootstrap';
import DatePicker from "react-datepicker";
import Select, { components, ControlProps } from "react-select";
import { eventPriorityDropDownData, reminderUnitDropDownData } from '../../Utility/staticDropDown';
import appleLogo from "/assets/images/apple-logo.svg";
import calendarLogo from "/assets/images/calendar-logo.svg";
import outlookLogo from "/assets/images/outlook-logo.svg";
import moment from 'moment';
import { AddToCalendarButton } from 'add-to-calendar-button-react';
import 'add-to-calendar-button';
import { isUpdatedEvent } from '../../redux/User/Courses/coursesSlice';
import { ENUM_FOR_EVENT_PRIORITY } from '../../interfaces/enum';


export const AddEditEvent = (props) => {
    const dispatch: AppDispatch = useDispatch();
    const [showAddSyllabusEvents, setShowAddSyllabusEvents] = useState(false);

    const handleCloseAddSyllabusEvents = () => {
        setShowAddSyllabusEvents(false);
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
        syllabus_id: yup.string().required(SELECTION_IS_REQUIRED),
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

    return (
        <>
            {/***** Modal start *****/}
            <Modal
                className="add-event-modal-wrapper"
                show={showAddSyllabusEvents}
                onHide={handleCloseAddSyllabusEvents}
                centered
                dialogClassName="add-event-modal"
            >
                <Modal.Header>
                    <Modal.Title>
                        {!isNullUndefinedOrBlank(eventFormData?.values?.id) ? "Edit" : "Add New"} Event
                    </Modal.Title>
                    <button type="button" className="modal-close-btn" onClick={handleCloseAddSyllabusEvents}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18"/>
                            <line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                    </button>
                </Modal.Header>
                <Modal.Body>
                    {/* Start/End Date Row */}
                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label required">Start Date</label>
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
                                    dateFormat="MM/dd/yyyy hh:mm aa"
                                    timeIntervals={15}
                                    className="form-input"
                                    popperProps={{ strategy: "fixed" }}
                                    placeholderText="Select Date"
                                    onBlur={() => eventFormData.setFieldTouched("start_date", true)}
                                    minDate={new Date()}
                                    disabled={eventFormData?.values?.is_all_day_event}
                                    filterTime={(time) => {
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
                            {eventFormData.touched.start_date && eventFormData.errors.start_date && renderError(eventFormData.errors.start_date as any)}
                        </div>
                        <div className="form-group">
                            <label className="form-label required">End Date</label>
                            <div className="date-input-wrapper">
                                <DatePicker
                                    selected={eventFormData.values.end_date}
                                    onChange={(date) => eventFormData.setFieldValue("end_date", date)}
                                    showTimeSelect
                                    dateFormat="MM/dd/yyyy hh:mm aa"
                                    timeIntervals={15}
                                    className="form-input"
                                    popperProps={{ strategy: "fixed" }}
                                    placeholderText="Select Date"
                                    onBlur={() => eventFormData.setFieldTouched("end_date", true)}
                                    disabled={eventFormData?.values?.is_all_day_event}
                                    minDate={eventFormData?.values?.start_date}
                                    filterTime={(time) => {
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
                            {eventFormData.touched.end_date && eventFormData.errors.end_date && renderError(eventFormData.errors.end_date as any)}
                        </div>
                    </div>
                    {/* Title */}
                    <div className="form-group">
                        <label className="form-label required">Title</label>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="Enter Title"
                            {...eventFormData.getFieldProps("title")}
                            maxLength={MAX_1000}
                        />
                        {eventFormData.touched.title && eventFormData.errors.title && renderError(eventFormData.errors.title as any)}
                    </div>

                    {/* Note */}
                    <div className="form-group">
                        <label className="form-label">Note</label>
                        <textarea
                            className="form-textarea"
                            placeholder="Enter Note"
                            rows={4}
                            {...eventFormData.getFieldProps("note")}
                            maxLength={MAX_300}
                        />
                    </div>
                    {/* Calendar */}
                    <div className="form-group">
                        <label className="form-label required">Calendar</label>
                        <Select
                            options={syllabusDropDownData}
                            placeholder="Select"
                            onChange={(selectedOption) => eventFormData.setFieldValue("syllabus_id", selectedOption?.value || null)}
                            value={syllabusDropDownData?.filter(({ value }) => value === eventFormData.values.syllabus_id)}
                            isDisabled={!isNullUndefinedOrBlank(props?.selectedCourse)}
                            isClearable
                            menuPosition="fixed"
                            className="react-select-container"
                            classNamePrefix="react-select"
                        />
                        {eventFormData.touched.syllabus_id && eventFormData.errors.syllabus_id && renderError(eventFormData.errors.syllabus_id as any)}
                    </div>

                    {/* Priority */}
                    <div className="form-group">
                        <label className="form-label">Priority</label>
                        <Select
                            options={eventPriorityDropDownData}
                            placeholder="Select Priority"
                            onChange={(selectedOption) => eventFormData.setFieldValue("priority", selectedOption?.value || null)}
                            value={eventPriorityDropDownData?.filter(({ value }) => value === eventFormData.values.priority)}
                            menuPosition="fixed"
                            className="react-select-container"
                            classNamePrefix="react-select"
                        />
                    </div>
                    {/* All Day Checkbox - only show in edit mode */}
                    {!isNullUndefinedOrBlank(eventFormData?.values?.id) && (
                        <div className="form-group checkbox-group">
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    onChange={() => handleMarkAllDayEvent(!eventFormData?.values?.is_all_day_event)}
                                    disabled={isNullUndefinedOrBlank(eventFormData?.values?.start_date)}
                                    checked={eventFormData?.values?.is_all_day_event}
                                />
                                <span>Mark as all day Event</span>
                            </label>
                        </div>
                    )}

                    {/* Reminder Toggle */}
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
                    {/* Reminder Fields */}
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
                    {/* Add to Calendar - only show in edit mode */}
                    {!isNullUndefinedOrBlank(eventFormData?.values?.id) && (
                        <div className="form-group">
                            <label className="form-label">Add On Your Default Calendar</label>
                            <div className="calendar-buttons">
                                <add-to-calendar-button
                                    name={eventFormData?.values?.title}
                                    startDate={!isNullUndefinedOrBlank(eventFormData?.values?.start_date) ? formatedDate(eventFormData?.values?.start_date, 'yyyy-MM-DD') : formatedDate(new Date(), 'DD-MM-yyyy')}
                                    endDate={!isNullUndefinedOrBlank(eventFormData?.values?.end_date) ? formatedDate(eventFormData?.values?.end_date, 'yyyy-MM-DD') : formatedDate(new Date(), 'DD-MM-yyyy')}
                                    startTime={!isNullUndefinedOrBlank(eventFormData?.values?.start_date) ? formatedDate(eventFormData?.values?.start_date, 'HH:mm') : formatedDate(new Date(), 'HH:mm')}
                                    endTime={!isNullUndefinedOrBlank(eventFormData?.values?.end_date) ? formatedDate(eventFormData?.values?.end_date, 'HH:mm') : formatedDate(new Date(), 'HH:mm')}
                                    timeZone={Intl.DateTimeFormat().resolvedOptions().timeZone}
                                    description={!isNullUndefinedOrBlank(eventFormData?.values?.note) ? eventFormData?.values?.note : ""}
                                    options="'Apple','Google','Outlook.com'"
                                    buttonsList
                                    hideTextLabelButton
                                    buttonStyle="round"
                                    lightMode="bodyScheme"
                                ></add-to-calendar-button>
                            </div>
                        </div>
                    )}
                </Modal.Body>
                <div className="add-event-footer">
                    <button type="button" className="btn btn-outline" onClick={handleCloseAddSyllabusEvents}>
                        Cancel
                    </button>
                    <div className="modal-footer-right">
                        {eventFormData?.values?.id && (
                            <button type="button" className="btn btn-danger" onClick={() => handleDeleteShow(eventFormData.values)}>
                                Delete
                            </button>
                        )}
                        <button type="button" className="btn btn-outline" onClick={handleClearData}>
                            Clear
                        </button>
                        <button type="button" className="btn btn-primary" onClick={handleEventSubmit}>
                            Save
                        </button>
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
            >
                <Modal.Header>
                    <h4 className="modal-title">Delete Event</h4>
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
                            <p>  You want to delete this event ?

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
                                No, Change My Mind
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