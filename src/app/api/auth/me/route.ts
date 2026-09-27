import { withAuth } from "@/core/api-handler";
import { successResponse } from "@/core/api-response";
import { authService } from "@/modules/auth/services/auth-service";

export const GET = withAuth(async () => {
  const sessionData = await authService.getCurrentSessionUser();
  return successResponse(sessionData, 200);
});
