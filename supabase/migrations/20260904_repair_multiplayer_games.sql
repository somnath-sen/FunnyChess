-- ==============================================================================
-- FUNNYCHESS: Authenticated Multiplayer Games Table, Constraints, & Strict RLS
-- Migration: 20260904_repair_multiplayer_games.sql
-- ==============================================================================

-- 1. Create public.games table if it does not already exist
CREATE TABLE IF NOT EXISTS public.games (
  id TEXT PRIMARY KEY,
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
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  CONSTRAINT check_different_players CHECK (
    player_white IS NULL 
    OR player_black IS NULL 
    OR player_white != player_black
  ),
  CONSTRAINT check_active_players CHECK (
    status != 'active' 
    OR (player_white IS NOT NULL AND player_black IS NOT NULL AND player_white != player_black)
  )
);

-- 2. Safely ensure UUID column types, constraints, and foreign keys if table already existed
DO $$
BEGIN
  -- Migrate player_white to UUID if needed
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'games' AND column_name = 'player_white' AND data_type != 'uuid'
  ) THEN
    ALTER TABLE public.games DROP CONSTRAINT IF EXISTS games_player_white_fkey;
    ALTER TABLE public.games ALTER COLUMN player_white TYPE UUID USING (
      CASE WHEN player_white ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' 
           THEN player_white::uuid 
           ELSE NULL 
      END
    );
    ALTER TABLE public.games ADD CONSTRAINT games_player_white_fkey FOREIGN KEY (player_white) REFERENCES auth.users(id) ON DELETE SET NULL;
  END IF;

  -- Migrate player_black to UUID if needed
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'games' AND column_name = 'player_black' AND data_type != 'uuid'
  ) THEN
    ALTER TABLE public.games DROP CONSTRAINT IF EXISTS games_player_black_fkey;
    ALTER TABLE public.games ALTER COLUMN player_black TYPE UUID USING (
      CASE WHEN player_black ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' 
           THEN player_black::uuid 
           ELSE NULL 
      END
    );
    ALTER TABLE public.games ADD CONSTRAINT games_player_black_fkey FOREIGN KEY (player_black) REFERENCES auth.users(id) ON DELETE SET NULL;
  END IF;

  -- Add last_move if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'games' AND column_name = 'last_move'
  ) THEN
    ALTER TABLE public.games ADD COLUMN last_move JSONB DEFAULT NULL;
  END IF;

  -- Add draw_offer if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'games' AND column_name = 'draw_offer'
  ) THEN
    ALTER TABLE public.games ADD COLUMN draw_offer TEXT DEFAULT NULL;
  END IF;

  -- Add check_different_players constraint if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_schema = 'public' AND table_name = 'games' AND constraint_name = 'check_different_players'
  ) THEN
    ALTER TABLE public.games ADD CONSTRAINT check_different_players 
      CHECK (player_white IS NULL OR player_black IS NULL OR player_white != player_black);
  END IF;

  -- Add check_active_players constraint if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_schema = 'public' AND table_name = 'games' AND constraint_name = 'check_active_players'
  ) THEN
    ALTER TABLE public.games ADD CONSTRAINT check_active_players 
      CHECK (status != 'active' OR (player_white IS NOT NULL AND player_black IS NOT NULL AND player_white != player_black));
  END IF;
END $$;

-- 3. Ensure status check constraint includes all supported states
ALTER TABLE public.games DROP CONSTRAINT IF EXISTS games_status_check;
ALTER TABLE public.games ADD CONSTRAINT games_status_check 
  CHECK (status IN ('waiting', 'active', 'completed', 'checkmate', 'stalemate', 'draw', 'resigned', 'abandoned'));

-- 4. Enable Full Replica Identity for Realtime UPDATE broadcast
ALTER TABLE public.games REPLICA IDENTITY FULL;

-- 5. Enable Row Level Security (RLS)
ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;

-- 6. Clean up old or insecure policies
DROP POLICY IF EXISTS "Games are viewable by anyone with the link." ON public.games;
DROP POLICY IF EXISTS "Games are viewable by players or anyone with the link." ON public.games;
DROP POLICY IF EXISTS "Anyone can create a game room." ON public.games;
DROP POLICY IF EXISTS "Authenticated users can create games." ON public.games;
DROP POLICY IF EXISTS "Players can update games they are participating in." ON public.games;
DROP POLICY IF EXISTS "Players can update active or waiting games." ON public.games;
DROP POLICY IF EXISTS "Authenticated users can view games." ON public.games;
DROP POLICY IF EXISTS "Authenticated users can view joinable or participating games." ON public.games;
DROP POLICY IF EXISTS "Authenticated users can create waiting games." ON public.games;
DROP POLICY IF EXISTS "Authenticated users can join waiting games." ON public.games;
DROP POLICY IF EXISTS "Participants can update active or waiting games." ON public.games;

-- 7. Define strict authenticated RLS policies

-- SELECT: Authenticated users can view waiting games (to join) or games they participate in
CREATE POLICY "Authenticated users can view joinable or participating games."
  ON public.games FOR SELECT
  TO authenticated
  USING (
    status = 'waiting'
    OR auth.uid() = player_white
    OR auth.uid() = player_black
  );

-- INSERT: Authenticated users can create waiting games with themselves in one player slot
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

-- UPDATE (Join): An authenticated user can join a waiting game that has an open slot
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
    AND player_white != player_black
  );

-- UPDATE (Moves / Actions): Only the actual participants can update active or waiting games
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

-- 8. Enable Supabase Realtime publication for public.games
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'games'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.games;
  END IF;
END $$;

-- 9. Atomic Join Room RPC function (guarantees race-condition prevention & no self-join)
CREATE OR REPLACE FUNCTION public.join_game_room(
  p_game_id TEXT,
  p_player_name TEXT
)
RETURNS public.games
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id UUID;
  v_game public.games;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required to join game';
  END IF;

  -- Lock row for update to prevent race conditions
  SELECT * INTO v_game
  FROM public.games
  WHERE id = p_game_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Game not found';
  END IF;

  IF v_game.status != 'waiting' THEN
    RAISE EXCEPTION 'Game is not in waiting state';
  END IF;

  -- Prevent joining own game
  IF v_game.player_white = v_user_id OR v_game.player_black = v_user_id THEN
    RAISE EXCEPTION 'You cannot join your own game';
  END IF;

  -- Check open slot
  IF v_game.player_white IS NULL AND v_game.player_black IS NOT NULL THEN
    UPDATE public.games
    SET 
      player_white = v_user_id,
      player_white_name = COALESCE(NULLIF(p_player_name, ''), 'Player White'),
      status = 'active',
      updated_at = timezone('utc'::text, now())
    WHERE id = p_game_id
    RETURNING * INTO v_game;
  ELSIF v_game.player_black IS NULL AND v_game.player_white IS NOT NULL THEN
    UPDATE public.games
    SET 
      player_black = v_user_id,
      player_black_name = COALESCE(NULLIF(p_player_name, ''), 'Player Black'),
      status = 'active',
      updated_at = timezone('utc'::text, now())
    WHERE id = p_game_id
    RETURNING * INTO v_game;
  ELSE
    RAISE EXCEPTION 'Game room is full';
  END IF;

  RETURN v_game;
END;
$$;
