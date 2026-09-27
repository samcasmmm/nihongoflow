import { withAuth } from "@/core/api-handler";
import { successResponse } from "@/core/api-response";
import { vocabularyService } from "@/modules/vocabulary/services/vocabulary-service";

export const GET = withAuth(async (req, { session }) => {
  const { searchParams } = new URL(req.url);
  const lessonParam = searchParams.get("lesson");
  const upToParam = searchParams.get("upTo");

  const lessonNumber = lessonParam ? parseInt(lessonParam, 10) : undefined;
  const upToLesson = upToParam ? parseInt(upToParam, 10) : undefined;

  const result = await vocabularyService.getVocabDeck(session.userId, {
    lessonNumber: !isNaN(lessonNumber as number) ? lessonNumber : undefined,
    upToLesson: !isNaN(upToLesson as number) ? upToLesson : undefined,
  });

  return successResponse(result);
});
