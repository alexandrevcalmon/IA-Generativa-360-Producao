
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, FileText } from 'lucide-react';
import { StudentLesson } from '@/hooks/useStudentCourses';
import { useUpdateLessonProgress, useDebouncedLessonProgress } from '@/hooks/useStudentProgress';
import { useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/auth';

interface LessonProgressProps {
  currentLesson: StudentLesson;
  watchTime: number;
  duration: number;
}

export const LessonProgress = ({ currentLesson, watchTime, duration }: LessonProgressProps) => {
  const { user } = useAuth();
  const updateProgress = useUpdateLessonProgress();
  const { debouncedMutate } = useDebouncedLessonProgress();
  
  // Refs to track state and prevent unnecessary updates
  const lastSavedTimeRef = useRef<number>(0);
  const autoCompletedRef = useRef<boolean>(false);
  const lastProgressPercentageRef = useRef<number>(0);
  const saveIntervalRef = useRef<number>(0);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercentage = duration > 0 ? (watchTime / duration) * 100 : 0;

  // Auto-complete lesson when 95% is watched (only once)
  useEffect(() => {
    if (
      currentLesson && 
      user?.id &&
      !currentLesson.completed && 
      !autoCompletedRef.current &&
      duration > 0 && 
      progressPercentage >= 95 &&
      progressPercentage > lastProgressPercentageRef.current
    ) {
      console.log('🎯 Auto-completing lesson at 95% progress');
      autoCompletedRef.current = true;
      
      updateProgress.mutate({
        lessonId: currentLesson.id,
        completed: true,
        watchTimeSeconds: Math.floor(watchTime)
      });
    }
    
    lastProgressPercentageRef.current = progressPercentage;
  }, [currentLesson, progressPercentage, duration, watchTime, updateProgress, user?.id]);

  // Improved periodic save with better timing and conflict prevention
  useEffect(() => {
    if (
      currentLesson && 
      user?.id &&
      watchTime > 0 && 
      !autoCompletedRef.current // Don't save if auto-completion is in progress
    ) {
      const currentSaveInterval = Math.floor(watchTime / 45); // Save every 45 seconds
      
      if (
        currentSaveInterval > saveIntervalRef.current && // New interval reached
        Math.floor(watchTime) !== lastSavedTimeRef.current // Avoid duplicate saves
      ) {
        console.log('💾 Saving lesson progress (debounced) at interval:', currentSaveInterval, 'time:', Math.floor(watchTime));
        lastSavedTimeRef.current = Math.floor(watchTime);
        saveIntervalRef.current = currentSaveInterval;
        
        // Use debounced update to prevent conflicts
        debouncedMutate({
          lessonId: currentLesson.id,
          completed: currentLesson.completed || false,
          watchTimeSeconds: Math.floor(watchTime)
        });
      }
    }
  }, [watchTime, currentLesson, debouncedMutate, user?.id]);

  // Reset all tracking refs when lesson changes
  useEffect(() => {
    console.log('🔄 Lesson changed, resetting tracking refs');
    autoCompletedRef.current = false;
    lastSavedTimeRef.current = 0;
    lastProgressPercentageRef.current = 0;
    saveIntervalRef.current = 0;
  }, [currentLesson?.id]);

  return (
    <>
      {/* Progress Bar */}
      <div className="mb-4 sm:mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">Progresso da Aula</span>
          <span className="text-sm text-gray-600 font-mono">
            {formatTime(watchTime)} / {formatTime(duration)}
          </span>
        </div>
        <Progress value={progressPercentage} className="h-2 sm:h-3" />
        <div className="flex justify-between items-center mt-2">
          <span className="text-xs sm:text-sm text-gray-500">
            {progressPercentage.toFixed(1)}% assistido
          </span>
          {currentLesson.completed && (
            <div className="flex items-center text-green-600 text-xs sm:text-sm">
              <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              Concluída
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        {currentLesson.material_url && (
          <Button variant="outline" asChild className="h-11 touch-manipulation">
            <a href={currentLesson.material_url} download>
              <FileText className="h-4 w-4 mr-2" />
              Material de Apoio
            </a>
          </Button>
        )}
      </div>
    </>
  );
};
