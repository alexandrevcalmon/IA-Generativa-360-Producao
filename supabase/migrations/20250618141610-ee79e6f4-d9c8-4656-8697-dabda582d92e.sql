
-- First drop any existing policies that might conflict
DROP POLICY IF EXISTS "Producers can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Producers can view profiles" ON public.profiles;

-- Create a security definer function to check user role without recursion
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS character varying
LANGUAGE sql
STABLE SECURITY DEFINER
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

-- Create a helper function to check if current user is a producer
CREATE OR REPLACE FUNCTION public.is_current_user_producer()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
AS $$
  SELECT COALESCE((SELECT role = 'producer' FROM public.profiles WHERE id = auth.uid()), false);
$$;

-- Recreate the producer policy using the security definer function
CREATE POLICY "Producers can view all profiles" ON public.profiles
FOR SELECT USING (public.is_current_user_producer());
