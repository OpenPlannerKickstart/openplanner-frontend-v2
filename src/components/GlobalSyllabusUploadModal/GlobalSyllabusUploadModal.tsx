import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSyllabusUpload } from '../../context/SyllabusUploadContext';
import { ENUMFORROUTES } from '../../interfaces/enum';
import './GlobalSyllabusUploadModal.scss';

// Check if error message indicates limit reached
const isLimitReachedError = (message: string | undefined | null): boolean => {
  if (!message) return false;
  const lowerMsg = message.toLowerCase();
  return lowerMsg.includes('limit') && (lowerMsg.includes('syllabi') || lowerMsg.includes('syllabus') || lowerMsg.includes('upload'));
};

const TIMEOUT_MS = 3 * 60 * 1000; // 3 minutes
const VIEWPORT_PADDING = 8; // Minimum distance from viewport edges

export default function GlobalSyllabusUploadModal() {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    isOpen,
    fileName,
    progress,
    status,
    errorMessage,
    expanded,
    startedAt,
    setExpanded,
    close,
  } = useSyllabusUpload();

  const hasAutoClosedRef = useRef(false);
  const [isAutoClosing, setIsAutoClosing] = useState(false);

  // Dragging state
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const modalRef = useRef<HTMLDivElement>(null);

  // Timeout state
  const [timedOut, setTimedOut] = useState(false);

  // Check for timeout
  useEffect(() => {
    if (status === 'processing' && startedAt) {
      const checkTimeout = () => {
        if (Date.now() - startedAt > TIMEOUT_MS) {
          setTimedOut(true);
        }
      };
      const interval = setInterval(checkTimeout, 1000);
      return () => clearInterval(interval);
    } else {
      setTimedOut(false);
    }
  }, [status, startedAt]);

  // Clamp position to keep modal within viewport with padding
  const clampPosition = useCallback((x: number, y: number) => {
    const modalWidth = modalRef.current?.offsetWidth || 360;
    const modalHeight = modalRef.current?.offsetHeight || 200;
    const maxX = window.innerWidth - modalWidth - VIEWPORT_PADDING;
    const maxY = window.innerHeight - modalHeight - VIEWPORT_PADDING;
    return {
      x: Math.max(VIEWPORT_PADDING, Math.min(x, maxX)),
      y: Math.max(VIEWPORT_PADDING, Math.min(y, maxY)),
    };
  }, []);

  // Reset position when modal opens
  useEffect(() => {
    if (isOpen) {
      // Position in bottom-right corner with padding
      const modalWidth = 360;
      const modalHeight = expanded ? 220 : 80;
      const x = window.innerWidth - modalWidth - VIEWPORT_PADDING;
      const y = window.innerHeight - modalHeight - VIEWPORT_PADDING;
      setPosition(clampPosition(x, y));
      setTimedOut(false);
    }
  }, [isOpen, expanded, clampPosition]);

  // Handle drag start
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!modalRef.current) return;
    const rect = modalRef.current.getBoundingClientRect();
    dragOffset.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
    setIsDragging(true);
  }, []);

  // Handle drag move
  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const newX = e.clientX - dragOffset.current.x;
      const newY = e.clientY - dragOffset.current.y;
      // Clamp to viewport with padding
      setPosition(clampPosition(newX, newY));
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, clampPosition]);

  // Re-clamp position when window resizes to keep modal in bounds
  useEffect(() => {
    const handleResize = () => {
      setPosition((prev) => clampPosition(prev.x, prev.y));
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [clampPosition]);

  // Auto-close when upload completes AND user is already on Courses page
  useEffect(() => {
    if (!isOpen) return;
    if (status !== 'ready') {
      hasAutoClosedRef.current = false;
      setIsAutoClosing(false);
      return;
    }

    const onCourses =
      location?.pathname === ENUMFORROUTES.COURSES ||
      location?.pathname?.startsWith(`${ENUMFORROUTES.COURSES}/`);

    if (!onCourses) return;
    if (hasAutoClosedRef.current) return;
    hasAutoClosedRef.current = true;

    // Let the "Upload complete!" state show briefly, then animate out and close.
    let t2: number | undefined;
    const t1 = window.setTimeout(() => {
      setIsAutoClosing(true);
      t2 = window.setTimeout(() => {
        try {
          close();
        } catch {}
      }, 200);
    }, 800);

    return () => {
      window.clearTimeout(t1);
      if (t2) window.clearTimeout(t2);
    };
  }, [isOpen, status, location?.pathname, close]);

  if (!isOpen) return null;

  const progressPercent = Math.round(progress * 100);
  const limitReached = status === 'failed' && isLimitReachedError(errorMessage);

  const getStatusText = () => {
    if (timedOut) return 'Taking longer than expected...';
    switch (status) {
      case 'uploading':
        return `Uploading... ${progressPercent}%`;
      case 'processing':
        return 'Analyzing your syllabus...';
      case 'ready':
        return 'Upload complete!';
      case 'failed':
        return limitReached ? 'Upgrade Required' : 'Upload failed';
      default:
        return 'Preparing...';
    }
  };

  const getStatusIcon = () => {
    if (status === 'ready') {
      return <i className="material-symbols-outlined status-icon success">check_circle</i>;
    }
    if (limitReached) {
      // Crown icon for upgrade required
      return (
        <svg className="status-icon crown" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .55-.45 1-1 1H6c-.55 0-1-.45-1-1v-1h14v1z"/>
        </svg>
      );
    }
    if (status === 'failed' || timedOut) {
      return <i className="material-symbols-outlined status-icon error">error</i>;
    }
    // Spinner for uploading/processing
    return (
      <div className="spinner-container">
        <div className="spinner" />
      </div>
    );
  };

  const handleUpgradeClick = () => {
    navigate(ENUMFORROUTES.PLAN_DETAILS);
    close();
  };

  const canClose = status === 'ready' || status === 'failed' || timedOut;

  // Navigate to courses page when clicking filename after upload completes
  const handleFileNameClick = () => {
    if (status === 'ready') {
      navigate(ENUMFORROUTES.COURSES);
      close();
    }
  };

  return (
    <div
      ref={modalRef}
      className={`global-syllabus-upload-modal ${expanded ? 'expanded' : 'collapsed'} status-${status} ${limitReached ? 'limit-reached' : ''} ${isAutoClosing ? 'auto-closing' : ''}`}
      style={{
        left: position.x,
        top: position.y,
        cursor: isDragging ? 'grabbing' : undefined,
      }}
    >
      {/* Header - draggable */}
      <div
        className="modal-header"
        onMouseDown={handleMouseDown}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      >
        <div className="header-left">
          {getStatusIcon()}
          <span className="status-text">{getStatusText()}</span>
        </div>
        <div className="header-right">
          <button
            type="button"
            className="btn-icon"
            onClick={() => setExpanded(!expanded)}
            title={expanded ? 'Collapse' : 'Expand'}
          >
            <i className="material-symbols-outlined">
              {expanded ? 'expand_more' : 'expand_less'}
            </i>
          </button>
          {canClose && (
            <button
              type="button"
              className="btn-icon"
              onClick={close}
              title="Close"
            >
              <i className="material-symbols-outlined">close</i>
            </button>
          )}
        </div>
      </div>

      {/* Body - only shown when expanded */}
      {expanded && (
        <div className="modal-body">
          {status === 'uploading' && (
            <>
              <p className="info-text">
                Uploading your syllabus... this can take about a minute. You can keep using Open Planner while we work on it.
              </p>
              <div className="file-info">
                <i className="material-symbols-outlined file-icon">description</i>
                <span className="file-name" title={fileName}>{fileName}</span>
              </div>
              <div className="progress-bar-container">
                <div className="progress-bar" style={{ width: `${progressPercent}%` }} />
              </div>
              <div className="progress-label">{progressPercent}% uploaded</div>
            </>
          )}

          {status === 'processing' && !timedOut && (
            <>
              <p className="info-text">
                Your file has been uploaded. We're now analyzing your syllabus to extract course information and events.
              </p>
              <div className="file-info">
                <i className="material-symbols-outlined file-icon">description</i>
                <span className="file-name" title={fileName}>{fileName}</span>
              </div>
              <div className="processing-indicator">
                <div className="processing-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </>
          )}

          {timedOut && status === 'processing' && (
            <>
              <p className="info-text warning">
                This is taking longer than expected. You can wait a bit and try again, or close this and retry later.
              </p>
              <div className="file-info">
                <i className="material-symbols-outlined file-icon">description</i>
                <span className="file-name" title={fileName}>{fileName}</span>
              </div>
            </>
          )}

          {status === 'ready' && (
            <>
              <p className="info-text success">
                Your syllabus has been uploaded and processed successfully!
              </p>
              <div 
                className="file-info clickable" 
                onClick={handleFileNameClick}
                title="Click to view your course"
              >
                <i className="material-symbols-outlined file-icon success">check_circle</i>
                <span className="file-name">{fileName}</span>
              </div>
            </>
          )}

          {status === 'failed' && !limitReached && (
            <>
              <p className="info-text error">
                {errorMessage || 'Something went wrong while processing your syllabus. Please try again.'}
              </p>
              <div className="file-info">
                <i className="material-symbols-outlined file-icon error">error</i>
                <span className="file-name" title={fileName}>{fileName}</span>
              </div>
            </>
          )}

          {status === 'failed' && limitReached && (
            <>
              <p className="info-text upgrade">
                You have reached the free upload limit of 3 syllabi. Please upgrade to premium to upload more.
              </p>
              <button
                type="button"
                className="upgrade-btn"
                onClick={handleUpgradeClick}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .55-.45 1-1 1H6c-.55 0-1-.45-1-1v-1h14v1z"/>
                </svg>
                Upgrade to Premium
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

