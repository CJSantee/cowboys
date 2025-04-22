import { Progress } from "flowbite-react";
import useLogProgress from "../hooks/useLogProgress";

interface ProgressBarProps {
  duration_ms: number;
}
export default function ProgressBar({ duration_ms }: ProgressBarProps) {
  const progress = useLogProgress(duration_ms);

  return (
    <div className="w-full">
      <Progress progress={progress} size="lg" />
    </div>
  );
}
