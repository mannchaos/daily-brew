"use client";

import { useBrew } from "../_hooks/useBrew";
import { ProgressBar } from "./ProgressBar";
import { TimerDisplay } from "./TimerDisplay";
import { StepList } from "./StepList";
import { ControlBar } from "./ControlBar";
import { RECIPE } from "../_data/recipe";
import { useEffect, useState } from "react";

export function BrewScreen() {
  const brew = useBrew();

  // Mounted check for hydration safety
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null; // or loading skeleton

  return (
    <div className="flex flex-col h-[100dvh] bg-background relative overflow-hidden">
      {/* Top Progress */}
      {brew.status === "brewing" && (
        <ProgressBar
          currentStepIndex={brew.currentStepIndex}
          totalSteps={brew.totalSteps}
        />
      )}

      {/* Header */}
      <header className="flex justify-between items-center px-6 pt-8 pb-2 z-10 shrink-0">
        <h1 className="text-xl font-bold tracking-tight text-foreground">
          Daily Brew
        </h1>
        <button
          onClick={brew.toggleMode}
          className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
            brew.mode === "auto"
              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
              : "bg-zinc-50 text-zinc-600 border-zinc-200"
          }`}
        >
          {brew.mode === "auto" ? "Auto Mode" : "Manual Mode"}
        </button>
      </header>

      {/* Timer / Info Area */}
      {/* Logic: 
         - If Idle: Show recipe summary or welcome.
         - If Brewing: Show Timer (if timer active) or current instruction summary?
         - Actually, the StepList shows instructions. The "Timer Display" should probably
           only show up if there IS a timer for this step, or if we want to show a big timer always.
           Let's show TimerDisplay if there's a duration for the current step OR if we are just running.
      */}
      <div className="shrink-0">
        {brew.status === "idle" ? (
          <div className="px-6 py-4">
            <h2 className="text-3xl font-light text-zinc-400 leading-tight">
              French Press
              <br />
              <span className="text-foreground font-semibold">
                Heavy Bodied Black
              </span>
            </h2>
            <div className="mt-4 flex gap-4 text-sm text-zinc-500">
              <span className="flex items-center gap-1">☕ 20g Coffee</span>
              <span className="flex items-center gap-1">💧 240ml Water</span>
              <span className="flex items-center gap-1">⏱ ~5m</span>
            </div>
          </div>
        ) : (
          <TimerDisplay
            seconds={brew.timeLeft}
            isRunning={brew.isTimerRunning}
          />
        )}
      </div>

      {/* Step List */}
      <StepList
        steps={RECIPE}
        currentStepIndex={brew.currentStepIndex}
        isBrewing={brew.status === "brewing"}
      />

      {/* Controls */}
      <ControlBar
        status={brew.status}
        mode={brew.mode}
        isTimerRunning={brew.isTimerRunning}
        onStart={brew.startBrew}
        onNext={brew.nextStep}
        onReset={brew.resetBrew}
        currentStepHasTimer={!!brew.currentStep.duration}
      />
    </div>
  );
}
