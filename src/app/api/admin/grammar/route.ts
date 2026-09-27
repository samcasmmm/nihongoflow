import { withAuth } from "@/core/api-handler";
import { successResponse, errorResponse } from "@/core/api-response";
import { contentService } from "@/modules/content/services/content-service";

export const GET = withAuth(async (req) => {
  const { searchParams } = new URL(req.url);
  const lessonParam = searchParams.get("lesson");
  const lessonNumber = lessonParam ? parseInt(lessonParam, 10) : undefined;
  const grammar = await contentService.getGrammar(!isNaN(lessonNumber as number) ? lessonNumber : undefined);
  return successResponse({ grammar });
});

export const POST = withAuth(async (req) => {
  const body = await req.json();
  if (!body.lessonNumber || !body.patternKey || !body.title || !body.formula) {
    return errorResponse("Missing required fields (lessonNumber, patternKey, title, formula)", 400);
  }
  const created = await contentService.createGrammar(body);
  return successResponse({ grammar: created });
});

export const PUT = withAuth(async (req) => {
  const body = await req.json();
  if (!body.id) {
    return errorResponse("Missing grammar pattern id", 400);
  }
  const { id, ...data } = body;
  const updated = await contentService.updateGrammar(id, data);
  return successResponse({ grammar: updated });
});

export const DELETE = withAuth(async (req) => {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) {
    return errorResponse("Missing grammar pattern id parameter", 400);
  }
  await contentService.deleteGrammar(id);
  return successResponse({ deleted: true });
});
