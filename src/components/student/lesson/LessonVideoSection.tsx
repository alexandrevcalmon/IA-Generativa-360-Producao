
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen } from 'lucide-react';
import { VideoPlayer } from '@/components/student/VideoPlayer';
import { StudentLesson, StudentCourse } from '@/hooks/useStudentCourses';

interface LessonVideoSectionProps {
  currentLesson: StudentLesson;
  course: StudentCourse;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
}

export const LessonVideoSection = ({ currentLesson, course, onTimeUpdate }: LessonVideoSectionProps) => {
  const hasVideo = currentLesson.video_url || currentLesson.video_file_url;

  if (!hasVideo) {
    return (
      <Card className="w-full lesson-dark-card">
        <CardContent className="p-4 sm:p-6 md:p-8 text-center">
          <div className="lesson-text-muted mb-3">
            <BookOpen className="mx-auto h-10 w-10 sm:h-12 sm:w-12 md:h-16 md:w-16" />
          </div>
          <h3 className="text-sm sm:text-base md:text-lg font-medium lesson-text-primary mb-2">
            Esta lição não possui vídeo
          </h3>
          <p className="text-xs sm:text-sm md:text-base lesson-text-secondary">
            O conteúdo desta lição está disponível no texto abaixo.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full lesson-dark-card border-0 shadow-2xl">
      <CardContent className="p-0">
        <VideoPlayer
          currentLesson={currentLesson}
          course={course}
          onTimeUpdate={onTimeUpdate}
        />
      </CardContent>
    </Card>
  );
};
