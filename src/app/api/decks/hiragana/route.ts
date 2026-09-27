import { withAuth } from "@/core/api-handler";
import { successResponse } from "@/core/api-response";
import { deckService } from "@/modules/decks/services/deck-service";

export const GET = withAuth(async (req, { session }) => {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category") || undefined;

  const result = await deckService.getHiraganaDeck(session.userId, category);
  return successResponse(result);
});
