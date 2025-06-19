
import React, { useEffect, useState } from 'react';
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
import { useUpdateLessonProgress } from '@/hooks/useStudentProgress';
import { useAuth } from '@/hooks/useAuth';
import { useStudentCourses } from '@/hooks/useStudentCourses';

const StudentLessonView = () => {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [watchTime, setWatchTime] = useState(0);
  const [duration, setDuration] = useState(0);
  
  const { data: lessons, isLoading: lessonsLoading } = useLessons(courseId);
  const { data: studentCourse } = useStudentCourses();
  const updateProgress = useUpdateLessonProgress();

  const currentLesson = lessons?.find(lesson => lesson.id === lessonId);
  const currentIndex = lessons?.findIndex(lesson => lesson.id === lessonId) || 0;
  const course = studentCourse?.find(c => c.id === courseId);

  // Find previous and next lessons
  const prevLesson = currentIndex > 0 ? lessons?.[currentIndex - 1] : undefined;
  const nextLesson = currentIndex < (lessons?.length || 0) - 1 ? lessons?.[currentIndex + 1] : undefined;

  useEffect(() => {
    if (!courseId || !lessonId) {
      navigate('/student/courses');
    }
  }, [courseId, lessonId, navigate]);

  const handleTimeUpdate = (currentTime: number, videoDuration: number) => {
    setWatchTime(currentTime);
    setDuration(videoDuration);
  };

  if (lessonsLoading) {
    return <div className="flex items-center justify-center h-screen">Carregando...</div>;
  }

  if (!currentLesson || !course) {
    return <div className="flex items-center justify-center h-screen">Lição não encontrada</div>;
  }

  // Convert lesson to StudentLesson format for components
  const studentLesson = {
    ...currentLesson,
    completed: false, // This would come from progress data
    watch_time_seconds: 0, // This would come from progress data
  };

  // Get user's company_id from company_users table or provide fallback
  const companyId = user?.user_metadata?.company_id || '';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <StudentLessonHeader 
        currentLesson={studentLesson} 
        course={course} 
        courseId={courseId!} 
      />

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Video Player */}
            {currentLesson.video_url && (
              <Card>
                <CardContent className="p-0">
                  <VideoPlayer
                    currentLesson={studentLesson}
                    course={course}
                    onTimeUpdate={handleTimeUpdate}
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
            <LessonProgress 
              currentLesson={studentLesson}
              watchTime={watchTime}
              duration={duration}
            />

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
