import { db } from "./client";
import { lessons, kanaChars, vocabItems, grammarPatterns, sentenceItems } from "./schema";
import { LESSON_DATA } from "./seeds/lessons-data";
import { KANA_DATA } from "./seeds/kana-data";
import { VOCAB_DATA } from "./seeds/vocab-data";
import { GRAMMAR_DATA } from "./seeds/grammar-data";
import { SENTENCE_DATA } from "./seeds/sentence-data";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env" });

export async function runSeed() {
  console.log("🌱 Seeding NihongoFlow curriculum & kana decks...");

  // 1. Seed Lessons
  for (const lesson of LESSON_DATA) {
    await db
      .insert(lessons)
      .values(lesson)
      .onConflictDoUpdate({
        target: lessons.lessonNumber,
        set: {
          title: lesson.title,
          japaneseTitle: lesson.japaneseTitle,
          summary: lesson.summary,
          grammarTopic: lesson.grammarTopic,
          jlptLevel: lesson.jlptLevel,
        },
      });
  }
  console.log(`✓ Seeded ${LESSON_DATA.length} pilot lessons.`);

  // 2. Seed Kana Characters
  for (const kana of KANA_DATA) {
    const existing = await db.query.kanaChars.findFirst({
      where: (table, { eq, and }) =>
        and(eq(table.character, kana.character), eq(table.script, "hiragana")),
    });

    if (!existing) {
      await db.insert(kanaChars).values({
        character: kana.character,
        romaji: kana.romaji,
        script: "hiragana",
        category: kana.category,
        rowGroup: kana.rowGroup,
        mnemonic: kana.mnemonic,
        exampleWord: kana.exampleWord,
        exampleReading: kana.exampleReading,
        exampleMeaning: kana.exampleMeaning,
        orderIndex: kana.orderIndex,
      });
    }
  }
  console.log(`✓ Seeded ${KANA_DATA.length} Hiragana characters (Base 46 + Dakuten + Yōon).`);

  // 3. Seed Vocabulary Items (Module 5)
  for (const vocab of VOCAB_DATA) {
    const existing = await db.query.vocabItems.findFirst({
      where: (table, { eq, and }) =>
        and(eq(table.lessonNumber, vocab.lessonNumber), eq(table.word, vocab.word)),
    });

    if (!existing) {
      await db.insert(vocabItems).values(vocab);
    }
  }
  console.log(`✓ Seeded ${VOCAB_DATA.length} original vocabulary items across Lessons 1–5.`);

  // 4. Seed Grammar Patterns (Module 6)
  for (const pattern of GRAMMAR_DATA) {
    await db
      .insert(grammarPatterns)
      .values(pattern)
      .onConflictDoUpdate({
        target: grammarPatterns.patternKey,
        set: {
          title: pattern.title,
          japaneseTitle: pattern.japaneseTitle,
          formula: pattern.formula,
          explanation: pattern.explanation,
          skillTag: pattern.skillTag,
          examples: pattern.examples,
          commonMistakes: pattern.commonMistakes,
          orderIndex: pattern.orderIndex,
        },
      });
  }
  console.log(`✓ Seeded ${GRAMMAR_DATA.length} original grammar patterns across Lessons 1–5.`);

  // 5. Seed Practice Sentence Bank (Module 8)
  for (const sentence of SENTENCE_DATA) {
    const existing = await db.query.sentenceItems.findFirst({
      where: (table, { eq, and }) =>
        and(eq(table.lessonNumber, sentence.lessonNumber), eq(table.prompt, sentence.prompt)),
    });

    if (!existing) {
      await db.insert(sentenceItems).values(sentence);
    }
  }
  console.log(`✓ Seeded ${SENTENCE_DATA.length} cumulative practice sentence drills.`);
  console.log("✨ Seeding completed successfully!");
}

if (process.argv[1]?.includes("seed.ts")) {
  runSeed()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error("❌ Seed failed:", err);
      process.exit(1);
    });
}
