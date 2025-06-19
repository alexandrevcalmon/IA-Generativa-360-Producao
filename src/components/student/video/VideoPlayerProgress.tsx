
import { Slider } from '@/components/ui/slider';

interface VideoPlayerProgressProps {
  currentTime: number;
  duration: number;
  onSeek: (value: number[]) => void;
}

export const VideoPlayerProgress = ({ currentTime, duration, onSeek }: VideoPlayerProgressProps) => {
  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center space-x-3 sm:space-x-4">
      <span className="text-white text-sm sm:text-base font-mono min-w-[45px] sm:min-w-[50px]">
        {formatTime(currentTime)}
      </span>
      <div className="flex-1 px-1">
        <Slider
          value={[currentTime]}
          onValueChange={onSeek}
          max={duration || 100}
          step={1}
          className="w-full [&>.slider-track]:h-2 sm:[&>.slider-track]:h-3 [&>.slider-thumb]:h-4 [&>.slider-thumb]:w-4 sm:[&>.slider-thumb]:h-5 sm:[&>.slider-thumb]:w-5 [&>.slider-thumb]:touch-manipulation"
        />
      </div>
      <span className="text-white text-sm sm:text-base font-mono min-w-[45px] sm:min-w-[50px]">
        {formatTime(duration)}
      </span>
    </div>
  );
};
