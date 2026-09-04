'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslation } from '@/context/LanguageContext';
import { 
  BookOpen, 
  Bot, 
  Users, 
  ArrowRight, 
  Sparkles, 
  Crown, 
  Check, 
  Zap, 
  Flame 
} from 'lucide-react';

export const FinalCTA: React.FC = () => {
  const { t } = useTranslation();

  const portals = [
    {
      id: 'learn',
      badge: t('finalCta.card1Badge', '🟢 Level 0 • Zero Knowledge Needed'),
      badgeBg: 'rgba(245, 158, 11, 0.15)',
      badgeColor: '#fbbf24',
      badgeBorder: 'rgba(245, 158, 11, 0.3)',
      icon: '♟️',
      title: t('finalCta.card1Title', 'Start from Scratch'),
      desc: t(
        'finalCta.card1Desc',
        '25 interactive visual lessons with jokes, animated piece moves, and zero complicated jargon.'
      ),
      btnText: t('finalCta.card1Btn', 'Start Learning Free'),
      btnClass: 'btn-primary',
      href: '/learn',
      accentColor: '#f59e0b',
      borderGlow: 'rgba(245, 158, 11, 0.35)',
      cardBg: 'linear-gradient(180deg, rgba(30, 24, 16, 0.85) 0%, rgba(18, 22, 34, 0.95) 100%)',
      btnIcon: BookOpen,
      features: ['Bite-sized interactive boards', 'Jargon-free explanations', 'Funny checkmate quizzes'],
      isFeatured: false,
    },
    {
      id: 'ai',
      badge: t('finalCta.card2Badge', '⚡ Real Spoken Voice AI'),
      badgeBg: 'rgba(16, 185, 129, 0.15)',
      badgeColor: '#34d399',
      badgeBorder: 'rgba(16, 185, 129, 0.35)',
      icon: '🤖',
      title: t('finalCta.card2Title', 'Battle Funny AI'),
      desc: t(
        'finalCta.card2Desc',
        'Test your moves against bots that talk in English, Hindi & Bengali while laughing at your blunders.'
      ),
      btnText: t('finalCta.card2Btn', 'Play with AI'),
      btnClass: 'btn-emerald',
      href: '/play/ai',
      accentColor: '#10b981',
      borderGlow: 'rgba(16, 185, 129, 0.5)',
      cardBg: 'linear-gradient(180deg, rgba(14, 34, 28, 0.9) 0%, rgba(17, 24, 38, 0.98) 100%)',
      btnIcon: Bot,
      features: ['Speaks in 3 languages', '3 difficulty settings', 'Includes HACK Mentor'],
      isFeatured: true, // Most popular
    },
    {
      id: 'friend',
      badge: t('finalCta.card3Badge', '🔥 Instant 1-Click Duel'),
      badgeBg: 'rgba(139, 92, 246, 0.15)',
      badgeColor: '#c084fc',
      badgeBorder: 'rgba(139, 92, 246, 0.3)',
      icon: '⚔️',
      title: t('finalCta.card3Title', 'Challenge a Friend'),
      desc: t(
        'finalCta.card3Desc',
        'Generate a room link, send via WhatsApp, and duel in real time with zero sign-up friction.'
      ),
      btnText: t('finalCta.card3Btn', 'Play with Friend'),
      btnClass: 'btn-secondary',
      href: '/play/friend',
      accentColor: '#8b5cf6',
      borderGlow: 'rgba(139, 92, 246, 0.35)',
      cardBg: 'linear-gradient(180deg, rgba(26, 20, 38, 0.85) 0%, rgba(18, 22, 34, 0.95) 100%)',
      btnIcon: Users,
      features: ['1-click WhatsApp invite', 'Zero sign-up for friends', 'Real-time legal moves'],
      isFeatured: false,
    },
  ];

  return (
    <section
      style={{
        padding: '7rem 0 6rem',
        position: 'relative',
        zIndex: 1,
        overflow: 'hidden',
      }}
    >
      {/* Ambient background glow behind the section */}
      <div
        style={{
          position: 'absolute',
          top: '30%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '750px',
          height: '450px',
          background: 'radial-gradient(ellipse, rgba(245, 158, 11, 0.12) 0%, rgba(139, 92, 246, 0.08) 50%, transparent 75%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <div className="container" style={{ maxWidth: '1200px', position: 'relative', zIndex: 1 }}>
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          {/* King and Queen Floating Showcase */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1rem',
              marginBottom: '1.25rem',
            }}
          >
            <img
              src="/images/brand/chess-queen.png"
              alt="FunnyChess Queen"
              style={{
                width: '54px',
                height: '54px',
                filter: 'drop-shadow(0 6px 18px rgba(244, 63, 94, 0.4))',
                transform: 'rotate(-8deg)',
              }}
            />
            <img
              src="/images/brand/chess-king.png"
              alt="FunnyChess King"
              style={{
                width: '62px',
                height: '62px',
                filter: 'drop-shadow(0 8px 22px rgba(245, 158, 11, 0.45))',
                transform: 'rotate(6deg)',
              }}
            />
          </div>

          <div style={{ display: 'inline-flex', marginBottom: '1.25rem' }}>
            <div
              className="badge badge-gold animate-pulse-subtle"
              style={{
                padding: '0.45rem 1.15rem',
                fontSize: '0.86rem',
                letterSpacing: '0.5px',
                boxShadow: '0 0 25px rgba(245, 158, 11, 0.3)',
              }}
            >
              <Crown size={15} color="#fbbf24" />
              <span>{t('finalCta.badge', '👑 YOUR CHESS JOURNEY STARTS HERE')}</span>
            </div>
          </div>

          <h2
            style={{
              fontSize: 'clamp(2.4rem, 5vw, 3.8rem)',
              fontWeight: 900,
              letterSpacing: '-0.03em',
              lineHeight: 1.15,
              marginBottom: '1.25rem',
              color: '#ffffff',
            }}
          >
            {t('finalCta.title', 'Ready to Make Your First Move? ♟️')}{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 50%, #f43f5e 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: 'inline-block',
              }}
            >
              Choose Your Path
            </span>
          </h2>

          <p
            style={{
              fontSize: 'clamp(1.05rem, 2vw, 1.25rem)',
              color: 'var(--text-secondary)',
              maxWidth: '720px',
              margin: '0 auto',
              lineHeight: 1.6,
            }}
          >
            {t(
              'finalCta.subtitle',
              'No boring textbooks. No intimidating grandmasters. Choose your path and discover how fun chess actually is.'
            )}
          </p>
        </div>

        {/* 3 Interactive Journey Portals */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2rem',
            alignItems: 'stretch',
            marginBottom: '3.5rem',
          }}
        >
          {portals.map((portal) => {
            const BtnIcon = portal.btnIcon;
            return (
              <div
                key={portal.id}
                className="glass-panel"
                style={{
                  padding: '2.5rem 2rem',
                  borderRadius: '26px',
                  background: portal.cardBg,
                  border: `1px solid ${portal.borderGlow}`,
                  boxShadow: portal.isFeatured
                    ? `0 20px 50px rgba(0, 0, 0, 0.6), 0 0 30px ${portal.accentColor}25`
                    : '0 16px 40px rgba(0, 0, 0, 0.45)',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transform: portal.isFeatured ? 'scale(1.03)' : 'scale(1)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              >
                {/* Popular Flag for AI */}
                {portal.isFeatured && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '-13px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      background: 'linear-gradient(135deg, #10b981, #059669)',
                      color: '#ffffff',
                      fontSize: '0.74rem',
                      fontWeight: 800,
                      letterSpacing: '0.6px',
                      padding: '0.3rem 1rem',
                      borderRadius: 'var(--radius-full)',
                      boxShadow: '0 4px 14px rgba(16, 185, 129, 0.5)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                    }}
                  >
                    <Flame size={13} />
                    <span>MOST POPULAR CHOICE</span>
                  </div>
                )}

                <div>
                  {/* Top Badge */}
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      padding: '0.35rem 0.85rem',
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: portal.badgeBg,
                      color: portal.badgeColor,
                      border: `1px solid ${portal.badgeBorder}`,
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      marginBottom: '1.5rem',
                    }}
                  >
                    <span>{portal.badge}</span>
                  </div>

                  {/* Icon Avatar */}
                  <div
                    style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '18px',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      border: `1px solid ${portal.accentColor}40`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '2.4rem',
                      marginBottom: '1.25rem',
                      boxShadow: `0 8px 24px ${portal.accentColor}20`,
                    }}
                  >
                    {portal.icon}
                  </div>

                  {/* Title */}
                  <h3
                    style={{
                      fontSize: '1.6rem',
                      fontWeight: 800,
                      color: '#ffffff',
                      marginBottom: '0.6rem',
                      fontFamily: 'var(--font-heading)',
                    }}
                  >
                    {portal.title}
                  </h3>

                  {/* Description */}
                  <p
                    style={{
                      color: 'var(--text-secondary)',
                      fontSize: '0.94rem',
                      lineHeight: 1.6,
                      marginBottom: '1.75rem',
                    }}
                  >
                    {portal.desc}
                  </p>

                  {/* Feature Checklist */}
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.65rem',
                      marginBottom: '2rem',
                      paddingTop: '1.25rem',
                      borderTop: '1px solid var(--border-subtle)',
                    }}
                  >
                    {portal.features.map((feat, i) => (
                      <div
                        key={i}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.6rem',
                          fontSize: '0.86rem',
                          color: '#e2e8f0',
                        }}
                      >
                        <div
                          style={{
                            width: '18px',
                            height: '18px',
                            borderRadius: '50%',
                            backgroundColor: `${portal.accentColor}25`,
                            color: portal.accentColor,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}
                        >
                          <Check size={11} strokeWidth={3} />
                        </div>
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Big Action Button */}
                <Link
                  href={portal.href}
                  className={portal.btnClass}
                  style={{
                    width: '100%',
                    padding: '0.95rem 1.4rem',
                    fontSize: '1.02rem',
                    justifyContent: 'center',
                    boxShadow: portal.isFeatured
                      ? '0 6px 20px rgba(16, 185, 129, 0.45)'
                      : undefined,
                  }}
                >
                  <BtnIcon size={18} />
                  <span>{portal.btnText}</span>
                  <ArrowRight size={17} />
                </Link>
              </div>
            );
          })}
        </div>

        {/* Bottom Social Proof Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem',
            padding: '1rem 2rem',
            borderRadius: 'var(--radius-full)',
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid var(--border-subtle)',
            maxWidth: '650px',
            margin: '0 auto',
            textAlign: 'center',
          }}
        >
          <span style={{ fontSize: '1.1rem' }}>⭐</span>
          <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
            {t(
              'finalCta.trust',
              'Join 1,000+ players who learned their first checkmate here today ♟️'
            )}
          </span>
        </div>
      </div>
    </section>
  );
};
