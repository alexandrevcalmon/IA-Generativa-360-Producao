
import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useProducerAuth = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['producer-auth', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('No user found');

      console.log('[useProducerAuth] Checking producer auth for user:', user.id);

      // Use the safe function to avoid RLS recursion
      const { data, error } = await supabase
        .rpc('get_user_role_safe', { user_id: user.id });

      if (error) {
        console.error('[useProducerAuth] Error checking producer auth:', error);
        throw error;
      }

      console.log('[useProducerAuth] User role result:', data);

      return {
        isProducer: data === 'producer',
        role: data
      };
    },
    enabled: !!user,
  });
};
