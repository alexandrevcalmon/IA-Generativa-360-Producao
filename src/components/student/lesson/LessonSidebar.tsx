
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LessonProgress } from '@/components/student/LessonProgress';
import { LessonNavigation } from '@/components/student/LessonNavigation';
import { StudentLesson } from '@/hooks/useStudentCourses';
import { BarChart3 } from 'lucide-react';

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
    <div className="space-y-4 w-full">
      {/* Progress Card */}
      <Card className="w-full lesson-dark-card border-0 shadow-xl">
        <CardHeader className="pb-3 px-4 sm:px-6 pt-4 sm:pt-6 lesson-primary-accent rounded-t-lg">
          <CardTitle className="text-base sm:text-lg font-semibold text-white flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Progresso
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4 px-4 sm:px-6 pb-4 sm:pb-6">
          <LessonProgress 
            currentLesson={currentLesson}
            watchTime={watchTime}
            duration={duration}
          />
        </CardContent>
      </Card>

      {/* Navigation Card */}
      <div className="w-full">
        <LessonNavigation
          courseId={courseId}
          prevLesson={prevLesson}
          nextLesson={nextLesson}
        />
      </div>
    </div>
  );
};
