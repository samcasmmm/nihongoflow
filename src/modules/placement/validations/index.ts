import { z } from "zod";

export const submitQuizSchema = z.object({
  answers: z
    .array(
      z.object({
        questionId: z.string().min(1, "Question ID is required"),
        selectedOptionId: z.string().min(1, "Option ID is required"),
      })
    )
    .min(1, "At least one answer is required"),
});

export const overrideStartingLessonSchema = z.object({
  targetLesson: z.number().int().min(1, "Lesson must be at least 1").max(25, "Lesson must be at most 25"),
});

export type SubmitQuizInput = z.infer<typeof submitQuizSchema>;
export type OverrideStartingLessonInput = z.infer<typeof overrideStartingLessonSchema>;
