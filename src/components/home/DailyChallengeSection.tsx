'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useTranslation } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { getDailyChallenge } from '@/lib/chess/dailyChallengeData';
import { Sparkles, Swords, Trophy, ArrowRight, Lock, Loader2 } from 'lucide-react';

export const DailyChallengeSection: React.FC = () => {
  const { t } = useTranslation();
  const { isAuthenticated, signInWithGoogle } = useAuth();
  const { puzzle } = getDailyChallenge();
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setIsSigningIn(true);
      await signInWithGoogle('/daily');
    } catch {
      setIsSigningIn(false);
    }
  };

  // Only show Daily Challenge section on Home page for logged-in users
  if (!isAuthenticated) {
    return null;
  }

  return (
    <section
      style={{
        position: 'relative',
        padding: '3.5rem 1.25rem',
        maxWidth: '1100px',
        margin: '0 auto',
      }}
    >
      <div
        className="glass-panel"
        style={{
          padding: '2.5rem 2rem',
          borderRadius: '24px',
          background:
            'linear-gradient(135deg, rgba(24, 32, 48, 0.95), rgba(15, 23, 42, 0.98))',
          border: '1px solid rgba(245, 158, 11, 0.4)',
          boxShadow:
            '0 20px 50px rgba(0, 0, 0, 0.6), 0 0 30px rgba(245, 158, 11, 0.1)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '2rem',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Ambient Top Glow */}
        <div
          style={{
            position: 'absolute',
            top: '-50px',
            right: '-50px',
            width: '220px',
            height: '220px',
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(245, 158, 11, 0.2) 0%, rgba(245, 158, 11, 0) 70%)',
            pointerEvents: 'none',
          }}
        />

        {/* Left Info Column */}
        <div style={{ flex: 1, minWidth: '300px', zIndex: 2 }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.35rem 0.85rem',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'rgba(245, 158, 11, 0.12)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              marginBottom: '1rem',
            }}
          >
            <Sparkles size={14} color="var(--accent-gold)" />
            <span
              style={{
                fontSize: '0.78rem',
                fontWeight: 800,
                color: 'var(--accent-gold)',
                textTransform: 'uppercase',
                letterSpacing: '1px',
              }}
            >
              ♟️ {t('dailyChallenge.cardBadge', 'Daily Chess Challenge')}
            </span>
          </div>

          <h2
            style={{
              fontSize: '2rem',
              fontWeight: 800,
              color: '#ffffff',
              margin: '0 0 0.65rem',
              lineHeight: 1.25,
            }}
          >
            {t('dailyChallenge.cardTitle', 'Can you find the winning move?')}
          </h2>

          <p
            style={{
              color: 'var(--text-secondary)',
              fontSize: '1rem',
              lineHeight: 1.6,
              margin: '0 0 1.5rem',
              maxWidth: '560px',
            }}
          >
            {t(
              'dailyChallenge.cardDesc',
              "Sharpen your tactical vision with today's handpicked chess puzzle. Earn +25 XP every single day!"
            )}
          </p>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              flexWrap: 'wrap',
            }}
          >
            {isAuthenticated ? (
              <Link
                href="/daily"
                className="btn-primary"
                style={{
                  padding: '0.85rem 1.85rem',
                  fontSize: '1rem',
                  boxShadow: '0 8px 24px rgba(245, 158, 11, 0.35)',
                }}
              >
                <Swords size={18} />
                <span>{t('dailyChallenge.playChallenge', 'PLAY CHALLENGE')}</span>
                <ArrowRight size={18} />
              </Link>
            ) : (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  flexWrap: 'wrap',
                }}
              >
                <Link
                  href="/daily"
                  className="btn-primary"
                  style={{
                    padding: '0.85rem 1.75rem',
                    fontSize: '0.98rem',
                    boxShadow: '0 8px 24px rgba(245, 158, 11, 0.35)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                  }}
                >
                  <Lock size={17} />
                  <span>{t('dailyChallenge.signInToPlay', 'Sign In to Play')}</span>
                  <ArrowRight size={17} />
                </Link>

                <button
                  onClick={handleGoogleSignIn}
                  disabled={isSigningIn}
                  className="btn-secondary"
                  style={{
                    padding: '0.85rem 1.35rem',
                    fontSize: '0.92rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    cursor: isSigningIn ? 'not-allowed' : 'pointer',
                    color: '#ffffff',
                  }}
                >
                  {isSigningIn ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>{t('auth.checkingAccount', 'Connecting...')}</span>
                    </>
                  ) : (
                    <>
                      <svg width="17" height="17" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                        />
                      </svg>
                      <span>{t('auth.signInWithGoogle', 'Sign in with Google')}</span>
                    </>
                  )}
                </button>
              </div>
            )}

            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                color: 'var(--accent-gold)',
                fontWeight: 700,
                fontSize: '0.9rem',
              }}
            >
              <Trophy size={16} />
              <span>
                {isAuthenticated
                  ? '+25 XP Daily Reward'
                  : '+25 XP Daily Streak • Sign in to save'}
              </span>
            </span>
          </div>
        </div>

        {/* Right Preview Card (Clickable to /daily) */}
        <Link
          href="/daily"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem 1.75rem',
            borderRadius: '18px',
            backgroundColor: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            minWidth: '240px',
            textAlign: 'center',
            zIndex: 2,
            textDecoration: 'none',
            color: 'inherit',
            transition: 'all 0.25s ease',
            cursor: 'pointer',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-3px)';
            e.currentTarget.style.borderColor = 'rgba(245, 158, 11, 0.45)';
            e.currentTarget.style.boxShadow = '0 12px 30px rgba(0, 0, 0, 0.5)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '14px',
              backgroundColor: 'rgba(245, 158, 11, 0.15)',
              border: '1px solid rgba(245, 158, 11, 0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.8rem',
              marginBottom: '0.85rem',
            }}
          >
            🎯
          </div>

          <span
            style={{
              fontSize: '0.78rem',
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              fontWeight: 700,
              letterSpacing: '1px',
              marginBottom: '0.25rem',
            }}
          >
            Today’s Puzzle
          </span>

          <div
            style={{
              fontSize: '1.05rem',
              fontWeight: 800,
              color: '#ffffff',
              marginBottom: '0.5rem',
            }}
          >
            {puzzle.title}
          </div>

          <div
            className="badge badge-purple"
            style={{ fontSize: '0.75rem', padding: '0.25rem 0.75rem' }}
          >
            {puzzle.themeLabel}
          </div>
        </Link>
      </div>
    </section>
  );
};
