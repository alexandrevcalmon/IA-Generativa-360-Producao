
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Download } from 'lucide-react';
import { StudentLesson } from '@/hooks/useStudentCourses';
import { LessonMaterialsSection } from '@/components/lesson/LessonMaterialsSection';

interface LessonContentProps {
  currentLesson: StudentLesson;
  currentModule?: { title: string } | null;
}

export const LessonContent = ({ currentLesson, currentModule }: LessonContentProps) => {
  const handleDownloadClick = () => {
    console.log('Download material clicked');
  };

  return (
    <div className="space-y-6">
      {/* Main Lesson Content */}
      <Card className="w-full">
        <CardHeader className="pb-3 px-4 sm:px-6 pt-4 sm:pt-6">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg lg:text-xl">
            <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
            Conteúdo da Lição
          </CardTitle>
          {currentModule && (
            <div className="text-sm text-gray-600 mt-1">
              Módulo: {currentModule.title}
            </div>
          )}
        </CardHeader>
        <CardContent className="pt-0 px-4 sm:px-6 pb-4 sm:pb-6">
          <div className="prose prose-sm sm:prose lg:prose-base max-w-none">
            {currentLesson.content ? (
              <div dangerouslySetInnerHTML={{ __html: currentLesson.content }} />
            ) : (
              <p className="text-gray-500 text-sm sm:text-base">Nenhum conteúdo adicional disponível.</p>
            )}
          </div>
          
          {/* Legacy Material URL Support */}
          {currentLesson.material_url && (
            <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t">
              <h3 className="font-semibold mb-3 text-sm sm:text-base">Material de Apoio</h3>
              <Button 
                asChild 
                variant="outline" 
                className="w-full sm:w-auto h-12 sm:h-14 touch-manipulation font-medium"
                onClick={handleDownloadClick}
              >
                <a href={currentLesson.material_url} target="_blank" rel="noopener noreferrer">
                  <Download className="h-4 w-4 mr-2" />
                  Download do Material
                </a>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Lesson Materials Section */}
      <LessonMaterialsSection lessonId={currentLesson.id} />
    </div>
  );
};
