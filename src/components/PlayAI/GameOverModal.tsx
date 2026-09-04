'use client';

import React from 'react';
import confetti from 'canvas-confetti';
import { Trophy, RotateCcw, Sliders, ArrowRight, X } from 'lucide-react';

export type GameResultType = 'win' | 'loss' | 'draw';

interface GameOverModalProps {
  isOpen: boolean;
  result: GameResultType;
  reason: string;
  movesCount: number;
  difficulty: string;
  onRematch: () => void;
  onNewSetup: () => void;
  onClose: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  isOpen,
  result,
  reason,
  movesCount,
  difficulty,
  onRematch,
  onNewSetup,
  onClose,
}) => {
  if (!isOpen) return null;

  const isWin = result === 'win';
  const isLoss = result === 'loss';

  // Trigger confetti on player victory
  if (isWin) {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#10b981', '#fbbf24'],
      });
    } catch {}
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(5, 8, 15, 0.88)',
        backdropFilter: 'blur(12px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
      onClick={onClose}
    >
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '460px',
          padding: '2.5rem 2rem',
          backgroundColor: '#111622',
          border: `1px solid ${isWin ? '#10b981' : isLoss ? 'rgba(239, 68, 68, 0.4)' : 'var(--accent-gold)'}`,
          borderRadius: '24px',
          textAlign: 'center',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8)',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Emoji Avatar */}
        <div
          style={{
            width: '72px',
            height: '72px',
            borderRadius: '24px',
            background: isWin 
              ? 'linear-gradient(135deg, #10b981, #059669)'
              : isLoss 
              ? 'linear-gradient(135deg, #ef4444, #b91c1c)' 
              : 'linear-gradient(135deg, #f59e0b, #d97706)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2.4rem',
            margin: '0 auto 1.25rem',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
          }}
        >
          {isWin ? '🏆' : isLoss ? '😭' : '🤝'}
        </div>

        <h2 style={{ fontSize: '1.8rem', color: '#ffffff', marginBottom: '0.4rem' }}>
          {isWin ? 'Victory is Yours!' : isLoss ? 'The AI Got You!' : 'Draw Game!'}
        </h2>

        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
          {reason}
        </p>

        {/* Stats summary badge strip */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '1.5rem',
            padding: '0.85rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid var(--border-subtle)',
            marginBottom: '2rem',
            fontSize: '0.85rem',
          }}
        >
          <div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Difficulty</div>
            <div style={{ fontWeight: 700, color: '#ffffff', textTransform: 'capitalize' }}>{difficulty}</div>
          </div>
          <div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Moves</div>
            <div style={{ fontWeight: 700, color: '#ffffff' }}>{movesCount}</div>
          </div>
          <div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Result</div>
            <div style={{ fontWeight: 700, color: isWin ? '#34d399' : isLoss ? '#f87171' : '#fbbf24' }}>
              {isWin ? '+1 Win' : isLoss ? '+1 Loss' : 'Draw'}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <button
            onClick={onRematch}
            className="btn-primary"
            style={{ width: '100%', padding: '0.8rem', fontSize: '1rem' }}
          >
            <RotateCcw size={16} />
            <span>Rematch</span>
          </button>

          <button
            onClick={onNewSetup}
            className="btn-secondary"
            style={{ width: '100%', padding: '0.8rem', fontSize: '0.95rem' }}
          >
            <Sliders size={16} />
            <span>Change Setup / Difficulty</span>
          </button>
        </div>
      </div>
    </div>
  );
};
