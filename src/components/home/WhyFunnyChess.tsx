'use client';

import React from 'react';
import { useTranslation } from '@/context/LanguageContext';
import { 
  BookOpen, 
  Laugh, 
  Volume2, 
  Users, 
  BrainCircuit, 
  ShieldCheck, 
  Sparkles 
} from 'lucide-react';

export const WhyFunnyChess: React.FC = () => {
  const { t } = useTranslation();

  const pillars = [
    {
      icon: BookOpen,
      title: t('why.item1Title', 'Visual & Jargon-Free'),
      desc: t('why.item1Desc', 'No dry textbooks. Interactive boards and animated arrows teach you intuitively.'),
      color: '#3b82f6',
      bg: 'rgba(59, 130, 246, 0.12)',
    },
    {
      icon: Laugh,
      title: t('why.item2Title', 'Humor That Sticks'),
      desc: t('why.item2Desc', 'Laugh off blunders and remember chess rules with hilarious memorable punchlines.'),
      color: '#f59e0b',
      bg: 'rgba(245, 158, 11, 0.12)',
    },
    {
      icon: Volume2,
      title: t('why.item3Title', 'AI That Speaks Aloud'),
      desc: t('why.item3Desc', 'Practice against an AI with real voice commentary in English, Hindi, and Bengali.'),
      color: '#10b981',
      bg: 'rgba(16, 185, 129, 0.12)',
    },
    {
      icon: Users,
      title: t('why.item4Title', '1-Click Friend Duels'),
      desc: t('why.item4Desc', 'Generate a link, send via WhatsApp, and duel in real time with zero sign-up friction.'),
      color: '#8b5cf6',
      bg: 'rgba(139, 92, 246, 0.12)',
    },
    {
      icon: BrainCircuit,
      title: t('why.item5Title', '🧠 HACK Mode Mentor'),
      desc: t('why.item5Desc', 'Understand WHY a move is strong, spot opponent threats, and learn how to think.'),
      color: '#34d399',
      bg: 'rgba(52, 211, 153, 0.12)',
    },
    {
      icon: ShieldCheck,
      title: t('why.item6Title', 'Built Free-First ❤️'),
      desc: t('why.item6Desc', 'Built with open-source technology and ₹0 initial budget for players everywhere.'),
      color: '#f43f5e',
      bg: 'rgba(244, 63, 94, 0.12)',
    },
  ];

  return (
    <section style={{ padding: '5rem 0', position: 'relative', zIndex: 1 }}>
      <div className="container" style={{ maxWidth: '1160px' }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <div className="badge badge-purple" style={{ marginBottom: '0.85rem' }}>
            <Sparkles size={14} />
            <span>{t('why.badge', 'Why FunnyChess?')}</span>
          </div>
          <h2 style={{ fontSize: 'clamp(2.1rem, 3.8vw, 3rem)', fontWeight: 800, marginBottom: '0.85rem' }}>
            {t('why.title', 'Chess Made Playful, Visual & Stress-Free ♟️✨')}
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '680px', margin: '0 auto', fontSize: '1.08rem', lineHeight: 1.6 }}>
            {t('why.subtitle', 'We stripped away the boring lectures and built the chess platform we always wished existed.')}
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {pillars.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="glass-panel"
                style={{
                  padding: '2rem 1.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  borderTop: `3px solid ${item.color}`,
                  backgroundColor: 'rgba(18, 24, 38, 0.65)',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.35)',
                }}
              >
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '14px',
                    backgroundColor: item.bg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: item.color,
                  }}
                >
                  <Icon size={22} />
                </div>

                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.4rem' }}>
                    {item.title}
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6, margin: 0 }}>
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
