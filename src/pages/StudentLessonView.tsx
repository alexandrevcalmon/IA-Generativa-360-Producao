
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LessonHeader } from '@/components/student/lesson/LessonHeader';
import { LessonVideoSection } from '@/components/student/lesson/LessonVideoSection';
import { LessonContent } from '@/components/student/lesson/LessonContent';
import { LessonSidebar } from '@/components/student/lesson/LessonSidebar';
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
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Carregando...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Erro ao carregar</h2>
            <p className="text-gray-600">{error.message}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!course || !currentLesson) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Conteúdo não encontrado</h2>
            <p className="text-gray-600">
              {!course ? 'Curso não encontrado' : 'Lição não encontrada'}
            </p>
          </div>
        </div>
      </div>
    );
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <LessonHeader 
        currentLesson={studentLesson} 
        course={course} 
        courseId={courseId!}
        currentModule={currentModule}
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-4 md:py-6">
        {/* Mobile Layout - Stack vertically */}
        <div className="block lg:hidden space-y-4">
          {/* Video Section */}
          <LessonVideoSection
            currentLesson={studentLesson}
            course={course}
            onTimeUpdate={handleTimeUpdate}
          />
          
          {/* Progress and Navigation */}
          <LessonSidebar
            currentLesson={studentLesson}
            courseId={courseId!}
            watchTime={watchTime}
            duration={duration}
            prevLesson={prevLesson ? { id: prevLesson.id, title: prevLesson.title } : undefined}
            nextLesson={nextLesson ? { id: nextLesson.id, title: nextLesson.title } : undefined}
          />
          
          {/* Content */}
          <LessonContent 
            currentLesson={studentLesson} 
            currentModule={currentModule}
          />
        </div>

        {/* Desktop Layout - Grid */}
        <div className="hidden lg:grid lg:grid-cols-4 gap-6">
          {/* Main Content - Left side */}
          <div className="lg:col-span-3 space-y-6">
            <LessonVideoSection
              currentLesson={studentLesson}
              course={course}
              onTimeUpdate={handleTimeUpdate}
            />
            
            <LessonContent 
              currentLesson={studentLesson} 
              currentModule={currentModule}
            />
          </div>

          {/* Sidebar - Right side */}
          <div className="lg:col-span-1">
            <LessonSidebar
              currentLesson={studentLesson}
              courseId={courseId!}
              watchTime={watchTime}
              duration={duration}
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
        aiConfigurationId={undefined}
      />
    </div>
  );
};

export default StudentLessonView;
