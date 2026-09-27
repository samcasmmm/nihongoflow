import { apiHandler } from "@/core/api-handler";
import { successResponse } from "@/core/api-response";
import { authService } from "@/modules/auth/services/auth-service";

export const POST = apiHandler({}, async (req) => {
  const body = await req.json();

  if ("token" in body && "password" in body) {
    const result = await authService.resetPassword({
      token: body.token,
      password: body.password,
    });
    return successResponse(result, 200);
  } else {
    const result = await authService.requestPasswordReset({
      email: body.email,
    });
    return successResponse(result, 200);
  }
});
