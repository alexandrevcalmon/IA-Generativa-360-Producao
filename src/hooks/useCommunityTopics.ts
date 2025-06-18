
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface CommunityTopic {
  id: string;
  title: string;
  content: string;
  author_id: string;
  author_name: string;
  author_email: string;
  company_name?: string;
  category: string;
  is_pinned: boolean;
  is_locked: boolean;
  likes_count: number;
  replies_count: number;
  views_count: number;
  tags?: string[];
  created_at: string;
  updated_at: string;
}

export interface CommunityReply {
  id: string;
  topic_id: string;
  content: string;
  author_id: string;
  author_name: string;
  author_email: string;
  company_name?: string;
  likes_count: number;
  is_solution: boolean;
  created_at: string;
  updated_at: string;
}

export const useCommunityTopics = () => {
  return useQuery({
    queryKey: ['community-topics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('community_topics')
        .select('*')
        .order('is_pinned', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching community topics:', error);
        throw error;
      }
      return data as CommunityTopic[];
    },
  });
};

export const useCreateCommunityTopic = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (topicData: Omit<CommunityTopic, 'id' | 'created_at' | 'updated_at' | 'likes_count' | 'replies_count' | 'views_count'>) => {
      const { data, error } = await supabase
        .from('community_topics')
        .insert(topicData)
        .select()
        .single();

      if (error) {
        console.error('Error creating community topic:', error);
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['community-topics'] });
      toast.success('Tópico criado com sucesso!');
    },
    onError: (error) => {
      console.error('Error creating community topic:', error);
      toast.error('Erro ao criar tópico');
    },
  });
};

export const useUpdateCommunityTopic = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<CommunityTopic> }) => {
      const { data, error } = await supabase
        .from('community_topics')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating community topic:', error);
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['community-topics'] });
      toast.success('Tópico atualizado com sucesso!');
    },
    onError: (error) => {
      console.error('Error updating community topic:', error);
      toast.error('Erro ao atualizar tópico');
    },
  });
};

export const useDeleteCommunityTopic = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (topicId: string) => {
      const { error } = await supabase
        .from('community_topics')
        .delete()
        .eq('id', topicId);

      if (error) {
        console.error('Error deleting community topic:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['community-topics'] });
      toast.success('Tópico deletado com sucesso!');
    },
    onError: (error) => {
      console.error('Error deleting community topic:', error);
      toast.error('Erro ao deletar tópico');
    },
  });
};

export const useToggleTopicPin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ topicId, isPinned }: { topicId: string; isPinned: boolean }) => {
      const { data, error } = await supabase
        .from('community_topics')
        .update({ is_pinned: isPinned })
        .eq('id', topicId)
        .select()
        .single();

      if (error) {
        console.error('Error toggling topic pin:', error);
        throw error;
      }
      return data;
    },
    onSuccess: (_, { isPinned }) => {
      queryClient.invalidateQueries({ queryKey: ['community-topics'] });
      toast.success(isPinned ? 'Tópico fixado com sucesso!' : 'Tópico desfixado com sucesso!');
    },
    onError: (error) => {
      console.error('Error toggling topic pin:', error);
      toast.error('Erro ao modificar tópico');
    },
  });
};

export const useToggleTopicLock = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ topicId, isLocked }: { topicId: string; isLocked: boolean }) => {
      const { data, error } = await supabase
        .from('community_topics')
        .update({ is_locked: isLocked })
        .eq('id', topicId)
        .select()
        .single();

      if (error) {
        console.error('Error toggling topic lock:', error);
        throw error;
      }
      return data;
    },
    onSuccess: (_, { isLocked }) => {
      queryClient.invalidateQueries({ queryKey: ['community-topics'] });
      toast.success(isLocked ? 'Tópico bloqueado com sucesso!' : 'Tópico desbloqueado com sucesso!');
    },
    onError: (error) => {
      console.error('Error toggling topic lock:', error);
      toast.error('Erro ao modificar tópico');
    },
  });
};
