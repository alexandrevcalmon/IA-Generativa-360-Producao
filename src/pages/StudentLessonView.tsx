
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Clock, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { VideoPlayer } from '@/components/student/VideoPlayer';
import { LessonNavigation } from '@/components/student/LessonNavigation';
import { LessonProgress } from '@/components/student/LessonProgress';
import { StudentLessonHeader } from '@/components/student/StudentLessonHeader';
import { AIChatWidget } from '@/components/lesson/AIChatWidget';
import { useLessons } from '@/hooks/useLessons';
import { useStudentProgress } from '@/hooks/useStudentProgress';
import { useAuth } from '@/hooks/useAuth';

const StudentLessonView = () => {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const { data: lessons, isLoading: lessonsLoading } = useLessons(courseId);
  const { markLessonCompleted, updateLessonProgress } = useStudentProgress();

  const currentLesson = lessons?.find(lesson => lesson.id === lessonId);
  const currentIndex = lessons?.findIndex(lesson => lesson.id === lessonId) || 0;

  useEffect(() => {
    if (!courseId || !lessonId) {
      navigate('/student/courses');
    }
  }, [courseId, lessonId, navigate]);

  const handleProgress = (watchTimeSeconds: number) => {
    if (lessonId && user) {
      updateLessonProgress.mutate({
        lessonId,
        watchTimeSeconds,
        userId: user.id,
      });
    }
  };

  const handleComplete = () => {
    if (lessonId && user) {
      markLessonCompleted.mutate({
        lessonId,
        userId: user.id,
      });
    }
  };

  if (lessonsLoading) {
    return <div className="flex items-center justify-center h-screen">Carregando...</div>;
  }

  if (!currentLesson) {
    return <div className="flex items-center justify-center h-screen">Lição não encontrada</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <StudentLessonHeader lesson={currentLesson} onBack={() => navigate(`/student/courses/${courseId}`)} />

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Video Player */}
            {currentLesson.video_url && (
              <Card>
                <CardContent className="p-0">
                  <VideoPlayer
                    videoUrl={currentLesson.video_url}
                    onProgress={handleProgress}
                    onComplete={handleComplete}
                  />
                </CardContent>
              </Card>
            )}

            {/* Lesson Content */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Conteúdo da Lição
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  {currentLesson.content ? (
                    <div dangerouslySetInnerHTML={{ __html: currentLesson.content }} />
                  ) : (
                    <p className="text-gray-500">Nenhum conteúdo adicional disponível.</p>
                  )}
                </div>
                
                {/* Lesson Materials */}
                {currentLesson.material_url && (
                  <div className="mt-6 pt-6 border-t">
                    <h3 className="font-semibold mb-2">Material de Apoio</h3>
                    <Button asChild variant="outline">
                      <a href={currentLesson.material_url} target="_blank" rel="noopener noreferrer">
                        Download do Material
                      </a>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Lesson Progress */}
            <LessonProgress lesson={currentLesson} />

            {/* Lesson Navigation */}
            <LessonNavigation
              lessons={lessons || []}
              currentIndex={currentIndex}
              courseId={courseId!}
            />
          </div>
        </div>
      </div>

      {/* AI Chat Widget */}
      <AIChatWidget
        lessonId={lessonId!}
        companyId={user?.company_id || ''}
        aiConfigurationId={undefined} // This could be fetched from company settings
      />
    </div>
  );
};

export default StudentLessonView;
