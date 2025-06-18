
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/auth';
import type { StudentPoints } from './types';

export const useStudentPoints = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['student-points', user?.id],
    queryFn: async (): Promise<StudentPoints | null> => {
      if (!user) throw new Error('User not authenticated');

      console.log('🎯 Fetching student points for user:', user.id);

      // Get the student record from company_users first
      const { data: studentRecord, error: studentError } = await supabase
        .from('company_users')
        .select('id')
        .eq('auth_user_id', user.id)
        .maybeSingle();

      if (studentError) {
        console.error('❌ Error fetching student record:', studentError);
        throw studentError;
      }

      if (!studentRecord) {
        console.log('⚠️ No student record found for user');
        return null;
      }

      console.log('📝 Found student record:', studentRecord.id);

      // Now get the points data
      const { data: pointsData, error: pointsError } = await supabase
        .from('student_points')
        .select('*')
        .eq('student_id', studentRecord.id)
        .maybeSingle();

      if (pointsError) {
        console.error('❌ Error fetching student points:', pointsError);
        throw pointsError;
      }

      if (!pointsData) {
        console.log('🔄 No points data found, initializing...');
        // Initialize gamification data using our new function
        const { error: initError } = await supabase.rpc('initialize_student_gamification', {
          user_auth_id: user.id
        });

        if (initError) {
          console.error('❌ Error initializing gamification:', initError);
          throw initError;
        }

        // Fetch again after initialization
        const { data: newPointsData, error: newPointsError } = await supabase
          .from('student_points')
          .select('*')
          .eq('student_id', studentRecord.id)
          .single();

        if (newPointsError) {
          console.error('❌ Error fetching newly created points:', newPointsError);
          throw newPointsError;
        }

        console.log('✅ Successfully initialized and fetched points data');
        return newPointsData;
      }

      console.log('✅ Successfully fetched existing points data');
      return pointsData;
    },
    enabled: !!user,
  });
};
