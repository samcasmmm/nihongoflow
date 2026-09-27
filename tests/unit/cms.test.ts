import { describe, it, expect } from "bun:test";
import { VOCAB_DATA } from "@/db/seeds/vocab-data";
import { GRAMMAR_DATA } from "@/db/seeds/grammar-data";
import { SENTENCE_DATA } from "@/db/seeds/sentence-data";
import { LESSON_DATA } from "@/db/seeds/lessons-data";

describe("Module 12: Content Management Data Validation", () => {
  it("validates that all lessons have valid metadata for CMS editing", () => {
    for (const l of LESSON_DATA) {
      expect(l.lessonNumber).toBeGreaterThan(0);
      expect(l.title.length).toBeGreaterThan(0);
      expect(l.japaneseTitle.length).toBeGreaterThan(0);
      expect(l.summary.length).toBeGreaterThan(0);
      expect(l.grammarTopic.length).toBeGreaterThan(0);
    }
  });

  it("validates that all vocabulary items can be parsed and modified", () => {
    for (const v of VOCAB_DATA) {
      expect(v.lessonNumber).toBeGreaterThan(0);
      expect(v.word.length).toBeGreaterThan(0);
      expect(v.reading.length).toBeGreaterThan(0);
      expect(v.meaning.length).toBeGreaterThan(0);
      expect(v.partOfSpeech.length).toBeGreaterThan(0);
    }
  });

  it("validates grammar pattern structure for CMS manipulation", () => {
    for (const g of GRAMMAR_DATA) {
      expect(g.patternKey).toBeDefined();
      expect(g.formula.length).toBeGreaterThan(0);
      expect(g.explanation.length).toBeGreaterThan(0);
      expect(Array.isArray(g.examples)).toBe(true);
    }
  });

  it("validates practice sentence bank items for CMS customization", () => {
    for (const s of SENTENCE_DATA) {
      expect(s.lessonNumber).toBeGreaterThan(0);
      expect(s.type).toMatch(/^(transformation|translation)$/);
      expect(s.prompt.length).toBeGreaterThan(0);
      expect(s.acceptedAnswers.length).toBeGreaterThan(0);
    }
  });
});
