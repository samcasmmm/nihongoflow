import { withAuth } from "@/core/api-handler";
import { successResponse, errorResponse } from "@/core/api-response";
import { contentService } from "@/modules/content/services/content-service";

export const GET = withAuth(async (req) => {
  const { searchParams } = new URL(req.url);
  const lessonParam = searchParams.get("lesson");
  const lessonNumber = lessonParam ? parseInt(lessonParam, 10) : undefined;
  const sentences = await contentService.getSentences(!isNaN(lessonNumber as number) ? lessonNumber : undefined);
  return successResponse({ sentences });
});

export const POST = withAuth(async (req) => {
  const body = await req.json();
  if (!body.lessonNumber || !body.type || !body.prompt || !body.acceptedAnswers) {
    return errorResponse("Missing required fields (lessonNumber, type, prompt, acceptedAnswers)", 400);
  }
  const created = await contentService.createSentence(body);
  return successResponse({ sentence: created });
});

export const PUT = withAuth(async (req) => {
  const body = await req.json();
  if (!body.id) {
    return errorResponse("Missing sentence id", 400);
  }
  const { id, ...data } = body;
  const updated = await contentService.updateSentence(id, data);
  return successResponse({ sentence: updated });
});

export const DELETE = withAuth(async (req) => {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) {
    return errorResponse("Missing sentence id parameter", 400);
  }
  await contentService.deleteSentence(id);
  return successResponse({ deleted: true });
});
