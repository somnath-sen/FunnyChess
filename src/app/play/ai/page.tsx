'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Chess } from 'chess.js';
import { Chessboard } from '@/components/Chessboard/Chessboard';
import { AISetupModal, PlayerColor } from '@/components/PlayAI/AISetupModal';
import { GameOverModal, GameResultType } from '@/components/PlayAI/GameOverModal';
import { VoiceControlWidget } from '@/components/Voice/VoiceControlWidget';
import { PersonalitySelector } from '@/components/PlayAI/PersonalitySelector';
import { HackPanel } from '@/components/HackMode/HackPanel';
import { analyzePosition, HackAnalysis } from '@/lib/chess/hackEngine';
import { useSpeech, SpeechPriority } from '@/hooks/useSpeech';
import { chessAI, AIDifficulty } from '@/lib/chess/aiEngine';
import { AIPersonalityId, AIEmotionalState, ChessContextInput } from '@/lib/ai/personality/types';
import {
  AI_PERSONALITIES,
  PERSONALITY_LIST,
  DEFAULT_PERSONALITY_ID,
  EMOTION_CONFIG,
  THINKING_STATUS_TEXT,
} from '@/lib/ai/personality/personalityConfig';
import { ReactionEngine } from '@/lib/ai/personality/reactionEngine';
import { VoiceLanguage } from '@/lib/audio/voiceSpeech';
import { sounds } from '@/lib/audio/soundEffects';
import { useTranslation } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { ProtectedRoute } from '@/components/Auth/ProtectedRoute';
import { 
  Bot, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  Flag, 
  Handshake, 
  BrainCircuit, 
  Sliders, 
  Sparkles
} from 'lucide-react';

const STORAGE_PERSONALITY_KEY = 'funnychess_ai_personality';

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

  // Phase 11 AI Personality State with persistent preference
  const [personality, setPersonality] = useState<AIPersonalityId>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_PERSONALITY_KEY) as AIPersonalityId;
        if (saved && PERSONALITY_LIST.includes(saved)) {
          return saved;
        }
      } catch {}
    }
    return DEFAULT_PERSONALITY_ID;
  });

  // AI Emotional State (session only, resets on new match)
  const [aiEmotion, setAiEmotion] = useState<AIEmotionalState>(
    AI_PERSONALITIES[personality]?.defaultEmotion || 'neutral'
  );

  // Reaction Engine reference
  const reactionEngineRef = useRef<ReactionEngine>(new ReactionEngine(personality));
  const pendingReactionTimerRef = useRef<NodeJS.Timeout | null>(null);

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

  // AI Dialogue Bubble text
  const [aiComment, setAiComment] = useState<string>(() => {
    return speech.voiceLanguage === 'hi'
      ? 'तैयार हैं? अपनी चाल चलिए! ♟️'
      : speech.voiceLanguage === 'bn'
      ? 'খেলা শুরু করার জন্য প্রস্তুত! চাল দিন! ♟️'
      : 'Ready to play! Make your move! ♟️';
  });

  // Game Over state
  const [isGameOverOpen, setIsGameOverOpen] = useState(false);
  const [gameResult, setGameResult] = useState<GameResultType>('win');
  const [gameOverReason, setGameOverReason] = useState('');

  // HACK Mode Learning Assistant State
  const [hackEnabled, setHackEnabled] = useState(false);
  const [hackAnalysis, setHackAnalysis] = useState<HackAnalysis | null>(null);
  const [hackLoading, setHackLoading] = useState(false);

  // Synchronize personality changes with ReactionEngine and storage
  const handlePersonalityChange = useCallback((newPersonality: AIPersonalityId) => {
    setPersonality(newPersonality);
    reactionEngineRef.current.setPersonality(newPersonality);
    setAiEmotion(reactionEngineRef.current.getEmotionalState());
    try {
      localStorage.setItem(STORAGE_PERSONALITY_KEY, newPersonality);
    } catch {}
  }, []);

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

  // Clean up pending reaction timer on unmount
  useEffect(() => {
    return () => {
      if (pendingReactionTimerRef.current) {
        clearTimeout(pendingReactionTimerRef.current);
      }
    };
  }, []);

  // Handle Game Over
  const handleGameEnd = useCallback((result: GameResultType, reason: string) => {
    setGameResult(result);
    setGameOverReason(reason);
    setIsGameOverOpen(true);

    if (pendingReactionTimerRef.current) {
      clearTimeout(pendingReactionTimerRef.current);
    }

    const context: ChessContextInput = {
      whoseMove: result === 'win' ? 'player' : 'ai',
      moveSan: '',
      isCheck: false,
      isCheckmate: result === 'win' || result === 'loss',
      isDraw: result === 'draw',
    };

    const reaction = reactionEngineRef.current.generateReaction(
      context,
      speech.voiceLanguage as 'en' | 'hi' | 'bn',
      true
    );

    if (reaction) {
      pendingReactionTimerRef.current = setTimeout(() => {
        setAiComment(reaction.text);
        setAiEmotion(reaction.newEmotion);
        speech.speak(reaction.text, { priority: 'high', lang: speech.voiceLanguage });
      }, 650);
    }

    recordGameResult(result, difficulty);
  }, [difficulty, recordGameResult, speech]);

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
        }

        // Update authoritative board state
        setFen(currentChess.fen());
        setMoveHistory(currentChess.history());

        // Contextual AI Reaction
        if (currentChess.isCheckmate()) {
          handleGameEnd('loss', 'The AI delivered checkmate!');
        } else if (currentChess.isDraw()) {
          handleGameEnd('draw', 'Game ended in a draw!');
        } else {
          const context: ChessContextInput = {
            whoseMove: 'ai',
            moveSan: move.san,
            moveFlags: move.flags,
            capturedPiece: move.captured,
            isCheck: currentChess.inCheck(),
            isCheckmate: false,
            isDraw: false,
            isCastling: move.flags.includes('k') || move.flags.includes('q'),
            isPromotion: !!move.promotion,
            isEnPassant: move.flags.includes('e'),
            moveCount: currentChess.history().length,
          };

          const reaction = reactionEngineRef.current.generateReaction(
            context,
            speech.voiceLanguage as 'en' | 'hi' | 'bn'
          );

          if (reaction) {
            // Reaction appears and voice speaks AFTER piece arrival animation (~600ms)
            pendingReactionTimerRef.current = setTimeout(() => {
              setAiComment(reaction.text);
              setAiEmotion(reaction.newEmotion);
              speech.speak(reaction.text, { priority: 'medium', lang: speech.voiceLanguage });
            }, 600);
          }
        }
      }
    } catch {
      // AI fallback
    } finally {
      setIsAIThinking(false);
    }
  }, [difficulty, playerColor, handleGameEnd, speech]);

  // Handle player move
  const handlePlayerMove = (from: string, to: string, promotion?: string) => {
    if (isAIThinking || game.isGameOver()) return;

    // Check if it is currently player's turn
    const isPlayerTurn =
      (playerColor === 'white' && game.turn() === 'w') ||
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

      // Check contextual reaction to player's move (e.g. check or queen capture)
      const context: ChessContextInput = {
        whoseMove: 'player',
        moveSan: move.san,
        moveFlags: move.flags,
        capturedPiece: move.captured,
        isCheck: game.inCheck(),
        isCheckmate: false,
        isDraw: false,
        isCastling: move.flags.includes('k') || move.flags.includes('q'),
        isPromotion: !!move.promotion,
        isEnPassant: move.flags.includes('e'),
        moveCount: game.history().length,
      };

      if (game.inCheck() || move.captured === 'q' || move.captured) {
        const reaction = reactionEngineRef.current.generateReaction(
          context,
          speech.voiceLanguage as 'en' | 'hi' | 'bn'
        );

        if (reaction) {
          pendingReactionTimerRef.current = setTimeout(() => {
            setAiComment(reaction.text);
            setAiEmotion(reaction.newEmotion);
            speech.speak(reaction.text, { priority: 'medium', lang: speech.voiceLanguage });
          }, 600);
        }
      }

      // Schedule AI turn after player piece finishes smooth travel
      setTimeout(() => {
        makeAIMove(game);
      }, 650);
    }
  };

  // Start new match
  const startNewGame = (config: {
    difficulty: AIDifficulty;
    playerColor: 'white' | 'black';
    personality: AIPersonalityId;
  }) => {
    // Clear speech & pending reaction timers
    speech.stop();
    if (pendingReactionTimerRef.current) {
      clearTimeout(pendingReactionTimerRef.current);
    }

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

    // Save personality preference
    try {
      localStorage.setItem(STORAGE_PERSONALITY_KEY, config.personality);
    } catch {}

    // Reset reaction engine & emotional state
    reactionEngineRef.current.setPersonality(config.personality);
    reactionEngineRef.current.resetForNewGame();
    setAiEmotion('neutral');

    // Initial greeting
    const welcome = reactionEngineRef.current.generateReaction(
      {
        whoseMove: 'ai',
        moveSan: '',
        isCheck: false,
        isCheckmate: false,
        isDraw: false,
        gameStart: true,
      },
      speech.voiceLanguage as 'en' | 'hi' | 'bn',
      true
    );

    if (welcome) {
      setAiComment(welcome.text);
      speech.speak(welcome.text, { priority: 'high', lang: speech.voiceLanguage });
    }

    // If player chose Black, AI moves first
    if (config.playerColor === 'black') {
      setTimeout(() => {
        makeAIMove(newChess);
      }, 700);
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
    // AI accepts draw if in easy mode or after sufficient moves
    if (difficulty === 'easy' || moveHistory.length > 25) {
      handleGameEnd('draw', 'Players agreed to a draw.');
    } else {
      const context: ChessContextInput = {
        whoseMove: 'ai',
        moveSan: '',
        isCheck: false,
        isCheckmate: false,
        isDraw: false,
      };
      const rejectReaction = reactionEngineRef.current.generateReaction(
        context,
        speech.voiceLanguage as 'en' | 'hi' | 'bn',
        true
      );
      if (rejectReaction) {
        setAiComment(rejectReaction.text);
        speech.speak(rejectReaction.text, { priority: 'medium', lang: speech.voiceLanguage });
      }
    }
  };

  const currentPersonalityConfig = AI_PERSONALITIES[personality] || AI_PERSONALITIES.chill;
  const currentEmotionConfig = EMOTION_CONFIG[aiEmotion] || EMOTION_CONFIG.neutral;
  const isGameActive = moveHistory.length > 0 && !game.isGameOver();

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
          marginBottom: '1.5rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '14px',
              background: currentPersonalityConfig.avatarBg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.7rem',
              boxShadow: '0 6px 18px rgba(0, 0, 0, 0.4)',
            }}
          >
            {currentPersonalityConfig.emoji}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>
                {t('playAi.title', 'Play With AI')}
              </h1>
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
              {t('playAi.opponent', 'Opponent')}:{' '}
              <strong style={{ color: '#ffffff' }}>
                {t(currentPersonalityConfig.nameKey, personality)}
              </strong>{' '}
              • {t('playAi.playingAs', 'Playing as')}:{' '}
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
              backgroundColor: speech.voiceEnabled
                ? 'rgba(16, 185, 129, 0.15)'
                : 'rgba(255, 255, 255, 0.05)',
              border: `1px solid ${
                speech.voiceEnabled ? 'rgba(16, 185, 129, 0.4)' : 'var(--border-subtle)'
              }`,
              color: speech.voiceEnabled ? '#34d399' : 'var(--text-muted)',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
            title="Toggle Voice ON / OFF"
          >
            {speech.voiceEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
            <span>{speech.voiceEnabled ? t('playAi.voiceOn', 'Voice ON') : t('playAi.muted', 'Muted')}</span>
          </button>

          {/* Voice Settings Trigger */}
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

          {/* HACK Mode Button */}
          <button
            onClick={() => setHackEnabled(!hackEnabled)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
              padding: '0.55rem 0.85rem',
              minWidth: '130px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: hackEnabled
                ? 'rgba(245, 158, 11, 0.18)'
                : 'rgba(255, 255, 255, 0.05)',
              border: `1px solid ${hackEnabled ? 'var(--accent-gold)' : 'var(--border-subtle)'}`,
              color: hackEnabled ? 'var(--accent-gold)' : 'var(--text-secondary)',
              fontSize: '0.85rem',
              fontWeight: 700,
              transition: 'background-color 0.2s ease, border-color 0.2s ease',
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
            <span>{t('playAi.newMatch', 'Match Setup')}</span>
          </button>
        </div>
      </div>

      {/* Phase 11: Quick AI Personality Selector Bar */}
      <div
        style={{
          marginBottom: '1.5rem',
          padding: '0.65rem 1rem',
          borderRadius: 'var(--radius-lg)',
          backgroundColor: '#0d111a',
          border: '1px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.45rem',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.78rem',
            color: 'var(--text-muted)',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span>🤖 {t('aiPersonality.label', 'AI Personality')}</span>
            <span style={{ fontWeight: 400, opacity: 0.7, textTransform: 'none' }}>
              ({t('aiPersonality.independentNote', 'Does not affect chess difficulty')})
            </span>
          </div>
          {isGameActive && (
            <span
              style={{
                fontSize: '0.7rem',
                color: '#10b981',
                fontWeight: 600,
                textTransform: 'none',
              }}
            >
              ● {t('playAi.activeGame', 'Active Game')}
            </span>
          )}
        </div>

        <PersonalitySelector
          selected={personality}
          onChange={handlePersonalityChange}
          compact
        />
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
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.75rem',
          }}
        >
          {/* Opponent (AI) Status Strip */}
          <div
            className="glass-panel"
            style={{
              width: '100%',
              padding: '0.75rem 1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              border: isAIThinking
                ? '1px solid rgba(16, 185, 129, 0.5)'
                : '1px solid var(--border-subtle)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: currentPersonalityConfig.avatarBg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.3rem',
                }}
              >
                {currentPersonalityConfig.emoji}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#ffffff' }}>
                  {t(currentPersonalityConfig.nameKey, personality)}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {playerColor === 'white' ? 'Playing as Black (⚫)' : 'Playing as White (⚪)'}
                </div>
              </div>
            </div>

            {/* Captured Pieces by AI & Thinking badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.85rem', letterSpacing: '1px' }}>
                {(playerColor === 'white' ? capturedBlack : capturedWhite).map((p, i) => (
                  <span key={i} style={{ opacity: 0.8 }}>
                    {p.toUpperCase()}
                  </span>
                ))}
              </span>
              {isAIThinking && (
                <div
                  className="badge badge-emerald animate-pulse-subtle"
                  style={{ fontSize: '0.75rem' }}
                >
                  {t(
                    currentPersonalityConfig.thinkingKey,
                    THINKING_STATUS_TEXT[personality][
                      (speech.voiceLanguage as 'en' | 'hi' | 'bn') || 'en'
                    ] || 'Thinking... 💭'
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Interactive Chessboard - Preserves Phase 10 layout stability */}
          <Chessboard
            fen={fen}
            orientation={playerColor}
            interactive={!isAIThinking && !game.isGameOver()}
            onMove={handlePlayerMove}
            customArrows={
              hackEnabled && hackAnalysis?.bestMove
                ? [
                    {
                      from: hackAnalysis.bestMove.from,
                      to: hackAnalysis.bestMove.to,
                      color: '#10b981',
                    },
                  ]
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

            {/* Captured Pieces by Player & Your Turn Badge */}
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
                  {t('common.yourTurn', 'Your Turn ♟️')}
                </div>
              )}
            </div>
          </div>

          {/* Primary Action Controls */}
          <div
            style={{
              width: '100%',
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '0.65rem',
            }}
          >
            <button
              onClick={() => setIsSetupOpen(true)}
              className="btn-primary"
              style={{ padding: '0.7rem 0.5rem', fontSize: '0.85rem' }}
            >
              <RotateCcw size={15} />
              <span>{t('playAi.newMatch', 'New Match')}</span>
            </button>

            <button
              onClick={handleDraw}
              className="btn-secondary"
              style={{ padding: '0.7rem 0.5rem', fontSize: '0.85rem' }}
            >
              <Handshake size={15} />
              <span>{t('playAi.offerDraw', 'Offer Draw')}</span>
            </button>

            <button
              onClick={handleResign}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem',
                padding: '0.7rem 0.5rem',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#f87171',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <Flag size={15} />
              <span>{t('playAi.resign', 'Resign')}</span>
            </button>
          </div>
        </div>

        {/* Right Arena: AI Commentary Bubble, HACK Panel & Move History */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* AI Chat Dialogue Bubble (Stable Height to prevent layout shift) */}
          <div
            className="glass-panel"
            style={{
              padding: '1.25rem 1.4rem',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              backgroundColor: '#111622',
              position: 'relative',
              boxShadow: 'var(--shadow-glow)',
              minHeight: '140px', // Reserved stable space
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            {/* Header: Persona Name + Emotional State Badge + Audio indicator */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '0.75rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.35rem' }}>{currentPersonalityConfig.emoji}</span>
                <span style={{ fontWeight: 800, fontSize: '1rem', color: '#ffffff' }}>
                  {t(currentPersonalityConfig.nameKey, personality)}
                </span>
                {/* AI Emotion Badge */}
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    padding: '0.15rem 0.45rem',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: currentEmotionConfig.badgeColor,
                    border: '1px solid var(--border-subtle)',
                    color: '#f8fafc',
                  }}
                  title="AI Emotional State"
                >
                  <span>{currentEmotionConfig.emoji}</span>
                  <span>{t(currentEmotionConfig.labelKey, aiEmotion)}</span>
                </span>
              </div>

              {speech.isPlaying && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                  <div
                    style={{
                      width: '4px',
                      height: '14px',
                      backgroundColor: 'var(--accent-gold)',
                      borderRadius: '2px',
                      animation: 'pulseSubtle 0.5s infinite',
                    }}
                  />
                  <div
                    style={{
                      width: '4px',
                      height: '20px',
                      backgroundColor: 'var(--accent-gold)',
                      borderRadius: '2px',
                      animation: 'pulseSubtle 0.3s infinite',
                    }}
                  />
                  <div
                    style={{
                      width: '4px',
                      height: '10px',
                      backgroundColor: 'var(--accent-gold)',
                      borderRadius: '2px',
                      animation: 'pulseSubtle 0.4s infinite',
                    }}
                  />
                </div>
              )}
            </div>

            {/* Reaction Text Message */}
            <div
              style={{
                padding: '0.9rem 1rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'rgba(245, 158, 11, 0.08)',
                border: '1px solid rgba(245, 158, 11, 0.2)',
                color: '#f8fafc',
                fontSize: '0.95rem',
                lineHeight: 1.5,
                fontStyle: 'italic',
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                transition: 'all 0.2s ease',
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

          {/* Move History Notation Table */}
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
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '0.4rem',
              }}
            >
              <span
                style={{
                  fontSize: '0.8rem',
                  color: 'var(--text-muted)',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                }}
              >
                Move Notation History
              </span>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                {Math.ceil(moveHistory.length / 2)} Turns
              </span>
            </div>

            {moveHistory.length === 0 ? (
              <div
                style={{
                  color: 'var(--text-muted)',
                  fontSize: '0.85rem',
                  fontStyle: 'italic',
                  padding: '1rem 0',
                  textAlign: 'center',
                }}
              >
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
                      <span
                        style={{
                          color: 'var(--text-muted)',
                          fontWeight: 600,
                          fontSize: '0.8rem',
                        }}
                      >
                        {i + 1}.
                      </span>
                      <span style={{ color: '#ffffff', fontWeight: 600 }}>{whiteMove}</span>
                      {blackMove && (
                        <span style={{ color: 'var(--text-secondary)' }}>{blackMove}</span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* AISetupModal */}
      <AISetupModal
        isOpen={isSetupOpen}
        onStartGame={startNewGame}
        initialDifficulty={difficulty}
        initialPersonality={personality}
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
