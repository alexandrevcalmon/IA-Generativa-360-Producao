
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Clock, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { VideoPlayer } from '@/components/student/VideoPlayer';
import { LessonNavigation } from '@/components/student/LessonNavigation';
import { LessonProgress } from '@/components/student/LessonProgress';
import { StudentLessonHeader } from '@/components/student/StudentLessonHeader';
import { AIChatWidget } from '@/components/lesson/AIChatWidget';
import { useAuth } from '@/hooks/useAuth';
import { useLessonInCourse } from '@/hooks/useLessonInCourse';

const StudentLessonView = () => {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [watchTime, setWatchTime] = useState(0);
  const [duration, setDuration] = useState(0);
  
  const { 
    lesson: currentLesson, 
    module: currentModule, 
    course, 
    prevLesson, 
    nextLesson, 
    isLoading,
    error 
  } = useLessonInCourse(courseId!, lessonId!);

  useEffect(() => {
    if (!courseId || !lessonId) {
      navigate('/student/courses');
    }
  }, [courseId, lessonId, navigate]);

  const handleTimeUpdate = (currentTime: number, videoDuration: number) => {
    setWatchTime(currentTime);
    setDuration(videoDuration);
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Carregando...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center h-screen">Erro ao carregar: {error.message}</div>;
  }

  if (!course) {
    return <div className="flex items-center justify-center h-screen">Curso não encontrado</div>;
  }

  if (!currentLesson) {
    return <div className="flex items-center justify-center h-screen">Lição não encontrada</div>;
  }

  // Convert lesson to StudentLesson format for components
  const studentLesson = {
    ...currentLesson,
    completed: currentLesson.completed || false,
    watch_time_seconds: currentLesson.watch_time_seconds || 0,
    video_file_url: currentLesson.video_file_url || null,
    material_url: currentLesson.material_url || null,
  };

  // Get user's company_id from company_users table or provide fallback
  const companyId = user?.user_metadata?.company_id || '';

  // Check if lesson has video content
  const hasVideo = currentLesson.video_url || currentLesson.video_file_url;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header with Sidebar Trigger */}
      <div className="md:hidden bg-white border-b p-4">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div className="flex-1">
            <h1 className="text-lg font-semibold truncate">{currentLesson.title}</h1>
            <p className="text-sm text-gray-600 truncate">{course.title}</p>
          </div>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden md:block">
        <StudentLessonHeader 
          currentLesson={studentLesson} 
          course={course} 
          courseId={courseId!} 
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Video Player or No Video Message */}
            {hasVideo ? (
              <Card>
                <CardContent className="p-0">
                  <VideoPlayer
                    currentLesson={studentLesson}
                    course={course}
                    onTimeUpdate={handleTimeUpdate}
                  />
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <div className="text-gray-400 mb-4">
                    <BookOpen className="mx-auto h-16 w-16" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Esta lição não possui vídeo</h3>
                  <p className="text-gray-600">
                    O conteúdo desta lição está disponível no texto abaixo.
                  </p>
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
                {currentModule && (
                  <div className="text-sm text-gray-600">
                    Módulo: {currentModule.title}
                  </div>
                )}
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
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Progresso</CardTitle>
              </CardHeader>
              <CardContent>
                <LessonProgress 
                  currentLesson={studentLesson}
                  watchTime={watchTime}
                  duration={duration}
                />
              </CardContent>
            </Card>

            {/* Lesson Navigation */}
            <LessonNavigation
              courseId={courseId!}
              prevLesson={prevLesson ? { id: prevLesson.id, title: prevLesson.title } : undefined}
              nextLesson={nextLesson ? { id: nextLesson.id, title: nextLesson.title } : undefined}
            />
          </div>
        </div>
      </div>

      {/* AI Chat Widget */}
      <AIChatWidget
        lessonId={lessonId!}
        companyId={companyId}
        aiConfigurationId={undefined} // This could be fetched from company settings
      />
    </div>
  );
};

export default StudentLessonView;
