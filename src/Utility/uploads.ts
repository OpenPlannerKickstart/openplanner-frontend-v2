import { post } from './httpInterceptor';
import type { AttachmentDescriptor } from '../interfaces/groups';

export type UploadInitResponse = {
  fileId: string;
  putUrl: string;
  headers: Record<string, string>; // e.g., { 'Content-Type': mimeType, 'x-amz-checksum-crc32': '...' }
  expiresIn: number;
  signedHeaders?: string; // optional debug info from BE: value of X-Amz-SignedHeaders
};

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

/**
 * Initiate an upload session for a file. Returns a short-lived signed PUT URL and headers.
 * Relies on auth handled by httpInterceptor.
 */
export async function initiateUpload(file: File, groupId?: string, checksumCrc32?: string): Promise<UploadInitResponse> {
  const body = {
    mimeType: file.type,
    sizeBytes: file.size,
    fileName: file.name,
    ...(groupId ? { groupId } : {}),
    ...(checksumCrc32 ? { checksumCrc32 } : {}),
  };
  const res: any = await post('uploads/initiate', body);
  const data = res?.data ?? res;
  return data as UploadInitResponse;
}

/**
 * Upload a file to S3 using the provided signed PUT URL. Must include Content-Type.
 * Throws on non-2xx responses.
 */
export async function uploadToS3(putUrl: string, headers: Record<string, string>, file: File): Promise<void> {
  const response = await fetch(putUrl, {
    method: 'PUT',
    headers,
    body: file,
    // Note: Do not send auth headers to S3 signed URLs
  });
  if (!response.ok) {
    // Surface the status for upper layers to map to UX when needed
    throw new Error(`S3 PUT failed with status ${response.status}`);
  }
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
    fileName: file.name,
    mimeType: file.type,
    sizeBytes: file.size,
    ...(extras || {}),
  };
}


