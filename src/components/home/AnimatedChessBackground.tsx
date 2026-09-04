'use client';

import React, { useState, useEffect } from 'react';
import { ChessPiece, PieceSymbol } from '@/components/Chessboard/ChessPiece';

// Classical opening sequence (Italian Game: Giuoco Piano)
// Each step specifies the piece key and its new [fileIndex, rankIndex] (0-indexed, a=0, 1=7)
interface BoardMoveStep {
  pieceId: string;
  targetCol: number;
  targetRow: number;
  castlingRook?: { pieceId: string; targetCol: number; targetRow: number };
}

const INITIAL_PIECES: Record<string, { type: 'p' | 'r' | 'n' | 'b' | 'q' | 'k'; color: 'w' | 'b'; col: number; row: number }> = {
  // White Pieces (Rank 1 & 2 -> Row 7 & 6)
  'w_ra1': { type: 'r', color: 'w', col: 0, row: 7 },
  'w_nb1': { type: 'n', color: 'w', col: 1, row: 7 },
  'w_bc1': { type: 'b', color: 'w', col: 2, row: 7 },
  'w_qd1': { type: 'q', color: 'w', col: 3, row: 7 },
  'w_ke1': { type: 'k', color: 'w', col: 4, row: 7 },
  'w_bf1': { type: 'b', color: 'w', col: 5, row: 7 },
  'w_ng1': { type: 'n', color: 'w', col: 6, row: 7 },
  'w_rh1': { type: 'r', color: 'w', col: 7, row: 7 },
  'w_pa2': { type: 'p', color: 'w', col: 0, row: 6 },
  'w_pb2': { type: 'p', color: 'w', col: 1, row: 6 },
  'w_pc2': { type: 'p', color: 'w', col: 2, row: 6 },
  'w_pd2': { type: 'p', color: 'w', col: 3, row: 6 },
  'w_pe2': { type: 'p', color: 'w', col: 4, row: 6 },
  'w_pf2': { type: 'p', color: 'w', col: 5, row: 6 },
  'w_pg2': { type: 'p', color: 'w', col: 6, row: 6 },
  'w_ph2': { type: 'p', color: 'w', col: 7, row: 6 },

  // Black Pieces (Rank 8 & 7 -> Row 0 & 1)
  'b_ra8': { type: 'r', color: 'b', col: 0, row: 0 },
  'b_nb8': { type: 'n', color: 'b', col: 1, row: 0 },
  'b_bc8': { type: 'b', color: 'b', col: 2, row: 0 },
  'b_qd8': { type: 'q', color: 'b', col: 3, row: 0 },
  'b_ke8': { type: 'k', color: 'b', col: 4, row: 0 },
  'b_bf8': { type: 'b', color: 'b', col: 5, row: 0 },
  'b_ng8': { type: 'n', color: 'b', col: 6, row: 0 },
  'b_rh8': { type: 'r', color: 'b', col: 7, row: 0 },
  'b_pa7': { type: 'p', color: 'b', col: 0, row: 1 },
  'b_pb7': { type: 'p', color: 'b', col: 1, row: 1 },
  'b_pc7': { type: 'p', color: 'b', col: 2, row: 1 },
  'b_pd7': { type: 'p', color: 'b', col: 3, row: 1 },
  'b_pe7': { type: 'p', color: 'b', col: 4, row: 1 },
  'b_pf7': { type: 'p', color: 'b', col: 5, row: 1 },
  'b_pg7': { type: 'p', color: 'b', col: 6, row: 1 },
  'b_ph7': { type: 'p', color: 'b', col: 7, row: 1 },
};

const MOVE_SEQUENCE: BoardMoveStep[] = [
  // 1. e4 (w_pe2: col 4, row 6 -> row 4)
  { pieceId: 'w_pe2', targetCol: 4, targetRow: 4 },
  // 1... e5 (b_pe7: col 4, row 1 -> row 3)
  { pieceId: 'b_pe7', targetCol: 4, targetRow: 3 },
  // 2. Nf3 (w_ng1: col 6, row 7 -> col 5, row 5)
  { pieceId: 'w_ng1', targetCol: 5, targetRow: 5 },
  // 2... Nc6 (b_nb8: col 1, row 0 -> col 2, row 2)
  { pieceId: 'b_nb8', targetCol: 2, targetRow: 2 },
  // 3. Bc4 (w_bf1: col 5, row 7 -> col 2, row 4)
  { pieceId: 'w_bf1', targetCol: 2, targetRow: 4 },
  // 3... Bc5 (b_bf8: col 5, row 0 -> col 2, row 3)
  { pieceId: 'b_bf8', targetCol: 2, targetRow: 3 },
  // 4. O-O Kingside castling
  {
    pieceId: 'w_ke1',
    targetCol: 6,
    targetRow: 7,
    castlingRook: { pieceId: 'w_rh1', targetCol: 5, targetRow: 7 },
  },
];

export const AnimatedChessBackground: React.FC = () => {
  const [pieces, setPieces] = useState(INITIAL_PIECES);
  const [currentStep, setCurrentStep] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check reduced motion preference
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setPrefersReducedMotion(mediaQuery.matches);
    }
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) return;

    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < MOVE_SEQUENCE.length) {
          const move = MOVE_SEQUENCE[prev];
          setPieces((curr) => {
            const updated = { ...curr };
            if (updated[move.pieceId]) {
              updated[move.pieceId] = {
                ...updated[move.pieceId],
                col: move.targetCol,
                row: move.targetRow,
              };
            }
            if (move.castlingRook && updated[move.castlingRook.pieceId]) {
              updated[move.castlingRook.pieceId] = {
                ...updated[move.castlingRook.pieceId],
                col: move.castlingRook.targetCol,
                row: move.castlingRook.targetRow,
              };
            }
            return updated;
          });
          return prev + 1;
        } else {
          // Reset to initial positions after completing the sequence
          setPieces(INITIAL_PIECES);
          return 0;
        }
      });
    }, 6000); // Cinematic move every 6 seconds

    return () => clearInterval(interval);
  }, [prefersReducedMotion]);

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* 1. Vignette and Contrast Mask: guarantees text remains 100% readable */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle 850px at 50% 32%, rgba(10, 13, 20, 0.45) 0%, rgba(10, 13, 20, 0.88) 65%, rgba(10, 13, 20, 0.98) 100%)',
          zIndex: 2,
        }}
      />

      {/* 2. Perspective Board Canvas */}
      <div
        style={{
          width: 'min(125vw, 920px)',
          aspectRatio: '1',
          transform: 'perspective(1100px) rotateX(25deg) rotateZ(-6deg) translateY(-2%) scale(1.08)',
          borderRadius: '24px',
          border: '1px solid rgba(255, 255, 255, 0.06)',
          boxShadow: '0 30px 100px rgba(0, 0, 0, 0.85), inset 0 0 60px rgba(0, 0, 0, 0.8)',
          backgroundColor: '#0c101a',
          position: 'relative',
          opacity: 0.28,
          transition: 'opacity 0.6s ease',
        }}
      >
        {/* 8x8 Grid Squares */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(8, 1fr)',
            gridTemplateRows: 'repeat(8, 1fr)',
            width: '100%',
            height: '100%',
          }}
        >
          {Array.from({ length: 64 }).map((_, i) => {
            const row = Math.floor(i / 8);
            const col = i % 8;
            const isDark = (row + col) % 2 === 1;

            return (
              <div
                key={i}
                style={{
                  backgroundColor: isDark ? 'rgba(7, 10, 18, 0.85)' : 'rgba(255, 255, 255, 0.035)',
                  border: '1px solid rgba(255, 255, 255, 0.015)',
                }}
              />
            );
          })}
        </div>

        {/* Dynamic Chess Pieces with smooth animated transforms */}
        {Object.entries(pieces).map(([id, p]) => {
          const symbol: PieceSymbol = (p.color === 'w' ? p.type.toUpperCase() : p.type.toLowerCase()) as PieceSymbol;

          // Compute percentage coordinates
          const leftPercent = p.col * 12.5;
          const topPercent = p.row * 12.5;

          return (
            <div
              key={id}
              style={{
                position: 'absolute',
                width: '12.5%',
                height: '12.5%',
                left: `${leftPercent}%`,
                top: `${topPercent}%`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: prefersReducedMotion ? 'none' : 'left 1.2s cubic-bezier(0.25, 1, 0.5, 1), top 1.2s cubic-bezier(0.25, 1, 0.5, 1)',
                zIndex: 1,
              }}
            >
              <div
                style={{
                  width: '75%',
                  height: '75%',
                  opacity: p.color === 'w' ? 0.95 : 0.75,
                }}
              >
                <ChessPiece piece={symbol} size="100%" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
