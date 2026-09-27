import { withAuth } from "@/core/api-handler";
import { successResponse } from "@/core/api-response";
import { gamificationService } from "@/modules/gamification/services/gamification-service";

export const GET = withAuth(async (_req, { session }) => {
  const summary = await gamificationService.getSummary(session.userId);
  return successResponse(summary);
});
