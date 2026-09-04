'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslation } from '@/context/LanguageContext';
import { 
  BookOpen, 
  Bot, 
  Users, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Zap,
  ShieldCheck,
  BrainCircuit
} from 'lucide-react';

export const HeroSection: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section
      style={{
        position: 'relative',
        paddingTop: '4.5rem',
        paddingBottom: '5.5rem',
        overflow: 'hidden',
        zIndex: 1,
      }}
    >
      <div className="container" style={{ maxWidth: '1120px' }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          {/* Top Pill Badge */}
          <div style={{ display: 'inline-flex', marginBottom: '1.75rem' }}>
            <div
              className="badge badge-gold animate-pulse-subtle"
              style={{
                padding: '0.45rem 1.1rem',
                fontSize: '0.88rem',
                letterSpacing: '0.3px',
                boxShadow: '0 0 20px rgba(245, 158, 11, 0.25)',
              }}
            >
              <Sparkles size={15} />
              <span>{t('hero.badge', '✨ Chess without the headache')}</span>
            </div>
          </div>

          {/* Animated Hero King & Queen Showcase */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1.25rem',
              marginBottom: '1.5rem',
            }}
          >
            <div
              style={{
                position: 'relative',
                width: '68px',
                height: '68px',
                filter: 'drop-shadow(0 10px 25px rgba(244, 63, 94, 0.35))',
                animation: 'floatSlow 4s ease-in-out infinite',
              }}
            >
              <img
                src="/images/brand/chess-queen.png"
                alt="FunnyChess Queen"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  transform: 'rotate(-6deg)',
                }}
              />
            </div>

            <div
              style={{
                position: 'relative',
                width: '76px',
                height: '76px',
                filter: 'drop-shadow(0 12px 30px rgba(245, 158, 11, 0.45))',
                animation: 'floatSlow 4s ease-in-out infinite 0.6s',
              }}
            >
              <img
                src="/images/brand/chess-king.png"
                alt="FunnyChess King"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  transform: 'rotate(5deg)',
                }}
              />
            </div>
          </div>

          {/* Main Headline */}
          <h1
            style={{
              fontSize: 'clamp(2.5rem, 5.8vw, 4.6rem)',
              letterSpacing: '-0.03em',
              lineHeight: 1.12,
              marginBottom: '1.25rem',
              fontWeight: 900,
            }}
          >
            FunnyChess —{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 45%, #f43f5e 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: 'inline-block',
                textShadow: '0 0 35px rgba(245, 158, 11, 0.2)',
              }}
            >
              Learn. Laugh. Play.
            </span>
          </h1>

          {/* Subtitle & Tagline */}
          <p
            style={{
              fontSize: 'clamp(1.08rem, 2vw, 1.25rem)',
              fontWeight: 600,
              color: '#f8fafc',
              marginBottom: '0.75rem',
            }}
          >
            {t('hero.tagline', 'Chess is not hard. You just haven’t learned it the fun way yet.')}
          </p>

          <p
            style={{
              fontSize: 'clamp(0.95rem, 1.7vw, 1.1rem)',
              color: 'var(--text-secondary)',
              lineHeight: 1.65,
              maxWidth: '820px',
              margin: '0 auto 2.75rem',
            }}
          >
            {t(
              'hero.subtitle',
              'A fun and beginner-friendly way to learn and play chess. Play against AI, learn chess lessons, challenge friends and use HACK mode to understand mistakes.'
            )}
          </p>

          {/* Call to Action Buttons */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '1rem',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: '3.5rem',
            }}
          >
            <Link
              href="/learn"
              className="btn-primary"
              style={{
                padding: '1rem 2.2rem',
                fontSize: '1.08rem',
                boxShadow: '0 6px 24px rgba(245, 158, 11, 0.45)',
              }}
            >
              <BookOpen size={20} />
              <span>{t('hero.btnLearn', 'Start Learning (Free)')}</span>
              <ArrowRight size={18} />
            </Link>

            <Link
              href="/play/ai"
              className="btn-emerald"
              style={{
                padding: '1rem 2rem',
                fontSize: '1.08rem',
                boxShadow: '0 6px 24px rgba(16, 185, 129, 0.4)',
              }}
            >
              <Bot size={20} />
              <span>{t('hero.btnPlayAi', 'Play with Funny AI')}</span>
            </Link>

            <Link
              href="/play/friend"
              className="btn-secondary"
              style={{
                padding: '1rem 2rem',
                fontSize: '1.08rem',
                border: '1px solid rgba(255, 255, 255, 0.15)',
              }}
            >
              <Users size={20} />
              <span>{t('hero.btnPlayFriend', 'Challenge a Friend')}</span>
            </Link>
          </div>

          {/* Hero Floating Chess Micro-Showcase */}
          <div
            style={{
              maxWidth: '680px',
              margin: '0 auto 3rem',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1rem',
            }}
          >
            {/* Move Highlight Card */}
            <div
              className="glass-panel"
              style={{
                padding: '0.85rem 1.4rem',
                borderRadius: 'var(--radius-full)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                border: '1px solid rgba(16, 185, 129, 0.35)',
                backgroundColor: 'rgba(17, 24, 38, 0.85)',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
              }}
            >
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(16, 185, 129, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#34d399',
                  fontWeight: 800,
                }}
              >
                ♞
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#ffffff' }}>
                  {t('hero.knightCardTitle', 'Best Move Recommendation')}
                </div>
                <div style={{ fontSize: '0.74rem', color: '#a7f3d0' }}>
                  {t('hero.knightCardSubtitle', '♘ Nf3 • Controls the center')}
                </div>
              </div>
            </div>

            {/* AI Speech Bubble Chip */}
            <div
              className="glass-panel"
              style={{
                padding: '0.85rem 1.4rem',
                borderRadius: 'var(--radius-full)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                backgroundColor: 'rgba(24, 32, 48, 0.85)',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
              }}
            >
              <span style={{ fontSize: '1.2rem' }}>🤖</span>
              <span style={{ fontSize: '0.86rem', color: '#fef3c7', fontStyle: 'italic', fontWeight: 600 }}>
                {t('hero.speechBubble', '“Nice move! Did you see that fork coming?” — FunnyBot 😂')}
              </span>
            </div>
          </div>

          {/* Trust Props Strip */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '2rem',
              paddingTop: '1.75rem',
              borderTop: '1px solid var(--border-subtle)',
              color: 'var(--text-muted)',
              fontSize: '0.92rem',
              fontWeight: 600,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle2 size={17} color="var(--accent-emerald)" />
              <span>{t('hero.statsFree', 'Built Free-First ❤️ (₹0 Budget)')}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle2 size={17} color="var(--accent-emerald)" />
              <span>{t('hero.statsLanguages', '3 Languages: English, Hindi, Bengali')}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle2 size={17} color="var(--accent-emerald)" />
              <span>{t('hero.statsEngine', 'Stockfish Client-Side Engine')}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
