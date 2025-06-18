
import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useProducerAuth = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['producer-auth', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('No user found');

      console.log('Checking producer auth for user:', user.id);

      try {
        // Direct profile query with the new simplified RLS policies
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .maybeSingle();

        if (profileError) {
          console.error('Error checking producer auth:', profileError);
          // Return false as safe default
          return {
            isProducer: false,
            role: 'student'
          };
        }

        if (!profile) {
          console.log('No profile found, may need to be created');
          // Return false as safe default when no profile exists
          return {
            isProducer: false,
            role: 'student'
          };
        }

        const isProducerFromProfile = profile.role === 'producer';
        console.log('Got producer status from profile:', isProducerFromProfile);
        
        return {
          isProducer: isProducerFromProfile,
          role: profile.role || 'student'
        };
      } catch (error) {
        console.error('Error in useProducerAuth:', error);
        return {
          isProducer: false,
          role: 'student'
        };
      }
    },
    enabled: !!user,
    retry: 1,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
};
