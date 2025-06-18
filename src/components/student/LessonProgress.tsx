
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, FileText } from 'lucide-react';
import { StudentLesson } from '@/hooks/useStudentCourses';
import { useUpdateLessonProgress } from '@/hooks/useStudentProgress';

interface LessonProgressProps {
  currentLesson: StudentLesson;
  watchTime: number;
  duration: number;
}

export const LessonProgress = ({ currentLesson, watchTime, duration }: LessonProgressProps) => {
  const updateProgress = useUpdateLessonProgress();

  const handleMarkComplete = () => {
    if (currentLesson) {
      updateProgress.mutate({
        lessonId: currentLesson.id,
        completed: true,
        watchTimeSeconds: Math.floor(watchTime)
      });
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercentage = duration > 0 ? (watchTime / duration) * 100 : 0;

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
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        {!currentLesson.completed && (
          <Button 
            onClick={handleMarkComplete}
            disabled={updateProgress.isPending}
            className="bg-green-600 hover:bg-green-700"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Marcar como Concluída
          </Button>
        )}
        
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
