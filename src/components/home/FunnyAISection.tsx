'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useTranslation } from '@/context/LanguageContext';
import { Volume2, Bot, ArrowRight, Sparkles, MessageCircle, Flame } from 'lucide-react';

export const FunnyAISection: React.FC = () => {
  const { t } = useTranslation();
  const [activePersona, setActivePersona] = useState<string>('comedian');

  const bots = [
    {
      id: 'comedian',
      name: 'FunnyBot',
      role: 'The Comedian',
      emoji: '😂',
      accentColor: '#f59e0b',
      borderGlow: 'rgba(245, 158, 11, 0.4)',
      bgGradient: 'linear-gradient(180deg, rgba(30, 24, 16, 0.75) 0%, rgba(14, 18, 28, 0.95) 100%)',
      quote: t('aiSection.comedianQuote', '“Interesting move... did you close your eyes before clicking that?” 😂'),
      vibe: 'Cracks jokes after every blunder',
    },
    {
      id: 'villain',
      name: 'Lord Checkmate',
      role: 'The Villain',
      emoji: '😈',
      accentColor: '#ef4444',
      borderGlow: 'rgba(239, 68, 68, 0.4)',
      bgGradient: 'linear-gradient(180deg, rgba(34, 16, 20, 0.75) 0%, rgba(14, 18, 28, 0.95) 100%)',
      quote: t('aiSection.villainQuote', '“Muahaha! That pawn was delicious. Your King is next!” 😈'),
      vibe: 'Ruthless, dramatic, hungry for pawns',
    },
    {
      id: 'professor',
      name: 'Prof. Morphy',
      role: 'The Professor',
      emoji: '🤓',
      accentColor: '#3b82f6',
      borderGlow: 'rgba(59, 130, 246, 0.4)',
      bgGradient: 'linear-gradient(180deg, rgba(16, 24, 36, 0.75) 0%, rgba(14, 18, 28, 0.95) 100%)',
      quote: t('aiSection.professorQuote', '“Fascinating opening choice. Let us inspect the tactical repercussions.” 🤓'),
      vibe: 'Analyzes your moves with scholarly humor',
    },
    {
      id: 'cat',
      name: 'GM Whiskers',
      role: 'The Cat',
      emoji: '🐱',
      accentColor: '#c084fc',
      borderGlow: 'rgba(192, 132, 252, 0.4)',
      bgGradient: 'linear-gradient(180deg, rgba(28, 18, 36, 0.75) 0%, rgba(14, 18, 28, 0.95) 100%)',
      quote: t('aiSection.catQuote', '“Meow! I knocked your bishop off the board. Deal with it!” 🐱'),
      vibe: 'Chaotic, playful, knocks pieces over',
    },
  ];

  return (
    <section style={{ padding: '6.5rem 0', position: 'relative', zIndex: 1 }}>
      {/* Ambient background light */}
      <div
        style={{
          position: 'absolute',
          top: '40%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '850px',
          height: '450px',
          background: 'radial-gradient(ellipse, rgba(16, 185, 129, 0.08) 0%, rgba(245, 158, 11, 0.05) 50%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <div className="container" style={{ maxWidth: '1180px', position: 'relative', zIndex: 1 }}>
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <div style={{ display: 'inline-flex', marginBottom: '1rem' }}>
            <div
              className="badge badge-gold animate-pulse-subtle"
              style={{ padding: '0.4rem 1.1rem', fontSize: '0.84rem' }}
            >
              <Volume2 size={15} />
              <span>{t('aiSection.badge', 'AI with Real Personality & Speech')}</span>
            </div>
          </div>

          <h2
            style={{
              fontSize: 'clamp(2.2rem, 4vw, 3.4rem)',
              fontWeight: 900,
              letterSpacing: '-0.02em',
              marginBottom: '1rem',
              color: '#ffffff',
            }}
          >
            {t('aiSection.title', 'Meet Your New Favorite Opponent 🤖💬')}
          </h2>

          <p
            style={{
              fontSize: 'clamp(1.05rem, 2vw, 1.2rem)',
              color: 'var(--text-secondary)',
              maxWidth: '740px',
              margin: '0 auto',
              lineHeight: 1.6,
            }}
          >
            {t(
              'aiSection.subtitle',
              'Not a silent, emotionless calculator. FunnyChess AI actually speaks (English, Hindi, Bengali) and cracks jokes while you play!'
            )}
          </p>
        </div>

        {/* 4 Interactive AI Opponent Cards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1.5rem',
            marginBottom: '3rem',
          }}
        >
          {bots.map((bot) => {
            const isSelected = activePersona === bot.id;
            return (
              <div
                key={bot.id}
                onClick={() => setActivePersona(bot.id)}
                style={{
                  borderRadius: '24px',
                  padding: '2rem 1.6rem',
                  background: bot.bgGradient,
                  border: `1px solid ${isSelected ? bot.accentColor : 'rgba(255, 255, 255, 0.08)'}`,
                  boxShadow: isSelected
                    ? `0 16px 40px rgba(0, 0, 0, 0.6), 0 0 25px ${bot.accentColor}30`
                    : '0 10px 30px rgba(0, 0, 0, 0.35)',
                  cursor: 'pointer',
                  transform: isSelected ? 'translateY(-6px)' : 'translateY(0)',
                  transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Active Indicator Wave */}
                {isSelected && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '1rem',
                      right: '1.25rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '3px',
                      backgroundColor: 'rgba(255, 255, 255, 0.08)',
                      padding: '0.3rem 0.65rem',
                      borderRadius: 'var(--radius-full)',
                    }}
                  >
                    <Volume2 size={13} color={bot.accentColor} />
                    <div style={{ width: '3px', height: '10px', backgroundColor: bot.accentColor, borderRadius: '2px', animation: 'pulseSubtle 0.5s infinite' }} />
                    <div style={{ width: '3px', height: '14px', backgroundColor: bot.accentColor, borderRadius: '2px', animation: 'pulseSubtle 0.3s infinite' }} />
                    <div style={{ width: '3px', height: '8px', backgroundColor: bot.accentColor, borderRadius: '2px', animation: 'pulseSubtle 0.7s infinite' }} />
                  </div>
                )}

                <div>
                  {/* Emoji Avatar */}
                  <div
                    style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '18px',
                      backgroundColor: 'rgba(255, 255, 255, 0.06)',
                      border: `1px solid ${bot.accentColor}35`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '2.2rem',
                      marginBottom: '1.25rem',
                    }}
                  >
                    {bot.emoji}
                  </div>

                  <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.2rem' }}>
                    {bot.name}
                  </h3>

                  <div style={{ fontSize: '0.82rem', color: bot.accentColor, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '1.25rem' }}>
                    {bot.role}
                  </div>

                  {/* Speech Bubble */}
                  <div
                    style={{
                      padding: '1.1rem',
                      borderRadius: '16px',
                      backgroundColor: 'rgba(0, 0, 0, 0.35)',
                      borderLeft: `3px solid ${bot.accentColor}`,
                      fontSize: '0.92rem',
                      color: '#f8fafc',
                      fontStyle: 'italic',
                      lineHeight: 1.5,
                      marginBottom: '1rem',
                    }}
                  >
                    {bot.quote}
                  </div>
                </div>

                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  {bot.vibe}
                </div>
              </div>
            );
          })}
        </div>

        {/* Big Action CTA */}
        <div style={{ textAlign: 'center' }}>
          <Link
            href="/play/ai"
            className="btn-emerald"
            style={{
              padding: '1.05rem 2.4rem',
              fontSize: '1.08rem',
              boxShadow: '0 8px 28px rgba(16, 185, 129, 0.45)',
              display: 'inline-flex',
            }}
          >
            <Bot size={20} />
            <span>{t('aiSection.btnPlay', 'Play Against Funny AI')}</span>
            <ArrowRight size={18} />
          </Link>
          <div style={{ marginTop: '0.85rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            3 Difficulties • Real Voice Commentary in English, Hindi & Bengali
          </div>
        </div>
      </div>
    </section>
  );
};
