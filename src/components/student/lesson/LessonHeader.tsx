
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { StudentLesson, StudentCourse } from '@/hooks/useStudentCourses';

interface LessonHeaderProps {
  currentLesson: StudentLesson;
  course: StudentCourse;
  courseId: string;
  currentModule?: { title: string } | null;
}

export const LessonHeader = ({ currentLesson, course, courseId, currentModule }: LessonHeaderProps) => {
  const navigate = useNavigate();

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden bg-white border-b">
        <div className="flex items-center justify-between p-3">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <SidebarTrigger className="flex-shrink-0" />
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate(`/student/courses/${courseId}`)}
              className="flex-shrink-0 p-1.5"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="min-w-0 flex-1">
              <h1 className="text-sm font-semibold truncate leading-tight">{currentLesson.title}</h1>
              <p className="text-xs text-gray-600 truncate">{course.title}</p>
              {currentModule && (
                <p className="text-xs text-gray-500 truncate">{currentModule.title}</p>
              )}
            </div>
          </div>
          {currentLesson.completed && (
            <Badge className="bg-green-500 text-white flex-shrink-0 text-xs px-2 py-0.5">
              <CheckCircle className="w-3 h-3 mr-1" />
              <span className="hidden xs:inline">OK</span>
            </Badge>
          )}
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden md:block bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 lg:py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 lg:space-x-4">
              <Button variant="ghost" onClick={() => navigate(`/student/courses/${courseId}`)}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar ao Curso
              </Button>
              <div>
                <h1 className="text-xl lg:text-2xl font-bold text-gray-900">{currentLesson.title}</h1>
                <div className="flex items-center gap-2 text-sm lg:text-base text-gray-600 mt-1">
                  <span>{course.title}</span>
                  {currentModule && (
                    <>
                      <span>•</span>
                      <span>{currentModule.title}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {currentLesson.completed && (
                <Badge className="bg-green-500 text-white">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Concluída
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
