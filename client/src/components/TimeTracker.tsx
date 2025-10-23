import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, Check } from "lucide-react";

interface TimeTrackerProps {
  initialTime?: number;
  isRunning?: boolean;
  isFinished?: boolean;
  onStart?: () => void;
  onPause?: () => void;
  onFinish?: () => void;
  onTimeUpdate?: (time: number) => void;
}

export function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export default function TimeTracker({
  initialTime = 0,
  isRunning = false,
  isFinished = false,
  onStart,
  onPause,
  onFinish,
  onTimeUpdate,
}: TimeTrackerProps) {
  const [time, setTime] = useState(initialTime);
  const [running, setRunning] = useState(isRunning);
  const [finished, setFinished] = useState(isFinished);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (running && !finished) {
      interval = setInterval(() => {
        setTime((prev) => {
          const newTime = prev + 1;
          onTimeUpdate?.(newTime);
          return newTime;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [running, finished, onTimeUpdate]);

  const handleStart = () => {
    if (!finished) {
      setRunning(true);
      onStart?.();
    }
  };

  const handlePause = () => {
    setRunning(false);
    onPause?.();
  };

  const handleFinish = () => {
    setRunning(false);
    setFinished(true);
    onFinish?.();
  };

  return (
    <div className="flex items-center gap-2">
      <span className="font-mono text-sm font-medium min-w-[70px]" data-testid="text-time">
        {formatTime(time)}
      </span>
      <div className="flex gap-1">
        {!running && !finished && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleStart}
            data-testid="button-timer-start"
            className="h-8 w-8 text-status-online"
          >
            <Play className="h-4 w-4" />
          </Button>
        )}
        {running && !finished && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handlePause}
            data-testid="button-timer-pause"
            className="h-8 w-8 text-status-away"
          >
            <Pause className="h-4 w-4" />
          </Button>
        )}
        {!finished && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleFinish}
            data-testid="button-timer-finish"
            className="h-8 w-8"
          >
            <Check className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
