import { contentRepository } from "../repositories/content-repository";
import {
  NewLesson,
  NewVocabItem,
  NewKanaChar,
  NewGrammarPattern,
  NewSentenceItem,
} from "@/db/schema";
import { runSeed } from "@/db/seed";

export const contentService = {
  // Lessons
  async getLessons() {
    return contentRepository.getAllLessons();
  },
  async createLesson(data: NewLesson) {
    return contentRepository.createLesson(data);
  },
  async updateLesson(id: string, data: Partial<NewLesson>) {
    return contentRepository.updateLesson(id, data);
  },
  async deleteLesson(id: string) {
    return contentRepository.deleteLesson(id);
  },

  // Vocabulary
  async getVocab(lessonNumber?: number) {
    return contentRepository.getAllVocab(lessonNumber);
  },
  async createVocab(data: NewVocabItem) {
    return contentRepository.createVocab(data);
  },
  async updateVocab(id: string, data: Partial<NewVocabItem>) {
    return contentRepository.updateVocab(id, data);
  },
  async deleteVocab(id: string) {
    return contentRepository.deleteVocab(id);
  },

  // Kana
  async getKana(script?: string) {
    return contentRepository.getAllKana(script);
  },
  async createKana(data: NewKanaChar) {
    return contentRepository.createKana(data);
  },
  async updateKana(id: string, data: Partial<NewKanaChar>) {
    return contentRepository.updateKana(id, data);
  },
  async deleteKana(id: string) {
    return contentRepository.deleteKana(id);
  },

  // Grammar
  async getGrammar(lessonNumber?: number) {
    return contentRepository.getAllGrammar(lessonNumber);
  },
  async createGrammar(data: NewGrammarPattern) {
    return contentRepository.createGrammar(data);
  },
  async updateGrammar(id: string, data: Partial<NewGrammarPattern>) {
    return contentRepository.updateGrammar(id, data);
  },
  async deleteGrammar(id: string) {
    return contentRepository.deleteGrammar(id);
  },

  // Sentences
  async getSentences(lessonNumber?: number) {
    return contentRepository.getAllSentences(lessonNumber);
  },
  async createSentence(data: NewSentenceItem) {
    return contentRepository.createSentence(data);
  },
  async updateSentence(id: string, data: Partial<NewSentenceItem>) {
    return contentRepository.updateSentence(id, data);
  },
  async deleteSentence(id: string) {
    return contentRepository.deleteSentence(id);
  },

  // Re-seed original curriculum
  async resetAndReseed() {
    await runSeed();
    return { success: true, message: "Curriculum successfully re-seeded" };
  },
};
