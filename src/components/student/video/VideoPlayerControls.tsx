
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
    <div className="absolute bottom-0 left-0 right-0 p-2 md:p-4 space-y-2 md:space-y-3">
      {/* Progress Bar */}
      <VideoPlayerProgress
        currentTime={currentTime}
        duration={duration}
        onSeek={onSeek}
      />

      {/* Control Buttons */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-1 md:space-x-2">
          <Button
            onClick={onTogglePlay}
            size="sm"
            variant="ghost"
            className="text-white hover:bg-white/20 touch-manipulation p-2"
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>

          <Button
            onClick={() => onSkip(-10)}
            size="sm"
            variant="ghost"
            className="text-white hover:bg-white/20 touch-manipulation p-2"
          >
            <RotateCcw className="h-4 w-4" />
            <span className="ml-1 text-xs hidden md:inline">10s</span>
          </Button>

          <Button
            onClick={() => onSkip(10)}
            size="sm"
            variant="ghost"
            className="text-white hover:bg-white/20 touch-manipulation p-2"
          >
            <RotateCw className="h-4 w-4" />
            <span className="ml-1 text-xs hidden md:inline">10s</span>
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
          className="text-white hover:bg-white/20 touch-manipulation p-2"
        >
          <Maximize className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
