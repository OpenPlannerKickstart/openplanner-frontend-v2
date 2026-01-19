import { get, post } from './httpInterceptor';

const REFERRAL_CODE_KEY = 'op_referral_code';
const REFERRAL_SENT_KEY = 'op_referrals_sent';
export const REFERRAL_EVENT = 'op-referral-sent';

const BASE_FREE_UPLOADS = 1;
const UNLOCKED_FREE_UPLOADS = 3;
const MAX_REFERRAL_LINKS = 1;

const safeGetItem = (key: string): string | null => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

const safeSetItem = (key: string, value: string) => {
  try {
    localStorage.setItem(key, value);
  } catch {}
};

const notifyReferralSent = (count: number) => {
  if (typeof window === 'undefined') return;
  try {
    window.dispatchEvent(new CustomEvent(REFERRAL_EVENT, { detail: { count } }));
  } catch {}
};

const generateCode = (): string => {
  const raw = Math.random().toString(36).slice(2, 10);
  return raw || Math.random().toString(36).slice(2, 10);
};

export const getReferralCode = (): string => {
  const existing = safeGetItem(REFERRAL_CODE_KEY);
  if (existing) return existing;
  const code = generateCode();
  safeSetItem(REFERRAL_CODE_KEY, code);
  return code;
};

export const buildReferralLink = (): string => {
  const code = getReferralCode();
  const origin = typeof window !== 'undefined' && window.location?.origin
    ? window.location.origin
    : 'https://open-planner.com';
  return `${origin}/registration?ref=${encodeURIComponent(code)}`;
};

export const getReferralSentCount = (): number => {
  const raw = safeGetItem(REFERRAL_SENT_KEY);
  const parsed = raw ? Number(raw) : 0;
  return Number.isFinite(parsed) ? Math.max(0, parsed) : 0;
};

export const recordReferralSent = (): number => {
  const current = getReferralSentCount();
  const next = Math.min(MAX_REFERRAL_LINKS, current + 1);
  safeSetItem(REFERRAL_SENT_KEY, String(next));
  notifyReferralSent(next);
  return next;
};

export const getFreemiumUploadLimit = (referralSentCount: number): number => {
  const referrals = Math.max(0, Math.min(MAX_REFERRAL_LINKS, referralSentCount));
  if (referrals >= 1) return UNLOCKED_FREE_UPLOADS;
  return BASE_FREE_UPLOADS;
};

export const syncReferralSentCount = (count: number): number => {
  const next = Math.max(0, Math.min(MAX_REFERRAL_LINKS, count));
  safeSetItem(REFERRAL_SENT_KEY, String(next));
  notifyReferralSent(next);
  return next;
};

export const fetchReferralStatus = async (): Promise<number> => {
  try {
    const res: any = await get('api/referrals/status');
    const data = res?.data?.data ?? res?.data ?? {};
    const sent = !!data?.referral_sent;
    return syncReferralSentCount(sent ? 1 : 0);
  } catch {
    return getReferralSentCount();
  }
};

export const markReferralSentRemote = async (): Promise<void> => {
  try {
    await post('api/referrals/mark-sent', {});
  } catch {}
};
