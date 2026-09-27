import * as dotenv from "dotenv";
dotenv.config({ path: ".env" });

import { db } from "./client";
import {
  lessons,
  kanaChars,
  vocabItems,
  grammarPatterns,
  sentenceItems,
  users,
  profiles,
  gamificationState,
} from "./schema";
import { LESSON_DATA } from "./seeds/lessons-data";
import { KANA_DATA } from "./seeds/kana-data";
import { VOCAB_DATA } from "./seeds/vocab-data";
import { GRAMMAR_DATA } from "./seeds/grammar-data";
import { SENTENCE_DATA } from "./seeds/sentence-data";
import { USERS_DATA } from "./seeds/users-data";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

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

  // 6. Seed Users (Admin & Standard Users)
  console.log("👤 Seeding authenticated users (Admin/CMS + Standard Learners)...");
  for (const userSeed of USERS_DATA) {
    const passwordHash = await bcrypt.hash(userSeed.passwordPlain, 10);

    const existingUser = await db.query.users.findFirst({
      where: (table, { eq }) => eq(table.email, userSeed.email.toLowerCase()),
    });

    let userId: string;

    if (existingUser) {
      userId = existingUser.id;
      await db
        .update(users)
        .set({
          name: userSeed.name,
          role: userSeed.role,
          passwordHash,
          emailVerified: true,
        })
        .where(eq(users.id, userId));
    } else {
      const [inserted] = await db
        .insert(users)
        .values({
          email: userSeed.email.toLowerCase(),
          name: userSeed.name,
          role: userSeed.role,
          passwordHash,
          emailVerified: true,
        })
        .returning();
      userId = inserted.id;
    }

    // Profile
    const existingProfile = await db.query.profiles.findFirst({
      where: (table, { eq }) => eq(table.userId, userId),
    });

    if (existingProfile) {
      await db
        .update(profiles)
        .set({
          startingLesson: userSeed.startingLesson,
          levelLabel: userSeed.levelLabel,
          dailyGoalXp: userSeed.dailyGoalXp,
        })
        .where(eq(profiles.userId, userId));
    } else {
      await db.insert(profiles).values({
        userId,
        startingLesson: userSeed.startingLesson,
        levelLabel: userSeed.levelLabel,
        dailyGoalXp: userSeed.dailyGoalXp,
      });
    }

    // Gamification state
    const existingGamification = await db.query.gamificationState.findFirst({
      where: (table, { eq }) => eq(table.userId, userId),
    });

    const initialXp = userSeed.role === "admin" ? 150 : userSeed.email === "sameer@mail.com" ? 45 : 20;
    const initialStreak = userSeed.role === "admin" ? 5 : 2;

    if (!existingGamification) {
      await db.insert(gamificationState).values({
        userId,
        totalXp: initialXp,
        currentStreak: initialStreak,
        longestStreak: initialStreak,
        streakFreezesAvailable: 2,
        dailyGoalXp: userSeed.dailyGoalXp,
      });
    }
  }
  console.log(`✓ Seeded ${USERS_DATA.length} users with profiles & gamification states:`);
  USERS_DATA.forEach((u) => console.log(`   - [${u.role.toUpperCase()}] ${u.email} (${u.name})`));
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
