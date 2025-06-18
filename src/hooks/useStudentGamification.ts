
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useStudentPoints = () => {
  return useQuery({
    queryKey: ['student-points'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('student_points')
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
  });
};

export const useStudentAchievements = () => {
  return useQuery({
    queryKey: ['student-achievements'],
    queryFn: async () => {
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
        `);

      if (error) throw error;
      return data;
    },
  });
};

export const useAvailableAchievements = () => {
  return useQuery({
    queryKey: ['available-achievements'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('achievements')
        .select('*')
        .eq('is_active', true)
        .order('points_required', { ascending: true });

      if (error) throw error;
      return data;
    },
  });
};

export const usePointsHistory = () => {
  return useQuery({
    queryKey: ['points-history'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('points_history')
        .select('*')
        .order('earned_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data;
    },
  });
};
