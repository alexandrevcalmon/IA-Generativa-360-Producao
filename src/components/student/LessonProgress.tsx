
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, FileText } from 'lucide-react';
import { StudentLesson } from '@/hooks/useStudentCourses';
import { useUpdateLessonProgress } from '@/hooks/useStudentProgress';
import { useEffect } from 'react';

interface LessonProgressProps {
  currentLesson: StudentLesson;
  watchTime: number;
  duration: number;
}

export const LessonProgress = ({ currentLesson, watchTime, duration }: LessonProgressProps) => {
  const updateProgress = useUpdateLessonProgress();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercentage = duration > 0 ? (watchTime / duration) * 100 : 0;

  // Auto-complete lesson when 95% is watched
  useEffect(() => {
    if (
      currentLesson && 
      !currentLesson.completed && 
      duration > 0 && 
      progressPercentage >= 95
    ) {
      console.log('Auto-completing lesson at 95% progress');
      updateProgress.mutate({
        lessonId: currentLesson.id,
        completed: true,
        watchTimeSeconds: Math.floor(watchTime)
      });
    }
  }, [currentLesson, progressPercentage, duration, watchTime, updateProgress]);

  return (
    <>
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">Progresso da Aula</span>
          <span className="text-sm text-gray-600">
            {formatTime(watchTime)} / {formatTime(duration)}
          </span>
        </div>
        <Progress value={progressPercentage} className="h-2" />
        <div className="flex justify-between items-center mt-1">
          <span className="text-xs text-gray-500">
            {progressPercentage.toFixed(1)}% assistido
          </span>
          {currentLesson.completed && (
            <div className="flex items-center text-green-600 text-xs">
              <CheckCircle className="w-3 h-3 mr-1" />
              Concluída
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        {currentLesson.material_url && (
          <Button variant="outline" asChild>
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
