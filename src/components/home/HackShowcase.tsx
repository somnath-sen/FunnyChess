'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslation } from '@/context/LanguageContext';
import { Chessboard } from '@/components/Chessboard/Chessboard';
import { BrainCircuit, ArrowRight, Target, ShieldCheck, Sparkles } from 'lucide-react';

export const HackShowcase: React.FC = () => {
  const { t } = useTranslation();

  // Position after 1. e4 e5
  const sampleFen = 'rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2';

  return (
    <section style={{ padding: '5.5rem 0', position: 'relative', zIndex: 1 }}>
      <div className="container" style={{ maxWidth: '1160px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '3.5rem',
            alignItems: 'center',
          }}
        >
          {/* Left Column: Educational Explanation */}
          <div>
            <div className="badge badge-emerald" style={{ marginBottom: '1rem' }}>
              <BrainCircuit size={15} />
              <span>{t('hackShowcase.badge', 'Zero-Cheating Chess Assistant')}</span>
            </div>

            <h2 style={{ fontSize: 'clamp(2.1rem, 3.5vw, 2.9rem)', fontWeight: 800, marginBottom: '1rem', lineHeight: 1.2 }}>
              {t('hackShowcase.title', 'Meet the')} <span style={{ color: 'var(--accent-emerald)' }}>🧠 HACK</span> Mode
            </h2>

            <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.65, marginBottom: '1.75rem' }}>
              {t(
                'hackShowcase.subtitle',
                'Ever stared at a chessboard wondering: “What on earth should I move now?” HACK Mode doesn’t give you dry numbers like +1.42. It acts like a patient grandmaster coach.'
              )}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem', marginBottom: '2.2rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#10b981', marginTop: '0.5rem', flexShrink: 0 }} />
                <div style={{ fontSize: '0.94rem', color: '#e2e8f0', lineHeight: 1.5 }}>
                  <strong style={{ color: '#ffffff' }}>🟢 Best Move & Arrows:</strong> Clear tactical recommendation with visual arrows drawn directly on the board.
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#f59e0b', marginTop: '0.5rem', flexShrink: 0 }} />
                <div style={{ fontSize: '0.94rem', color: '#e2e8f0', lineHeight: 1.5 }}>
                  <strong style={{ color: '#ffffff' }}>🟡 Threat Radar:</strong> Warns you of hanging pieces or sneaky opponent checks before you make a mistake.
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#c084fc', marginTop: '0.5rem', flexShrink: 0 }} />
                <div style={{ fontSize: '0.94rem', color: '#e2e8f0', lineHeight: 1.5 }}>
                  <strong style={{ color: '#ffffff' }}>📚 Core Principles:</strong> Explains WHY in plain human language without confusing centipawn math.
                </div>
              </div>
            </div>

            <Link href="/play/ai" className="btn-emerald" style={{ padding: '0.9rem 2rem', fontSize: '1rem' }}>
              <span>{t('hackShowcase.btnTry', 'Try HACK Assistant in Game')}</span>
              <ArrowRight size={18} />
            </Link>
          </div>

          {/* Right Column: Visual Mini Board & Analysis Preview Card */}
          <div
            className="glass-panel"
            style={{
              padding: '2rem',
              border: '1px solid rgba(16, 185, 129, 0.35)',
              boxShadow: '0 16px 45px rgba(16, 185, 129, 0.15)',
              background: 'linear-gradient(135deg, #111a24, #121826)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem',
            }}
          >
            {/* Card Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '0.85rem', borderBottom: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <span style={{ fontSize: '1.4rem' }}>🧠</span>
                <span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#ffffff' }}>HACK MENTOR PREVIEW</span>
              </div>
              <div className="badge badge-emerald" style={{ fontSize: '0.75rem' }}>Active Coach</div>
            </div>

            {/* Mini Chessboard with Green Arrow g1 -> f3 */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Chessboard
                fen={sampleFen}
                interactive={false}
                customArrows={[{ from: 'g1', to: 'f3', color: '#10b981' }]}
                highlightSquares={['g1', 'f3']}
              />
            </div>

            {/* Recommended Move Breakdown */}
            <div
              style={{
                backgroundColor: 'rgba(16, 185, 129, 0.12)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: 'var(--radius-md)',
                padding: '1.1rem',
              }}
            >
              <div style={{ fontSize: '0.78rem', color: '#34d399', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.2rem' }}>
                {t('hackShowcase.recMove', 'Recommended Move')}
              </div>
              <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.5rem' }}>
                {t('hackShowcase.recMoveName', '♘ Nf3 (Knight to f3)')}
              </div>
              <ul style={{ margin: 0, paddingLeft: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.86rem', color: '#e2e8f0', lineHeight: 1.45 }}>
                <li>{t('hackShowcase.why1', 'Develops your knight towards the center')}</li>
                <li>{t('hackShowcase.why2', 'Controls important central squares (d4 & e5)')}</li>
                <li>{t('hackShowcase.why3', 'Prepares to castle your king safely to the fortress')}</li>
              </ul>
            </div>

            {/* What you are learning */}
            <div
              style={{
                padding: '0.85rem 1rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                {t('hackShowcase.learningTitle', 'What You Are Learning')}
              </div>
              <div style={{ fontSize: '0.88rem', color: '#f8fafc', fontWeight: 600 }}>
                {t('hackShowcase.learningPrinciple', '“Develop your minor pieces before launching a premature queen attack!”')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
