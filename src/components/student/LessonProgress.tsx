
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock } from 'lucide-react';
import { StudentLesson } from '@/hooks/useStudentCourses';

interface LessonProgressProps {
  currentLesson: StudentLesson;
  watchTime: number;
  duration: number;
}

export const LessonProgress = ({ currentLesson, watchTime, duration }: LessonProgressProps) => {
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const progressPercentage = duration > 0 ? Math.min((watchTime / duration) * 100, 100) : 0;
  const isCompleted = currentLesson.completed;

  return (
    <div className="space-y-4">
      {/* Completion Status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 lesson-text-muted" />
          <span className="text-sm lesson-text-secondary">Status da Lição</span>
        </div>
        <Badge className={`${isCompleted ? 'lesson-success-accent' : 'lesson-text-muted bg-transparent border lesson-border'} text-xs`}>
          {isCompleted ? (
            <>
              <CheckCircle className="w-3 h-3 mr-1" />
              Completa
            </>
          ) : (
            'Em Progresso'
          )}
        </Badge>
      </div>

      {/* Progress Bar */}
      {duration > 0 && (
        <div className="space-y-2">
          <div className="flex justify-between text-xs lesson-text-muted">
            <span>{formatTime(watchTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
          <div className="progress-dark rounded-full h-2 overflow-hidden">
            <div 
              className="progress-dark-fill h-full transition-all duration-300 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <div className="text-center">
            <span className="text-xs lesson-text-secondary">
              {Math.round(progressPercentage)}% assistido
            </span>
          </div>
        </div>
      )}

      {/* Watch Time Info */}
      {currentLesson.watch_time_seconds > 0 && (
        <div className="pt-2 border-t lesson-border-subtle">
          <div className="flex items-center justify-between text-xs lesson-text-muted">
            <span>Tempo total assistido:</span>
            <span className="font-medium lesson-text-secondary">
              {formatTime(currentLesson.watch_time_seconds)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
