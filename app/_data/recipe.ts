export type StepId =
  | "add_coffee"
  | "bloom"
  | "pour_remaining"
  | "steep"
  | "stir_settle"
  | "plunge"
  | "serve";

export interface BrewStep {
  id: StepId;
  title: string;
  instruction: string[];
  duration?: number; // Duration in seconds. If undefined, step is manual.
  autoStart?: boolean; // If true, timer starts automatically in auto mode.
}

export const RECIPE: BrewStep[] = [
  {
    id: "add_coffee",
    title: "Add Coffee",
    instruction: ["Add 20g ground coffee into the French Press."],
  },
  {
    id: "bloom",
    title: "Bloom",
    instruction: ["Pour 40ml hot water.", "Stir 10 times to wet the grounds."],
    duration: 30,
  },
  {
    id: "pour_remaining",
    title: "Pour Remaining Water",
    instruction: ["Pour the remaining water (up to 240ml total)."],
  },
  {
    id: "steep",
    title: "Steep",
    instruction: ["Add the lid and let it steep."],
    duration: 180, // 3 minutes
  },
  {
    id: "stir_settle",
    title: "Stir & Settle",
    instruction: ["Stir a few times until the grinds fall to the bottom."],
  },
  {
    id: "plunge",
    title: "Plunge",
    instruction: ["Slowly plunge over 1 minute."],
    duration: 60,
  },
  {
    id: "serve",
    title: "Serve",
    instruction: ["Serve immediately to avoid over-extraction."],
  },
];

export const TOTAL_TIME_SECONDS = RECIPE.reduce(
  (acc, step) => acc + (step.duration || 0),
  0
);
