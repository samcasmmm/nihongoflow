import { withAuth } from "@/core/api-handler";
import { successResponse, errorResponse } from "@/core/api-response";
import { contentService } from "@/modules/content/services/content-service";

export const GET = withAuth(async () => {
  const lessons = await contentService.getLessons();
  return successResponse({ lessons });
});

export const POST = withAuth(async (req) => {
  const body = await req.json();
  if (!body.lessonNumber || !body.title || !body.japaneseTitle) {
    return errorResponse("Missing required fields", 400);
  }
  const created = await contentService.createLesson(body);
  return successResponse({ lesson: created });
});

export const PUT = withAuth(async (req) => {
  const body = await req.json();
  if (!body.id) {
    return errorResponse("Missing lesson id", 400);
  }
  const { id, ...data } = body;
  const updated = await contentService.updateLesson(id, data);
  return successResponse({ lesson: updated });
});

export const DELETE = withAuth(async (req) => {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) {
    return errorResponse("Missing lesson id parameter", 400);
  }
  await contentService.deleteLesson(id);
  return successResponse({ deleted: true });
});
