'use client';

import React, { useState } from 'react';
import { useTranslation } from '@/context/LanguageContext';
import { 
  Sparkles, 
  Heart, 
  Github, 
  Linkedin, 
  Instagram, 
  ExternalLink, 
  Crown, 
  Lightbulb, 
  Laugh, 
  ShieldCheck,
  ArrowRight,
  BookOpen,
  Compass,
  Zap,
  MessageSquare
} from 'lucide-react';

export const FounderSection: React.FC = () => {
  const { t } = useTranslation();
  const [imageError, setImageError] = useState(false);
  const [activeTab, setActiveTab] = useState<'vision' | 'story' | 'advice'>('vision');

  // Verified Social Channels for Somnath Sen
  const socialLinks = [
    {
      name: 'Portfolio',
      href: 'https://somnath-sen.github.io/somnathsen/',
      icon: ExternalLink,
      color: '#fbbf24',
      label: 'Portfolio',
    },
    {
      name: 'GitHub',
      href: 'https://github.com/somnath-sen',
      icon: Github,
      color: '#f1f5f9',
      label: 'GitHub',
    },
    {
      name: 'LinkedIn',
      href: 'https://www.linkedin.com/in/thesomishere/',
      icon: Linkedin,
      color: '#38bdf8',
      label: 'LinkedIn',
    },
    {
      name: 'Instagram',
      href: 'https://www.instagram.com/thesomishere/',
      icon: Instagram,
      color: '#ec4899',
      label: 'Instagram',
    },
  ];

  const pillars = [
    {
      icon: Lightbulb,
      title: t('founder.pillar1Title', 'Demystify the Game'),
      desc: t('founder.p1', 'I believe chess should not feel like a complicated subject that only a few people can understand.'),
      color: '#f59e0b',
    },
    {
      icon: Laugh,
      title: t('founder.pillar2Title', 'Zero Fear of Mistakes'),
      desc: t('founder.p2', 'I wanted to create a place where anyone can start from zero, make mistakes without fear, laugh while learning, and slowly become better.'),
      color: '#10b981',
    },
    {
      icon: ShieldCheck,
      title: t('founder.pillar3Title', 'Built Free-First ❤️'),
      desc: t('founder.p3', 'FunnyChess was created with one simple idea: Make chess easier to start, more fun to learn, and more enjoyable to play.'),
      color: '#8b5cf6',
    },
  ];

  return (
    <section
      id="founder"
      style={{
        padding: '7rem 0 6.5rem',
        position: 'relative',
        zIndex: 1,
        overflow: 'hidden',
      }}
    >
      {/* 1. Ambient Background Light Glow (Pure depth, zero boxy borders) */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '1000px',
          height: '550px',
          background: 'radial-gradient(ellipse 650px 350px at 40% 50%, rgba(245, 158, 11, 0.08) 0%, rgba(139, 92, 246, 0.05) 50%, transparent 70%)',
          filter: 'blur(45px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <div className="container" style={{ maxWidth: '1180px', position: 'relative', zIndex: 1 }}>
        {/* 2. Seamless Frosted Glass Canvas without harsh box borders */}
        <div
          style={{
            padding: '4rem 3.5rem',
            borderRadius: '36px',
            background: 'linear-gradient(135deg, rgba(20, 26, 42, 0.45) 0%, rgba(12, 16, 26, 0.65) 100%)',
            backdropFilter: 'blur(30px)',
            WebkitBackdropFilter: 'blur(30px)',
            boxShadow: '0 30px 100px rgba(0, 0, 0, 0.45)',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '4rem',
              alignItems: 'center',
            }}
          >
            {/* Left Column: Modern Squircle Portrait & Interactive Creator Card */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <div
                style={{
                  position: 'relative',
                  width: 'min(100%, 260px)',
                  aspectRatio: '1',
                  borderRadius: '28px', // Restored modern squircle shape
                  padding: '4px',
                  background: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 50%, #8b5cf6 100%)',
                  boxShadow: '0 20px 60px rgba(245, 158, 11, 0.35), 0 0 35px rgba(245, 158, 11, 0.15)',
                  marginBottom: '1.5rem',
                }}
              >
                {!imageError ? (
                  <img
                    src="/images/founder/somnath-sen.jpg"
                    alt="Somnath Sen — Founder & Creator of FunnyChess"
                    onError={() => setImageError(true)}
                    style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: '24px',
                      objectFit: 'cover',
                      backgroundColor: '#0c101a',
                    }}
                  />
                ) : (
                  /* Stylized Regal Monogram Squircle Crest */
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: '24px',
                      backgroundColor: '#0c101a',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      padding: '1.25rem',
                    }}
                  >
                    <div style={{ fontSize: '2.5rem' }}>♟️</div>
                    <div
                      style={{
                        fontFamily: 'var(--font-heading)',
                        fontWeight: 900,
                        fontSize: '1.7rem',
                        color: '#ffffff',
                        letterSpacing: '1px',
                        lineHeight: 1.1,
                      }}
                    >
                      SOMNATH SEN
                    </div>
                    <div style={{ fontSize: '0.76rem', color: 'var(--accent-gold)', fontWeight: 700 }}>
                      Founder & Creator
                    </div>
                  </div>
                )}

                {/* Floating Crown Pill Badge */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '-12px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: 'rgba(10, 13, 20, 0.92)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(245, 158, 11, 0.45)',
                    borderRadius: 'var(--radius-full)',
                    padding: '0.35rem 1.1rem',
                    fontSize: '0.74rem',
                    fontWeight: 800,
                    color: '#fbbf24',
                    whiteSpace: 'nowrap',
                    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.7)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                  }}
                >
                  <Crown size={12} color="#fbbf24" />
                  <span>FOUNDER & CREATOR</span>
                </div>
              </div>

              {/* Founder's Favorite Opening Chip (Interesting Upgrade #1) */}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.4rem 0.9rem',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: 'rgba(245, 158, 11, 0.1)',
                  color: '#fbbf24',
                  fontSize: '0.76rem',
                  fontWeight: 700,
                  marginBottom: '1.25rem',
                  maxWidth: '280px',
                }}
              >
                <span>⚡</span>
                <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {t('founder.favMove', 'Favorite: ♘ Nf3 • Active & flexible!')}
                </span>
              </div>

              {/* Connect Label */}
              <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '0.75rem' }}>
                {t('founder.connectWith', 'Connect with Somnath (@thesomishere)')}
              </div>

              {/* Floating Pill Social Badges */}
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.55rem' }}>
                {socialLinks.map((s) => {
                  const Icon = s.icon;
                  return (
                    <a
                      key={s.name}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={s.name}
                      style={{
                        padding: '0.45rem 0.95rem',
                        borderRadius: 'var(--radius-full)',
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        backdropFilter: 'blur(10px)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.45rem',
                        color: s.color,
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        textDecoration: 'none',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <Icon size={14} />
                      <span>{s.label}</span>
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Editorial Storytelling with Interactive Tabs (Interesting Upgrade #2) */}
            <div>
              <div style={{ display: 'inline-flex', marginBottom: '1rem' }}>
                <div
                  className="badge badge-gold animate-pulse-subtle"
                  style={{
                    padding: '0.4rem 1.1rem',
                    fontSize: '0.82rem',
                    letterSpacing: '0.4px',
                    boxShadow: '0 0 20px rgba(245, 158, 11, 0.25)',
                  }}
                >
                  <Sparkles size={14} />
                  <span>{t('founder.badge', '♟️ THE PERSON BEHIND FUNNYCHESS')}</span>
                </div>
              </div>

              <h2
                style={{
                  fontSize: 'clamp(2.3rem, 4.2vw, 3.4rem)',
                  fontWeight: 900,
                  marginBottom: '0.4rem',
                  letterSpacing: '-0.03em',
                  lineHeight: 1.15,
                }}
              >
                Hi, I'm{' '}
                <span
                  style={{
                    background: 'linear-gradient(135deg, #ffffff 30%, #fbbf24 70%, #f59e0b 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    display: 'inline-block',
                  }}
                >
                  Somnath Sen
                </span>
              </h2>

              <div
                style={{
                  fontSize: '1.08rem',
                  color: 'var(--accent-gold)',
                  fontWeight: 700,
                  marginBottom: '1.5rem',
                  letterSpacing: '0.2px',
                }}
              >
                {t('founder.role', 'Founder & Creator of FunnyChess')}
              </div>

              {/* Interactive Story Tabs */}
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.75rem', flexWrap: 'wrap' }}>
                <button
                  onClick={() => setActiveTab('vision')}
                  style={{
                    padding: '0.45rem 1rem',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: activeTab === 'vision' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                    color: activeTab === 'vision' ? '#fbbf24' : 'var(--text-secondary)',
                    border: 'none',
                    fontSize: '0.86rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <Compass size={14} />
                  <span>{t('founder.tabVision', 'Core Vision')}</span>
                </button>

                <button
                  onClick={() => setActiveTab('story')}
                  style={{
                    padding: '0.45rem 1rem',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: activeTab === 'story' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                    color: activeTab === 'story' ? '#60a5fa' : 'var(--text-secondary)',
                    border: 'none',
                    fontSize: '0.86rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <BookOpen size={14} />
                  <span>{t('founder.tabStory', 'The Backstory')}</span>
                </button>

                <button
                  onClick={() => setActiveTab('advice')}
                  style={{
                    padding: '0.45rem 1rem',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: activeTab === 'advice' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                    color: activeTab === 'advice' ? '#34d399' : 'var(--text-secondary)',
                    border: 'none',
                    fontSize: '0.86rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <Zap size={14} />
                  <span>{t('founder.tabAdvice', "Founder's Advice")}</span>
                </button>
              </div>

              {/* Tab 1: Vision (Pillars) */}
              {activeTab === 'vision' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2.25rem' }}>
                  {pillars.map((pillar, idx) => {
                    const Icon = pillar.icon;
                    return (
                      <div
                        key={idx}
                        style={{
                          display: 'flex',
                          gap: '1.1rem',
                          alignItems: 'flex-start',
                        }}
                      >
                        <div
                          style={{
                            width: '34px',
                            height: '34px',
                            borderRadius: '10px',
                            backgroundColor: `${pillar.color}18`,
                            color: pillar.color,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            marginTop: '0.1rem',
                            boxShadow: `0 4px 14px ${pillar.color}20`,
                          }}
                        >
                          <Icon size={17} />
                        </div>
                        <div>
                          <div style={{ fontSize: '1.02rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.2rem' }}>
                            {pillar.title}
                          </div>
                          <p style={{ margin: 0, fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                            {pillar.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Tab 2: Backstory */}
              {activeTab === 'story' && (
                <div style={{ marginBottom: '2.25rem' }}>
                  <p style={{ fontSize: '0.98rem', color: '#e2e8f0', lineHeight: 1.75, margin: 0 }}>
                    {t(
                      'founder.storyText',
                      'FunnyChess started with a blank editor, ₹0 initial budget, and a mission: why should learning chess feel like a boring exam? Using open-source technologies, client-side engines, and sheer passion, it was created so anyone can learn, laugh, and master chess completely free.'
                    )}
                  </p>
                </div>
              )}

              {/* Tab 3: Founder's Advice */}
              {activeTab === 'advice' && (
                <div style={{ marginBottom: '2.25rem' }}>
                  <p style={{ fontSize: '0.98rem', color: '#e2e8f0', lineHeight: 1.75, margin: 0 }}>
                    {t(
                      'founder.adviceText',
                      'Stop worrying about memorizing 20-move opening theories. The real magic of chess is tactical play: active knights, solid king defense, and laughing off your blunders. Make your first move today!'
                    )}
                  </p>
                </div>
              )}

              {/* Editorial Minimalist Quote Callout */}
              <div
                style={{
                  position: 'relative',
                  padding: '1.4rem 1.6rem',
                  borderRadius: '18px',
                  backgroundColor: 'rgba(245, 158, 11, 0.06)',
                  borderLeft: '4px solid var(--accent-gold)',
                  marginBottom: '2rem',
                }}
              >
                <div
                  style={{
                    fontSize: '1.1rem',
                    color: '#f8fafc',
                    fontStyle: 'italic',
                    lineHeight: 1.6,
                    marginBottom: '0.4rem',
                    fontWeight: 500,
                  }}
                >
                  {t('founder.quote', '“You don\'t need to be a chess master to start. You just need to make your first move.”')}
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--accent-gold)', fontWeight: 700 }}>
                  {t('founder.author', '— Somnath Sen, Founder & Creator, FunnyChess')}
                </div>
              </div>

              {/* Playful Bot Banter Bubble (Interesting Upgrade #3) */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  padding: '0.65rem 1rem',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  marginBottom: '1.75rem',
                  maxWidth: '560px',
                }}
              >
                <MessageSquare size={15} color="var(--accent-emerald)" />
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                  {t('founder.botBanter', '“Somnath coded me to be witty, but your moves make my punchlines too easy!” 😂')}
                </span>
              </div>

              {/* Bottom Actions: Visit Portfolio & Free-First Badge */}
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1.25rem' }}>
                <a
                  href="https://somnath-sen.github.io/somnathsen/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                  style={{ padding: '0.85rem 1.75rem', fontSize: '0.96rem' }}
                >
                  <ExternalLink size={16} />
                  <span>{t('founder.portfolioBtn', 'Visit Portfolio')}</span>
                  <ArrowRight size={16} />
                </a>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                  <Heart size={15} color="#ef4444" fill="#ef4444" />
                  <span>{t('founder.freePledge', 'Built free-first ❤️ with open-source technology and a ₹0 initial budget.')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
