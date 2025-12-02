import { http, HttpResponse, delay, passthrough } from 'msw';
import seed from '../groups/seed.json';
import type {
  SuggestionCandidate,
  GroupDetail,
  Invite,
} from '../../interfaces/groups';

const API_BASE = '';

// Basic HTML-escape utility for mock data to reduce the risk of XSS in development
const escapeHtml = (value: unknown): string => {
  if (typeof value !== 'string') return value as any;
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
};

const suggestionsPath = `${API_BASE}/groups/suggestions`;
// const messagesPath = (id: string) => `${API_BASE}/groups/${id}/messages`;

export const groupsHandlers = [
  // POST /groups/suggestions → passthrough to real backend so dev sees true suggestions
  http.post(suggestionsPath, () => {
    return passthrough();
  }),

  // GET /groups/:id/messages → passthrough to real backend
  http.get(new RegExp(`/groups/([0-9a-fA-F-]+)/messages`), () => {
    return passthrough();
  }),

  // POST /groups/:id/messages → passthrough to real backend
  http.post(new RegExp(`/groups/([0-9a-fA-F-]+)/messages`), () => {
    return passthrough();
  }),

  // DELETE /groups/:groupId/messages/:messageId → passthrough
  http.delete(new RegExp(`/groups/([0-9a-fA-F-]+)/messages/([0-9a-fA-F-]+)`), () => {
    return passthrough();
  }),

  // POST /groups/join (with simple CSRF header validation in mocks)
  http.post(`${API_BASE}/groups/join`, async ({ request }) => {
    const csrf = request.headers.get('x-csrf-token') || request.headers.get('X-CSRF-Token');
    if (!csrf) {
      return HttpResponse.json(
        { code: 'FORBIDDEN', message: 'Missing CSRF token' },
        { status: 403 }
      );
    }
    await delay(50);
    return HttpResponse.json({ ok: true });
  }),

  // POST /groups/leave → passthrough to real backend
  http.post(`${API_BASE}/groups/leave`, () => {
    return passthrough();
  }),

  // POST /groups/:id/delete → let it hit the real backend (passthrough)
  http.post(new RegExp(`/groups/([0-9a-fA-F-]+)/delete`), () => {
    return passthrough();
  }),

  // POST /groups/create (subgroup) → passthrough to real backend
  http.post(`${API_BASE}/groups/create`, () => {
    return passthrough();
  }),

  // GET /groups/mine → passthrough to real backend
  http.get(`${API_BASE}/groups/mine`, () => {
    return passthrough();
  }),

  // GET /groups/:id
  // Passthrough to backend for dynamic groups
  http.get(new RegExp(`/groups/([0-9a-fA-F-]+)$`), () => {
    return passthrough();
  }),

  // POST /groups/:id/invites → passthrough to real backend (so FE sees real URL and headers)
  http.post(new RegExp(`/groups/([0-9a-fA-F-]+)/invites`), () => {
    return passthrough();
  }),

  // POST /invites/accept → passthrough to real backend
  http.post(`${API_BASE}/invites/accept`, () => {
    return passthrough();
  }),

  // POST /groups/:id/report
  http.post(new RegExp(`/groups/([0-9a-fA-F-]+)/report`), async () => {
    await delay(30);
    return HttpResponse.json({ ok: true });
  }),

  // POST /messages/:id/report
  http.post(new RegExp(`/messages/([0-9a-fA-F-]+)/report`), async () => {
    await delay(30);
    return HttpResponse.json({ ok: true });
  }),

  // POST /groups/:id/request-archive
  http.post(new RegExp(`/groups/([0-9a-fA-F-]+)/request-archive`), async () => {
    await delay(30);
    return HttpResponse.json({ ok: true });
  }),

  // --- New passthroughs for user search and direct invites/inbox ---
  // GET /users/search?q=
  http.get(new RegExp(`/users/search`), () => {
    return passthrough();
  }),

  // POST /groups/:groupId/invites/direct
  http.post(new RegExp(`/groups/([0-9a-fA-F-]+)/invites/direct`), () => {
    return passthrough();
  }),

  // GET /invites (inbox)
  http.get(`${API_BASE}/invites`, () => {
    return passthrough();
  }),

  // POST /invites/:id/accept
  http.post(new RegExp(`/invites/([0-9a-fA-F-]+)/accept`), () => {
    return passthrough();
  }),

  // POST /invites/:id/decline
  http.post(new RegExp(`/invites/([0-9a-fA-F-]+)/decline`), () => {
    return passthrough();
  }),
];


