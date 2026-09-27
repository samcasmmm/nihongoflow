import { withAuth } from "@/core/api-handler";
import { successResponse, errorResponse } from "@/core/api-response";
import { contentService } from "@/modules/content/services/content-service";

export const GET = withAuth(async (req) => {
  const { searchParams } = new URL(req.url);
  const lessonParam = searchParams.get("lesson");
  const lessonNumber = lessonParam ? parseInt(lessonParam, 10) : undefined;
  const vocab = await contentService.getVocab(!isNaN(lessonNumber as number) ? lessonNumber : undefined);
  return successResponse({ vocab });
});

export const POST = withAuth(async (req) => {
  const body = await req.json();
  if (!body.lessonNumber || !body.word || !body.reading || !body.meaning) {
    return errorResponse("Missing required fields (lessonNumber, word, reading, meaning)", 400);
  }
  const created = await contentService.createVocab(body);
  return successResponse({ vocab: created });
});

export const PUT = withAuth(async (req) => {
  const body = await req.json();
  if (!body.id) {
    return errorResponse("Missing vocab item id", 400);
  }
  const { id, ...data } = body;
  const updated = await contentService.updateVocab(id, data);
  return successResponse({ vocab: updated });
});

export const DELETE = withAuth(async (req) => {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) {
    return errorResponse("Missing vocab id parameter", 400);
  }
  await contentService.deleteVocab(id);
  return successResponse({ deleted: true });
});
