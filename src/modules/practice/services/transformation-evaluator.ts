import { SentenceItem } from "@/db/schema";

export interface EvaluationResult {
  isCorrect: boolean;
  errorTag: string | null;
  feedback: string;
}

export function normalizeJapaneseText(text: string): string {
  return text
    .trim()
    .replace(/[\s\u3000]+/g, "") // remove all spaces (half and full width)
    .replace(/[。\.！？!?]+$/g, ""); // strip trailing periods and exclamation/question marks
}

export const transformationEvaluator = {
  evaluate(item: SentenceItem, rawUserAnswer: string): EvaluationResult {
    const normalizedUser = normalizeJapaneseText(rawUserAnswer);

    // 1. Direct match with accepted answers
    const matchesAccepted = item.acceptedAnswers.some(
      (ans) => normalizeJapaneseText(ans) === normalizedUser
    );

    if (matchesAccepted) {
      return {
        isCorrect: true,
        errorTag: null,
        feedback: "正解です！ (Correct!) Excellent transformation.",
      };
    }

    // 2. Keyword Slot Checking
    const missingSlots: string[] = [];
    for (const slot of item.keywordSlots) {
      const normalizedSlot = normalizeJapaneseText(slot);
      if (!normalizedUser.includes(normalizedSlot)) {
        missingSlots.push(slot);
      }
    }

    // 3. Error Classification
    let errorTag = item.skillTag;
    let feedback = "Not quite. Check your sentence structure and particles.";

    if (normalizedUser.includes("わ") && item.keywordSlots.includes("は")) {
      errorTag = "particle_wa_spelling";
      feedback = "Remember: The topic particle 'wa' must always be written with 'は', not 'わ'.";
    } else if (item.transformationType === "question" && !normalizedUser.endsWith("か")) {
      errorTag = "particle_ka_missing";
      feedback = "Don't forget the question particle 'か' at the end of the sentence.";
    } else if (
      item.transformationType === "negative" &&
      !normalizedUser.includes("じゃありません") &&
      !normalizedUser.includes("ではありません")
    ) {
      errorTag = "negative_copula_error";
      feedback = "Use 'じゃありません' or 'ではありません' for the polite negative form.";
    } else if (missingSlots.length > 0) {
      errorTag = `${item.skillTag}_missing_element`;
      feedback = `Your answer is missing required element(s): ${missingSlots.join(", ")}.`;
    }

    return {
      isCorrect: false,
      errorTag,
      feedback,
    };
  },
};
