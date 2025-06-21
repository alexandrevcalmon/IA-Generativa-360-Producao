
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, Navigation } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface LessonNavigationProps {
  courseId: string;
  prevLesson?: { id: string; title: string };
  nextLesson?: { id: string; title: string };
}

export const LessonNavigation = ({ courseId, prevLesson, nextLesson }: LessonNavigationProps) => {
  const navigate = useNavigate();

  const handlePrevious = () => {
    if (prevLesson) {
      navigate(`/student/courses/${courseId}/lessons/${prevLesson.id}`);
    }
  };

  const handleNext = () => {
    if (nextLesson) {
      navigate(`/student/courses/${courseId}/lessons/${nextLesson.id}`);
    }
  };

  if (!prevLesson && !nextLesson) {
    return null;
  }

  return (
    <Card className="w-full lesson-dark-card border-0 shadow-xl">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <Navigation className="h-4 w-4 lesson-text-muted" />
          <span className="text-sm font-medium lesson-text-primary">Navegação</span>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          {prevLesson && (
            <Button
              onClick={handlePrevious}
              variant="outline"
              className="flex-1 h-auto p-3 lesson-border hover:lesson-dark-elevated lesson-text-primary hover:lesson-text-primary border-0"
            >
              <div className="flex items-center gap-2 w-full">
                <ChevronLeft className="h-4 w-4 flex-shrink-0" />
                <div className="text-left min-w-0 flex-1">
                  <div className="text-xs lesson-text-muted">Anterior</div>
                  <div className="text-sm font-medium truncate">{prevLesson.title}</div>
                </div>
              </div>
            </Button>
          )}
          
          {nextLesson && (
            <Button
              onClick={handleNext}
              variant="outline"
              className="flex-1 h-auto p-3 lesson-primary-accent text-white hover:opacity-90 border-0"
            >
              <div className="flex items-center gap-2 w-full">
                <div className="text-left min-w-0 flex-1">
                  <div className="text-xs text-white/80">Próxima</div>
                  <div className="text-sm font-medium truncate">{nextLesson.title}</div>
                </div>
                <ChevronRight className="h-4 w-4 flex-shrink-0" />
              </div>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
