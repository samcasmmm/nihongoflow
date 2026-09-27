import { z } from "zod";
import { apiHandler } from "@/core/api-handler";
import { successResponse } from "@/core/api-response";
import { practiceRepository } from "@/modules/practice/repositories/practice-repository";

const submitAnswerSchema = z.object({
  sessionId: z.string().uuid(),
  sentenceItemId: z.string().uuid(),
  userAnswer: z.string().min(1),
  responseTimeMs: z.number().int().optional().default(0),
});

export const POST = apiHandler<z.infer<typeof submitAnswerSchema>, Record<string, string>, true>(
  {
    auth: true,
    schema: submitAnswerSchema,
  },
  async (_req, { session, body }) => {
    const result = await practiceRepository.recordAttempt(
      body.sessionId,
      session.userId,
      body.sentenceItemId,
      body.userAnswer,
      body.responseTimeMs
    );

    return successResponse(result);
  }
);
