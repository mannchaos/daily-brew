"use client";

import { useState, useEffect, useRef, useCallback } from "react";

export function useTimer(initialDuration: number = 0, onFinish?: () => void) {
  const [timeLeft, setTimeLeft] = useState(initialDuration);
  const [isRunning, setIsRunning] = useState(false);
  const endTimeRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  const start = useCallback(
    (duration?: number) => {
      const timeToUse = duration !== undefined ? duration : timeLeft;
      if (timeToUse <= 0) return;

      setTimeLeft(timeToUse);
      setIsRunning(true);
      // Calculate target end time based on current time + duration
      endTimeRef.current = Date.now() + timeToUse * 1000;

      // Use requestAnimationFrame for smooth updates
      const tick = () => {
        if (!endTimeRef.current) return;

        const now = Date.now();
        const remaining = Math.ceil((endTimeRef.current - now) / 1000);

        if (remaining <= 0) {
          setTimeLeft(0);
          setIsRunning(false);
          endTimeRef.current = null;
          if (onFinish) onFinish();
        } else {
          setTimeLeft(remaining);
          rafRef.current = requestAnimationFrame(tick);
        }
      };

      rafRef.current = requestAnimationFrame(tick);
    },
    [timeLeft, onFinish]
  );

  const pause = useCallback(() => {
    setIsRunning(false);
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    endTimeRef.current = null; // Invalidate end time on pause
  }, []);

  // Resume is tricky with delta timing.
  // We need to recalculate endTime based on the current timeLeft.
  // Actually, `start()` logic handles resume if we just pass specific duration or use current timeLeft.
  // But wait, if we pause, timeLeft is preserved. calling start() again uses timeLeft. that works.

  const reset = useCallback(
    (newDuration: number = 0) => {
      pause();
      setTimeLeft(newDuration);
    },
    [pause]
  );

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return { timeLeft, isRunning, start, pause, reset };
}
