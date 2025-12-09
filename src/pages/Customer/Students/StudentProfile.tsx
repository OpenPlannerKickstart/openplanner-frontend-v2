import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { get, post } from '../../../Utility/httpInterceptor';
import { getUserSubId } from '../../../Utility/Helper';
import { ENUMFORROUTES } from '../../../interfaces/enum';
import defaultAvatar from '/assets/images/avatar-default.svg';

interface StudentData {
  id: string;
  displayName: string;
  username: string;
  avatarUrl: string | null;
  school: {
    id: string | null;
    name: string;
  };
}

export default function StudentProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [student, setStudent] = useState<StudentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [startingDm, setStartingDm] = useState(false);

  useEffect(() => {
    if (!id) return;

    const currentUserSub = getUserSubId();
    if (currentUserSub && id === currentUserSub) {
      navigate(ENUMFORROUTES.SETTINGS, { replace: true });
      return;
    }

    setLoading(true);
    setError(null);

    get(`users/${id}`)
      .then((res: any) => {
        if (res?.status === 200 || res?.id) {
          setStudent(res.data || res);
        } else if (res?.status === 404) {
          setError('User not found');
        } else {
          setError('Failed to load profile');
        }
      })
      .catch(() => {
        setError('Failed to load profile');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const handleMessage = async () => {
    if (!id || startingDm) return;

    setStartingDm(true);
    try {
      const res: any = await post('dm', { recipientId: id });
      if (res?.threadId) {
        // Navigate to groups page with DM thread selected
        navigate(`${ENUMFORROUTES.GROUPS}?dm=${res.threadId}`);
      } else {
        console.error('Failed to create DM thread', res);
      }
    } catch (err) {
      console.error('Error starting DM:', err);
    } finally {
      setStartingDm(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="page-content">
        <div className="page-title-wrapper">
          <div className="page-title-left">
            <div className="page-title">
              <h4>Student Profile</h4>
            </div>
          </div>
        </div>
        <div className="content-area" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 300 }}>
          <div className="loader-container inline-loader" style={{ position: 'relative', background: 'transparent' }}>
            <svg className="inner-container" viewBox="0 0 35 35" height="35" width="35">
              <rect className="track" x="2.5" y="2.5" fill="none" strokeWidth="5px" width="32.5" height="32.5" />
              <rect className="car" x="2.5" y="2.5" fill="none" strokeWidth="5px" width="32.5" height="32.5" pathLength="100" />
            </svg>
          </div>
        </div>
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className="page-content">
        <div className="page-title-wrapper">
          <div className="page-title-left">
            <button
              type="button"
              className="btn btn-icon btn-outline-white"
              onClick={handleBack}
              style={{ marginRight: 12 }}
            >
              <i className="material-symbols-outlined">arrow_back</i>
            </button>
            <div className="page-title">
              <h4>Student Profile</h4>
            </div>
          </div>
        </div>
        <div className="content-area" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 300 }}>
          <div style={{ textAlign: 'center', color: '#6B7280' }}>
            <i className="material-symbols-outlined" style={{ fontSize: 48, marginBottom: 12, display: 'block' }}>person_off</i>
            <p>{error || 'User not found'}</p>
            <button type="button" className="btn btn-outline-primary mt-3" onClick={handleBack}>
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  const initials = (student.displayName || '')
    .split(' ')
    .map((s) => s[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'U';

  return (
    <div className="page-content">
      <div className="page-title-wrapper">
        <div className="page-title-left">
          <button
            type="button"
            className="btn btn-icon btn-outline-white"
            onClick={handleBack}
            style={{ marginRight: 12 }}
          >
            <i className="material-symbols-outlined">arrow_back</i>
          </button>
          <div className="page-title">
            <h4>Student Profile</h4>
          </div>
        </div>
      </div>

      <div className="content-area">
        <div
          style={{
            maxWidth: 520,
            margin: '0 auto',
            padding: 32,
            background: 'transparent',
            borderRadius: 0,
            boxShadow: 'none',
          }}
        >
          {/* Avatar */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
            <div
              style={{
                width: 120,
                height: 120,
                borderRadius: '50%',
                background: '#E5F3FF',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '3px solid #239BC2',
              }}
            >
              {student.avatarUrl ? (
                <img
                  src={student.avatarUrl}
                  alt={student.displayName}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <span style={{ fontSize: 40, fontWeight: 600, color: '#239BC2' }}>{initials}</span>
              )}
            </div>
          </div>

          {/* Name */}
          <h2
            style={{
              textAlign: 'center',
              fontSize: 24,
              fontWeight: 600,
              color: '#111827',
              marginBottom: 4,
            }}
          >
            {student.displayName}
          </h2>

          {/* Username */}
          {student.username && (
            <p
              style={{
                textAlign: 'center',
                fontSize: 14,
                color: '#6B7280',
                marginBottom: 16,
              }}
            >
              @{student.username}
            </p>
          )}

          {/* School */}
          {student.school?.name && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                marginBottom: 32,
                color: '#374151',
              }}
            >
              <i className="material-symbols-outlined" style={{ fontSize: 20 }}>school</i>
              <span style={{ fontSize: 15 }}>{student.school.name}</span>
            </div>
          )}

          {/* Message Button */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleMessage}
              disabled={startingDm}
              style={{
                minWidth: 180,
                height: 44,
                borderRadius: 10,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}
            >
              <i className="material-symbols-outlined" style={{ fontSize: 20 }}>chat</i>
              {startingDm ? 'Starting...' : 'Message'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

