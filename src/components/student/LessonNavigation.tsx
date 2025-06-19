
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

  const handlePrevClick = () => {
    console.log('Previous lesson clicked:', prevLesson?.id);
    if (prevLesson) {
      navigate(`/student/courses/${courseId}/lessons/${prevLesson.id}`);
    }
  };

  const handleNextClick = () => {
    console.log('Next lesson clicked:', nextLesson?.id);
    if (nextLesson) {
      navigate(`/student/courses/${courseId}/lessons/${nextLesson.id}`);
    }
  };

  return (
    <Card className="border-yellow-200 bg-gradient-to-br from-yellow-50 to-amber-50 shadow-lg">
      <CardHeader className="pb-3 px-4 sm:px-6 pt-4 sm:pt-6 bg-gradient-to-r from-yellow-600 to-amber-600 text-white rounded-t-lg">
        <CardTitle className="text-base sm:text-lg font-semibold">Navegação</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 pt-4 px-4 sm:px-6 pb-4 sm:pb-6">
        {prevLesson && (
          <Button 
            variant="outline" 
            className="w-full justify-start text-sm h-12 sm:h-14 touch-manipulation font-medium border-2 border-yellow-200 hover:bg-yellow-100 hover:border-yellow-300 text-yellow-700"
            onClick={handlePrevClick}
          >
            <ArrowLeft className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="truncate">Aula Anterior</span>
          </Button>
        )}
        
        {nextLesson && (
          <Button 
            className="w-full justify-start text-sm h-12 sm:h-14 touch-manipulation font-medium bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-white shadow-lg"
            onClick={handleNextClick}
          >
            <span className="truncate">Próxima Aula</span>
            <ArrowLeft className="h-4 w-4 ml-2 rotate-180 flex-shrink-0" />
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
