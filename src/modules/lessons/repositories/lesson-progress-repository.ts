import { db } from "@/db/client";
import { lessonProgress, LessonProgress, profiles } from "@/db/schema";
import { eq } from "drizzle-orm";
import { gamificationRepository } from "@/modules/gamification/repositories/gamification-repository";

// SWOT and Lesson threshold live in config per AGENTS.md §5.4
export const LESSON_CONFIG = {
  PASSING_PRACTICE_THRESHOLD_PERCENT: 70,
  STAGE_XP: 10,
  LESSON_COMPLETE_XP: 25,
};

export const lessonProgressRepository = {
  async getOrCreate(userId: string, lessonNumber: number): Promise<LessonProgress> {
    let progress = await db.query.lessonProgress.findFirst({
      where: (table, { eq, and }) =>
        and(eq(table.userId, userId), eq(table.lessonNumber, lessonNumber)),
    });

    if (!progress) {
      const [created] = await db
        .insert(lessonProgress)
        .values({
          userId,
          lessonNumber,
          currentStage: "vocab",
          vocabCompleted: false,
          grammarCompleted: false,
          practiceCompleted: false,
          practiceScore: 0,
          isCompleted: false,
        })
        .returning();
      progress = created;
    }

    return progress;
  },

  async updateStage(
    userId: string,
    lessonNumber: number,
    data: {
      stage?: "vocab" | "grammar" | "practice" | "complete";
      vocabCompleted?: boolean;
      grammarCompleted?: boolean;
      practiceCompleted?: boolean;
      practiceScore?: number;
    }
  ) {
    const existing = await this.getOrCreate(userId, lessonNumber);

    const isNewlyCompleted =
      !existing.isCompleted &&
      (data.stage === "complete" ||
        (data.practiceScore !== undefined &&
          data.practiceScore >= LESSON_CONFIG.PASSING_PRACTICE_THRESHOLD_PERCENT));

    const nextStage =
      data.stage === "complete" ? "practice" : data.stage || existing.currentStage;

    const [updated] = await db
      .update(lessonProgress)
      .set({
        currentStage: nextStage,
        vocabCompleted: data.vocabCompleted ?? existing.vocabCompleted,
        grammarCompleted: data.grammarCompleted ?? existing.grammarCompleted,
        practiceCompleted: data.practiceCompleted ?? existing.practiceCompleted,
        practiceScore: data.practiceScore ?? existing.practiceScore,
        isCompleted: existing.isCompleted || isNewlyCompleted,
        completedAt: isNewlyCompleted ? new Date() : existing.completedAt,
        updatedAt: new Date(),
      })
      .where(eq(lessonProgress.id, existing.id))
      .returning();

    // If newly completed:
    if (isNewlyCompleted) {
      // 1. Award +25 XP server-authoritatively (design.md §10)
      await gamificationRepository.addXp(
        userId,
        LESSON_CONFIG.LESSON_COMPLETE_XP,
        "lesson_complete",
        String(lessonNumber)
      );
      await gamificationRepository.recordActivityAndTickStreak(userId);

      // 2. Unlock next lesson in user profile
      const profile = await db.query.profiles.findFirst({
        where: (table, { eq }) => eq(table.userId, userId),
      });

      if (profile && profile.startingLesson <= lessonNumber) {
        await db
          .update(profiles)
          .set({
            startingLesson: Math.min(5, lessonNumber + 1),
            updatedAt: new Date(),
          })
          .where(eq(profiles.userId, userId));
      }
    }

    return {
      progress: updated,
      isNewlyCompleted,
      xpAwarded: isNewlyCompleted ? LESSON_CONFIG.LESSON_COMPLETE_XP : 0,
    };
  },
};
