import { deckRepository } from "../repositories/deck-repository";

export const deckService = {
  async getHiraganaDeck(userId: string, category?: string) {
    return deckRepository.getHiraganaCards(userId, category);
  },

  async recordCardReview(
    userId: string,
    cardId: string,
    cardType: "kana" | "vocab",
    action: "know_it" | "still_learning"
  ) {
    return deckRepository.updateCardProgress(userId, cardId, cardType, action);
  },
};
