
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
        // First try using the security definer function
        const { data: isProducer, error: functionError } = await supabase
          .rpc('is_current_user_producer');

        if (!functionError && isProducer !== null) {
          console.log('Got producer status from function:', isProducer);
          return {
            isProducer,
            role: isProducer ? 'producer' : 'student'
          };
        }

        // Fallback: try direct profile query
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

        const isProducerFromProfile = profile?.role === 'producer';
        console.log('Got producer status from profile:', isProducerFromProfile);
        
        return {
          isProducer: isProducerFromProfile,
          role: profile?.role || 'student'
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
