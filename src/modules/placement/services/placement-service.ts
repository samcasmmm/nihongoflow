import {
  PlacementQuestion,
  QuizAnswer,
  PlacementResult,
} from "../types";
import {
  placementRepository,
  PlacementRepository,
} from "../repositories/placement-repository";
import { ValidationError, NotFoundError } from "@/core/errors";

export const PLACEMENT_QUESTIONS: PlacementQuestion[] = [
  {
    id: "exp_1",
    title: "How much Japanese have you studied before?",
    subtitle: "This helps calibrate whether you need the foundation or can jump ahead.",
    category: "experience",
    type: "self_assessment",
    options: [
      {
        id: "exp_none",
        label: "Complete Beginner",
        sublabel: "I have never learned Japanese before or only know a few words.",
        points: 0,
        minLessonHint: 1,
      },
      {
        id: "exp_kana_only",
        label: "I know Hiragana",
        sublabel: "I can recognize the basic Japanese phonetic alphabets.",
        points: 10,
        minLessonHint: 1,
      },
      {
        id: "exp_basics",
        label: "Some Grammar & Basic Sentences",
        sublabel: "I have studied basic textbooks or apps and understand simple sentences.",
        points: 20,
        minLessonHint: 2,
      },
      {
        id: "exp_intermediate",
        label: "Elementary / Post-Beginner",
        sublabel: "I can conjugate verbs, know basic particles (は, が, を, に), and read simple passages.",
        points: 30,
        minLessonHint: 3,
      },
    ],
  },
  {
    id: "kana_1",
    title: "Which reading is correct for this Hiragana character: あ?",
    subtitle: "Check basic Japanese phonetic recognition.",
    category: "kana",
    type: "mcq",
    options: [
      { id: "kana_a", label: "a", points: 10 },
      { id: "kana_o", label: "o", points: 0 },
      { id: "kana_e", label: "e", points: 0 },
      { id: "kana_u", label: "u", points: 0 },
    ],
  },
  {
    id: "vocab_1",
    title: "What does the word 「せんせい」 (sensei) mean?",
    subtitle: "Common vocabulary check.",
    category: "vocab",
    type: "mcq",
    options: [
      { id: "vocab_teacher", label: "Teacher / Instructor", points: 15, minLessonHint: 1 },
      { id: "vocab_student", label: "Student", points: 0 },
      { id: "vocab_doctor", label: "Doctor", points: 0 },
      { id: "vocab_book", label: "Book", points: 0 },
    ],
  },
  {
    id: "grammar_1",
    title: "Choose the correct particle: わたし ___ たなかです。",
    subtitle: "Sentence meaning: 'I am Tanaka.'",
    category: "grammar",
    type: "mcq",
    options: [
      { id: "p_wa", label: "は (wa - Topic marker)", points: 15, minLessonHint: 1 },
      { id: "p_o", label: "を (o - Object marker)", points: 0 },
      { id: "p_ni", label: "に (ni - Target / time marker)", points: 0 },
      { id: "p_de", label: "で (de - Location of action)", points: 0 },
    ],
  },
  {
    id: "grammar_2",
    title: "How do you make a statement into a question in Japanese?",
    subtitle: "Sentence structure check.",
    category: "grammar",
    type: "mcq",
    options: [
      { id: "q_ka", label: "Add the sentence-ending particle 「か」 (ka)", points: 15, minLessonHint: 1 },
      { id: "q_ne", label: "Add the particle 「ね」 (ne)", points: 0 },
      { id: "q_invert", label: "Swap the subject and the verb", points: 0 },
      { id: "q_yo", label: "Add the particle 「よ」 (yo)", points: 0 },
    ],
  },
  {
    id: "grammar_3",
    title: "Which sentence correctly says 'This is not a book'?",
    subtitle: "Negative predicate conjugation check.",
    category: "grammar",
    type: "mcq",
    options: [
      { id: "neg_correct", label: "これは ほんじゃ ありません (Kore wa hon ja arimasen)", points: 20, minLessonHint: 2 },
      { id: "neg_past", label: "これは ほん でした (Kore wa hon deshita)", points: 0 },
      { id: "neg_plain", label: "これは ほんです (Kore wa hon desu)", points: 0 },
      { id: "neg_wrong", label: "これは ほんの ありません (Kore wa hon no arimasen)", points: 0 },
    ],
  },
];

export class PlacementService {
  constructor(private repo: PlacementRepository = placementRepository) {}

  getQuestions(): PlacementQuestion[] {
    return PLACEMENT_QUESTIONS;
  }

  evaluateAnswers(answers: QuizAnswer[]): PlacementResult {
    let score = 0;
    const maxScore = PLACEMENT_QUESTIONS.reduce((acc, q) => {
      const maxQ = Math.max(...q.options.map((o) => o.points));
      return acc + maxQ;
    }, 0);

    const answerMap = new Map<string, string>();
    for (const ans of answers) {
      answerMap.set(ans.questionId, ans.selectedOptionId);
    }

    let hintedMaxLesson = 1;

    for (const question of PLACEMENT_QUESTIONS) {
      const selectedId = answerMap.get(question.id);
      if (selectedId) {
        const option = question.options.find((o) => o.id === selectedId);
        if (option) {
          score += option.points;
          if (option.minLessonHint && option.minLessonHint > hintedMaxLesson) {
            hintedMaxLesson = option.minLessonHint;
          }
        }
      }
    }

    // Determine level and starting lesson
    let suggestedLesson = 1;
    let levelLabel = "Absolute Beginner";
    let summary = "We recommend starting from Lesson 1 to master essential Japanese foundations, basic vocabulary, and greetings.";

    if (score >= 75) {
      suggestedLesson = 3;
      levelLabel = "Elementary Learner";
      summary = "Great job! You already understand topic markers, negation, and basic vocabulary. You can start directly with Lesson 3 or review earlier material anytime.";
    } else if (score >= 45) {
      suggestedLesson = 2;
      levelLabel = "Novice (Kana Ready)";
      summary = "You have a solid grasp of Hiragana and basic expressions. We suggest starting at Lesson 2 to dive into demonstratives (これ, それ, あれ) and possession.";
    }

    return {
      suggestedLesson,
      levelLabel,
      score,
      totalPossibleScore: maxScore,
      summary,
    };
  }

  async submitQuiz(userId: string, answers: QuizAnswer[]): Promise<PlacementResult> {
    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      throw new ValidationError("Answers must be provided");
    }

    const result = this.evaluateAnswers(answers);
    const updated = await this.repo.updateStartingLevel(
      userId,
      result.suggestedLesson,
      result.levelLabel
    );

    if (!updated) {
      throw new NotFoundError("User profile not found");
    }

    return result;
  }

  async overrideStartingLesson(
    userId: string,
    targetLesson: number
  ): Promise<{ startingLesson: number; levelLabel: string }> {
    if (targetLesson < 1 || targetLesson > 25) {
      throw new ValidationError("Starting lesson must be between 1 and 25");
    }

    let levelLabel = "Beginner";
    if (targetLesson >= 10) levelLabel = "Intermediate";
    else if (targetLesson >= 3) levelLabel = "Elementary";

    const updated = await this.repo.updateStartingLevel(userId, targetLesson, levelLabel);
    if (!updated) {
      throw new NotFoundError("User profile not found");
    }

    return {
      startingLesson: updated.startingLesson,
      levelLabel: updated.levelLabel,
    };
  }
}

export const placementService = new PlacementService();
