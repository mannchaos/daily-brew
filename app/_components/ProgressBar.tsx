"use client";

interface ProgressBarProps {
  currentStepIndex: number;
  totalSteps: number;
}

export function ProgressBar({
  currentStepIndex,
  totalSteps,
}: ProgressBarProps) {
  // progress is based on steps completed (so at step 0, progress is 0? or slightly filled?)
  // Let's say at step 0, we are 0%. At step "serve", we are 100%.
  // totalSteps is e.g. 7. Indices 0 to 6.
  const progress = Math.min((currentStepIndex / (totalSteps - 1)) * 100, 100);

  return (
    <div className="fixed top-0 left-0 right-0 h-1.5 bg-surface-highlight z-50">
      <div
        className="h-full bg-primary transition-all duration-500 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
