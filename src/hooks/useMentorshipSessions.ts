
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
        .order('scheduled_at', { ascending: true });

      if (error) throw error;
      return data as MentorshipSession[];
    },
  });
};

export const useCreateMentorshipSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (sessionData: Partial<MentorshipSession>) => {
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
