'use client';

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { LessonData } from '@/data/lessonsData';
import { Chessboard } from '@/components/Chessboard/Chessboard';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from '@/context/LanguageContext';
import { sounds } from '@/lib/audio/soundEffects';
import { 
  X, 
  Sparkles, 
  CheckCircle2, 
  RotateCcw, 
  ArrowRight, 
  ArrowLeft, 
  HelpCircle, 
  Award,
  BookOpen,
  Volume2
} from 'lucide-react';

interface LessonViewerProps {
  lesson: LessonData;
  onClose: () => void;
  onSelectLesson: (id: number) => void;
}

export const LessonViewer: React.FC<LessonViewerProps> = ({
  lesson,
  onClose,
  onSelectLesson,
}) => {
  const { completeLesson, isLessonCompleted } = useAuth();
  const { language, t } = useTranslation();

  const [currentFen, setCurrentFen] = useState(lesson.board.fen);
  const [taskCompleted, setTaskCompleted] = useState(false);
  const [boardFeedback, setBoardFeedback] = useState<string | null>(null);

  // Quiz State
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // Reset states on lesson change
  useEffect(() => {
    setCurrentFen(lesson.board.fen);
    setTaskCompleted(isLessonCompleted(lesson.id));
    setBoardFeedback(null);
    setSelectedOption(null);
    setQuizSubmitted(false);
  }, [lesson, isLessonCompleted]);

  // Handle player board move
  const handleBoardMove = (from: string, to: string) => {
    const target = lesson.board.targetMove;
    if (from === target.from && to === target.to) {
      // Success!
      setTaskCompleted(true);
      setBoardFeedback(lesson.board.successMessage);
      sounds.playSuccess();
      completeLesson(lesson.id);

      // Trigger celebratory confetti
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#f59e0b', '#10b981', '#8b5cf6'],
        });
      } catch {}
    } else {
      // Incorrect move for the lesson goal
      sounds.playError();
      setBoardFeedback('😅 Not quite! Try the recommended target square or reset the board.');
      setTimeout(() => {
        setCurrentFen(lesson.board.fen);
      }, 900);
    }
  };

  const handleResetBoard = () => {
    setCurrentFen(lesson.board.fen);
    setBoardFeedback(null);
  };

  const handleQuizAnswer = (index: number) => {
    if (quizSubmitted) return;
    setSelectedOption(index);
    setQuizSubmitted(true);

    if (index === lesson.quiz.correctIndex) {
      sounds.playSuccess();
      completeLesson(lesson.id);
      try {
        confetti({
          particleCount: 40,
          spread: 50,
          origin: { y: 0.8 },
        });
      } catch {}
    } else {
      sounds.playError();
    }
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
        overflowY: 'auto',
      }}
      onClick={onClose}
    >
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '1080px',
          maxHeight: '92vh',
          backgroundColor: '#0e131f',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          borderRadius: '24px',
          overflowY: 'auto',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div
          style={{
            padding: '1.25rem 1.75rem',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            position: 'sticky',
            top: 0,
            backgroundColor: 'rgba(14, 19, 31, 0.95)',
            backdropFilter: 'blur(8px)',
            zIndex: 10,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(139, 92, 246, 0.2))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.6rem',
                border: '1px solid rgba(245, 158, 11, 0.3)',
              }}
            >
              {lesson.emoji}
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className="badge badge-gold" style={{ fontSize: '0.72rem' }}>
                  Lesson {lesson.id < 10 ? `0${lesson.id}` : lesson.id} of 25
                </span>
                {isLessonCompleted(lesson.id) && (
                  <span className="badge badge-emerald" style={{ fontSize: '0.72rem' }}>
                    <CheckCircle2 size={12} /> Completed
                  </span>
                )}
              </div>
              <h2 style={{ fontSize: '1.4rem', marginTop: '0.2rem', color: '#ffffff' }}>
                {lesson.title}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              padding: '0.5rem',
              borderRadius: 'var(--radius-full)',
              color: 'var(--text-muted)',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            aria-label="Close Lesson"
          >
            <X size={22} />
          </button>
        </div>

        {/* Multilingual Piece Names (if applicable) */}
        {lesson.pieceName && (
          <div
            style={{
              padding: '0.75rem 1.75rem',
              backgroundColor: 'rgba(245, 158, 11, 0.04)',
              borderBottom: '1px solid var(--border-subtle)',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: '0.75rem',
            }}
          >
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
              Multilingual Names:
            </span>
            <span
              style={{
                padding: '0.2rem 0.6rem',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'rgba(255, 255, 255, 0.06)',
                fontSize: '0.85rem',
                color: '#ffffff',
                fontWeight: 600,
              }}
            >
              🇬🇧 {lesson.pieceName.en}
            </span>
            <span
              style={{
                padding: '0.2rem 0.6rem',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'rgba(245, 158, 11, 0.12)',
                fontSize: '0.85rem',
                color: 'var(--accent-gold)',
                fontWeight: 600,
              }}
            >
              🇮🇳 {lesson.pieceName.hi}
            </span>
            <span
              style={{
                padding: '0.2rem 0.6rem',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'rgba(16, 185, 129, 0.12)',
                fontSize: '0.85rem',
                color: '#34d399',
                fontWeight: 600,
              }}
            >
              🇧🇩 {lesson.pieceName.bn}
            </span>
          </div>
        )}

        {/* Content Body: 2 Columns on Desktop */}
        <div
          style={{
            padding: '1.75rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '2rem',
            alignItems: 'start',
          }}
        >
          {/* Left Column: Interactive Board & Controls */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <div
              style={{
                width: '100%',
                padding: '0.85rem 1.2rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'rgba(16, 185, 129, 0.08)',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ fontSize: '0.92rem', color: '#e2e8f0', fontWeight: 600 }}>
                🎯 <strong>Goal:</strong> {lesson.board.instruction}
              </div>
              <button
                onClick={handleResetBoard}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  color: 'var(--text-muted)',
                  fontSize: '0.82rem',
                  padding: '0.3rem 0.6rem',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                }}
                title="Reset Board"
              >
                <RotateCcw size={14} />
                <span>Reset</span>
              </button>
            </div>

            {/* Chessboard Component */}
            <Chessboard
              fen={currentFen}
              onMove={handleBoardMove}
              highlightSquares={lesson.board.highlightSquares}
              customArrows={lesson.board.arrows}
            />

            {/* Board Move Feedback */}
            {boardFeedback && (
              <div
                style={{
                  width: '100%',
                  padding: '0.85rem 1.2rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: taskCompleted ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                  border: `1px solid ${taskCompleted ? '#10b981' : '#ef4444'}`,
                  color: '#ffffff',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  textAlign: 'center',
                  animation: 'pulseSubtle 2s ease-in-out',
                }}
              >
                {boardFeedback}
              </div>
            )}
          </div>

          {/* Right Column: Funny Monologue, Rules, & Mini Quiz */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Funny Banter Box */}
            <div
              style={{
                padding: '1.25rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'rgba(245, 158, 11, 0.08)',
                border: '1px solid rgba(245, 158, 11, 0.25)',
              }}
            >
              <div style={{ fontSize: '0.78rem', color: 'var(--accent-gold)', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                Coach Banter 🤖😂
              </div>
              <p style={{ color: '#f8fafc', fontSize: '1rem', fontStyle: 'italic', lineHeight: 1.5, marginBottom: '0.5rem' }}>
                “{lesson.quote}”
              </p>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                {lesson.humor}
              </p>
            </div>

            {/* Key Rules Card */}
            <div
              style={{
                padding: '1.25rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.6rem' }}>
                Essential Rules 📜
              </div>
              <ul style={{ paddingLeft: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.92rem', color: '#e2e8f0' }}>
                {lesson.rules.map((rule, idx) => (
                  <li key={idx} style={{ lineHeight: 1.4 }}>
                    {rule}
                  </li>
                ))}
              </ul>
            </div>

            {/* Mini Quiz Challenge */}
            <div
              style={{
                padding: '1.25rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'rgba(139, 92, 246, 0.08)',
                border: '1px solid rgba(139, 92, 246, 0.25)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
                <HelpCircle size={16} color="#c084fc" />
                <span style={{ fontSize: '0.8rem', color: '#c084fc', fontWeight: 700, textTransform: 'uppercase' }}>
                  Quick Quiz Challenge 🧠
                </span>
              </div>

              <h4 style={{ fontSize: '1rem', marginBottom: '0.85rem', color: '#ffffff' }}>
                {lesson.quiz.question}
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '0.75rem' }}>
                {lesson.quiz.options.map((opt, optIdx) => {
                  const isSelected = selectedOption === optIdx;
                  const isCorrect = optIdx === lesson.quiz.correctIndex;

                  let optBg = 'rgba(255, 255, 255, 0.04)';
                  let optBorder = 'var(--border-subtle)';
                  let optColor = 'var(--text-primary)';

                  if (quizSubmitted) {
                    if (isCorrect) {
                      optBg = 'rgba(16, 185, 129, 0.2)';
                      optBorder = '#10b981';
                      optColor = '#34d399';
                    } else if (isSelected) {
                      optBg = 'rgba(239, 68, 68, 0.2)';
                      optBorder = '#ef4444';
                      optColor = '#f87171';
                    }
                  }

                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleQuizAnswer(optIdx)}
                      disabled={quizSubmitted}
                      style={{
                        padding: '0.65rem 0.9rem',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: optBg,
                        border: `1px solid ${optBorder}`,
                        color: optColor,
                        textAlign: 'left',
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        transition: 'all 0.15s ease',
                        cursor: quizSubmitted ? 'default' : 'pointer',
                      }}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              {quizSubmitted && (
                <div
                  style={{
                    padding: '0.6rem 0.8rem',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: selectedOption === lesson.quiz.correctIndex ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                    fontSize: '0.85rem',
                    color: '#ffffff',
                    lineHeight: 1.4,
                  }}
                >
                  {selectedOption === lesson.quiz.correctIndex ? '🎉 ' : '💡 '}
                  {lesson.quiz.explanation}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Navigation Bar */}
        <div
          style={{
            padding: '1.25rem 1.75rem',
            borderTop: '1px solid var(--border-subtle)',
            backgroundColor: 'rgba(14, 19, 31, 0.95)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            marginTop: 'auto',
          }}
        >
          <button
            onClick={() => onSelectLesson(Math.max(1, lesson.id - 1))}
            disabled={lesson.id === 1}
            className="btn-secondary"
            style={{
              opacity: lesson.id === 1 ? 0.4 : 1,
              cursor: lesson.id === 1 ? 'not-allowed' : 'pointer',
              fontSize: '0.9rem',
              padding: '0.6rem 1.2rem',
            }}
          >
            <ArrowLeft size={16} />
            <span>Previous</span>
          </button>

          <button
            onClick={() => {
              completeLesson(lesson.id);
              if (lesson.id < 25) {
                onSelectLesson(lesson.id + 1);
              } else {
                onClose();
              }
            }}
            className="btn-primary"
            style={{ fontSize: '0.92rem', padding: '0.6rem 1.4rem' }}
          >
            <span>{lesson.id === 25 ? 'Graduate! 🎓' : 'Complete & Next'}</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
