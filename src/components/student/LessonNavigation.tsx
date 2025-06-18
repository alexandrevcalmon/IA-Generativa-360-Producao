
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
      <CardHeader>
        <CardTitle className="text-lg">Navegação</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {prevLesson && (
          <Button 
            variant="outline" 
            className="w-full justify-start"
            onClick={() => navigate(`/student/courses/${courseId}/lessons/${prevLesson.id}`)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Aula Anterior
          </Button>
        )}
        
        {nextLesson && (
          <Button 
            className="w-full justify-start"
            onClick={() => navigate(`/student/courses/${courseId}/lessons/${nextLesson.id}`)}
          >
            Próxima Aula
            <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
