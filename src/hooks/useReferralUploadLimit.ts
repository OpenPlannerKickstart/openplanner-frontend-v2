import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  buildReferralLink,
  fetchReferralStatus,
  getFreemiumUploadLimit,
  getReferralSentCount,
  recordReferralSent,
  REFERRAL_EVENT,
} from '../Utility/referrals';

type ReferralUploadLimitArgs = {
  isFreemiumPlan: boolean;
  hasSubscription: boolean;
  existingSyllabusCount: number;
};

export const useReferralUploadLimit = ({
  isFreemiumPlan,
  hasSubscription,
  existingSyllabusCount,
}: ReferralUploadLimitArgs) => {
  const [referralSentCount, setReferralSentCount] = useState(getReferralSentCount());

  useEffect(() => {
    let mounted = true;
    fetchReferralStatus()
      .then((count) => {
        if (mounted) setReferralSentCount(count);
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const handler = (event: Event) => {
      const custom = event as CustomEvent;
      const next =
        typeof custom?.detail?.count === 'number'
          ? custom.detail.count
          : getReferralSentCount();
      setReferralSentCount(next);
    };
    window.addEventListener(REFERRAL_EVENT, handler as EventListener);
    return () => window.removeEventListener(REFERRAL_EVENT, handler as EventListener);
  }, []);

  const maxUploads = useMemo(() => {
    if (!isFreemiumPlan || hasSubscription) return Number.POSITIVE_INFINITY;
    return getFreemiumUploadLimit(referralSentCount);
  }, [isFreemiumPlan, hasSubscription, referralSentCount]);

  const limitReached =
    Number.isFinite(maxUploads) && existingSyllabusCount >= maxUploads;

  const upgradeRequired = useMemo(() => {
    if (!isFreemiumPlan || hasSubscription) return false;
    const limit = getFreemiumUploadLimit(referralSentCount);
    return referralSentCount >= 1 && existingSyllabusCount >= limit;
  }, [isFreemiumPlan, hasSubscription, referralSentCount, existingSyllabusCount]);

  const remainingUploads = Number.isFinite(maxUploads)
    ? Math.max(0, maxUploads - existingSyllabusCount)
    : Number.POSITIVE_INFINITY;

  const referralLink = useMemo(() => buildReferralLink(), []);

  const markReferralSent = useCallback(() => {
    const next = recordReferralSent();
    setReferralSentCount(next);
    return next;
  }, []);

  return {
    maxUploads,
    remainingUploads,
    limitReached,
    upgradeRequired,
    referralSentCount,
    referralLink,
    markReferralSent,
  };
};
