'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslation } from '@/context/LanguageContext';
import { getDailyChallenge } from '@/lib/chess/dailyChallengeData';
import { Sparkles, Swords, Trophy, ArrowRight, Target, Flame } from 'lucide-react';

export const DailyChallengeSection: React.FC = () => {
  const { t } = useTranslation();
  const { puzzle } = getDailyChallenge();

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
              <span>+25 XP Daily Reward</span>
            </span>
          </div>
        </div>

        {/* Right Preview Card */}
        <div
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
        </div>
      </div>
    </section>
  );
};
