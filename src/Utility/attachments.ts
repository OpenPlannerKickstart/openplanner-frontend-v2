export const ATTACH_ALLOWED_MIME = new Set<string>([
  'image/png',
  'image/jpeg',
  'image/webp',
  'application/pdf',
]);

export const ATTACH_ACCEPT_INPUT = Array.from(ATTACH_ALLOWED_MIME).join(',');

export const ATTACH_MAX_MB = 10; // Backend-enforced; mirror for client validation
export const ATTACH_MAX_BYTES = ATTACH_MAX_MB * 1024 * 1024;

export const ATTACH_MAX_PER_MESSAGE = 4;

export function isMimeAllowed(mimeType: string): boolean {
  return ATTACH_ALLOWED_MIME.has(mimeType);
}

export function isSizeAllowed(sizeBytes: number): boolean {
  return sizeBytes > 0 && sizeBytes <= ATTACH_MAX_BYTES;
}


