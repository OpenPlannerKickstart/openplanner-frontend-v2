export type UUID = string;

export type Term = 'Fall' | 'Spring' | 'Summer' | 'Winter';
export type GroupType = 'canonical' | 'subgroup';
export type Privacy = 'public' | 'invite_only' | 'request_to_join';

export type ErrorCode =
  | 'NOT_MEMBER'
  | 'FORBIDDEN'
  | 'RATE_LIMITED'
  | 'GROUP_ARCHIVED'
  | 'INVITE_EXPIRED'
  | 'ALREADY_MEMBER'
  | 'MAX_SIZE_REACHED';

export interface ErrorPayload {
  code: ErrorCode;
  message: string;
  details?: Record<string, any>;
}

export interface CourseInfo {
  code: string;           // "MATH 101"
  title?: string | null;  // "Calculus I"
  term: Term;             // "Fall"
  year: number;           // 2025
  schoolId: UUID;
}

export interface GroupSummary {
  id: UUID;
  type: GroupType;                // 'canonical' | 'subgroup'
  name?: string | null;           // canonical display "CODE — Term Year" or subgroup name
  privacy: Privacy;               // 'public' | 'invite_only' | 'request_to_join'
  memberCount: number;
  memberAvatars?: string[];       // max 4
  lastActivityAt: string;         // ISO 8601 Z
  archived: boolean;
  course?: CourseInfo | null;     // present for canonical; null for subgroup
}

export interface GroupDetail extends GroupSummary {
  description?: string | null;
  maxMembers?: number | null;
  parentGroupId?: UUID | null;    // if subgroup under a canonical
}

export interface SuggestionCandidate {
  id: UUID;
  type: GroupType;
  name: string;
  course?: CourseInfo | null;
  privacy: Privacy;
  memberCount: number;
  memberAvatars?: string[];       // max 4
  lastActivityAt: string;         // ISO 8601 Z
  archived: boolean;
  reasons: string[];
}

export interface MessageSender {
  id: string;
  name: string;
  avatar?: string | null;
}

export interface Message {
  id: UUID;
  groupId: UUID;
  sender: MessageSender;
  content: string;                // <= 4000 chars
  createdAt: string;              // ISO 8601 Z
  clientId?: string | null;       // for optimistic dedupe
  deletedAt?: string | null;
  metadata?: Record<string, any> | null; // reserved (attachments later)
}

export interface Invite {
  url: string;
  token: string;
  expiresAt: string;              // ISO 8601 Z
  singleUse: boolean;
}

export interface MessagesResponse {
  messages: Message[];
  nextCursor?: string | null;     // base64(createdAt|id), opaque
}

/* Requests (for thunks/clients and MSW mocks) */
export interface SuggestionsRequest {
  syllabusId?: string;
  includeArchived?: boolean; // default false
  limit?: number;            // default 10, max 20
}

export interface CanonicalRequest {
  syllabusId: string;
}

export interface JoinLeaveRequest {
  groupId: UUID;
}

export interface CreateSubgroupRequest {
  type: 'subgroup';
  name: string;
  description?: string;
  privacy: Privacy;              // subgroup default invite_only in UX
  maxMembers?: number | null;
  parentGroupId?: UUID | null;
}

export interface GetMessagesRequest {
  id: UUID;                      // group id
  cursor?: string | null;
  limit?: number;                // default 50, max 100
}

export interface PostMessageRequest {
  id: UUID;                      // group id
  content: string;               // <= 4000
  clientId?: string;
}

export interface CreateInviteRequest {
  id: UUID;                      // group id
  expiresIn?: number;            // seconds (e.g., 86400)
  singleUse?: boolean;           // default true
}

export interface AcceptInviteRequest {
  token: string;
}

export interface ReportGroupRequest {
  id: UUID;
  reason: string;
}

export interface ReportMessageRequest {
  id: UUID;                      // message id
  reason: string;
}

/* Socket payloads */
export interface SocketSendMessage {
  groupId: UUID;
  clientId?: string;
  content: string;
}

export interface SocketMessageEvent {
  id: UUID;
  groupId: UUID;
  sender: MessageSender;
  content: string;
  createdAt: string;    // ISO
  clientId?: string;
}

export interface SocketTypingEvent {
  userId: string;
  isTyping: boolean;
  at: string;           // ISO
}

export interface SocketPresenceEvent {
  userId: string;
  state: 'joined' | 'left';
  at: string;           // ISO
  memberCount: number;
}


