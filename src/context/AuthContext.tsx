'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { getSupabase, isSupabaseConfigured } from '@/lib/supabase/client';
import { 
  getLevelFromXP, 
  ACHIEVEMENTS_DATA, 
  PersistedGameRecord, 
  saveGameRecord 
} from '@/lib/gamification/gamificationService';
import { sounds } from '@/lib/audio/soundEffects';
import confetti from 'canvas-confetti';

export interface GameModeStats {
  played: number;
  wins: number;
  losses: number;
  draws: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
  isGuest: boolean;
  xp: number;
  chess_level: string;
  chess_level_number: number;
  games_played: number;
  wins: number;
  losses: number;
  draws: number;
  ai_games: GameModeStats;
  friend_games: GameModeStats;
  learning_progress: number; // percentage
  completed_lessons: number[];
  achievements: string[];
}

export interface AchievementNotification {
  id: string;
  title: string;
  icon: string;
  xpReward: number;
}

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  isConfigured: boolean;
  notification: AchievementNotification | null;
  dismissNotification: () => void;
  signInWithGoogle: () => Promise<void>;
  signInAsGuest: () => void;
  signOut: () => Promise<void>;
  addXP: (amount: number, reason?: string) => void;
  unlockAchievement: (achievementId: string) => void;
  completeLesson: (lessonId: number) => void;
  isLessonCompleted: (lessonId: number) => boolean;
  recordDetailedGame: (game: PersistedGameRecord) => void;
  recordGameResult: (result: 'win' | 'loss' | 'draw', difficulty: string) => void;
  updateAvatar: (newAvatarUrl: string) => Promise<void>;
}

/**
 * Robustly resolve avatar URL across all common Google OAuth and Supabase identity metadata fields
 */
export function resolveAvatarUrl(supabaseUser: any, fallbackAvatar?: string): string {
  if (!supabaseUser) return fallbackAvatar || '';
  const meta = supabaseUser.user_metadata || {};
  const identities = Array.isArray(supabaseUser.identities) ? supabaseUser.identities : [];
  const identityData = identities[0]?.identity_data || {};

  const candidate =
    meta.avatar_url ||
    meta.picture ||
    meta.photoURL ||
    meta.image ||
    meta.avatar ||
    identityData.avatar_url ||
    identityData.picture ||
    identityData.photoURL ||
    identityData.image ||
    identityData.avatar ||
    fallbackAvatar ||
    '';

  if (typeof candidate === 'string' && candidate.trim()) {
    let cleanUrl = candidate.trim();
    if (cleanUrl.startsWith('//')) {
      cleanUrl = 'https:' + cleanUrl;
    }
    return cleanUrl;
  }

  return fallbackAvatar || '';
}

export function resolveUserName(supabaseUser: any, fallbackName?: string): string {
  if (!supabaseUser) return fallbackName || 'Player';
  const meta = supabaseUser.user_metadata || {};
  const identities = Array.isArray(supabaseUser.identities) ? supabaseUser.identities : [];
  const identityData = identities[0]?.identity_data || {};

  const candidate =
    meta.full_name ||
    meta.name ||
    meta.user_name ||
    meta.preferred_username ||
    identityData.full_name ||
    identityData.name ||
    identityData.user_name ||
    fallbackName ||
    supabaseUser.email?.split('@')[0] ||
    'Player';

  return typeof candidate === 'string' && candidate.trim() ? candidate.trim() : 'Player';
}

const DEFAULT_GUEST: UserProfile = {
  id: 'guest_player',
  name: 'Funny Grandmaster (Guest)',
  email: 'guest@funnychess.local',
  avatar_url: '',
  isGuest: true,
  xp: 350,
  chess_level: 'Piece Explorer',
  chess_level_number: 2,
  games_played: 1,
  wins: 1,
  losses: 0,
  draws: 0,
  ai_games: { played: 1, wins: 1, losses: 0, draws: 0 },
  friend_games: { played: 0, wins: 0, losses: 0, draws: 0 },
  learning_progress: 20,
  completed_lessons: [1, 2, 3, 4, 5],
  achievements: ['first_game', 'all_pieces'],
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState<AchievementNotification | null>(null);

  useEffect(() => {
    // 1. Check local guest storage first
    try {
      const savedUser = localStorage.getItem('funnychess_user');
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        // Ensure new fields exist gracefully
        const levelInfo = getLevelFromXP(parsed.xp || 350);
        setUser({
          ...DEFAULT_GUEST,
          ...parsed,
          xp: parsed.xp || 350,
          chess_level: levelInfo.title.en,
          chess_level_number: levelInfo.level,
          ai_games: parsed.ai_games || { played: parsed.games_played || 0, wins: parsed.wins || 0, losses: parsed.losses || 0, draws: parsed.draws || 0 },
          friend_games: parsed.friend_games || { played: 0, wins: 0, losses: 0, draws: 0 },
        });
      } else {
        setUser(DEFAULT_GUEST);
        localStorage.setItem('funnychess_user', JSON.stringify(DEFAULT_GUEST));
      }
    } catch {
      setUser(DEFAULT_GUEST);
    }

    // 2. If Supabase is configured, listen to real session
    const supabase = getSupabase();
    if (supabase) {
      const syncSessionUser = async (sessionUser: any) => {
        if (!sessionUser) return;

        let cachedUser: UserProfile | null = null;
        try {
          const saved = localStorage.getItem('funnychess_user');
          if (saved) cachedUser = JSON.parse(saved);
        } catch {}

        const resolvedAvatar = resolveAvatarUrl(sessionUser, cachedUser?.avatar_url);
        const resolvedName = resolveUserName(sessionUser, cachedUser?.name);

        // Attempt to load cloud profile from Supabase if table exists
        let dbProfile: any = null;
        try {
          const { data } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', sessionUser.id)
            .maybeSingle();
          if (data) dbProfile = data;
        } catch {}

        const finalAvatar = dbProfile?.avatar_url || resolvedAvatar || cachedUser?.avatar_url || '';
        const finalName = dbProfile?.name || resolvedName || cachedUser?.name || 'Player';

        // Preserve accumulated XP and level rather than resetting to default
        const currentXP = cachedUser?.xp && cachedUser.xp > 500 ? cachedUser.xp : (cachedUser?.xp || 500);
        const levelInfo = getLevelFromXP(currentXP);

        const authUser: UserProfile = {
          id: sessionUser.id,
          name: finalName,
          email: sessionUser.email || dbProfile?.email || cachedUser?.email || '',
          avatar_url: finalAvatar,
          isGuest: false,
          xp: currentXP,
          chess_level: levelInfo.title.en,
          chess_level_number: levelInfo.level,
          games_played: dbProfile?.games_played ?? cachedUser?.games_played ?? 0,
          wins: dbProfile?.wins ?? cachedUser?.wins ?? 0,
          losses: dbProfile?.losses ?? cachedUser?.losses ?? 0,
          draws: dbProfile?.draws ?? cachedUser?.draws ?? 0,
          ai_games: cachedUser?.ai_games || { played: 0, wins: 0, losses: 0, draws: 0 },
          friend_games: cachedUser?.friend_games || { played: 0, wins: 0, losses: 0, draws: 0 },
          learning_progress: cachedUser?.learning_progress || 0,
          completed_lessons: cachedUser?.completed_lessons || [],
          achievements: cachedUser?.achievements || ['first_game'],
        };

        setUser(authUser);
        try {
          localStorage.setItem('funnychess_user', JSON.stringify(authUser));
        } catch {}

        // Ensure Supabase profiles table stores the resolved avatar_url if connected
        if (finalAvatar) {
          try {
            await supabase
              .from('profiles')
              .upsert(
                {
                  id: sessionUser.id,
                  name: finalName,
                  email: sessionUser.email,
                  avatar_url: finalAvatar,
                  updated_at: new Date().toISOString(),
                },
                { onConflict: 'id' }
              );
          } catch {}
        }
      };

      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          syncSessionUser(session.user);
        }
        setLoading(false);
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          syncSessionUser(session.user);
        }
      });

      return () => subscription.unsubscribe();
    } else {
      setLoading(false);
    }
  }, []);

  const dismissNotification = () => setNotification(null);

  // Add XP with level recalculation
  const addXP = (amount: number, reason?: string) => {
    if (!user) return;
    const newXP = user.xp + amount;
    const levelInfo = getLevelFromXP(newXP);

    const updated: UserProfile = {
      ...user,
      xp: newXP,
      chess_level: levelInfo.title.en,
      chess_level_number: levelInfo.level,
    };

    setUser(updated);
    try {
      localStorage.setItem('funnychess_user', JSON.stringify(updated));
    } catch {}
  };

  // Unlock achievement with celebratory popup, sound, and XP reward
  const unlockAchievement = (achievementId: string) => {
    if (!user) return;
    if (user.achievements.includes(achievementId)) return;

    const achDef = ACHIEVEMENTS_DATA.find((a) => a.id === achievementId);
    const xpReward = achDef ? achDef.xpReward : 50;

    const newAchievements = [...user.achievements, achievementId];
    const newXP = user.xp + xpReward;
    const levelInfo = getLevelFromXP(newXP);

    const updated: UserProfile = {
      ...user,
      xp: newXP,
      chess_level: levelInfo.title.en,
      chess_level_number: levelInfo.level,
      achievements: newAchievements,
    };

    setUser(updated);
    try {
      localStorage.setItem('funnychess_user', JSON.stringify(updated));
    } catch {}

    // Celebratory notification
    if (achDef) {
      setNotification({
        id: achDef.id,
        title: achDef.title.en,
        icon: achDef.icon,
        xpReward,
      });
      sounds.playSuccess();
      confetti({ particleCount: 50, spread: 60 });
    }
  };

  // Sign in with Google
  const signInWithGoogle = async () => {
    const supabase = getSupabase();
    if (!supabase) return;
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  const signInAsGuest = () => {
    setUser(DEFAULT_GUEST);
    localStorage.setItem('funnychess_user', JSON.stringify(DEFAULT_GUEST));
  };

  const signOut = async () => {
    const supabase = getSupabase();
    if (supabase) {
      await supabase.auth.signOut();
    }
    signInAsGuest();
  };

  // Complete lesson
  const completeLesson = (lessonId: number) => {
    if (!user) return;
    const currentCompleted = user.completed_lessons || [];
    if (currentCompleted.includes(lessonId)) return;

    const newCompleted = [...currentCompleted, lessonId];
    const newProgress = Math.round((newCompleted.length / 25) * 100);
    const newXP = user.xp + 50;
    const levelInfo = getLevelFromXP(newXP);

    // Achievements check
    const newAchievements = new Set(user.achievements);
    if (newCompleted.length >= 6) {
      newAchievements.add('all_pieces');
    }
    if (newCompleted.length >= 10) {
      newAchievements.add('chess_student');
    }
    if (newCompleted.includes(11)) {
      newAchievements.add('first_mate');
    }

    const updated: UserProfile = {
      ...user,
      xp: newXP,
      chess_level: levelInfo.title.en,
      chess_level_number: levelInfo.level,
      completed_lessons: newCompleted,
      learning_progress: newProgress,
      achievements: Array.from(newAchievements),
    };

    setUser(updated);
    try {
      localStorage.setItem('funnychess_user', JSON.stringify(updated));
    } catch {}
  };

  const isLessonCompleted = (lessonId: number): boolean => {
    return (user?.completed_lessons || []).includes(lessonId);
  };

  // Record game and persist to history
  const recordDetailedGame = (gameRecord: PersistedGameRecord) => {
    if (!user) return;

    // Save to persisted history
    saveGameRecord(gameRecord);

    const isAI = gameRecord.game_type === 'ai';
    const won = gameRecord.result === 'win';
    const lost = gameRecord.result === 'loss';
    const drawn = gameRecord.result === 'draw';

    const newAI = { ...user.ai_games };
    const newFriend = { ...user.friend_games };

    if (isAI) {
      newAI.played += 1;
      if (won) newAI.wins += 1;
      if (lost) newAI.losses += 1;
      if (drawn) newAI.draws += 1;
    } else {
      newFriend.played += 1;
      if (won) newFriend.wins += 1;
      if (lost) newFriend.losses += 1;
      if (drawn) newFriend.draws += 1;
    }

    const totalPlayed = user.games_played + 1;
    const totalWins = won ? user.wins + 1 : user.wins;
    const totalLosses = lost ? user.losses + 1 : user.losses;
    const totalDraws = drawn ? user.draws + 1 : user.draws;

    // Award XP
    let xpGained = won ? 75 : drawn ? 40 : 25;
    if (gameRecord.difficulty === 'hard' && won) xpGained += 50;
    const newXP = user.xp + xpGained;
    const levelInfo = getLevelFromXP(newXP);

    // Achievements
    const newAchievements = new Set(user.achievements);
    newAchievements.add('first_game');
    if (!isAI) newAchievements.add('first_friend');
    if (won) {
      newAchievements.add('first_mate');
      if (gameRecord.difficulty === 'easy') newAchievements.add('beat_easy');
      if (gameRecord.difficulty === 'intermediate') newAchievements.add('beat_inter');
      if (gameRecord.difficulty === 'hard') newAchievements.add('beat_hard');
    }

    const updated: UserProfile = {
      ...user,
      xp: newXP,
      chess_level: levelInfo.title.en,
      chess_level_number: levelInfo.level,
      games_played: totalPlayed,
      wins: totalWins,
      losses: totalLosses,
      draws: totalDraws,
      ai_games: newAI,
      friend_games: newFriend,
      achievements: Array.from(newAchievements),
    };

    setUser(updated);
    try {
      localStorage.setItem('funnychess_user', JSON.stringify(updated));
    } catch {}
  };

  const recordGameResult = (result: 'win' | 'loss' | 'draw', difficulty: string) => {
    recordDetailedGame({
      id: 'ai_' + Date.now(),
      game_type: 'ai',
      opponent: difficulty === 'hard' ? 'Lord Checkmate (Hard)' : difficulty === 'intermediate' ? 'Prof. Morphy (Medium)' : 'FunnyBot (Easy)',
      result,
      playerColor: 'white',
      difficulty,
      movesCount: 22,
      moveHistory: ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4', 'Nf6', 'd4', 'exd4', 'O-O'],
      date: new Date().toLocaleDateString(),
    });
  };

  // Update custom avatar URL (from file upload or manual URL)
  const updateAvatar = async (newAvatarUrl: string) => {
    if (!user) return;
    const updated: UserProfile = {
      ...user,
      avatar_url: newAvatarUrl,
    };
    setUser(updated);
    try {
      localStorage.setItem('funnychess_user', JSON.stringify(updated));
    } catch {}

    const supabase = getSupabase();
    if (supabase && !user.isGuest) {
      try {
        await supabase
          .from('profiles')
          .update({
            avatar_url: newAvatarUrl,
            updated_at: new Date().toISOString(),
          })
          .eq('id', user.id);
      } catch {}
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isConfigured: isSupabaseConfigured,
        notification,
        dismissNotification,
        signInWithGoogle,
        signInAsGuest,
        signOut,
        addXP,
        unlockAchievement,
        completeLesson,
        isLessonCompleted,
        recordDetailedGame,
        recordGameResult,
        updateAvatar,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
