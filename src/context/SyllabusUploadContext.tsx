import React, { createContext, useContext, useState, useCallback, useRef, ReactNode, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../redux/store';
import { isUpdatedSyllabus } from '../redux/User/Courses/coursesSlice';

export type SyllabusUploadStatus = 'idle' | 'uploading' | 'processing' | 'ready' | 'failed';

export interface SyllabusUploadState {
  isOpen: boolean;
  fileName: string;
  progress: number; // 0-1 for S3 upload phase
  status: SyllabusUploadStatus;
  syllabusId: number | null;
  errorMessage: string | null;
  expanded: boolean;
  startedAt: number | null; // timestamp for timeout tracking
}

export interface SyllabusUploadActions {
  startUpload: (fileName: string) => void;
  setProgress: (progress: number) => void;
  setStatus: (status: SyllabusUploadStatus, errorMessage?: string | null) => void;
  setSyllabusId: (id: number) => void;
  setExpanded: (expanded: boolean) => void;
  reset: () => void;
  close: () => void;
}

export interface SyllabusUploadContextValue extends SyllabusUploadState, SyllabusUploadActions {}

const initialState: SyllabusUploadState = {
  isOpen: false,
  fileName: '',
  progress: 0,
  status: 'idle',
  syllabusId: null,
  errorMessage: null,
  expanded: true,
  startedAt: null,
};

const SyllabusUploadContext = createContext<SyllabusUploadContextValue | undefined>(undefined);

export function SyllabusUploadProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SyllabusUploadState>(initialState);
  const dispatch: AppDispatch = useDispatch();
  const prevStatusRef = useRef<SyllabusUploadStatus>(initialState.status);

  // When async processing completes, trigger a global refresh so new courses appear immediately.
  // We toggle false -> true so listeners fire even if the flag is already true.
  useEffect(() => {
    const prev = prevStatusRef.current;
    prevStatusRef.current = state.status;

    if (prev !== 'ready' && state.status === 'ready') {
      try {
        dispatch(isUpdatedSyllabus(false));
        dispatch(isUpdatedSyllabus(true));
      } catch {}
    }
  }, [state.status, dispatch]);

  const startUpload = useCallback((fileName: string) => {
    setState({
      isOpen: true,
      fileName,
      progress: 0,
      status: 'uploading',
      syllabusId: null,
      errorMessage: null,
      expanded: true,
      startedAt: Date.now(),
    });
  }, []);

  const setProgress = useCallback((progress: number) => {
    setState((prev) => ({ ...prev, progress: Math.max(0, Math.min(1, progress)) }));
  }, []);

  const setStatus = useCallback((status: SyllabusUploadStatus, errorMessage: string | null = null) => {
    setState((prev) => ({ ...prev, status, errorMessage }));
  }, []);

  const setSyllabusId = useCallback((id: number) => {
    setState((prev) => ({ ...prev, syllabusId: id }));
  }, []);

  const setExpanded = useCallback((expanded: boolean) => {
    setState((prev) => ({ ...prev, expanded }));
  }, []);

  const reset = useCallback(() => {
    setState(initialState);
  }, []);

  const close = useCallback(() => {
    setState((prev) => ({ ...prev, isOpen: false }));
    // Reset after animation
    setTimeout(() => {
      setState(initialState);
    }, 300);
  }, []);

  const value: SyllabusUploadContextValue = {
    ...state,
    startUpload,
    setProgress,
    setStatus,
    setSyllabusId,
    setExpanded,
    reset,
    close,
  };

  return (
    <SyllabusUploadContext.Provider value={value}>
      {children}
    </SyllabusUploadContext.Provider>
  );
}

export function useSyllabusUpload(): SyllabusUploadContextValue {
  const context = useContext(SyllabusUploadContext);
  if (!context) {
    throw new Error('useSyllabusUpload must be used within a SyllabusUploadProvider');
  }
  return context;
}

export default SyllabusUploadContext;

