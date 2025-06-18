
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/auth';

export const useStudentPoints = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['student-points', user?.id],
    queryFn: async () => {
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

export const useStudentAchievements = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['student-achievements', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');

      console.log('🏆 Fetching student achievements for user:', user.id);

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
        console.log('⚠️ No student record found for achievements');
        return [];
      }

      const { data, error } = await supabase
        .from('student_achievements')
        .select(`
          *,
          achievements:achievement_id (
            id,
            name,
            description,
            icon,
            badge_color,
            type,
            points_required
          )
        `)
        .eq('student_id', studentRecord.id);

      if (error) {
        console.error('❌ Error fetching achievements:', error);
        throw error;
      }

      console.log('✅ Successfully fetched achievements');
      return data || [];
    },
    enabled: !!user,
  });
};

export const useAvailableAchievements = () => {
  return useQuery({
    queryKey: ['available-achievements'],
    queryFn: async () => {
      console.log('📜 Fetching available achievements');

      const { data, error } = await supabase
        .from('achievements')
        .select('*')
        .eq('is_active', true)
        .order('points_required', { ascending: true });

      if (error) {
        console.error('❌ Error fetching available achievements:', error);
        throw error;
      }

      console.log('✅ Successfully fetched available achievements');
      return data || [];
    },
  });
};

export const usePointsHistory = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['points-history', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');

      console.log('📈 Fetching points history for user:', user.id);

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
        console.log('⚠️ No student record found for points history');
        return [];
      }

      const { data, error } = await supabase
        .from('points_history')
        .select('*')
        .eq('student_id', studentRecord.id)
        .order('earned_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('❌ Error fetching points history:', error);
        throw error;
      }

      console.log('✅ Successfully fetched points history');
      return data || [];
    },
    enabled: !!user,
  });
};
