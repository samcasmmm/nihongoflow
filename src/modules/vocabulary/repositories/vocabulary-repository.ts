import { db } from "@/db/client";
import { vocabItems, cardProgress } from "@/db/schema";
import { eq, and, lte, asc } from "drizzle-orm";

export interface VocabCardWithProgress {
  id: string;
  lessonNumber: number;
  word: string;
  reading: string;
  romaji: string;
  meaning: string;
  partOfSpeech: string;
  imageUrl: string | null;
  exampleSentence: string;
  exampleReading: string;
  exampleMeaning: string;
  orderIndex: number;
  box: number; // 1 to 5
  timesReviewed: number;
  timesCorrect: number;
  lastReviewedAt: Date | null;
}

export interface VocabDeckStats {
  totalCards: number;
  boxDistribution: {
    box1: number;
    box2: number;
    box3: number;
    box4: number;
    box5: number;
  };
  masteredCount: number;
  learningCount: number;
  unseenCount: number;
}

export const vocabularyRepository = {
  async getVocabCards(
    userId: string,
    opts?: { lessonNumber?: number; upToLesson?: number }
  ) {
    // 1. Fetch vocab items with filters
    const query = db.select().from(vocabItems);

    let items;
    if (opts?.lessonNumber) {
      items = await query
        .where(eq(vocabItems.lessonNumber, opts.lessonNumber))
        .orderBy(asc(vocabItems.orderIndex));
    } else if (opts?.upToLesson) {
      items = await query
        .where(lte(vocabItems.lessonNumber, opts.upToLesson))
        .orderBy(asc(vocabItems.lessonNumber), asc(vocabItems.orderIndex));
    } else {
      items = await query.orderBy(asc(vocabItems.lessonNumber), asc(vocabItems.orderIndex));
    }

    // 2. Fetch user's card progress
    const userProgress = await db
      .select()
      .from(cardProgress)
      .where(and(eq(cardProgress.userId, userId), eq(cardProgress.cardType, "vocab")));

    const progressMap = new Map<string, typeof userProgress[0]>();
    for (const p of userProgress) {
      progressMap.set(p.cardId, p);
    }

    // 3. Merge cards with progress
    const merged: VocabCardWithProgress[] = items.map((item) => {
      const prog = progressMap.get(item.id);
      return {
        id: item.id,
        lessonNumber: item.lessonNumber,
        word: item.word,
        reading: item.reading,
        romaji: item.romaji,
        meaning: item.meaning,
        partOfSpeech: item.partOfSpeech,
        imageUrl: item.imageUrl,
        exampleSentence: item.exampleSentence,
        exampleReading: item.exampleReading,
        exampleMeaning: item.exampleMeaning,
        orderIndex: item.orderIndex,
        box: prog?.box ?? 1,
        timesReviewed: prog?.timesReviewed ?? 0,
        timesCorrect: prog?.timesCorrect ?? 0,
        lastReviewedAt: prog?.lastReviewedAt ?? null,
      };
    });

    // 4. Calculate Leitner distribution stats
    const boxDistribution = { box1: 0, box2: 0, box3: 0, box4: 0, box5: 0 };
    let unseenCount = 0;
    let masteredCount = 0;

    for (const card of merged) {
      if (card.timesReviewed === 0) {
        unseenCount += 1;
      }
      if (card.box === 5) {
        masteredCount += 1;
      }
      const bKey = `box${card.box}` as keyof typeof boxDistribution;
      boxDistribution[bKey] = (boxDistribution[bKey] || 0) + 1;
    }

    const stats: VocabDeckStats = {
      totalCards: merged.length,
      boxDistribution,
      masteredCount,
      learningCount: merged.length - masteredCount - unseenCount,
      unseenCount,
    };

    return {
      cards: merged,
      stats,
    };
  },
};
