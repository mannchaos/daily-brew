"use client";

import { useEffect, useRef } from "react";
import { BrewStep } from "../_data/recipe";

interface StepListProps {
  steps: BrewStep[];
  currentStepIndex: number;
  isBrewing: boolean;
}

export function StepList({
  steps,
  currentStepIndex,
  isBrewing,
}: StepListProps) {
  const activeRef = useRef<HTMLDivElement>(null);

  // Auto-scroll logic
  useEffect(() => {
    if (activeRef.current) {
      activeRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "nearest",
      });
    }
  }, [currentStepIndex]);

  return (
    <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6 pb-32">
      {steps.map((step, index) => {
        const isActive = index === currentStepIndex && isBrewing;
        const isPast = index < currentStepIndex;
        const isFuture = index > currentStepIndex;

        // Styling states
        // Active: full opacity, highlighted border?
        // Past: text-zinc-400, maybe checkmark
        // Future: text-zinc-300

        let containerClass =
          "p-4 rounded-2xl border transition-all duration-300 ";
        if (isActive) {
          containerClass +=
            "bg-white border-primary/50 shadow-lg ring-1 ring-primary/20 transform scale-[1.02] border-l-4 border-l-primary";
        } else if (isPast) {
          containerClass +=
            "bg-surface-highlight border-transparent opacity-60";
        } else {
          containerClass += "bg-white border-transparent opacity-40 grayscale";
        }

        return (
          <div
            key={step.id}
            ref={isActive ? activeRef : null}
            className={containerClass}
          >
            <div className="flex justify-between items-center mb-2">
              <h3
                className={`text-lg font-medium ${
                  isActive ? "text-primary" : "text-foreground"
                }`}
              >
                {step.title}
                {isPast && <span className="ml-2 text-green-500">✓</span>}
              </h3>
              {step.duration && (
                <span className="text-xs font-mono bg-zinc-100 px-2 py-1 rounded-full text-zinc-500">
                  {Math.floor(step.duration / 60)}:
                  {(step.duration % 60).toString().padStart(2, "0")}
                </span>
              )}
            </div>
            <ul className="space-y-1">
              {step.instruction.map((line, i) => (
                <li
                  key={i}
                  className={`text-sm leading-relaxed ${
                    isActive ? "text-zinc-700" : "text-zinc-500"
                  }`}
                >
                  {line}
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
