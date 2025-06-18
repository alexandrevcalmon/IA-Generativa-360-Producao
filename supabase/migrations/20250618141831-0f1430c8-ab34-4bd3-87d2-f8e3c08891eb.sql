
-- Enable RLS for the profiles table, if not already enabled.
-- This is safe to run even if it's already enabled.
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop any existing conflicting policies first
DROP POLICY IF EXISTS "Users can create their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Producers can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Producers can view profiles" ON public.profiles;
DROP POLICY IF EXISTS "Authenticated users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Authenticated users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;

-- Policy: Authenticated users can view their own profiles.
CREATE POLICY "Authenticated users can view their own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Policy: Authenticated users can update their own profiles.
CREATE POLICY "Authenticated users can update their own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Policy: Users can insert their own profile.
CREATE POLICY "Users can insert their own profile"
  ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);
