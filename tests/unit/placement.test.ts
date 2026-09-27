import { describe, it, expect } from "bun:test";
import { placementService } from "@/modules/placement/services/placement-service";

describe("PlacementService Scoring Logic", () => {
  it("provides 6 original questions", () => {
    const questions = placementService.getQuestions();
    expect(questions.length).toBe(6);
  });

  it("suggests Lesson 1 for absolute beginners", () => {
    const beginnerAnswers = [
      { questionId: "exp_1", selectedOptionId: "exp_none" },
      { questionId: "kana_1", selectedOptionId: "kana_o" }, // wrong
      { questionId: "vocab_1", selectedOptionId: "vocab_student" }, // wrong
    ];

    const result = placementService.evaluateAnswers(beginnerAnswers);
    expect(result.suggestedLesson).toBe(1);
    expect(result.levelLabel).toBe("Absolute Beginner");
  });

  it("suggests Lesson 2 for users with Kana knowledge and basic answers", () => {
    const noviceAnswers = [
      { questionId: "exp_1", selectedOptionId: "exp_kana_only" }, // 10
      { questionId: "kana_1", selectedOptionId: "kana_a" }, // 10
      { questionId: "vocab_1", selectedOptionId: "vocab_teacher" }, // 15
      { questionId: "grammar_1", selectedOptionId: "p_wa" }, // 15
    ];

    const result = placementService.evaluateAnswers(noviceAnswers);
    expect(result.score).toBe(50);
    expect(result.suggestedLesson).toBe(2);
    expect(result.levelLabel).toBe("Novice (Kana Ready)");
  });

  it("suggests Lesson 3+ for learners passing advanced grammar MCQs", () => {
    const advancedAnswers = [
      { questionId: "exp_1", selectedOptionId: "exp_basics" }, // 20
      { questionId: "kana_1", selectedOptionId: "kana_a" }, // 10
      { questionId: "vocab_1", selectedOptionId: "vocab_teacher" }, // 15
      { questionId: "grammar_1", selectedOptionId: "p_wa" }, // 15
      { questionId: "grammar_2", selectedOptionId: "q_ka" }, // 15
      { questionId: "grammar_3", selectedOptionId: "neg_correct" }, // 20
    ];

    const result = placementService.evaluateAnswers(advancedAnswers);
    expect(result.score).toBe(95);
    expect(result.suggestedLesson).toBe(3);
    expect(result.levelLabel).toBe("Elementary Learner");
  });
});
