import React from "react";
import { getSession } from "@/core/auth/session";
import { redirect } from "next/navigation";
import { grammarRepository } from "@/modules/grammar/repositories/grammar-repository";
import { userRepository } from "@/modules/auth/repositories/user-repository";
import { GrammarPatternViewer } from "@/components/grammar/grammar-pattern-viewer";

export const metadata = {
  title: "Grammar Patterns - NihongoFlow",
  description:
    "Comprehensive Japanese grammar pattern repository with formula blueprints, contextual examples, and contrastive pedagogical explanations.",
};

export default async function GrammarPage() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const profile = await userRepository.findProfileByUserId(session.userId);
  const patterns = await grammarRepository.findAll();

  return (
    <div className="py-2">
      <GrammarPatternViewer
        initialPatterns={patterns}
        userCurrentLesson={profile?.startingLesson || 1}
      />
    </div>
  );
}
