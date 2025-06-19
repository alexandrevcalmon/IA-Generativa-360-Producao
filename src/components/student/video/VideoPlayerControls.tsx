
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw, RotateCw, Maximize } from 'lucide-react';
import { VideoPlayerProgress } from './VideoPlayerProgress';
import { VideoPlayerVolume } from './VideoPlayerVolume';

interface VideoPlayerControlsProps {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isMobile: boolean;
  onTogglePlay: () => void;
  onSeek: (value: number[]) => void;
  onVolumeChange: (value: number[]) => void;
  onToggleMute: () => void;
  onSkip: (seconds: number) => void;
  onToggleFullscreen: () => void;
}

export const VideoPlayerControls = ({
  isPlaying,
  currentTime,
  duration,
  volume,
  isMuted,
  isMobile,
  onTogglePlay,
  onSeek,
  onVolumeChange,
  onToggleMute,
  onSkip,
  onToggleFullscreen,
}: VideoPlayerControlsProps) => {
  return (
    <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 lg:p-5 space-y-3 sm:space-y-4">
      {/* Progress Bar */}
      <VideoPlayerProgress
        currentTime={currentTime}
        duration={duration}
        onSeek={onSeek}
      />

      {/* Control Buttons */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <Button
            onClick={onTogglePlay}
            size="sm"
            variant="ghost"
            className="text-white hover:bg-white/20 touch-manipulation h-11 w-11 sm:h-12 sm:w-12 p-0"
          >
            {isPlaying ? <Pause className="h-5 w-5 sm:h-6 sm:w-6" /> : <Play className="h-5 w-5 sm:h-6 sm:w-6" />}
          </Button>

          <Button
            onClick={() => onSkip(-10)}
            size="sm"
            variant="ghost"
            className="text-white hover:bg-white/20 touch-manipulation h-11 w-11 sm:h-12 sm:w-12 p-0"
          >
            <RotateCcw className="h-5 w-5 sm:h-6 sm:w-6" />
          </Button>

          <Button
            onClick={() => onSkip(10)}
            size="sm"
            variant="ghost"
            className="text-white hover:bg-white/20 touch-manipulation h-11 w-11 sm:h-12 sm:w-12 p-0"
          >
            <RotateCw className="h-5 w-5 sm:h-6 sm:w-6" />
          </Button>

          {/* Volume controls - hidden on mobile */}
          {!isMobile && (
            <VideoPlayerVolume
              volume={volume}
              isMuted={isMuted}
              onVolumeChange={onVolumeChange}
              onToggleMute={onToggleMute}
            />
          )}
        </div>

        <Button
          onClick={onToggleFullscreen}
          size="sm"
          variant="ghost"
          className="text-white hover:bg-white/20 touch-manipulation h-11 w-11 sm:h-12 sm:w-12 p-0"
        >
          <Maximize className="h-5 w-5 sm:h-6 sm:w-6" />
        </Button>
      </div>
    </div>
  );
};
