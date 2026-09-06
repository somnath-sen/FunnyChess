'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth, DailyChallengeRecord, DailyChallengeStats } from '@/context/AuthContext';
import { useTranslation } from '@/context/LanguageContext';
import { getDailyChallenge } from '@/lib/chess/dailyChallengeData';
import { 
  Calendar, 
  Flame, 
  Trophy, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  Sparkles, 
  Swords, 
  HelpCircle,
  Award
} from 'lucide-react';

export const DailyChallengeTracker: React.FC = () => {
  const { t } = useTranslation();
  const { getDailyChallengeHistory, user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState<DailyChallengeRecord[]>([]);
  const [stats, setStats] = useState<DailyChallengeStats>({
    currentStreak: 0,
    longestStreak: 0,
    totalCompleted: 0,
    totalXp: 0,
    completedDates: [],
  });

  const { puzzle: todayPuzzle, dateStr: todayDateStr } = getDailyChallenge();

  useEffect(() => {
    let active = true;
    getDailyChallengeHistory().then((res) => {
      if (active) {
        setHistory(res.records);
        setStats(res.stats);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, [getDailyChallengeHistory, user]);

  const isTodayCompleted = stats.completedDates.includes(todayDateStr);

  // Generate 7-day rolling calendar strip (from 6 days ago up to today)
  const calendarDays = React.useMemo(() => {
    const days = [];
    const now = new Date();
    const completedSet = new Set(stats.completedDates);

    for (let i = 6; i >= 0; i--) {
      const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - i));
      const year = d.getUTCFullYear();
      const month = String(d.getUTCMonth() + 1).padStart(2, '0');
      const day = String(d.getUTCDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;
      const isToday = i === 0;
      const isCompleted = completedSet.has(dateStr);

      const dayName = isToday
        ? 'Today'
        : d.toLocaleDateString('en-US', { weekday: 'short', timeZone: 'UTC' });
      const dayNumber = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });

      days.push({
        dateStr,
        dayName,
        dayNumber,
        isToday,
        isCompleted,
      });
    }
    return days;
  }, [stats.completedDates]);

  return (
    <div
      className="glass-panel"
      style={{
        padding: '2rem',
        marginBottom: '2.5rem',
        background: 'linear-gradient(135deg, rgba(24, 32, 48, 0.95), rgba(15, 22, 36, 0.95))',
        border: '1px solid rgba(245, 158, 11, 0.35)',
        boxShadow: '0 16px 40px rgba(0, 0, 0, 0.45)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Accent Background Glow */}
      <div
        style={{
          position: 'absolute',
          top: '-60px',
          right: '-60px',
          width: '240px',
          height: '240px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(245, 158, 11, 0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Header Section */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
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
              backgroundColor: 'rgba(245, 158, 11, 0.18)',
              border: '1px solid rgba(245, 158, 11, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem',
            }}
          >
            ♟️
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                {t('dailyChallenge.trackerTitle', 'Daily Challenge & Streak')}
              </h2>
              <span className="badge badge-gold" style={{ fontSize: '0.72rem' }}>
                <Flame size={12} color="#f59e0b" />
                <span>{stats.currentStreak} Day Streak</span>
              </span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '0.2rem 0 0' }}>
              {t(
                'dailyChallenge.trackerDesc',
                'Solve one handpicked tactical puzzle every day to keep your streak alive and earn +25 XP.'
              )}
            </p>
          </div>
        </div>

        <Link
          href="/daily"
          className="btn-primary"
          style={{ padding: '0.65rem 1.25rem', fontSize: '0.88rem' }}
        >
          <Swords size={16} />
          <span>{isTodayCompleted ? 'Review Daily Puzzle' : 'Play Today’s Puzzle'}</span>
          <ArrowRight size={15} />
        </Link>
      </div>

      {/* 4 Stat Metric Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '1rem',
          marginBottom: '1.75rem',
        }}
      >
        {/* Stat 1: Current Streak */}
        <div
          className="glass-panel"
          style={{
            padding: '1.15rem 1rem',
            textAlign: 'center',
            borderTop: '3px solid #f59e0b',
            backgroundColor: 'rgba(245, 158, 11, 0.05)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.35rem',
              color: 'var(--accent-gold)',
              fontSize: '0.78rem',
              fontWeight: 700,
              textTransform: 'uppercase',
            }}
          >
            <Flame size={15} />
            <span>Current Streak</span>
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#ffffff', marginTop: '0.35rem' }}>
            {stats.currentStreak} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>days</span>
          </div>
        </div>

        {/* Stat 2: Longest Streak */}
        <div
          className="glass-panel"
          style={{
            padding: '1.15rem 1rem',
            textAlign: 'center',
            borderTop: '3px solid #8b5cf6',
            backgroundColor: 'rgba(139, 92, 246, 0.05)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.35rem',
              color: '#c084fc',
              fontSize: '0.78rem',
              fontWeight: 700,
              textTransform: 'uppercase',
            }}
          >
            <Trophy size={14} />
            <span>Best Streak</span>
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#ffffff', marginTop: '0.35rem' }}>
            {stats.longestStreak} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>days</span>
          </div>
        </div>

        {/* Stat 3: Total Completed */}
        <div
          className="glass-panel"
          style={{
            padding: '1.15rem 1rem',
            textAlign: 'center',
            borderTop: '3px solid #10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.05)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.35rem',
              color: '#34d399',
              fontSize: '0.78rem',
              fontWeight: 700,
              textTransform: 'uppercase',
            }}
          >
            <CheckCircle2 size={14} />
            <span>Total Solved</span>
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#ffffff', marginTop: '0.35rem' }}>
            {stats.totalCompleted} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>puzzles</span>
          </div>
        </div>

        {/* Stat 4: Daily XP Earned */}
        <div
          className="glass-panel"
          style={{
            padding: '1.15rem 1rem',
            textAlign: 'center',
            borderTop: '3px solid #3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.05)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.35rem',
              color: '#60a5fa',
              fontSize: '0.78rem',
              fontWeight: 700,
              textTransform: 'uppercase',
            }}
          >
            <Award size={15} />
            <span>Challenge XP</span>
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--accent-gold)', marginTop: '0.35rem' }}>
            +{stats.totalXp} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>XP</span>
          </div>
        </div>
      </div>

      {/* 7-Day Day-Wise Calendar Strip */}
      <div style={{ marginBottom: '1.75rem' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '0.85rem',
          }}
        >
          <span
            style={{
              fontSize: '0.82rem',
              fontWeight: 700,
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            7-Day Activity & Verification Strip
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Automatic checkmark upon solving
          </span>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: '0.65rem',
          }}
        >
          {calendarDays.map((day) => (
            <div
              key={day.dateStr}
              style={{
                padding: '0.85rem 0.4rem',
                borderRadius: '14px',
                textAlign: 'center',
                backgroundColor: day.isCompleted
                  ? 'rgba(16, 185, 129, 0.12)'
                  : day.isToday
                  ? 'rgba(245, 158, 11, 0.12)'
                  : 'rgba(255, 255, 255, 0.03)',
                border: day.isCompleted
                  ? '1px solid rgba(16, 185, 129, 0.4)'
                  : day.isToday
                  ? '1px solid rgba(245, 158, 11, 0.45)'
                  : '1px solid rgba(255, 255, 255, 0.07)',
                transition: 'transform 0.15s ease',
              }}
            >
              <div
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  color: day.isToday ? 'var(--accent-gold)' : 'var(--text-muted)',
                  textTransform: 'uppercase',
                  marginBottom: '0.25rem',
                }}
              >
                {day.dayName}
              </div>

              <div
                style={{
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  color: '#ffffff',
                  marginBottom: '0.5rem',
                }}
              >
                {day.dayNumber}
              </div>

              {/* Status Circle */}
              <div
                style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  margin: '0 auto',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: day.isCompleted
                    ? '#10b981'
                    : day.isToday
                    ? 'rgba(245, 158, 11, 0.25)'
                    : 'rgba(255, 255, 255, 0.05)',
                  color: day.isCompleted
                    ? '#ffffff'
                    : day.isToday
                    ? 'var(--accent-gold)'
                    : 'var(--text-muted)',
                  boxShadow: day.isCompleted
                    ? '0 0 12px rgba(16, 185, 129, 0.4)'
                    : 'none',
                }}
              >
                {day.isCompleted ? (
                  <CheckCircle2 size={16} />
                ) : day.isToday ? (
                  <Clock size={15} />
                ) : (
                  <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>—</span>
                )}
              </div>

              <div
                style={{
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  marginTop: '0.45rem',
                  color: day.isCompleted
                    ? '#34d399'
                    : day.isToday
                    ? 'var(--accent-gold)'
                    : 'var(--text-muted)',
                }}
              >
                {day.isCompleted ? '+25 XP' : day.isToday ? 'Pending' : 'Missed'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Today's Status Banner */}
      <div
        style={{
          padding: '1.25rem 1.5rem',
          borderRadius: '16px',
          backgroundColor: isTodayCompleted
            ? 'rgba(16, 185, 129, 0.12)'
            : 'rgba(245, 158, 11, 0.12)',
          border: isTodayCompleted
            ? '1px solid rgba(16, 185, 129, 0.35)'
            : '1px solid rgba(245, 158, 11, 0.35)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              backgroundColor: isTodayCompleted
                ? 'rgba(16, 185, 129, 0.2)'
                : 'rgba(245, 158, 11, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: isTodayCompleted ? '#10b981' : 'var(--accent-gold)',
            }}
          >
            {isTodayCompleted ? <CheckCircle2 size={22} /> : <Clock size={22} />}
          </div>

          <div>
            <div style={{ fontWeight: 800, fontSize: '0.98rem', color: '#ffffff' }}>
              {isTodayCompleted
                ? "Today's Challenge Completed! 🎉"
                : "Today's Challenge is Ready: " + todayPuzzle.title}
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
              {isTodayCompleted
                ? `You earned +25 XP today for "${todayPuzzle.title}". Come back tomorrow for the next challenge!`
                : `Target: ${todayPuzzle.objective} — Solve it now to maintain your ${stats.currentStreak} day streak!`}
            </div>
          </div>
        </div>

        <Link
          href="/daily"
          className={isTodayCompleted ? 'btn-secondary' : 'btn-primary'}
          style={{ padding: '0.55rem 1.15rem', fontSize: '0.85rem' }}
        >
          <span>{isTodayCompleted ? 'Review Puzzle' : 'Solve Challenge (+25 XP)'}</span>
          <ArrowRight size={14} />
        </Link>
      </div>

      {/* Recent Completions History (if any) */}
      {history.length > 0 && (
        <div style={{ marginTop: '1.75rem' }}>
          <div
            style={{
              fontSize: '0.82rem',
              fontWeight: 700,
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              marginBottom: '0.75rem',
            }}
          >
            Recent Completed Challenges
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {history.slice(0, 4).map((record) => (
              <div
                key={record.id}
                style={{
                  padding: '0.75rem 1rem',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <CheckCircle2 size={16} color="#10b981" />
                  <div>
                    <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#ffffff' }}>
                      {record.challenge_date}
                    </span>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        color: 'var(--text-muted)',
                        marginLeft: '0.5rem',
                      }}
                    >
                      Puzzle ID: {record.puzzle_id}
                    </span>
                  </div>
                </div>

                <span
                  style={{
                    fontSize: '0.78rem',
                    fontWeight: 800,
                    color: 'var(--accent-gold)',
                  }}
                >
                  +{record.xp_awarded} XP
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
