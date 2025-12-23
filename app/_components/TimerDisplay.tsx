"use client";

import { useEffect, useState } from "react";

interface TimerDisplayProps {
  seconds: number;
  isRunning: boolean;
}

export function TimerDisplay({ seconds, isRunning }: TimerDisplayProps) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  const formatted = `${m}:${s.toString().padStart(2, "0")}`;

  // Pulse effect: use tailwind animate-pulse
  // Only pulse if running

  return (
    <div
      className={`text-center py-8 transition-colors duration-300 ${
        isRunning ? "text-primary" : "text-foreground"
      }`}
    >
      <div
        className={`text-7xl font-light tracking-tighter tabular-nums ${
          isRunning ? "animate-pulse" : ""
        }`}
      >
        {formatted}
      </div>
    </div>
  );
}
