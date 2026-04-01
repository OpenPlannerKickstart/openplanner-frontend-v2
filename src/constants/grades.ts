import { GradingScale } from '../interfaces/grades'

export type ScaleType = 'standard' | 'detailed'

export const STANDARD_SCALE: GradingScale = { A: 90, B: 80, C: 70, D: 60, F: 0 }

export const STANDARD_GRADE_ORDER = ['A', 'B', 'C', 'D', 'F'] as const
export const DETAILED_GRADE_ORDER = ['A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'D-', 'F'] as const

export function detectScaleType(scale: GradingScale): ScaleType {
  const keys = Object.keys(scale)
  return keys.some((k) => k.includes('+') || k.includes('-')) ? 'detailed' : 'standard'
}
