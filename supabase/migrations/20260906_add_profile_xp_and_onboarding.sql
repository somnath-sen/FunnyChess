-- Migration: Add XP and Onboarding tracking to profiles
-- Date: 2026-09-06
-- Description: Ensures public.profiles stores authoritative XP, starting level (Level 2: 250 XP),
-- and tracks first-time onboarding without disrupting existing users.

-- 1. Add xp column to profiles if it doesn't already exist (default 250 for Level 2 Piece Explorer)
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS xp INTEGER NOT NULL DEFAULT 250;

-- 2. Add is_first_login to profiles (defaults to false for existing users so they are not treated as new)
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS is_first_login BOOLEAN NOT NULL DEFAULT false;

-- 3. Update any existing rows that might have NULL xp to default 250
UPDATE public.profiles 
SET xp = 250 
WHERE xp IS NULL;

-- 4. Update the handle_new_user trigger function to populate xp and is_first_login
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = public, pg_temp
AS $$
BEGIN
  INSERT INTO public.profiles (
    id, 
    name, 
    email, 
    avatar_url, 
    preferred_language, 
    preferred_voice_language,
    chess_level,
    xp,
    games_played,
    wins,
    losses,
    draws,
    is_first_login
  )
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', 'Funny Chess Player'),
    new.email,
    COALESCE(new.raw_user_meta_data->>'avatar_url', new.raw_user_meta_data->>'picture', new.raw_user_meta_data->>'photoURL', new.raw_user_meta_data->>'image', ''),
    'en',
    'en',
    'Piece Explorer',
    250,
    0,
    0,
    0,
    0,
    true
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;
