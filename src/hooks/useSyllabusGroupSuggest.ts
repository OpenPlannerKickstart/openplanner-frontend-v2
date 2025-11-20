import { useCallback, useMemo, useState } from 'react';
import { post } from '../Utility/httpInterceptor';
import { te, ts } from '../Utility/Toaster';

type MemberPreview = {
  id: string;
  displayName?: string | null;
  picture?: string | null;
};

type CourseInfo = {
  code?: string | null;
  title?: string | null;
  term?: 'Winter' | 'Spring' | 'Summer' | 'Fall';
  year?: number;
};

export type SuggestCandidate = {
  id: string;
  name: string;
  course?: CourseInfo | null;
  memberPreviews?: MemberPreview[];
};

export type SuggestResponse = {
  candidates: SuggestCandidate[];
  canonicalExists?: boolean;
};

export type CanonicalResponse = {
  id: string;
  name: string;
  course?: CourseInfo | null;
  created?: boolean;
  memberPreviews?: MemberPreview[];
};

/**
 * Hook to fetch course-group suggestions from a syllabus and resolve the canonical group (find-or-create-and-join).
 * Idempotent: /groups/canonical returns the same canonical group and joins the user if not already joined.
 */
export function useSyllabusGroupSuggest(initialSyllabusId?: string) {
  const [syllabusId, setSyllabusId] = useState<string | undefined>(initialSyllabusId);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestion, setSuggestion] = useState<SuggestResponse | null>(null);
  const [resolving, setResolving] = useState(false);
  const [canonical, setCanonical] = useState<CanonicalResponse | null>(null);

  const hasCandidate = useMemo(() => {
    return (suggestion?.candidates && suggestion.candidates.length > 0) || false;
  }, [suggestion]);

  const fetchSuggestions = useCallback(async (sid?: string) => {
    const finalId = sid ?? syllabusId;
    if (!finalId) return;
    setLoading(true);
    setError(null);
    try {
      const res: any = await post('groups/suggestions', { syllabusId: finalId });
      const data: SuggestResponse = (res?.data ?? res) as any;
      setSuggestion({
        candidates: Array.isArray((data as any)?.candidates) ? (data as any).candidates : [],
        canonicalExists: Boolean((data as any)?.canonicalExists),
      });
    } catch (e: any) {
      setSuggestion(null);
      const msg = e?.response?.data?.message || 'Failed to fetch suggestions';
      setError(msg);
      te(msg);
    } finally {
      setLoading(false);
    }
  }, [syllabusId]);

  const createAndJoin = useCallback(async (sid?: string) => {
    const finalId = sid ?? syllabusId;
    if (!finalId) return null;
    setResolving(true);
    setError(null);
    try {
      const res: any = await post('groups/canonical', { syllabusId: finalId });
      const data: CanonicalResponse = (res?.data ?? res) as any;
      setCanonical(data);
      if ((data as any)?.created) {
        ts('Class group created and joined');
      } else {
        ts('Joined class group');
      }
      return data;
    } catch (e: any) {
      const msg = e?.response?.data?.message || 'Failed to resolve class group';
      setError(msg);
      te(msg);
      return null;
    } finally {
      setResolving(false);
    }
  }, [syllabusId]);

  const reset = useCallback(() => {
    setSuggestion(null);
    setCanonical(null);
    setError(null);
      setLoading(false);
    setResolving(false);
  }, []);

  return {
    // inputs
    syllabusId,
    setSyllabusId,
    // suggestion
    loadingSuggestions: loading,
    suggestion,
    hasCandidate,
    fetchSuggestions,
    // resolve
    resolvingCanonical: resolving,
    canonical,
    createAndJoin,
    // error + reset
    error,
    reset,
  };
}
