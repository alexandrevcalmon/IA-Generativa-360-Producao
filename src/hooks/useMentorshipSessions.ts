
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useMentorshipSessions = () => {
  return useQuery({
    queryKey: ['mentorship-sessions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('mentorship_sessions')
        .select('*')
        .order('scheduled_at', { ascending: true });

      if (error) throw error;
      return data;
    },
  });
};

export const useRegisterForMentorship = () => {
  const registerForMentorship = async (sessionId: string) => {
    // First get the current student ID
    const { data: studentData, error: studentError } = await supabase
      .from('company_users')
      .select('id')
      .eq('auth_user_id', (await supabase.auth.getUser()).data.user?.id)
      .single();

    if (studentError) throw studentError;

    const { error } = await supabase
      .from('mentorship_attendees')
      .insert({
        mentorship_session_id: sessionId,
        student_id: studentData.id,
      });

    if (error) throw error;
  };

  return { registerForMentorship };
};
