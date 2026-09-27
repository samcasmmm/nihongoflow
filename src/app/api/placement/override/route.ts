import { apiHandler } from "@/core/api-handler";
import { successResponse } from "@/core/api-response";
import { placementService } from "@/modules/placement/services/placement-service";
import { overrideStartingLessonSchema } from "@/modules/placement/validations";

export const PATCH = apiHandler(
  { auth: true, schema: overrideStartingLessonSchema },
  async (_req, { session, body }) => {
    const result = await placementService.overrideStartingLesson(session.userId, body.targetLesson);
    return successResponse(result, 200);
  }
);
