'use client';

import React, { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Sparkles, X, Trophy } from 'lucide-react';

export const AchievementToast: React.FC = () => {
  const { notification, dismissNotification } = useAuth();

  useEffect(() => {
    if (!notification) return;
    const timer = setTimeout(() => {
      dismissNotification();
    }, 4500);
    return () => clearTimeout(timer);
  }, [notification, dismissNotification]);

  if (!notification) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 99999,
        backgroundColor: '#111624',
        border: '1px solid var(--accent-gold)',
        borderRadius: '16px',
        padding: '1rem 1.25rem',
        boxShadow: '0 12px 36px rgba(0, 0, 0, 0.6), 0 0 24px rgba(245, 158, 11, 0.25)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.85rem',
        maxWidth: '380px',
        animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      <div
        style={{
          width: '44px',
          height: '44px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.4rem',
          boxShadow: '0 4px 12px rgba(245, 158, 11, 0.4)',
        }}
      >
        {notification.icon || '🏆'}
      </div>

      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.2rem' }}>
          <Sparkles size={13} color="var(--accent-gold)" />
          <span style={{ fontSize: '0.72rem', color: 'var(--accent-gold)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Achievement Unlocked!
          </span>
        </div>
        <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#ffffff' }}>
          {notification.title}
        </div>
        <div style={{ fontSize: '0.78rem', color: '#34d399', fontWeight: 700, marginTop: '0.1rem' }}>
          +{notification.xpReward} XP Earned! ⭐
        </div>
      </div>

      <button
        onClick={dismissNotification}
        style={{
          background: 'none',
          border: 'none',
          color: 'var(--text-muted)',
          cursor: 'pointer',
          padding: '0.25rem',
        }}
      >
        <X size={16} />
      </button>
    </div>
  );
};
