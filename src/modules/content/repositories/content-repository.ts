import { db } from "@/db/client";
import {
  lessons,
  vocabItems,
  kanaChars,
  grammarPatterns,
  sentenceItems,
  Lesson,
  VocabItem,
  KanaChar,
  GrammarPattern,
  SentenceItem,
  NewLesson,
  NewVocabItem,
  NewKanaChar,
  NewGrammarPattern,
  NewSentenceItem,
} from "@/db/schema";
import { eq, asc } from "drizzle-orm";

export const contentRepository = {
  // ==========================================
  // 1. LESSONS
  // ==========================================
  async getAllLessons(): Promise<Lesson[]> {
    return db.select().from(lessons).orderBy(asc(lessons.lessonNumber));
  },

  async createLesson(data: NewLesson): Promise<Lesson> {
    const [created] = await db.insert(lessons).values(data).returning();
    return created;
  },

  async updateLesson(id: string, data: Partial<NewLesson>): Promise<Lesson> {
    const [updated] = await db
      .update(lessons)
      .set(data)
      .where(eq(lessons.id, id))
      .returning();
    return updated;
  },

  async deleteLesson(id: string): Promise<boolean> {
    const [deleted] = await db.delete(lessons).where(eq(lessons.id, id)).returning();
    return !!deleted;
  },

  // ==========================================
  // 2. VOCABULARY
  // ==========================================
  async getAllVocab(lessonNumber?: number): Promise<VocabItem[]> {
    if (lessonNumber) {
      return db
        .select()
        .from(vocabItems)
        .where(eq(vocabItems.lessonNumber, lessonNumber))
        .orderBy(asc(vocabItems.orderIndex));
    }
    return db
      .select()
      .from(vocabItems)
      .orderBy(asc(vocabItems.lessonNumber), asc(vocabItems.orderIndex));
  },

  async createVocab(data: NewVocabItem): Promise<VocabItem> {
    const [created] = await db.insert(vocabItems).values(data).returning();
    return created;
  },

  async updateVocab(id: string, data: Partial<NewVocabItem>): Promise<VocabItem> {
    const [updated] = await db
      .update(vocabItems)
      .set(data)
      .where(eq(vocabItems.id, id))
      .returning();
    return updated;
  },

  async deleteVocab(id: string): Promise<boolean> {
    const [deleted] = await db.delete(vocabItems).where(eq(vocabItems.id, id)).returning();
    return !!deleted;
  },

  // ==========================================
  // 3. KANA CHARACTERS
  // ==========================================
  async getAllKana(script = "hiragana"): Promise<KanaChar[]> {
    return db
      .select()
      .from(kanaChars)
      .where(eq(kanaChars.script, script))
      .orderBy(asc(kanaChars.orderIndex));
  },

  async createKana(data: NewKanaChar): Promise<KanaChar> {
    const [created] = await db.insert(kanaChars).values(data).returning();
    return created;
  },

  async updateKana(id: string, data: Partial<NewKanaChar>): Promise<KanaChar> {
    const [updated] = await db
      .update(kanaChars)
      .set(data)
      .where(eq(kanaChars.id, id))
      .returning();
    return updated;
  },

  async deleteKana(id: string): Promise<boolean> {
    const [deleted] = await db.delete(kanaChars).where(eq(kanaChars.id, id)).returning();
    return !!deleted;
  },

  // ==========================================
  // 4. GRAMMAR PATTERNS
  // ==========================================
  async getAllGrammar(lessonNumber?: number): Promise<GrammarPattern[]> {
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

  async createGrammar(data: NewGrammarPattern): Promise<GrammarPattern> {
    const [created] = await db.insert(grammarPatterns).values(data).returning();
    return created;
  },

  async updateGrammar(id: string, data: Partial<NewGrammarPattern>): Promise<GrammarPattern> {
    const [updated] = await db
      .update(grammarPatterns)
      .set(data)
      .where(eq(grammarPatterns.id, id))
      .returning();
    return updated;
  },

  async deleteGrammar(id: string): Promise<boolean> {
    const [deleted] = await db.delete(grammarPatterns).where(eq(grammarPatterns.id, id)).returning();
    return !!deleted;
  },

  // ==========================================
  // 5. PRACTICE SENTENCE ITEMS
  // ==========================================
  async getAllSentences(lessonNumber?: number): Promise<SentenceItem[]> {
    if (lessonNumber) {
      return db
        .select()
        .from(sentenceItems)
        .where(eq(sentenceItems.lessonNumber, lessonNumber))
        .orderBy(asc(sentenceItems.orderIndex));
    }
    return db
      .select()
      .from(sentenceItems)
      .orderBy(asc(sentenceItems.lessonNumber), asc(sentenceItems.orderIndex));
  },

  async createSentence(data: NewSentenceItem): Promise<SentenceItem> {
    const [created] = await db.insert(sentenceItems).values(data).returning();
    return created;
  },

  async updateSentence(id: string, data: Partial<NewSentenceItem>): Promise<SentenceItem> {
    const [updated] = await db
      .update(sentenceItems)
      .set(data)
      .where(eq(sentenceItems.id, id))
      .returning();
    return updated;
  },

  async deleteSentence(id: string): Promise<boolean> {
    const [deleted] = await db.delete(sentenceItems).where(eq(sentenceItems.id, id)).returning();
    return !!deleted;
  },
};
