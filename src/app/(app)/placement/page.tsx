import React from "react";
import { getSession } from "@/core/auth/session";
import { userRepository } from "@/modules/auth/repositories/user-repository";
import { placementService } from "@/modules/placement/services/placement-service";
import { PlacementQuiz } from "@/modules/placement/components/placement-quiz";

export const metadata = {
  title: "Placement Assessment - NihongoFlow",
  description: "Find the ideal starting lesson for your Japanese learning journey.",
};

export default async function PlacementPage() {
  const session = await getSession();
  const profile = session ? await userRepository.findProfileByUserId(session.userId) : null;
  const questions = placementService.getQuestions();

  return (
    <div className="py-4 space-y-6">
      <div className="text-center max-w-xl mx-auto space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Japanese Placement Assessment
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Answer a few quick questions to determine your starting lesson. You can always adjust your level manually afterwards.
        </p>
      </div>

      <PlacementQuiz
        questions={questions}
        currentStartingLesson={profile?.startingLesson || 1}
      />
    </div>
  );
}
