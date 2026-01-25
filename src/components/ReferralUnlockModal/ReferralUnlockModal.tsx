import React, { useMemo, useRef, useState, useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { ENUMFORROUTES } from "../../interfaces/enum";
import { ts, te } from "../../Utility/Toaster";
import {
  getFreemiumUploadLimit,
  markReferralSentRemote,
} from "../../Utility/referrals";

type ReferralUnlockModalProps = {
  show: boolean;
  onClose: () => void;
  referralLink: string;
  referralSentCount: number;
  existingSyllabusCount: number;
  onReferralSent: () => number;
};

const MAX_REFERRALS = 1;

const ReferralUnlockModal: React.FC<ReferralUnlockModalProps> = ({
  show,
  onClose,
  referralLink,
  referralSentCount,
  existingSyllabusCount,
  onReferralSent,
}) => {
  const navigate = useNavigate();
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">(
    "idle"
  );
  const [isUnlocking, setIsUnlocking] = useState(false);
  const unlockTimerRef = useRef<number | null>(null);
  const unlockCountdownRef = useRef<number | null>(null);
  const [unlockCountdown, setUnlockCountdown] = useState<number | null>(null);

  useEffect(() => {
    return () => {
      if (unlockTimerRef.current) window.clearTimeout(unlockTimerRef.current);
      if (unlockCountdownRef.current)
        window.clearInterval(unlockCountdownRef.current);
    };
  }, []);

  const remainingReferrals = Math.max(0, MAX_REFERRALS - referralSentCount);
  const unlockedUploads = referralSentCount > 0 ? 3 : 1;

  const copyLabel = useMemo(() => {
    if (copyState === "copied") return "Link copied";
    if (copyState === "failed") return "Copy failed";
    return "Copy referral link";
  }, [copyState]);

  const tryCopy = async () => {
    try {
      if (navigator?.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(referralLink);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = referralLink;
        textarea.setAttribute("readonly", "");
        textarea.style.position = "absolute";
        textarea.style.left = "-9999px";
        document.body.appendChild(textarea);
        textarea.select();
        const ok = document.execCommand("copy");
        document.body.removeChild(textarea);
        if (!ok) throw new Error("copy failed");
      }

      ts("Referral link copied.");
      startUnlockTimer();
      setCopyState("copied");
    } catch {
      setCopyState("failed");
      te("Unable to copy referral link.");
    }
  };

  const startUnlockTimer = () => {
    if (isUnlocking || remainingReferrals <= 0) return;
    setIsUnlocking(true);
    setUnlockCountdown(10);
    if (unlockCountdownRef.current)
      window.clearInterval(unlockCountdownRef.current);
    unlockCountdownRef.current = window.setInterval(() => {
      setUnlockCountdown((prev) => {
        if (prev === null || prev <= 1) {
          if (unlockCountdownRef.current)
            window.clearInterval(unlockCountdownRef.current);
          unlockCountdownRef.current = null;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    unlockTimerRef.current = window.setTimeout(() => {
      const nextCount = onReferralSent();
      markReferralSentRemote();
      const nextLimit = getFreemiumUploadLimit(nextCount);
      if (existingSyllabusCount < nextLimit) {
        ts("Referral shared. Uploads 2 and 3 are unlocked.");
        onClose();
      } else {
        ts(`Referral shared. (${nextCount}/${MAX_REFERRALS})`);
      }
      setIsUnlocking(false);
    }, 10000);
  };

  return (
    <Modal
      className="modal-theme modal-confirmation"
      show={show}
      onHide={onClose}
      centered
      backdrop
      keyboard
    >
      <Modal.Body>
        <div className="modal-confirmation-container">
          <div
            style={{
              width: "54px",
              height: "54px",
              borderRadius: "50%",
              background: "#e8f4f8",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto",
              color: "#4AAED4",
            }}
          >
            <svg
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M4 12v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-6" />
              <path d="M16 6l-4-4-4 4" />
              <path d="M12 2v14" />
            </svg>
          </div>
          <div className="modal-confirmation-content">
            <h5>Unlock your next syllabus upload</h5>
            <p>Copy your referral link to unlock uploads 2 and 3.</p>
            <p style={{ marginTop: 8, color: "var(--neutral-500)" }}>
              Referral sent: {referralSentCount}/{MAX_REFERRALS} · Uploads
              unlocked: {unlockedUploads}/3
            </p>
            <div style={{ marginTop: 12 }}>
              <input
                type="text"
                readOnly
                value={referralLink}
                className="form-control"
                style={{ fontSize: 12 }}
              />
            </div>
            {isUnlocking && unlockCountdown !== null && (
              <p style={{ marginTop: 10, color: "var(--neutral-500)" }}>
                Unlocking in {unlockCountdown}s…
              </p>
            )}
          </div>
        </div>

        <div className="modal-button-group modal-full-width-btn modal-footer-button">
          <Button
            variant="light-white"
            className="btn-md"
            onClick={() => navigate(ENUMFORROUTES.PLAN_DETAILS)}
          >
            Upgrade
          </Button>
          <Button variant="primary" className="btn-md" onClick={tryCopy}>
            {copyLabel}
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ReferralUnlockModal;
