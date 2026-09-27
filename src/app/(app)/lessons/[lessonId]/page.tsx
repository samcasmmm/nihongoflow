import React from "react";
import { getSession } from "@/core/auth/session";
import { redirect, notFound } from "next/navigation";
import { lessonFlowService } from "@/modules/lessons/services/lesson-flow-service";
import { LessonStepper } from "@/components/lessons/lesson-stepper";

interface Props {
  params: Promise<{ lessonId: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { lessonId } = await params;
  return {
    title: `Lesson ${lessonId} - NihongoFlow`,
    description: `Guided syllabus loop: Vocabulary, Grammar Explanations, and Cumulative Sentence Drills.`,
  };
}

export default async function LessonPage({ params }: Props) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const { lessonId } = await params;
  const lessonNumber = parseInt(lessonId, 10);

  if (isNaN(lessonNumber) || lessonNumber < 1 || lessonNumber > 5) {
    notFound();
  }

  let details;
  try {
    details = await lessonFlowService.getLessonDetails(session.userId, lessonNumber);
  } catch (err) {
    console.error("Failed to load lesson:", err);
    notFound();
  }

  return (
    <div className="py-2">
      <LessonStepper
        lesson={details.lesson}
        vocab={details.vocab}
        grammar={details.grammar}
        sentences={details.sentences}
        initialProgress={details.progress}
      />
    </div>
  );
}
