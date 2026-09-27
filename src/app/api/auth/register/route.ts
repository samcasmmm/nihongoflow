import { apiHandler } from "@/core/api-handler";
import { successResponse } from "@/core/api-response";
import { authService } from "@/modules/auth/services/auth-service";
import { registerSchema } from "@/modules/auth/validations";

export const POST = apiHandler(
  { schema: registerSchema },
  async (_req, { body }) => {
    const result = await authService.register(body);
    return successResponse(result, 201);
  }
);
