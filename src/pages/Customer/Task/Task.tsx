import React, { useEffect, useState } from "react";
import { Badge, Button, Form, Modal, Offcanvas } from "react-bootstrap";
import DatePicker from "react-datepicker";
import Select, { components, ControlProps } from "react-select";
import Open from "./Open";
import Complete from "./Complete";
import { setNestedObjectValues, useFormik } from 'formik';
import * as yup from 'yup';
import { customJsonInclude, getDate, isEmpty, isEmptyObjectOrNullUndefiend, isNullUndefinedOrBlank, renderError } from "../../../Utility/Helper";
import { TASK_DATE_IS_REQUIRED, TASK_NAME_IS_REQUIRED, TASK_NOTE_IS_REQUIRED } from "../../../Utility/Validation_Message";
import { MAX_3, MAX_300, MAX_5, MAX_50, ONLY_NUMBERS } from "../../../Utility/Validation_Helper";
import { reminderUnitDropDownData } from "../../../Utility/staticDropDown";
import { AppDispatch } from "../../../redux/store";
import { connect, useDispatch } from "react-redux";
import { addEditTaskAPI, taskListingAPI } from "../../../redux/Service/task";
import { ENUMFORTASK } from "../../../interfaces/enum";
import { Task } from "../../../interfaces/interface";
const Task = (props) => {
  // Deleted modal
  const [deleteShow, setDeleteShow] = useState(false);
  const handleDeleteClose = () => setDeleteShow(false);
  const handleDeleteShow = () => setDeleteShow(true);

  // Compated Deleted modal
  const [SuccessDeleteShow, setSuccessDeleteShow] = useState(false);
  const handleSuccessDeleteClose = () => setSuccessDeleteShow(false);
  const handleSuccessDeleteShow = () => setSuccessDeleteShow(true);

  // Success modal
  const [SuccessShow, setSuccessShow] = useState(false);
  const handleSuccessClose = () => setSuccessShow(false);
  const handleSuccessShow = () => setSuccessShow(true);

  // ADD new task offcanvas
  const [showAddNewCourse, setShowAddNewCourse] = useState(false);
  const handleCloseAddNewCourse = () => {
    setShowAddNewCourse(false);
    setTimeout(() => {
      setSavedtaskFormData(null);
      taskFormData.resetForm();
    }, 200);
  }
  const toggleShowAddNewCourse = () => setShowAddNewCourse(true);


  /** --------------------Add Edit Task Start------------------------*/
  const dispatch: AppDispatch = useDispatch();

  // Define initial values
  const initFormValues = {
    task_name: "",
    due_date: "",
    note: "",
    is_reminder: false,
    reminder: [],
  };

  // useState for saved form data
  const [savedtaskFormData, setSavedtaskFormData] = useState<any>(null);

  // Define validation schema
  const validationSchema: any = yup.object({
    task_name: yup.string()
      .trim()
      .required(TASK_NAME_IS_REQUIRED),
    due_date: yup.string()
      .trim()
      .required(TASK_DATE_IS_REQUIRED),
    note: yup.string()
      .trim()
      .required(TASK_NOTE_IS_REQUIRED),
    is_reminder: yup.boolean(),
    reminder: yup.array()
      .of(
        yup.object().shape({
          unit: yup
            .string()
            .nullable()
            .when("is_reminder", {
              is: (is_reminder) =>
                taskFormData?.values?.is_reminder === true,
              then: (schema) => schema.required("Unit is required"),
              otherwise: (schema) => schema.notRequired(),
            }),
          value: yup
            .string()
            .matches(ONLY_NUMBERS, "Only numbers are allowed")
            .nullable()
            .when("is_reminder", {
              is: (is_reminder) =>
                taskFormData?.values?.is_reminder === true,
              then: (schema) => schema.required("Value is required"),
              otherwise: (schema) => schema.notRequired(),
            })
        })
      )
      .nullable()
      .when("is_reminder", {
        is: (is_reminder) =>
          taskFormData?.values?.is_reminder === true,
        then: (schema) => schema.required(),
        otherwise: (schema) => schema.notRequired(),
      }),

  });

  // onSubmit function
  const onSubmit = async (values, onSubmitProps) => {
    // Handle form submission logic
  };

  // useFormik instance
  const taskFormData: any = useFormik({
    initialValues: savedtaskFormData || initFormValues,
    validationSchema,
    onSubmit,
    enableReinitialize: true,
  });

  // Utility function to handle blur updates
  const handleBlurValueUpdate = (key) => {
    taskFormData.setFieldValue(key, taskFormData.values[key].trim());
    setTimeout(() => {
      taskFormData.setFieldTouched(key, true);
    }, 100);
  };

  // Submission handler
  const handleSubmitTaskFormData = async () => {
    taskFormData.handleSubmit();
    const taskFormDataErrors = await taskFormData.validateForm();
    console.log("taskFormDataErrors", taskFormDataErrors);
    if (Object.keys(taskFormDataErrors).length > 0) {
      taskFormData.setTouched(
        setNestedObjectValues(taskFormDataErrors, true)
      );
      return;
    }

    let reqBody = { ...taskFormData.values };
    if (!isNullUndefinedOrBlank(reqBody.due_date)) {
      reqBody = {
        ...reqBody,
        due_date: getDate(reqBody.due_date, "yyyy-MM-DD")
      }
    }
    customJsonInclude(reqBody);
    const response = await dispatch(addEditTaskAPI(reqBody));
    if (!isNullUndefinedOrBlank(response?.payload)) {
      handleCloseAddNewCourse();
      taskFormData.resetForm();
      getTaskListing()
    }

  };

  const addReminder = (is_reminder) => {
    taskFormData.setFieldValue("is_reminder", is_reminder);
    if (is_reminder) {
      appendReminder()
    } else {
      taskFormData.setFieldValue("reminder", []);
    }
  }

  const appendReminder = () => {
    let obj: any = {
      unit: "",
      value: "",
    }
    let reminder: any = [...taskFormData.values.reminder];
    if (isEmptyObjectOrNullUndefiend(taskFormData?.errors?.reminder)) {
      reminder.push(obj);
      taskFormData.setFieldValue("reminder", reminder);
    }
  }

  const removeReminder = (index) => {
    let reminder: any = [...taskFormData.values.reminder];
    reminder.splice(index, 1);
    taskFormData.setFieldValue("reminder", reminder);

    // Remove the corresponding error if it exists
    const errors = { ...taskFormData.errors };
    if (errors.reminder) {
      const reminderErrors = [...(errors.reminder as any[])];
      reminderErrors.splice(index, 1);
      taskFormData.setErrors({
        ...errors,
        reminder: reminderErrors,
      });

    }
  }

  useEffect(() => {
    const reminders = taskFormData?.values?.reminder || [];
    // Find duplicate indexes
    const duplicateIndexes: number[] = [];
    reminders?.forEach((reminder, index) => {
      for (let i = index + 1; i < reminders.length; i++) {
        if (
          reminders[i].unit === reminder.unit &&
          reminders[i].value === reminder.value
        ) {
          duplicateIndexes.push(index, i);
        }
      }
    });

    // Set errors for each duplicate index
    duplicateIndexes?.forEach((index) => {
      taskFormData?.setFieldError(`reminder[${index}].value`, "Duplicate Found");
    });

  }, [taskFormData.values.reminder, taskFormData]);

  /** --------------------Add Edit Task End------------------------*/

  /** ---------------------Task Listing Start-----------------------*/
  const [startDate, setStartDate] = useState<any>(null);
  const [endDate, setEndDate] = useState<any>(null);
  const [search, setSearch] = useState<any>("");
  const [selectedTab, setSelectedTab] = useState<string>(ENUMFORTASK.OPEN)
  const onChangeTab = (val) => {
    if (selectedTab !== val) {
      setSelectedTab(val);
    }
  }

  const [taskList, setTaskList] = useState<Array<Task>>([]);
  const [count, setCount] = useState<number>(0)
  const getTaskListing = async () => {
    let reqBody = {
      status: selectedTab,
      search: search,
      start_date: startDate,
      end_date: endDate,
      filter: "due_date"
    }
    const response = await dispatch(taskListingAPI(reqBody));
    if (!isNullUndefinedOrBlank(response?.payload)) {
      setTaskList(response?.payload?.tasks);
      setCount(response?.payload?.pending_task_count);
    }
  }

  useEffect(() => {
    const debounceTask = () => {
      setTimeout(() => {
        getTaskListing();
      }, 300);
    }
    debounceTask();
    return () => {
      setTaskList([]);

      // setCount(0)
    }
  }, [selectedTab, search, endDate, startDate])

  useEffect(() => {
    setSearch(null);
    setStartDate(null);
    setEndDate(null);
  }, [selectedTab])




  /** ---------------------Task Listing End-----------------------*/


  return (
    <>
      <div className="page-content">
        <div className="page-title-wrapper">
          <div className="page-title-left">
            <div className="page-title">
              <h4>All Tasks</h4>
            </div>
          </div>
          <div className="page-title-right">
            <button
              type="button"
              className="btn btn-primary"
              onClick={toggleShowAddNewCourse}
            >
              Add Task
            </button>
          </div>
        </div>

        <div className="content-area task-content-area content-area-title-filter">
          <div className="page-content-wrapper h-100">
            <div className="all-task-container">

              <div className="nav-tabs-outer nav-tabs-style2">
                <nav>
                  <div
                    className="nav nav-tabs page-filters"
                    id="nav-tab"
                    role="tablist"
                  >
                    <div className="page-filters-left">
                      <button
                        className={`nav-link ${selectedTab === ENUMFORTASK.OPEN ? "active" : ""}`}
                        id="nav-opentask-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#nav-opentask"
                        type="button"
                        role="tab"

                        onClick={() => { onChangeTab(ENUMFORTASK.OPEN) }}
                      >

                        Open  <Badge bg="light-grey">{!isNullUndefinedOrBlank(count) ? count : 0}</Badge>
                      </button>

                      <button
                        className={`nav-link ${selectedTab === ENUMFORTASK.COMPLETED ? "active" : ""}`}
                        id="nav-complatetask-tab"
                        type="button"
                        role="tab"

                        onClick={() => { onChangeTab(ENUMFORTASK.COMPLETED) }}
                      >
                        Completed
                      </button>
                    </div>
                    <div className="page-filters-right">
                      <Form.Group className="form-group form-group-sm form-group-inline-control">
                        <div className="form-control-wrapper">
                          <div className="form-group-icon-start">
                            <i className="material-symbols-outlined">search</i>
                            <Form.Control type="text" placeholder="Search" onChange={(e) => { setSearch(e.target.value) }} />
                          </div>
                        </div>
                      </Form.Group>
                      <Form.Group className="form-group form-group-sm">
                        <div className="react-datepicker-container form-group-icon-end">
                          <i className="material-symbols-outlined control-icon">date_range</i>
                          {/* <DatePicker
                            dropdownMode="select"
                            isClearable={true}
                            dateFormat="dd/MM/yyyy"
                            className="form-control"
                            popperProps={{ strategy: "fixed" }}
                            placeholderText="Date Range"
                          /> */}
                          <DatePicker
                            dropdownMode="select"
                            isClearable={true}
                            dateFormat="dd/MM/yyyy"
                            className="form-control"
                            popperProps={{ strategy: "fixed" }}
                            placeholderText="Date Range"
                            toggleCalendarOnIconClick
                            selectsRange={true}
                            onChange={(dates) => {
                              const [start, end] = dates;
                              setStartDate(start ? start : null);
                              setEndDate(end ? end : null);
                            }
                            }
                            startDate={startDate}
                            endDate={endDate}
                          />
                        </div>
                      </Form.Group>
                    </div>
                  </div>
                </nav>
                <div className="tab-content" id="nav-tabContent">
                  <div
                    className={`tab-pane fade ${selectedTab === ENUMFORTASK.OPEN ? "show active" : ""}`}
                    id="nav-opentask"
                    role="tabpanel"
                    aria-labelledby="nav-opentask-tab"
                  >
                    <div className="tab-content-container">
                      <Open taskList={taskList} getTaskListing={getTaskListing} setSavedtaskFormData={setSavedtaskFormData} toggleShowAddNewCourse={toggleShowAddNewCourse} />
                    </div>
                  </div>
                  <div
                    className={`tab-pane fade ${selectedTab === ENUMFORTASK.COMPLETED ? "show active" : ""}`}
                    id="nav-complatetask"
                    role="tabpanel"
                    aria-labelledby="nav-complatetask-tab"
                  >
                    <div className="tab-content-container">
                      <Complete taskList={taskList} getTaskListing={getTaskListing} setSavedtaskFormData={setSavedtaskFormData} toggleShowAddNewCourse={toggleShowAddNewCourse} />
                    </div>
                  </div>
                </div>
              </div>
            </div>



            {/***** Offcanvas start *****/}
            <div className="add-syllabus-event-wrapper">
              <Offcanvas
                className="op-offcanvas style-1"
                show={showAddNewCourse}
                placement={"end"}
                onHide={handleCloseAddNewCourse}
              >
                <Offcanvas.Header>
                  <Offcanvas.Title>
                    {!isEmptyObjectOrNullUndefiend(savedtaskFormData) ? "Edit" : "Add New"}  <span>Task</span>
                  </Offcanvas.Title>
                  <button type="button" className="btn-close" onClick={handleCloseAddNewCourse}>
                    <i className='material-symbols-outlined'>close</i>
                  </button>
                </Offcanvas.Header>
                <Offcanvas.Body>
                  <div className="Add-new-task-container">
                    <div className="op-offcanvas-body-container">
                      <Form.Group
                        className="form-group"
                        controlId="exampleForm.ControlInput1"
                      >
                        <Form.Label>Task Name</Form.Label>
                        <div className="form-group">
                          <Form.Control type="text" placeholder="Enter task name"
                            {...taskFormData.getFieldProps("task_name")}
                            maxLength={MAX_50}
                            onBlur={() => {
                              handleBlurValueUpdate("task_name");
                            }}
                          />
                          {
                            taskFormData.touched.task_name && taskFormData.errors.task_name
                              ? renderError(taskFormData.errors.task_name)
                              : null
                          }
                        </div>
                      </Form.Group>
                      <Form.Group className="form-group">
                        <Form.Label>Due Date</Form.Label>
                        <div className="react-datepicker-container form-group-icon-end">
                          <i className="material-symbols-outlined control-icon">calendar_month</i>
                          <DatePicker
                            dropdownMode="select"
                            isClearable={true}
                            dateFormat="dd-MM-yyyy h:mm aa"
                            // showTimeSelect
                            // timeFormat="hh:mm aa"
                            className="form-control"
                            popperProps={{ strategy: "fixed" }}
                            // placeholderText="10-03-2025 12:17 AM"
                            selected={taskFormData.values.due_date ? new Date(taskFormData.values.due_date) : null}
                            onChange={(date) => {
                              taskFormData.setFieldValue("due_date", date);
                            }
                            }
                          />
                        </div>
                        {
                          taskFormData.touched.due_date && taskFormData.errors.due_date
                            ? renderError(taskFormData.errors.due_date)
                            : null
                        }
                      </Form.Group>
                      <Form.Group
                        className="form-group"
                        controlId="exampleForm.ControlInput1"
                      >
                        <Form.Label>Note</Form.Label>
                        <div className="form-group">
                          <Form.Control as="textarea" rows={3} placeholder="Enter note"
                            {...taskFormData.getFieldProps("note")}
                            maxLength={MAX_300}
                            onBlur={() => {
                              handleBlurValueUpdate("note");
                            }}
                          />
                          {
                            taskFormData.touched.note && taskFormData.errors.note
                              ? renderError(taskFormData.errors.note)
                              : null
                          }
                        </div>
                      </Form.Group>
                      <div className="Reminder-box">
                        <div className="title-with-switch">
                          <div className="title-text"><h4>Reminder (Notify me before start date)</h4></div>
                          <div className="switch-box ">
                            <label className="switch" htmlFor="switch">
                              <input type="checkbox" id='switch'
                                checked={taskFormData?.values?.is_reminder}
                                onChange={() => { addReminder(!taskFormData.values.is_reminder) }}
                              />
                              <div className="slider round"></div>
                            </label>
                          </div>
                        </div>
                        {
                          taskFormData?.values.is_reminder && !isEmptyObjectOrNullUndefiend(taskFormData?.values.reminder) &&
                          <>
                            {
                              taskFormData?.values?.reminder?.map((item: any, index: number) => {
                                return (
                                  <>
                                    <div className="remider-fields" key={index}>
                                      <Form.Group className='form-group'>
                                        <Form.Label>Unit</Form.Label>
                                        <Select
                                          options={reminderUnitDropDownData}
                                          placeholder={<div>Days</div>}
                                          menuPosition="fixed"
                                          className="react-select-container"
                                          onChange={(selectedOption: any) => {
                                            taskFormData.setFieldValue(
                                              `reminder.${index}.unit`, selectedOption.value)
                                          }}
                                          value={reminderUnitDropDownData?.filter(({ value }) => {
                                            return (
                                              value ===
                                              // searchByCustomer
                                              taskFormData?.values?.reminder?.[index]?.unit
                                            );
                                          })}
                                        />
                                        {(taskFormData?.touched?.reminder?.[index]?.unit as any) &&
                                          (taskFormData?.errors?.reminder?.[index]?.unit as any) &&
                                          renderError((taskFormData?.errors?.reminder?.[index] as any)?.unit)}


                                      </Form.Group>
                                      <Form.Group className="form-group" controlId="exampleForm.ControlInput1">
                                        <Form.Label>Value</Form.Label>
                                        <Form.Control type="text" placeholder="Enter Value"
                                          {...taskFormData.getFieldProps(`reminder.${index}.value`)}
                                          // onChange={(e) => {
                                          //   console.log(taskFormData.values.remider);
                                          // }}
                                          maxLength={MAX_3}
                                          onBlur={() => {
                                            taskFormData.setFieldTouched(
                                              `reminder.${index}.value`,
                                              true
                                            );
                                            // handleBlurValueUpdate(`reminder.${index}.value`);
                                          }}


                                        />
                                        {(taskFormData?.touched?.reminder?.[index]?.value as any) &&
                                          (taskFormData?.errors?.reminder?.[index]?.value as any) &&
                                          renderError((taskFormData?.errors?.reminder?.[index] as any)?.value)}
                                      </Form.Group>
                                      {
                                        taskFormData?.values?.reminder?.length > 1 ?
                                          <button type="button" className="btn btn-light-danger" onClick={() => { removeReminder(index) }}>
                                            <i className="material-symbols-outlined">delete</i>
                                          </button> : null
                                      }

                                    </div>

                                  </>
                                )
                              }
                              )
                            }
                            < div className="add-remider-filed-button">
                              <Button variant='warning' className='btn-icon btn-icon-text' onClick={() => { appendReminder() }}> <i className="material-symbols-outlined">add</i></Button>
                            </div>
                          </>
                        }
                        {/* <div className="remider-fields">
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
                          <button type="button" className="btn btn-light-danger">
                            <i className="material-symbols-outlined">delete</i>
                          </button>
                        </div>
                        <div className="remider-fields">
                          <Form.Group className='form-group'>
                            <Form.Label>Unit</Form.Label>
                            <Select
                              placeholder={<div>Hours</div>}
                              menuPosition="fixed"
                              className="react-select-container"
                            />
                          </Form.Group>
                          <Form.Group className="form-group" controlId="exampleForm.ControlInput1">
                            <Form.Label>Value</Form.Label>
                            <Form.Select aria-label="Default select example">
                              <option>1</option>
                              <option value="1">1</option>
                              <option value="2">2</option>
                              <option value="3">3</option>
                            </Form.Select>
                          </Form.Group>
                          <button type="button" className="btn btn-light-danger">
                            <i className="material-symbols-outlined">delete</i>
                          </button>
                        </div>
                        <div className="add-remider-filed-button">
                          <Button variant='warning' className='btn-icon btn-icon-text'> <i className="material-symbols-outlined">add</i></Button>
                        </div> */}
                      </div>
                    </div>
                    <div className="bottom-button-group">
                      <Button type="button" className="btn btn-light-white me-auto" onClick={() => { handleCloseAddNewCourse() }}>
                        Cancel
                      </Button>
                      <Button type="button" className="btn btn-light-white" onClick={() => { taskFormData.resetForm(); setSavedtaskFormData(initFormValues) }}>
                        Clear
                      </Button>
                      <Button type="button" className="btn btn-primary" onClick={handleSubmitTaskFormData}>
                        Save
                      </Button>
                    </div>
                  </div>
                </Offcanvas.Body>
              </Offcanvas>
            </div>
            {/***** Offcanvas end *****/}


            {/* Delete Modal */}
            <Modal
              className="modal-theme modal-confirmation modal-reject"
              show={deleteShow}
              onHide={handleDeleteClose}
              centered
            >
              <Modal.Header>
                <h4 className="modal-title">Delete Task</h4>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleDeleteClose}
                >
                  <i className='material-symbols-outlined'>close</i>
                </button>
              </Modal.Header>
              <Modal.Body>
                <div className="modal-confirmation-container">
                  <div className="modal-confirmation-icon">
                    <i className="material-symbols-outlined">delete</i>
                  </div>
                  <div className="modal-confirmation-content">
                    <h5>Want to Delete?</h5>
                    <p>
                      Are you sure, you want to delete this task ?
                    </p>
                  </div>
                </div>
                <div className="modal-button-group modal-full-width-btn modal-footer-button">
                  <Button
                    variant="light-white"
                    className="btn-md"
                    onClick={handleDeleteClose}
                  >
                    {" "}
                    No, Change My Mind
                  </Button>
                  <Button
                    variant="danger"
                    className="btn-icon-text btn-md"
                    onClick={handleDeleteClose}
                  >
                    Delete
                  </Button>
                </div>
              </Modal.Body>
            </Modal>
            {/* Delete Modal */}

            {/* Compated Delete Modal */}
            <Modal
              className="modal-theme modal-confirmation modal-reject"
              show={SuccessDeleteShow}
              onHide={handleSuccessDeleteClose}
              centered
            >
              <Modal.Header>
                <h4 className="modal-title">Task Deleted!</h4>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleSuccessDeleteClose}
                >
                  <i className='material-symbols-outlined'>close</i>
                </button>
              </Modal.Header>
              <Modal.Body>
                <div className="modal-confirmation-container">
                  <div className="modal-confirmation-icon">
                    <i className="material-symbols-outlined">delete</i>
                  </div>
                  <div className="modal-confirmation-content">
                    <h5>You have successfully
                      deleted Task!</h5>
                    <p>
                      Get back to task page to add or complete the other task
                    </p>
                  </div>
                </div>
                <div className="modal-button-group modal-full-width-btn modal-footer-button">
                  <Button
                    variant="success"
                    className="btn-icon-text btn-md"
                    onClick={handleSuccessDeleteClose}
                  >
                    Done
                  </Button>
                </div>
              </Modal.Body>
            </Modal>
            {/* Delete Modal */}


            {/* Success Modal */}
            <Modal className='modal-theme modal-confirmation modal-approve' show={SuccessShow} onHide={handleSuccessClose} centered>
              <Modal.Header >
                <h4 className="modal-title">Task Completed!</h4>
                <button type="button" className="btn-close" onClick={handleSuccessClose}>
                  <i className='material-symbols-outlined'>close</i>
                </button>
              </Modal.Header>
              <Modal.Body>
                <div className="modal-confirmation-container">
                  <div className="modal-confirmation-icon">
                    <i className="material-symbols-outlined">mood</i>
                  </div>
                  <div className="modal-confirmation-content">
                    <h5>You have successfully
                      completed  Task!</h5>
                    <p>Get back to task page to add or complete the other task</p>
                  </div>
                </div>
                <div className="modal-button-group modal-full-width-btn modal-footer-button">
                  <Button variant="success"
                    className="btn-icon-text btn-md" onClick={handleSuccessClose}> Done
                  </Button>
                </div>
              </Modal.Body>
            </Modal>
            {/* Success Modal */}
          </div>
        </div>
      </div >
    </>
  );
};
const mapStateToProps = (state) => ({
  data: state?.TaskReducer?.taskList
})

const mapDispatchToProps = {
  addEditTaskAPI,
  taskListingAPI
}

export default connect(mapStateToProps, mapDispatchToProps)(Task)

