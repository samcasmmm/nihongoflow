import { withAuth } from "@/core/api-handler";
import { successResponse, errorResponse } from "@/core/api-response";
import { lessonFlowService } from "@/modules/lessons/services/lesson-flow-service";

export const GET = withAuth<{ n: string }>(async (_req, { session, params }) => {
  const lessonNumber = parseInt(params.n, 10);
  if (isNaN(lessonNumber) || lessonNumber < 1 || lessonNumber > 5) {
    return errorResponse("Invalid lesson number", 400);
  }

  try {
    const details = await lessonFlowService.getLessonDetails(session.userId, lessonNumber);
    return successResponse(details);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to load lesson";
    return errorResponse(msg, 404);
  }
});
