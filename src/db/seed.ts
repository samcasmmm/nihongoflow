import { db } from "./client";
import { lessons, kanaChars } from "./schema";
import { LESSON_DATA } from "./seeds/lessons-data";
import { KANA_DATA } from "./seeds/kana-data";
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
