'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslation } from '@/context/LanguageContext';
import { Heart, ShieldCheck, Sparkles, Github, Linkedin, Instagram } from 'lucide-react';
import { APP_VERSION_LABEL, APP_STAGE } from '@/lib/version';

export const Footer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <footer
      style={{
        marginTop: '6rem',
        borderTop: '1px solid var(--border-subtle)',
        backgroundColor: '#0a0d14',
        padding: '4rem 0 2.5rem',
        position: 'relative',
        zIndex: 1,
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '2.5rem',
            marginBottom: '3.5rem',
          }}
        >
          {/* Brand Col */}
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                marginBottom: '1rem',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  position: 'relative',
                  width: '42px',
                  height: '42px',
                }}
              >
                <img
                  src="/images/brand/chess-queen.png"
                  alt="FunnyChess Queen"
                  style={{
                    width: '30px',
                    height: '30px',
                    position: 'absolute',
                    left: '-2px',
                    bottom: '2px',
                    filter: 'drop-shadow(0 2px 6px rgba(0, 0, 0, 0.5))',
                    transform: 'rotate(-10deg)',
                    zIndex: 1,
                  }}
                />
                <img
                  src="/images/brand/chess-king.png"
                  alt="FunnyChess King"
                  style={{
                    width: '36px',
                    height: '36px',
                    position: 'absolute',
                    right: 0,
                    top: 0,
                    filter: 'drop-shadow(0 4px 12px rgba(245, 158, 11, 0.4))',
                    transform: 'rotate(6deg)',
                    zIndex: 2,
                  }}
                />
              </div>
              <span
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 800,
                  fontSize: '1.3rem',
                  color: '#ffffff',
                }}
              >
                FunnyChess
              </span>
              <span
                style={{
                  fontSize: '0.68rem',
                  fontWeight: 600,
                  padding: '0.12rem 0.45rem',
                  borderRadius: '9999px',
                  backgroundColor: 'rgba(245, 158, 11, 0.12)',
                  color: 'var(--accent-gold)',
                  border: '1px solid rgba(245, 158, 11, 0.25)',
                  letterSpacing: '0.03em',
                  fontFamily: 'var(--font-mono, monospace)',
                }}
                title={`FunnyChess ${APP_VERSION_LABEL} (${APP_STAGE})`}
              >
                {APP_VERSION_LABEL}
              </span>
            </div>
            <p
              style={{
                color: 'var(--text-secondary)',
                fontSize: '0.95rem',
                lineHeight: 1.6,
                marginBottom: '1.2rem',
              }}
            >
              {t('footer.tagline', 'Chess is not hard. You just haven’t learned it the fun way yet.')}
            </p>
            <div
              style={{
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'rgba(245, 158, 11, 0.08)',
                border: '1px solid rgba(245, 158, 11, 0.2)',
                fontSize: '0.85rem',
                color: 'var(--accent-gold-light)',
                fontStyle: 'italic',
              }}
            >
              {t('footer.quote', '“I sacrificed my Queen for educational purposes.”')}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontSize: '1rem', marginBottom: '1.2rem', color: '#ffffff' }}>
              Quick Navigation
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
              <li>
                <Link
                  href="/learn"
                  style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', transition: 'color 0.2s' }}
                >
                  📚 {t('nav.learn', 'Learn Chess (25 Lessons)')}
                </Link>
              </li>
              <li>
                <Link
                  href="/play/ai"
                  style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', transition: 'color 0.2s' }}
                >
                  🤖 {t('nav.playAi', 'Play with Funny AI')}
                </Link>
              </li>
              <li>
                <Link
                  href="/play/friend"
                  style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', transition: 'color 0.2s' }}
                >
                  👥 {t('nav.playFriend', 'Multiplayer Duel')}
                </Link>
              </li>
              <li>
                <Link
                  href="/profile"
                  style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', transition: 'color 0.2s' }}
                >
                  👤 {t('nav.profile', 'Player Profile & Stats')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Free-First Pledge */}
          <div>
            <h4 style={{ fontSize: '1rem', marginBottom: '1.2rem', color: '#ffffff' }}>
              Our Free-First Pledge 🛡️
            </h4>
            <p
              style={{
                color: 'var(--text-secondary)',
                fontSize: '0.9rem',
                lineHeight: 1.6,
                marginBottom: '1rem',
              }}
            >
              FunnyChess is built with ₹0 initial budget using 100% open-source technologies (Stockfish WASM, Chess.js, browser Web Speech API, and Supabase free tier).
            </p>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.4rem 0.8rem',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                fontSize: '0.8rem',
                color: '#34d399',
                fontWeight: 600,
              }}
            >
              <ShieldCheck size={14} />
              <span>Zero Paywalls • Zero Subscriptions</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            paddingTop: '2rem',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1.25rem',
            fontSize: '0.88rem',
            color: 'var(--text-muted)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.65rem' }}>
            <span>
              © {new Date().getFullYear()} FunnyChess. FunnyChess is created by Somnath Sen with passion & ₹0 initial budget.
            </span>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontSize: '0.72rem',
                fontFamily: 'var(--font-mono, monospace)',
                color: 'var(--text-secondary)',
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid var(--border-subtle)',
                padding: '0.12rem 0.55rem',
                borderRadius: '9999px',
                letterSpacing: '0.02em',
              }}
              title={`FunnyChess ${APP_VERSION_LABEL} (${APP_STAGE})`}
            >
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: '#10b981',
                  boxShadow: '0 0 6px rgba(16, 185, 129, 0.6)',
                }}
              />
              <span>{APP_VERSION_LABEL}</span>
              <span style={{ opacity: 0.6, fontSize: '0.65rem' }}>• {APP_STAGE}</span>
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span>Made with</span>
              <Heart size={14} color="#ef4444" fill="#ef4444" />
              <span>by</span>
              <a
                href="https://somnath-sen.github.io/somnathsen/"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: 'var(--accent-gold)',
                  fontWeight: 700,
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  transition: 'color 0.2s',
                }}
              >
                Somnath Sen
              </a>
            </div>

            {/* Social Links */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <a
                href="https://github.com/somnath-sen"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Somnath Sen GitHub"
                style={{
                  color: 'var(--text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0.4rem',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--border-subtle)',
                  transition: 'all 0.2s ease',
                }}
              >
                <Github size={16} />
              </a>

              <a
                href="https://www.linkedin.com/in/thesomishere/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Somnath Sen LinkedIn"
                style={{
                  color: 'var(--text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0.4rem',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--border-subtle)',
                  transition: 'all 0.2s ease',
                }}
              >
                <Linkedin size={16} />
              </a>

              <a
                href="https://www.instagram.com/thesomishere/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Somnath Sen Instagram"
                style={{
                  color: 'var(--text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0.4rem',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--border-subtle)',
                  transition: 'all 0.2s ease',
                }}
              >
                <Instagram size={16} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
