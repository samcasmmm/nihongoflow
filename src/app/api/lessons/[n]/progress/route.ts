import { z } from "zod";
import { apiHandler } from "@/core/api-handler";
import { successResponse, errorResponse } from "@/core/api-response";
import { lessonFlowService } from "@/modules/lessons/services/lesson-flow-service";

const updateProgressSchema = z.object({
  stage: z.enum(["vocab", "grammar", "practice", "complete"]).optional(),
  vocabCompleted: z.boolean().optional(),
  grammarCompleted: z.boolean().optional(),
  practiceCompleted: z.boolean().optional(),
  practiceScore: z.number().min(0).max(100).optional(),
});

export const POST = apiHandler<z.infer<typeof updateProgressSchema>, { n: string }, true>(
  {
    auth: true,
    schema: updateProgressSchema,
  },
  async (_req, { session, body, params }) => {
    const lessonNumber = parseInt(params.n, 10);
    if (isNaN(lessonNumber) || lessonNumber < 1 || lessonNumber > 5) {
      return errorResponse("Invalid lesson number", 400);
    }

    const result = await lessonFlowService.updateProgress(session.userId, lessonNumber, body);
    return successResponse(result);
  }
);
