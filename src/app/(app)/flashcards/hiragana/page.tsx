import React from "react";
import { getSession } from "@/core/auth/session";
import { redirect } from "next/navigation";
import { deckRepository } from "@/modules/decks/repositories/deck-repository";
import { HiraganaDeck } from "@/components/flashcards/hiragana-deck";

export const metadata = {
  title: "Hiragana Flashcards - NihongoFlow",
  description:
    "Master the Japanese Hiragana syllabary using Leitner spaced repetition, visual mnemonics, and tactile 3D cards.",
};

export default async function HiraganaFlashcardsPage() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const { cards, stats } = await deckRepository.getHiraganaCards(session.userId);

  return (
    <div className="py-2">
      <HiraganaDeck initialCards={cards} initialStats={stats} />
    </div>
  );
}
