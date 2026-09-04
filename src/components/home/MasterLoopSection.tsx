'use client';

import React from 'react';
import { useTranslation } from '@/context/LanguageContext';
import { Flame, ArrowRight } from 'lucide-react';

export const MasterLoopSection: React.FC = () => {
  const { t } = useTranslation();

  const loopSteps = [
    {
      number: '1',
      title: t('loop.step1', 'LEARN'),
      emoji: '📚',
      desc: t('loop.step1Desc', 'Bite-sized visual lessons with jokes & interactive boards'),
      color: '#3b82f6',
    },
    {
      number: '2',
      title: t('loop.step2', 'PLAY'),
      emoji: '♟️',
      desc: t('loop.step2Desc', 'Casual games against witty AI or friendly rivals'),
      color: '#10b981',
    },
    {
      number: '3',
      title: t('loop.step3', 'MAKE MISTAKES'),
      emoji: '😂',
      desc: t('loop.step3Desc', 'Blunder horribly and laugh it off with our bot 😂'),
      color: '#f59e0b',
    },
    {
      number: '4',
      title: t('loop.step4', 'UNDERSTAND'),
      emoji: '🧠',
      desc: t('loop.step4Desc', 'HACK Mode explains WHY in plain, human language 🧠'),
      color: '#8b5cf6',
    },
    {
      number: '5',
      title: t('loop.step5', 'IMPROVE'),
      emoji: '🔥',
      desc: t('loop.step5Desc', 'Level up your tactics and king defense skills 🔥'),
      color: '#ef4444',
    },
    {
      number: '6',
      title: t('loop.step6', 'PLAY AGAIN'),
      emoji: '👑',
      desc: t('loop.step6Desc', 'Apply what you learned and score sweet checkmates 👑'),
      color: '#fbbf24',
    },
  ];

  return (
    <section
      style={{
        padding: '5.5rem 0',
        backgroundColor: 'rgba(17, 22, 34, 0.45)',
        borderTop: '1px solid var(--border-subtle)',
        borderBottom: '1px solid var(--border-subtle)',
        position: 'relative',
        zIndex: 1,
      }}
    >
      <div className="container" style={{ maxWidth: '1160px' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <div className="badge badge-purple" style={{ marginBottom: '0.85rem' }}>
            <Flame size={14} />
            <span>{t('loop.badge', 'The Secret Recipe')}</span>
          </div>
          <h2 style={{ fontSize: 'clamp(2.1rem, 3.8vw, 3rem)', fontWeight: 800, marginBottom: '0.85rem' }}>
            {t('loop.title', 'The FunnyChess Master Loop')}
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '680px', margin: '0 auto', fontSize: '1.08rem', lineHeight: 1.6 }}>
            {t('loop.subtitle', 'How complete beginners turn into confident players without crying over pawns')}
          </p>
        </div>

        {/* Connected Journey Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem',
            position: 'relative',
          }}
        >
          {loopSteps.map((step, idx) => (
            <div
              key={idx}
              className="glass-panel"
              style={{
                padding: '2rem 1.75rem',
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.85rem',
                borderTop: `4px solid ${step.color}`,
                backgroundColor: 'rgba(18, 24, 38, 0.75)',
                boxShadow: '0 12px 36px rgba(0, 0, 0, 0.4)',
                transition: 'all 0.25s ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '2.4rem' }}>{step.emoji}</span>
                <span
                  style={{
                    fontSize: '1.3rem',
                    fontWeight: 900,
                    color: 'var(--text-muted)',
                    fontFamily: 'var(--font-heading)',
                  }}
                >
                  0{step.number}
                </span>
              </div>

              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: step.color, margin: 0 }}>
                {step.title}
              </h3>

              <p style={{ color: 'var(--text-secondary)', fontSize: '0.94rem', lineHeight: 1.6, margin: 0 }}>
                {step.desc}
              </p>

              {idx < loopSteps.length - 1 && (
                <div
                  style={{
                    display: 'none',
                    position: 'absolute',
                    right: '-12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    zIndex: 2,
                    color: 'var(--accent-gold)',
                  }}
                >
                  <ArrowRight size={18} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
