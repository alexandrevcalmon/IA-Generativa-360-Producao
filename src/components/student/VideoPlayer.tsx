
import { Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useVideoPlayer } from './video/useVideoPlayer';
import { VideoPlayerControls } from './video/VideoPlayerControls';
import { StudentLesson, StudentCourse } from '@/hooks/useStudentCourses';

interface VideoPlayerProps {
  currentLesson: StudentLesson;
  course: StudentCourse;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
}

export const VideoPlayer = ({ currentLesson, course, onTimeUpdate }: VideoPlayerProps) => {
  const {
    videoRef,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    showControls,
    isMobile,
    setShowControls,
    togglePlay,
    handleSeek,
    handleVolumeChange,
    toggleMute,
    skip,
    toggleFullscreen,
  } = useVideoPlayer({ currentLesson, course, onTimeUpdate });

  const videoUrl = currentLesson.video_file_url || currentLesson.video_url;

  if (!videoUrl) {
    return (
      <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
        <p className="text-white text-sm md:text-lg">Vídeo não disponível</p>
      </div>
    );
  }

  return (
    <div 
      className="relative bg-black rounded-lg overflow-hidden group w-full"
      onMouseEnter={() => !isMobile && setShowControls(true)}
      onMouseLeave={() => !isMobile && setShowControls(false)}
      onTouchStart={() => isMobile && setShowControls(true)}
    >
      <video
        ref={videoRef}
        className="w-full aspect-video object-contain"
        src={videoUrl}
        onClick={togglePlay}
        playsInline
        preload="metadata"
      />
      
      {/* Controls Overlay */}
      <div className={`absolute inset-0 bg-gradient-to-t from-black/60 to-transparent transition-opacity duration-300 ${showControls || !isPlaying || isMobile ? 'opacity-100' : 'opacity-0'}`}>
        
        {/* Play/Pause Button (Center) */}
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Button
              onClick={togglePlay}
              size="lg"
              className="bg-white/20 hover:bg-white/30 text-white rounded-full p-3 md:p-4 touch-manipulation backdrop-blur-sm"
            >
              <Play className="h-5 w-5 md:h-8 md:w-8" />
            </Button>
          </div>
        )}

        {/* Bottom Controls */}
        <VideoPlayerControls
          isPlaying={isPlaying}
          currentTime={currentTime}
          duration={duration}
          volume={volume}
          isMuted={isMuted}
          isMobile={isMobile}
          onTogglePlay={togglePlay}
          onSeek={handleSeek}
          onVolumeChange={handleVolumeChange}
          onToggleMute={toggleMute}
          onSkip={skip}
          onToggleFullscreen={toggleFullscreen}
        />
      </div>
    </div>
  );
};
