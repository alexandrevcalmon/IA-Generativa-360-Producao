
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useToggleTopicLike = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ topicId, isLiked }: { topicId: string; isLiked: boolean }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      if (isLiked) {
        // Remove like
        const { error } = await supabase
          .from('community_topic_likes')
          .delete()
          .eq('topic_id', topicId)
          .eq('user_id', user.id);

        if (error) throw error;
      } else {
        // Add like
        const { error } = await supabase
          .from('community_topic_likes')
          .insert({
            topic_id: topicId,
            user_id: user.id,
          });

        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['community-topics'] });
      queryClient.invalidateQueries({ queryKey: ['topic-likes'] });
    },
    onError: (error) => {
      console.error('Error toggling topic like:', error);
      toast.error('Erro ao curtir tópico');
    },
  });
};

export const useGetTopicLikes = (topicId: string) => {
  return useQuery({
    queryKey: ['topic-likes', topicId],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('community_topic_likes')
        .select('*')
        .eq('topic_id', topicId);

      if (error) throw error;

      const isLiked = user ? data.some(like => like.user_id === user.id) : false;
      
      return {
        likes: data,
        isLiked,
        likesCount: data.length
      };
    },
    enabled: !!topicId,
  });
};
