import { apiHandler } from "@/core/api-handler";
import { successResponse } from "@/core/api-response";
import { authService } from "@/modules/auth/services/auth-service";
import { loginSchema } from "@/modules/auth/validations";

export const POST = apiHandler(
  { schema: loginSchema },
  async (_req, { body }) => {
    const result = await authService.login(body);
    return successResponse(result, 200);
  }
);
