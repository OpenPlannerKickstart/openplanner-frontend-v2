import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../../lib/queryKeys';
import { staleTimeConfig } from '../../lib/staleTimeConfig';
import { invalidateOnGradeChange, invalidateOnPolicyChange } from '../../lib/invalidationMap';
import {
  fetchGradingPolicy,
  updateGradingPolicy,
  fetchGradeSummary,
  simulateGrade,
  fetchEventsWorth,
  calculateNeededScore,
  updateEventGrade,
} from '../../api/grades';
import {
  GradingPolicyResponse,
  GradeSummaryResponse,
  EventsWorthResponse,
  UpdateGradingPolicyRequest,
  SimulateRequest,
  SimulateResponse,
  NeededScoreRequest,
  NeededScoreResponse,
  UpdateEventGradeRequest,
} from '../../interfaces/grades';
import { ts } from '../../Utility/Toaster';

export function useGradingPolicy(syllabusId: number | string | undefined) {
  return useQuery<GradingPolicyResponse | null, Error>({
    queryKey: queryKeys.gradingPolicy(syllabusId!),
    queryFn: () => fetchGradingPolicy(syllabusId!),
    staleTime: staleTimeConfig.gradingPolicy,
    enabled: !!syllabusId,
  });
}

export function useGradeSummary(syllabusId: number | string | undefined) {
  return useQuery<GradeSummaryResponse, Error>({
    queryKey: queryKeys.gradeSummary(syllabusId!),
    queryFn: () => fetchGradeSummary(syllabusId!),
    staleTime: staleTimeConfig.gradeSummary,
    enabled: !!syllabusId,
  });
}

export function useEventsWorth(syllabusId: number | string | undefined) {
  return useQuery<EventsWorthResponse, Error>({
    queryKey: queryKeys.eventsWorth(syllabusId!),
    queryFn: () => fetchEventsWorth(syllabusId!),
    staleTime: staleTimeConfig.eventsWorth,
    enabled: !!syllabusId,
  });
}

export function useUpdateGradingPolicy(syllabusId: number | string) {
  const queryClient = useQueryClient();

  return useMutation<GradingPolicyResponse, Error, UpdateGradingPolicyRequest>({
    mutationFn: (body) => updateGradingPolicy(syllabusId, body),
    onSuccess: () => {
      ts('Grading policy updated');
      invalidateOnPolicyChange(queryClient, syllabusId);
    },
    onError: (error: Error) => {
      ts(error.message || 'Failed to update grading policy');
    },
  });
}

export function useSimulateGrade(syllabusId: number | string) {
  return useMutation<SimulateResponse, Error, SimulateRequest>({
    mutationFn: (body) => simulateGrade(syllabusId, body),
  });
}

export function useNeededScore(syllabusId: number | string) {
  return useMutation<NeededScoreResponse, Error, NeededScoreRequest>({
    mutationFn: (body) => calculateNeededScore(syllabusId, body),
  });
}

export function useUpdateEventGrade(syllabusId: number | string) {
  const queryClient = useQueryClient();

  return useMutation<any, Error, { eventId: number | string; body: UpdateEventGradeRequest }>({
    mutationFn: ({ eventId, body }) => updateEventGrade(syllabusId, eventId, body),
    onSuccess: () => {
      ts('Grade saved');
      invalidateOnGradeChange(queryClient, syllabusId);
    },
    onError: (error: Error) => {
      ts(error.message || 'Failed to save grade');
    },
  });
}
