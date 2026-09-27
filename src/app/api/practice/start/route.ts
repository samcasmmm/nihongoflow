import { z } from "zod";
import { apiHandler } from "@/core/api-handler";
import { successResponse } from "@/core/api-response";
import { practiceRepository } from "@/modules/practice/repositories/practice-repository";

const startPracticeSchema = z.object({
  lessonNumber: z.number().int().min(1).max(5),
});

export const POST = apiHandler<z.infer<typeof startPracticeSchema>, Record<string, string>, true>(
  {
    auth: true,
    schema: startPracticeSchema,
  },
  async (_req, { session, body }) => {
    const result = await practiceRepository.startOrResumeSession(
      session.userId,
      body.lessonNumber
    );

    return successResponse(result);
  }
);
