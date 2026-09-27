import { db } from "@/db/client";
import { sentenceItems, SentenceItem } from "@/db/schema";
import { eq, asc } from "drizzle-orm";

export const sentenceSelector = {
  async getSentencesForLesson(lessonNumber: number, limit = 5): Promise<SentenceItem[]> {
    const items = await db
      .select()
      .from(sentenceItems)
      .where(eq(sentenceItems.lessonNumber, lessonNumber))
      .orderBy(asc(sentenceItems.orderIndex))
      .limit(limit);

    return items;
  },

  async getSentenceById(id: string): Promise<SentenceItem | undefined> {
    return db.query.sentenceItems.findFirst({
      where: (table, { eq }) => eq(table.id, id),
    });
  },
};
