
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { useStudentCourse } from '@/hooks/useStudentCourses';
import { StudentLessonHeader } from '@/components/student/StudentLessonHeader';
import { VideoPlayer } from '@/components/student/VideoPlayer';
import { LessonProgress } from '@/components/student/LessonProgress';
import { LessonNavigation } from '@/components/student/LessonNavigation';
import { CourseProgressSidebar } from '@/components/student/CourseProgressSidebar';

const StudentLessonView = () => {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>();
  const navigate = useNavigate();
  const [watchTime, setWatchTime] = useState(0);
  const [duration, setDuration] = useState(0);
  
  const { data: course, isLoading } = useStudentCourse(courseId!);

  // Find the current lesson
  const currentLesson = course?.modules
    .flatMap(module => module.lessons)
    .find(lesson => lesson.id === lessonId);

  // Find all lessons for navigation
  const allLessons = course?.modules.flatMap(module => 
    module.lessons.map(lesson => ({
      ...lesson,
      moduleTitle: module.title
    }))
  ) || [];

  const currentLessonIndex = allLessons.findIndex(lesson => lesson.id === lessonId);
  const nextLesson = allLessons[currentLessonIndex + 1];
  const prevLesson = allLessons[currentLessonIndex - 1];

  const handleTimeUpdate = (currentTime: number, videoDuration: number) => {
    setWatchTime(currentTime);
    setDuration(videoDuration);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col h-full">
        <div className="bg-white border-b p-6">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => navigate(`/student/courses/${courseId}`)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">Carregando...</h1>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-lg text-gray-600">Carregando aula...</div>
        </div>
      </div>
    );
  }

  if (!currentLesson) {
    return (
      <div className="flex flex-col h-full">
        <div className="bg-white border-b p-6">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => navigate(`/student/courses/${courseId}`)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">Aula não encontrada</h1>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h3 className="text-lg font-medium mb-2">Aula não encontrada</h3>
            <p className="text-gray-600">A aula solicitada não foi encontrada.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <StudentLessonHeader 
        currentLesson={currentLesson}
        course={course!}
        courseId={courseId!}
      />

      {/* Main Content */}
      <div className="flex-1 overflow-auto bg-gray-50">
        <div className="max-w-6xl mx-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Video Player */}
            <div className="lg:col-span-2">
              <VideoPlayer 
                currentLesson={currentLesson}
                course={course!}
                onTimeUpdate={handleTimeUpdate}
              />
              
              <div className="mt-6 p-6 bg-white rounded-lg">
                <LessonProgress 
                  currentLesson={currentLesson}
                  watchTime={watchTime}
                  duration={duration}
                />
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <LessonNavigation 
                courseId={courseId!}
                prevLesson={prevLesson}
                nextLesson={nextLesson}
              />

              <CourseProgressSidebar 
                course={course!}
                allLessons={allLessons}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentLessonView;
