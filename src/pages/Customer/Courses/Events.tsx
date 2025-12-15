import React, { useEffect, useState } from 'react'
import { Button, Modal } from 'react-bootstrap'
import { connect, useDispatch } from 'react-redux'
import { AppDispatch } from '../../../redux/store'
import {
  deleteEventDataAPI,
  getEventListDataAPI,
  updateEventStatusDataAPI,
} from '../../../redux/Service/User/Courses/courses'
import { ENUM_FOR_SYLLABUS_TAB, ENUMFORSTATUS } from '../../../interfaces/enum'
import { EventResponseType } from '../../../interfaces/interface'
import {
  formatedDate,
  isEmptyObjectOrNullUndefiend,
  isNullUndefinedOrBlank,
} from '../../../Utility/Helper'
import { NO_END_DATE_ADDED, NO_START_DATE_ADDED } from '../../../Utility/Validation_Message'
import notVoucherFound from '/assets/images/not-voucher-found.svg'
import { isUpdatedEvent } from '../../../redux/User/Courses/coursesSlice'

const Events = (props: any) => {
  const dispatch: AppDispatch = useDispatch()
  const [open, setOpen] = useState(false)

  const [eventListData, setEventListData] = useState<EventResponseType>({} as EventResponseType)

  useEffect(() => {
    if (props?.selectedSyllabusObj?.id && props?.selectedTab === ENUM_FOR_SYLLABUS_TAB.EVENT_DETAILS) {
      void getEventListData()
    }
    return () => {
      setTimeout(() => {
        setEventListData({} as EventResponseType)
      }, 200)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props?.selectedSyllabusObj?.id, props?.selectedTab])

  const getEventListData = async () => {
    const reqBody = { syllabus_id: props?.selectedSyllabusObj?.id }
    const response = await dispatch(getEventListDataAPI(reqBody))
    if (response) setEventListData(response?.payload)
  }

  // Delete modal
  const [deleteShow, setDeleteShow] = useState(false)
  const [selectedEventObj, setSelectedEventObj] = useState<any>(null)

  const handleDeleteClose = () => {
    setDeleteShow(false)
    setTimeout(() => setSelectedEventObj(null), 300)
  }

  const handleDeleteShow = (data: any) => {
    setDeleteShow(true)
    setSelectedEventObj(data)
  }

  const handleDeleteData = async (eventId: any) => {
    const event_id = eventId instanceof Array ? eventId : [eventId]
    const reqBody = { event_id }
    const response = await dispatch(deleteEventDataAPI(reqBody))
    if (!isNullUndefinedOrBlank(response?.payload)) {
      await getEventListData()
      handleDeleteClose()
    }
  }

  // Event complete
  const [successShow, setSuccessShow] = useState(false)
  const handleSuccessClose = () => {
    setSuccessShow(false)
    setEventStatus(null)
  }
  const [eventStatus, setEventStatus] = useState<any>(null)

  const handleEventCompleted = async (id: any, status: any) => {
    const event_id = id instanceof Array ? id : [id]
    const reqBody = {
      event_id,
      status: status === ENUMFORSTATUS.COMPLETED ? ENUMFORSTATUS.PENDING : ENUMFORSTATUS.COMPLETED,
    }
    const response = await dispatch(updateEventStatusDataAPI(reqBody))
    if (!isNullUndefinedOrBlank(response?.payload)) {
      await getEventListData()
      await dispatch(isUpdatedEvent(true))
      setEventStatus(status)
      // handleSuccessShow();
    }
  }

  useEffect(() => {
    if (!isEmptyObjectOrNullUndefiend(props?.eventData)) {
      setEventListData(props?.eventData)
    } else {
      setEventListData({} as EventResponseType)
    }
  }, [props?.eventData])

  const getPriorityKey = (priority?: string) => {
    if (!priority) return 'low'
    const p = String(priority).toLowerCase()
    if (p === 'high' || p === 'medium' || p === 'low') return p
    return 'low'
  }

  // Map hex → token used by courses.css hover tints
  const getColorTokenFromHex = (hex?: string) => {
    if (!hex || typeof hex !== 'string' || !hex.startsWith('#') || hex.length !== 7) return 'cyan'
    const normalized = hex.toLowerCase()
    const map: Record<string, string> = {
      '#f59e0b': 'yellow',
      '#f97316': 'orange',
      '#22c55e': 'green',
      '#14b8a6': 'teal',
      '#84cc16': 'lime',
      '#239bc2': 'cyan',
      '#ef4444': 'red',
      '#3b82f6': 'blue',
      '#8b5cf6': 'purple',
      '#ec4899': 'pink',
      '#6b7280': 'gray',
      '#78716c': 'stone',
      '#6366f1': 'indigo',
    }
    return map[normalized] || 'cyan'
  }

  const TrashIcon = ({ size = 18 }: { size?: number }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="3 6 5 6 21 6" />
      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <line x1="10" y1="11" x2="10" y2="17" />
      <line x1="14" y1="11" x2="14" y2="17" />
    </svg>
  )

  const CheckIcon = ({ size = 16 }: { size?: number }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )

  const ChevronIcon = ({ expanded }: { expanded: boolean }) => (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={{ transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)' }}
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  )

  const EventRow = ({ event, isPast }: { event: any; isPast?: boolean }) => {
    const status = event?.status
    const isCompleted = status === ENUMFORSTATUS.COMPLETED || status === 'Completed'
    const priorityKey = getPriorityKey(event?.priority)
    const courseColorHex = event?.course_color || event?.syllabus?.course_color
    const colorToken = getColorTokenFromHex(courseColorHex)

    // Time only (no date). Use `h:mm a` to avoid leading zero (e.g., 7:00 pm not 07:00 pm).
    const start = !isNullUndefinedOrBlank(event?.start_date)
      ? formatedDate(event?.start_date, 'h:mm a')
      : NO_START_DATE_ADDED
    const end = !isNullUndefinedOrBlank(event?.end_date)
      ? formatedDate(event?.end_date, 'h:mm a')
      : NO_END_DATE_ADDED

    return (
      <div
        className={`task-row clickable-event ${isCompleted ? 'completed' : ''}`}
        data-color={colorToken}
        role="button"
        tabIndex={0}
        onClick={() => props.handleSelectEvent(event)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            props.handleSelectEvent(event)
          }
        }}
      >
        <div className="col-actions">
          <button
            type="button"
            className={`task-checkbox ${isCompleted ? 'checked' : ''}`}
            aria-label={isCompleted ? 'Mark as pending' : 'Mark as completed'}
            onClick={(e) => {
              e.stopPropagation()
              void handleEventCompleted(event?.id, status)
            }}
          >
            {isCompleted ? <CheckIcon /> : null}
          </button>
        </div>

        <div className="col-time">
          <span className="time-indicator" style={{ background: courseColorHex || undefined }} />
          <span>
            {start} - {end}
          </span>
        </div>

        <div className="col-priority">
          <span className={`priority-badge ${priorityKey}`}>{event?.priority || ''}</span>
        </div>

        <div className="col-event" style={{ textDecoration: isCompleted ? 'line-through' : 'none' }}>
          {event?.title || ''}
        </div>

        <div className="col-delete">
          <button
            type="button"
            className="delete-btn"
            aria-label="Delete event"
            onClick={(e) => {
              e.stopPropagation()
              handleDeleteShow(event)
            }}
          >
            <TrashIcon />
          </button>
        </div>
      </div>
    )
  }

  const hasAnyEvents =
    !isEmptyObjectOrNullUndefiend(eventListData?.dueEventData) ||
    !isEmptyObjectOrNullUndefiend(eventListData?.pastEventData)

  return (
    <>
      <div className="edit-course-table-header">
        <div>ACTIONS</div>
        <div>TIME</div>
        <div>PRIORITY</div>
        <div>EVENT NAME</div>
        <div>ACTIONS</div>
      </div>

      {hasAnyEvents ? (
        <>
          {eventListData?.dueEventData?.map((group: any, idx: number) => (
            <div className="due-date-group" key={`due-${idx}`}>
              <div className="due-date-header">
                Due on {formatedDate(group?.due_date, 'DD, MMMM YYYY')}
              </div>
              {group?.eventData?.map((evt: any) => (
                <EventRow key={evt?.id} event={evt} />
              ))}
            </div>
          ))}

          {!isEmptyObjectOrNullUndefiend(eventListData?.pastEventData) ? (
            <div className="past-events-section">
              <button
                type="button"
                className={`past-events-toggle ${open ? 'expanded' : ''}`}
                onClick={() => setOpen(!open)}
                aria-expanded={open}
              >
                <span>Past Events</span>
                <ChevronIcon expanded={open} />
              </button>

              <div className={`past-events-content ${open ? 'expanded' : ''}`}>
                {eventListData?.pastEventData?.map((evt: any) => (
                  <EventRow key={evt?.id} event={evt} isPast />
                ))}
              </div>
            </div>
          ) : null}
        </>
      ) : (
        <div className="no-records-found no-records-found-inner h-100">
          <div className="no-records-found-image">
            <img src={notVoucherFound} alt="OpenPlaner" />
          </div>
          <div className="no-records-found-text">
            <h6>No data found!</h6>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      <Modal
        className="modal-theme modal-confirmation modal-reject"
        show={deleteShow}
        onHide={handleDeleteClose}
        centered
      >
        <Modal.Header>
          <h4 className="modal-title">Delete Event</h4>
          <button type="button" className="btn-close" onClick={handleDeleteClose}>
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
              <p>You want to delete this event ?</p>
            </div>
          </div>
          <div className="modal-button-group modal-full-width-btn modal-footer-button">
            <Button variant="light-white" className="btn-md" onClick={handleDeleteClose}>
              No, Change My Mind
            </Button>
            <Button
              variant="danger"
              className="btn-icon-text btn-md"
              onClick={() => handleDeleteData(selectedEventObj?.id)}
            >
              Delete
            </Button>
          </div>
        </Modal.Body>
      </Modal>

      {/* Success Modal */}
      <Modal
        className="modal-theme modal-confirmation modal-approve"
        show={successShow}
        onHide={handleSuccessClose}
        centered
      >
        <Modal.Header>
          <h4 className="modal-title">
            {eventStatus === ENUMFORSTATUS.PENDING ? 'Event Completed!' : 'Event Pending'}
          </h4>
          <button type="button" className="btn-close" onClick={handleSuccessClose}>
            <i className="material-symbols-outlined">close</i>
          </button>
        </Modal.Header>

        <Modal.Body>
          <div className="modal-confirmation-container">
            <div className="modal-confirmation-icon">
              <i className="material-symbols-outlined">
                {eventStatus === ENUMFORSTATUS.PENDING ? 'mood' : 'mood_bad'}
              </i>
            </div>
            <div className="modal-confirmation-content">
              {eventStatus === ENUMFORSTATUS.PENDING ? (
                <>
                  <h5>You have successfully completed the Event!</h5>
                  <p>Get back to the Event page to add or complete the other Event.</p>
                </>
              ) : (
                <>
                  <h5>Event is still Pending!</h5>
                  <p>Complete the event to move forward with the syllabus.</p>
                </>
              )}
            </div>
          </div>

          <div className="modal-button-group modal-full-width-btn modal-footer-button">
            <Button
              variant={eventStatus === ENUMFORSTATUS.PENDING ? 'success' : 'warning'}
              className="btn-icon-text btn-md"
              onClick={handleSuccessClose}
            >
              Done
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  )
}

const mapStateToProps = (state: any) => ({
  eventData: state?.CoursesReducer?.getEventListData,
})

export default connect(mapStateToProps)(Events)


