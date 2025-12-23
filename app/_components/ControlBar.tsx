"use client";

import { BrewStatus, BrewMode } from "../_hooks/useBrew";

interface ControlBarProps {
  status: BrewStatus;
  mode: BrewMode;
  isTimerRunning: boolean;
  onStart: () => void;
  onNext: () => void;
  onReset: () => void;
  currentStepHasTimer: boolean;
}

export function ControlBar({
  status,
  mode,
  isTimerRunning,
  onStart,
  onNext,
  onReset,
  currentStepHasTimer,
}: ControlBarProps) {
  if (status === "idle" || status === "finished") {
    return (
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/80 backdrop-blur-md border-t border-zinc-100 pb-8 z-40">
        <button
          onClick={onStart}
          className="w-full h-14 bg-primary text-white rounded-full font-semibold text-lg hover:bg-amber-700 active:scale-95 transition-all shadow-lg shadow-amber-500/30"
        >
          {status === "finished" ? "Brew Again" : "Start Brew"}
        </button>
      </div>
    );
  }

  // Brewing state
  return (
    <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/90 backdrop-blur-lg border-t border-zinc-100 pb-8 z-40 flex gap-4 items-center">
      <button
        onClick={onReset}
        className="h-14 w-14 flex items-center justify-center rounded-full bg-zinc-100 text-zinc-500 hover:bg-zinc-200"
        aria-label="Reset"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 12a9 9 0 1 0 18 0 9 9 0 01-18 0" />
          <path d="M9 12h6" />
        </svg>
      </button>

      {/* Main Action Button */}
      {/* 
        Logic:
        - If Timer is running & Auto Mode: Show "Running..." (disabled?) or "Skip"? User might want to skip.
        - If Timer is running & Manual Mode: Show "Next Step"? Or "Stop Timer"?
          App spec says "Mode B: User taps Next Step".
        - If Timer finished or No Timer: Show "Next Step".
      */}
      <button
        onClick={onNext}
        className={`flex-1 h-14 rounded-full font-semibold text-lg transition-all shadow-lg active:scale-95
          ${
            isTimerRunning && mode === "auto"
              ? "bg-zinc-100 text-zinc-400 shadow-none"
              : "bg-primary text-white shadow-amber-500/30 hover:bg-amber-700"
          }`}
      >
        {isTimerRunning && mode === "auto" ? "Brewing..." : "Next Step"}
      </button>
    </div>
  );
}
