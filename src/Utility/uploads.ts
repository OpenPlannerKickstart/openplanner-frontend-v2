import { post } from './httpInterceptor';
import type { AttachmentDescriptor } from '../interfaces/groups';

export type UploadContext = 'syllabus' | 'attachment';

export type UploadInitResponse = {
  fileId: string;
  putUrl: string;
  headers: Record<string, string>; // e.g., { 'Content-Type': mimeType, 'x-amz-checksum-crc32': '...' }
  expiresIn: number;
  signedHeaders?: string; // optional debug info from BE: value of X-Amz-SignedHeaders
  context?: UploadContext; // echoed back from BE
};

/**
 * Many backends store file names in VARCHAR(255). Ensure we never exceed that,
 * while preserving the extension when possible.
 */
function safeFileName(name: string, maxLen = 255): string {
  const n = (name || '').trim();
  if (!n) return 'file';
  if (n.length <= maxLen) return n;
  const lastDot = n.lastIndexOf('.');
  const hasExt = lastDot > 0 && lastDot < n.length - 1;
  const ext = hasExt ? n.slice(lastDot) : '';
  const base = hasExt ? n.slice(0, lastDot) : n;
  const keepBaseLen = Math.max(1, maxLen - ext.length);
  return `${base.slice(0, keepBaseLen)}${ext}`.slice(0, maxLen);
}

/**
 * Compute CRC32 (ISO-3309) for an ArrayBuffer.
 */
function crc32(buffer: ArrayBuffer): number {
  const table = (crc32 as any)._table || ((crc32 as any)._table = (() => {
    const t = new Uint32Array(256);
    for (let i = 0; i < 256; i++) {
      let c = i;
      for (let k = 0; k < 8; k++) {
        c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
      }
      t[i] = c >>> 0;
    }
    return t;
  })());
  const bytes = new Uint8Array(buffer);
  let crc = 0xFFFFFFFF;
  for (let i = 0; i < bytes.length; i++) {
    crc = table[(crc ^ bytes[i]) & 0xFF] ^ (crc >>> 8);
  }
  return (crc ^ 0xFFFFFFFF) >>> 0;
}

/**
 * Compute base64-encoded CRC32 per S3 requirement (big-endian 4-byte).
 */
export async function computeCrc32Base64(file: File): Promise<string> {
  const buf = await file.arrayBuffer();
  const sum = crc32(buf);
  const be = new Uint8Array([
    (sum >>> 24) & 0xFF,
    (sum >>> 16) & 0xFF,
    (sum >>> 8) & 0xFF,
    sum & 0xFF,
  ]);
  // base64 encode
  let binary = '';
  for (let i = 0; i < be.length; i++) binary += String.fromCharCode(be[i]);
  return btoa(binary);
}

export interface InitiateUploadOptions {
  groupId?: string;
  checksumCrc32?: string;
  context?: UploadContext;
}

/**
 * Initiate an upload session for a file. Returns a short-lived signed PUT URL and headers.
 * Relies on auth handled by httpInterceptor.
 * 
 * @param file - The file to upload
 * @param options - Optional parameters:
 *   - groupId: for group attachments
 *   - checksumCrc32: base64-encoded CRC32 checksum
 *   - context: 'syllabus' or 'attachment' (controls allowed MIME types on BE)
 */
export async function initiateUpload(file: File, options?: InitiateUploadOptions): Promise<UploadInitResponse> {
  const { groupId, checksumCrc32, context } = options || {};
  const body = {
    mimeType: file.type,
    sizeBytes: file.size,
    fileName: safeFileName(file.name, 255),
    ...(groupId ? { groupId } : {}),
    ...(checksumCrc32 ? { checksumCrc32 } : {}),
    ...(context ? { context } : {}),
  };
  const res: any = await post('uploads/initiate', body);
  const data = res?.data ?? res;
  return data as UploadInitResponse;
}

/**
 * Upload a file to S3 using the provided signed PUT URL. Must include Content-Type.
 * Throws on non-2xx responses.
 */
export async function uploadToS3(
  putUrl: string,
  headers: Record<string, string>,
  file: File,
  onProgress?: (progress01: number) => void
): Promise<void> {
  // Use XHR to report progress reliably
  await new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', putUrl, true);
    // Set headers returned from initiate (e.g., Content-Type, x-amz-checksum-crc32)
    Object.entries(headers || {}).forEach(([k, v]) => {
      try { xhr.setRequestHeader(k, v as any); } catch {}
    });
    if (onProgress) {
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) onProgress(Math.max(0, Math.min(1, e.loaded / e.total)));
      };
    }
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status >= 200 && xhr.status < 300) {
          if (onProgress) onProgress(1);
          resolve();
        } else {
          // Status 0 typically means CORS blocked, network failure, or request aborted
          if (xhr.status === 0) {
            console.error('[S3 Upload] Request failed with status 0. Possible causes: CORS, network issue, or ad blocker.');
            console.error('[S3 Upload] PUT URL domain:', new URL(putUrl).hostname);
            reject(new Error('Upload failed. Please check your internet connection and try again.'));
          } else {
            // Try to get more info from the response
            const responseText = xhr.responseText || '';
            console.error(`[S3 Upload] Failed with status ${xhr.status}:`, responseText);
            reject(new Error(`Upload failed (${xhr.status}). Please try again.`));
          }
        }
      }
    };
    xhr.onerror = () => {
      console.error('[S3 Upload] Network error occurred');
      reject(new Error('Upload failed due to a network error. Please check your connection.'));
    };
    xhr.ontimeout = () => {
      console.error('[S3 Upload] Request timed out');
      reject(new Error('Upload timed out. Please try again with a smaller file or better connection.'));
    };
    xhr.send(file);
  });
}

/**
 * Build an AttachmentDescriptor from a file and the returned fileId. Optional media metadata can be provided.
 */
export function toAttachmentDescriptor(
  file: File,
  fileId: string,
  extras?: Partial<Pick<AttachmentDescriptor, 'width' | 'height' | 'duration' | 'checksum'>>
): AttachmentDescriptor {
  return {
    fileId,
    fileName: safeFileName(file.name, 255),
    mimeType: file.type,
    sizeBytes: file.size,
    ...(extras || {}),
  };
}


