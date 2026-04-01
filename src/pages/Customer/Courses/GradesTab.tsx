import React, { useState } from 'react'
import { useGradingPolicy, useGradeSummary, useEventsWorth } from '../../../hooks/queries/useGrades'
import WhatIfSimulator from '../../../components/Grades/WhatIfSimulator'
import NeededScoreCalculator from '../../../components/Grades/NeededScoreCalculator'
import PolicyEditor from '../../../components/Grades/PolicyEditor'
import '../../../styles/grades.css'

interface GradesTabProps {
  selectedSyllabusObj: { id: number | string } | null;
}

type ActiveView = 'dashboard' | 'whatif' | 'needed' | 'editor'

const RING_RADIUS = 58
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS

const getGradeColor = (percent: number | null): string => {
  if (percent === null) return 'var(--neutral-300)'
  if (percent >= 90) return '#22c55e'
  if (percent >= 80) return '#3b82f6'
  if (percent >= 70) return '#f59e0b'
  if (percent >= 60) return '#f97316'
  return '#ef4444'
}

const GradesTab: React.FC<GradesTabProps> = ({ selectedSyllabusObj }) => {
  const syllabusId = selectedSyllabusObj?.id
  const [activeView, setActiveView] = useState<ActiveView>('dashboard')

  const { data: policyData, isLoading: policyLoading } = useGradingPolicy(syllabusId)
  const { data: summaryData, isLoading: summaryLoading } = useGradeSummary(syllabusId)
  useEventsWorth(syllabusId)

  const isLoading = policyLoading || summaryLoading

  if (activeView !== 'dashboard') {
    return (
      <div className="grades-subview">
        <button
          type="button"
          className="grades-back-btn"
          onClick={() => setActiveView('dashboard')}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back to Grade Summary
        </button>
        {activeView === 'whatif' && syllabusId && <WhatIfSimulator syllabusId={syllabusId} />}
        {activeView === 'needed' && syllabusId && <NeededScoreCalculator syllabusId={syllabusId} />}
        {activeView === 'editor' && syllabusId && (
          <PolicyEditor syllabusId={syllabusId} onSave={() => setActiveView('dashboard')} />
        )}
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="grades-tab">
        <div className="grades-loading">
          <div className="grades-spinner" />
          <span>Loading grade data...</span>
        </div>
      </div>
    )
  }

  const hasPolicy = policyData !== null && policyData !== undefined
  const currentPercent = summaryData?.current_percent ?? null
  const letterGrade = summaryData?.letter_grade ?? null
  const hasSufficientData = summaryData?.has_sufficient_data ?? false
  const completeness = summaryData?.data_completeness ?? 0
  const categories = summaryData?.category_breakdown ?? []
  const warnings = summaryData?.warnings ?? []
  const gradeColor = getGradeColor(currentPercent)

  const ringOffset =
    currentPercent !== null
      ? RING_CIRCUMFERENCE * (1 - currentPercent / 100)
      : RING_CIRCUMFERENCE

  return (
    <div className="grades-tab">
      {/* No policy - setup CTA */}
      {!hasPolicy && (
        <div className="grades-setup-cta">
          <div className="grades-setup-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              <line x1="12" y1="6" x2="12" y2="14" />
              <line x1="8" y1="10" x2="16" y2="10" />
            </svg>
          </div>
          <h3>Set Up Grade Tracking</h3>
          <p>Add your grading breakdown to track your course grade</p>
          <button
            type="button"
            className="grades-setup-btn"
            onClick={() => setActiveView('editor')}
          >
            Set Up Grading
          </button>
        </div>
      )}

      {/* Policy exists but not confirmed */}
      {hasPolicy && !policyData?.is_user_confirmed && (
        <div className="grades-review-banner">
          <div className="grades-review-banner-text">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            Your grading policy hasn't been reviewed yet
          </div>
          <button
            type="button"
            className="grades-review-btn"
            onClick={() => setActiveView('editor')}
          >
            Review Policy
          </button>
        </div>
      )}

      {/* Grade Overview */}
      <div className="grades-overview">
        <div className="grade-ring-container">
          <svg className="grade-ring-svg" viewBox="0 0 140 140">
            <circle
              className="grade-ring-bg"
              cx="70"
              cy="70"
              r={RING_RADIUS}
            />
            <circle
              className="grade-ring-progress"
              cx="70"
              cy="70"
              r={RING_RADIUS}
              stroke={gradeColor}
              strokeDasharray={RING_CIRCUMFERENCE}
              strokeDashoffset={ringOffset}
            />
          </svg>
          <div className="grade-ring-text">
            {currentPercent !== null ? (
              <>
                <div className="grade-ring-percent" style={{ color: gradeColor }}>
                  {currentPercent % 1 === 0 ? currentPercent : currentPercent.toFixed(1)}%
                </div>
                {letterGrade && <div className="grade-ring-letter">{letterGrade}</div>}
              </>
            ) : (
              <>
                <div className="grade-ring-empty">—</div>
                <div className="grade-ring-empty-text">Enter grades to see your score</div>
              </>
            )}
          </div>
        </div>

        <div className="grades-overview-stats">
          <h2>
            {hasSufficientData && currentPercent !== null
              ? `You're at ${currentPercent.toFixed(1)}%`
              : 'Your Course Grade'}
          </h2>
          <p className="grades-overview-subtitle">
            {hasSufficientData
              ? 'Based on your entered grades'
              : 'Enter more grades to get an accurate picture'}
          </p>

          {/* Completeness */}
          <div className="grades-completeness">
            <div className="completeness-header">
              <span className="completeness-label">Assignments graded</span>
              <span className="completeness-value">{Math.round(completeness * 100)}%</span>
            </div>
            <div className="completeness-bar">
              <div
                className="completeness-fill"
                style={{ width: `${Math.round(completeness * 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Warnings */}
      {warnings.length > 0 && (
        <div className="grades-warnings">
          {warnings.map((w, i) => (
            <div className="grades-warning" key={i}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {w}
            </div>
          ))}
        </div>
      )}

      {/* Category Breakdown */}
      {categories.length > 0 && (
        <div className="grades-categories">
          <h3 className="grades-section-title">Category Breakdown</h3>
          {categories.map((cat) => {
            const barColor = getGradeColor(cat.category_percent)
            return (
              <div className="category-item" key={cat.category_id}>
                <div className="category-header">
                  <span className="category-name">{cat.name}</span>
                  <span className="category-percent-value" style={{ color: barColor }}>
                    {cat.category_percent.toFixed(1)}%
                  </span>
                </div>
                <div className="category-bar">
                  <div
                    className="category-bar-fill"
                    style={{
                      width: `${Math.min(cat.category_percent, 100)}%`,
                      background: barColor,
                    }}
                  />
                </div>
                <div className="category-meta">
                  <span>
                    Contributes {(cat.weighted_contribution * 100).toFixed(1)}% to final grade
                  </span>
                  {cat.dropped_scores.length > 0 && (
                    <span className="category-dropped">
                      {cat.dropped_scores.length} lowest score{cat.dropped_scores.length > 1 ? 's' : ''} dropped
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Quick Actions */}
      {hasPolicy && (
        <div className="grades-actions">
          <button
            type="button"
            className="grades-action-btn"
            onClick={() => setActiveView('whatif')}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            What If...
          </button>
          <button
            type="button"
            className="grades-action-btn"
            onClick={() => setActiveView('needed')}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            What Do I Need?
          </button>
          <button
            type="button"
            className="grades-action-btn"
            onClick={() => setActiveView('editor')}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
            Edit Policy
          </button>
        </div>
      )}
    </div>
  )
}

export default GradesTab
