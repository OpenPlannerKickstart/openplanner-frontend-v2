import React, { useState } from 'react'
import { useNeededScore, useGradingPolicy, useEventsWorth } from '../../hooks/queries/useGrades'
import { STANDARD_GRADE_ORDER, DETAILED_GRADE_ORDER } from '../../constants/grades'

interface NeededScoreCalculatorProps {
  syllabusId: number | string;
}

const NeededScoreCalculator: React.FC<NeededScoreCalculatorProps> = ({ syllabusId }) => {
  const { data: policyData } = useGradingPolicy(syllabusId)
  const { data: worthData } = useEventsWorth(syllabusId)
  const neededScore = useNeededScore(syllabusId)

  const [selectedEventId, setSelectedEventId] = useState<string>('')
  const [targetPercent, setTargetPercent] = useState<number | null>(null)
  const [customPercent, setCustomPercent] = useState<string>('')

  const scale = policyData?.grading_scale || { A: 90, B: 80, C: 70, D: 60 }
  const isDetailed = Object.keys(scale).some((k) => k.includes('+') || k.includes('-'))
  const gradeOrder = isDetailed ? DETAILED_GRADE_ORDER : STANDARD_GRADE_ORDER
  const gradeLetters: [string, number][] = gradeOrder
    .filter((letter) => letter in scale)
    .map((letter) => [letter, scale[letter]])

  const ungradedAssignments = worthData?.assignments?.filter(
    (a) => a.method !== 'insufficient_data'
  ) || []

  const handleLetterClick = (letter: string, minPercent: number) => {
    setTargetPercent(minPercent)
    setCustomPercent('')
  }

  const handleCustomChange = (val: string) => {
    setCustomPercent(val)
    const num = parseFloat(val)
    if (!isNaN(num)) {
      setTargetPercent(Math.min(100, Math.max(0, num)))
    }
  }

  const handleCalculate = () => {
    if (!selectedEventId || targetPercent === null) return
    neededScore.mutate({
      assignment_id: Number(selectedEventId),
      desired_grade_percent: targetPercent,
    })
  }

  const result = neededScore.data

  return (
    <div className="needed-container">
      <h3>What Do I Need?</h3>
      <p>Find out what score you need on an assignment to reach your target grade.</p>

      <div className="needed-field">
        <label>Target Grade</label>
        <div className="needed-grade-buttons">
          {gradeLetters.map(([letter, minPct]) => (
            <button
              key={letter}
              type="button"
              className={`needed-grade-btn ${targetPercent === minPct && !customPercent ? 'active' : ''}`}
              onClick={() => handleLetterClick(letter, minPct)}
            >
              {letter}
            </button>
          ))}
          <input
            type="number"
            min="0"
            max="100"
            step="1"
            placeholder="Custom"
            value={customPercent}
            onChange={(e) => handleCustomChange(e.target.value)}
            className="needed-grade-btn needed-custom-input"
          />
        </div>
      </div>

      <div className="needed-field">
        <label>Assignment</label>
        <select
          value={selectedEventId}
          onChange={(e) => setSelectedEventId(e.target.value)}
        >
          <option value="">Select an assignment...</option>
          {ungradedAssignments.map((a) => (
            <option key={a.event_id} value={String(a.event_id)}>
              {a.title || `Event #${a.event_id}`}
              {a.worth_percent != null ? ` (worth ${a.worth_percent}%)` : ''}
            </option>
          ))}
        </select>
      </div>

      <button
        type="button"
        className="needed-calculate-btn"
        onClick={handleCalculate}
        disabled={!selectedEventId || targetPercent === null || neededScore.isPending}
      >
        {neededScore.isPending ? 'Calculating...' : 'Calculate'}
      </button>

      {result && (
        <div className={`needed-result ${result.is_achievable ? 'achievable' : 'not-achievable'}`}>
          <p className="needed-result-text">{result.explanation}</p>
        </div>
      )}
    </div>
  )
}

export default NeededScoreCalculator
