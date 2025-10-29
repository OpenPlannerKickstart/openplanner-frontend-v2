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
  // POST /groups/suggestions
  http.post(suggestionsPath, async ({ request }) => {
    try {
      // Minimal CSRF check for development mocks. The real backend should enforce CSRF.
      const csrf = request.headers.get('x-csrf-token') || request.headers.get('X-CSRF-Token');
      if (!csrf) {
        return HttpResponse.json(
          { code: 'FORBIDDEN', message: 'Missing CSRF token' },
          { status: 403 }
        );
      }
      const body = (await request.json()) as Record<string, any>;
      const includeArchived = Boolean((body as any)?.includeArchived);
      const limit = Math.min(Number((body as any)?.limit) || 10, 20);

      const groups = (seed as any).groups as any[];
      const candidates: SuggestionCandidate[] = groups
        .filter(g => includeArchived ? true : !g.archived)
        .slice(0, limit)
        .map(g => ({
          id: g.id,
          type: g.type,
          name: escapeHtml(g.name),
          course: g.course ? { ...g.course, title: escapeHtml((g.course as any).title) } : null,
          privacy: g.privacy,
          memberCount: g.memberCount,
          memberAvatars: g.memberAvatars?.slice(0, 4) ?? [],
          lastActivityAt: g.lastActivityAt,
          archived: Boolean(g.archived),
          reasons: ['Exact course match'],
        }));

      await delay(150);
      return HttpResponse.json({ candidates, canonicalExists: Boolean(candidates.length) });
    } catch (e) {
      return HttpResponse.json({ code: 'FORBIDDEN', message: 'Bad request' }, { status: 403 });
    }
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


