import React, { useState, useEffect } from 'react'
import { Modal, Button } from 'react-bootstrap'
import { useUpdateEventGrade } from '../../hooks/queries/useGrades'
import { GradingStatus, UpdateEventGradeRequest } from '../../interfaces/grades'

interface GradeEvent {
  id: number | string;
  title?: string;
  score_received?: number | null;
  points_possible?: number | null;
  grading_status?: GradingStatus;
}

interface ScoreEntryModalProps {
  show: boolean;
  onHide: () => void;
  syllabusId: number | string;
  event: GradeEvent | null;
  onSuccess?: () => void;
}

const ScoreEntryModal: React.FC<ScoreEntryModalProps> = ({ show, onHide, syllabusId, event, onSuccess }) => {
  const [scoreReceived, setScoreReceived] = useState<string>('')
  const [pointsPossible, setPointsPossible] = useState<string>('')
  const [gradingStatus, setGradingStatus] = useState<GradingStatus>('graded')
  const [validationError, setValidationError] = useState<string>('')

  const mutation = useUpdateEventGrade(syllabusId)

  useEffect(() => {
    if (show && event) {
      setScoreReceived(event.score_received != null ? String(event.score_received) : '')
      setPointsPossible(event.points_possible != null ? String(event.points_possible) : '')
      setGradingStatus(event.grading_status || 'graded')
    }
  }, [show, event])

  const pts = parseFloat(pointsPossible)
  const score = parseFloat(scoreReceived)
  const showOverMaxWarning = !isNaN(score) && !isNaN(pts) && pts > 0 && score > pts

  const handleSave = () => {
    setValidationError('')
    const s = parseFloat(scoreReceived)
    if (isNaN(s) || s < 0) {
      setValidationError('Please enter a valid score (0 or above)')
      return
    }

    const body: UpdateEventGradeRequest = {
      score_received: s,
      score_type: 'points',
      grading_status: gradingStatus,
    }

    const p = parseFloat(pointsPossible)
    if (!isNaN(p) && p > 0) {
      body.points_possible = p
    }

    mutation.mutate(
      { eventId: event!.id, body },
      {
        onSuccess: () => {
          onHide()
          onSuccess?.()
        },
      }
    )
  }

  return (
    <Modal className="modal-theme" show={show} onHide={onHide} centered>
      <Modal.Header>
        <h4 className="modal-title">Enter Grade</h4>
        <button type="button" className="btn-close" onClick={onHide}>
          <i className="material-symbols-outlined">close</i>
        </button>
      </Modal.Header>
      <Modal.Body>
        <div className="score-entry-form">
          <div className="score-entry-title">{event?.title || 'Assignment'}</div>

          <div className="score-entry-fields">
            <div className="score-entry-field">
              <label>Score Received</label>
              <input
                type="number"
                min="0"
                step="any"
                value={scoreReceived}
                onChange={(e) => { setScoreReceived(e.target.value); setValidationError('') }}
                placeholder="e.g. 88"
                autoFocus
              />
            </div>
            <div className="score-entry-divider">/</div>
            <div className="score-entry-field">
              <label>Points Possible</label>
              <input
                type="number"
                min="1"
                step="any"
                value={pointsPossible}
                onChange={(e) => setPointsPossible(e.target.value)}
                placeholder="e.g. 100"
              />
            </div>
          </div>

          {validationError && (
            <div className="score-entry-error">{validationError}</div>
          )}
          {showOverMaxWarning && !validationError && (
            <div className="score-entry-warning">Score exceeds points possible</div>
          )}

          <div className="score-entry-status">
            <label>Status</label>
            <div className="status-toggle">
              {(['planned', 'submitted', 'graded'] as GradingStatus[]).map((s) => (
                <button
                  key={s}
                  type="button"
                  className={`status-option ${gradingStatus === s ? 'active' : ''}`}
                  onClick={() => setGradingStatus(s)}
                >
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="modal-button-group modal-full-width-btn modal-footer-button">
          <Button variant="light-white" className="btn-md" onClick={onHide}>
            Cancel
          </Button>
          <Button
            variant="primary"
            className="btn-md"
            onClick={handleSave}
            disabled={mutation.isPending || !scoreReceived}
          >
            {mutation.isPending ? 'Saving...' : 'Save Grade'}
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  )
}

export default ScoreEntryModal
