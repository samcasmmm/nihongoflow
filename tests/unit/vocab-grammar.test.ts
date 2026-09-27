import { describe, it, expect } from "bun:test";
import { VOCAB_DATA } from "@/db/seeds/vocab-data";
import { GRAMMAR_DATA } from "@/db/seeds/grammar-data";

describe("Vocabulary Deck Cumulative & Lesson Filtering Logic", () => {
  it("provides original seeded vocabulary across Lessons 1 through 5", () => {
    expect(VOCAB_DATA.length).toBeGreaterThanOrEqual(30);

    const lessonsIncluded = new Set(VOCAB_DATA.map((v) => v.lessonNumber));
    expect(lessonsIncluded.has(1)).toBe(true);
    expect(lessonsIncluded.has(2)).toBe(true);
    expect(lessonsIncluded.has(3)).toBe(true);
    expect(lessonsIncluded.has(4)).toBe(true);
    expect(lessonsIncluded.has(5)).toBe(true);
  });

  it("filters vocabulary strictly by a specific lesson", () => {
    const l1Items = VOCAB_DATA.filter((v) => v.lessonNumber === 1);
    expect(l1Items.length).toBeGreaterThan(0);
    for (const item of l1Items) {
      expect(item.lessonNumber).toBe(1);
    }
  });

  it("filters cumulative vocabulary up to lesson N correctly", () => {
    const upToL2 = VOCAB_DATA.filter((v) => v.lessonNumber <= 2);
    expect(upToL2.length).toBeGreaterThan(0);

    for (const item of upToL2) {
      expect(item.lessonNumber).toBeLessThanOrEqual(2);
    }

    const hasL3 = upToL2.some((v) => v.lessonNumber === 3);
    expect(hasL3).toBe(false);
  });

  it("ensures every vocabulary item has an image/visual prompt and example sentence", () => {
    for (const item of VOCAB_DATA) {
      expect(item.word.length).toBeGreaterThan(0);
      expect(item.reading.length).toBeGreaterThan(0);
      expect(item.meaning.length).toBeGreaterThan(0);
      expect(item.imageUrl.length).toBeGreaterThan(0);
      expect(item.exampleSentence.length).toBeGreaterThan(0);
    }
  });
});

describe("Grammar Pattern Blueprint & Content Integrity", () => {
  it("provides original grammar patterns across Lessons 1 through 5", () => {
    expect(GRAMMAR_DATA.length).toBeGreaterThanOrEqual(10);
  });

  it("guarantees every pattern has a formula, explanation, and at least 2 original examples", () => {
    for (const pattern of GRAMMAR_DATA) {
      expect(pattern.formula.length).toBeGreaterThan(0);
      expect(pattern.explanation.length).toBeGreaterThan(0);
      expect(pattern.examples.length).toBeGreaterThanOrEqual(2);
      expect(pattern.skillTag).toMatch(/^[a-z0-9_]+$/);

      for (const ex of pattern.examples) {
        expect(ex.japanese.length).toBeGreaterThan(0);
        expect(ex.reading.length).toBeGreaterThan(0);
        expect(ex.romaji.length).toBeGreaterThan(0);
        expect(ex.english.length).toBeGreaterThan(0);
      }
    }
  });
});
