import { apiHandler } from "@/core/api-handler";
import { successResponse } from "@/core/api-response";
import { placementService } from "@/modules/placement/services/placement-service";

export const GET = apiHandler({}, async () => {
  const questions = placementService.getQuestions();
  return successResponse({ questions }, 200);
});
