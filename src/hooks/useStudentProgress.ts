
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/auth';
import { toast } from 'sonner';
import { useRef, useCallback } from 'react';

// Debounce utility function
const debounce = <T extends (...args: any[]) => void>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

// Retry utility with exponential backoff
const retryWithBackoff = async <T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> => {
  let lastError: Error;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error: any) {
      lastError = error;
      
      // Only retry on conflict errors
      if (error?.code === '23505' && attempt < maxRetries) {
        const delay = baseDelay * Math.pow(2, attempt) + Math.random() * 1000;
        console.log(`🔄 Retrying lesson progress update after ${delay}ms (attempt ${attempt + 1}/${maxRetries + 1})`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      
      throw error;
    }
  }
  
  throw lastError!;
};

export const useUpdateLessonProgress = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const pendingUpdatesRef = useRef<Set<string>>(new Set());

  const updateProgressMutation = useMutation({
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

      const updateKey = `${user.id}-${lessonId}`;
      
      // Check if update is already in progress
      if (pendingUpdatesRef.current.has(updateKey)) {
        console.log('⏳ Update already in progress for lesson:', lessonId);
        return null;
      }

      // Mark update as in progress
      pendingUpdatesRef.current.add(updateKey);

      try {
        console.log('📝 Updating lesson progress:', { 
          userId: user.id, 
          lessonId, 
          completed, 
          watchTimeSeconds,
          timestamp: new Date().toISOString()
        });

        const result = await retryWithBackoff(async () => {
          // Use explicit conflict resolution with ON CONFLICT clause
          const { data, error } = await supabase
            .from('lesson_progress')
            .upsert({
              lesson_id: lessonId,
              user_id: user.id,
              completed: completed ?? false,
              watch_time_seconds: watchTimeSeconds ?? 0,
              completed_at: completed ? new Date().toISOString() : null,
              last_watched_at: new Date().toISOString(),
            }, {
              onConflict: 'user_id,lesson_id',
              ignoreDuplicates: false
            })
            .select()
            .single();

          if (error) {
            console.error('❌ Error updating lesson progress:', error);
            throw error;
          }

          return data;
        });

        console.log('✅ Lesson progress updated successfully:', result);
        
        // Show toast when lesson is completed
        if (completed) {
          toast.success("Aula concluída!", {
            description: "Parabéns! Você completou esta aula.",
          });
        }

        return result;
      } finally {
        // Always remove the update key from pending set
        pendingUpdatesRef.current.delete(updateKey);
      }
    },
    onSuccess: (data) => {
      if (data) {
        queryClient.invalidateQueries({ queryKey: ['student-courses'] });
        queryClient.invalidateQueries({ queryKey: ['student-course'] });
      }
    },
    onError: (error: any) => {
      console.error('❌ Progress update error:', error);
      
      // Don't show error toast for duplicate key violations (they're expected during conflicts)
      if (error?.code !== '23505') {
        toast.error("Erro ao atualizar progresso", {
          description: "Não foi possível atualizar o progresso da aula.",
        });
      }
    },
  });

  return updateProgressMutation;
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

  return useMutation({
    mutationFn: async (courseId: string) => {
      if (!user) throw new Error('User not authenticated');

      console.log('🎓 Enrolling in course:', courseId);

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
        console.error('❌ Error enrolling in course:', error);
        throw error;
      }

      console.log('✅ Successfully enrolled in course:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['student-courses'] });
      toast.success("Inscrição realizada!", {
        description: "Você foi inscrito no curso com sucesso.",
      });
    },
    onError: (error) => {
      console.error('❌ Enrollment error:', error);
      toast.error("Erro na inscrição", {
        description: "Não foi possível realizar a inscrição no curso.",
      });
    },
  });
};

// Hook for debounced progress updates
export const useDebouncedLessonProgress = () => {
  const updateProgress = useUpdateLessonProgress();
  
  const debouncedUpdate = useCallback(
    debounce((params: Parameters<typeof updateProgress.mutate>[0]) => {
      updateProgress.mutate(params);
    }, 2000), // 2 second debounce
    [updateProgress]
  );

  return {
    ...updateProgress,
    debouncedMutate: debouncedUpdate
  };
};
