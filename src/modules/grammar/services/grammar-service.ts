import { grammarRepository } from "../repositories/grammar-repository";

export const grammarService = {
  async getPatterns(lessonNumber?: number) {
    if (lessonNumber) {
      return grammarRepository.findAll(lessonNumber);
    }
    return grammarRepository.findAll();
  },

  async getGroupedPatterns() {
    return grammarRepository.getGroupedByLesson();
  },
};
