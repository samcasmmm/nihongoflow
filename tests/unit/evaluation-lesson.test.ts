import { describe, it, expect } from "bun:test";
import { transformationEvaluator, normalizeJapaneseText } from "@/modules/practice/services/transformation-evaluator";
import { translationEvaluator } from "@/modules/practice/services/translation-evaluator";
import { SentenceItem } from "@/db/schema";
import { LESSON_CONFIG } from "@/modules/lessons/repositories/lesson-progress-repository";

describe("Text Normalization Utility", () => {
  it("removes whitespace, full-width spaces, and punctuation", () => {
    expect(normalizeJapaneseText(" 私は　学生です。 ")).toBe("私は学生です");
    expect(normalizeJapaneseText("これは本ですか？")).toBe("これは本ですか");
  });
});

describe("Module 8: Transformation Evaluator (Deterministic & Slot Matching)", () => {
  const mockNegativeItem: SentenceItem = {
    id: "sent-1",
    lessonNumber: 1,
    type: "transformation",
    prompt: "Transform into negative form",
    promptJapanese: "私は学生です。",
    transformationType: "negative",
    acceptedAnswers: [
      "私は学生じゃありません。",
      "わたしはがくせいじゃありません。",
      "私は学生ではありません。",
    ],
    keywordSlots: ["学生", "じゃありません"],
    skillTag: "negative_copula",
    allowedVocabLessonMax: 1,
    hint: null,
    orderIndex: 1,
    createdAt: new Date(),
  };

  const mockQuestionItem: SentenceItem = {
    id: "sent-2",
    lessonNumber: 1,
    type: "transformation",
    prompt: "Turn into a polite question",
    promptJapanese: "あなたは会社員です。",
    transformationType: "question",
    acceptedAnswers: ["あなたは会社員ですか。", "あなたはかいしゃいんですか。"],
    keywordSlots: ["会社員", "ですか"],
    skillTag: "particle_ka",
    allowedVocabLessonMax: 1,
    hint: null,
    orderIndex: 2,
    createdAt: new Date(),
  };

  it("accepts valid exact and variant answers", () => {
    const res1 = transformationEvaluator.evaluate(mockNegativeItem, "私は学生じゃありません。");
    expect(res1.isCorrect).toBe(true);
    expect(res1.errorTag).toBeNull();

    const res2 = transformationEvaluator.evaluate(mockNegativeItem, " わたしはがくせいじゃありません ");
    expect(res2.isCorrect).toBe(true);

    const res3 = transformationEvaluator.evaluate(mockNegativeItem, "私は学生ではありません");
    expect(res3.isCorrect).toBe(true);
  });

  it("catches particle_wa_spelling error when user writes 'わ' instead of particle 'は'", () => {
    const res = transformationEvaluator.evaluate(mockNegativeItem, "私わ学生じゃありません");
    expect(res.isCorrect).toBe(false);
    expect(res.errorTag).toBe("particle_wa_spelling");
    expect(res.feedback).toContain("written with 'は'");
  });

  it("catches particle_ka_missing error when question particle 'か' is absent", () => {
    const res = transformationEvaluator.evaluate(mockQuestionItem, "あなたは会社員です");
    expect(res.isCorrect).toBe(false);
    expect(res.errorTag).toBe("particle_ka_missing");
    expect(res.feedback).toContain("question particle 'か'");
  });

  it("catches negative_copula_error when negative form is missing", () => {
    const res = transformationEvaluator.evaluate(mockNegativeItem, "私は学生です");
    expect(res.isCorrect).toBe(false);
    expect(res.errorTag).toBe("negative_copula_error");
  });
});

describe("Module 8: Translation Evaluator (Fuzzy & Keyword-Slot)", () => {
  const mockTranslationItem: SentenceItem = {
    id: "sent-3",
    lessonNumber: 1,
    type: "translation",
    prompt: "Translate: 'Teacher Tanaka is Japanese.'",
    promptJapanese: null,
    transformationType: null,
    acceptedAnswers: [
      "田中先生は日本人です。",
      "たなかせんせいはにほんじんです。",
      "田中さんは日本人です。",
    ],
    keywordSlots: ["田中", "先生", "は", "日本人", "です"],
    skillTag: "copula_desu",
    allowedVocabLessonMax: 1,
    hint: null,
    orderIndex: 3,
    createdAt: new Date(),
  };

  it("accepts correct translation variants", () => {
    const res1 = translationEvaluator.evaluate(mockTranslationItem, "田中先生は日本人です。");
    expect(res1.isCorrect).toBe(true);
    expect(res1.errorTag).toBeNull();
  });

  it("rejects translations with missing core keywords", () => {
    const res = translationEvaluator.evaluate(mockTranslationItem, "田中先生はアメリカ人です");
    expect(res.isCorrect).toBe(false);
    expect(res.errorTag).toBe("copula_desu");
  });
});

describe("Module 7: Lesson Config & Passing Thresholds", () => {
  it("enforces passing threshold at 70%", () => {
    expect(LESSON_CONFIG.PASSING_PRACTICE_THRESHOLD_PERCENT).toBe(70);
    expect(LESSON_CONFIG.LESSON_COMPLETE_XP).toBe(25);
  });
});
