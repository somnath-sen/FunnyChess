'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Chess, Square } from 'chess.js';
import { Chessboard } from '@/components/Chessboard/Chessboard';
import { AISetupModal, PlayerColor } from '@/components/PlayAI/AISetupModal';
import { GameOverModal, GameResultType } from '@/components/PlayAI/GameOverModal';
import { VoiceControlWidget } from '@/components/Voice/VoiceControlWidget';
import { HackPanel } from '@/components/HackMode/HackPanel';
import { analyzePosition, HackAnalysis } from '@/lib/chess/hackEngine';
import { useSpeech, SpeechPriority } from '@/hooks/useSpeech';
import { chessAI, AIDifficulty } from '@/lib/chess/aiEngine';
import { getAIComment, AIPersonality, GameEvent } from '@/lib/chess/aiComments';
import { VoiceLanguage } from '@/lib/audio/voiceSpeech';
import { sounds } from '@/lib/audio/soundEffects';
import { useTranslation, Language } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { ProtectedRoute } from '@/components/Auth/ProtectedRoute';
import { 
  Bot, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  Flag, 
  Handshake, 
  BrainCircuit, 
  Sliders, 
  Flame,
  CheckCircle2,
  HelpCircle,
  Clock
} from 'lucide-react';

export default function PlayAIPage() {
  return (
    <ProtectedRoute feature="ai">
      <PlayAIContent />
    </ProtectedRoute>
  );
}

function PlayAIContent() {
  const { language, t } = useTranslation();
  const { recordGameResult } = useAuth();

  // Setup state
  const [isSetupOpen, setIsSetupOpen] = useState(false);
  const [difficulty, setDifficulty] = useState<AIDifficulty>('easy');
  const [playerColor, setPlayerColor] = useState<'white' | 'black'>('white');
  const [personality, setPersonality] = useState<AIPersonality>('comedian');

  // Game Engine & Board state
  const [game, setGame] = useState<Chess>(() => new Chess());
  const [fen, setFen] = useState<string>(game.fen());
  const [isAIThinking, setIsAIThinking] = useState(false);
  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const [capturedWhite, setCapturedWhite] = useState<string[]>([]); // pieces captured by white
  const [capturedBlack, setCapturedBlack] = useState<string[]>([]); // pieces captured by black

  // Voice Engine via useSpeech hook
  const speech = useSpeech(language as VoiceLanguage);
  const [isVoiceWidgetOpen, setIsVoiceWidgetOpen] = useState(false);

  // AI Persona state
  const [aiComment, setAiComment] = useState<string>('Ready to play! Make your move! ♟️');

  // Game Over state
  const [isGameOverOpen, setIsGameOverOpen] = useState(false);
  const [gameResult, setGameResult] = useState<GameResultType>('win');
  const [gameOverReason, setGameOverReason] = useState('');

  // HACK Mode Learning Assistant State
  const [hackEnabled, setHackEnabled] = useState(false);
  const [hackAnalysis, setHackAnalysis] = useState<HackAnalysis | null>(null);
  const [hackLoading, setHackLoading] = useState(false);

  // Analyze position when HACK is enabled and FEN changes
  useEffect(() => {
    if (!hackEnabled || game.isGameOver()) {
      setHackAnalysis(null);
      return;
    }

    let active = true;
    setHackLoading(true);

    analyzePosition(fen, language as any).then((res) => {
      if (active) {
        setHackAnalysis(res);
        setHackLoading(false);
      }
    });

    return () => {
      active = false;
    };
  }, [hackEnabled, fen, language, game]);

  // Personality Avatars
  const personaEmojis: Record<AIPersonality, string> = {
    comedian: '😂',
    villain: '😈',
    professor: '🤓',
    cat: '🐱',
  };

  const personaNames: Record<AIPersonality, string> = {
    comedian: 'FunnyBot (Comedian)',
    villain: 'Lord Checkmate (Villain)',
    professor: 'Prof. Morphy (Professor)',
    cat: 'Grandmaster Whiskers (Cat)',
  };

  // Trigger funny AI voice & speech bubble with priority queue
  const triggerAIReaction = useCallback((event: GameEvent, priority: SpeechPriority = 'medium') => {
    const comment = getAIComment(personality, event, speech.voiceLanguage);
    setAiComment(comment);
    speech.speak(comment, { priority, lang: speech.voiceLanguage });
  }, [personality, speech]);

  // Handle Game Over
  const handleGameEnd = useCallback((result: GameResultType, reason: string) => {
    setGameResult(result);
    setGameOverReason(reason);
    setIsGameOverOpen(true);

    if (result === 'win') {
      sounds.playSuccess();
      triggerAIReaction('checkmate_player_wins', 'high');
    } else if (result === 'loss') {
      sounds.playCheck();
      triggerAIReaction('checkmate_ai_wins', 'high');
    }

    recordGameResult(result, difficulty);
  }, [difficulty, recordGameResult, triggerAIReaction]);

  // Execute AI turn
  const makeAIMove = useCallback(async (currentChess: Chess) => {
    if (currentChess.isGameOver()) return;

    setIsAIThinking(true);
    try {
      const bestMove = await chessAI.getBestMove(currentChess, difficulty);
      const move = currentChess.move({
        from: bestMove.from,
        to: bestMove.to,
        promotion: bestMove.promotion || 'q',
      });

      if (move) {
        // Track captured piece
        if (move.captured) {
          const cap = move.captured;
          if (playerColor === 'white') {
            setCapturedBlack((prev) => [...prev, cap]);
          } else {
            setCapturedWhite((prev) => [...prev, cap]);
          }
          sounds.playCapture();
        } else if (currentChess.inCheck()) {
          sounds.playCheck();
        } else {
          sounds.playMove();
        }

        // Update board state
        setFen(currentChess.fen());
        setMoveHistory(currentChess.history());

        // Contextual AI Reaction
        if (currentChess.isCheckmate()) {
          handleGameEnd('loss', 'The AI delivered checkmate!');
        } else if (currentChess.isDraw()) {
          handleGameEnd('draw', 'Game ended in a draw!');
        } else if (currentChess.inCheck()) {
          triggerAIReaction('check_by_ai');
        } else if (move.captured === 'q') {
          triggerAIReaction('capture_queen');
        } else if (move.captured) {
          triggerAIReaction('capture_piece');
        } else if (move.flags.includes('k') || move.flags.includes('q')) {
          triggerAIReaction('castling');
        } else if (move.promotion) {
          triggerAIReaction('promotion');
        } else if (Math.random() < 0.28) {
          triggerAIReaction('quiet_move');
        }
      }
    } catch {
      // AI fallback
    } finally {
      setIsAIThinking(false);
    }
  }, [difficulty, playerColor, handleGameEnd, triggerAIReaction]);

  // Handle player move
  const handlePlayerMove = (from: string, to: string, promotion?: string) => {
    if (isAIThinking || game.isGameOver()) return;

    // Check if it is currently player's turn
    const isPlayerTurn = (playerColor === 'white' && game.turn() === 'w') ||
                         (playerColor === 'black' && game.turn() === 'b');

    if (!isPlayerTurn) return;

    const move = game.move({
      from,
      to,
      promotion: promotion || 'q',
    });

    if (move) {
      if (move.captured) {
        const cap = move.captured;
        if (playerColor === 'white') {
          setCapturedWhite((prev) => [...prev, cap]);
        } else {
          setCapturedBlack((prev) => [...prev, cap]);
        }
      }

      setFen(game.fen());
      setMoveHistory(game.history());

      // Check player outcome
      if (game.isCheckmate()) {
        handleGameEnd('win', 'Congratulations! You delivered checkmate on the AI!');
        return;
      }
      if (game.isDraw()) {
        handleGameEnd('draw', 'Game ended in a draw (Stalemate or repetition)!');
        return;
      }

      // Contextual reaction to player's move
      if (game.inCheck()) {
        triggerAIReaction('check_by_player');
      } else if (move.captured === 'q') {
        triggerAIReaction('capture_queen');
      }

      // Schedule AI turn
      setTimeout(() => {
        makeAIMove(game);
      }, 300);
    }
  };

  // Start new match
  const startNewGame = (config: {
    difficulty: AIDifficulty;
    playerColor: 'white' | 'black';
    personality: AIPersonality;
  }) => {
    const newChess = new Chess();
    setGame(newChess);
    setFen(newChess.fen());
    setMoveHistory([]);
    setCapturedWhite([]);
    setCapturedBlack([]);
    setDifficulty(config.difficulty);
    setPlayerColor(config.playerColor);
    setPersonality(config.personality);
    setIsSetupOpen(false);
    setIsGameOverOpen(false);
    setIsAIThinking(false);

    // Initial greeting
    const welcome = getAIComment(config.personality, 'game_start', speech.voiceLanguage);
    setAiComment(welcome);
    speech.speak(welcome, { priority: 'high', lang: speech.voiceLanguage });

    // If player chose Black, AI moves first
    if (config.playerColor === 'black') {
      setTimeout(() => {
        makeAIMove(newChess);
      }, 600);
    }
  };

  // Resign button
  const handleResign = () => {
    if (game.isGameOver()) return;
    if (confirm('Are you sure you want to resign this match?')) {
      handleGameEnd('loss', 'You resigned the game.');
    }
  };

  // Offer draw
  const handleDraw = () => {
    if (game.isGameOver()) return;
    // AI accepts draw if position is relatively balanced or in easy mode
    if (difficulty === 'easy' || moveHistory.length > 25) {
      alert('🤝 AI says: "I accept your peace treaty! Draw game!"');
      handleGameEnd('draw', 'Players agreed to a draw.');
    } else {
      triggerAIReaction('quiet_move');
      alert('🤖 AI says: "No way! The battle is just getting spicy!"');
    }
  };

  return (
    <div className="container" style={{ padding: '2rem 1.25rem 5rem' }}>
      {/* Top Header Bar */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          marginBottom: '1.75rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #10b981, #059669)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.8rem',
              boxShadow: '0 6px 18px rgba(16, 185, 129, 0.3)',
            }}
          >
            🤖
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Play With AI</h1>
              <span
                className={
                  difficulty === 'easy'
                    ? 'badge badge-emerald'
                    : difficulty === 'intermediate'
                    ? 'badge badge-gold'
                    : 'badge badge-purple'
                }
                style={{ textTransform: 'capitalize', fontSize: '0.75rem' }}
              >
                {difficulty}
              </span>
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Opponent: <strong>{personaNames[personality]}</strong> • Playing as{' '}
              <strong>{playerColor === 'white' ? 'White (⚪)' : 'Black (⚫)'}</strong>
            </div>
          </div>
        </div>

        {/* Header Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          {/* Voice Quick Toggle */}
          <button
            onClick={() => speech.setVoiceEnabled(!speech.voiceEnabled)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.55rem 0.85rem',
              borderRadius: 'var(--radius-full)',
              backgroundColor: speech.voiceEnabled ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.05)',
              border: `1px solid ${speech.voiceEnabled ? 'rgba(16, 185, 129, 0.4)' : 'var(--border-subtle)'}`,
              color: speech.voiceEnabled ? '#34d399' : 'var(--text-muted)',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
            title="Toggle Voice ON / OFF"
          >
            {speech.voiceEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
            <span>{speech.voiceEnabled ? 'Voice ON' : 'Muted'}</span>
          </button>

          {/* Voice Settings Widget Trigger */}
          <button
            onClick={() => setIsVoiceWidgetOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.55rem 0.85rem',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'rgba(245, 158, 11, 0.12)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              color: 'var(--accent-gold)',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
            title="Configure AI Spoken Language and Volume"
          >
            <span>🎙️</span>
            <span style={{ textTransform: 'uppercase', fontSize: '0.78rem', fontWeight: 700 }}>
              {speech.voiceLanguage}
            </span>
          </button>

          {/* HACK Mode Button (Phase 6 link) */}
          <button
            onClick={() => setHackEnabled(!hackEnabled)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.55rem 1rem',
              borderRadius: 'var(--radius-full)',
              backgroundColor: hackEnabled ? 'rgba(245, 158, 11, 0.15)' : 'rgba(255, 255, 255, 0.05)',
              border: `1px solid ${hackEnabled ? 'var(--accent-gold)' : 'var(--border-subtle)'}`,
              color: hackEnabled ? 'var(--accent-gold)' : 'var(--text-secondary)',
              fontSize: '0.85rem',
              fontWeight: 700,
            }}
          >
            <BrainCircuit size={16} />
            <span>🧠 HACK {hackEnabled ? 'ACTIVE' : 'OFF'}</span>
          </button>

          {/* Match Setup Trigger */}
          <button
            onClick={() => setIsSetupOpen(true)}
            className="btn-secondary"
            style={{ padding: '0.55rem 1rem', fontSize: '0.88rem' }}
          >
            <Sliders size={16} />
            <span>Match Setup</span>
          </button>
        </div>
      </div>

      {/* Main Playing Arena: Responsive 2 Columns */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '2rem',
          alignItems: 'start',
        }}
      >
        {/* Left Arena: Chessboard & Player Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
          {/* Opponent (AI) Status Strip */}
          <div
            className="glass-panel"
            style={{
              width: '100%',
              padding: '0.75rem 1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              border: isAIThinking ? '1px solid rgba(16, 185, 129, 0.5)' : '1px solid var(--border-subtle)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(255, 255, 255, 0.06)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.3rem',
                }}
              >
                {personaEmojis[personality]}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#ffffff' }}>
                  {personaNames[personality]}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {playerColor === 'white' ? 'Playing as Black (⚫)' : 'Playing as White (⚪)'}
                </div>
              </div>
            </div>

            {/* Captured Pieces by AI */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.85rem', letterSpacing: '1px' }}>
                {(playerColor === 'white' ? capturedBlack : capturedWhite).map((p, i) => (
                  <span key={i} style={{ opacity: 0.8 }}>
                    {p.toUpperCase()}
                  </span>
                ))}
              </span>
              {isAIThinking && (
                <div className="badge badge-emerald animate-pulse-subtle" style={{ fontSize: '0.75rem' }}>
                  Thinking... 💭
                </div>
              )}
            </div>
          </div>

          {/* Interactive Chessboard */}
          <Chessboard
            fen={fen}
            orientation={playerColor}
            interactive={!isAIThinking && !game.isGameOver()}
            onMove={handlePlayerMove}
            customArrows={
              hackEnabled && hackAnalysis?.bestMove
                ? [{ from: hackAnalysis.bestMove.from, to: hackAnalysis.bestMove.to, color: '#10b981' }]
                : []
            }
            highlightSquares={
              hackEnabled && hackAnalysis?.bestMove
                ? [hackAnalysis.bestMove.from, hackAnalysis.bestMove.to]
                : []
            }
          />

          {/* Player Status Strip */}
          <div
            className="glass-panel"
            style={{
              width: '100%',
              padding: '0.75rem 1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--accent-gold)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '1rem',
                  color: '#0a0d14',
                }}
              >
                P
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#ffffff' }}>
                  You (Player)
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {playerColor === 'white' ? 'White (⚪)' : 'Black (⚫)'}
                </div>
              </div>
            </div>

            {/* Captured Pieces by Player */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.85rem', letterSpacing: '1px' }}>
                {(playerColor === 'white' ? capturedWhite : capturedBlack).map((p, i) => (
                  <span key={i} style={{ opacity: 0.8 }}>
                    {p.toUpperCase()}
                  </span>
                ))}
              </span>
              {!isAIThinking && !game.isGameOver() && (
                <div className="badge badge-gold" style={{ fontSize: '0.75rem' }}>
                  Your Turn ♟️
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Arena: AI Commentary, Move History & Game Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* AI Chat Dialogue Bubble */}
          <div
            className="glass-panel"
            style={{
              padding: '1.5rem',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              backgroundColor: '#111622',
              position: 'relative',
              boxShadow: 'var(--shadow-glow)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.4rem' }}>{personaEmojis[personality]}</span>
                <span style={{ fontWeight: 800, fontSize: '1rem', color: '#ffffff' }}>
                  {personaNames[personality]}
                </span>
              </div>
              {speech.isPlaying && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                  <div style={{ width: '4px', height: '14px', backgroundColor: 'var(--accent-gold)', borderRadius: '2px', animation: 'pulseSubtle 0.5s infinite' }} />
                  <div style={{ width: '4px', height: '20px', backgroundColor: 'var(--accent-gold)', borderRadius: '2px', animation: 'pulseSubtle 0.3s infinite' }} />
                  <div style={{ width: '4px', height: '10px', backgroundColor: 'var(--accent-gold)', borderRadius: '2px', animation: 'pulseSubtle 0.4s infinite' }} />
                </div>
              )}
            </div>

            <div
              style={{
                padding: '1.1rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'rgba(245, 158, 11, 0.08)',
                border: '1px solid rgba(245, 158, 11, 0.2)',
                color: '#f8fafc',
                fontSize: '1rem',
                lineHeight: 1.5,
                fontStyle: 'italic',
                minHeight: '64px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              “{aiComment}”
            </div>
          </div>

          {/* HACK Mode Learning Assistant Panel */}
          {hackEnabled && (
            <HackPanel
              analysis={hackAnalysis}
              loading={hackLoading}
              onClose={() => setHackEnabled(false)}
              lang={language as any}
            />
          )}

          {/* Move History Table */}
          <div
            className="glass-panel"
            style={{
              padding: '1.25rem',
              maxHeight: '220px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                Move Notation History
              </span>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                {Math.ceil(moveHistory.length / 2)} Turns
              </span>
            </div>

            {moveHistory.length === 0 ? (
              <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontStyle: 'italic', padding: '1rem 0', textAlign: 'center' }}>
                Game has just begun! Make a move to see algebraic notation.
              </div>
            ) : (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
                  gap: '0.4rem',
                  fontSize: '0.88rem',
                }}
              >
                {Array.from({ length: Math.ceil(moveHistory.length / 2) }).map((_, i) => {
                  const whiteMove = moveHistory[i * 2];
                  const blackMove = moveHistory[i * 2 + 1];
                  return (
                    <div
                      key={i}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        padding: '0.25rem 0.5rem',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: 'rgba(255, 255, 255, 0.03)',
                      }}
                    >
                      <span style={{ color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.8rem' }}>
                        {i + 1}.
                      </span>
                      <span style={{ color: '#ffffff', fontWeight: 600 }}>{whiteMove}</span>
                      {blackMove && <span style={{ color: 'var(--text-secondary)' }}>{blackMove}</span>}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Action Game Controls */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
            <button
              onClick={() => setIsSetupOpen(true)}
              className="btn-primary"
              style={{ padding: '0.75rem 0.5rem', fontSize: '0.88rem' }}
            >
              <RotateCcw size={15} />
              <span>New Match</span>
            </button>

            <button
              onClick={handleDraw}
              className="btn-secondary"
              style={{ padding: '0.75rem 0.5rem', fontSize: '0.88rem' }}
            >
              <Handshake size={15} />
              <span>Offer Draw</span>
            </button>

            <button
              onClick={handleResign}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem',
                padding: '0.75rem 0.5rem',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#f87171',
                fontSize: '0.88rem',
                fontWeight: 600,
                transition: 'all 0.15s ease',
              }}
            >
              <Flag size={15} />
              <span>Resign</span>
            </button>
          </div>
        </div>
      </div>

      {/* AISetupModal */}
      <AISetupModal
        isOpen={isSetupOpen}
        onStartGame={startNewGame}
        onClose={() => setIsSetupOpen(false)}
      />

      {/* GameOverModal */}
      <GameOverModal
        isOpen={isGameOverOpen}
        result={gameResult}
        reason={gameOverReason}
        movesCount={moveHistory.length}
        difficulty={difficulty}
        onRematch={() => {
          startNewGame({
            difficulty,
            playerColor,
            personality,
          });
        }}
        onNewSetup={() => {
          setIsGameOverOpen(false);
          setIsSetupOpen(true);
        }}
        onClose={() => setIsGameOverOpen(false)}
      />

      {/* VoiceControlWidget */}
      <VoiceControlWidget
        isOpen={isVoiceWidgetOpen}
        onClose={() => setIsVoiceWidgetOpen(false)}
        voiceEnabled={speech.voiceEnabled}
        volume={speech.volume}
        voiceLanguage={speech.voiceLanguage}
        activeVoiceName={speech.activeVoiceName}
        isAvailable={speech.isAvailable}
        isPlaying={speech.isPlaying}
        onToggleVoice={speech.setVoiceEnabled}
        onChangeVolume={speech.setVolume}
        onChangeLanguage={speech.setVoiceLanguage}
        onTestVoice={speech.testVoice}
      />
    </div>
  );
}
