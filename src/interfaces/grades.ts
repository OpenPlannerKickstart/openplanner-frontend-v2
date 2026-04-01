export type GradingMethod = 'weighted_categories' | 'points' | 'hybrid' | 'unknown';
export type GradingStatus = 'planned' | 'submitted' | 'graded';
export type GradeSource = 'extracted' | 'user';
export type PolicySourceType = 'syllabus' | 'user';

export interface GradingCategory {
  id: string;
  name: string;
  weight: number;
  drop_lowest: number;
  drop_highest: number;
  points_possible: number | null;
}

export interface PolicyFlags {
  curve_possible: boolean;
  extra_credit_possible: boolean;
  subject_to_change: boolean;
  tbd_categories: boolean;
}

export interface EffectivePolicy {
  grading_method: GradingMethod;
  categories: GradingCategory[];
  total_points_possible: number | null;
  flags: PolicyFlags;
}

export interface PolicyCitation {
  field: string;
  text: string;
}

export interface GradingScale {
  [letter: string]: number;
}

export interface GradingPolicyResponse {
  id: number;
  syllabus_id: number;
  grading_method: GradingMethod;
  effective_policy: EffectivePolicy;
  extracted_data: any;
  user_overrides: any | null;
  grading_scale: GradingScale;
  confidence: number;
  missing_fields: string[];
  citations: PolicyCitation[];
  source_type: PolicySourceType;
  is_user_confirmed: boolean;
}

export interface UpdateGradingPolicyRequest {
  grading_method: GradingMethod;
  categories: Partial<GradingCategory>[];
  grading_scale?: GradingScale;
}

export interface CategoryBreakdown {
  category_id: string;
  name: string;
  earned: number;
  possible: number;
  dropped_scores: number[];
  category_percent: number;
  weighted_contribution: number;
}

export interface GradeSummaryResponse {
  current_percent: number | null;
  letter_grade: string | null;
  category_breakdown: CategoryBreakdown[];
  has_sufficient_data: boolean;
  data_completeness: number;
  warnings: string[];
}

export interface SimulateRequest {
  assignment_id: number;
  assumed_score: number;
  score_type: 'points' | 'percentage';
}

export interface SimulateResponse {
  current_percent: number | null;
  projected_percent: number;
  projected_letter: string;
  delta: number;
  assignment_worth_percent: number;
  category_breakdown: CategoryBreakdown[];
  has_sufficient_data: boolean;
}

export interface AssignmentWorth {
  event_id: number;
  title?: string;
  worth_percent: number | null;
  method: 'exact' | 'estimated' | 'insufficient_data';
  explanation: string;
  points_possible?: number;
}

export interface EventsWorthResponse {
  policy_available: boolean;
  assignments: AssignmentWorth[];
}

export interface NeededScoreRequest {
  assignment_id: number;
  desired_grade_percent: number;
}

export interface NeededScoreResponse {
  needed_score: number;
  needed_score_type: string;
  is_achievable: boolean;
  explanation: string;
}

export interface UpdateEventGradeRequest {
  score_received?: number;
  score_type?: 'points' | 'percentage';
  grading_status?: GradingStatus;
  category_id?: string;
  points_possible?: number;
  is_grade_item?: boolean;
}

export interface UpdateEventGradeResponse {
  event_id: number;
  score_received: number;
  score_type: 'points' | 'percentage';
  grading_status: GradingStatus;
  points_possible: number | null;
}
