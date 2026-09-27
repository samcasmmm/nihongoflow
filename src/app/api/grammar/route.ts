import { withAuth } from "@/core/api-handler";
import { successResponse } from "@/core/api-response";
import { grammarService } from "@/modules/grammar/services/grammar-service";

export const GET = withAuth(async (req) => {
  const { searchParams } = new URL(req.url);
  const lessonParam = searchParams.get("lesson");

  const lessonNumber = lessonParam ? parseInt(lessonParam, 10) : undefined;

  const patterns = await grammarService.getPatterns(
    !isNaN(lessonNumber as number) ? lessonNumber : undefined
  );

  return successResponse({ patterns });
});
