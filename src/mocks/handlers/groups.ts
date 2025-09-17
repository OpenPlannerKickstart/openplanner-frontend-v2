import { http, HttpResponse, delay, passthrough } from 'msw';
import seed from '../groups/seed.json';
import type {
  MessagesResponse,
  SuggestionCandidate,
  GroupDetail,
  GroupSummary,
  Invite,
  Message,
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
const messagesPath = (id: string) => `${API_BASE}/groups/${id}/messages`;

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

  // GET /groups/:id/messages
  http.get(new RegExp(`/groups/([0-9a-fA-F-]+)/messages`), async ({ params, request }) => {
    const id = (params as any)[0];
    const url = new URL(request.url);
    const limit = Math.min(Number(url.searchParams.get('limit') || '50'), 100);

    const messages = ((seed as any).messages as Message[])
      .filter(m => m.groupId === id)
      .slice(0, limit)
      .map((m) => ({
        ...m,
        content: escapeHtml(m.content),
        sender: m.sender ? { ...m.sender, name: escapeHtml((m.sender as any).name) } : m.sender,
      }));
    const res: MessagesResponse = { messages, nextCursor: null };
    await delay(120);
    return HttpResponse.json(res);
  }),

  // POST /groups/:id/messages
  http.post(new RegExp(`/groups/([0-9a-fA-F-]+)/messages`), async ({ params, request }) => {
    const id = (params as any)[0];
    const body = (await request.json()) as Record<string, any>;
    // Minimal CSRF check for development mocks. Backend must enforce proper protection.
    const csrf = request.headers.get('x-csrf-token') || request.headers.get('X-CSRF-Token');
    if (!csrf) {
      return HttpResponse.json(
        { code: 'FORBIDDEN', message: 'Missing CSRF token' },
        { status: 403 }
      );
    }
    const content = String((body as any)?.content || '');
    if (content.length > 4000) {
      return HttpResponse.json({ code: 'RATE_LIMITED', message: 'Content too long' }, {
        status: 429,
        headers: {
          'Retry-After': '2',
          'X-RateLimit-Limit': '60',
          'X-RateLimit-Remaining': '59',
          'X-RateLimit-Reset': String(Math.floor(Date.now() / 1000) + 2),
        }
      });
    }

    const msg: Message = {
      id: crypto.randomUUID(),
      groupId: id as string,
      sender: { id: 'me', name: 'You' },
      content: escapeHtml(content),
      createdAt: new Date().toISOString(),
      clientId: (body as any)?.clientId ?? undefined,
    };
    await delay(80);
    return HttpResponse.json(msg);
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
  http.get(new RegExp(`/groups/([0-9a-fA-F-]+)$`), async ({ params }) => {
    const id = (params as any)[0];
    const groupRaw = ((seed as any).groups as GroupDetail[]).find(g => g.id === id);
    if (!groupRaw) return HttpResponse.json({ code: 'FORBIDDEN', message: 'Not found' }, { status: 404 });
    // Sanitize string fields to minimize XSS risk in dev
    const group: GroupDetail = {
      ...groupRaw,
      name: escapeHtml((groupRaw as any).name),
      description: escapeHtml((groupRaw as any).description),
    } as any;
    await delay(50);
    return HttpResponse.json(group);
  }),

  // POST /groups/:id/invites
  http.post(new RegExp(`/groups/([0-9a-fA-F-]+)/invites`), async ({ params, request }) => {
    const csrf = request.headers.get('x-csrf-token') || request.headers.get('X-CSRF-Token');
    if (!csrf) {
      return HttpResponse.json(
        { code: 'FORBIDDEN', message: 'Missing CSRF token' },
        { status: 403 }
      );
    }
    const id = (params as any)[0];
    const token = crypto.randomUUID();
    const invite: Invite = {
      url: escapeHtml(`${location.origin}/invite/${token}`),
      token: escapeHtml(token),
      expiresAt: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
      singleUse: true,
    };
    await delay(50);
    return HttpResponse.json(invite);
  }),

  // POST /invites/accept (with simple CSRF header validation in mocks)
  http.post(`${API_BASE}/invites/accept`, async ({ request }) => {
    // Minimal CSRF check for development mocks. The real backend should
    // implement robust CSRF/session protection. Here we require a header key.
    const csrf = request.headers.get('x-csrf-token') || request.headers.get('X-CSRF-Token');
    if (!csrf) {
      return HttpResponse.json(
        { code: 'FORBIDDEN', message: 'Missing CSRF token' },
        { status: 403 }
      );
    }
    await delay(50);
    const gid = escapeHtml(String((seed as any).groups?.[0]?.id ?? ''));
    return HttpResponse.json({ ok: true, groupId: gid });
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
];


