import { SentenceItem } from "@/db/schema";
import { EvaluationResult, normalizeJapaneseText } from "./transformation-evaluator";

export const translationEvaluator = {
  evaluate(item: SentenceItem, rawUserAnswer: string): EvaluationResult {
    const normalizedUser = normalizeJapaneseText(rawUserAnswer);

    // 1. Direct match with any accepted answer variant
    const matchesAccepted = item.acceptedAnswers.some(
      (ans) => normalizeJapaneseText(ans) === normalizedUser
    );

    if (matchesAccepted) {
      return {
        isCorrect: true,
        errorTag: null,
        feedback: "正解です！ (Correct!) Accurate translation.",
      };
    }

    // 2. Keyword Slots validation
    const missingSlots: string[] = [];
    for (const slot of item.keywordSlots) {
      const normalizedSlot = normalizeJapaneseText(slot);
      if (!normalizedUser.includes(normalizedSlot)) {
        missingSlots.push(slot);
      }
    }

    // If all essential keyword slots are present and length is within 80-120%, treat as near match or minor variant
    if (missingSlots.length === 0) {
      return {
        isCorrect: true,
        errorTag: null,
        feedback: "Accepted! Natural alternative phrasing.",
      };
    }

    // 3. Error Diagnosis
    let errorTag = item.skillTag;
    let feedback = `Review the translation. Make sure to include: ${missingSlots.slice(0, 2).join(", ")}.`;

    if (normalizedUser.includes("わ") && item.keywordSlots.includes("は")) {
      errorTag = "particle_wa_spelling";
      feedback = "Spelling error: Write the topic particle 'wa' with 'は'.";
    } else if (item.skillTag === "particle_ka" && !normalizedUser.includes("か")) {
      errorTag = "particle_ka_missing";
      feedback = "Question particle 'か' is missing from the sentence end.";
    }

    return {
      isCorrect: false,
      errorTag,
      feedback,
    };
  },
};
