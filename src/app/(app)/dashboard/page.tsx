import React from "react";
import { getSession } from "@/core/auth/session";
import { userRepository } from "@/modules/auth/repositories/user-repository";
import { Sparkles, Flame, Trophy, Compass, ArrowRight, BookOpen } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Dashboard - NihongoFlow",
};

export default async function DashboardPage() {
  const session = await getSession();
  const user = session ? await userRepository.findById(session.userId) : null;
  const profile = session ? await userRepository.findProfileByUserId(session.userId) : null;

  const currentLesson = profile?.startingLesson || 1;
  const levelLabel = profile?.levelLabel || "Beginner";

  return (
    <div className="space-y-8">
      {/* Welcome & Status Hero Bento */}
      <div
        className="bento p-6 sm:p-8 relative overflow-hidden"
        style={{ "--card-glow": "rgba(88, 204, 2, 0.3)" } as React.CSSProperties}
      >
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 chip">
              <span>🦊</span>
              <span className="text-[#58cc02]">{levelLabel}</span>
              <span className="text-[#9a9aa8]">• Lesson {currentLesson}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-display font-extrabold text-white tracking-tight">
              おかえり, {user?.name || "Learner"}!
            </h1>
            <p className="text-xs sm:text-sm text-[#9a9aa8] max-w-xl font-sans leading-relaxed">
              Your guided learning loop is ready. Continue your lesson sequence or calibrate your starting point anytime.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link href="/placement">
              <Button variant="chunkyOutline" size="default">
                <Compass className="w-4 h-4 mr-1.5 text-[#1cb0f6]" />
                Placement Quiz
              </Button>
            </Link>
            <Link href={`/lessons/${currentLesson}`}>
              <Button variant="chunky" size="default">
                Continue Lesson {currentLesson} 🦊
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* 3-Column Bento Stat Cards (Cycled accents from design.md: green, orange, purple) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Green Accent (Level & Lesson) */}
        <div
          className="bento p-6 space-y-3"
          style={{ "--card-glow": "rgba(88, 204, 2, 0.3)" } as React.CSSProperties}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-extrabold tracking-wider text-[#58cc02]">
              Curriculum Track
            </span>
            <BookOpen className="w-4 h-4 text-[#58cc02]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-display font-extrabold text-white">
              Lesson {currentLesson}
            </span>
          </div>
          <p className="text-xs text-[#9a9aa8]">
            Vocabulary, grammar explanations, and cumulative sentence drills.
          </p>
        </div>

        {/* Card 2: Orange Accent (Streak) */}
        <div
          className="bento p-6 space-y-3"
          style={{ "--card-glow": "rgba(255, 150, 0, 0.3)" } as React.CSSProperties}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-extrabold tracking-wider text-[#ff9600]">
              Study Consistency
            </span>
            <Flame className="w-4 h-4 text-[#ff9600]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-display font-extrabold text-white">0</span>
            <span className="text-xs text-[#9a9aa8]">day streak</span>
          </div>
          <p className="text-xs text-[#9a9aa8]">
            Complete 1 practice session or flashcard deck per calendar day. 1 freeze available weekly.
          </p>
        </div>

        {/* Card 3: Purple Accent (XP & Levels) */}
        <div
          className="bento p-6 space-y-3"
          style={{ "--card-glow": "rgba(206, 130, 255, 0.3)" } as React.CSSProperties}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-extrabold tracking-wider text-[#ce82ff]">
              Effort Rewards
            </span>
            <Trophy className="w-4 h-4 text-[#ce82ff]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-display font-extrabold text-white">0</span>
            <span className="text-xs text-[#9a9aa8]">XP (Level 0)</span>
          </div>
          <p className="text-xs text-[#9a9aa8]">
            Server-verified XP awarded for review and practice, capped to block guessing loops.
          </p>
        </div>
      </div>

      {/* SWOT Diagnostics Preview Banner */}
      <div
        className="bento p-6 space-y-3"
        style={{ "--card-glow": "rgba(28, 176, 246, 0.25)" } as React.CSSProperties}
      >
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#1cb0f6]" />
          <h2 className="text-base font-display font-bold text-white">
            SWOT Diagnostic Feedback Active
          </h2>
        </div>
        <p className="text-xs text-[#9a9aa8] leading-relaxed">
          As you practice sentences in Lesson {currentLesson}, NihongoFlow automatically aggregates your grammatical error tags into Strengths, Weaknesses, Opportunities, and Threats to generate tailored reinforcement missions.
        </p>
      </div>
    </div>
  );
}
