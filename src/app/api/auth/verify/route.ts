import { apiHandler } from "@/core/api-handler";
import { successResponse } from "@/core/api-response";
import { authService } from "@/modules/auth/services/auth-service";

export const GET = apiHandler({}, async (req) => {
  const token = req.nextUrl.searchParams.get("token") || "";
  const result = await authService.verifyEmail({ token });
  return successResponse(result, 200);
});

export const POST = apiHandler({}, async (req) => {
  const body = await req.json();
  const result = await authService.verifyEmail(body);
  return successResponse(result, 200);
});
