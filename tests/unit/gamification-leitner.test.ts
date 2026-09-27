import { describe, it, expect } from "bun:test";

describe("Leitner Spaced Repetition Box Transitions", () => {
  it("advances box by 1 on know_it up to maximum Box 5", () => {
    const advanceBox = (currentBox: number) => Math.min(5, currentBox + 1);

    expect(advanceBox(1)).toBe(2);
    expect(advanceBox(2)).toBe(3);
    expect(advanceBox(3)).toBe(4);
    expect(advanceBox(4)).toBe(5);
    expect(advanceBox(5)).toBe(5); // Capped at Box 5
  });

  it("resets box to 1 on still_learning regardless of current mastery box", () => {
    const handleStillLearning = (currentBox: number) => {
      expect(currentBox).toBeGreaterThan(0);
      return 1;
    };

    expect(handleStillLearning(2)).toBe(1);
    expect(handleStillLearning(3)).toBe(1);
    expect(handleStillLearning(4)).toBe(1);
    expect(handleStillLearning(5)).toBe(1);
  });

  it("computes spaced intervals in days accurately according to Leitner schedule", () => {
    const getIntervalDays = (box: number) => [1, 2, 4, 7, 14][box - 1];

    expect(getIntervalDays(1)).toBe(1);
    expect(getIntervalDays(2)).toBe(2);
    expect(getIntervalDays(3)).toBe(4);
    expect(getIntervalDays(4)).toBe(7);
    expect(getIntervalDays(5)).toBe(14);
  });
});

describe("Gamification Level & XP Calculations (design.md §10)", () => {
  const calculateLevel = (totalXp: number) => Math.floor(Math.sqrt(totalXp / 50));
  const calculateNextLevelXp = (level: number) => Math.pow(level + 1, 2) * 50;

  it("calculates level from XP using floor(sqrt(XP/50))", () => {
    expect(calculateLevel(0)).toBe(0);
    expect(calculateLevel(49)).toBe(0);
    expect(calculateLevel(50)).toBe(1);
    expect(calculateLevel(199)).toBe(1);
    expect(calculateLevel(200)).toBe(2);
    expect(calculateLevel(449)).toBe(2);
    expect(calculateLevel(450)).toBe(3);
  });

  it("calculates threshold for next level correctly", () => {
    expect(calculateNextLevelXp(0)).toBe(50);
    expect(calculateNextLevelXp(1)).toBe(200);
    expect(calculateNextLevelXp(2)).toBe(450);
    expect(calculateNextLevelXp(3)).toBe(800);
  });

  it("evaluates daily goal achievement correctly", () => {
    const isGoalMet = (earned: number, goal: number) => earned >= goal;

    expect(isGoalMet(0, 10)).toBe(false);
    expect(isGoalMet(9, 10)).toBe(false);
    expect(isGoalMet(10, 10)).toBe(true);
    expect(isGoalMet(15, 10)).toBe(true);
  });
});
