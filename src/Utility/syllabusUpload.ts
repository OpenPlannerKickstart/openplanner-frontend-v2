import { get, post } from './httpInterceptor';
import { initiateUpload, uploadToS3, computeCrc32Base64 } from './uploads';
import { ts, te } from './Toaster';

export interface SyllabusMetadata {
  title: string;
  class_time: string; // HH:mm:ssZ format
  course_color: string;
  professor_name?: string;
  start_date?: string; // YYYY-MM-DD
  end_date?: string; // YYYY-MM-DD
  priority?: 'High' | 'Medium' | 'Low';
  id?: number; // for updates
}

export interface SyllabusUploadResult {
  syllabusId: number;
  status: 'processing' | 'ready' | 'failed';
  eventCount?: number;
  course?: {
    code?: string;
    term?: string;
    year?: number;
  };
}

export interface SyllabusStatusResponse {
  id: number;
  status: 'processing' | 'ready' | 'failed';
  message?: string;
  eventCount?: number;
  title?: string;
  syllabus_doc?: {
    url?: string;
  };
  course?: {
    code?: string;
    term?: string;
    year?: number;
  };
}

// Polling configuration
const POLL_INTERVAL_MS = 2000; // 2 seconds
const MAX_POLL_DURATION_MS = 3 * 60 * 1000; // 3 minutes

/**
 * Sleep for a specified duration.
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Parse error message from various BE response shapes.
 */
function parseErrorMessage(error: any): string {
  // uploads/initiate shape: { code, message }
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }
  // Common wrapper shape: { status, data, message, error }
  if (error?.response?.data?.code) {
    const code = error.response.data.code;
    switch (code) {
      case 'UNSUPPORTED_MEDIA_TYPE':
        return 'File type not supported. Allowed: PDF, DOC, DOCX';
      case 'PAYLOAD_TOO_LARGE':
        return 'File is too large (max 25MB)';
      case 'BAD_REQUEST':
        return error.response.data.message || 'Invalid request';
      default:
        return error.response.data.message || 'Upload failed';
    }
  }
  if (error?.message) {
    return error.message;
  }
  return 'Something went wrong. Please try again.';
}

/**
 * Upload a syllabus file using the async flow:
 * 1. Initiate upload (get signed S3 URL)
 * 2. Upload to S3 with progress tracking
 * 3. Create syllabus record with fileId
 * 4. Return syllabusId (processing starts in background)
 */
export async function uploadSyllabusFile(
  file: File,
  metadata: SyllabusMetadata,
  onProgress?: (progress: number) => void
): Promise<{ syllabusId: number; fileId: string }> {
  // 1. Compute checksum
  const checksumCrc32 = await computeCrc32Base64(file);

  // 2. Initiate upload with syllabus context
  const initResponse = await initiateUpload(file, {
    checksumCrc32,
    context: 'syllabus',
  });

  const { fileId, putUrl, headers } = initResponse;

  // 3. Upload to S3
  await uploadToS3(putUrl, headers, file, onProgress);

  // 4. Create syllabus record
  const syllabusBody: Record<string, any> = {
    fileId,
    title: metadata.title,
    class_time: metadata.class_time,
    course_color: metadata.course_color,
  };

  if (metadata.professor_name) {
    syllabusBody.professor_name = metadata.professor_name;
  }
  if (metadata.start_date) {
    syllabusBody.start_date = metadata.start_date;
  }
  if (metadata.end_date) {
    syllabusBody.end_date = metadata.end_date;
  }
  if (metadata.priority) {
    syllabusBody.priority = metadata.priority;
  }
  if (metadata.id) {
    syllabusBody.id = metadata.id;
  }

  const response: any = await post('addEditSyllabus', syllabusBody);
  const data = response?.data?.data ?? response?.data ?? response;

  if (!data?.id) {
    throw new Error('Failed to create syllabus record');
  }

  return {
    syllabusId: data.id,
    fileId,
  };
}

/**
 * Poll syllabus status until ready or failed.
 * Throws on timeout or failure.
 */
export async function pollSyllabusStatus(
  syllabusId: number,
  onStatusChange?: (status: SyllabusStatusResponse) => void
): Promise<SyllabusStatusResponse> {
  const startTime = Date.now();

  while (true) {
    // Check timeout
    if (Date.now() - startTime > MAX_POLL_DURATION_MS) {
      throw new Error('Syllabus processing is taking longer than expected. Please try again later.');
    }

    try {
      const response: any = await get(`syllabus/${syllabusId}/status`);
      const data: SyllabusStatusResponse = response?.data?.data ?? response?.data ?? response;

      if (onStatusChange) {
        onStatusChange(data);
      }

      if (data.status === 'ready') {
        return data;
      }

      if (data.status === 'failed') {
        throw new Error(data.message || 'Syllabus processing failed');
      }

      // Still processing, wait and poll again
      await sleep(POLL_INTERVAL_MS);
    } catch (error: any) {
      // Network error - throw but don't assume BE stopped processing
      if (!error.response) {
        throw new Error('Network error while checking status. The upload may still be processing.');
      }
      throw error;
    }
  }
}

/**
 * Full async syllabus upload flow:
 * 1. Upload file to S3
 * 2. Create syllabus record
 * 3. Poll for completion
 * 4. Return final status
 */
export async function uploadSyllabusAsync(
  file: File,
  metadata: SyllabusMetadata,
  callbacks: {
    onUploadProgress?: (progress: number) => void;
    onProcessingStart?: (syllabusId: number) => void;
    onStatusChange?: (status: SyllabusStatusResponse) => void;
  } = {}
): Promise<SyllabusUploadResult> {
  const { onUploadProgress, onProcessingStart, onStatusChange } = callbacks;

  // Step 1 & 2: Upload file and create record
  const { syllabusId } = await uploadSyllabusFile(file, metadata, onUploadProgress);

  // Notify that processing has started
  if (onProcessingStart) {
    onProcessingStart(syllabusId);
  }

  // Step 3: Poll for completion
  const finalStatus = await pollSyllabusStatus(syllabusId, onStatusChange);

  return {
    syllabusId: finalStatus.id,
    status: finalStatus.status,
    eventCount: finalStatus.eventCount,
    course: finalStatus.course,
  };
}

/**
 * Wrapper that integrates with SyllabusUploadContext.
 * This is the main function to call from syllabus UI components.
 */
export async function startSyllabusUpload(
  file: File,
  metadata: SyllabusMetadata,
  contextActions: {
    startUpload: (fileName: string) => void;
    setProgress: (progress: number) => void;
    setStatus: (status: 'uploading' | 'processing' | 'ready' | 'failed', errorMessage?: string | null) => void;
    setSyllabusId: (id: number) => void;
  }
): Promise<SyllabusUploadResult> {
  const { startUpload, setProgress, setStatus, setSyllabusId } = contextActions;

  // Open modal and start upload
  startUpload(file.name);

  try {
    // Upload to S3
    const { syllabusId } = await uploadSyllabusFile(file, metadata, (progress) => {
      setProgress(progress);
    });

    // Update state for processing phase
    setSyllabusId(syllabusId);
    setStatus('processing');

    // Poll for completion
    const finalStatus = await pollSyllabusStatus(syllabusId);

    // Success
    setStatus('ready');
    ts('Syllabus uploaded successfully!');

    return {
      syllabusId: finalStatus.id,
      status: 'ready',
      eventCount: finalStatus.eventCount,
      course: finalStatus.course,
    };
  } catch (error: any) {
    const errorMessage = parseErrorMessage(error);
    setStatus('failed', errorMessage);
    // Don't show toast for limit reached errors - the modal shows upgrade UI instead
    const isLimitError = errorMessage.toLowerCase().includes('limit') && 
      (errorMessage.toLowerCase().includes('syllabi') || errorMessage.toLowerCase().includes('syllabus') || errorMessage.toLowerCase().includes('upload'));
    if (!isLimitError) {
      te(errorMessage);
    }
    throw error;
  }
}

