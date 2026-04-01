import React from 'react'
import { Modal, Button } from 'react-bootstrap'
import { useGradingPolicy, useUpdateGradingPolicy } from '../../hooks/queries/useGrades'
import { STANDARD_GRADE_ORDER, DETAILED_GRADE_ORDER } from '../../constants/grades'

interface PolicyReviewModalProps {
  show: boolean;
  onHide: () => void;
  syllabusId: number | string;
  onEdit: () => void;
}

const PolicyReviewModal: React.FC<PolicyReviewModalProps> = ({ show, onHide, syllabusId, onEdit }) => {
  const { data: policyData } = useGradingPolicy(show ? syllabusId : undefined)
  const updatePolicy = useUpdateGradingPolicy(syllabusId)

  if (!policyData) {
    return (
      <Modal className="modal-theme" show={show} onHide={onHide} centered size="lg">
        <Modal.Body>
          <div className="grades-loading">
            <div className="grades-spinner" />
            <span>Loading grading policy...</span>
          </div>
        </Modal.Body>
      </Modal>
    )
  }

  const { effective_policy, confidence, citations, missing_fields, grading_method } = policyData
  const categories = effective_policy?.categories || []

  const confidenceLevel = confidence >= 0.7 ? 'high' : confidence >= 0.5 ? 'medium' : 'low'
  const confidenceLabel = confidenceLevel === 'high' ? 'High' : confidenceLevel === 'medium' ? 'Medium' : 'Low'

  const handleConfirm = () => {
    updatePolicy.mutate(
      {
        grading_method: effective_policy.grading_method,
        categories: categories.map((c) => ({
          id: c.id,
          name: c.name,
          weight: c.weight,
          drop_lowest: c.drop_lowest,
        })),
        grading_scale: policyData.grading_scale,
      },
      { onSuccess: () => onHide() }
    )
  }

  if (grading_method === 'unknown') {
    return (
      <Modal className="modal-theme" show={show} onHide={onHide} centered size="lg">
        <Modal.Header>
          <h4 className="modal-title">Grading Policy</h4>
          <button type="button" className="btn-close" onClick={onHide}>
            <i className="material-symbols-outlined">close</i>
          </button>
        </Modal.Header>
        <Modal.Body>
          <div className="policy-review-content">
            <div className="policy-review-header">
              <div className="policy-review-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              </div>
              <h4>We couldn't determine your grading breakdown</h4>
              <p>Want to enter it manually?</p>
            </div>
          </div>
          <div className="modal-button-group modal-full-width-btn modal-footer-button">
            <Button variant="light-white" className="btn-md" onClick={onHide}>Skip for Now</Button>
            <Button variant="primary" className="btn-md" onClick={onEdit}>Set Up Manually</Button>
          </div>
        </Modal.Body>
      </Modal>
    )
  }

  return (
    <Modal className="modal-theme" show={show} onHide={onHide} centered size="lg">
      <Modal.Header>
        <h4 className="modal-title">Grading Policy</h4>
        <button type="button" className="btn-close" onClick={onHide}>
          <i className="material-symbols-outlined">close</i>
        </button>
      </Modal.Header>
      <Modal.Body>
        <div className="policy-review-content">
          <div className="policy-review-header">
            <div className="policy-review-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <h4>We found your grading policy</h4>
            <p>Review the breakdown extracted from your syllabus</p>
          </div>

          <div className={`policy-review-confidence confidence-${confidenceLevel}`}>
            <span className="confidence-dot" />
            Confidence: {confidenceLabel} ({Math.round(confidence * 100)}%)
          </div>

          <div className="policy-review-categories">
            {categories.map((cat) => (
              <div className="policy-review-category" key={cat.id}>
                <span className="policy-review-cat-name">{cat.name}</span>
                <span className="policy-review-cat-weight">
                  {effective_policy.grading_method === 'weighted_categories'
                    ? `${Math.round(cat.weight * 100)}%`
                    : `${cat.points_possible ?? '—'} pts`}
                </span>
              </div>
            ))}
          </div>

          {policyData.grading_scale && Object.keys(policyData.grading_scale).length > 0 && (
            <div className="policy-review-scale">
              <div className="policy-review-scale-header">
                <span className="policy-review-scale-title">Grading Scale</span>
                <span className="policy-review-scale-type">
                  {Object.keys(policyData.grading_scale).some(k => k.includes('+') || k.includes('-'))
                    ? 'Detailed (+/-)'
                    : 'Standard'}
                </span>
              </div>
              <div className={`policy-review-scale-grid ${
                Object.keys(policyData.grading_scale).some(k => k.includes('+') || k.includes('-'))
                  ? 'detailed' : ''
              }`}>
                {(Object.keys(policyData.grading_scale).some(k => k.includes('+') || k.includes('-'))
                  ? DETAILED_GRADE_ORDER
                  : STANDARD_GRADE_ORDER
                )
                  .filter(letter => letter in policyData.grading_scale!)
                  .map(letter => (
                    <div className="policy-review-scale-item" key={letter}>
                      <span className="policy-review-scale-letter">{letter}</span>
                      <span className="policy-review-scale-value">{policyData.grading_scale![letter]}%</span>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {citations.length > 0 && (
            <div className="policy-review-citations">
              {citations.slice(0, 3).map((c, i) => (
                <div className="policy-review-citation" key={i}>
                  "{c.text}"
                </div>
              ))}
            </div>
          )}

          {missing_fields.length > 0 && (
            <div className="policy-review-missing">
              {missing_fields.map((field, i) => (
                <div className="policy-review-missing-item" key={i}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  Couldn't determine: {field}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="modal-button-group modal-full-width-btn modal-footer-button">
          <Button variant="light-white" className="btn-md" onClick={onEdit}>
            Edit
          </Button>
          <Button
            variant="primary"
            className="btn-md"
            onClick={handleConfirm}
            disabled={updatePolicy.isPending}
          >
            {updatePolicy.isPending ? 'Saving...' : 'Looks Good'}
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  )
}

export default PolicyReviewModal
