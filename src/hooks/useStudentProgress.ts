
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export const useUpdateLessonProgress = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ 
      lessonId, 
      completed, 
      watchTimeSeconds 
    }: { 
      lessonId: string; 
      completed?: boolean; 
      watchTimeSeconds?: number; 
    }) => {
      if (!user) throw new Error('User not authenticated');

      console.log('Updating lesson progress:', { 
        userId: user.id, 
        lessonId, 
        completed, 
        watchTimeSeconds 
      });

      // Upsert lesson progress with explicit user_id
      const { data, error } = await supabase
        .from('lesson_progress')
        .upsert({
          lesson_id: lessonId,
          user_id: user.id, // Explicitly set user_id for RLS policy
          completed: completed ?? false,
          watch_time_seconds: watchTimeSeconds ?? 0,
          completed_at: completed ? new Date().toISOString() : null,
          last_watched_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        console.error('Error updating lesson progress:', error);
        throw error;
      }

      console.log('Lesson progress updated successfully:', data);
      
      // Show toast when lesson is completed
      if (completed) {
        toast({
          title: "Aula concluída!",
          description: "Parabéns! Você completou esta aula.",
        });
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['student-courses'] });
      queryClient.invalidateQueries({ queryKey: ['student-course'] });
    },
    onError: (error) => {
      console.error('Progress update error:', error);
    },
  });
};

export const useMarkLessonComplete = () => {
  const updateProgress = useUpdateLessonProgress();
  
  return useMutation({
    mutationFn: async (lessonId: string) => {
      return updateProgress.mutateAsync({ 
        lessonId, 
        completed: true 
      });
    },
  });
};

export const useEnrollInCourse = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (courseId: string) => {
      if (!user) throw new Error('User not authenticated');

      console.log('Enrolling in course:', courseId);

      const { data, error } = await supabase
        .from('enrollments')
        .insert({
          course_id: courseId,
          user_id: user.id,
          enrolled_at: new Date().toISOString(),
          progress_percentage: 0
        })
        .select()
        .single();

      if (error) {
        console.error('Error enrolling in course:', error);
        throw error;
      }

      console.log('Successfully enrolled in course:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['student-courses'] });
      toast({
        title: "Inscrição realizada!",
        description: "Você foi inscrito no curso com sucesso.",
      });
    },
    onError: (error) => {
      console.error('Enrollment error:', error);
      toast({
        title: "Erro na inscrição",
        description: "Não foi possível realizar a inscrição no curso.",
        variant: "destructive",
      });
    },
  });
};
