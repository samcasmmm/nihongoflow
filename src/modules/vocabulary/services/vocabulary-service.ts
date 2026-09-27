import { vocabularyRepository } from "../repositories/vocabulary-repository";

export const vocabularyService = {
  async getVocabDeck(
    userId: string,
    filters?: { lessonNumber?: number; upToLesson?: number }
  ) {
    return vocabularyRepository.getVocabCards(userId, filters);
  },
};
