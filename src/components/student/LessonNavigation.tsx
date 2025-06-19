
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface LessonNavigationProps {
  courseId: string;
  prevLesson?: { id: string; title: string };
  nextLesson?: { id: string; title: string };
}

export const LessonNavigation = ({ courseId, prevLesson, nextLesson }: LessonNavigationProps) => {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm md:text-base lg:text-lg">Navegação</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 sm:space-y-3 pt-0">
        {prevLesson && (
          <Button 
            variant="outline" 
            className="w-full justify-start text-xs sm:text-sm h-8 sm:h-9"
            onClick={() => navigate(`/student/courses/${courseId}/lessons/${prevLesson.id}`)}
          >
            <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
            <span className="truncate">Aula Anterior</span>
          </Button>
        )}
        
        {nextLesson && (
          <Button 
            className="w-full justify-start text-xs sm:text-sm h-8 sm:h-9"
            onClick={() => navigate(`/student/courses/${courseId}/lessons/${nextLesson.id}`)}
          >
            <span className="truncate">Próxima Aula</span>
            <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 ml-2 rotate-180" />
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
