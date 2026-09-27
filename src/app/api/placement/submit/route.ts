import { apiHandler } from "@/core/api-handler";
import { successResponse } from "@/core/api-response";
import { placementService } from "@/modules/placement/services/placement-service";
import { submitQuizSchema } from "@/modules/placement/validations";

export const POST = apiHandler(
  { auth: true, schema: submitQuizSchema },
  async (_req, { session, body }) => {
    const result = await placementService.submitQuiz(session.userId, body.answers);
    return successResponse(result, 200);
  }
);
