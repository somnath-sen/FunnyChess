'use client';

import React, { useState } from 'react';
import { AIDifficulty } from '@/lib/chess/aiEngine';
import { AIPersonalityId } from '@/lib/ai/personality/types';
import { AI_PERSONALITIES, PERSONALITY_LIST, DEFAULT_PERSONALITY_ID } from '@/lib/ai/personality/personalityConfig';
import { useTranslation } from '@/context/LanguageContext';
import { 
  Bot, 
  Play, 
  Dice5,
  X,
  Coffee,
  GraduationCap,
  Laugh,
  Flame,
  Crown
} from 'lucide-react';

export type PlayerColor = 'white' | 'black' | 'random';

interface AISetupModalProps {
  isOpen: boolean;
  onStartGame: (config: {
    difficulty: AIDifficulty;
    playerColor: 'white' | 'black';
    personality: AIPersonalityId;
  }) => void;
  initialDifficulty?: AIDifficulty;
  initialPersonality?: AIPersonalityId;
  onClose?: () => void;
}

const PERSONALITY_ICONS: Record<AIPersonalityId, React.ComponentType<any>> = {
  chill: Coffee,
  professor: GraduationCap,
  troll: Laugh,
  competitive: Flame,
  grandmaster: Crown,
};

export const AISetupModal: React.FC<AISetupModalProps> = ({
  isOpen,
  onStartGame,
  initialDifficulty = 'easy',
  initialPersonality = DEFAULT_PERSONALITY_ID,
  onClose,
}) => {
  const { t } = useTranslation();
  const [difficulty, setDifficulty] = useState<AIDifficulty>(initialDifficulty);
  const [selectedColor, setSelectedColor] = useState<PlayerColor>('white');
  const [personality, setPersonality] = useState<AIPersonalityId>(initialPersonality);

  if (!isOpen) return null;

  const handleStart = () => {
    const resolvedColor: 'white' | 'black' =
      selectedColor === 'random'
        ? Math.random() > 0.5 ? 'white' : 'black'
        : selectedColor;

    onStartGame({
      difficulty,
      playerColor: resolvedColor,
      personality,
    });
  };

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
    >
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '560px',
          maxHeight: '92vh',
          overflowY: 'auto',
          padding: '2rem',
          backgroundColor: '#111622',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          borderRadius: '24px',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8)',
          position: 'relative',
        }}
      >
        {onClose && (
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '1.25rem',
              right: '1.25rem',
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '0.4rem',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            title="Close"
          >
            <X size={20} />
          </button>
        )}

        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div
            style={{
              width: '54px',
              height: '54px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.7rem',
              margin: '0 auto 0.75rem',
              boxShadow: '0 8px 20px rgba(245, 158, 11, 0.3)',
            }}
          >
            🤖
          </div>
          <h2 style={{ fontSize: '1.6rem', color: '#ffffff', marginBottom: '0.35rem' }}>
            {t('playAi.setupTitle', 'Choose Your AI Opponent')}
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
            {t('playAi.setupSubtitle', 'Pick your difficulty, playing color, and AI personality!')}
          </p>
        </div>

        {/* 1. Difficulty Selector (Independent of personality) */}
        <div style={{ marginBottom: '1.4rem' }}>
          <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            {t('playAi.difficultyLabel', 'Engine Difficulty')}
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.55rem' }}>
            <button
              type="button"
              onClick={() => setDifficulty('easy')}
              style={{
                padding: '0.75rem 0.4rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: difficulty === 'easy' ? 'rgba(16, 185, 129, 0.18)' : 'rgba(255, 255, 255, 0.04)',
                border: `1px solid ${difficulty === 'easy' ? '#10b981' : 'var(--border-subtle)'}`,
                color: difficulty === 'easy' ? '#34d399' : 'var(--text-secondary)',
                fontWeight: 700,
                fontSize: '0.88rem',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <div style={{ fontSize: '1.1rem', marginBottom: '0.15rem' }}>🟢</div>
              <div>{t('common.easy', 'Easy')}</div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 500 }}>Casual</div>
            </button>

            <button
              type="button"
              onClick={() => setDifficulty('intermediate')}
              style={{
                padding: '0.75rem 0.4rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: difficulty === 'intermediate' ? 'rgba(245, 158, 11, 0.18)' : 'rgba(255, 255, 255, 0.04)',
                border: `1px solid ${difficulty === 'intermediate' ? '#f59e0b' : 'var(--border-subtle)'}`,
                color: difficulty === 'intermediate' ? '#fbbf24' : 'var(--text-secondary)',
                fontWeight: 700,
                fontSize: '0.88rem',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <div style={{ fontSize: '1.1rem', marginBottom: '0.15rem' }}>🟡</div>
              <div>{t('common.intermediate', 'Medium')}</div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 500 }}>Club Player</div>
            </button>

            <button
              type="button"
              onClick={() => setDifficulty('hard')}
              style={{
                padding: '0.75rem 0.4rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: difficulty === 'hard' ? 'rgba(239, 68, 68, 0.18)' : 'rgba(255, 255, 255, 0.04)',
                border: `1px solid ${difficulty === 'hard' ? '#ef4444' : 'var(--border-subtle)'}`,
                color: difficulty === 'hard' ? '#f87171' : 'var(--text-secondary)',
                fontWeight: 700,
                fontSize: '0.88rem',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <div style={{ fontSize: '1.1rem', marginBottom: '0.15rem' }}>🔴</div>
              <div>{t('common.hard', 'Hard')}</div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 500 }}>Master</div>
            </button>
          </div>
        </div>

        {/* 2. Choose Your Color */}
        <div style={{ marginBottom: '1.4rem' }}>
          <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            {t('playAi.playAsLabel', 'Play As')}
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.55rem' }}>
            <button
              type="button"
              onClick={() => setSelectedColor('white')}
              style={{
                padding: '0.6rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: selectedColor === 'white' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                border: `1px solid ${selectedColor === 'white' ? '#ffffff' : 'var(--border-subtle)'}`,
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.35rem',
                cursor: 'pointer',
              }}
            >
              <span>⚪</span>
              <span>White (1st)</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedColor('black')}
              style={{
                padding: '0.6rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: selectedColor === 'black' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                border: `1px solid ${selectedColor === 'black' ? '#ffffff' : 'var(--border-subtle)'}`,
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.35rem',
                cursor: 'pointer',
              }}
            >
              <span>⚫</span>
              <span>Black (2nd)</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedColor('random')}
              style={{
                padding: '0.6rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: selectedColor === 'random' ? 'rgba(245, 158, 11, 0.18)' : 'rgba(255, 255, 255, 0.03)',
                border: `1px solid ${selectedColor === 'random' ? 'var(--accent-gold)' : 'var(--border-subtle)'}`,
                color: selectedColor === 'random' ? 'var(--accent-gold)' : '#ffffff',
                fontWeight: 700,
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.35rem',
                cursor: 'pointer',
              }}
            >
              <Dice5 size={15} />
              <span>Random</span>
            </button>
          </div>
        </div>

        {/* 3. AI Personality (Phase 11 - 5 Personalities) */}
        <div style={{ marginBottom: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
              {t('aiPersonality.label', 'AI Personality')}
            </label>
            <span style={{ fontSize: '0.72rem', color: 'var(--accent-gold)', fontWeight: 600 }}>
              {t('aiPersonality.independentNote', 'Does not affect chess difficulty')}
            </span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '0.55rem' }}>
            {PERSONALITY_LIST.map((id) => {
              const p = AI_PERSONALITIES[id];
              const isSelected = personality === id;
              const Icon = PERSONALITY_ICONS[id] || Bot;

              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setPersonality(id)}
                  style={{
                    padding: '0.7rem 0.65rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: isSelected ? 'rgba(245, 158, 11, 0.14)' : 'rgba(255, 255, 255, 0.03)',
                    border: `1px solid ${isSelected ? 'var(--accent-gold)' : 'var(--border-subtle)'}`,
                    color: isSelected ? '#ffffff' : 'var(--text-secondary)',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    position: 'relative',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, fontSize: '0.88rem', marginBottom: '0.2rem' }}>
                    <span style={{ fontSize: '1.1rem' }}>{p.emoji}</span>
                    <span>{t(p.nameKey, p.id)}</span>
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', lineHeight: 1.3 }}>
                    {t(p.descKey, '')}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Start Match Button */}
        <button
          type="button"
          onClick={handleStart}
          className="btn-primary"
          style={{
            width: '100%',
            padding: '0.85rem',
            fontSize: '1rem',
          }}
        >
          <Play size={18} fill="currentColor" />
          <span>{t('playAi.startMatch', 'Start Chess Match')}</span>
        </button>
      </div>
    </div>
  );
};
