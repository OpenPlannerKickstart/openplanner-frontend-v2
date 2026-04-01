import { AxiosResponse } from 'axios';
import { get, post, put } from '../Utility/httpInterceptor';
import { GRADE_API_BASE } from '../Utility/ApiList';
import { ResponseWrapperDTO } from '../interfaces/interface';
import {
  GradingPolicyResponse,
  UpdateGradingPolicyRequest,
  GradeSummaryResponse,
  SimulateRequest,
  SimulateResponse,
  EventsWorthResponse,
  NeededScoreRequest,
  NeededScoreResponse,
  UpdateEventGradeRequest,
  UpdateEventGradeResponse,
} from '../interfaces/grades';

export const fetchGradingPolicy = async (syllabusId: number | string): Promise<GradingPolicyResponse | null> => {
  const response = await get(`${GRADE_API_BASE}/${syllabusId}/grading-policy`) as AxiosResponse<ResponseWrapperDTO>;

  if (response.data.error) {
    throw new Error(response.data.message || 'Failed to fetch grading policy');
  }

  return response.data.data || null;
};

export const updateGradingPolicy = async (syllabusId: number | string, body: UpdateGradingPolicyRequest): Promise<GradingPolicyResponse> => {
  const response = await put(`${GRADE_API_BASE}/${syllabusId}/grading-policy`, body) as AxiosResponse<ResponseWrapperDTO>;

  if (response.data.error) {
    throw new Error(response.data.message || 'Failed to update grading policy');
  }

  return response.data.data;
};

export const fetchGradeSummary = async (syllabusId: number | string): Promise<GradeSummaryResponse> => {
  const response = await get(`${GRADE_API_BASE}/${syllabusId}/grade-summary`) as AxiosResponse<ResponseWrapperDTO>;

  if (response.data.error) {
    throw new Error(response.data.message || 'Failed to fetch grade summary');
  }

  return response.data.data;
};

export const simulateGrade = async (syllabusId: number | string, body: SimulateRequest): Promise<SimulateResponse> => {
  const response = await post(`${GRADE_API_BASE}/${syllabusId}/simulate`, body) as AxiosResponse<ResponseWrapperDTO>;

  if (response.data.error) {
    throw new Error(response.data.message || 'Failed to simulate grade');
  }

  return response.data.data;
};

export const fetchEventsWorth = async (syllabusId: number | string): Promise<EventsWorthResponse> => {
  const response = await get(`${GRADE_API_BASE}/${syllabusId}/events/worth`) as AxiosResponse<ResponseWrapperDTO>;

  if (response.data.error) {
    throw new Error(response.data.message || 'Failed to fetch events worth');
  }

  return response.data.data;
};

export const calculateNeededScore = async (syllabusId: number | string, body: NeededScoreRequest): Promise<NeededScoreResponse> => {
  const response = await post(`${GRADE_API_BASE}/${syllabusId}/needed-score`, body) as AxiosResponse<ResponseWrapperDTO>;

  if (response.data.error) {
    throw new Error(response.data.message || 'Failed to calculate needed score');
  }

  return response.data.data;
};

export const updateEventGrade = async (syllabusId: number | string, eventId: number | string, body: UpdateEventGradeRequest): Promise<UpdateEventGradeResponse> => {
  const response = await put(`${GRADE_API_BASE}/${syllabusId}/events/${eventId}/grade`, body) as AxiosResponse<ResponseWrapperDTO>;

  if (response.data.error) {
    throw new Error(response.data.message || 'Failed to update event grade');
  }

  return response.data.data;
};
