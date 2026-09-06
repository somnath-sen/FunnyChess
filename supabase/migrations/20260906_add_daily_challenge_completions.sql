-- ==============================================================================
-- FUNNYCHESS MIGRATION: Daily Challenge Completions Table
-- Safe, idempotent migration for daily chess challenge completion & XP tracking
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.daily_challenge_completions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  challenge_date DATE NOT NULL,
  puzzle_id TEXT NOT NULL,
  xp_awarded INTEGER NOT NULL DEFAULT 25,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  CONSTRAINT unique_user_daily_challenge UNIQUE(user_id, challenge_date)
);

-- Enable Row Level Security
ALTER TABLE public.daily_challenge_completions ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own completions
DROP POLICY IF EXISTS "Users can view their own daily challenge completions." ON public.daily_challenge_completions;
CREATE POLICY "Users can view their own daily challenge completions."
  ON public.daily_challenge_completions FOR SELECT
  USING ( auth.uid() = user_id );

-- Policy: Authenticated users can record their daily challenge completion
DROP POLICY IF EXISTS "Users can insert their own daily challenge completion." ON public.daily_challenge_completions;
CREATE POLICY "Users can insert their own daily challenge completion."
  ON public.daily_challenge_completions FOR INSERT
  WITH CHECK ( auth.uid() = user_id );

-- Index for fast lookup by user and date
CREATE INDEX IF NOT EXISTS idx_daily_challenge_completions_user_date 
  ON public.daily_challenge_completions (user_id, challenge_date);
