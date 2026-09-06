'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { Chessboard, Arrow } from '@/components/Chessboard/Chessboard';
import { GameAnalysisResult, AnalyzedMove, analyzeGame } from '@/lib/chess/postGameAnalysis';
import { FunnyMoment } from '@/lib/chess/funnyMoments';
import { AIPersonalityId } from '@/lib/ai/personality/types';
import { AI_PERSONALITIES } from '@/lib/ai/personality/personalityConfig';
import { useTranslation } from '@/context/LanguageContext';
import { prefersReducedMotion } from '@/lib/chess/animationConfig';
import { 
  Trophy, 
  RotateCcw, 
  Sliders, 
  X, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight, 
  Play, 
  Pause, 
  BrainCircuit, 
  Lightbulb, 
  Smile, 
  CheckCircle2, 
  AlertTriangle, 
  Target,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';

export type GameResultType = 'win' | 'loss' | 'draw';

export interface PostGameModalProps {
  isOpen: boolean;
  result: GameResultType;
  reason?: string;
  moveHistory: string[];
  playerColor?: 'white' | 'black';
  difficulty?: string;
  personalityId?: AIPersonalityId;
  opponentName?: string;
  isMultiplayer?: boolean;
  onRematch: () => void;
  onNewSetup?: () => void;
  onClose: () => void;
}

export const PostGameModal: React.FC<PostGameModalProps> = ({
  isOpen,
  result,
  reason = '',
  moveHistory = [],
  playerColor = 'white',
  difficulty = 'easy',
  personalityId = 'chill',
  opponentName,
  isMultiplayer = false,
  onRematch,
  onNewSetup,
  onClose,
}) => {
  const { language, t } = useTranslation();
  const lang = (language as 'en' | 'hi' | 'bn') || 'en';

  const [activeTab, setActiveTab] = useState<'summary' | 'review'>('summary');
  const [analysis, setAnalysis] = useState<GameAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(true);

  // Replay review state (completely decoupled from authoritative game state)
  const [reviewIndex, setReviewIndex] = useState<number>(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(false);
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);

  const isWin = result === 'win';
  const isLoss = result === 'loss';

  // Run analysis when modal opens with completed game
  useEffect(() => {
    if (!isOpen) return;

    let active = true;
    setIsAnalyzing(true);

    analyzeGame(moveHistory, playerColor, result, personalityId)
      .then((res) => {
        if (active) {
          setAnalysis(res);
          setIsAnalyzing(false);
          setReviewIndex(Math.max(0, res.moves.length - 1));
        }
      })
      .catch(() => {
        if (active) {
          setIsAnalyzing(false);
        }
      });

    // Victory celebration confetti
    if (isWin) {
      try {
        confetti({
          particleCount: 85,
          spread: 75,
          origin: { y: 0.6 },
          colors: ['#f59e0b', '#10b981', '#fbbf24', '#38bdf8'],
        });
      } catch {}
    }

    return () => {
      active = false;
      if (autoPlayTimerRef.current) {
        clearInterval(autoPlayTimerRef.current);
      }
    };
  }, [isOpen, moveHistory, playerColor, result, personalityId, isWin]);

  // Handle auto-replay playback
  useEffect(() => {
    if (!isAutoPlaying || !analysis || analysis.moves.length === 0) {
      if (autoPlayTimerRef.current) {
        clearInterval(autoPlayTimerRef.current);
        autoPlayTimerRef.current = null;
      }
      return;
    }

    const intervalDuration = prefersReducedMotion() ? 800 : 1600;
    autoPlayTimerRef.current = setInterval(() => {
      setReviewIndex((prev) => {
        if (prev >= analysis.moves.length - 1) {
          setIsAutoPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, intervalDuration);

    return () => {
      if (autoPlayTimerRef.current) {
        clearInterval(autoPlayTimerRef.current);
      }
    };
  }, [isAutoPlaying, analysis]);

  // Jump to specific move from Best Move or Funny Moment cards
  const jumpToMove = (plyIdx: number) => {
    setReviewIndex(Math.max(0, Math.min(plyIdx, (analysis?.moves.length || 1) - 1)));
    setActiveTab('review');
    setIsAutoPlaying(false);
  };

  // Replay Board position resolution
  const currentMove = analysis?.moves[reviewIndex] || null;
  const currentReviewFen = currentMove
    ? currentMove.fenAfter
    : 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

  // Arrows for review position
  const reviewArrows: Arrow[] = useMemo(() => {
    if (!currentMove) return [];
    const arrows: Arrow[] = [];

    // Played move arrow
    arrows.push({
      from: currentMove.from,
      to: currentMove.to,
      color:
        currentMove.quality === 'blunder'
          ? '#ef4444'
          : currentMove.quality === 'mistake'
          ? '#f97316'
          : currentMove.quality === 'great' || currentMove.quality === 'brilliant'
          ? '#f59e0b'
          : '#10b981',
    });

    // Best alternative arrow if mistake/blunder
    if (currentMove.bestAlternative) {
      arrows.push({
        from: currentMove.bestAlternative.from,
        to: currentMove.bestAlternative.to,
        color: '#10b981',
      });
    }

    return arrows;
  }, [currentMove]);

  const reviewHighlights = useMemo(() => {
    if (!currentMove) return [];
    const sqs = [currentMove.from, currentMove.to];
    if (currentMove.bestAlternative) {
      sqs.push(currentMove.bestAlternative.from, currentMove.bestAlternative.to);
    }
    return sqs;
  }, [currentMove]);

  const opponentLabel = isMultiplayer
    ? opponentName || 'Opponent'
    : AI_PERSONALITIES[personalityId]
    ? `${AI_PERSONALITIES[personalityId].emoji} ${t(AI_PERSONALITIES[personalityId].nameKey, personalityId)}`
    : 'Funny AI';

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(5, 8, 15, 0.92)',
        backdropFilter: 'blur(14px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0.75rem',
      }}
      onClick={onClose}
    >
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: activeTab === 'review' ? '920px' : '640px',
          maxHeight: '94vh',
          overflowY: 'auto',
          backgroundColor: '#0f1420',
          border: `1px solid ${
            isWin ? '#10b981' : isLoss ? 'rgba(239, 68, 68, 0.4)' : 'var(--accent-gold)'
          }`,
          borderRadius: '24px',
          boxShadow: '0 25px 70px rgba(0, 0, 0, 0.9)',
          position: 'relative',
          padding: '1.75rem',
          transition: 'max-width 0.3s cubic-bezier(0.25, 1, 0.5, 1)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.2rem',
            right: '1.2rem',
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: '0.35rem',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'color 0.2s',
          }}
          title="Close"
        >
          <X size={20} />
        </button>

        {/* Modal Header Strip: Result + Tabs */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            marginBottom: '1.25rem',
            paddingBottom: '1rem',
            borderBottom: '1px solid var(--border-subtle)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '14px',
                background: isWin
                  ? 'linear-gradient(135deg, #10b981, #059669)'
                  : isLoss
                  ? 'linear-gradient(135deg, #ef4444, #b91c1c)'
                  : 'linear-gradient(135deg, #f59e0b, #d97706)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.6rem',
                boxShadow: '0 4px 14px rgba(0, 0, 0, 0.4)',
              }}
            >
              {isWin ? '🏆' : isLoss ? '😔' : '🤝'}
            </div>
            <div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#ffffff', lineHeight: 1.2 }}>
                {isWin
                  ? t('postGame.youWon', 'Victory is Yours!')
                  : isLoss
                  ? t('postGame.youLost', 'Game Over!')
                  : t('postGame.draw', 'Draw Game!')}
              </h2>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                {reason}
              </div>
            </div>
          </div>

          {/* View Tab Switcher: Summary vs Review */}
          <div
            style={{
              display: 'inline-flex',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              padding: '0.25rem',
              borderRadius: 'var(--radius-full)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <button
              onClick={() => {
                setActiveTab('summary');
                setIsAutoPlaying(false);
              }}
              style={{
                padding: '0.45rem 0.95rem',
                borderRadius: 'var(--radius-full)',
                backgroundColor: activeTab === 'summary' ? 'var(--accent-gold)' : 'transparent',
                color: activeTab === 'summary' ? '#0a0d14' : 'var(--text-secondary)',
                border: 'none',
                fontWeight: 700,
                fontSize: '0.84rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              📊 {t('postGame.tabSummary', 'Summary & Coach')}
            </button>
            <button
              onClick={() => setActiveTab('review')}
              style={{
                padding: '0.45rem 0.95rem',
                borderRadius: 'var(--radius-full)',
                backgroundColor: activeTab === 'review' ? 'var(--accent-gold)' : 'transparent',
                color: activeTab === 'review' ? '#0a0d14' : 'var(--text-secondary)',
                border: 'none',
                fontWeight: 700,
                fontSize: '0.84rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              ♟️ {t('postGame.tabReview', 'Review Game')}
            </button>
          </div>
        </div>

        {/* TAB 1: SUMMARY & COACH */}
        {activeTab === 'summary' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* 1. Performance Gauge Strip */}
            <div
              className="glass-panel"
              style={{
                padding: '1.25rem 1.5rem',
                backgroundColor: '#131926',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '1.25rem',
              }}
            >
              {/* Score ring */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div
                  style={{
                    width: '68px',
                    height: '68px',
                    borderRadius: '50%',
                    border: `3px solid ${analysis?.performanceTier.color || '#10b981'}`,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                    boxShadow: `0 0 16px ${analysis?.performanceTier.color}40`,
                  }}
                >
                  <span style={{ fontSize: '1.35rem', fontWeight: 800, color: '#ffffff', lineHeight: 1 }}>
                    {isAnalyzing ? '...' : analysis?.performanceScore}
                  </span>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>/ 100</span>
                </div>
                <div>
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      padding: '0.2rem 0.6rem',
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: `${analysis?.performanceTier.color}20`,
                      color: analysis?.performanceTier.color || '#10b981',
                      fontWeight: 700,
                      fontSize: '0.82rem',
                      marginBottom: '0.25rem',
                    }}
                  >
                    <span>{analysis?.performanceTier.badge}</span>
                    <span>{analysis?.performanceTier.label[lang] || 'Game Score'}</span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    {t('postGame.performanceLabel', 'Performance Score (not official rating)')}
                  </div>
                </div>
              </div>

              {/* Match Metadata Stats */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', fontSize: '0.82rem' }}>
                <div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem', textTransform: 'uppercase' }}>
                    {t('postGame.opponent', 'Opponent')}
                  </div>
                  <div style={{ fontWeight: 700, color: '#ffffff' }}>{opponentLabel}</div>
                </div>
                <div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem', textTransform: 'uppercase' }}>
                    {t('postGame.turns', 'Turns')}
                  </div>
                  <div style={{ fontWeight: 700, color: '#ffffff' }}>
                    {Math.ceil(moveHistory.length / 2)}
                  </div>
                </div>
                {!isMultiplayer && (
                  <div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem', textTransform: 'uppercase' }}>
                      {t('postGame.difficulty', 'Difficulty')}
                    </div>
                    <div style={{ fontWeight: 700, color: 'var(--accent-gold)', textTransform: 'capitalize' }}>
                      {difficulty}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 2. Key Moments Grid: Best Move & Biggest Mistake */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: '1rem',
              }}
            >
              {/* Best Move Card */}
              <div
                className="glass-panel"
                style={{
                  padding: '1.1rem',
                  backgroundColor: '#121724',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '0.75rem',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#34d399', fontWeight: 700, fontSize: '0.86rem', marginBottom: '0.4rem' }}>
                    <Sparkles size={16} />
                    <span>{t('postGame.bestMove', '⭐ Best Move')}</span>
                  </div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff', fontFamily: 'var(--font-mono, monospace)' }}>
                    {analysis?.bestMove ? `${Math.floor(analysis.bestMove.plyIndex / 2) + 1}. ${analysis.bestMove.san}` : 'None'}
                  </div>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.4, marginTop: '0.35rem' }}>
                    {analysis?.bestMove?.explanation[lang] || 'Solid tactical decision during the match.'}
                  </p>
                </div>
                {analysis?.bestMove && (
                  <button
                    onClick={() => jumpToMove(analysis.bestMove!.plyIndex)}
                    className="btn-secondary"
                    style={{ padding: '0.45rem 0.8rem', fontSize: '0.8rem', alignSelf: 'flex-start' }}
                  >
                    <span>{t('postGame.seeMove', 'See on Board')}</span>
                    <ArrowRight size={13} />
                  </button>
                )}
              </div>

              {/* Biggest Mistake Card */}
              <div
                className="glass-panel"
                style={{
                  padding: '1.1rem',
                  backgroundColor: '#121724',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '0.75rem',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#f87171', fontWeight: 700, fontSize: '0.86rem', marginBottom: '0.4rem' }}>
                    <AlertTriangle size={16} />
                    <span>{t('postGame.biggestMistake', '⚠️ Biggest Mistake')}</span>
                  </div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff', fontFamily: 'var(--font-mono, monospace)' }}>
                    {analysis?.biggestMistake
                      ? `${Math.floor(analysis.biggestMistake.plyIndex / 2) + 1}... ${analysis.biggestMistake.san}?`
                      : 'None! Clean game! 🛡️'}
                  </div>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.4, marginTop: '0.35rem' }}>
                    {analysis?.biggestMistake?.explanation[lang] || 'No catastrophic blunders detected in your game.'}
                  </p>
                </div>
                {analysis?.biggestMistake && (
                  <button
                    onClick={() => jumpToMove(analysis.biggestMistake!.plyIndex)}
                    className="btn-secondary"
                    style={{ padding: '0.45rem 0.8rem', fontSize: '0.8rem', alignSelf: 'flex-start' }}
                  >
                    <span>{t('postGame.seeMistake', 'Inspect Mistake')}</span>
                    <ArrowRight size={13} />
                  </button>
                )}
              </div>
            </div>

            {/* 3. Top Funny Moment Card */}
            {analysis?.funnyMoments && analysis.funnyMoments.length > 0 && (
              <div
                className="glass-panel"
                style={{
                  padding: '1.25rem 1.4rem',
                  backgroundColor: 'rgba(245, 158, 11, 0.07)',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  borderRadius: 'var(--radius-lg)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.65rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.84rem', fontWeight: 800, color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    😂 {t('postGame.funnyMomentTitle', 'Funny Moment')}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {analysis.funnyMoments[0].title[lang]}
                  </span>
                </div>

                <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff', fontStyle: 'italic' }}>
                  {analysis.funnyMoments[0].quote[lang]}
                </div>

                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  {analysis.funnyMoments[0].description[lang]}
                </div>

                {/* AI persona comment if available */}
                {analysis.funnyMoments[0].personalityComment && (
                  <div
                    style={{
                      padding: '0.6rem 0.85rem',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid var(--border-subtle)',
                      fontSize: '0.82rem',
                      color: 'var(--accent-gold-light)',
                    }}
                  >
                    <strong>🤖 {t(AI_PERSONALITIES[personalityId]?.nameKey, personalityId)}:</strong>{' '}
                    {analysis.funnyMoments[0].personalityComment.text[lang]}
                  </div>
                )}

                <div style={{ marginTop: '0.35rem' }}>
                  <button
                    onClick={() => jumpToMove(analysis.funnyMoments[0].moveIndex)}
                    className="btn-secondary"
                    style={{ padding: '0.45rem 0.85rem', fontSize: '0.82rem' }}
                  >
                    <span>{t('postGame.seeMoment', 'See Moment on Board')}</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            )}

            {/* 4. Coach's Personal Advice */}
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.75rem',
                padding: '0.9rem 1.1rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'rgba(56, 189, 248, 0.08)',
                border: '1px solid rgba(56, 189, 248, 0.25)',
                fontSize: '0.85rem',
                color: '#e2e8f0',
              }}
            >
              <Lightbulb size={20} color="#38bdf8" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ color: '#38bdf8' }}>{t('postGame.coachTakeaway', 'Coach Takeaway')}: </strong>
                {analysis?.coachAdvice[lang]}
              </div>
            </div>

            {/* 5. Bottom Action Buttons */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                gap: '0.75rem',
                marginTop: '0.5rem',
              }}
            >
              <button
                onClick={() => setActiveTab('review')}
                className="btn-secondary"
                style={{ padding: '0.75rem', fontSize: '0.92rem' }}
              >
                <span>♟️ {t('postGame.reviewGame', 'Review Game')}</span>
              </button>

              <button
                onClick={onRematch}
                className="btn-primary"
                style={{ padding: '0.75rem', fontSize: '0.92rem' }}
              >
                <RotateCcw size={16} />
                <span>{t('common.rematch', 'Play Again')}</span>
              </button>

              {onNewSetup && (
                <button
                  onClick={onNewSetup}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem',
                    padding: '0.75rem',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-secondary)',
                    fontSize: '0.92rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  <Sliders size={16} />
                  <span>{t('playAi.newMatch', 'Match Setup')}</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: GAME REVIEW (MOVE-BY-MOVE INTERACTIVE REPLAY) */}
        {activeTab === 'review' && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '1.5rem',
              alignItems: 'start',
            }}
          >
            {/* Left: Replay Chessboard + Navigation controls */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.85rem' }}>
              <Chessboard
                fen={currentReviewFen}
                orientation={playerColor}
                interactive={false}
                customArrows={reviewArrows}
                highlightSquares={reviewHighlights}
              />

              {/* Replay Navigation Bar */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 0.85rem',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: '#121724',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <button
                  onClick={() => {
                    setReviewIndex(0);
                    setIsAutoPlaying(false);
                  }}
                  disabled={reviewIndex === 0}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: reviewIndex === 0 ? 'var(--text-muted)' : '#ffffff',
                    cursor: reviewIndex === 0 ? 'not-allowed' : 'pointer',
                    padding: '0.35rem',
                  }}
                  title="First Move"
                >
                  <ChevronsLeft size={18} />
                </button>

                <button
                  onClick={() => {
                    setReviewIndex((prev) => Math.max(0, prev - 1));
                    setIsAutoPlaying(false);
                  }}
                  disabled={reviewIndex === 0}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: reviewIndex === 0 ? 'var(--text-muted)' : '#ffffff',
                    cursor: reviewIndex === 0 ? 'not-allowed' : 'pointer',
                    padding: '0.35rem',
                  }}
                  title="Previous Move"
                >
                  <ChevronLeft size={18} />
                </button>

                {/* Auto Replay Toggle */}
                <button
                  onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    padding: '0.35rem 0.75rem',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: isAutoPlaying ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.08)',
                    border: `1px solid ${isAutoPlaying ? '#10b981' : 'var(--border-subtle)'}`,
                    color: isAutoPlaying ? '#34d399' : '#ffffff',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  {isAutoPlaying ? <Pause size={14} /> : <Play size={14} />}
                  <span>{isAutoPlaying ? 'Pause' : 'Play'}</span>
                </button>

                <button
                  onClick={() => {
                    setReviewIndex((prev) =>
                      Math.min((analysis?.moves.length || 1) - 1, prev + 1)
                    );
                    setIsAutoPlaying(false);
                  }}
                  disabled={!analysis || reviewIndex >= analysis.moves.length - 1}
                  style={{
                    background: 'none',
                    border: 'none',
                    color:
                      !analysis || reviewIndex >= analysis.moves.length - 1
                        ? 'var(--text-muted)'
                        : '#ffffff',
                    cursor:
                      !analysis || reviewIndex >= analysis.moves.length - 1
                        ? 'not-allowed'
                        : 'pointer',
                    padding: '0.35rem',
                  }}
                  title="Next Move"
                >
                  <ChevronRight size={18} />
                </button>

                <button
                  onClick={() => {
                    setReviewIndex((analysis?.moves.length || 1) - 1);
                    setIsAutoPlaying(false);
                  }}
                  disabled={!analysis || reviewIndex >= analysis.moves.length - 1}
                  style={{
                    background: 'none',
                    border: 'none',
                    color:
                      !analysis || reviewIndex >= analysis.moves.length - 1
                        ? 'var(--text-muted)'
                        : '#ffffff',
                    cursor:
                      !analysis || reviewIndex >= analysis.moves.length - 1
                        ? 'not-allowed'
                        : 'pointer',
                    padding: '0.35rem',
                  }}
                  title="Last Move"
                >
                  <ChevronsRight size={18} />
                </button>
              </div>
            </div>

            {/* Right: Active Move Feedback & Move History Table */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Active Move Commentary Card */}
              <div
                className="glass-panel"
                style={{
                  padding: '1.2rem',
                  backgroundColor: '#131926',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                    Move {currentMove ? `${currentMove.moveNumber} • ${currentMove.color === 'w' ? 'White' : 'Black'}` : 'Start'}
                  </span>

                  {currentMove && (
                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        padding: '0.15rem 0.55rem',
                        borderRadius: 'var(--radius-full)',
                        backgroundColor:
                          currentMove.quality === 'blunder'
                            ? 'rgba(239, 68, 68, 0.2)'
                            : currentMove.quality === 'mistake'
                            ? 'rgba(249, 115, 22, 0.2)'
                            : currentMove.quality === 'great' || currentMove.quality === 'brilliant'
                            ? 'rgba(245, 158, 11, 0.2)'
                            : 'rgba(16, 185, 129, 0.2)',
                        color:
                          currentMove.quality === 'blunder'
                            ? '#f87171'
                            : currentMove.quality === 'mistake'
                            ? '#fb923c'
                            : currentMove.quality === 'great' || currentMove.quality === 'brilliant'
                            ? '#fbbf24'
                            : '#34d399',
                        textTransform: 'uppercase',
                      }}
                    >
                      {currentMove.quality === 'blunder'
                        ? '🔴 Blunder'
                        : currentMove.quality === 'mistake'
                        ? '🟠 Mistake'
                        : currentMove.quality === 'great'
                        ? '⭐ Great Move'
                        : '🟢 Good Move'}
                    </span>
                  )}
                </div>

                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.35rem', fontFamily: 'var(--font-mono, monospace)' }}>
                  {currentMove ? currentMove.san : 'Initial Position'}
                </div>

                <p style={{ fontSize: '0.88rem', color: '#e2e8f0', lineHeight: 1.45 }}>
                  {currentMove ? currentMove.explanation[lang] : 'Game begins. Review pieces and opening setup.'}
                </p>

                {currentMove?.bestAlternative && (
                  <div
                    style={{
                      marginTop: '0.65rem',
                      padding: '0.55rem 0.8rem',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'rgba(16, 185, 129, 0.1)',
                      border: '1px solid rgba(16, 185, 129, 0.25)',
                      fontSize: '0.82rem',
                      color: '#34d399',
                    }}
                  >
                    <strong>Recommended:</strong> {currentMove.bestAlternative.explanation[lang]}
                  </div>
                )}
              </div>

              {/* Move List Table */}
              <div
                className="glass-panel"
                style={{
                  padding: '1rem',
                  maxHeight: '260px',
                  overflowY: 'auto',
                  backgroundColor: '#0c1017',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                  {t('postGame.moveListTitle', 'Move Notation List')}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '0.35rem' }}>
                  {analysis?.moves.map((m, idx) => {
                    const isSelected = reviewIndex === idx;
                    return (
                      <button
                        key={idx}
                        onClick={() => {
                          setReviewIndex(idx);
                          setIsAutoPlaying(false);
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '0.35rem 0.55rem',
                          borderRadius: 'var(--radius-sm)',
                          backgroundColor: isSelected ? 'var(--accent-gold)' : 'rgba(255, 255, 255, 0.04)',
                          color: isSelected ? '#0a0d14' : '#ffffff',
                          border: isSelected ? '1px solid var(--accent-gold)' : '1px solid transparent',
                          fontSize: '0.82rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                          fontFamily: 'var(--font-mono, monospace)',
                        }}
                      >
                        <span>
                          {idx % 2 === 0 ? `${Math.floor(idx / 2) + 1}. ` : ''}
                          {m.san}
                        </span>
                        <span style={{ fontSize: '0.7rem' }}>
                          {m.quality === 'blunder'
                            ? '🔴'
                            : m.quality === 'mistake'
                            ? '🟠'
                            : m.quality === 'great'
                            ? '⭐'
                            : '•'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Return to Summary button */}
              <button
                onClick={() => setActiveTab('summary')}
                className="btn-secondary"
                style={{ padding: '0.65rem', fontSize: '0.85rem' }}
              >
                <span>📊 {t('postGame.backToSummary', 'Back to Summary & Coach')}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
