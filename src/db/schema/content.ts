import { pgTable, text, timestamp, uuid, integer, jsonb } from 'drizzle-orm/pg-core';

// Lessons
export const lessons = pgTable('lessons', {
  id: uuid('id').defaultRandom().primaryKey(),
  lessonNumber: integer('lesson_number').notNull().unique(),
  title: text('title').notNull(),
  japaneseTitle: text('japanese_title').notNull(),
  summary: text('summary').notNull(),
  grammarTopic: text('grammar_topic').notNull(),
  jlptLevel: text('jlpt_level').default('N5').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// Kana Characters (Hiragana / Katakana)
export const kanaChars = pgTable('kana_chars', {
  id: uuid('id').defaultRandom().primaryKey(),
  character: text('character').notNull(),
  romaji: text('romaji').notNull(),
  script: text('script').default('hiragana').notNull(), // 'hiragana' | 'katakana'
  category: text('category').notNull(), // 'base' | 'dakuten' | 'handakuten' | 'yoon'
  rowGroup: text('row_group').notNull(), // 'vowels', 'k-row', 's-row', 't-row', 'n-row', 'h-row', 'm-row', 'y-row', 'r-row', 'w-row', 'n'
  mnemonic: text('mnemonic'),
  exampleWord: text('example_word'),
  exampleReading: text('example_reading'),
  exampleMeaning: text('example_meaning'),
  orderIndex: integer('order_index').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// Vocab Items (Module 5)
export const vocabItems = pgTable('vocab_items', {
  id: uuid('id').defaultRandom().primaryKey(),
  lessonNumber: integer('lesson_number').notNull(),
  word: text('word').notNull(),
  reading: text('reading').notNull(),
  romaji: text('romaji').notNull(),
  meaning: text('meaning').notNull(),
  partOfSpeech: text('part_of_speech').notNull(), // 'noun' | 'pronoun' | 'verb' | 'adjective' | 'particle' | 'expression'
  imageUrl: text('image_url'),
  exampleSentence: text('example_sentence').notNull(),
  exampleReading: text('example_reading').notNull(),
  exampleMeaning: text('example_meaning').notNull(),
  orderIndex: integer('order_index').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// Grammar Patterns (Module 6)
export const grammarPatterns = pgTable('grammar_patterns', {
  id: uuid('id').defaultRandom().primaryKey(),
  lessonNumber: integer('lesson_number').notNull(),
  patternKey: text('pattern_key').notNull().unique(),
  title: text('title').notNull(),
  japaneseTitle: text('japanese_title').notNull(),
  formula: text('formula').notNull(),
  explanation: text('explanation').notNull(),
  skillTag: text('skill_tag').notNull(),
  examples: jsonb('examples')
    .$type<
      Array<{
        japanese: string;
        reading: string;
        romaji: string;
        english: string;
      }>
    >()
    .notNull(),
  commonMistakes: text('common_mistakes').notNull(),
  orderIndex: integer('order_index').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// Sentence Items (Module 8)
export const sentenceItems = pgTable('sentence_items', {
  id: uuid('id').defaultRandom().primaryKey(),
  lessonNumber: integer('lesson_number').notNull(),
  type: text('type').notNull(), // 'transformation' | 'translation'
  prompt: text('prompt').notNull(), // Instructions or prompt description
  promptJapanese: text('prompt_japanese'), // Base sentence to transform
  transformationType: text('transformation_type'), // 'negative' | 'question' | 'substitution' | null
  acceptedAnswers: jsonb('accepted_answers').$type<string[]>().notNull(),
  keywordSlots: jsonb('keyword_slots').$type<string[]>().notNull(), // Required keywords/particles
  skillTag: text('skill_tag').notNull(), // e.g. 'particle_wa', 'negative_copula', 'particle_ka'
  allowedVocabLessonMax: integer('allowed_vocab_lesson_max').notNull(), // Cumulative tag check
  hint: text('hint'),
  orderIndex: integer('order_index').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export type Lesson = typeof lessons.$inferSelect;
export type NewLesson = typeof lessons.$inferInsert;
export type KanaChar = typeof kanaChars.$inferSelect;
export type NewKanaChar = typeof kanaChars.$inferInsert;
export type VocabItem = typeof vocabItems.$inferSelect;
export type NewVocabItem = typeof vocabItems.$inferInsert;
export type GrammarPattern = typeof grammarPatterns.$inferSelect;
export type NewGrammarPattern = typeof grammarPatterns.$inferInsert;
export type SentenceItem = typeof sentenceItems.$inferSelect;
export type NewSentenceItem = typeof sentenceItems.$inferInsert;
