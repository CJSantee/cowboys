import { useEffect, useState } from "react";

export default function useLogProgress(duration_ms = 5000) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const startTime = performance.now();
    let animationFrame: number;

    const logEasing = (t: number) => {
      // Map t in [0, 1] to a pseudo-logarithmic scale
      const base = 100;
      return Math.log1p(t * (base - 1)) / Math.log(base); // Normalized to [0, 1]
    };

    const update = (now: number) => {
      const elapsed = now - startTime;
      const t = Math.min(elapsed / duration_ms, 1); // Clamp between 0 and 1
      const easedProgress = logEasing(t) * 100; // Scale to 0–100
      setProgress(easedProgress);

      if (t < 1) {
        animationFrame = requestAnimationFrame(update);
      }
    };

    animationFrame = requestAnimationFrame(update);

    return () => cancelAnimationFrame(animationFrame);
  }, [duration_ms]);

  return progress;
}