export type QuestionType = 'self_assessment' | 'mcq';

export interface PlacementOption {
  id: string;
  label: string;
  sublabel?: string;
  points: number;
  minLessonHint?: number;
}

export interface PlacementQuestion {
  id: string;
  title: string;
  subtitle?: string;
  category: 'experience' | 'kana' | 'vocab' | 'grammar';
  type: QuestionType;
  options: PlacementOption[];
}

export interface QuizAnswer {
  questionId: string;
  selectedOptionId: string;
}

export interface PlacementResult {
  suggestedLesson: number;
  levelLabel: string;
  score: number;
  totalPossibleScore: number;
  summary: string;
}
