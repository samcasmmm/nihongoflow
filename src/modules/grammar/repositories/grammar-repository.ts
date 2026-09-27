import { db } from "@/db/client";
import { grammarPatterns, GrammarPattern } from "@/db/schema";
import { eq, asc } from "drizzle-orm";

export const grammarRepository = {
  async findAll(lessonNumber?: number): Promise<GrammarPattern[]> {
    if (lessonNumber) {
      return db
        .select()
        .from(grammarPatterns)
        .where(eq(grammarPatterns.lessonNumber, lessonNumber))
        .orderBy(asc(grammarPatterns.orderIndex));
    }

    return db
      .select()
      .from(grammarPatterns)
      .orderBy(asc(grammarPatterns.lessonNumber), asc(grammarPatterns.orderIndex));
  },

  async findByPatternKey(patternKey: string): Promise<GrammarPattern | undefined> {
    const pattern = await db.query.grammarPatterns.findFirst({
      where: (table, { eq }) => eq(table.patternKey, patternKey),
    });
    return pattern;
  },

  async getGroupedByLesson(): Promise<Record<number, GrammarPattern[]>> {
    const all = await this.findAll();
    const grouped: Record<number, GrammarPattern[]> = {};

    for (const pattern of all) {
      if (!grouped[pattern.lessonNumber]) {
        grouped[pattern.lessonNumber] = [];
      }
      grouped[pattern.lessonNumber].push(pattern);
    }

    return grouped;
  },
};
