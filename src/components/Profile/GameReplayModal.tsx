'use client';

import React, { useState, useEffect } from 'react';
import { Chess } from 'chess.js';
import { Chessboard } from '@/components/Chessboard/Chessboard';
import { PersistedGameRecord } from '@/lib/gamification/gamificationService';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight, 
  Play, 
  Pause, 
  Swords, 
  Calendar, 
  Trophy 
} from 'lucide-react';

interface GameReplayModalProps {
  game: PersistedGameRecord | null;
  onClose: () => void;
}

export const GameReplayModal: React.FC<GameReplayModalProps> = ({ game, onClose }) => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [fens, setFens] = useState<string[]>([]);

  // Pre-calculate FENs for every step of the game
  useEffect(() => {
    if (!game) return;
    const chess = new Chess();
    const fenList: string[] = [chess.fen()];

    for (const san of game.moveHistory) {
      try {
        chess.move(san);
        fenList.push(chess.fen());
      } catch {
        break;
      }
    }

    setFens(fenList);
    setCurrentStep(fenList.length - 1); // Start at final position
    setIsPlaying(false);
  }, [game]);

  // Auto-play timer
  useEffect(() => {
    if (!isPlaying) return;
    if (currentStep >= fens.length - 1) {
      setIsPlaying(false);
      return;
    }

    const timer = setTimeout(() => {
      setCurrentStep((prev) => prev + 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, fens.length]);

  if (!game) return null;

  const currentFen = fens[currentStep] || 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(5, 8, 14, 0.85)',
        backdropFilter: 'blur(12px)',
        zIndex: 9999,
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
          maxWidth: '850px',
          maxHeight: '92vh',
          overflowY: 'auto',
          padding: '2rem',
          backgroundColor: '#0d131f',
          border: '1px solid rgba(245, 158, 11, 0.35)',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.6)',
          position: 'relative',
        }}
      >
        {/* Top Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <span className="badge badge-gold" style={{ fontSize: '0.75rem' }}>
                {game.game_type === 'ai' ? '🤖 AI Match' : '👥 Friend Match'}
              </span>
              <span
                style={{
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  color: game.result === 'win' ? '#34d399' : game.result === 'loss' ? '#f87171' : '#fde68a',
                }}
              >
                {game.result.toUpperCase()}
              </span>
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
              Replay vs {game.opponent}
            </h2>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              Played on {game.date} • {game.movesCount} total moves
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '0.4rem',
            }}
          >
            <X size={22} />
          </button>
        </div>

        {/* Replay Body */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '1.5rem',
            alignItems: 'center',
          }}
        >
          {/* Left: Interactive Board */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <Chessboard
              fen={currentFen}
              orientation={game.playerColor || 'white'}
              interactive={false}
            />

            {/* Replay Controls Toolbar */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                padding: '0.4rem 0.75rem',
                borderRadius: 'var(--radius-full)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <button
                onClick={() => {
                  setIsPlaying(false);
                  setCurrentStep(0);
                }}
                disabled={currentStep === 0}
                style={{
                  background: 'none',
                  border: 'none',
                  color: currentStep === 0 ? 'var(--text-muted)' : '#ffffff',
                  cursor: currentStep === 0 ? 'default' : 'pointer',
                  padding: '0.35rem',
                }}
                title="First Move"
              >
                <ChevronsLeft size={18} />
              </button>

              <button
                onClick={() => {
                  setIsPlaying(false);
                  setCurrentStep((p) => Math.max(0, p - 1));
                }}
                disabled={currentStep === 0}
                style={{
                  background: 'none',
                  border: 'none',
                  color: currentStep === 0 ? 'var(--text-muted)' : '#ffffff',
                  cursor: currentStep === 0 ? 'default' : 'pointer',
                  padding: '0.35rem',
                }}
                title="Previous Move"
              >
                <ChevronLeft size={18} />
              </button>

              <button
                onClick={() => setIsPlaying(!isPlaying)}
                style={{
                  background: 'var(--accent-gold)',
                  border: 'none',
                  color: '#0a0d14',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
                title={isPlaying ? 'Pause' : 'Auto Play'}
              >
                {isPlaying ? <Pause size={15} /> : <Play size={15} fill="currentColor" />}
              </button>

              <button
                onClick={() => {
                  setIsPlaying(false);
                  setCurrentStep((p) => Math.min(fens.length - 1, p + 1));
                }}
                disabled={currentStep >= fens.length - 1}
                style={{
                  background: 'none',
                  border: 'none',
                  color: currentStep >= fens.length - 1 ? 'var(--text-muted)' : '#ffffff',
                  cursor: currentStep >= fens.length - 1 ? 'default' : 'pointer',
                  padding: '0.35rem',
                }}
                title="Next Move"
              >
                <ChevronRight size={18} />
              </button>

              <button
                onClick={() => {
                  setIsPlaying(false);
                  setCurrentStep(fens.length - 1);
                }}
                disabled={currentStep >= fens.length - 1}
                style={{
                  background: 'none',
                  border: 'none',
                  color: currentStep >= fens.length - 1 ? 'var(--text-muted)' : '#ffffff',
                  cursor: currentStep >= fens.length - 1 ? 'default' : 'pointer',
                  padding: '0.35rem',
                }}
                title="Final Position"
              >
                <ChevronsRight size={18} />
              </button>
            </div>
          </div>

          {/* Right: Move History List */}
          <div
            style={{
              maxHeight: '380px',
              overflowY: 'auto',
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              borderRadius: 'var(--radius-md)',
              padding: '1rem',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.6rem' }}>
              Move List (Click move to jump)
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.35rem' }}>
              {game.moveHistory.map((move, idx) => {
                const moveStep = idx + 1;
                const isSelected = currentStep === moveStep;
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      setIsPlaying(false);
                      setCurrentStep(moveStep);
                    }}
                    style={{
                      padding: '0.4rem 0.6rem',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: isSelected ? 'rgba(245, 158, 11, 0.25)' : 'rgba(255, 255, 255, 0.03)',
                      border: `1px solid ${isSelected ? 'var(--accent-gold)' : 'transparent'}`,
                      color: isSelected ? 'var(--accent-gold)' : '#e2e8f0',
                      fontSize: '0.84rem',
                      fontFamily: 'monospace',
                      cursor: 'pointer',
                      textAlign: 'left',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                    }}
                  >
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.74rem' }}>
                      {Math.floor(idx / 2) + 1}.{idx % 2 === 1 ? '..' : ''}
                    </span>
                    <span style={{ fontWeight: isSelected ? 800 : 500 }}>{move}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
