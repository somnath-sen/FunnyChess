'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useTranslation } from '@/context/LanguageContext';
import { Users, Link as LinkIcon, Copy, Check, MessageCircle, ArrowRight, Zap, ShieldCheck } from 'lucide-react';

export const FriendPlaySection: React.FC = () => {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  const sampleUrl = 'https://funnychess.app/game/FC-K9M2P4';

  const handleCopy = () => {
    navigator.clipboard.writeText(sampleUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section style={{ padding: '5rem 0', backgroundColor: 'rgba(17, 22, 34, 0.4)', borderTop: '1px solid var(--border-subtle)', position: 'relative', zIndex: 1 }}>
      <div className="container" style={{ maxWidth: '1160px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '3.5rem',
            alignItems: 'center',
          }}
        >
          {/* Left: Explanatory & CTAs */}
          <div>
            <div className="badge badge-purple" style={{ marginBottom: '1rem' }}>
              <Users size={15} />
              <span>{t('friendShowcase.badge', 'Realtime Multiplayer')}</span>
            </div>

            <h2 style={{ fontSize: 'clamp(2.1rem, 3.5vw, 2.9rem)', fontWeight: 800, marginBottom: '1rem', lineHeight: 1.2 }}>
              {t('friendShowcase.title', 'Challenge Your Friends in 1 Click 👥♟️')}
            </h2>

            <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.65, marginBottom: '2rem' }}>
              {t(
                'friendShowcase.subtitle',
                'Send an invitation link on WhatsApp or Discord and play instantly. Real-time move synchronization with zero latency!'
              )}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '2.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', color: '#e2e8f0', fontSize: '0.94rem' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#8b5cf6' }} />
                <span>No sign-up required for your friend — they click and play immediately!</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', color: '#e2e8f0', fontSize: '0.94rem' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#8b5cf6' }} />
                <span>Legal move enforcement, checks, and victory fanfare synchronized live.</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', color: '#e2e8f0', fontSize: '0.94rem' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#8b5cf6' }} />
                <span>Contextual funny reactions trigger after captures and checks!</span>
              </div>
            </div>

            <Link href="/play/friend" className="btn-primary" style={{ padding: '0.95rem 2.2rem', fontSize: '1.05rem' }}>
              <Users size={18} />
              <span>{t('friendShowcase.btnPlay', 'Create Match Room')}</span>
              <ArrowRight size={18} />
            </Link>
          </div>

          {/* Right: Interactive Invite Preview Card */}
          <div
            className="glass-panel"
            style={{
              padding: '2.25rem',
              border: '1px solid rgba(139, 92, 246, 0.35)',
              boxShadow: '0 16px 45px rgba(0, 0, 0, 0.4)',
              background: 'linear-gradient(135deg, rgba(24, 32, 48, 0.9), rgba(17, 22, 34, 0.95))',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.5rem' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(139, 92, 246, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#c084fc',
                }}
              >
                ⚔️
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                  {t('friendShowcase.inviteTitle', 'Shareable Duel Link')}
                </h3>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Room: <strong>FC-K9M2P4</strong> • Instant Join
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                Game Invite Link
              </label>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  backgroundColor: 'rgba(0, 0, 0, 0.4)',
                  padding: '0.55rem 0.85rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <LinkIcon size={16} color="var(--accent-gold)" />
                <input
                  type="text"
                  readOnly
                  value={sampleUrl}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--accent-gold)',
                    fontSize: '0.88rem',
                    fontFamily: 'monospace',
                    flex: 1,
                    outline: 'none',
                  }}
                />
                <button
                  onClick={handleCopy}
                  style={{
                    padding: '0.45rem 0.85rem',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: copied ? '#10b981' : 'rgba(255, 255, 255, 0.08)',
                    border: 'none',
                    color: '#ffffff',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                  }}
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  <span>{copied ? t('friendShowcase.copied', 'Copied!') : t('friendShowcase.copy', 'Copy')}</span>
                </button>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                padding: '0.75rem',
                borderRadius: 'var(--radius-full)',
                backgroundColor: '#25D366',
                color: '#ffffff',
                fontSize: '0.92rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
              onClick={() => {
                const text = `♟️ Challenge me on FunnyChess! Click here to play: ${sampleUrl}`;
                window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
              }}
            >
              <MessageCircle size={16} />
              <span>{t('friendShowcase.whatsapp', 'Share on WhatsApp')}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
