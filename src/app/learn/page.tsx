'use client';

import React, { useState } from 'react';
import { useTranslation } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { ALL_LESSONS, LessonData } from '@/data/lessonsData';
import { LessonViewer } from '@/components/Learn/LessonViewer';
import { 
  BookOpen, 
  Sparkles, 
  CheckCircle2, 
  Play, 
  Crown, 
  ShieldCheck, 
  Trophy,
  Flame,
  ArrowRight
} from 'lucide-react';

export default function LearnPage() {
  const { t } = useTranslation();
  const { user, isLessonCompleted } = useAuth();
  const [activeLesson, setActiveLesson] = useState<LessonData | null>(null);

  const completedCount = user?.completed_lessons?.length || 0;
  const progressPercent = Math.min(100, Math.round((completedCount / ALL_LESSONS.length) * 100));

  // Find next uncompleted lesson to resume
  const nextLessonId = ALL_LESSONS.find((l) => !isLessonCompleted(l.id))?.id || 1;
  const resumeLesson = ALL_LESSONS.find((l) => l.id === nextLessonId) || ALL_LESSONS[0];

  const fundamentals = ALL_LESSONS.filter((l) => l.part === 1);
  const strategy = ALL_LESSONS.filter((l) => l.part === 2);

  return (
    <div className="container" style={{ padding: '3rem 1.25rem 5rem' }}>
      {/* Top Header */}
      <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 3rem' }}>
        <div className="badge badge-gold" style={{ marginBottom: '1rem' }}>
          <Sparkles size={14} />
          <span>Interactive Chess Academy</span>
        </div>
        <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 3.4rem)', marginBottom: '1rem', letterSpacing: '-0.02em' }}>
          Learn Chess Without the Boredom 📚♟️
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.6 }}>
          Zero dry textbooks. Learn piece movements, checkmates, and smart tactics with funny banter, interactive board demonstrations, and instant mini-challenges!
        </p>
      </div>

      {/* Progress Dashboard Banner */}
      <div
        className="glass-panel"
        style={{
          padding: '2rem',
          marginBottom: '3.5rem',
          background: 'linear-gradient(135deg, rgba(24, 32, 48, 0.9), rgba(17, 22, 34, 0.9))',
          border: '1px solid rgba(245, 158, 11, 0.25)',
          boxShadow: '0 12px 36px rgba(0, 0, 0, 0.4)',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1.5rem',
            marginBottom: '1.25rem',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
              <Trophy size={18} color="var(--accent-gold)" />
              <span style={{ fontWeight: 800, fontSize: '1.15rem', color: '#ffffff' }}>
                Your Learning Progress
              </span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              {completedCount} of {ALL_LESSONS.length} chapters completed • Current Rank: <strong>{user?.chess_level || 'Novice Explorer'}</strong>
            </p>
          </div>

          <button
            onClick={() => setActiveLesson(resumeLesson)}
            className="btn-primary"
            style={{ padding: '0.65rem 1.4rem', fontSize: '0.92rem' }}
          >
            <Play size={16} fill="currentColor" />
            <span>Resume: Lesson {resumeLesson.id} ({resumeLesson.title})</span>
            <ArrowRight size={16} />
          </button>
        </div>

        {/* Progress Bar */}
        <div
          style={{
            height: '14px',
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            borderRadius: 'var(--radius-full)',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${progressPercent}%`,
              background: 'linear-gradient(90deg, #f59e0b, #10b981)',
              borderRadius: 'var(--radius-full)',
              transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.4rem' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--accent-gold)' }}>
            {progressPercent}% Complete
          </span>
        </div>
      </div>

      {/* Part 1: Beginner Fundamentals */}
      <div style={{ marginBottom: '4.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.75rem' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              backgroundColor: 'rgba(245, 158, 11, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-gold)',
            }}
          >
            <Crown size={22} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.7rem' }}>Part 1: Beginner Fundamentals</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
              Lessons 01 to 15 • The board, piece movements, capturing, and special rules
            </p>
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '1.25rem',
          }}
        >
          {fundamentals.map((lesson) => {
            const isCompleted = isLessonCompleted(lesson.id);
            return (
              <div
                key={lesson.id}
                onClick={() => setActiveLesson(lesson)}
                className="glass-panel"
                style={{
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '1rem',
                  cursor: 'pointer',
                  borderTop: isCompleted ? '3px solid #10b981' : '3px solid rgba(245, 158, 11, 0.4)',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                    <span style={{ fontSize: '2rem' }}>{lesson.emoji}</span>
                    {isCompleted ? (
                      <span className="badge badge-emerald" style={{ fontSize: '0.75rem' }}>
                        <CheckCircle2 size={12} /> Completed
                      </span>
                    ) : (
                      <span
                        style={{
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          color: 'var(--text-muted)',
                          padding: '0.2rem 0.6rem',
                          borderRadius: 'var(--radius-sm)',
                          backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        }}
                      >
                        Lesson {lesson.id < 10 ? `0${lesson.id}` : lesson.id}
                      </span>
                    )}
                  </div>

                  <h3 style={{ fontSize: '1.25rem', marginBottom: '0.4rem', color: '#ffffff' }}>
                    {lesson.title}
                  </h3>

                  {lesson.pieceName && (
                    <div style={{ fontSize: '0.8rem', color: 'var(--accent-gold)', marginBottom: '0.5rem', fontWeight: 600 }}>
                      {lesson.pieceName.en} • {lesson.pieceName.hi.split(' ')[0]} • {lesson.pieceName.bn.split(' ')[0]}
                    </div>
                  )}

                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontStyle: 'italic', lineHeight: 1.4 }}>
                    “{lesson.quote}”
                  </p>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '0.75rem',
                    borderTop: '1px solid var(--border-subtle)',
                  }}
                >
                  <span style={{ fontSize: '0.82rem', color: isCompleted ? '#34d399' : 'var(--accent-gold)', fontWeight: 600 }}>
                    {isCompleted ? 'Review Chapter' : 'Start Interactive Lesson'}
                  </span>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      color: 'var(--text-primary)',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                    }}
                  >
                    <Play size={12} fill="currentColor" /> Play
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Part 2: Beginner Strategy & Tactics */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.75rem' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              backgroundColor: 'rgba(16, 185, 129, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-emerald)',
            }}
          >
            <ShieldCheck size={22} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.7rem' }}>Part 2: Beginner Strategy & Tactics</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
              Lessons 16 to 25 • Openings, center control, king protection, double attacks, and checkmates
            </p>
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '1.25rem',
          }}
        >
          {strategy.map((lesson) => {
            const isCompleted = isLessonCompleted(lesson.id);
            return (
              <div
                key={lesson.id}
                onClick={() => setActiveLesson(lesson)}
                className="glass-panel"
                style={{
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '1rem',
                  cursor: 'pointer',
                  borderTop: isCompleted ? '3px solid #10b981' : '3px solid rgba(16, 185, 129, 0.4)',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                    <span style={{ fontSize: '2rem' }}>{lesson.emoji}</span>
                    {isCompleted ? (
                      <span className="badge badge-emerald" style={{ fontSize: '0.75rem' }}>
                        <CheckCircle2 size={12} /> Completed
                      </span>
                    ) : (
                      <span
                        style={{
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          color: 'var(--text-muted)',
                          padding: '0.2rem 0.6rem',
                          borderRadius: 'var(--radius-sm)',
                          backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        }}
                      >
                        Lesson {lesson.id}
                      </span>
                    )}
                  </div>

                  <h3 style={{ fontSize: '1.25rem', marginBottom: '0.4rem', color: '#ffffff' }}>
                    {lesson.title}
                  </h3>

                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontStyle: 'italic', lineHeight: 1.4 }}>
                    “{lesson.quote}”
                  </p>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '0.75rem',
                    borderTop: '1px solid var(--border-subtle)',
                  }}
                >
                  <span style={{ fontSize: '0.82rem', color: isCompleted ? '#34d399' : 'var(--accent-emerald)', fontWeight: 600 }}>
                    {isCompleted ? 'Review Chapter' : 'Start Interactive Lesson'}
                  </span>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      color: 'var(--text-primary)',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                    }}
                  >
                    <Play size={12} fill="currentColor" /> Play
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Lesson Modal Viewer */}
      {activeLesson && (
        <LessonViewer
          lesson={activeLesson}
          onClose={() => setActiveLesson(null)}
          onSelectLesson={(id) => {
            const found = ALL_LESSONS.find((l) => l.id === id);
            if (found) setActiveLesson(found);
          }}
        />
      )}
    </div>
  );
}
