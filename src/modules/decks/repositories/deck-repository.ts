import { db } from "@/db/client";
import { kanaChars, cardProgress } from "@/db/schema";
import { eq, and, asc } from "drizzle-orm";
import { gamificationRepository } from "@/modules/gamification/repositories/gamification-repository";

export interface KanaCardWithProgress {
  id: string;
  character: string;
  romaji: string;
  script: string;
  category: "base" | "dakuten" | "handakuten" | "yoon";
  rowGroup: string;
  mnemonic: string | null;
  exampleWord: string | null;
  exampleReading: string | null;
  exampleMeaning: string | null;
  orderIndex: number;
  box: number; // 1 to 5
  timesReviewed: number;
  timesCorrect: number;
  lastReviewedAt: Date | null;
}

export interface DeckStats {
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

export const deckRepository = {
  async getHiraganaCards(userId: string, categoryFilter?: string) {
    // 1. Fetch kana characters from DB
    const allChars = await db
      .select()
      .from(kanaChars)
      .where(eq(kanaChars.script, "hiragana"))
      .orderBy(asc(kanaChars.orderIndex));

    // 2. Fetch user's card progress
    const userProgress = await db
      .select()
      .from(cardProgress)
      .where(and(eq(cardProgress.userId, userId), eq(cardProgress.cardType, "kana")));

    const progressMap = new Map<string, typeof userProgress[0]>();
    for (const p of userProgress) {
      progressMap.set(p.cardId, p);
    }

    // 3. Merge cards with progress
    const merged: KanaCardWithProgress[] = allChars.map((char) => {
      const prog = progressMap.get(char.id);
      return {
        id: char.id,
        character: char.character,
        romaji: char.romaji,
        script: char.script,
        category: char.category as KanaCardWithProgress["category"],
        rowGroup: char.rowGroup,
        mnemonic: char.mnemonic,
        exampleWord: char.exampleWord,
        exampleReading: char.exampleReading,
        exampleMeaning: char.exampleMeaning,
        orderIndex: char.orderIndex,
        box: prog?.box ?? 1,
        timesReviewed: prog?.timesReviewed ?? 0,
        timesCorrect: prog?.timesCorrect ?? 0,
        lastReviewedAt: prog?.lastReviewedAt ?? null,
      };
    });

    // 4. Calculate stats across all hiragana cards
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

    const stats: DeckStats = {
      totalCards: merged.length,
      boxDistribution,
      masteredCount,
      learningCount: merged.length - masteredCount - unseenCount,
      unseenCount,
    };

    // 5. Apply category filter if requested
    let filtered = merged;
    if (categoryFilter && categoryFilter !== "all") {
      if (categoryFilter === "dakuten") {
        filtered = merged.filter((c) => c.category === "dakuten" || c.category === "handakuten");
      } else {
        filtered = merged.filter((c) => c.category === categoryFilter);
      }
    }

    return {
      cards: filtered,
      stats,
    };
  },

  async updateCardProgress(
    userId: string,
    cardId: string,
    cardType: "kana" | "vocab",
    action: "know_it" | "still_learning"
  ) {
    // 1. Fetch existing card progress
    const existing = await db.query.cardProgress.findFirst({
      where: (table, { and, eq }) =>
        and(eq(table.userId, userId), eq(table.cardId, cardId), eq(table.cardType, cardType)),
    });

    const currentBox = existing?.box ?? 1;
    let nextBox = currentBox;
    let timesCorrect = existing?.timesCorrect ?? 0;

    if (action === "know_it") {
      nextBox = existing ? Math.min(5, currentBox + 1) : 2;
      timesCorrect += 1;
    } else {
      nextBox = 1; // Leitner reset to Box 1 for reinforcement
    }

    const timesReviewed = (existing?.timesReviewed ?? 0) + 1;
    const now = new Date();

    // Spaced intervals: Box 1 (1d), Box 2 (2d), Box 3 (4d), Box 4 (7d), Box 5 (14d)
    const intervalDays = [1, 2, 4, 7, 14][nextBox - 1];
    const nextReviewAt = new Date(now.getTime() + intervalDays * 24 * 60 * 60 * 1000);

    let updatedProgress;
    if (existing) {
      const [saved] = await db
        .update(cardProgress)
        .set({
          box: nextBox,
          timesReviewed,
          timesCorrect,
          lastReviewedAt: now,
          nextReviewAt,
          updatedAt: now,
        })
        .where(eq(cardProgress.id, existing.id))
        .returning();
      updatedProgress = saved;
    } else {
      const [created] = await db
        .insert(cardProgress)
        .values({
          userId,
          cardType,
          cardId,
          box: nextBox,
          timesReviewed,
          timesCorrect,
          lastReviewedAt: now,
          nextReviewAt,
        })
        .returning();
      updatedProgress = created;
    }

    // 2. Server-authoritative gamification (award 1 XP per card review)
    await gamificationRepository.addXp(userId, 1, "card_review", cardId);
    await gamificationRepository.recordActivityAndTickStreak(userId);

    return {
      progress: updatedProgress,
      xpAwarded: 1,
      newBox: nextBox,
    };
  },
};
