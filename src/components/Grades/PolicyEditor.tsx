import React, { useState, useEffect } from 'react'
import { useGradingPolicy, useUpdateGradingPolicy } from '../../hooks/queries/useGrades'
import { GradingMethod, GradingCategory, GradingScale } from '../../interfaces/grades'
import { ScaleType, STANDARD_SCALE, STANDARD_GRADE_ORDER, DETAILED_GRADE_ORDER, detectScaleType } from '../../constants/grades'

interface PolicyEditorProps {
  syllabusId: number | string;
  onSave?: () => void;
}

const PolicyEditor: React.FC<PolicyEditorProps> = ({ syllabusId, onSave }) => {
  const { data: policyData } = useGradingPolicy(syllabusId)
  const updatePolicy = useUpdateGradingPolicy(syllabusId)

  const [gradingMethod, setGradingMethod] = useState<GradingMethod>('weighted_categories')
  const [categories, setCategories] = useState<Partial<GradingCategory>[]>([])
  const [scale, setScale] = useState<GradingScale>(STANDARD_SCALE)
  const [scaleType, setScaleType] = useState<ScaleType>('standard')
  const [validationError, setValidationError] = useState<string>('')

  useEffect(() => {
    if (policyData) {
      const ep = policyData.effective_policy
      setGradingMethod(ep.grading_method || 'weighted_categories')
      setCategories(
        ep.categories.map((c) => ({
          id: c.id,
          name: c.name,
          weight: c.weight,
          drop_lowest: c.drop_lowest,
        }))
      )
      const loadedScale = policyData.grading_scale || STANDARD_SCALE
      setScale(loadedScale)
      setScaleType(detectScaleType(loadedScale))
    }
  }, [policyData])

  const weightTotal = categories.reduce((sum, c) => sum + (c.weight || 0), 0)
  const isWeightValid = Math.abs(weightTotal - 1) <= 0.02

  const updateCategory = (index: number, field: string, value: any) => {
    setCategories((prev) =>
      prev.map((c, i) => (i === index ? { ...c, [field]: value } : c))
    )
  }

  const addCategory = () => {
    setCategories((prev) => [
      ...prev,
      { id: `cat_new_${Date.now()}`, name: '', weight: 0, drop_lowest: 0 },
    ])
  }

  const removeCategory = (index: number) => {
    setCategories((prev) => prev.filter((_, i) => i !== index))
  }

  const handleScaleTypeChange = (type: ScaleType) => {
    setScaleType(type)

    if (type === 'detailed') {
      const a = scale['A'] ?? 90
      const b = scale['B'] ?? 80
      const c = scale['C'] ?? 70
      const d = scale['D'] ?? 60
      const f = scale['F'] ?? 0

      const spread = (upper: number, lower: number): [number, number] => {
        const gap = upper - lower
        return [upper - Math.floor(gap / 3), lower + Math.ceil(gap / 3)]
      }

      const [aMinus, bPlus] = spread(a, b)
      const [bMinus, cPlus] = spread(b, c)
      const [cMinus, dPlus] = spread(c, d)
      const [dMinus, ] = spread(d, f)

      setScale({
        'A': a, 'A-': aMinus,
        'B+': bPlus, 'B': b, 'B-': bMinus,
        'C+': cPlus, 'C': c, 'C-': cMinus,
        'D+': dPlus, 'D': d, 'D-': dMinus,
        'F': f,
      })
    } else {
      const findThreshold = (letter: string) => scale[letter]
      setScale({
        'A': findThreshold('A') ?? 90,
        'B': findThreshold('B') ?? 80,
        'C': findThreshold('C') ?? 70,
        'D': findThreshold('D') ?? 60,
        'F': findThreshold('F') ?? 0,
      })
    }
  }

  const updateScaleValue = (letter: string, value: string) => {
    const num = parseFloat(value)
    setScale((prev) => ({ ...prev, [letter]: isNaN(num) ? 0 : num }))
  }

  const handleSave = () => {
    setValidationError('')

    if (gradingMethod === 'weighted_categories' && !isWeightValid) {
      setValidationError('Category weights must sum to 100% (±2% tolerance)')
      return
    }

    if (categories.some((c) => !c.name?.trim())) {
      setValidationError('All categories must have a name')
      return
    }

    const order = scaleType === 'detailed' ? DETAILED_GRADE_ORDER : STANDARD_GRADE_ORDER
    const activeLetters = order.filter((l) => l in scale)
    for (let i = 1; i < activeLetters.length; i++) {
      const prev = activeLetters[i - 1]
      const curr = activeLetters[i]
      if (curr !== 'F' && scale[curr] >= scale[prev]) {
        setValidationError(`Grade thresholds must decrease: ${prev} (${scale[prev]}%) must be higher than ${curr} (${scale[curr]}%)`)
        return
      }
    }

    updatePolicy.mutate(
      { grading_method: gradingMethod, categories, grading_scale: scale },
      { onSuccess: () => onSave?.() }
    )
  }

  const gradeOrder = scaleType === 'detailed' ? DETAILED_GRADE_ORDER : STANDARD_GRADE_ORDER
  const scaleLetters: [string, number][] = gradeOrder
    .filter((letter) => letter in scale)
    .map((letter) => [letter, scale[letter]])

  return (
    <div className="policy-editor">
      <h3>Grading Policy</h3>

      <div className="policy-method-toggle">
        <button
          type="button"
          className={`policy-method-btn ${gradingMethod === 'weighted_categories' ? 'active' : ''}`}
          onClick={() => setGradingMethod('weighted_categories')}
        >
          Weighted Categories
        </button>
        <button
          type="button"
          className={`policy-method-btn ${gradingMethod === 'points' ? 'active' : ''}`}
          onClick={() => setGradingMethod('points')}
        >
          Points-Based
        </button>
      </div>

      <div className="policy-categories">
        {categories.length > 0 && (
          <div className="policy-category-row" style={{ borderBottom: 'none', paddingBottom: 0 }}>
            <div className="policy-category-field">
              <label>Category Name</label>
            </div>
            <div className="policy-category-field">
              <label>{gradingMethod === 'weighted_categories' ? 'Weight %' : 'Points'}</label>
            </div>
            <div className="policy-category-field">
              <label>Drop Lowest</label>
            </div>
            <div />
          </div>
        )}

        {categories.map((cat, idx) => (
          <div className="policy-category-row" key={cat.id || idx}>
            <div className="policy-category-field">
              <input
                type="text"
                value={cat.name || ''}
                onChange={(e) => updateCategory(idx, 'name', e.target.value)}
                placeholder="e.g. Homework"
              />
            </div>
            <div className="policy-category-field">
              <input
                type="number"
                min="0"
                max={gradingMethod === 'weighted_categories' ? 100 : undefined}
                step="1"
                value={cat.weight != null ? Math.round((cat.weight || 0) * 100) : ''}
                onChange={(e) =>
                  updateCategory(idx, 'weight', parseFloat(e.target.value) / 100 || 0)
                }
                placeholder="0"
              />
            </div>
            <div className="policy-category-field">
              <input
                type="number"
                min="0"
                step="1"
                value={cat.drop_lowest || 0}
                onChange={(e) =>
                  updateCategory(idx, 'drop_lowest', parseInt(e.target.value) || 0)
                }
              />
            </div>
            <button
              type="button"
              className="policy-remove-btn"
              onClick={() => removeCategory(idx)}
              aria-label="Remove category"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        ))}

        <button type="button" className="policy-add-btn" onClick={addCategory}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add Category
        </button>
      </div>

      {gradingMethod === 'weighted_categories' && categories.length > 0 && (
        <div className="policy-weight-total">
          <span className="policy-weight-label">Total Weight</span>
          <span className={`policy-weight-value ${isWeightValid ? 'valid' : 'invalid'}`}>
            {Math.round(weightTotal * 100)}%
            {isWeightValid ? (
              <svg className="policy-weight-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            ) : (
              <svg className="policy-weight-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            )}
          </span>
        </div>
      )}

      <div className="policy-scale">
        <div className="policy-scale-header">
          <div className="policy-scale-title">Grading Scale</div>
          <div className="policy-scale-type-toggle">
            <button
              type="button"
              className={`policy-scale-type-btn ${scaleType === 'standard' ? 'active' : ''}`}
              onClick={() => handleScaleTypeChange('standard')}
            >
              Standard
            </button>
            <button
              type="button"
              className={`policy-scale-type-btn ${scaleType === 'detailed' ? 'active' : ''}`}
              onClick={() => handleScaleTypeChange('detailed')}
            >
              Detailed (+/-)
            </button>
          </div>
        </div>
        <div className={`policy-scale-grid ${scaleType === 'detailed' ? 'detailed' : ''}`}>
          {scaleLetters.map(([letter, minPct]) => (
            <div className="policy-scale-row" key={letter}>
              <span className="policy-scale-letter">{letter}</span>
              <input
                type="number"
                min="0"
                max="100"
                step="1"
                value={minPct}
                onChange={(e) => updateScaleValue(letter, e.target.value)}
                placeholder="Min %"
              />
            </div>
          ))}
        </div>
      </div>

      {validationError && <div className="policy-error">{validationError}</div>}

      <button
        type="button"
        className="policy-save-btn"
        onClick={handleSave}
        disabled={updatePolicy.isPending}
      >
        {updatePolicy.isPending ? 'Saving...' : 'Save Policy'}
      </button>
    </div>
  )
}

export default PolicyEditor
