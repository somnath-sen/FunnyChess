'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Chessboard } from '@/components/Chessboard/Chessboard';
import { useTranslation } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import {
  getDailyChallenge,
  validateChallengeMove,
  DailyPuzzle,
} from '@/lib/chess/dailyChallengeData';
import { sounds } from '@/lib/audio/soundEffects';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  Trophy,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Calendar,
  HelpCircle,
} from 'lucide-react';

export default function DailyChallengePage() {
  const { t } = useTranslation();
  const {
    user,
    isAuthenticated,
    checkDailyChallengeCompleted,
    completeDailyChallenge,
  } = useAuth();

  const { puzzle, dateStr } = getDailyChallenge();

  const [currentFen, setCurrentFen] = useState<string>(puzzle.initialFen);
  const [status, setStatus] = useState<
    'idle' | 'solved' | 'incorrect' | 'checking'
  >('idle');
  const [alreadyCompleted, setAlreadyCompleted] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [xpAwardedThisSession, setXpAwardedThisSession] =
    useState<boolean>(false);

  // Check completion status from Supabase on mount
  useEffect(() => {
    let active = true;
    checkDailyChallengeCompleted(dateStr).then((done) => {
      if (active && done) {
        setAlreadyCompleted(true);
      }
    });
    return () => {
      active = false;
    };
  }, [dateStr, checkDailyChallengeCompleted]);

  // Handle player move attempt
  const handleMove = (from: string, to: string, promotion?: string) => {
    if (status === 'solved') return;

    const isCorrect = validateChallengeMove(puzzle, from, to, promotion);

    if (isCorrect) {
      setStatus('solved');
      sounds.playSuccess();
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {}

      // Record completion and award XP
      completeDailyChallenge(puzzle.id, dateStr).then((res) => {
        if (res.xpAwarded > 0) {
          setXpAwardedThisSession(true);
        }
        if (res.alreadyCompleted) {
          setAlreadyCompleted(true);
        }
      });
    } else {
      setStatus('incorrect');
      sounds.playError();
    }
  };

  const handleRetry = () => {
    setCurrentFen(puzzle.initialFen);
    setStatus('idle');
  };

  return (
    <div
      style={{
        minHeight: '100dvh',
        padding: '2.5rem 1.25rem 5rem',
        maxWidth: '900px',
        margin: '0 auto',
      }}
    >
      {/* Navigation Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <Link
          href="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            color: 'var(--text-secondary)',
            textDecoration: 'none',
            fontSize: '0.9rem',
            fontWeight: 600,
            padding: '0.4rem 0.8rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <ArrowLeft size={16} />
          <span>Back to Home</span>
        </Link>

        {/* Date & Streak Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.85rem',
            color: 'var(--text-muted)',
            fontWeight: 600,
          }}
        >
          <Calendar size={15} color="var(--accent-gold)" />
          <span>{dateStr}</span>
          {alreadyCompleted && (
            <span
              className="badge badge-emerald"
              style={{ fontSize: '0.72rem' }}
            >
              ✓ Completed Today
            </span>
          )}
        </div>
      </div>

      {/* Main Challenge Glass Card */}
      <div
        className="glass-panel"
        style={{
          padding: '2rem',
          borderRadius: '24px',
          background:
            'linear-gradient(135deg, rgba(20, 28, 45, 0.95), rgba(12, 17, 29, 0.98))',
          border: '1px solid rgba(245, 158, 11, 0.35)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.5rem',
        }}
      >
        {/* Title Header */}
        <div style={{ textAlign: 'center', maxWidth: '600px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.3rem 0.85rem',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'rgba(245, 158, 11, 0.15)',
              border: '1px solid rgba(245, 158, 11, 0.35)',
              marginBottom: '0.75rem',
            }}
          >
            <Sparkles size={14} color="var(--accent-gold)" />
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 800,
                color: 'var(--accent-gold)',
                textTransform: 'uppercase',
                letterSpacing: '1px',
              }}
            >
              {puzzle.themeLabel}
            </span>
          </div>

          <h1
            style={{
              fontSize: '1.85rem',
              fontWeight: 800,
              color: '#ffffff',
              margin: '0 0 0.5rem',
            }}
          >
            {puzzle.title}
          </h1>

          <p
            style={{
              color: 'var(--text-secondary)',
              fontSize: '0.95rem',
              lineHeight: 1.5,
              margin: 0,
            }}
          >
            🎯 <strong>{puzzle.objective}</strong>
          </p>
        </div>

        {/* Interactive Chessboard with 550ms Piece Movement */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            width: '100%',
          }}
        >
          <Chessboard
            fen={currentFen}
            orientation={puzzle.playerColor}
            interactive={status !== 'solved'}
            onMove={handleMove}
            customArrows={
              showHint
                ? [
                    {
                      from: puzzle.solution.from,
                      to: puzzle.solution.to,
                      color: '#f59e0b',
                    },
                  ]
                : []
            }
          />
        </div>

        {/* Feedback Section */}
        {status === 'solved' && (
          <div
            className="glass-panel"
            style={{
              width: '100%',
              maxWidth: '460px',
              padding: '1.25rem',
              borderRadius: '16px',
              backgroundColor: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid #10b981',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              gap: '0.65rem',
              animation: 'fadeIn 0.3s ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle2 size={24} color="#10b981" />
              <span
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 800,
                  color: '#ffffff',
                }}
              >
                {t('dailyChallenge.brilliant', 'Brilliant!')}
              </span>
            </div>

            <p
              style={{
                color: '#e2e8f0',
                fontSize: '0.88rem',
                margin: 0,
                lineHeight: 1.4,
              }}
            >
              {puzzle.explanation}
            </p>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: 'var(--accent-gold)',
                fontWeight: 800,
                fontSize: '0.95rem',
                marginTop: '0.25rem',
              }}
            >
              <Trophy size={18} />
              <span>
                {xpAwardedThisSession || !alreadyCompleted
                  ? t('dailyChallenge.xpAwarded', '+25 XP Earned')
                  : t(
                      'dailyChallenge.alreadyCompleted',
                      "Today's Challenge Completed! 🎉"
                    )}
              </span>
            </div>

            {!isAuthenticated && (
              <div
                style={{
                  fontSize: '0.78rem',
                  color: 'var(--text-muted)',
                  marginTop: '0.35rem',
                }}
              >
                <Link
                  href="/auth/callback"
                  style={{ color: 'var(--accent-gold)', fontWeight: 700 }}
                >
                  Sign in with Google
                </Link>{' '}
                to permanently sync your daily streak and level up!
              </div>
            )}
          </div>
        )}

        {status === 'incorrect' && (
          <div
            className="glass-panel"
            style={{
              width: '100%',
              maxWidth: '460px',
              padding: '1.25rem',
              borderRadius: '16px',
              backgroundColor: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              gap: '0.65rem',
              animation: 'fadeIn 0.3s ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertCircle size={22} color="#ef4444" />
              <span
                style={{
                  fontSize: '1.15rem',
                  fontWeight: 800,
                  color: '#ffffff',
                }}
              >
                {t('dailyChallenge.notQuite', 'Not quite. Try again.')}
              </span>
            </div>

            <p
              style={{
                color: 'var(--text-secondary)',
                fontSize: '0.85rem',
                margin: 0,
              }}
            >
              {t(
                'dailyChallenge.notQuiteDesc',
                "That wasn't the optimal move. Look closely for tactics or king threats!"
              )}
            </p>

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.25rem' }}>
              <button
                onClick={handleRetry}
                className="btn-primary"
                style={{ padding: '0.55rem 1.25rem', fontSize: '0.88rem' }}
              >
                <RotateCcw size={15} />
                <span>{t('dailyChallenge.retry', 'Try Again')}</span>
              </button>

              <button
                onClick={() => setShowHint(true)}
                className="btn-secondary"
                style={{ padding: '0.55rem 1rem', fontSize: '0.85rem' }}
              >
                <HelpCircle size={15} />
                <span>Show Hint</span>
              </button>
            </div>
          </div>
        )}

        {/* Action Controls when in Idle state */}
        {status === 'idle' && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.85rem',
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            <button
              onClick={handleRetry}
              className="btn-secondary"
              style={{ padding: '0.55rem 1rem', fontSize: '0.85rem' }}
            >
              <RotateCcw size={14} />
              <span>Reset Board</span>
            </button>

            <button
              onClick={() => setShowHint(!showHint)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.55rem 1rem',
                borderRadius: 'var(--radius-full)',
                backgroundColor: showHint
                  ? 'rgba(245, 158, 11, 0.18)'
                  : 'rgba(255, 255, 255, 0.05)',
                border: `1px solid ${
                  showHint ? 'var(--accent-gold)' : 'var(--border-subtle)'
                }`,
                color: showHint ? 'var(--accent-gold)' : 'var(--text-secondary)',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <HelpCircle size={15} />
              <span>{showHint ? 'Hide Hint' : 'Show Hint'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
