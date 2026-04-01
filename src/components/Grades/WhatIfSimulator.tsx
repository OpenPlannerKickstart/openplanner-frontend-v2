import React, { useState, useEffect, useCallback, useRef } from 'react'
import { useSimulateGrade, useEventsWorth } from '../../hooks/queries/useGrades'

interface WhatIfSimulatorProps {
  syllabusId: number | string;
}

const WhatIfSimulator: React.FC<WhatIfSimulatorProps> = ({ syllabusId }) => {
  const { data: worthData } = useEventsWorth(syllabusId)
  const simulation = useSimulateGrade(syllabusId)

  const [selectedEventId, setSelectedEventId] = useState<string>('')
  const [assumedScore, setAssumedScore] = useState<number>(0)
  const [maxScore, setMaxScore] = useState<number>(100)
  const debounceRef = useRef<ReturnType<typeof setTimeout>>()

  const assignments = worthData?.assignments?.filter(
    (a) => a.method !== 'insufficient_data'
  ) || []

  const handleEventChange = (eventId: string) => {
    setSelectedEventId(eventId)
    const selected = worthData?.assignments?.find(a => a.event_id === Number(eventId))
    setMaxScore(selected?.points_possible || 100)
    setAssumedScore(0)
    simulation.reset()
  }

  const runSimulation = useCallback(
    (score: number) => {
      if (!selectedEventId) return
      simulation.mutate({
        assignment_id: Number(selectedEventId),
        assumed_score: score,
        score_type: 'points',
      })
    },
    [selectedEventId, simulation]
  )

  useEffect(() => {
    if (!selectedEventId) return
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => runSimulation(assumedScore), 300)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [assumedScore, selectedEventId])

  const result = simulation.data
  const deltaClass = result
    ? result.delta > 0
      ? 'positive'
      : result.delta < 0
      ? 'negative'
      : 'neutral'
    : ''

  return (
    <div className="whatif-container">
      <h3>What-If Simulator</h3>
      <p>See how a hypothetical score affects your grade.</p>

      <div className="whatif-field">
        <label>Assignment</label>
        <select
          value={selectedEventId}
          onChange={(e) => handleEventChange(e.target.value)}
        >
          <option value="">Select an assignment...</option>
          {assignments.map((a) => (
            <option key={a.event_id} value={String(a.event_id)}>
              {a.title || `Event #${a.event_id}`}
              {a.worth_percent != null ? ` (worth ${a.worth_percent}%)` : ''}
            </option>
          ))}
        </select>
      </div>

      {selectedEventId && (
        <div className="whatif-field">
          <label>Hypothetical Score</label>
          <div className="whatif-slider-group">
            <input
              type="range"
              className="whatif-slider"
              min="0"
              max={maxScore}
              step="1"
              value={assumedScore}
              onChange={(e) => setAssumedScore(Number(e.target.value))}
            />
            <span className="whatif-slider-value">{assumedScore}/{maxScore}</span>
          </div>
        </div>
      )}

      {result && (
        <div className="whatif-result">
          <div className="whatif-result-row">
            <span className="whatif-result-label">Current Grade</span>
            <span className="whatif-result-value">
              {result.current_percent != null ? `${result.current_percent.toFixed(1)}%` : '—'}
            </span>
          </div>
          <div className="whatif-result-row">
            <span className="whatif-result-label">Projected Grade</span>
            <span className="whatif-result-value">
              {result.projected_percent.toFixed(1)}% ({result.projected_letter})
            </span>
          </div>
          <div className="whatif-result-row">
            <span className="whatif-result-label">Change</span>
            <span className={`whatif-delta ${deltaClass}`}>
              {result.delta > 0 ? '+' : ''}
              {result.delta.toFixed(1)}%
            </span>
          </div>
          {result.assignment_worth_percent != null && (
            <div className="whatif-result-sentence">
              This assignment is worth <strong>{result.assignment_worth_percent}%</strong> of your final grade.
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default WhatIfSimulator
