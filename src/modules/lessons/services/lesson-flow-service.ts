import { db } from "@/db/client";
import { vocabItems, grammarPatterns, sentenceItems } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { lessonProgressRepository } from "../repositories/lesson-progress-repository";

export const lessonFlowService = {
  async getLessonDetails(userId: string, lessonNumber: number) {
    const lesson = await db.query.lessons.findFirst({
      where: (table, { eq }) => eq(table.lessonNumber, lessonNumber),
    });

    if (!lesson) {
      throw new Error(`Lesson ${lessonNumber} not found`);
    }

    const vocab = await db
      .select()
      .from(vocabItems)
      .where(eq(vocabItems.lessonNumber, lessonNumber))
      .orderBy(asc(vocabItems.orderIndex));

    const grammar = await db
      .select()
      .from(grammarPatterns)
      .where(eq(grammarPatterns.lessonNumber, lessonNumber))
      .orderBy(asc(grammarPatterns.orderIndex));

    const sentences = await db
      .select()
      .from(sentenceItems)
      .where(eq(sentenceItems.lessonNumber, lessonNumber))
      .orderBy(asc(sentenceItems.orderIndex));

    const progress = await lessonProgressRepository.getOrCreate(userId, lessonNumber);

    return {
      lesson,
      vocab,
      grammar,
      sentences,
      progress,
    };
  },

  async updateProgress(
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
    return lessonProgressRepository.updateStage(userId, lessonNumber, data);
  },
};
