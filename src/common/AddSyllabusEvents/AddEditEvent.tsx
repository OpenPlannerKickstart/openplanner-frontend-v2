import React, { useEffect, useState } from 'react'
import { connect, useDispatch } from 'react-redux'
import { AppDispatch } from '../../redux/store';
import { getSyllabusDropDownDataAPI } from '../../redux/Service/User/Calender/calender';
import { addEvenData } from '../../interfaces/interface';
import { END_DATE_IS_REQUIRED, SELECTION_IS_REQUIRED, START_DATE_IS_REQUIRED, TITLE_IS_REQUIRED } from '../../Utility/Validation_Message';
import * as yup from 'yup';
import { MAX_1000, MAX_3, MAX_300, ONLY_NUMBERS } from '../../Utility/Validation_Helper';
import { FormikTouched, FormikValues, setNestedObjectValues, useFormik } from 'formik';
import { customJsonInclude, formatedDate, getDate, isEmptyObjectOrNullUndefiend, isNullUndefinedOrBlank, renderError } from '../../Utility/Helper';
import { addEditEventDataAPI, deleteEventDataAPI } from '../../redux/Service/User/Courses/courses';
import DatePicker from "react-datepicker";
import Select from "react-select";
import { eventPriorityDropDownData, reminderUnitDropDownData } from '../../Utility/staticDropDown';
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
        end_date: yup
            .string()
            .required(END_DATE_IS_REQUIRED)
            .test("is-greater", "End date must be greater than start date", function (value) {
                const { start_date } = this.parent;
                if (!value || !start_date) return true;
                return new Date(value) > new Date(start_date);
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
                                    return false;
                                }
                                seen.add(key);
                            }
                            return true;
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

    if (!showAddSyllabusEvents) return null;

    return (
        <>
            {/* Add/Edit Event Modal */}
            <div className="modal-overlay" onClick={handleCloseAddSyllabusEvents}>
                <div className="modal-card add-event-modal" onClick={(e) => e.stopPropagation()}>
                    <div className="modal-header">
                        <h2 className="modal-title">
                            {`${!isNullUndefinedOrBlank(eventFormData?.values?.id) ? "Edit" : "Add New"}`} Event
                        </h2>
                        <button className="modal-close-btn" onClick={handleCloseAddSyllabusEvents}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </button>
                    </div>

                    <div className="modal-body">
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

                                            const isSameDate =
                                                now.getFullYear() === selectedDate.getFullYear() &&
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
                                        onBlur={() => {
                                            eventFormData.setFieldTouched("start_date", true)
                                        }}
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
                                    <svg className="date-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                                        <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                        <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                        <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="2"/>
                                    </svg>
                                </div>
                                {eventFormData.touched.start_date &&
                                    eventFormData.errors.start_date
                                    && renderError(eventFormData.errors.start_date as any)}
                            </div>

                            <div className="form-group">
                                <label className="form-label required">End Date</label>
                                <div className="date-input-wrapper">
                                    <DatePicker
                                        selected={eventFormData.values.end_date}
                                        onChange={(date) => {
                                            eventFormData.setFieldValue("end_date", date);
                                        }}
                                        showTimeSelect
                                        dateFormat="MM/dd/yyyy hh:mm aa"
                                        timeIntervals={15}
                                        className="form-input"
                                        popperProps={{ strategy: "fixed" }}
                                        placeholderText="Select Date"
                                        onBlur={() => {
                                            eventFormData.setFieldTouched("end_date", true)
                                        }}
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
                                    <svg className="date-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                                        <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                        <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                        <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="2"/>
                                    </svg>
                                </div>
                                {eventFormData.touched.end_date &&
                                    eventFormData.errors.end_date
                                    && renderError(eventFormData.errors.end_date as any)}
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label required">Title</label>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="Enter Title"
                                {...eventFormData.getFieldProps("title")}
                                maxLength={MAX_1000}
                            />
                            {eventFormData.touched.title &&
                                eventFormData.errors.title
                                && renderError(eventFormData.errors.title as any)}
                        </div>

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

                        <div className="form-group">
                            <label className="form-label required">Calendar</label>
                            <div className="select-wrapper">
                                <Select
                                    options={syllabusDropDownData}
                                    placeholder={<div>Select</div>}
                                    onChange={(selectedOption) => {
                                        eventFormData.setFieldValue("syllabus_id", selectedOption?.value ? selectedOption?.value : null);
                                    }}
                                    value={syllabusDropDownData?.filter(({ value }) => {
                                        return (
                                            value ===
                                            eventFormData.values.syllabus_id
                                        );
                                    })}
                                    isDisabled={!isNullUndefinedOrBlank(props?.selectedCourse) ? true : false}
                                    isClearable
                                    menuPosition="fixed"
                                    className="react-select-container"
                                    classNamePrefix="react-select"
                                />
                            </div>
                            {eventFormData.touched.syllabus_id &&
                                eventFormData.errors.syllabus_id
                                && renderError(eventFormData.errors.syllabus_id as any)}
                        </div>

                        <div className="form-group">
                            <label className="form-label">Priority</label>
                            <div className="select-wrapper">
                                <Select
                                    options={eventPriorityDropDownData}
                                    placeholder={<div>Select Priority</div>}
                                    onChange={(selectedOption) => {
                                        eventFormData.setFieldValue("priority", selectedOption?.value ? selectedOption?.value : null);
                                    }}
                                    value={eventPriorityDropDownData?.filter(({ value }) => {
                                        return (
                                            value ===
                                            eventFormData.values.priority
                                        );
                                    })}
                                    menuPosition="fixed"
                                    className="react-select-container"
                                    classNamePrefix="react-select"
                                />
                            </div>
                        </div>

                        {!isNullUndefinedOrBlank(eventFormData?.values?.id) && (
                            <div className="form-group">
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        onChange={() => {
                                            handleMarkAllDayEvent(!eventFormData?.values?.is_all_day_event)
                                        }}
                                        disabled={isNullUndefinedOrBlank(eventFormData?.values?.start_date)}
                                        checked={eventFormData?.values?.is_all_day_event}
                                    />
                                    <span>Mark as all day Event</span>
                                </label>
                            </div>
                        )}

                        <div className="form-group reminder-toggle-group">
                            <span className="reminder-label">Reminder (Notify me before start date)</span>
                            <label className="toggle-switch">
                                <input
                                    type="checkbox"
                                    checked={eventFormData?.values?.is_reminder}
                                    onChange={() => { handleChangeReminder(!eventFormData.values.is_reminder) }}
                                />
                                <span className="toggle-slider"></span>
                            </label>
                        </div>

                        {eventFormData?.values.is_reminder && !isEmptyObjectOrNullUndefiend(eventFormData?.values.reminder) && (
                            <div className="form-group">
                                <div className="notifications-container">
                                    {eventFormData?.values?.reminder?.map((item: any, index: number) => {
                                        return (
                                            <div className="notification-row" key={index}>
                                                <div className="reminder-fields-row">
                                                    <div className="reminder-field">
                                                        <span className="reminder-field-label">Unit</span>
                                                        <div className="select-wrapper">
                                                            <Select
                                                                options={reminderUnitDropDownData}
                                                                placeholder={<div>Select Unit</div>}
                                                                menuPosition="fixed"
                                                                className="react-select-container"
                                                                classNamePrefix="react-select"
                                                                onChange={(selectedOption: any) => {
                                                                    eventFormData.setFieldValue(
                                                                        `reminder.${index}.unit`, selectedOption.value)
                                                                }}
                                                                value={reminderUnitDropDownData?.filter(({ value }) => {
                                                                    return (
                                                                        value ===
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
                                                        </div>
                                                        {(eventFormData?.touched?.reminder?.[index]?.unit as any) &&
                                                            (eventFormData?.errors?.reminder?.[index]?.unit as any) &&
                                                            renderError(eventFormData?.errors?.reminder?.[index]?.unit as any)}
                                                    </div>

                                                    <div className="reminder-field">
                                                        <span className="reminder-field-label">Value</span>
                                                        <input
                                                            type="number"
                                                            className="form-input"
                                                            placeholder="Enter Value"
                                                            {...eventFormData.getFieldProps(`reminder.${index}.value`)}
                                                            maxLength={MAX_3}
                                                            onBlur={() => {
                                                                eventFormData.setFieldTouched(
                                                                    `reminder.${index}.value`,
                                                                    true
                                                                );
                                                            }}
                                                        />
                                                        {(eventFormData?.touched?.reminder?.[index]?.value as any) &&
                                                            (eventFormData?.errors?.reminder?.[index]?.value as any) &&
                                                            renderError(eventFormData?.errors?.reminder?.[index]?.value as any)}
                                                    </div>
                                                </div>

                                                {eventFormData?.values?.reminder?.length > 1 && (
                                                    <button
                                                        type="button"
                                                        className="remove-notification-btn"
                                                        onClick={() => { removeReminderList(index) }}
                                                    >
                                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                        </svg>
                                                    </button>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                                {(eventFormData?.touched?.reminder as any) &&
                                    (eventFormData?.errors?.reminder as any) &&
                                    typeof eventFormData?.errors?.reminder === "string" &&
                                    renderError((eventFormData?.errors?.reminder as any))}
                                <button
                                    type="button"
                                    className="add-notification-btn"
                                    disabled={!isNullUndefinedOrBlank(eventFormData?.errors?.reminder) && typeof eventFormData?.errors?.reminder === "string"}
                                    onClick={() => { addReminderList() }}
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                    Add Another Notification <span className="notification-count">({eventFormData?.values?.reminder?.length}/3)</span>
                                </button>
                            </div>
                        )}

                        {!isNullUndefinedOrBlank(eventFormData?.values?.id) && (
                            <div className="form-group default-cal-group">
                                <div className="title-text">
                                    <p>Add On Your Default Calendar</p>
                                </div>
                                <div>
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
                    </div>

                    <div className="modal-footer add-event-footer">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={handleCloseAddSyllabusEvents}
                        >
                            Cancel
                        </button>
                        <div className="modal-footer-right">
                            {eventFormData?.values?.id && (
                                <button
                                    type="button"
                                    className="btn btn-danger"
                                    onClick={() => { handleDeleteShow(eventFormData.values) }}
                                >
                                    Delete
                                </button>
                            )}
                            <button
                                type="button"
                                className="btn btn-outline"
                                onClick={handleClearData}
                            >
                                Clear
                            </button>
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={handleEventSubmit}
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {deleteShow && (
                <div className="modal-overlay" onClick={handleDeleteClose}>
                    <div className="modal-card delete-confirmation-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2 className="modal-title">Delete Event</h2>
                            <button className="modal-close-btn" onClick={handleDeleteClose}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="modal-confirmation-container">
                                <div className="modal-confirmation-icon">
                                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </div>
                                <h5>Are You Sure?</h5>
                                <p>You want to delete this event?</p>
                            </div>
                            <div className="modal-button-group">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={handleDeleteClose}
                                >
                                    No, Change My Mind
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-danger"
                                    onClick={() => {
                                        handleDeleteData(selectedEventObj?.id)
                                    }}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

const mapStateToProps = (state) => ({})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(AddEditEvent)
