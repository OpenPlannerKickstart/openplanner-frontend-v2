import React, { useEffect, useState } from 'react'
import { connect, useDispatch } from 'react-redux'
import { AppDispatch } from '../../redux/store';
import { getSyllabusDropDownDataAPI } from '../../redux/Service/User/Calender/calender';
import { addEvenData } from '../../interfaces/interface';
import { END_DATE_IS_REQUIRED, SELECTION_IS_REQUIRED, START_DATE_IS_REQUIRED, TITLE_IS_REQUIRED } from '../../Utility/Validation_Message';
import * as yup from 'yup';
import { MAX_3, MAX_300, MAX_50, ONLY_NUMBERS } from '../../Utility/Validation_Helper';
import { FormikTouched, FormikValues, setNestedObjectValues, useFormik } from 'formik';
import { customJsonInclude, formatedDate, getDate, isEmptyObjectOrNullUndefiend, isNullUndefinedOrBlank, renderError } from '../../Utility/Helper';
import { addEditEventDataAPI } from '../../redux/Service/User/Courses/courses';
import { Button, Col, Form, Offcanvas, Row } from 'react-bootstrap';
import DatePicker from "react-datepicker";
import Select, { components, ControlProps } from "react-select";
import { reminderUnitDropDownData } from '../../Utility/staticDropDown';
import appleLogo from "/assets/images/apple-logo.svg";
import calendarLogo from "/assets/images/calendar-logo.svg";
import outlookLogo from "/assets/images/outlook-logo.svg";
import moment from 'moment';
import { AddToCalendarButton } from 'add-to-calendar-button-react';
import 'add-to-calendar-button';
import { isUpdatedEvent } from '../../redux/User/Courses/coursesSlice';


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
    const handleGetSyllabusDropDownData = async () => {

        const response = await dispatch(getSyllabusDropDownDataAPI({}));
        if (response) {
            setSyllabusDropDownData(response?.payload || []);

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
            is_all_day_event: eventFormData?.values?.is_all_day_event

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
                            {`${!isNullUndefinedOrBlank(eventFormData?.values?.id) ? "Edit" : "Add New"}`} <span></span> Event
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
                                                    <h4>Event Details</h4>
                                                </div> */}
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
                                                                        eventFormData.setFieldValue("start_date", date);
                                                                        // Calculate the end date as 30 minutes after the start date
                                                                        const endDate = new Date(date.getTime() + 30 * 60 * 1000);

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
                                                                    disabled={eventFormData?.values?.is_all_day_event}
                                                                />

                                                            </div>
                                                            {eventFormData.touched.start_date &&
                                                                eventFormData.errors.start_date
                                                                && renderError(eventFormData.errors.start_date as any)}
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
                                                                    onChange={(date) => {

                                                                        eventFormData.setFieldValue("end_date", date);
                                                                    }}
                                                                    showTimeSelect
                                                                    dateFormat="MM/dd/yyyy hh:mm aa"
                                                                    timeIntervals={15}
                                                                    className="form-control"
                                                                    popperProps={{ strategy: "fixed" }}
                                                                    placeholderText="Select Date"

                                                                    onBlur={() => {
                                                                        eventFormData.setFieldTouched("end_date", true)
                                                                    }}
                                                                    disabled={eventFormData?.values?.is_all_day_event}
                                                                    minDate={eventFormData?.values?.start_date}

                                                                />
                                                            </div>
                                                            {eventFormData.touched.end_date &&
                                                                eventFormData.errors.end_date
                                                                && renderError(eventFormData.errors.end_date as any)}
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
                                                        isDisabled={!isNullUndefinedOrBlank(props?.selectedCourse) ? true : false}
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
                                                {
                                                    !isNullUndefinedOrBlank(eventFormData?.values?.id) &&
                                                    <div className="checkbox checkbox-primary all-event-checkbox my-4">
                                                        <input
                                                            type="checkbox"
                                                            id="checkbox-all-day"
                                                            className="material-inputs filled-in"
                                                            onChange={() => {
                                                                handleMarkAllDayEvent(!eventFormData?.values?.is_all_day_event)
                                                            }}
                                                            disabled={isNullUndefinedOrBlank(eventFormData?.values?.start_date)}
                                                            checked={eventFormData?.values?.is_all_day_event}
                                                        />
                                                        <label htmlFor="checkbox-all-day">Mark as all day Event</label>
                                                    </div>
                                                }
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
                                                {!isNullUndefinedOrBlank(eventFormData?.values?.id) &&
                                                    <>
                                                        <div className="form-group default-cal-group">
                                                            <div className="title-text">
                                                                <p>Add On Your Default Calendar</p>
                                                            </div>


                                                            {/* <AddToCalendarButton> */}




                                                            <div className="button-group social-cal"
                                                                onClick={() => {
                                                                    // Generate the .ics file content
                                                                    const title = eventFormData?.values?.title || 'Event';
                                                                    const description = eventFormData?.values?.note || '';
                                                                    const startDate = formatedDate(
                                                                        eventFormData?.values?.start_date || new Date(),
                                                                        'yyyyMMDDTHHmmss'
                                                                    );
                                                                    const endDate = formatedDate(
                                                                        eventFormData?.values?.end_date || new Date(),
                                                                        'yyyyMMDDTHHmmss'
                                                                    );

                                                                    const icsContent = `
                                                        BEGIN:VCALENDAR
                                                        VERSION:2.0
                                                        PRODID:-//YourAppName//EN
                                                        CALSCALE:GREGORIAN
                                                        BEGIN:VEVENT
                                                        SUMMARY:${title}
                                                        DESCRIPTION:${description}
                                                        DTSTART:${startDate}Z
                                                        DTEND:${endDate}Z
                                                        LOCATION:America/New_York
                                                        END:VEVENT
                                                        END:VCALENDAR`;

                                                                    // Create a Blob for the .ics file
                                                                    const blob = new Blob([icsContent], { type: 'text/calendar' });

                                                                    // Trigger download
                                                                    const link = document.createElement('a');
                                                                    link.href = URL.createObjectURL(blob);
                                                                    link.download = `${title}.ics`;
                                                                    link.click();
                                                                }}>
                                                                {/* <Button
                                                                    variant="outline-white"
                                                                    className="btn-icon-text "
                                                                >
                                                                    <img src={appleLogo} alt="" />
                                                                    Apple Calendar
                                                            </Button> */}

                                                                {/* <Button
                                                                    variant="outline-white"
                                                                    className="btn-icon-text "
                                                                >
                                                                    <img src={calendarLogo} alt="" />
                                                                    Google Calendar
                                                                </Button> */}

                                                                {/* <Button
                                                                    variant="outline-white"
                                                                    className="btn-icon-text "
                                                                >
                                                                    <img src={outlookLogo} alt="" />
                                                                    Outlook
                                                                </Button> */}
                                                                <add-to-calendar-button

                                                                    name={eventFormData?.values?.title}
                                                                    startDate={!isNullUndefinedOrBlank(eventFormData?.values?.start_date) ? formatedDate(eventFormData?.values?.start_date, 'yyyy-MM-DD') : formatedDate(new Date(), 'DD-MM-yyyy')}
                                                                    endDate={!isNullUndefinedOrBlank(eventFormData?.values?.end_date) ? formatedDate(eventFormData?.values?.end_date, 'yyyy-MM-DD') : formatedDate(new Date(), 'DD-MM-yyyy')}
                                                                    startTime={!isNullUndefinedOrBlank(eventFormData?.values?.start_date) ? formatedDate(eventFormData?.values?.start_date, 'HH:mm') : formatedDate(new Date(), 'HH:mm')}
                                                                    endTime={!isNullUndefinedOrBlank(eventFormData?.values?.end_date) ? formatedDate(eventFormData?.values?.end_date, 'HH:mm') : formatedDate(new Date(), 'HH:mm')}
                                                                    timeZone="America/New_York"
                                                                    description={!isNullUndefinedOrBlank(eventFormData?.values?.note) ? eventFormData?.values?.note : ""}
                                                                    options="'Apple','Google','Outlook.com'"
                                                                    buttonsList
                                                                    hideTextLabelButton
                                                                    buttonStyle="round"
                                                                    lightMode="bodyScheme"

                                                                ></add-to-calendar-button>
                                                            </div>
                                                        </div>

                                                    </>
                                                }
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
                                            onClick={() => { handleEventSubmit() }}
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

const mapStateToProps = (state) => ({})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(AddEditEvent)