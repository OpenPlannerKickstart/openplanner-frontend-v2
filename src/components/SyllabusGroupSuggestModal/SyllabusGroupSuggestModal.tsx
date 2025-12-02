import React from 'react';
import { CanonicalResponse, SuggestCandidate } from '../../hooks/useSyllabusGroupSuggest';

type MemberPreview = {
  id: string;
  displayName?: string | null;
  picture?: string | null;
};

type Props = {
  open: boolean;
  loading?: boolean;
  candidate?: SuggestCandidate | null;
  canonicalPreview?: CanonicalResponse | null;
  onJoin: () => void | Promise<void>;
  onClose: () => void;
};

export default function SyllabusGroupSuggestModal({
  open,
  loading,
  candidate,
  canonicalPreview,
  onJoin,
  onClose,
}: Props) {
  if (!open) return null;

  const title = candidate ? 'Is this your class?' : "You're first to join this class group!";
  const subtitle = (() => {
    const course = candidate?.course || canonicalPreview?.course;
    const code = course?.code || '';
    const term = course?.term || '';
    const year = course?.year || '';
    return [code, (term && year) ? `${term} ${year}` : null].filter(Boolean).join(' — ');
  })();
  const name = candidate?.name || canonicalPreview?.name || '';
  const members: MemberPreview[] =
    candidate?.memberPreviews || canonicalPreview?.memberPreviews || [];

  const firstThree = (members || []).slice(0, 3);

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.45)',
        zIndex: 5000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#FFFFFF',
          border: '1px solid #E5E7EB',
          borderRadius: 12,
          width: '100%',
          maxWidth: 520,
          boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
        }}
      >
        <div style={{ padding: 18, borderBottom: '1px solid #F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 18, fontWeight: 600, color: '#111827' }}>{title}</div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            title="Close"
            className="btn-close"
          >
            <i className="material-symbols-outlined">close</i>
          </button>
        </div>
        <div style={{ padding: 18 }}>
          {name ? (
            <div style={{ fontSize: 16, fontWeight: 600, color: '#111827', marginBottom: 6 }}>{name}</div>
          ) : null}
          {subtitle ? (
            <div style={{ fontSize: 16, color: '#6B7280', marginBottom: 12 }}>{subtitle}</div>
          ) : null}

          {firstThree.length > 0 ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              {firstThree.map((m) => (
                <div key={m.id} title={m.displayName || ''} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      background: '#F3F4F6',
                      overflow: 'hidden',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1px solid #E5E7EB',
                    }}
                  >
                    {m.picture ? (
                      <img src={m.picture} alt={m.displayName || 'member'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <span style={{ fontSize: 12, color: '#374151' }}>
                        {(m.displayName || '').split(' ').map(s => s[0]).join('').slice(0, 2).toUpperCase() || 'U'}
                      </span>
                    )}
                  </div>
                </div>
              ))}
              {members.length > 3 ? (
                <span style={{ fontSize: 13, color: '#6B7280' }}>+{members.length - 3} more</span>
              ) : null}
            </div>
          ) : null}

          {candidate ? (
            <div style={{ fontSize: 13, color: '#6B7280', marginBottom: 8 }}>
              You can join this class group now.
            </div>
          ) : (
            <div style={{ fontSize: 13, color: '#6B7280', marginBottom: 8 }}>
              We’ll create the class group and add you as a member.
            </div>
          )}
        </div>
        <div style={{ padding: 18, borderTop: '1px solid #F3F4F6', display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
          <button
            onClick={() => onJoin()}
            disabled={!!loading}
            className="btn btn-primary"
            style={{ minWidth: 160, height: 40, borderRadius: 10 }}
          >
            {candidate ? 'Join Class Group' : 'Create & Join'}
          </button>
        </div>
      </div>
    </div>
  );
}


