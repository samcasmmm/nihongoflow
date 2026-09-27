import { withAuth } from "@/core/api-handler";
import { successResponse } from "@/core/api-response";
import { authService } from "@/modules/auth/services/auth-service";

export const GET = withAuth(async (_req, { session }) => {
  const exportData = await authService.exportUserData(session.userId);
  return successResponse(exportData, 200);
});

export const DELETE = withAuth(async (_req, { session }) => {
  const success = await authService.deleteAccount(session.userId);
  return successResponse({ deleted: success, message: "Account deleted successfully" }, 200);
});
