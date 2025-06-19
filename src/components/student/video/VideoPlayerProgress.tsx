
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
    <div className="flex items-center space-x-2">
      <span className="text-white text-xs md:text-sm font-mono">
        {formatTime(currentTime)}
      </span>
      <Slider
        value={[currentTime]}
        onValueChange={onSeek}
        max={duration || 100}
        step={1}
        className="flex-1"
      />
      <span className="text-white text-xs md:text-sm font-mono">
        {formatTime(duration)}
      </span>
    </div>
  );
};
