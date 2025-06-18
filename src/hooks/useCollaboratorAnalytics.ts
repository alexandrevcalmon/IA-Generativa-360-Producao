
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface CollaboratorStats {
  id: string;
  collaborator_id: string;
  company_id: string;
  last_login_at: string | null;
  total_login_count: number;
  total_watch_time_minutes: number;
  lessons_completed: number;
  lessons_started: number;
  courses_enrolled: number;
  courses_completed: number;
  quiz_attempts: number;
  quiz_passed: number;
  average_quiz_score: number;
  streak_days: number;
  total_points: number;
  current_level: number;
  created_at: string;
  updated_at: string;
  collaborator: {
    id: string;
    name: string;
    email: string;
    position: string | null;
    is_active: boolean;
    phone: string | null;
  };
}

export const useCollaboratorAnalytics = () => {
  return useQuery({
    queryKey: ['collaborator-analytics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('collaborator_activity_stats')
        .select(`
          *,
          collaborator:collaborator_id (
            id,
            name,
            email,
            position,
            is_active,
            phone
          )
        `)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      return data as CollaboratorStats[];
    },
  });
};

export const useCollaboratorActivityLogs = (collaboratorId?: string) => {
  return useQuery({
    queryKey: ['collaborator-activity-logs', collaboratorId],
    queryFn: async () => {
      let query = supabase
        .from('collaborator_activity_logs')
        .select(`
          *,
          collaborator:collaborator_id (
            name,
            email
          )
        `)
        .order('created_at', { ascending: false })
        .limit(100);

      if (collaboratorId) {
        query = query.eq('collaborator_id', collaboratorId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    enabled: true,
  });
};
