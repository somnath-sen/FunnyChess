'use client';

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Chess, Square, Move } from 'chess.js';
import { ChessPiece, PieceSymbol } from './ChessPiece';
import { sounds } from '@/lib/audio/soundEffects';
import {
  CHESS_ANIMATION_CONFIG,
  prefersReducedMotion,
  squareToCoords,
} from '@/lib/chess/animationConfig';

export interface Arrow {
  from: string;
  to: string;
  color?: string;
}

export interface ChessboardProps {
  fen?: string;
  orientation?: 'white' | 'black';
  interactive?: boolean;
  onMove?: (from: string, to: string, promotion?: string) => boolean | void;
  onMoveComplete?: () => void;
  highlightSquares?: string[];
  customArrows?: Arrow[];
  disabled?: boolean;
  soundEnabled?: boolean;
}

interface VisualPiece {
  id: string;
  square: string;
  type: 'p' | 'n' | 'b' | 'r' | 'q' | 'k';
  color: 'w' | 'b';
  isMoving?: boolean;
  isCaptured?: boolean;
}

const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const RANKS = ['8', '7', '6', '5', '4', '3', '2', '1'];

let pieceIdCounter = 0;

function createPiecesFromChess(chessInstance: Chess): VisualPiece[] {
  const pieces: VisualPiece[] = [];
  const board = chessInstance.board();
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const p = board[r][c];
      if (p) {
        const square = `${FILES[c]}${8 - r}`;
        pieces.push({
          id: `${p.color}_${p.type}_${square}_${++pieceIdCounter}`,
          square,
          type: p.type,
          color: p.color,
        });
      }
    }
  }
  return pieces;
}

export const Chessboard: React.FC<ChessboardProps> = ({
  fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
  orientation = 'white',
  interactive = true,
  onMove,
  onMoveComplete,
  highlightSquares = [],
  customArrows = [],
  disabled = false,
  soundEnabled = true,
}) => {
  // Authoritative chess instance
  const [chess, setChess] = useState<Chess>(() => {
    try {
      return new Chess(fen);
    } catch {
      return new Chess();
    }
  });

  // Visual animated pieces representation
  const [visualPieces, setVisualPieces] = useState<VisualPiece[]>(() => {
    try {
      return createPiecesFromChess(new Chess(fen));
    } catch {
      return createPiecesFromChess(new Chess());
    }
  });

  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [legalMoves, setLegalMoves] = useState<{ to: string; captured?: boolean }[]>([]);
  const [lastMove, setLastMove] = useState<{ from: string; to: string } | null>(null);

  // Visual check indicator is committed ONLY after piece arrival
  const [visualInCheckSquare, setVisualInCheckSquare] = useState<string | null>(null);

  // Input lock during piece travel animation
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  // Keep references to prevent race conditions
  const chessRef = useRef<Chess>(chess);
  chessRef.current = chess;

  const visualPiecesRef = useRef<VisualPiece[]>(visualPieces);
  visualPiecesRef.current = visualPieces;

  const animationTimerRef = useRef<NodeJS.Timeout | null>(null);
  const pendingFenRef = useRef<string | null>(null);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (animationTimerRef.current) {
        clearTimeout(animationTimerRef.current);
      }
    };
  }, []);

  const isWhiteOrientation = orientation === 'white';
  const displayFiles = isWhiteOrientation ? FILES : [...FILES].reverse();
  const displayRanks = isWhiteOrientation ? RANKS : [...RANKS].reverse();

  // Helper to find king square in check
  const getKingInCheckSquare = useCallback((chessInstance: Chess): string | null => {
    if (!chessInstance.inCheck()) return null;
    const turn = chessInstance.turn();
    const board = chessInstance.board();
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const piece = board[r][c];
        if (piece && piece.type === 'k' && piece.color === turn) {
          return `${FILES[c]}${8 - r}`;
        }
      }
    }
    return null;
  }, []);

  // Update visual check indicator on mount or non-animated sync
  useEffect(() => {
    if (!isAnimating) {
      setVisualInCheckSquare(getKingInCheckSquare(chess));
    }
  }, [chess, isAnimating, getKingInCheckSquare]);

  /**
   * Execute physical piece travel animation
   */
  const animateMove = useCallback(
    (
      from: string,
      to: string,
      capturedSquare?: string,
      castlingRook?: { from: string; to: string },
      promotion?: string,
      resultingChess?: Chess
    ) => {
      const reducedMotion = prefersReducedMotion();
      const moveDuration = reducedMotion
        ? CHESS_ANIMATION_CONFIG.reducedMotionDuration
        : CHESS_ANIMATION_CONFIG.normalMoveDuration;

      setIsAnimating(true);
      setSelectedSquare(null);
      setLegalMoves([]);
      setLastMove({ from, to });
      // Suppress check glow while piece is traveling
      setVisualInCheckSquare(null);

      setVisualPieces((prevPieces) => {
        return prevPieces.map((p) => {
          // 1. Moving piece
          if (p.square === from && !p.isCaptured) {
            return {
              ...p,
              square: to,
              isMoving: true,
            };
          }
          // 2. Regular capture or en passant captured piece
          if (capturedSquare && p.square === capturedSquare && !p.isCaptured) {
            return {
              ...p,
              isCaptured: true,
            };
          }
          // 3. Castling Rook movement
          if (castlingRook && p.square === castlingRook.from && !p.isCaptured) {
            return {
              ...p,
              square: castlingRook.to,
              isMoving: true,
            };
          }
          return p;
        });
      });

      if (animationTimerRef.current) {
        clearTimeout(animationTimerRef.current);
      }

      animationTimerRef.current = setTimeout(() => {
        // Animation completed at destination!
        const nextChess = resultingChess || chessRef.current;

        // Clean up visual pieces state
        setVisualPieces((prevPieces) => {
          return prevPieces
            .filter((p) => !p.isCaptured)
            .map((p) => {
              if (p.square === to) {
                return {
                  ...p,
                  isMoving: false,
                  type: (promotion as any) || p.type,
                };
              }
              if (castlingRook && p.square === castlingRook.to) {
                return {
                  ...p,
                  isMoving: false,
                };
              }
              return { ...p, isMoving: false };
            });
        });

        // Synchronize check visual state
        const checkSquare = getKingInCheckSquare(nextChess);
        setVisualInCheckSquare(checkSquare);

        // Sound on physical arrival
        if (soundEnabled) {
          if (capturedSquare) {
            sounds.playCapture();
          } else if (checkSquare) {
            sounds.playCheck();
          } else {
            sounds.playMove();
          }
        }

        setIsAnimating(false);
        if (onMoveComplete) {
          onMoveComplete();
        }
      }, moveDuration);
    },
    [getKingInCheckSquare, soundEnabled, onMoveComplete]
  );

  /**
   * Synchronize internal state when external `fen` changes
   * Diff FEN to detect opponent / AI / multiplayer moves for smooth animation
   */
  useEffect(() => {
    const currentFen = chess.fen();
    if (fen === currentFen) return;

    // Check if this new FEN is already being animated
    if (pendingFenRef.current === fen) {
      pendingFenRef.current = null;
      return;
    }

    try {
      const tempChess = new Chess(currentFen);
      const legalMovesList: Move[] = tempChess.moves({ verbose: true });

      // Find if single legal move turns currentFen into fen
      let matchingMove: Move | null = null;
      for (const m of legalMovesList) {
        const testChess = new Chess(currentFen);
        testChess.move(m);
        // Compare piece placement and active color
        const targetParts = fen.split(' ');
        const testParts = testChess.fen().split(' ');
        if (targetParts[0] === testParts[0] && targetParts[1] === testParts[1]) {
          matchingMove = m;
          break;
        }
      }

      if (matchingMove) {
        // Legal move detected (e.g. from AI or Friend over Realtime)
        const newChessInstance = new Chess(fen);
        setChess(newChessInstance);

        let capturedSq: string | undefined;
        if (matchingMove.captured) {
          if (matchingMove.flags.includes('e')) {
            // En passant: captured pawn is on source rank and dest file
            capturedSq = `${matchingMove.to[0]}${matchingMove.from[1]}`;
          } else {
            capturedSq = matchingMove.to;
          }
        }

        let rookMove: { from: string; to: string } | undefined;
        if (matchingMove.flags.includes('k')) {
          // Kingside castle
          rookMove = matchingMove.color === 'w' ? { from: 'h1', to: 'f1' } : { from: 'h8', to: 'f8' };
        } else if (matchingMove.flags.includes('q')) {
          // Queenside castle
          rookMove = matchingMove.color === 'w' ? { from: 'a1', to: 'd1' } : { from: 'a8', to: 'd8' };
        }

        animateMove(
          matchingMove.from,
          matchingMove.to,
          capturedSq,
          rookMove,
          matchingMove.promotion,
          newChessInstance
        );
      } else {
        // Position jump (reset, lesson change, undo, initial load) -> instant sync
        const newChess = new Chess(fen);
        setChess(newChess);
        setVisualPieces(createPiecesFromChess(newChess));
        setSelectedSquare(null);
        setLegalMoves([]);
        setIsAnimating(false);
      }
    } catch {
      const fallbackChess = new Chess();
      setChess(fallbackChess);
      setVisualPieces(createPiecesFromChess(fallbackChess));
    }
  }, [fen, chess, animateMove]);

  /**
   * Handle user square clicks with move input lock
   */
  const handleSquareClick = (square: string) => {
    // Prevent duplicate moves and conflicting interactions while piece is traveling
    if (disabled || !interactive || isAnimating) return;

    // 1. If a piece was already selected
    if (selectedSquare) {
      if (selectedSquare === square) {
        setSelectedSquare(null);
        setLegalMoves([]);
        return;
      }

      // Check if clicked square is a legal move destination
      const legalMatch = legalMoves.find((m) => m.to === square);
      if (legalMatch) {
        try {
          const moveConfig: any = {
            from: selectedSquare,
            to: square,
            promotion: 'q', // auto-promote to Queen for beginner friendliness
          };

          const newChess = new Chess(chess.fen());
          const moveResult = newChess.move(moveConfig);

          if (moveResult) {
            // Update authoritative chess state immediately
            setChess(newChess);
            pendingFenRef.current = newChess.fen();

            let capturedSq: string | undefined;
            if (moveResult.captured) {
              if (moveResult.flags.includes('e')) {
                capturedSq = `${square[0]}${selectedSquare[1]}`;
              } else {
                capturedSq = square;
              }
            }

            let rookMove: { from: string; to: string } | undefined;
            if (moveResult.flags.includes('k')) {
              rookMove = moveResult.color === 'w' ? { from: 'h1', to: 'f1' } : { from: 'h8', to: 'f8' };
            } else if (moveResult.flags.includes('q')) {
              rookMove = moveResult.color === 'w' ? { from: 'a1', to: 'd1' } : { from: 'a8', to: 'd8' };
            }

            // Trigger physical movement animation
            animateMove(
              selectedSquare,
              square,
              capturedSq,
              rookMove,
              moveResult.promotion,
              newChess
            );

            // Notify parent immediately so authoritative game state (Supabase / AI) receives the move
            if (onMove) {
              onMove(selectedSquare, square, 'q');
            }
            return;
          }
        } catch {
          sounds.playError();
        }
      }
    }

    // 2. Clicked a piece belonging to the side to move
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

  const reducedMotion = prefersReducedMotion();
  const transitionDuration = reducedMotion
    ? CHESS_ANIMATION_CONFIG.reducedMotionDuration
    : CHESS_ANIMATION_CONFIG.normalMoveDuration;
  const captureFadeDuration = reducedMotion
    ? 60
    : CHESS_ANIMATION_CONFIG.captureFadeDuration;

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
          width: 'min(86vw, 460px)',
          aspectRatio: '1',
          borderRadius: '10px',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* Layer 1: Squares Grid (64 Squares) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(8, 1fr)',
            gridTemplateRows: 'repeat(8, 1fr)',
            width: '100%',
            height: '100%',
            position: 'absolute',
            inset: 0,
          }}
        >
          {displayRanks.map((rank, rankIndex) =>
            displayFiles.map((file, fileIndex) => {
              const square = `${file}${rank}`;
              const isDark = (rankIndex + fileIndex) % 2 === 1;
              const isSelected = selectedSquare === square;
              const isLastMove = lastMove?.from === square || lastMove?.to === square;
              const isHighlighted = highlightSquares.includes(square);
              const isKingInCheck = visualInCheckSquare === square;
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
                    cursor: interactive && !disabled && !isAnimating ? 'pointer' : 'default',
                    transition: 'background-color 0.18s ease',
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
        </div>

        {/* Layer 2: Animated Physical Piece Layer */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
          }}
        >
          {visualPieces.map((piece) => {
            const coords = squareToCoords(piece.square, orientation);
            const symbol = (
              piece.color === 'w' ? piece.type.toUpperCase() : piece.type.toLowerCase()
            ) as PieceSymbol;

            const pieceTransform =
              'translate(' +
              coords.col * 100 +
              '%, ' +
              coords.row * 100 +
              '%)' +
              (piece.isCaptured ? ' scale(0.75)' : '');
            const pieceTransition = piece.isCaptured
              ? 'opacity ' + captureFadeDuration + 'ms ease, transform ' + captureFadeDuration + 'ms ease'
              : piece.isMoving
              ? 'transform ' + transitionDuration + 'ms ' + CHESS_ANIMATION_CONFIG.easing
              : 'none';

            return (
              <div
                key={piece.id}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '12.5%',
                  height: '12.5%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transform: pieceTransform,
                  opacity: piece.isCaptured ? 0 : 1,
                  transition: pieceTransition,
                  zIndex: piece.isMoving ? 25 : piece.isCaptured ? 5 : 10,
                  pointerEvents: 'none',
                  willChange: piece.isMoving ? 'transform' : 'auto',
                }}
              >
                <ChessPiece piece={symbol} />
              </div>
            );
          })}
        </div>

        {/* Layer 3: Custom SVG Arrows (e.g. for demonstrating moves / HACK mode) */}
        {customArrows.length > 0 && (
          <svg
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              pointerEvents: 'none',
              zIndex: 30,
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
