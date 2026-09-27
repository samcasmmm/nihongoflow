import React from "react";
import { getSession } from "@/core/auth/session";
import { redirect } from "next/navigation";
import { contentService } from "@/modules/content/services/content-service";
import { ContentStudio } from "@/components/admin/content-studio";

export const metadata = {
  title: "Content Management Studio - NihongoFlow",
  description: "Live curriculum editor for lessons, vocabulary, grammar patterns, kana, and practice sentence bank.",
};

export default async function CmsPage() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const [lessons, vocab, kana, grammar, sentences] = await Promise.all([
    contentService.getLessons(),
    contentService.getVocab(),
    contentService.getKana("hiragana"),
    contentService.getGrammar(),
    contentService.getSentences(),
  ]);

  return (
    <div className="py-2">
      <ContentStudio
        initialLessons={lessons}
        initialVocab={vocab}
        initialKana={kana}
        initialGrammar={grammar}
        initialSentences={sentences}
      />
    </div>
  );
}
