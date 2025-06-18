
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/auth';
import { toast } from 'sonner';
import { useRef } from 'react';
import { retryWithBackoff } from './utils';
import { UpdateProgressParams, ProgressUpdateResult } from './types';

export const useUpdateLessonProgress = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const pendingUpdatesRef = useRef<Set<string>>(new Set());
  const lastUpdateTimeRef = useRef<Map<string, number>>(new Map());

  const updateProgressMutation = useMutation({
    mutationFn: async ({ 
      lessonId, 
      completed, 
      watchTimeSeconds 
    }: UpdateProgressParams): Promise<ProgressUpdateResult | null> => {
      if (!user) throw new Error('User not authenticated');

      const updateKey = `${user.id}-${lessonId}`;
      const currentTime = Date.now();
      
      // Check if update is already in progress
      if (pendingUpdatesRef.current.has(updateKey)) {
        console.log('⏳ Update already in progress for lesson:', lessonId);
        return null;
      }

      // Throttle updates to prevent rapid fire (minimum 1 second between updates)
      const lastUpdateTime = lastUpdateTimeRef.current.get(updateKey) || 0;
      const timeSinceLastUpdate = currentTime - lastUpdateTime;
      if (timeSinceLastUpdate < 1000) {
        console.log('🚫 Throttling update for lesson:', lessonId, 'time since last:', timeSinceLastUpdate);
        return null;
      }

      // Mark update as in progress
      pendingUpdatesRef.current.add(updateKey);
      lastUpdateTimeRef.current.set(updateKey, currentTime);

      try {
        console.log('📝 Updating lesson progress:', { 
          userId: user.id, 
          lessonId, 
          completed, 
          watchTimeSeconds,
          timestamp: new Date().toISOString()
        });

        const result = await retryWithBackoff(async () => {
          // First, try to get existing progress to understand current state
          const { data: existingProgress } = await supabase
            .from('lesson_progress')
            .select('*')
            .eq('lesson_id', lessonId)
            .eq('user_id', user.id) // Using auth user ID directly
            .maybeSingle();

          console.log('📊 Existing progress:', existingProgress);

          // Prepare update data with smart merging
          const updateData = {
            lesson_id: lessonId,
            user_id: user.id, // Using auth user ID directly - this now references auth.users
            completed: completed ?? existingProgress?.completed ?? false,
            watch_time_seconds: Math.max(
              watchTimeSeconds ?? 0, 
              existingProgress?.watch_time_seconds ?? 0
            ), // Always keep the highest watch time
            completed_at: completed ? new Date().toISOString() : existingProgress?.completed_at,
            last_watched_at: new Date().toISOString(),
          };

          console.log('💾 Upserting progress data:', updateData);

          // Use upsert with proper conflict resolution
          const { data, error } = await supabase
            .from('lesson_progress')
            .upsert(updateData, {
              onConflict: 'user_id,lesson_id',
              ignoreDuplicates: false
            })
            .select()
            .single();

          if (error) {
            console.error('❌ Error updating lesson progress:', error);
            throw error;
          }

          console.log('✅ Progress update successful:', data);
          return data;
        });

        // Show toast when lesson is completed
        if (completed && result) {
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
        // Invalidate relevant queries to refresh UI
        queryClient.invalidateQueries({ queryKey: ['student-courses'] });
        queryClient.invalidateQueries({ queryKey: ['student-course'] });
        queryClient.invalidateQueries({ queryKey: ['student-points'] });
        queryClient.invalidateQueries({ queryKey: ['points-history'] });
        
        console.log('🔄 Invalidated relevant queries after progress update');
      }
    },
    onError: (error: any) => {
      console.error('❌ Progress update error:', error);
      
      // Show user-friendly error messages
      if (error?.code === '42501') {
        toast.error("Erro de permissão", {
          description: "Você não tem permissão para atualizar o progresso desta aula.",
        });
      } else if (error?.code !== '23505' && error?.status !== 409) {
        toast.error("Erro ao atualizar progresso", {
          description: "Não foi possível atualizar o progresso da aula. Tente novamente.",
        });
      } else {
        console.log('🔄 Conflict error suppressed (expected during high concurrency)');
      }
    },
  });

  return updateProgressMutation;
};
