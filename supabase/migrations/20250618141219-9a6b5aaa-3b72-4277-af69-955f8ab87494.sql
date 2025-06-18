
-- First, let's ensure the trigger function exists and is properly configured
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, role)
  VALUES (NEW.id, 'student');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop the trigger if it exists and recreate it
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create a profile for the existing producer user
-- Replace 'admin-produtor@calmonacademy.com' with the actual email if different
INSERT INTO public.profiles (id, role)
SELECT 
  id, 
  'producer'::character varying
FROM auth.users 
WHERE email = 'admin-produtor@calmonacademy.com'
ON CONFLICT (id) DO UPDATE SET 
  role = 'producer',
  updated_at = now();

-- Also ensure we have a function to check profile consistency
CREATE OR REPLACE FUNCTION public.ensure_user_profile_consistency()
RETURNS TABLE(user_id uuid, email text, action_taken text)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    WITH missing_profiles AS (
        INSERT INTO public.profiles (id, role, created_at, updated_at)
        SELECT 
            au.id,
            CASE 
                WHEN au.email LIKE '%admin-produtor%' OR au.email LIKE '%producer%' THEN 'producer'::character varying
                WHEN au.email LIKE '%admin-empresa%' OR au.email LIKE '%company%' THEN 'company'::character varying
                ELSE 'student'::character varying
            END,
            now(),
            now()
        FROM auth.users au
        LEFT JOIN public.profiles p ON au.id = p.id
        WHERE p.id IS NULL
        ON CONFLICT (id) DO NOTHING
        RETURNING id
    )
    SELECT 
        au.id,
        au.email::text,
        CASE 
            WHEN mp.id IS NOT NULL THEN 'Created missing profile'::text
            ELSE 'Profile already exists'::text
        END as action_taken
    FROM auth.users au
    LEFT JOIN missing_profiles mp ON au.id = mp.id;
END;
$$;

-- Run the consistency check to create any missing profiles
SELECT * FROM public.ensure_user_profile_consistency();
