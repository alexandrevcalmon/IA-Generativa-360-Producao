
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LessonProgress } from '@/components/student/LessonProgress';
import { LessonNavigation } from '@/components/student/LessonNavigation';
import { StudentLesson } from '@/hooks/useStudentCourses';

interface LessonSidebarProps {
  currentLesson: StudentLesson;
  courseId: string;
  watchTime: number;
  duration: number;
  prevLesson?: { id: string; title: string };
  nextLesson?: { id: string; title: string };
}

export const LessonSidebar = ({ 
  currentLesson, 
  courseId, 
  watchTime, 
  duration, 
  prevLesson, 
  nextLesson 
}: LessonSidebarProps) => {
  return (
    <div className="space-y-4">
      {/* Progress Card */}
      <Card>
        <CardHeader className="pb-3 px-4 sm:px-6 pt-4 sm:pt-6">
          <CardTitle className="text-base sm:text-lg">Progresso</CardTitle>
        </CardHeader>
        <CardContent className="pt-0 px-4 sm:px-6 pb-4 sm:pb-6">
          <LessonProgress 
            currentLesson={currentLesson}
            watchTime={watchTime}
            duration={duration}
          />
        </CardContent>
      </Card>

      {/* Navigation Card */}
      <LessonNavigation
        courseId={courseId}
        prevLesson={prevLesson}
        nextLesson={nextLesson}
      />
    </div>
  );
};
