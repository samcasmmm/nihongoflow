import React from "react";
import { getSession } from "@/core/auth/session";
import { userRepository } from "@/modules/auth/repositories/user-repository";
import { gamificationService } from "@/modules/gamification/services/gamification-service";
import { lessonRepository } from "@/modules/lessons/repositories/lesson-repository";
import { deckRepository } from "@/modules/decks/repositories/deck-repository";
import {
  Flame,
  Trophy,
  Compass,
  ArrowRight,
  BookOpen,
  Layers,
  Target,
  Shield,
  Zap,
  CheckCircle2,
  Clock,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Dashboard - NihongoFlow",
};

export default async function DashboardPage() {
  const session = await getSession();
  const userId = session?.userId || "";
  const user = session ? await userRepository.findById(userId) : null;
  const profile = session ? await userRepository.findProfileByUserId(userId) : null;

  const currentLessonNum = profile?.startingLesson || 1;
  const levelLabel = profile?.levelLabel || "Beginner";

  // Fetch gamification state, lessons list, and deck stats
  const summary = session
    ? await gamificationService.getSummary(userId)
    : {
        totalXp: 0,
        level: 0,
        levelLabel: "Absolute Beginner",
        nextLevelXp: 50,
        levelProgressPercent: 0,
        currentStreak: 0,
        longestStreak: 0,
        streakFreezesAvailable: 1,
        dailyGoalXp: 10,
        dailyEarnedXp: 0,
        dailyGoalMet: false,
        activeMissions: [],
      };

  const allLessons = await lessonRepository.findAll();
  const currentLessonData =
    allLessons.find((l) => l.lessonNumber === currentLessonNum) || allLessons[0];

  const deckData = session
    ? await deckRepository.getHiraganaCards(userId)
    : { stats: { totalCards: 104, masteredCount: 0, learningCount: 0, unseenCount: 104 } };

  return (
    <div className="space-y-10">
      {/* 1. Hero Welcome & Guided Continue Banner */}
      <div
        className="bento p-6 sm:p-8 relative overflow-hidden"
        style={{ "--card-glow": "rgba(88, 204, 2, 0.25)" } as React.CSSProperties}
      >
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="chip text-[#58cc02] border-[#58cc02]/30 bg-[#58cc02]/10 font-bold">
                Level {summary.level} • {summary.levelLabel}
              </span>
              <span className="chip text-[#1cb0f6] border-[#1cb0f6]/30 bg-[#1cb0f6]/10">
                {levelLabel} Track
              </span>
              <span className="chip text-[#9a9aa8] border-white/10 bg-white/5">
                Lesson {currentLessonNum} of 5
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-display font-extrabold text-white tracking-tight">
              おかえり、{user?.name?.split(" ")[0] || "Learner"}!
            </h1>
            <p className="text-xs sm:text-sm text-[#9a9aa8] font-sans leading-relaxed">
              Your guided lesson loop is queued up. Complete daily kana reviews, master sentence patterns, and strengthen your grammatical foundation.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link href="/placement">
              <Button variant="chunkyOutline" size="default">
                <Compass className="w-4 h-4 mr-1.5 text-[#1cb0f6]" />
                Recalibrate Level
              </Button>
            </Link>
            <Link href={`/lessons/${currentLessonNum}`}>
              <Button variant="chunky" size="default">
                Continue Lesson {currentLessonNum} 🦊
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Gamification Summary Bento Row (Streaks, XP, Daily Goal) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs uppercase tracking-wider font-extrabold text-[#9a9aa8] font-mono">
            Study Consistency & Effort Metrics
          </h2>
          <span className="text-[11px] text-[#9a9aa8]">Server Verified</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Streak Card */}
          <div
            className="bento p-5 space-y-3"
            style={{ "--card-glow": "rgba(255, 150, 0, 0.3)" } as React.CSSProperties}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-extrabold tracking-wider text-[#ff9600]">
                Daily Habit Streak
              </span>
              <div className="w-8 h-8 rounded-xl bg-[#ff9600]/15 flex items-center justify-center text-[#ff9600]">
                <Flame className="w-4 h-4 fill-current" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-display font-extrabold text-white">
                {summary.currentStreak}
              </span>
              <span className="text-xs text-[#9a9aa8]">days active</span>
              {summary.longestStreak > summary.currentStreak && (
                <span className="text-[10px] text-[#9a9aa8]/80 font-mono ml-auto">
                  Best: {summary.longestStreak}d
                </span>
              )}
            </div>
            <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-[#9a9aa8]">
                <Shield className="w-3.5 h-3.5 text-[#1cb0f6]" />
                <span>Streak Freezes</span>
              </div>
              <span className="font-bold text-[#1cb0f6]">
                {summary.streakFreezesAvailable} buffer available
              </span>
            </div>
          </div>

          {/* XP & Level Card */}
          <div
            className="bento p-5 space-y-3"
            style={{ "--card-glow": "rgba(206, 130, 255, 0.3)" } as React.CSSProperties}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-extrabold tracking-wider text-[#ce82ff]">
                Experience Points
              </span>
              <div className="w-8 h-8 rounded-xl bg-[#ce82ff]/15 flex items-center justify-center text-[#ce82ff]">
                <Trophy className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline justify-between">
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-display font-extrabold text-white">
                  {summary.totalXp}
                </span>
                <span className="text-xs text-[#9a9aa8]">XP</span>
              </div>
              <span className="text-xs font-bold text-[#ce82ff] font-mono">
                Level {summary.level}
              </span>
            </div>
            {/* Level progress bar */}
            <div className="space-y-1.5">
              <div className="w-full bg-[#1e2029] h-2 rounded-full overflow-hidden border border-white/5">
                <div
                  className="bg-linear-to-r from-[#ce82ff] to-[#a855f7] h-full rounded-full transition-all duration-500"
                  style={{ width: `${summary.levelProgressPercent}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[11px] text-[#9a9aa8]">
                <span>{summary.levelProgressPercent}% to next rank</span>
                <span className="font-mono">{summary.nextLevelXp} XP goal</span>
              </div>
            </div>
          </div>

          {/* Daily Goal Card */}
          <div
            className="bento p-5 space-y-3"
            style={{ "--card-glow": "rgba(88, 204, 2, 0.3)" } as React.CSSProperties}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-extrabold tracking-wider text-[#58cc02]">
                Daily Target
              </span>
              <div className="w-8 h-8 rounded-xl bg-[#58cc02]/15 flex items-center justify-center text-[#58cc02]">
                <Target className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline justify-between">
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-display font-extrabold text-white">
                  {summary.dailyEarnedXp}
                </span>
                <span className="text-xs text-[#9a9aa8]">/ {summary.dailyGoalXp} XP</span>
              </div>
              {summary.dailyGoalMet ? (
                <span className="chip text-[#58cc02] border-[#58cc02]/30 bg-[#58cc02]/10 font-bold text-[11px]">
                  Achieved 🎯
                </span>
              ) : (
                <span className="text-xs text-[#9a9aa8]">
                  {Math.max(0, summary.dailyGoalXp - summary.dailyEarnedXp)} XP left
                </span>
              )}
            </div>
            {/* Daily Goal progress bar */}
            <div className="space-y-1.5">
              <div className="w-full bg-[#1e2029] h-2 rounded-full overflow-hidden border border-white/5">
                <div
                  className="bg-linear-to-r from-[#58cc02] to-[#46a302] h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(
                      100,
                      Math.round((summary.dailyEarnedXp / Math.max(1, summary.dailyGoalXp)) * 100)
                    )}%`,
                  }}
                />
              </div>
              <p className="text-[11px] text-[#9a9aa8]">
                Earned via reviews, sentence drills, and grammar checks.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. The 5 Core Entry Cards (module-wise-feature.md §3) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-display font-bold text-white flex items-center gap-2">
            <span>Learning Modules</span>
            <span className="text-xs font-mono font-normal text-[#9a9aa8]">5 Core Workspaces</span>
          </h2>
          <span className="text-xs text-[#9a9aa8]">Cumulative Minna-no-Nihongo Progression</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1: Start Learning (Current Lesson) */}
          <div
            className="bento p-6 flex flex-col justify-between group hover:border-[#58cc02]/60 transition-all duration-300 relative overflow-hidden"
            style={{ "--card-glow": "rgba(88, 204, 2, 0.2)" } as React.CSSProperties}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="chip text-[#58cc02] border-[#58cc02]/30 bg-[#58cc02]/10 font-bold">
                  Guided Syllabus
                </span>
                <span className="text-xs font-mono text-[#9a9aa8]">
                  Lesson {currentLessonNum} / 5
                </span>
              </div>

              <div>
                <h3 className="text-lg font-display font-bold text-white group-hover:text-[#58cc02] transition-colors">
                  1. Start Learning
                </h3>
                <p className="text-xs font-medium text-[#1cb0f6] mt-0.5">
                  {currentLessonData.japaneseTitle} • {currentLessonData.title}
                </p>
                <p className="text-xs text-[#9a9aa8] mt-2 line-clamp-2 leading-relaxed">
                  {currentLessonData.summary}
                </p>
              </div>

              <div className="bg-[#1e2029]/80 rounded-xl p-3 border border-white/5 space-y-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-[#9a9aa8]">Grammar Focus</span>
                  <span className="text-white font-mono">{currentLessonData.grammarTopic}</span>
                </div>
                <div className="w-full bg-[#2a2d3d] h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#58cc02] h-full w-[20%]" />
                </div>
              </div>
            </div>

            <div className="pt-5 mt-5 border-t border-white/5">
              <Link href={`/lessons/${currentLessonNum}`} className="block">
                <Button variant="chunky" size="sm" className="w-full">
                  Continue Lesson {currentLessonNum}
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Card 2: Hiragana Flashcards */}
          <div
            className="bento p-6 flex flex-col justify-between group hover:border-[#ff9600]/60 transition-all duration-300 relative overflow-hidden"
            style={{ "--card-glow": "rgba(255, 150, 0, 0.2)" } as React.CSSProperties}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="chip text-[#ff9600] border-[#ff9600]/30 bg-[#ff9600]/10 font-bold">
                  Spaced Repetition
                </span>
                <span className="text-xs font-mono text-[#9a9aa8]">
                  {deckData.stats.masteredCount} / {deckData.stats.totalCards} Mastered
                </span>
              </div>

              <div>
                <h3 className="text-lg font-display font-bold text-white group-hover:text-[#ff9600] transition-colors">
                  2. Hiragana Flashcards
                </h3>
                <p className="text-xs font-medium text-[#ff9600] mt-0.5">
                  あいうえお • Leitner Boxes 1–5
                </p>
                <p className="text-xs text-[#9a9aa8] mt-2 leading-relaxed">
                  Tactile 3D flashcards with mnemonics, audio-ready hooks, and dakuten + yōon decks.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-[#1e2029]/80 rounded-xl p-2 border border-white/5">
                  <div className="text-sm font-bold text-white">46</div>
                  <div className="text-[10px] text-[#9a9aa8]">Base</div>
                </div>
                <div className="bg-[#1e2029]/80 rounded-xl p-2 border border-white/5">
                  <div className="text-sm font-bold text-white">25</div>
                  <div className="text-[10px] text-[#9a9aa8]">Dakuten</div>
                </div>
                <div className="bg-[#1e2029]/80 rounded-xl p-2 border border-white/5">
                  <div className="text-sm font-bold text-white">33</div>
                  <div className="text-[10px] text-[#9a9aa8]">Yōon</div>
                </div>
              </div>
            </div>

            <div className="pt-5 mt-5 border-t border-white/5">
              <Link href="/flashcards/hiragana" className="block">
                <Button
                  variant="chunky"
                  size="sm"
                  className="w-full bg-[#ff9600] hover:bg-[#e08500] border-[#cc7800]"
                >
                  Review Hiragana Decks
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Card 3: Vocabulary Flashcards */}
          <div
            className="bento p-6 flex flex-col justify-between group hover:border-[#1cb0f6]/60 transition-all duration-300 relative overflow-hidden"
            style={{ "--card-glow": "rgba(28, 176, 246, 0.2)" } as React.CSSProperties}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="chip text-[#1cb0f6] border-[#1cb0f6]/30 bg-[#1cb0f6]/10 font-bold">
                  Cumulative Lexicon
                </span>
                <span className="text-xs font-mono text-[#9a9aa8]">Lessons 1–5</span>
              </div>

              <div>
                <h3 className="text-lg font-display font-bold text-white group-hover:text-[#1cb0f6] transition-colors">
                  3. Vocabulary Flashcards
                </h3>
                <p className="text-xs font-medium text-[#1cb0f6] mt-0.5">
                  Original Words • Picture Association
                </p>
                <p className="text-xs text-[#9a9aa8] mt-2 leading-relaxed">
                  Filter by lesson or study cumulative vocabulary up to your current lesson with full example sentences.
                </p>
              </div>

              <div className="bg-[#1e2029]/80 rounded-xl p-3 border border-white/5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-[#9a9aa8]">
                  <Layers className="w-4 h-4 text-[#1cb0f6]" />
                  <span>Cumulative Filter</span>
                </div>
                <span className="font-mono text-white text-[11px]">Up to L{currentLessonNum}</span>
              </div>
            </div>

            <div className="pt-5 mt-5 border-t border-white/5">
              <Link href="/flashcards/vocab" className="block">
                <Button variant="chunkyOutline" size="sm" className="w-full">
                  Browse Vocabulary
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Card 4: Grammar Patterns */}
          <div
            className="bento p-6 flex flex-col justify-between group hover:border-[#ce82ff]/60 transition-all duration-300 relative overflow-hidden"
            style={{ "--card-glow": "rgba(206, 130, 255, 0.2)" } as React.CSSProperties}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="chip text-[#ce82ff] border-[#ce82ff]/30 bg-[#ce82ff]/10 font-bold">
                  Formula Bank
                </span>
                <span className="text-xs font-mono text-[#9a9aa8]">N5 Foundation</span>
              </div>

              <div>
                <h3 className="text-lg font-display font-bold text-white group-hover:text-[#ce82ff] transition-colors">
                  4. Grammar Patterns
                </h3>
                <p className="text-xs font-medium text-[#ce82ff] mt-0.5">
                  Formulae • Contrastive Nuances
                </p>
                <p className="text-xs text-[#9a9aa8] mt-2 leading-relaxed">
                  Interactive breakdowns of は, が, も, の, particle slotting, and affirmative/negative conjugations.
                </p>
              </div>

              <div className="bg-[#1e2029]/80 rounded-xl p-3 border border-white/5 space-y-1">
                <span className="text-[10px] text-[#9a9aa8] uppercase font-mono tracking-wider">
                  Pattern Preview
                </span>
                <p className="text-xs text-white font-mono">
                  [N1] <span className="text-[#ce82ff]">は</span> [N2] <span className="text-[#58cc02]">です</span>
                </p>
              </div>
            </div>

            <div className="pt-5 mt-5 border-t border-white/5">
              <Link href="/grammar" className="block">
                <Button variant="chunkyOutline" size="sm" className="w-full">
                  Explore Grammar Bank
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Card 5: Practice & Placement Tests */}
          <div
            className="bento p-6 flex flex-col justify-between group hover:border-[#ffc800]/60 transition-all duration-300 relative overflow-hidden"
            style={{ "--card-glow": "rgba(255, 200, 0, 0.2)" } as React.CSSProperties}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="chip text-[#ffc800] border-[#ffc800]/30 bg-[#ffc800]/10 font-bold">
                  Diagnostic Quiz
                </span>
                <span className="text-xs font-mono text-[#9a9aa8]">6 Questions</span>
              </div>

              <div>
                <h3 className="text-lg font-display font-bold text-white group-hover:text-[#ffc800] transition-colors">
                  5. Tests & Recalibration
                </h3>
                <p className="text-xs font-medium text-[#ffc800] mt-0.5">
                  Adaptive Placement • Progress Check
                </p>
                <p className="text-xs text-[#9a9aa8] mt-2 leading-relaxed">
                  Retake the placement diagnostic anytime or manually override your starting curriculum level.
                </p>
              </div>

              <div className="bg-[#1e2029]/80 rounded-xl p-3 border border-white/5 flex items-center justify-between text-xs">
                <span className="text-[#9a9aa8]">Current Starting Level</span>
                <span className="chip text-[#ffc800] border-[#ffc800]/30 bg-[#ffc800]/10 font-mono text-[11px]">
                  Lesson {currentLessonNum}
                </span>
              </div>
            </div>

            <div className="pt-5 mt-5 border-t border-white/5">
              <Link href="/placement" className="block">
                <Button variant="chunkyOutline" size="sm" className="w-full">
                  Launch Diagnostic Quiz
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Quick Curriculum Roadmap Info Box */}
          <div className="bento p-6 flex flex-col justify-between border-dashed border-white/10 bg-white/1">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-white">
                <BookOpen className="w-5 h-5 text-[#58cc02]" />
              </div>
              <h3 className="text-base font-display font-bold text-white">
                Pedagogical Guarantee
              </h3>
              <p className="text-xs text-[#9a9aa8] leading-relaxed">
                NihongoFlow enforces strict cumulative vocabulary checks. Practice drills will never test grammar or kanji you haven&apos;t encountered yet.
              </p>
            </div>
            <div className="pt-4 text-[11px] text-[#9a9aa8] flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#58cc02]" />
              <span>Recommended: 15–20 mins / day</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Active Weakness & Refresh Missions (design.md §3.5–3.7) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#1cb0f6]" />
            <h2 className="text-base font-display font-bold text-white">
              Targeted Reinforcement Missions
            </h2>
          </div>
          <span className="text-xs text-[#9a9aa8]">SWOT Diagnostic Engine</span>
        </div>

        {summary.activeMissions && summary.activeMissions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {summary.activeMissions.map((mission) => (
              <div
                key={mission.id}
                className="bento p-5 space-y-3 border-l-4 border-l-[#1cb0f6]"
                style={{ "--card-glow": "rgba(28, 176, 246, 0.2)" } as React.CSSProperties}
              >
                <div className="flex items-center justify-between">
                  <span className="chip text-[#1cb0f6] border-[#1cb0f6]/30 bg-[#1cb0f6]/10 font-mono text-[10px]">
                    {mission.type === "weakness_reinforce" ? "Weakness Target" : "Decay Refresh"}
                  </span>
                  <span className="text-xs font-mono text-white font-bold">
                    {mission.currentCount} / {mission.targetCount} Complete
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-white">{mission.title}</h3>
                  <p className="text-xs text-[#9a9aa8] mt-1 leading-relaxed">
                    {mission.description}
                  </p>
                </div>

                <div className="space-y-1.5 pt-1">
                  <div className="w-full bg-[#1e2029] h-2 rounded-full overflow-hidden border border-white/5">
                    <div
                      className="bg-linear-to-r from-[#1cb0f6] to-[#0284c7] h-full rounded-full transition-all duration-500"
                      style={{ width: `${mission.progressPercent}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-[#9a9aa8]">
                    <span>Tag: #{mission.targetTag}</span>
                    <Link
                      href={`/lessons/${currentLessonNum}/practice`}
                      className="text-[#1cb0f6] hover:underline font-medium inline-flex items-center gap-1"
                    >
                      Start Drill <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bento p-6 text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-[#58cc02] mx-auto" />
            <h3 className="text-sm font-bold text-white">No Critical Weaknesses Flagged</h3>
            <p className="text-xs text-[#9a9aa8] max-w-md mx-auto">
              Great mastery! Continue your current lesson practice to unlock new diagnostic insight missions.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
