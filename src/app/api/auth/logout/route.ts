import { apiHandler } from "@/core/api-handler";
import { successResponse } from "@/core/api-response";
import { authService } from "@/modules/auth/services/auth-service";

export const POST = apiHandler({}, async () => {
  await authService.logout();
  return successResponse({ message: "Logged out successfully" }, 200);
});
