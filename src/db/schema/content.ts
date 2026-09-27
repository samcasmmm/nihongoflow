import { pgTable, text, timestamp, uuid, integer } from "drizzle-orm/pg-core";

// Lessons
export const lessons = pgTable("lessons", {
  id: uuid("id").defaultRandom().primaryKey(),
  lessonNumber: integer("lesson_number").notNull().unique(),
  title: text("title").notNull(),
  japaneseTitle: text("japanese_title").notNull(),
  summary: text("summary").notNull(),
  grammarTopic: text("grammar_topic").notNull(),
  jlptLevel: text("jlpt_level").default("N5").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// Kana Characters (Hiragana / Katakana)
export const kanaChars = pgTable("kana_chars", {
  id: uuid("id").defaultRandom().primaryKey(),
  character: text("character").notNull(),
  romaji: text("romaji").notNull(),
  script: text("script").default("hiragana").notNull(), // 'hiragana' | 'katakana'
  category: text("category").notNull(), // 'base' | 'dakuten' | 'handakuten' | 'yoon'
  rowGroup: text("row_group").notNull(), // 'vowels', 'k-row', 's-row', 't-row', 'n-row', 'h-row', 'm-row', 'y-row', 'r-row', 'w-row', 'n'
  mnemonic: text("mnemonic"),
  exampleWord: text("example_word"),
  exampleReading: text("example_reading"),
  exampleMeaning: text("example_meaning"),
  orderIndex: integer("order_index").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export type Lesson = typeof lessons.$inferSelect;
export type NewLesson = typeof lessons.$inferInsert;
export type KanaChar = typeof kanaChars.$inferSelect;
export type NewKanaChar = typeof kanaChars.$inferInsert;
