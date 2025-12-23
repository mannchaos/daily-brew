"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { RECIPE, BrewStep, TOTAL_TIME_SECONDS } from "../_data/recipe";
import { useTimer } from "./useTimer";
import { useWakeLock } from "./useWakeLock";
import { playAlert } from "../_util/sound";

export type BrewMode = "auto" | "manual";
export type BrewStatus = "idle" | "brewing" | "paused" | "finished";

export function useBrew() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [status, setStatus] = useState<BrewStatus>("idle");
  const [mode, setMode] = useState<BrewMode>("manual");

  // Track if we have hydrated from storage to avoid hydration mismatch
  const [isHydrated, setIsHydrated] = useState(false);

  const { requestLock, releaseLock } = useWakeLock();

  // Timer callback needs to be stable or ref-based
  const handleTimerFinish = useCallback(() => {
    playAlert();

    // In Auto mode, advance to next step automatically
    // But we need to access the LATEST mode state.
    // Since this callback is passed to useTimer, we need to be careful with stale closures.
    // However, we will handle the "what happens next" logic via an effect on the timer state in this hook
    // OR we pass a specific callback that knows the current state.
    // Actually, useTimer just calls onFinish.

    // We'll use a ref for mode to check inside the callback without dependency cycle
    if (modeRef.current === "auto") {
      setTimeout(() => {
        advanceStep();
      }, 1000); // 1s delay for better UX
    }
  }, []);

  const {
    timeLeft,
    isRunning,
    start: startTimer,
    pause: pauseTimer,
    reset: resetTimer,
  } = useTimer(0, handleTimerFinish);

  const modeRef = useRef(mode);
  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  // Load persistence
  useEffect(() => {
    const savedMode = localStorage.getItem("brew_mode") as BrewMode;
    if (savedMode) setMode(savedMode);
    setIsHydrated(true);
  }, []);

  // Save persistence
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem("brew_mode", mode);
    }
  }, [mode, isHydrated]);

  const currentStep = RECIPE[currentStepIndex];
  const isFinished = status === "finished";

  const startBrew = useCallback(() => {
    setStatus("brewing");
    setCurrentStepIndex(0);
    requestLock();
    // Step 0 (Add Coffee) usually has no timer, but if it did:
    if (RECIPE[0].duration && RECIPE[0].autoStart && mode === "auto") {
      startTimer(RECIPE[0].duration);
    } else {
      resetTimer(RECIPE[0].duration || 0); // Prepare timer but don't start
    }
  }, [mode, requestLock, startTimer, resetTimer]);

  const advanceStep = useCallback(() => {
    setCurrentStepIndex((prev) => {
      const nextIndex = prev + 1;
      if (nextIndex >= RECIPE.length) {
        setStatus("finished");
        releaseLock();
        localStorage.setItem("last_brew_date", new Date().toISOString());
        return prev;
      }

      const nextStep = RECIPE[nextIndex];

      // If next step has duration
      if (nextStep.duration) {
        if (modeRef.current === "auto" || nextStep.autoStart) {
          // Auto start timer
          startTimer(nextStep.duration);
        } else {
          // Manual mode: just reset timer to duration and wait for user
          resetTimer(nextStep.duration);
        }
      } else {
        // No duration (manual step)
        resetTimer(0);
      }

      return nextIndex;
    });
  }, [releaseLock, startTimer, resetTimer]);

  const resetBrew = useCallback(() => {
    setStatus("idle");
    setCurrentStepIndex(0);
    resetTimer(0);
    releaseLock();
  }, [resetTimer, releaseLock]);

  const toggleMode = useCallback(() => {
    setMode((prev) => (prev === "auto" ? "manual" : "auto"));
  }, []);

  return {
    currentStepIndex,
    currentStep,
    status,
    mode,
    timeLeft,
    isTimerRunning: isRunning,
    totalSteps: RECIPE.length,
    startBrew,
    resetBrew,
    nextStep: advanceStep,
    startTimer, // Expose for manual start
    pauseTimer,
    toggleMode,
    isHydrated,
  };
}
