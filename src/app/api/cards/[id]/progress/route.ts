import { z } from "zod";
import { apiHandler } from "@/core/api-handler";
import { successResponse } from "@/core/api-response";
import { deckService } from "@/modules/decks/services/deck-service";

const updateCardProgressSchema = z.object({
  cardType: z.enum(["kana", "vocab"]).default("kana"),
  action: z.enum(["know_it", "still_learning"]),
});

export const POST = apiHandler<z.infer<typeof updateCardProgressSchema>, { id: string }, true>(
  {
    auth: true,
    schema: updateCardProgressSchema,
  },
  async (_req, { session, body, params }) => {
    const result = await deckService.recordCardReview(
      session.userId,
      params.id,
      body.cardType,
      body.action
    );

    return successResponse(result);
  }
);
