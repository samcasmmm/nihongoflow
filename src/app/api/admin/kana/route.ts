import { withAuth } from "@/core/api-handler";
import { successResponse, errorResponse } from "@/core/api-response";
import { contentService } from "@/modules/content/services/content-service";

export const GET = withAuth(async (req) => {
  const { searchParams } = new URL(req.url);
  const script = searchParams.get("script") || "hiragana";
  const kana = await contentService.getKana(script);
  return successResponse({ kana });
});

export const POST = withAuth(async (req) => {
  const body = await req.json();
  if (!body.character || !body.romaji || !body.category) {
    return errorResponse("Missing required fields (character, romaji, category)", 400);
  }
  const created = await contentService.createKana(body);
  return successResponse({ kana: created });
});

export const PUT = withAuth(async (req) => {
  const body = await req.json();
  if (!body.id) {
    return errorResponse("Missing kana id", 400);
  }
  const { id, ...data } = body;
  const updated = await contentService.updateKana(id, data);
  return successResponse({ kana: updated });
});

export const DELETE = withAuth(async (req) => {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) {
    return errorResponse("Missing kana id parameter", 400);
  }
  await contentService.deleteKana(id);
  return successResponse({ deleted: true });
});
