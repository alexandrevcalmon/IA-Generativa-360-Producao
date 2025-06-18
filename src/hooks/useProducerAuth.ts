
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

      // Direct query to avoid RLS recursion issues
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('[useProducerAuth] Error checking producer auth:', error);
        // If there's an error, assume not a producer
        return {
          isProducer: false,
          role: 'student'
        };
      }

      console.log('[useProducerAuth] User role result:', data?.role);

      return {
        isProducer: data?.role === 'producer',
        role: data?.role || 'student'
      };
    },
    enabled: !!user,
  });
};
