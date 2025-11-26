import React, { createContext, useContext, useState, useCallback, useRef, ReactNode } from 'react';

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

