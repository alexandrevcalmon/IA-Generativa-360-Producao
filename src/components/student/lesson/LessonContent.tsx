
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Download } from 'lucide-react';
import { StudentLesson } from '@/hooks/useStudentCourses';

interface LessonContentProps {
  currentLesson: StudentLesson;
  currentModule?: { title: string } | null;
}

export const LessonContent = ({ currentLesson, currentModule }: LessonContentProps) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
          <BookOpen className="h-5 w-5" />
          Conteúdo da Lição
        </CardTitle>
        {currentModule && (
          <div className="text-sm text-gray-600">
            Módulo: {currentModule.title}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="prose prose-sm md:prose max-w-none">
          {currentLesson.content ? (
            <div dangerouslySetInnerHTML={{ __html: currentLesson.content }} />
          ) : (
            <p className="text-gray-500">Nenhum conteúdo adicional disponível.</p>
          )}
        </div>
        
        {/* Lesson Materials */}
        {currentLesson.material_url && (
          <div className="mt-6 pt-6 border-t">
            <h3 className="font-semibold mb-3">Material de Apoio</h3>
            <Button asChild variant="outline" className="w-full sm:w-auto">
              <a href={currentLesson.material_url} target="_blank" rel="noopener noreferrer">
                <Download className="h-4 w-4 mr-2" />
                Download do Material
              </a>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
