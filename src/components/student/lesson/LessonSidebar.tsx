
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
    <div className="space-y-4 md:space-y-6">
      {/* Progress Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base md:text-lg">Progresso</CardTitle>
        </CardHeader>
        <CardContent>
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
