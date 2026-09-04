'use client';

import React, { useState } from 'react';
import { AIDifficulty } from '@/lib/chess/aiEngine';
import { AIPersonality } from '@/lib/chess/aiComments';
import { useTranslation } from '@/context/LanguageContext';
import { 
  Bot, 
  Sparkles, 
  Play, 
  Crown, 
  ShieldCheck, 
  Flame, 
  Zap,
  Dice5,
  Laugh,
  Skull,
  GraduationCap,
  Cat
} from 'lucide-react';

export type PlayerColor = 'white' | 'black' | 'random';

interface AISetupModalProps {
  isOpen: boolean;
  onStartGame: (config: {
    difficulty: AIDifficulty;
    playerColor: 'white' | 'black';
    personality: AIPersonality;
  }) => void;
  onClose?: () => void;
}

export const AISetupModal: React.FC<AISetupModalProps> = ({
  isOpen,
  onStartGame,
  onClose,
}) => {
  const { t } = useTranslation();
  const [difficulty, setDifficulty] = useState<AIDifficulty>('easy');
  const [selectedColor, setSelectedColor] = useState<PlayerColor>('white');
  const [personality, setPersonality] = useState<AIPersonality>('comedian');

  if (!isOpen) return null;

  const handleStart = () => {
    let resolvedColor: 'white' | 'black' = selectedColor === 'random'
      ? (Math.random() > 0.5 ? 'white' : 'black')
      : selectedColor;

    onStartGame({
      difficulty,
      playerColor: resolvedColor,
      personality,
    });
  };

  const personalities = [
    { id: 'comedian' as AIPersonality, name: 'The Comedian', emoji: '😂', desc: 'Sarcastic jokes & funny excuses', icon: Laugh },
    { id: 'villain' as AIPersonality, name: 'The Villain', emoji: '😈', desc: 'Dramatic evil mastermind taunts', icon: Skull },
    { id: 'professor' as AIPersonality, name: 'The Professor', emoji: '🤓', desc: 'Nerdy chess history & advice', icon: GraduationCap },
    { id: 'cat' as AIPersonality, name: 'Cute Cat', emoji: '🐱', desc: 'Meows, purrs & playful swiping', icon: Cat },
  ];

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
          padding: '2.2rem',
          backgroundColor: '#111622',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          borderRadius: '24px',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8)',
          position: 'relative',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '18px',
              background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.8rem',
              margin: '0 auto 0.75rem',
              boxShadow: '0 8px 20px rgba(245, 158, 11, 0.3)',
            }}
          >
            🤖
          </div>
          <h2 style={{ fontSize: '1.7rem', color: '#ffffff', marginBottom: '0.35rem' }}>
            Choose Your AI Opponent
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
            Pick your difficulty, playing color, and the bot’s comedy style!
          </p>
        </div>

        {/* 1. Difficulty Selector */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.6rem' }}>
            Engine Difficulty
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.65rem' }}>
            <button
              onClick={() => setDifficulty('easy')}
              style={{
                padding: '0.8rem 0.5rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: difficulty === 'easy' ? 'rgba(16, 185, 129, 0.18)' : 'rgba(255, 255, 255, 0.04)',
                border: `1px solid ${difficulty === 'easy' ? '#10b981' : 'var(--border-subtle)'}`,
                color: difficulty === 'easy' ? '#34d399' : 'var(--text-secondary)',
                fontWeight: 700,
                fontSize: '0.9rem',
                textAlign: 'center',
                transition: 'all 0.15s ease',
              }}
            >
              <div style={{ fontSize: '1.2rem', marginBottom: '0.2rem' }}>🟢</div>
              <div>Easy</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 500 }}>Casual / Learner</div>
            </button>

            <button
              onClick={() => setDifficulty('intermediate')}
              style={{
                padding: '0.8rem 0.5rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: difficulty === 'intermediate' ? 'rgba(245, 158, 11, 0.18)' : 'rgba(255, 255, 255, 0.04)',
                border: `1px solid ${difficulty === 'intermediate' ? '#f59e0b' : 'var(--border-subtle)'}`,
                color: difficulty === 'intermediate' ? '#fbbf24' : 'var(--text-secondary)',
                fontWeight: 700,
                fontSize: '0.9rem',
                textAlign: 'center',
                transition: 'all 0.15s ease',
              }}
            >
              <div style={{ fontSize: '1.2rem', marginBottom: '0.2rem' }}>🟡</div>
              <div>Medium</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 500 }}>Club Player</div>
            </button>

            <button
              onClick={() => setDifficulty('hard')}
              style={{
                padding: '0.8rem 0.5rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: difficulty === 'hard' ? 'rgba(239, 68, 68, 0.18)' : 'rgba(255, 255, 255, 0.04)',
                border: `1px solid ${difficulty === 'hard' ? '#ef4444' : 'var(--border-subtle)'}`,
                color: difficulty === 'hard' ? '#f87171' : 'var(--text-secondary)',
                fontWeight: 700,
                fontSize: '0.9rem',
                textAlign: 'center',
                transition: 'all 0.15s ease',
              }}
            >
              <div style={{ fontSize: '1.2rem', marginBottom: '0.2rem' }}>🔴</div>
              <div>Hard</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 500 }}>Stockfish Master</div>
            </button>
          </div>
        </div>

        {/* 2. Choose Your Color */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.6rem' }}>
            Play As
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.65rem' }}>
            <button
              onClick={() => setSelectedColor('white')}
              style={{
                padding: '0.65rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: selectedColor === 'white' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                border: `1px solid ${selectedColor === 'white' ? '#ffffff' : 'var(--border-subtle)'}`,
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.88rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem',
              }}
            >
              <span>⚪</span>
              <span>White (1st)</span>
            </button>

            <button
              onClick={() => setSelectedColor('black')}
              style={{
                padding: '0.65rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: selectedColor === 'black' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                border: `1px solid ${selectedColor === 'black' ? '#ffffff' : 'var(--border-subtle)'}`,
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.88rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem',
              }}
            >
              <span>⚫</span>
              <span>Black (2nd)</span>
            </button>

            <button
              onClick={() => setSelectedColor('random')}
              style={{
                padding: '0.65rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: selectedColor === 'random' ? 'rgba(245, 158, 11, 0.18)' : 'rgba(255, 255, 255, 0.03)',
                border: `1px solid ${selectedColor === 'random' ? 'var(--accent-gold)' : 'var(--border-subtle)'}`,
                color: selectedColor === 'random' ? 'var(--accent-gold)' : '#ffffff',
                fontWeight: 700,
                fontSize: '0.88rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem',
              }}
            >
              <Dice5 size={16} />
              <span>Random</span>
            </button>
          </div>
        </div>

        {/* 3. AI Personality */}
        <div style={{ marginBottom: '2rem' }}>
          <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.6rem' }}>
            AI Personality & Banter
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.65rem' }}>
            {personalities.map((p) => {
              const isSelected = personality === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setPersonality(p.id)}
                  style={{
                    padding: '0.75rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: isSelected ? 'rgba(245, 158, 11, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                    border: `1px solid ${isSelected ? 'var(--accent-gold)' : 'var(--border-subtle)'}`,
                    color: isSelected ? '#ffffff' : 'var(--text-secondary)',
                    textAlign: 'left',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, fontSize: '0.92rem', marginBottom: '0.2rem' }}>
                    <span>{p.emoji}</span>
                    <span>{p.name}</span>
                  </div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', lineHeight: 1.3 }}>
                    {p.desc}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Start Button */}
        <button
          onClick={handleStart}
          className="btn-primary"
          style={{
            width: '100%',
            padding: '0.9rem',
            fontSize: '1.05rem',
          }}
        >
          <Play size={18} fill="currentColor" />
          <span>Start Chess Match</span>
        </button>
      </div>
    </div>
  );
};
