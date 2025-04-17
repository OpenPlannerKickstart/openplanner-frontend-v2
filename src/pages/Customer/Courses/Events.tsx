import React, { useEffect, useState } from 'react'
import { Badge, Button, Collapse, Modal, OverlayTrigger, Table, Tooltip } from 'react-bootstrap'
import { connect, useDispatch } from 'react-redux'
import { AppDispatch } from '../../../redux/store'
import { getEventListDataAPI } from '../../../redux/Service/User/Courses/courses'
import { ENUM_FOR_SYLLABUS_TAB } from '../../../interfaces/enum'

const Events = (props) => {
  const dispatch: AppDispatch = useDispatch();
  const [open, setOpen] = useState(false);

  // Deleted modal
  const [deleteShow, setDeleteShow] = useState(false);
  const handleDeleteClose = () => setDeleteShow(false);
  const handleDeleteShow = () => setDeleteShow(true);

  // Compated Deleted modal
  const [SuccessDeleteShow, setSuccessDeleteShow] = useState(false);
  const handleSuccessDeleteClose = () => setSuccessDeleteShow(false);
  const handleSuccessDeleteShow = () => setSuccessDeleteShow(true);

  const [SuccessShow, setSuccessShow] = useState(false);
  const handleSuccessClose = () => setSuccessShow(false);
  const handleSuccessShow = () => setSuccessShow(true);
  /* ------------------ handle Get Event List Data API Start ------------------ */
  const [eventListData,setEventListData] = useState([]);
  useEffect(() => {
    if (props?.selectedSyllabusObj?.id && props?.selectedTab === ENUM_FOR_SYLLABUS_TAB.EVENT_DETAILS) {
      getEventListData();
    }

    return () => {

    }
  }, [props?.selectedSyllabusObj?.id, props?.selectedTab])

  const getEventListData = async () => {

    const reqBody = {
      syllabus_id: props?.selectedSyllabusObj?.id
    }
    const response = await dispatch(getEventListDataAPI(reqBody));
    console.log(response, "Event List Data Response");
  }


  /* ------------------ handle Get Event List Data API End ------------------ */


  return (
    <>
      <div className="tab-body-container">
        <div className="event-main-wrapper">
          <div className="event-card">
            <div className="due-event-box">
              <div className="card-title">
                <h4>Due on Friday, March 7</h4>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <Table className="table-theme">
                    <thead className="border-less">
                      <tr>
                        <th>Event Name</th>
                        <th>Time</th>
                        <th className="text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          <div className="event-name-tooltip">
                            <div className="enevt-name"><h3>Innovative Approaches to Modern Education</h3></div>
                            <div className="event-tool">
                              <Badge bg="danger-bg"><i className="material-symbols-outlined">book_2</i>TCU Academic Calendar</Badge>
                            </div>
                          </div>
                        </td>
                        <td>4:40 PM - 4:40 PM</td>
                        <td className="tbl-action">
                          <div className="tbl-action-group">
                            <OverlayTrigger
                              trigger={["hover", "hover"]}
                              placement="bottom"
                              overlay={<Tooltip>Add User</Tooltip>}
                            >
                              <button
                                className="btn btn-xs btn-icon btn-transparent check-icon" onClick={handleSuccessShow}
                              >
                                {" "}
                                <i className="material-symbols-outlined">check_circle</i>
                              </button>
                            </OverlayTrigger>
                            <OverlayTrigger
                              trigger={["hover", "hover"]}
                              placement="bottom"
                              overlay={<Tooltip>Add User</Tooltip>}
                            >
                              <button className="btn btn-xs btn-icon btn-transparent text-danger" onClick={handleDeleteShow}>
                                {" "}
                                <i className="material-symbols-outlined">delete</i>
                              </button>
                            </OverlayTrigger>
                          </div>
                        </td>
                      </tr>
                      <tr className='active-table'>
                        <td>
                          <div className="event-name-tooltip">
                            <div className="enevt-name"><h3>Innovative Approaches to Modern Education</h3></div>
                            <div className="event-tool">
                              <Badge bg="primary-bg"><i className="material-symbols-outlined">book_2</i>History Unfolded</Badge>
                            </div>
                          </div>
                        </td>
                        <td>4:40 PM - 4:40 PM</td>
                        <td className="tbl-action">
                          <div className="tbl-action-group">
                            <OverlayTrigger
                              trigger={["hover", "hover"]}
                              placement="bottom"
                              overlay={<Tooltip>Add User</Tooltip>}
                            >
                              <button
                                className="btn btn-xs btn-icon btn-transparent check-icon" onClick={handleSuccessShow}
                              >
                                {" "}
                                <i className="material-symbols-outlined">check_circle</i>
                              </button>
                            </OverlayTrigger>
                            <OverlayTrigger
                              trigger={["hover", "hover"]}
                              placement="bottom"
                              overlay={<Tooltip>Add User</Tooltip>}
                            >
                              <button className="btn btn-xs btn-icon btn-transparent text-danger" onClick={handleDeleteShow}>
                                {" "}
                                <i className="material-symbols-outlined">delete</i>
                              </button>
                            </OverlayTrigger>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </div>
              </div>
            </div>
          </div>
          <div className="event-card">
            <div className="due-event-box">
              <div className="card-title">
                <h4>Due on Friday, March 7</h4>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <Table className="table-theme">
                    <thead className="border-less">
                      <tr>
                        <th>Event Name</th>
                        <th>Time</th>
                        <th className="text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          <div className="event-name-tooltip">
                            <div className="enevt-name"><h3>Innovative Approaches to Modern Education</h3></div>
                            <div className="event-tool">
                              <Badge bg="danger-bg"><i className="material-symbols-outlined">book_2</i>TCU Academic Calendar</Badge>
                            </div>
                          </div>
                        </td>
                        <td>4:40 PM - 4:40 PM</td>
                        <td className="tbl-action">
                          <div className="tbl-action-group">
                            <OverlayTrigger
                              trigger={["hover", "hover"]}
                              placement="bottom"
                              overlay={<Tooltip>Add User</Tooltip>}
                            >
                              <button
                                className="btn btn-xs btn-icon btn-transparent check-icon" onClick={handleSuccessShow}
                              >
                                {" "}
                                <i className="material-symbols-outlined">check_circle</i>
                              </button>
                            </OverlayTrigger>
                            <OverlayTrigger
                              trigger={["hover", "hover"]}
                              placement="bottom"
                              overlay={<Tooltip>Add User</Tooltip>}
                            >
                              <button className="btn btn-xs btn-icon btn-transparent text-danger" onClick={handleDeleteShow}>
                                {" "}
                                <i className="material-symbols-outlined">delete</i>
                              </button>
                            </OverlayTrigger>
                          </div>
                        </td>
                      </tr>
                      <tr className='active-table'>
                        <td>
                          <div className="event-name-tooltip">
                            <div className="enevt-name"><h3>Innovative Approaches to Modern Education</h3></div>
                            <div className="event-tool">
                              <Badge bg="primary-bg"><i className="material-symbols-outlined">book_2</i>History Unfolded</Badge>
                            </div>
                          </div>
                        </td>
                        <td>4:40 PM - 4:40 PM</td>
                        <td className="tbl-action">
                          <div className="tbl-action-group">
                            <OverlayTrigger
                              trigger={["hover", "hover"]}
                              placement="bottom"
                              overlay={<Tooltip>Add User</Tooltip>}
                            >
                              <button
                                className="btn btn-xs btn-icon btn-transparent check-icon" onClick={handleSuccessShow}
                              >
                                {" "}
                                <i className="material-symbols-outlined">check_circle</i>
                              </button>
                            </OverlayTrigger>
                            <OverlayTrigger
                              trigger={["hover", "hover"]}
                              placement="bottom"
                              overlay={<Tooltip>Add User</Tooltip>}
                            >
                              <button className="btn btn-xs btn-icon btn-transparent text-danger" onClick={handleDeleteShow}>
                                {" "}
                                <i className="material-symbols-outlined">delete</i>
                              </button>
                            </OverlayTrigger>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </div>
              </div>
            </div>
          </div>
          <div className="event-card">
            <div className="due-event-box post-event">
              <div className="card-title">
                <Button className='event-collapes-btn'
                  onClick={() => setOpen(!open)}
                  aria-controls="example-collapse-text"
                  aria-expanded={open}
                >
                  Past Events
                  <button className="btn btn-xs btn-icon btn-transparent collapes-btn"><i className="material-symbols-outlined">keyboard_arrow_right</i></button>
                </Button>
              </div>
              <div className="card-body">
                <Collapse in={open}>
                  <div id="example-collapse-text">
                    <div className="table-responsive">
                      <Table className="table-theme">
                        <thead className="border-less">
                          <tr>
                            <th>Event Name</th>
                            <th>Time</th>
                            <th className="text-center">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className='active-table'>
                            <td>
                              <div className="event-name-tooltip">
                                <div className="enevt-name"><h3>Innovative Approaches to Modern Education</h3></div>
                                <div className="event-tool">
                                  <Badge bg="primary-bg"><i className="material-symbols-outlined">book_2</i>History Unfolded</Badge>
                                </div>
                              </div>
                            </td>
                            <td>4:40 PM - 4:40 PM</td>
                            <td className="tbl-action">
                              <div className="tbl-action-group">
                                <OverlayTrigger
                                  trigger={["hover", "hover"]}
                                  placement="bottom"
                                  overlay={<Tooltip>Add User</Tooltip>}
                                >
                                  <button
                                    className="btn btn-xs btn-icon btn-transparent check-icon" onClick={handleSuccessShow}
                                  >
                                    {" "}
                                    <i className="material-symbols-outlined">check_circle</i>
                                  </button>
                                </OverlayTrigger>
                                <OverlayTrigger
                                  trigger={["hover", "hover"]}
                                  placement="bottom"
                                  overlay={<Tooltip>Add User</Tooltip>}
                                >
                                  <button className="btn btn-xs btn-icon btn-transparent text-danger" onClick={handleDeleteShow}>
                                    {" "}
                                    <i className="material-symbols-outlined">delete</i>
                                  </button>
                                </OverlayTrigger>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <div className="event-name-tooltip">
                                <div className="enevt-name"><h3>Innovative Approaches to Modern Education</h3></div>
                                <div className="event-tool">
                                  <Badge bg="danger-bg"><i className="material-symbols-outlined">book_2</i>TCU Academic Calendar</Badge>
                                </div>
                              </div>
                            </td>
                            <td>4:40 PM - 4:40 PM</td>
                            <td className="tbl-action">
                              <div className="tbl-action-group">
                                <OverlayTrigger
                                  trigger={["hover", "hover"]}
                                  placement="bottom"
                                  overlay={<Tooltip>Add User</Tooltip>}
                                >
                                  <button
                                    className="btn btn-xs btn-icon btn-transparent check-icon" onClick={handleSuccessShow}
                                  >
                                    {" "}
                                    <i className="material-symbols-outlined">check_circle</i>
                                  </button>
                                </OverlayTrigger>
                                <OverlayTrigger
                                  trigger={["hover", "hover"]}
                                  placement="bottom"
                                  overlay={<Tooltip>Add User</Tooltip>}
                                >
                                  <button className="btn btn-xs btn-icon btn-transparent text-danger" onClick={handleDeleteShow}>
                                    {" "}
                                    <i className="material-symbols-outlined">delete</i>
                                  </button>
                                </OverlayTrigger>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </Table>
                    </div>
                  </div>
                </Collapse>
              </div>
            </div>
          </div>

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
                <i className="material-symbols-outlined">close</i>
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
                <i className="material-symbols-outlined">close</i>
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
                <i className="material-symbols-outlined">close</i>
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
    </>
  )
}

const mapStateToProps = (state) => ({})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(Events)