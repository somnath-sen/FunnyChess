'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from '@/context/LanguageContext';
import { Sparkles, BookOpen, Trophy, ArrowRight, X } from 'lucide-react';

export const WelcomeOnboardingModal: React.FC = () => {
  const { isFirstTimeUser, dismissFirstTimeModal, user } = useAuth();
  const { t } = useTranslation();
  const router = useRouter();

  if (!isFirstTimeUser || !user || user.isGuest) return null;

  const handleStartLearning = async () => {
    await dismissFirstTimeModal();
    router.push('/learn');
  };

  const handleDismiss = async () => {
    await dismissFirstTimeModal();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(5, 8, 15, 0.85)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2000,
        padding: '1.25rem',
      }}
      onClick={handleDismiss}
    >
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '500px',
          padding: '2.5rem 2rem',
          backgroundColor: '#101624',
          border: '1px solid rgba(245, 158, 11, 0.4)',
          borderRadius: '24px',
          position: 'relative',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8), 0 0 35px rgba(245, 158, 11, 0.2)',
          textAlign: 'center',
          animation: 'scaleIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close icon button */}
        <button
          onClick={handleDismiss}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            color: 'var(--text-muted)',
            padding: '0.4rem',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
          aria-label="Close"
        >
          <X size={18} />
        </button>

        {/* Mascot / Avatar Header */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '80px',
            height: '80px',
            borderRadius: '24px',
            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(217, 119, 6, 0.1))',
            border: '2px solid rgba(245, 158, 11, 0.4)',
            boxShadow: '0 8px 20px rgba(245, 158, 11, 0.25)',
            marginBottom: '1.25rem',
            fontSize: '2.5rem',
          }}
        >
          ♟️
        </div>

        {/* Title and Welcome */}
        <h2
          style={{
            fontSize: '1.85rem',
            fontWeight: 800,
            margin: '0 0 0.4rem',
            color: '#ffffff',
            letterSpacing: '-0.02em',
          }}
        >
          {t('onboarding.welcomeTitle', 'Welcome to FunnyChess!')}
        </h2>
        <p
          style={{
            fontSize: '1.02rem',
            color: 'var(--accent-gold)',
            fontWeight: 600,
            margin: '0 0 1.5rem',
          }}
        >
          {t('onboarding.welcomeSubtitle', 'Your chess journey starts here.')}
        </p>

        {/* Starting Stats Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '0.85rem',
            marginBottom: '1.5rem',
            textAlign: 'left',
          }}
        >
          {/* Starting Rank Badge */}
          <div
            style={{
              padding: '0.9rem 1rem',
              borderRadius: '14px',
              backgroundColor: 'rgba(139, 92, 246, 0.1)',
              border: '1px solid rgba(139, 92, 246, 0.25)',
            }}
          >
            <div style={{ fontSize: '0.75rem', color: '#c4b5fd', fontWeight: 700, textTransform: 'uppercase' }}>
              Starting Rank
            </div>
            <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#ffffff', marginTop: '0.2rem' }}>
              🐎 {t('onboarding.startingRank', 'Level 2: Piece Explorer')}
            </div>
          </div>

          {/* Starting XP Badge */}
          <div
            style={{
              padding: '0.9rem 1rem',
              borderRadius: '14px',
              backgroundColor: 'rgba(245, 158, 11, 0.1)',
              border: '1px solid rgba(245, 158, 11, 0.25)',
            }}
          >
            <div style={{ fontSize: '0.75rem', color: '#fcd34d', fontWeight: 700, textTransform: 'uppercase' }}>
              Starting XP
            </div>
            <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#ffffff', marginTop: '0.2rem' }}>
              ⭐ {t('onboarding.startingXp', '250 XP Starting Boost')}
            </div>
          </div>

          {/* Lessons Count */}
          <div
            style={{
              padding: '0.9rem 1rem',
              borderRadius: '14px',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
            }}
          >
            <div style={{ fontSize: '0.75rem', color: '#6ee7b7', fontWeight: 700, textTransform: 'uppercase' }}>
              Lessons
            </div>
            <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#ffffff', marginTop: '0.2rem' }}>
              📚 {t('onboarding.lessonsCount', '0 / 25 Lessons Completed')}
            </div>
          </div>

          {/* Matches Count */}
          <div
            style={{
              padding: '0.9rem 1rem',
              borderRadius: '14px',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              border: '1px solid rgba(59, 130, 246, 0.25)',
            }}
          >
            <div style={{ fontSize: '0.75rem', color: '#93c5fd', fontWeight: 700, textTransform: 'uppercase' }}>
              Game Record
            </div>
            <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#ffffff', marginTop: '0.2rem' }}>
              ⚔️ {t('onboarding.gamesCount', '0 Matches Played')}
            </div>
          </div>
        </div>

        {/* Motivational Description */}
        <p
          style={{
            fontSize: '0.92rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.5,
            marginBottom: '1.75rem',
          }}
        >
          {t(
            'onboarding.description',
            'No boring 400-page textbooks. Learn piece movements with jokes, practice with friendly AI, and level up stress-free!'
          )}
        </p>

        {/* Primary CTA Button */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <button
            onClick={handleStartLearning}
            className="btn-primary"
            style={{
              width: '100%',
              padding: '0.95rem 1.5rem',
              fontSize: '1.05rem',
              fontWeight: 700,
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.65rem',
              cursor: 'pointer',
              boxShadow: '0 4px 20px rgba(245, 158, 11, 0.4)',
            }}
          >
            <BookOpen size={20} />
            <span>{t('onboarding.btnStartLearning', 'Start Learning (Free)')}</span>
            <ArrowRight size={18} />
          </button>

          <button
            onClick={handleDismiss}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              fontSize: '0.9rem',
              padding: '0.5rem',
              cursor: 'pointer',
              fontWeight: 500,
              transition: 'color 0.15s ease',
            }}
          >
            {t('onboarding.btnExplore', 'Explore Freely')}
          </button>
        </div>
      </div>
    </div>
  );
};
