-- ==============================================================================
-- FUNNYCHESS DATABASE SCHEMA (PostgreSQL / Supabase)
-- Free-Tier Compatible with Row Level Security (RLS)
-- ==============================================================================

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL DEFAULT 'Funny Chess Novice',
  email TEXT,
  avatar_url TEXT,
  preferred_language TEXT NOT NULL DEFAULT 'en',
  preferred_voice_language TEXT NOT NULL DEFAULT 'en',
  chess_level TEXT NOT NULL DEFAULT 'Beginner I',
  games_played INTEGER NOT NULL DEFAULT 0,
  wins INTEGER NOT NULL DEFAULT 0,
  losses INTEGER NOT NULL DEFAULT 0,
  draws INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone."
  ON public.profiles FOR SELECT
  USING ( true );

CREATE POLICY "Users can insert their own profile."
  ON public.profiles FOR INSERT
  WITH CHECK ( auth.uid() = id );

CREATE POLICY "Users can update their own profile."
  ON public.profiles FOR UPDATE
  USING ( auth.uid() = id );

-- Auto create profile on auth signup trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, avatar_url, preferred_language, preferred_voice_language)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', 'Funny Chess Player'),
    new.email,
    COALESCE(new.raw_user_meta_data->>'avatar_url', new.raw_user_meta_data->>'picture', new.raw_user_meta_data->>'photoURL', new.raw_user_meta_data->>'image', ''),
    'en',
    'en'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 2. Games Table (Supports AI and Multiplayer)
CREATE TABLE IF NOT EXISTS public.games (
  id TEXT PRIMARY KEY, -- Friendly alphanumeric ID e.g. "FC-K9M2P4"
  game_type TEXT NOT NULL DEFAULT 'friend' CHECK (game_type IN ('ai', 'friend')),
  player_white UUID REFERENCES auth.users(id) ON DELETE SET NULL DEFAULT NULL,
  player_black UUID REFERENCES auth.users(id) ON DELETE SET NULL DEFAULT NULL,
  player_white_name TEXT DEFAULT 'Player White',
  player_black_name TEXT DEFAULT 'Player Black',
  difficulty TEXT CHECK (difficulty IN ('easy', 'intermediate', 'hard')),
  status TEXT NOT NULL DEFAULT 'waiting' CHECK (status IN ('waiting', 'active', 'completed', 'checkmate', 'stalemate', 'draw', 'resigned', 'abandoned')),
  current_fen TEXT NOT NULL DEFAULT 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
  move_history JSONB NOT NULL DEFAULT '[]'::jsonb,
  last_move JSONB DEFAULT NULL,
  winner TEXT DEFAULT NULL, -- 'white', 'black', 'draw'
  draw_offer TEXT DEFAULT NULL CHECK (draw_offer IN ('white', 'black', NULL)),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.games REPLICA IDENTITY FULL;
ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view joinable or participating games."
  ON public.games FOR SELECT
  TO authenticated
  USING (
    status = 'waiting'
    OR auth.uid() = player_white
    OR auth.uid() = player_black
  );

CREATE POLICY "Authenticated users can create waiting games."
  ON public.games FOR INSERT
  TO authenticated
  WITH CHECK (
    status = 'waiting'
    AND (
      (player_white = auth.uid() AND player_black IS NULL)
      OR
      (player_black = auth.uid() AND player_white IS NULL)
    )
  );

CREATE POLICY "Authenticated users can join waiting games."
  ON public.games FOR UPDATE
  TO authenticated
  USING (
    status = 'waiting'
    AND (player_white IS NULL OR player_black IS NULL)
    AND auth.uid() != COALESCE(player_white, player_black)
  )
  WITH CHECK (
    status IN ('waiting', 'active')
    AND (auth.uid() = player_white OR auth.uid() = player_black)
  );

CREATE POLICY "Participants can update active or waiting games."
  ON public.games FOR UPDATE
  TO authenticated
  USING (
    status IN ('waiting', 'active')
    AND (auth.uid() = player_white OR auth.uid() = player_black)
  )
  WITH CHECK (
    status IN ('waiting', 'active', 'completed', 'checkmate', 'stalemate', 'draw', 'resigned', 'abandoned')
    AND (auth.uid() = player_white OR auth.uid() = player_black)
  );

-- Enable Realtime publication for public.games
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'games'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.games;
  END IF;
END $$;

-- 3. Learning Progress Table
CREATE TABLE IF NOT EXISTS public.learning_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  lesson_id INTEGER NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT false,
  progress INTEGER NOT NULL DEFAULT 0, -- 0 to 100 percentage
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, lesson_id)
);

ALTER TABLE public.learning_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own learning progress."
  ON public.learning_progress FOR SELECT
  USING ( auth.uid() = user_id );

CREATE POLICY "Users can insert/update their own learning progress."
  ON public.learning_progress FOR ALL
  USING ( auth.uid() = user_id );

-- 4. Achievements Table
CREATE TABLE IF NOT EXISTS public.achievements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  achievement_id TEXT NOT NULL,
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, achievement_id)
);

ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Achievements are viewable by anyone."
  ON public.achievements FOR SELECT
  USING ( true );

CREATE POLICY "Users can unlock their own achievements."
  ON public.achievements FOR INSERT
  WITH CHECK ( auth.uid() = user_id );
