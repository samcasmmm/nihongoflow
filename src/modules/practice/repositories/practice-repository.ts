import { db } from "@/db/client";
import {
  practiceSessions,
  attempts,
  sentenceItems,
} from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { transformationEvaluator } from "../services/transformation-evaluator";
import { translationEvaluator } from "../services/translation-evaluator";
import { gamificationRepository } from "@/modules/gamification/repositories/gamification-repository";

export const practiceRepository = {
  async startOrResumeSession(userId: string, lessonNumber: number) {
    // 1. Check for existing in_progress session
    let session = await db.query.practiceSessions.findFirst({
      where: (table, { eq, and }) =>
        and(
          eq(table.userId, userId),
          eq(table.lessonNumber, lessonNumber),
          eq(table.status, "in_progress")
        ),
    });

    // 2. Fetch sentences for this lesson
    const sentences = await db
      .select()
      .from(sentenceItems)
      .where(eq(sentenceItems.lessonNumber, lessonNumber))
      .orderBy(asc(sentenceItems.orderIndex));

    if (!session) {
      const [created] = await db
        .insert(practiceSessions)
        .values({
          userId,
          lessonNumber,
          totalItems: sentences.length,
          completedItems: 0,
          correctCount: 0,
          score: 0,
          status: "in_progress",
        })
        .returning();
      session = created;
    }

    // 3. Fetch past attempts for this session
    const sessionAttempts = await db
      .select()
      .from(attempts)
      .where(eq(attempts.sessionId, session.id));

    return {
      session,
      sentences,
      attempts: sessionAttempts,
    };
  },

  async recordAttempt(
    sessionId: string,
    userId: string,
    sentenceItemId: string,
    userAnswer: string,
    responseTimeMs = 0
  ) {
    // 1. Fetch item & session
    const item = await db.query.sentenceItems.findFirst({
      where: (table, { eq }) => eq(table.id, sentenceItemId),
    });

    if (!item) {
      throw new Error(`Sentence item ${sentenceItemId} not found`);
    }

    const session = await db.query.practiceSessions.findFirst({
      where: (table, { eq }) => eq(table.id, sessionId),
    });

    if (!session) {
      throw new Error(`Practice session ${sessionId} not found`);
    }

    // 2. Evaluate answer
    const evalResult =
      item.type === "transformation"
        ? transformationEvaluator.evaluate(item, userAnswer)
        : translationEvaluator.evaluate(item, userAnswer);

    // 3. Record attempt
    await db.insert(attempts).values({
      sessionId,
      userId,
      sentenceItemId,
      userAnswer,
      isCorrect: evalResult.isCorrect,
      errorTag: evalResult.errorTag,
      feedback: evalResult.feedback,
      responseTimeMs,
    });

    // 4. Update session
    const newCompleted = session.completedItems + 1;
    const newCorrect = session.correctCount + (evalResult.isCorrect ? 1 : 0);
    const score = Math.round((newCorrect / Math.max(1, session.totalItems)) * 100);
    const isCompleted = newCompleted >= session.totalItems;

    const [updatedSession] = await db
      .update(practiceSessions)
      .set({
        completedItems: newCompleted,
        correctCount: newCorrect,
        score,
        status: isCompleted ? "completed" : "in_progress",
        completedAt: isCompleted ? new Date() : null,
        updatedAt: new Date(),
      })
      .where(eq(practiceSessions.id, sessionId))
      .returning();

    // 5. Server-authoritative gamification XP
    if (evalResult.isCorrect) {
      // Award 2-5 XP per correct practice sentence (design.md §10)
      await gamificationRepository.addXp(userId, 3, "practice_item", sentenceItemId);
      await gamificationRepository.recordActivityAndTickStreak(userId);
    }

    return {
      isCorrect: evalResult.isCorrect,
      errorTag: evalResult.errorTag,
      feedback: evalResult.feedback,
      session: updatedSession,
      isSessionComplete: isCompleted,
    };
  },
};
