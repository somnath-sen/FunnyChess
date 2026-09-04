'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useTranslation, LANGUAGES, Language } from '@/context/LanguageContext';
import { UserAvatar } from '@/components/UserAvatar';
import { ProtectedRoute } from '@/components/Auth/ProtectedRoute';
import { 
  ACHIEVEMENTS_DATA, 
  getLevelFromXP, 
  getSavedGameHistory, 
  PersistedGameRecord 
} from '@/lib/gamification/gamificationService';
import { GameReplayModal } from '@/components/Profile/GameReplayModal';
import { VoiceControlWidget } from '@/components/Voice/VoiceControlWidget';
import { useSpeech } from '@/hooks/useSpeech';
import { 
  User, 
  Trophy, 
  Flame, 
  CheckCircle2, 
  Lock, 
  LogOut, 
  Sparkles, 
  BookOpen, 
  Swords, 
  TrendingUp,
  Globe,
  Settings,
  ArrowRight,
  Play,
  RotateCcw,
  Volume2,
  Calendar,
  Camera
} from 'lucide-react';

export default function ProfilePage() {
  return (
    <ProtectedRoute feature="profile">
      <ProfileContent />
    </ProtectedRoute>
  );
}

function ProfileContent() {
  const { user, signOut, updateAvatar } = useAuth();
  const { language, setLanguage, t } = useTranslation();
  const speech = useSpeech(language as any);

  const [isVoiceWidgetOpen, setIsVoiceWidgetOpen] = useState(false);
  const [activeStatsTab, setActiveStatsTab] = useState<'all' | 'ai' | 'friend'>('all');
  const [recentGames, setRecentGames] = useState<PersistedGameRecord[]>([]);
  const [selectedReplayGame, setSelectedReplayGame] = useState<PersistedGameRecord | null>(null);

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert('Image size should be less than 2MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      if (typeof reader.result === 'string') {
        await updateAvatar(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  // Load persisted game records
  useEffect(() => {
    const history = getSavedGameHistory();
    // If user has played games but local history empty, provide initial recorded matches
    if (history.length === 0 && user && user.games_played > 0) {
      const initialHistory: PersistedGameRecord[] = [
        {
          id: 'initial_game_1',
          game_type: 'ai',
          opponent: 'FunnyBot (Comedian)',
          result: 'win',
          playerColor: 'white',
          difficulty: 'easy',
          movesCount: 18,
          moveHistory: ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4', 'Nf6', 'd3', 'Bc5', 'O-O', 'd6', 'Bg5', 'h6', 'Bh4', 'g5', 'Bg3', 'Bg4', 'Nc3', 'Nd4'],
          date: 'Recent',
        },
      ];
      setRecentGames(initialHistory);
    } else {
      setRecentGames(history);
    }
  }, [user]);

  if (!user) {
    return (
      <div className="container" style={{ padding: '5rem 1.25rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>Loading player profile...</p>
      </div>
    );
  }

  const levelInfo = getLevelFromXP(user.xp);
  const xpCurrentTier = user.xp - levelInfo.minXP;
  const xpRequiredTier = levelInfo.maxXP - levelInfo.minXP;
  const xpProgressPercent = Math.min(100, Math.round((xpCurrentTier / Math.max(1, xpRequiredTier)) * 100));

  // Stats by Tab
  const statsToDisplay = 
    activeStatsTab === 'ai'
      ? user.ai_games
      : activeStatsTab === 'friend'
      ? user.friend_games
      : {
          played: user.games_played,
          wins: user.wins,
          losses: user.losses,
          draws: user.draws,
        };

  const winRate = statsToDisplay.played > 0 
    ? Math.round((statsToDisplay.wins / statsToDisplay.played) * 100) 
    : 0;

  // Next uncompleted lesson ID
  const nextLessonId = Math.min(25, (user.completed_lessons?.length || 0) + 1);

  return (
    <div className="container" style={{ padding: '3rem 1.25rem 5rem', maxWidth: '960px' }}>
      {/* 1. Profile Header Card */}
      <div
        className="glass-panel"
        style={{
          padding: '2.5rem 2rem',
          marginBottom: '2rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1.5rem',
          background: 'linear-gradient(135deg, rgba(24, 32, 48, 0.9), rgba(17, 22, 34, 0.95))',
          border: '1px solid rgba(245, 158, 11, 0.3)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          {/* Avatar Container with Upload Badge */}
          <div style={{ position: 'relative', width: '80px', height: '80px', flexShrink: 0 }}>
            <UserAvatar
              src={user.avatar_url}
              name={user.name}
              size={80}
              borderRadius="24px"
              border="2px solid var(--accent-gold)"
              boxShadow="0 8px 24px rgba(245, 158, 11, 0.35)"
            />
            <label
              htmlFor="avatar-upload-input"
              title="Upload Custom Profile Picture"
              style={{
                position: 'absolute',
                bottom: '-4px',
                right: '-4px',
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                backgroundColor: 'var(--accent-gold)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.5)',
                border: '2px solid #0d121c',
                transition: 'transform 0.15s ease',
              }}
            >
              <Camera size={14} color="#000000" />
              <input
                id="avatar-upload-input"
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleAvatarUpload}
              />
            </label>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem', flexWrap: 'wrap' }}>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0, color: '#ffffff' }}>
                {user.name}
              </h1>
              {user.isGuest ? (
                <span className="badge badge-gold" style={{ fontSize: '0.75rem' }}>
                  Guest Player
                </span>
              ) : (
                <span className="badge badge-emerald" style={{ fontSize: '0.75rem' }}>
                  Google Verified
                </span>
              )}
            </div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>{user.email}</div>
            
            {/* Level & XP Badges */}
            <div style={{ marginTop: '0.65rem', display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
              <span className="badge badge-purple" style={{ fontSize: '0.8rem', fontWeight: 700 }}>
                {levelInfo.icon} Level {levelInfo.level}: {levelInfo.title[language as 'en' | 'hi' | 'bn'] || levelInfo.title.en}
              </span>
              <span className="badge badge-gold" style={{ fontSize: '0.8rem', fontWeight: 700 }}>
                ⭐ {user.xp} XP
              </span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            onClick={signOut}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.6rem 1.1rem',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#f87171',
              fontSize: '0.85rem',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* 2. XP & Progression Bar Card */}
      <div
        className="glass-panel"
        style={{
          padding: '1.75rem 2rem',
          marginBottom: '2rem',
          border: '1px solid rgba(139, 92, 246, 0.3)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
              Level Progression
            </span>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff' }}>
              {levelInfo.icon} Level {levelInfo.level}: {levelInfo.title[language as 'en' | 'hi' | 'bn'] || levelInfo.title.en}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Next Level</span>
            <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--accent-gold)' }}>
              {user.xp} / {levelInfo.maxXP} XP
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div
          style={{
            width: '100%',
            height: '10px',
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            borderRadius: 'var(--radius-full)',
            overflow: 'hidden',
            marginBottom: '0.65rem',
          }}
        >
          <div
            style={{
              width: `${xpProgressPercent}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #8b5cf6, #ec4899, #f59e0b)',
              borderRadius: 'var(--radius-full)',
              transition: 'width 0.4s ease',
            }}
          />
        </div>

        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          💡 Earn XP by completing lessons (+50 XP), winning matches (+75 XP), and unlocking achievements!
        </div>
      </div>

      {/* 3. Learning Progress Card (Linked to Phase 2) */}
      <div
        className="glass-panel"
        style={{
          padding: '1.75rem 2rem',
          marginBottom: '2rem',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1.25rem',
        }}
      >
        <div style={{ flex: 1, minWidth: '260px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
            <BookOpen size={18} color="var(--accent-emerald)" />
            <span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#ffffff' }}>
              Learn Chess Progress
            </span>
            <span className="badge badge-emerald" style={{ fontSize: '0.75rem' }}>
              {user.learning_progress}%
            </span>
          </div>

          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', margin: '0 0 0.75rem' }}>
            {user.completed_lessons?.length || 0} / 25 lessons completed
          </p>

          {/* Lesson progress bar */}
          <div
            style={{
              width: '100%',
              height: '8px',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              borderRadius: 'var(--radius-full)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${user.learning_progress}%`,
                height: '100%',
                backgroundColor: 'var(--accent-emerald)',
                borderRadius: 'var(--radius-full)',
              }}
            />
          </div>
        </div>

        <Link
          href={`/learn`}
          className="btn-primary"
          style={{ padding: '0.75rem 1.35rem', fontSize: '0.92rem' }}
        >
          <span>Continue Learning</span>
          <ArrowRight size={16} />
        </Link>
      </div>

      {/* 4. Statistics Breakdown */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
            Game Statistics 📊
          </h2>

          {/* Stats Filter Tabs */}
          <div style={{ display: 'flex', gap: '0.35rem', backgroundColor: 'rgba(255, 255, 255, 0.05)', padding: '0.25rem', borderRadius: 'var(--radius-full)' }}>
            <button
              onClick={() => setActiveStatsTab('all')}
              style={{
                background: activeStatsTab === 'all' ? 'var(--accent-gold)' : 'transparent',
                border: 'none',
                color: activeStatsTab === 'all' ? '#0a0d14' : 'var(--text-muted)',
                borderRadius: 'var(--radius-full)',
                padding: '0.35rem 0.85rem',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              All Matches
            </button>
            <button
              onClick={() => setActiveStatsTab('ai')}
              style={{
                background: activeStatsTab === 'ai' ? 'var(--accent-gold)' : 'transparent',
                border: 'none',
                color: activeStatsTab === 'ai' ? '#0a0d14' : 'var(--text-muted)',
                borderRadius: 'var(--radius-full)',
                padding: '0.35rem 0.85rem',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              🤖 vs AI
            </button>
            <button
              onClick={() => setActiveStatsTab('friend')}
              style={{
                background: activeStatsTab === 'friend' ? 'var(--accent-gold)' : 'transparent',
                border: 'none',
                color: activeStatsTab === 'friend' ? '#0a0d14' : 'var(--text-muted)',
                borderRadius: 'var(--radius-full)',
                padding: '0.35rem 0.85rem',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              👥 vs Friend
            </button>
          </div>
        </div>

        {/* Stat Metric Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
          <div className="glass-panel" style={{ padding: '1.25rem', textAlign: 'center' }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600 }}>
              Games Played
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff', marginTop: '0.2rem' }}>
              {statsToDisplay.played}
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '1.25rem', textAlign: 'center', borderTop: '3px solid #10b981' }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600 }}>
              Wins
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#34d399', marginTop: '0.2rem' }}>
              {statsToDisplay.wins}
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '1.25rem', textAlign: 'center', borderTop: '3px solid #ef4444' }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600 }}>
              Losses
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#f87171', marginTop: '0.2rem' }}>
              {statsToDisplay.losses}
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '1.25rem', textAlign: 'center', borderTop: '3px solid #f59e0b' }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600 }}>
              Draws
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#fbbf24', marginTop: '0.2rem' }}>
              {statsToDisplay.draws}
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '1.25rem', textAlign: 'center', borderTop: '3px solid #8b5cf6' }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600 }}>
              Win Rate
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#c084fc', marginTop: '0.2rem' }}>
              {winRate}%
            </div>
          </div>
        </div>
      </div>

      {/* 5. Achievements Section (All 10 Transparent Badges) */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
              Achievements 🏆
            </h2>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Unlocked {user.achievements?.length || 0} of {ACHIEVEMENTS_DATA.length} badges
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
          {ACHIEVEMENTS_DATA.map((ach) => {
            const isUnlocked = user.achievements?.includes(ach.id);
            return (
              <div
                key={ach.id}
                className="glass-panel"
                style={{
                  padding: '1.25rem',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.85rem',
                  border: isUnlocked
                    ? '1px solid rgba(245, 158, 11, 0.4)'
                    : '1px solid rgba(255, 255, 255, 0.05)',
                  backgroundColor: isUnlocked ? 'rgba(245, 158, 11, 0.06)' : 'rgba(255, 255, 255, 0.01)',
                  opacity: isUnlocked ? 1 : 0.65,
                  transition: 'all 0.2s ease',
                }}
              >
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    backgroundColor: isUnlocked ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                    flexShrink: 0,
                  }}
                >
                  {isUnlocked ? ach.icon : <Lock size={20} color="var(--text-muted)" />}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.4rem', marginBottom: '0.2rem' }}>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 800, margin: 0, color: isUnlocked ? '#ffffff' : 'var(--text-muted)' }}>
                      {ach.title[language as 'en' | 'hi' | 'bn'] || ach.title.en}
                    </h3>
                    <span style={{ fontSize: '0.72rem', color: isUnlocked ? '#34d399' : 'var(--text-muted)', fontWeight: 700 }}>
                      +{ach.xpReward} XP
                    </span>
                  </div>

                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
                    {ach.desc[language as 'en' | 'hi' | 'bn'] || ach.desc.en}
                  </p>

                  {isUnlocked && (
                    <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#10b981', fontSize: '0.72rem', fontWeight: 700 }}>
                      <CheckCircle2 size={13} />
                      <span>Unlocked</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 6. Recent Games & Replay Section */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
              Recent Match History 🎮
            </h2>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Click any match to launch the interactive board replay!
            </div>
          </div>
        </div>

        {recentGames.length === 0 ? (
          <div className="glass-panel" style={{ padding: '2.5rem', textAlign: 'center' }}>
            <p style={{ color: 'var(--text-muted)', margin: 0 }}>
              No games completed yet. Play your first match with AI or a friend to see your replay history!
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {recentGames.map((game) => (
              <div
                key={game.id}
                className="glass-panel"
                onClick={() => setSelectedReplayGame(game)}
                style={{
                  padding: '1.1rem 1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1rem',
                  cursor: 'pointer',
                  border: '1px solid var(--border-subtle)',
                  transition: 'all 0.15s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      backgroundColor: game.result === 'win' ? 'rgba(16, 185, 129, 0.15)' : game.result === 'loss' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.2rem',
                    }}
                  >
                    {game.game_type === 'ai' ? '🤖' : '👥'}
                  </div>

                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#ffffff' }}>
                      vs {game.opponent}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      {game.date} • {game.movesCount} moves • Playing as {game.playerColor || 'White'}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <span
                    style={{
                      fontSize: '0.82rem',
                      fontWeight: 800,
                      color: game.result === 'win' ? '#34d399' : game.result === 'loss' ? '#f87171' : '#fde68a',
                      textTransform: 'uppercase',
                    }}
                  >
                    {game.result}
                  </span>

                  <button
                    className="btn-secondary"
                    style={{ padding: '0.4rem 0.85rem', fontSize: '0.78rem' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedReplayGame(game);
                    }}
                  >
                    <Play size={13} fill="currentColor" />
                    <span>Replay</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 7. Settings & Preferences Section */}
      <div className="glass-panel" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
          <Settings size={20} color="var(--accent-gold)" />
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
            Preferences & Settings
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
          {/* Language Selector */}
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              Interface Language
            </label>
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  style={{
                    padding: '0.55rem 0.85rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: language === lang.code ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                    border: `1px solid ${language === lang.code ? 'var(--accent-gold)' : 'var(--border-subtle)'}`,
                    color: language === lang.code ? 'var(--accent-gold)' : '#ffffff',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  {lang.flag} {lang.name}
                </button>
              ))}
            </div>
          </div>

          {/* Voice Settings */}
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              AI Spoken Voice
            </label>
            <button
              onClick={() => setIsVoiceWidgetOpen(true)}
              className="btn-secondary"
              style={{ width: '100%', padding: '0.65rem 1rem', fontSize: '0.85rem', justifyContent: 'space-between' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Volume2 size={16} />
                <span>Voice Controls & Volume</span>
              </div>
              <span style={{ color: 'var(--accent-gold)', fontWeight: 700, textTransform: 'uppercase' }}>
                {speech.voiceLanguage}
              </span>
            </button>
          </div>
        </div>
      </div>


      {/* Game Replay Modal */}
      {selectedReplayGame && (
        <GameReplayModal
          game={selectedReplayGame}
          onClose={() => setSelectedReplayGame(null)}
        />
      )}

      {/* Voice Control Modal */}
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
