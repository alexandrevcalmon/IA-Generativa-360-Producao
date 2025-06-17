
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export const useEnrollInCourse = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (courseId: string) => {
      if (!user) throw new Error('User not authenticated');

      console.log('Enrolling user in course:', courseId);

      // Check if already enrolled
      const { data: existingEnrollment } = await supabase
        .from('enrollments')
        .select('id')
        .eq('course_id', courseId)
        .eq('user_id', user.id)
        .single();

      if (existingEnrollment) {
        console.log('User already enrolled');
        return existingEnrollment;
      }

      // Create enrollment
      const { data, error } = await supabase
        .from('enrollments')
        .insert({
          course_id: courseId,
          user_id: user.id,
          progress_percentage: 0,
        })
        .select()
        .single();

      if (error) throw error;

      console.log('Enrollment created:', data);
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

export const useUpdateLessonProgress = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

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

      console.log('Updating lesson progress:', { lessonId, completed, watchTimeSeconds });

      // Upsert lesson progress
      const { data, error } = await supabase
        .from('lesson_progress')
        .upsert({
          lesson_id: lessonId,
          user_id: user.id,
          completed: completed ?? false,
          watch_time_seconds: watchTimeSeconds ?? 0,
          completed_at: completed ? new Date().toISOString() : null,
          last_watched_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      console.log('Lesson progress updated:', data);
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
