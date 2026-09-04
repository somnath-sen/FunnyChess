'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Chess, Square } from 'chess.js';
import { ChessPiece, PieceSymbol } from './ChessPiece';
import { sounds } from '@/lib/audio/soundEffects';

export interface Arrow {
  from: string;
  to: string;
  color?: string;
}

interface ChessboardProps {
  fen?: string;
  orientation?: 'white' | 'black';
  interactive?: boolean;
  onMove?: (from: string, to: string, promotion?: string) => boolean | void;
  highlightSquares?: string[];
  customArrows?: Arrow[];
  disabled?: boolean;
}

const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const RANKS = ['8', '7', '6', '5', '4', '3', '2', '1'];

export const Chessboard: React.FC<ChessboardProps> = ({
  fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
  orientation = 'white',
  interactive = true,
  onMove,
  highlightSquares = [],
  customArrows = [],
  disabled = false,
}) => {
  const [chess, setChess] = useState<Chess>(() => {
    try {
      return new Chess(fen);
    } catch {
      return new Chess();
    }
  });
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [legalMoves, setLegalMoves] = useState<{ to: string; captured?: boolean }[]>([]);
  const [lastMove, setLastMove] = useState<{ from: string; to: string } | null>(null);

  // Sync internal chess instance when external FEN changes
  useEffect(() => {
    try {
      const newChess = new Chess(fen);
      setChess(newChess);
      setSelectedSquare(null);
      setLegalMoves([]);
    } catch {
      // invalid FEN fallback to default start
      setChess(new Chess());
    }
  }, [fen]);

  const isWhiteOrientation = orientation === 'white';
  const displayFiles = isWhiteOrientation ? FILES : [...FILES].reverse();
  const displayRanks = isWhiteOrientation ? RANKS : [...RANKS].reverse();

  // Find king in check
  const inCheck = chess.inCheck();
  const checkKingSquare = useMemo(() => {
    if (!inCheck) return null;
    const turn = chess.turn();
    const board = chess.board();
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const piece = board[r][c];
        if (piece && piece.type === 'k' && piece.color === turn) {
          return `${FILES[c]}${8 - r}`;
        }
      }
    }
    return null;
  }, [chess, inCheck]);

  const handleSquareClick = (square: string) => {
    if (disabled || !interactive) return;

    // 1. If a piece was already selected
    if (selectedSquare) {
      // If clicking same square, deselect
      if (selectedSquare === square) {
        setSelectedSquare(null);
        setLegalMoves([]);
        return;
      }

      // Check if clicked square is a valid legal move destination
      const isLegal = legalMoves.some((m) => m.to === square);
      if (isLegal) {
        // Execute move
        try {
          const moveConfig: any = {
            from: selectedSquare,
            to: square,
            promotion: 'q', // auto-promote to Queen for beginner friendliness
          };

          const result = chess.move(moveConfig);
          if (result) {
            // Play appropriate sound
            if (result.captured) {
              sounds.playCapture();
            } else if (chess.inCheck()) {
              sounds.playCheck();
            } else {
              sounds.playMove();
            }

            setLastMove({ from: selectedSquare, to: square });
            setSelectedSquare(null);
            setLegalMoves([]);

            if (onMove) {
              onMove(selectedSquare, square, 'q');
            }
            return;
          }
        } catch {
          // Illegal move
          sounds.playError();
        }
      }
    }

    // 2. Otherwise, check if clicking a piece belonging to the side to move
    const piece = chess.get(square as Square);
    if (piece && piece.color === chess.turn()) {
      setSelectedSquare(square);
      const moves = chess.moves({ square: square as Square, verbose: true });
      setLegalMoves(
        moves.map((m) => ({
          to: m.to,
          captured: Boolean(m.captured),
        }))
      );
    } else {
      setSelectedSquare(null);
      setLegalMoves([]);
    }
  };

  return (
    <div
      style={{
        display: 'inline-block',
        position: 'relative',
        userSelect: 'none',
        padding: '8px',
        backgroundColor: '#182030',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        boxShadow: '0 16px 40px rgba(0, 0, 0, 0.6), 0 0 30px rgba(0, 0, 0, 0.4)',
        maxWidth: '100%',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(8, 1fr)',
          gridTemplateRows: 'repeat(8, 1fr)',
          width: 'min(86vw, 460px)',
          aspectRatio: '1',
          borderRadius: '10px',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {displayRanks.map((rank, rankIndex) =>
          displayFiles.map((file, fileIndex) => {
            const square = `${file}${rank}`;
            const isDark = (rankIndex + fileIndex) % 2 === 1;
            const piece = chess.get(square as Square);
            const isSelected = selectedSquare === square;
            const isLastMove = lastMove?.from === square || lastMove?.to === square;
            const isHighlighted = highlightSquares.includes(square);
            const isKingInCheck = checkKingSquare === square;
            const legalMoveDest = legalMoves.find((m) => m.to === square);

            let squareBg = isDark ? '#739552' : '#ebecd0';
            if (isSelected) {
              squareBg = '#baca44';
            } else if (isLastMove) {
              squareBg = isDark ? '#a9bd5c' : '#ceda8b';
            } else if (isHighlighted) {
              squareBg = isDark ? '#e5a524' : '#f6cd6e';
            }

            return (
              <div
                key={square}
                onClick={() => handleSquareClick(square)}
                style={{
                  backgroundColor: squareBg,
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: interactive && !disabled ? 'pointer' : 'default',
                  transition: 'background-color 0.15s ease',
                  boxShadow: isKingInCheck ? 'inset 0 0 16px rgba(239, 68, 68, 0.9)' : undefined,
                }}
              >
                {/* File coordinate on bottom rank */}
                {rankIndex === 7 && (
                  <span
                    style={{
                      position: 'absolute',
                      bottom: '2px',
                      right: '3px',
                      fontSize: '10px',
                      fontWeight: 800,
                      color: isDark ? '#ebecd0' : '#739552',
                      pointerEvents: 'none',
                    }}
                  >
                    {file}
                  </span>
                )}

                {/* Rank coordinate on first file */}
                {fileIndex === 0 && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '2px',
                      left: '3px',
                      fontSize: '10px',
                      fontWeight: 800,
                      color: isDark ? '#ebecd0' : '#739552',
                      pointerEvents: 'none',
                    }}
                  >
                    {rank}
                  </span>
                )}

                {/* King in Check pulsing alert glow */}
                {isKingInCheck && (
                  <div
                    style={{
                      position: 'absolute',
                      inset: '4px',
                      borderRadius: '50%',
                      background: 'radial-gradient(circle, rgba(239, 68, 68, 0.8) 0%, rgba(239, 68, 68, 0) 75%)',
                      pointerEvents: 'none',
                    }}
                  />
                )}

                {/* Piece Vector */}
                {piece && (
                  <ChessPiece
                    piece={
                      (piece.color === 'w'
                        ? piece.type.toUpperCase()
                        : piece.type.toLowerCase()) as PieceSymbol
                    }
                  />
                )}

                {/* Legal Move Dot */}
                {legalMoveDest && !legalMoveDest.captured && (
                  <div
                    style={{
                      width: '30%',
                      height: '30%',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(0, 0, 0, 0.22)',
                      pointerEvents: 'none',
                    }}
                  />
                )}

                {/* Legal Capture Ring */}
                {legalMoveDest && legalMoveDest.captured && (
                  <div
                    style={{
                      position: 'absolute',
                      inset: '4px',
                      borderRadius: '50%',
                      border: '4px solid rgba(0, 0, 0, 0.3)',
                      pointerEvents: 'none',
                    }}
                  />
                )}
              </div>
            );
          })
        )}

        {/* Custom SVG Arrows (e.g. for demonstrating moves / HACK mode) */}
        {customArrows.length > 0 && (
          <svg
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              pointerEvents: 'none',
            }}
          >
            <defs>
              <marker
                id="arrowhead-gold"
                markerWidth="8"
                markerHeight="8"
                refX="5"
                refY="4"
                orient="auto"
              >
                <path d="M 0 0 L 8 4 L 0 8 z" fill="#f59e0b" />
              </marker>
              <marker
                id="arrowhead-green"
                markerWidth="8"
                markerHeight="8"
                refX="5"
                refY="4"
                orient="auto"
              >
                <path d="M 0 0 L 8 4 L 0 8 z" fill="#10b981" />
              </marker>
              <marker
                id="arrowhead-red"
                markerWidth="8"
                markerHeight="8"
                refX="5"
                refY="4"
                orient="auto"
              >
                <path d="M 0 0 L 8 4 L 0 8 z" fill="#ef4444" />
              </marker>
            </defs>
            {customArrows.map((arrow, idx) => {
              const fromCol = displayFiles.indexOf(arrow.from[0]);
              const fromRow = displayRanks.indexOf(arrow.from[1]);
              const toCol = displayFiles.indexOf(arrow.to[0]);
              const toRow = displayRanks.indexOf(arrow.to[1]);

              if (fromCol === -1 || fromRow === -1 || toCol === -1 || toRow === -1) return null;

              const x1 = `${(fromCol + 0.5) * 12.5}%`;
              const y1 = `${(fromRow + 0.5) * 12.5}%`;
              const x2 = `${(toCol + 0.5) * 12.5}%`;
              const y2 = `${(toRow + 0.5) * 12.5}%`;

              const markerId =
                arrow.color === '#10b981'
                  ? 'url(#arrowhead-green)'
                  : arrow.color === '#ef4444'
                  ? 'url(#arrowhead-red)'
                  : 'url(#arrowhead-gold)';

              return (
                <line
                  key={idx}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={arrow.color || '#f59e0b'}
                  strokeWidth="5.5"
                  strokeLinecap="round"
                  markerEnd={markerId}
                  opacity={0.88}
                />
              );
            })}
          </svg>
        )}
      </div>
    </div>
  );
};
