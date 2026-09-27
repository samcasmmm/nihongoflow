import React from "react";
import { getSession } from "@/core/auth/session";
import { redirect } from "next/navigation";
import { vocabularyRepository } from "@/modules/vocabulary/repositories/vocabulary-repository";
import { userRepository } from "@/modules/auth/repositories/user-repository";
import { VocabularyDeck } from "@/components/flashcards/vocabulary-deck";

export const metadata = {
  title: "Vocabulary Flashcards - NihongoFlow",
  description:
    "Learn Japanese vocabulary with picture association, furigana readings, contextual example sentences, and Leitner spaced repetition.",
};

export default async function VocabularyFlashcardsPage() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const profile = await userRepository.findProfileByUserId(session.userId);
  const currentLesson = profile?.startingLesson || 1;

  const { cards, stats } = await vocabularyRepository.getVocabCards(session.userId);

  return (
    <div className="py-2">
      <VocabularyDeck
        initialCards={cards}
        initialStats={stats}
        initialLessonNumber={currentLesson}
      />
    </div>
  );
}
