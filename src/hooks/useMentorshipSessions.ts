
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface MentorshipSession {
  id: string;
  producer_id: string;
  title: string;
  description?: string;
  scheduled_at: string;
  duration_minutes: number;
  max_participants?: number;
  google_meet_url?: string;
  google_meet_id?: string;
  status: 'scheduled' | 'live' | 'completed' | 'cancelled';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface MentorshipParticipant {
  id: string;
  session_id: string;
  participant_id: string;
  participant_name: string;
  participant_email: string;
  company_name?: string;
  registered_at: string;
  attended?: boolean;
  joined_at?: string;
  left_at?: string;
}

export const useMentorshipSessions = () => {
  return useQuery({
    queryKey: ['mentorship-sessions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('producer_mentorship_sessions')
        .select('*')
        .eq('is_active', true)
        .order('scheduled_at', { ascending: true });

      if (error) throw error;
      return data as MentorshipSession[];
    },
  });
};

export const useCreateMentorshipSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (sessionData: Omit<MentorshipSession, 'id' | 'producer_id' | 'created_at' | 'updated_at'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('producer_mentorship_sessions')
        .insert({
          ...sessionData,
          producer_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mentorship-sessions'] });
      toast.success('Sessão de mentoria criada com sucesso!');
    },
    onError: (error) => {
      console.error('Error creating mentorship session:', error);
      toast.error('Erro ao criar sessão de mentoria');
    },
  });
};

export const useUpdateMentorshipSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<MentorshipSession> }) => {
      const { data, error } = await supabase
        .from('producer_mentorship_sessions')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mentorship-sessions'] });
      toast.success('Sessão atualizada com sucesso!');
    },
    onError: (error) => {
      console.error('Error updating mentorship session:', error);
      toast.error('Erro ao atualizar sessão');
    },
  });
};

export const useSessionParticipants = (sessionId: string) => {
  return useQuery({
    queryKey: ['session-participants', sessionId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('producer_mentorship_participants')
        .select('*')
        .eq('session_id', sessionId)
        .order('registered_at', { ascending: true });

      if (error) throw error;
      return data as MentorshipParticipant[];
    },
    enabled: !!sessionId,
  });
};

export const useRegisterForMentorship = () => {
  const queryClient = useQueryClient();

  return {
    registerForMentorship: async (sessionId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Get user profile to get name and company info
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (!profile) throw new Error('User profile not found');

      // Get company user info for additional details
      const { data: companyUser } = await supabase
        .from('company_users')
        .select(`
          *,
          companies (
            name
          )
        `)
        .eq('auth_user_id', user.id)
        .single();

      const { data, error } = await supabase
        .from('producer_mentorship_participants')
        .insert({
          session_id: sessionId,
          participant_id: user.id,
          participant_name: companyUser?.name || user.user_metadata?.name || user.email || 'User',
          participant_email: user.email || '',
          company_name: companyUser?.companies?.name || undefined,
        })
        .select()
        .single();

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['session-participants', sessionId] });
      queryClient.invalidateQueries({ queryKey: ['mentorship-sessions'] });
      return data;
    }
  };
};
