import { gamificationRepository } from "../repositories/gamification-repository";

export const gamificationService = {
  async getSummary(userId: string) {
    const state = await gamificationRepository.getOrCreateState(userId);
    if (!state) {
      return {
        totalXp: 0,
        level: 0,
        levelLabel: "Absolute Beginner",
        nextLevelXp: 50,
        levelProgressPercent: 0,
        currentStreak: 0,
        longestStreak: 0,
        streakFreezesAvailable: 1,
        dailyGoalXp: 10,
        dailyEarnedXp: 0,
        dailyGoalMet: false,
        activeMissions: [],
      };
    }
    const dailyEarnedXp = await gamificationRepository.getDailyEarnedXp(userId);
    let missions = await gamificationRepository.getActiveMissions(userId);

    // If learner has no active missions yet, seed an initial pedagogical guidance mission
    if (missions.length === 0) {
      const initialMission = await gamificationRepository.createMission(userId, {
        type: "weakness_reinforce",
        targetTag: "particle_wa_ga",
        title: "Master Topic vs Subject Particles (は vs が)",
        description: "Practice 5 questions contrasting topic marker 'は' and subject identifier 'が'.",
        targetCount: 5,
      });
      missions = [initialMission];
    }

    const level = Math.floor(Math.sqrt(state.totalXp / 50));
    const nextLevelXp = Math.pow(level + 1, 2) * 50;
    const currentLevelBaseXp = Math.pow(level, 2) * 50;
    const levelProgressPercent = Math.min(
      100,
      Math.round(((state.totalXp - currentLevelBaseXp) / Math.max(1, nextLevelXp - currentLevelBaseXp)) * 100)
    );

    const levelLabels = [
      "Absolute Beginner",
      "Hiragana Explorer",
      "Sentence Builder",
      "Grammar Novice",
      "Conversation Apprentice",
      "Japanese Scholar",
    ];
    const levelLabel = levelLabels[Math.min(level, levelLabels.length - 1)];

    return {
      totalXp: state.totalXp,
      level,
      levelLabel,
      nextLevelXp,
      levelProgressPercent,
      currentStreak: state.currentStreak,
      longestStreak: state.longestStreak,
      streakFreezesAvailable: state.streakFreezesAvailable,
      dailyGoalXp: state.dailyGoalXp,
      dailyEarnedXp,
      dailyGoalMet: dailyEarnedXp >= state.dailyGoalXp,
      activeMissions: missions.map((m) => ({
        id: m.id,
        type: m.type,
        targetTag: m.targetTag,
        title: m.title,
        description: m.description,
        currentCount: m.currentCount,
        targetCount: m.targetCount,
        progressPercent: Math.min(100, Math.round((m.currentCount / m.targetCount) * 100)),
        completed: m.completed,
      })),
    };
  },

  async recordStudySession(userId: string, xpEarned: number, source: string, entityId?: string) {
    // 1. Tick streak server-side
    const streakState = await gamificationRepository.recordActivityAndTickStreak(userId);

    // 2. Add XP
    const updatedState = await gamificationRepository.addXp(userId, xpEarned, source, entityId);

    return {
      newXp: updatedState.totalXp,
      streak: streakState.currentStreak,
      freezes: streakState.streakFreezesAvailable,
    };
  },
};
