import { withAuth } from "@/core/api-handler";
import { successResponse, errorResponse } from "@/core/api-response";
import { contentService } from "@/modules/content/services/content-service";

export const POST = withAuth(async () => {
  try {
    const result = await contentService.resetAndReseed();
    return successResponse(result);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Reseed failed";
    return errorResponse(msg, 500);
  }
});
