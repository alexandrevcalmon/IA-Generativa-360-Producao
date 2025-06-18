
import { useRef, useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Play } from 'lucide-react';
import { StudentLesson, StudentCourse } from '@/hooks/useStudentCourses';
import { useUpdateLessonProgress } from '@/hooks/useStudentProgress';

interface VideoPlayerProps {
  currentLesson: StudentLesson;
  course: StudentCourse;
  onTimeUpdate: (currentTime: number, duration: number) => void;
}

export const VideoPlayer = ({ currentLesson, course, onTimeUpdate }: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const updateProgress = useUpdateLessonProgress();
  const [lastProgressUpdate, setLastProgressUpdate] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => {
      const currentTime = video.currentTime;
      const duration = video.duration;
      
      onTimeUpdate(currentTime, duration);
      
      // Update progress every 10 seconds to avoid too many API calls
      const currentTimestamp = Math.floor(currentTime);
      if (currentTimestamp > 0 && currentTimestamp % 10 === 0 && currentTimestamp !== lastProgressUpdate) {
        setLastProgressUpdate(currentTimestamp);
        updateProgress.mutate({
          lessonId: currentLesson.id,
          watchTimeSeconds: currentTimestamp
        });
      }
    };

    const updateDuration = () => {
      onTimeUpdate(video.currentTime, video.duration);
    };

    video.addEventListener('timeupdate', updateTime);
    video.addEventListener('loadedmetadata', updateDuration);

    return () => {
      video.removeEventListener('timeupdate', updateTime);
      video.removeEventListener('loadedmetadata', updateDuration);
    };
  }, [currentLesson, updateProgress, onTimeUpdate, lastProgressUpdate]);

  return (
    <Card>
      <CardContent className="p-0">
        <div className="relative bg-black rounded-t-lg overflow-hidden">
          {currentLesson.video_file_url ? (
            <video
              ref={videoRef}
              className="w-full aspect-video"
              controls
              controlsList="nodownload"
              onContextMenu={(e) => e.preventDefault()}
              poster={course?.thumbnail_url || undefined}
            >
              <source src={currentLesson.video_file_url} type="video/mp4" />
              Seu navegador não suporta vídeos HTML5.
            </video>
          ) : currentLesson.video_url ? (
            <iframe
              className="w-full aspect-video"
              src={currentLesson.video_url}
              title={currentLesson.title}
              frameBorder="0"
              allowFullScreen
            />
          ) : (
            <div className="w-full aspect-video flex items-center justify-center bg-gray-800 text-white">
              <div className="text-center">
                <Play className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p>Vídeo não disponível</p>
              </div>
            </div>
          )}
        </div>

        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">{currentLesson.title}</h2>
            <div className="flex items-center space-x-2">
              {currentLesson.duration_minutes && (
                <span className="text-sm text-gray-600">
                  {currentLesson.duration_minutes} min
                </span>
              )}
            </div>
          </div>

          {currentLesson.content && (
            <div className="prose max-w-none mb-6">
              <div dangerouslySetInnerHTML={{ __html: currentLesson.content }} />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
