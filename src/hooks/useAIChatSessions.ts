
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface AIChatMessage {
  id: string;
  session_id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  created_at: string;
}

export interface AIChatSession {
  id: string;
  lesson_id: string;
  user_id: string;
  company_id: string;
  ai_configuration_id: string | null;
  session_data: any;
  created_at: string;
  updated_at: string;
}

export const useAIChatSessions = (lessonId?: string) => {
  return useQuery({
    queryKey: ['ai-chat-sessions', lessonId],
    queryFn: async () => {
      let query = supabase
        .from('ai_chat_sessions')
        .select('*')
        .order('created_at', { ascending: false });

      if (lessonId) {
        query = query.eq('lesson_id', lessonId);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      return data as AIChatSession[];
    },
    enabled: !!lessonId,
  });
};

export const useAIChatMessages = (sessionId?: string) => {
  return useQuery({
    queryKey: ['ai-chat-messages', sessionId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ai_chat_messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      return data as AIChatMessage[];
    },
    enabled: !!sessionId,
  });
};

export const useCreateAIChatSession = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ lessonId, companyId, aiConfigurationId }: {
      lessonId: string;
      companyId: string;
      aiConfigurationId?: string;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('ai_chat_sessions')
        .insert({
          lesson_id: lessonId,
          user_id: user.id,
          company_id: companyId,
          ai_configuration_id: aiConfigurationId,
          session_data: {}
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['ai-chat-sessions'] });
      console.log('AI chat session created:', data);
    },
    onError: (error) => {
      console.error('Error creating AI chat session:', error);
      toast.error('Erro ao criar sessão de chat');
    },
  });
};

export const useCreateAIChatMessage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ sessionId, role, content }: {
      sessionId: string;
      role: 'user' | 'assistant' | 'system';
      content: string;
    }) => {
      const { data, error } = await supabase
        .from('ai_chat_messages')
        .insert({
          session_id: sessionId,
          role,
          content
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['ai-chat-messages', data.session_id] });
    },
    onError: (error) => {
      console.error('Error creating AI chat message:', error);
      toast.error('Erro ao enviar mensagem');
    },
  });
};
