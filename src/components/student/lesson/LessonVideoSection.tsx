
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
      <Card className="w-full">
        <CardContent className="p-6 md:p-8 text-center">
          <div className="text-gray-400 mb-4">
            <BookOpen className="mx-auto h-12 w-12 md:h-16 md:w-16" />
          </div>
          <h3 className="text-base md:text-lg font-medium text-gray-900 mb-2">
            Esta lição não possui vídeo
          </h3>
          <p className="text-sm md:text-base text-gray-600">
            O conteúdo desta lição está disponível no texto abaixo.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
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
