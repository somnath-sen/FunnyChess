'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslation } from '@/context/LanguageContext';
import {
  ChessPersonalityResult,
  ChessPersonalityId,
} from '@/lib/chess/personalityEngine';
import { Sparkles, Swords, Brain, Shield, Clock } from 'lucide-react';

interface ChessPersonalityCardProps {
  personality: ChessPersonalityResult;
}

export const ChessPersonalityCard: React.FC<ChessPersonalityCardProps> = ({
  personality,
}) => {
  const { t } = useTranslation();

  if (personality.isDeveloping) {
    return (
      <div
        className="glass-panel"
        style={{
          padding: '2rem',
          marginBottom: '2rem',
          borderRadius: '20px',
          background:
            'linear-gradient(135deg, rgba(24, 32, 48, 0.9), rgba(15, 23, 42, 0.95))',
          border: '1px dashed rgba(245, 158, 11, 0.35)',
          boxShadow: '0 12px 30px rgba(0, 0, 0, 0.4)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: '1rem',
        }}
      >
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '16px',
            backgroundColor: 'rgba(245, 158, 11, 0.12)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2rem',
            animation: 'pulseSubtle 2s infinite',
          }}
        >
          🌱
        </div>

        <div>
          <h3
            style={{
              fontSize: '1.25rem',
              fontWeight: 800,
              color: '#ffffff',
              marginBottom: '0.4rem',
            }}
          >
            {t('personality.developingTitle', 'Your Chess Personality is developing...')}
          </h3>
          <p
            style={{
              color: 'var(--text-secondary)',
              fontSize: '0.9rem',
              maxWidth: '520px',
              margin: '0 auto',
              lineHeight: 1.5,
            }}
          >
            {t(
              'personality.developingDesc',
              'Play a few matches against Funny AI or friends to discover your natural chess style!'
            )}
          </p>
        </div>

        <Link
          href="/play/ai"
          className="btn-primary"
          style={{
            padding: '0.65rem 1.4rem',
            fontSize: '0.9rem',
            marginTop: '0.5rem',
          }}
        >
          <Swords size={16} />
          <span>{t('personality.playGames', 'Play Matches to Discover')}</span>
        </Link>
      </div>
    );
  }

  const { metrics } = personality;

  const metricList = [
    {
      label: t('personality.attackStyle', 'Attack Style'),
      value: metrics.attackStyle,
      color: 'linear-gradient(90deg, #ef4444, #f97316)',
      icon: '⚔️',
    },
    {
      label: t('personality.tacticalPlay', 'Tactical Play'),
      value: metrics.tacticalPlay,
      color: 'linear-gradient(90deg, #f59e0b, #eab308)',
      icon: '🎯',
    },
    {
      label: t('personality.defence', 'Defence'),
      value: metrics.defence,
      color: 'linear-gradient(90deg, #3b82f6, #06b6d4)',
      icon: '🛡️',
    },
    {
      label: t('personality.endgame', 'Endgame Mastery'),
      value: metrics.endgame,
      color: 'linear-gradient(90deg, #8b5cf6, #ec4899)',
      icon: '👑',
    },
  ];

  return (
    <div
      className="glass-panel"
      style={{
        padding: '2.25rem 2rem',
        marginBottom: '2rem',
        borderRadius: '20px',
        background:
          'linear-gradient(135deg, rgba(20, 28, 45, 0.95), rgba(12, 17, 29, 0.98))',
        border: '1px solid rgba(245, 158, 11, 0.35)',
        boxShadow:
          '0 16px 40px rgba(0, 0, 0, 0.5), 0 0 25px rgba(245, 158, 11, 0.08)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background Accent Glow */}
      <div
        style={{
          position: 'absolute',
          top: '-40px',
          right: '-40px',
          width: '180px',
          height: '180px',
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(245, 158, 11, 0.15) 0%, rgba(245, 158, 11, 0) 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Header Badge */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.25rem',
          flexWrap: 'wrap',
          gap: '0.5rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Sparkles size={18} color="var(--accent-gold)" />
          <span
            style={{
              fontSize: '0.82rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '1px',
              color: 'var(--accent-gold)',
            }}
          >
            {t('personality.title', 'Your Chess Personality')}
          </span>
        </div>
        <span
          className="badge badge-purple"
          style={{ fontSize: '0.72rem', padding: '0.2rem 0.65rem' }}
        >
          {personality.gamesAnalyzed} Matches Analyzed
        </span>
      </div>

      {/* Personality Identity Spotlight */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1.25rem',
          marginBottom: '1.75rem',
          flexWrap: 'wrap',
        }}
      >
        <div
          style={{
            width: '68px',
            height: '68px',
            borderRadius: '18px',
            background:
              'linear-gradient(135deg, rgba(245, 158, 11, 0.25), rgba(139, 92, 246, 0.25))',
            border: '1px solid rgba(245, 158, 11, 0.45)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2.4rem',
            boxShadow: '0 8px 20px rgba(245, 158, 11, 0.2)',
          }}
        >
          {personality.icon}
        </div>

        <div style={{ flex: 1, minWidth: '240px' }}>
          <h2
            style={{
              fontSize: '1.45rem',
              fontWeight: 800,
              color: '#ffffff',
              margin: '0 0 0.35rem',
              letterSpacing: '0.5px',
            }}
          >
            {t(personality.nameKey, personality.id.toUpperCase())}
          </h2>
          <p
            style={{
              color: 'var(--text-secondary)',
              fontSize: '0.92rem',
              lineHeight: 1.5,
              margin: 0,
            }}
          >
            {t(personality.descKey, '')}
          </p>
        </div>
      </div>

      {/* 4 Metric Progress Bars */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.25rem',
          backgroundColor: 'rgba(255, 255, 255, 0.03)',
          padding: '1.25rem',
          borderRadius: '14px',
          border: '1px solid var(--border-subtle)',
        }}
      >
        {metricList.map((m, idx) => (
          <div key={idx}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '0.45rem',
                fontSize: '0.82rem',
              }}
            >
              <span
                style={{
                  color: 'var(--text-secondary)',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                }}
              >
                <span>{m.icon}</span>
                <span>{m.label}</span>
              </span>
              <span style={{ fontWeight: 800, color: '#ffffff' }}>
                {m.value}%
              </span>
            </div>

            {/* Bar */}
            <div
              style={{
                width: '100%',
                height: '8px',
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                borderRadius: 'var(--radius-full)',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${m.value}%`,
                  height: '100%',
                  background: m.color,
                  borderRadius: 'var(--radius-full)',
                  transition: 'width 0.6s ease',
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
