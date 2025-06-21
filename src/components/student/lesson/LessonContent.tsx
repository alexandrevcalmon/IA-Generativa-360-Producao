
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Download } from 'lucide-react';
import { StudentLesson } from '@/hooks/useStudentCourses';
import { LessonMaterialsSection } from '@/components/lesson/LessonMaterialsSection';
import { LessonMaterialUpload } from '@/components/lesson/LessonMaterialUpload';
import { useAuth } from '@/hooks/auth';

interface LessonContentProps {
  currentLesson: StudentLesson;
  currentModule?: { title: string } | null;
}

export const LessonContent = ({ currentLesson, currentModule }: LessonContentProps) => {
  const { user } = useAuth();
  
  const handleDownloadClick = () => {
    console.log('Download material clicked');
  };

  // Check if user can upload materials (company owners and producers)
  const canUploadMaterials = user?.user_metadata?.role === 'company' || user?.user_metadata?.role === 'producer';

  return (
    <div className="space-y-6">
      {/* Main Lesson Content */}
      <Card className="w-full lesson-dark-card border-0 shadow-xl">
        <CardHeader className="pb-3 px-4 sm:px-6 pt-4 sm:pt-6 lesson-primary-accent rounded-t-lg">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg lg:text-xl font-semibold text-white">
            <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
            Conteúdo da Lição
          </CardTitle>
          {currentModule && (
            <div className="text-sm text-white/80 mt-1">
              Módulo: {currentModule.title}
            </div>
          )}
        </CardHeader>
        <CardContent className="pt-4 px-4 sm:px-6 pb-4 sm:pb-6">
          <div className="prose prose-sm sm:prose lg:prose-base max-w-none lesson-text-secondary prose-headings:lesson-text-primary prose-strong:lesson-text-primary prose-a:text-blue-400 prose-a:hover:text-blue-300">
            {currentLesson.content ? (
              <div dangerouslySetInnerHTML={{ __html: currentLesson.content }} />
            ) : (
              <p className="lesson-text-muted text-sm sm:text-base">Nenhum conteúdo adicional disponível.</p>
            )}
          </div>
          
          {/* Legacy Material URL Support */}
          {currentLesson.material_url && (
            <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t lesson-border-subtle">
              <h3 className="font-semibold mb-3 text-sm sm:text-base lesson-text-primary">Material de Apoio</h3>
              <Button 
                asChild 
                variant="outline" 
                className="w-full sm:w-auto h-12 sm:h-14 touch-manipulation font-medium border-2 lesson-border hover:lesson-dark-elevated lesson-text-primary hover:lesson-text-primary"
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
      <div className="lesson-materials-dark">
        <LessonMaterialsSection lessonId={currentLesson.id} />
      </div>

      {/* Material Upload Section - Only for authorized users */}
      {canUploadMaterials && (
        <div className="lesson-upload-dark">
          <LessonMaterialUpload 
            lessonId={currentLesson.id}
            onUploadComplete={() => {
              // Optionally refresh materials or show success message
              console.log('Materials uploaded successfully');
            }}
          />
        </div>
      )}
    </div>
  );
};
