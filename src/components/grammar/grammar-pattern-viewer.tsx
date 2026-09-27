"use client";

import React, { useState, useMemo, useCallback } from "react";
import { GrammarPattern } from "@/db/schema";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Volume2,
  AlertTriangle,
  Search,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Code2,
} from "lucide-react";
import Link from "next/link";

interface Props {
  initialPatterns: GrammarPattern[];
  userCurrentLesson?: number;
}

export function GrammarPatternViewer({ initialPatterns, userCurrentLesson = 1 }: Props) {
  const [selectedLesson, setSelectedLesson] = useState<number | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showRomaji, setShowRomaji] = useState(true);

  // Filter patterns
  const filteredPatterns = useMemo(() => {
    return initialPatterns.filter((pattern) => {
      if (selectedLesson !== "all" && pattern.lessonNumber !== selectedLesson) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = pattern.title.toLowerCase().includes(q);
        const matchesJa = pattern.japaneseTitle.includes(q);
        const matchesFormula = pattern.formula.toLowerCase().includes(q);
        const matchesExplanation = pattern.explanation.toLowerCase().includes(q);
        const matchesTag = pattern.skillTag.toLowerCase().includes(q);
        return matchesTitle || matchesJa || matchesFormula || matchesExplanation || matchesTag;
      }
      return true;
    });
  }, [initialPatterns, selectedLesson, searchQuery]);

  const speakJapanese = useCallback((text: string) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "ja-JP";
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs text-[#9a9aa8] hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Dashboard
          </Link>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-tight flex items-center gap-2">
            <span>Grammar Pattern Bank</span>
            <span className="text-xs font-mono font-normal chip text-[#ce82ff] border-[#ce82ff]/30 bg-[#ce82ff]/10">
              Formulas & Nuances
            </span>
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowRomaji((prev) => !prev)}
            className="chip border-white/10 bg-white/5 text-xs font-mono hover:bg-white/10 transition-colors"
          >
            Rōmaji: {showRomaji ? "ON" : "OFF"}
          </button>
          <div className="chip text-[#ce82ff] border-[#ce82ff]/30 bg-[#ce82ff]/10 font-mono text-xs">
            {initialPatterns.length} Patterns Mastered
          </div>
        </div>
      </div>

      {/* Lesson Selector Tabs & Search */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setSelectedLesson("all")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedLesson === "all"
                  ? "bg-white text-[#13151b] shadow-md"
                  : "text-[#9a9aa8] hover:text-white bg-white/5 hover:bg-white/10"
              }`}
            >
              All Lessons ({initialPatterns.length})
            </button>
            {[1, 2, 3, 4, 5].map((lNum) => (
              <button
                key={lNum}
                onClick={() => setSelectedLesson(lNum)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedLesson === lNum
                    ? "bg-[#ce82ff] text-white shadow-md shadow-[#ce82ff]/20"
                    : "text-[#9a9aa8] hover:text-white bg-white/5 hover:bg-white/10"
                }`}
              >
                Lesson {lNum} {userCurrentLesson === lNum ? "⭐" : ""}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-[#9a9aa8] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search grammar, particles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#181a24] border border-white/10 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-[#9a9aa8]/60 focus:outline-none focus:border-[#ce82ff]"
            />
          </div>
        </div>
      </div>

      {/* Patterns Feed */}
      {filteredPatterns.length > 0 ? (
        <div className="space-y-6">
          {filteredPatterns.map((pattern) => (
            <div
              key={pattern.id}
              className="bento p-6 sm:p-8 space-y-6 relative overflow-hidden group hover:border-[#ce82ff]/40 transition-all duration-300"
              style={{ "--card-glow": "rgba(206, 130, 255, 0.15)" } as React.CSSProperties}
            >
              {/* Pattern Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="chip text-[#ce82ff] border-[#ce82ff]/30 bg-[#ce82ff]/10 text-[11px] font-mono font-bold">
                      Lesson {pattern.lessonNumber}
                    </span>
                    <span className="chip text-[#1cb0f6] border-[#1cb0f6]/30 bg-[#1cb0f6]/10 text-[11px] font-mono">
                      #{pattern.skillTag}
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-display font-extrabold text-white mt-1">
                    {pattern.title}
                  </h2>
                </div>

                <div className="text-right sm:text-right">
                  <span className="text-sm font-bold font-mono text-[#e4e4e9] bg-white/5 px-3 py-1.5 rounded-xl border border-white/10">
                    {pattern.japaneseTitle}
                  </span>
                </div>
              </div>

              {/* Formula Blueprint Card */}
              <div className="bg-[#11131a] p-4 rounded-2xl border border-white/10 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs text-[#9a9aa8]">
                  <Code2 className="w-4 h-4 text-[#ce82ff]" />
                  <span className="font-mono uppercase font-bold text-[11px]">Formula:</span>
                  <span className="text-white font-mono text-sm sm:text-base font-bold bg-[#1e2029] px-3 py-1 rounded-lg border border-white/5">
                    {pattern.formula}
                  </span>
                </div>
                <div className="text-[11px] text-[#9a9aa8] hidden sm:block font-mono">
                  Key: {pattern.patternKey}
                </div>
              </div>

              {/* Explanation */}
              <div className="space-y-2">
                <h3 className="text-xs uppercase tracking-wider font-extrabold text-[#9a9aa8] font-mono">
                  Pedagogical Breakdown
                </h3>
                <p className="text-sm text-[#e4e4e9] leading-relaxed">
                  {pattern.explanation}
                </p>
              </div>

              {/* Examples Grid */}
              <div className="space-y-3">
                <h3 className="text-xs uppercase tracking-wider font-extrabold text-[#58cc02] font-mono flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Curated Example Sentences</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {pattern.examples.map((ex, idx) => (
                    <div
                      key={idx}
                      className="bg-[#181a24] p-4 rounded-2xl border border-white/5 space-y-2 relative group/ex hover:border-white/20 transition-all"
                    >
                      <div className="flex items-start justify-between">
                        <div className="space-y-0.5">
                          <div className="text-base font-bold text-white">
                            {ex.japanese}
                          </div>
                          <div className="text-xs text-[#9a9aa8] font-mono">
                            {ex.reading}
                          </div>
                          {showRomaji && (
                            <div className="text-[11px] text-[#1cb0f6] font-mono">
                              /{ex.romaji}/
                            </div>
                          )}
                        </div>

                        <button
                          onClick={() => speakJapanese(ex.reading || ex.japanese)}
                          className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-[#1cb0f6] hover:bg-white/10 hover:scale-105 active:scale-95 transition-all"
                          title="Listen to pronunciation"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="pt-2 border-t border-white/5 text-xs text-[#e4e4e9] font-medium">
                        &ldquo;{ex.english}&rdquo;
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Common Pitfalls / Mistakes Box */}
              {pattern.commonMistakes && (
                <div className="bg-[#ff9600]/10 border border-[#ff9600]/30 rounded-2xl p-4 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#ff9600]">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Common Nuance Pitfalls & Avoidances</span>
                  </div>
                  <p className="text-xs text-[#e4e4e9] leading-relaxed">
                    {pattern.commonMistakes}
                  </p>
                </div>
              )}

              {/* Footer CTA to practice this pattern */}
              <div className="pt-2 flex items-center justify-end">
                <Link href={`/lessons/${pattern.lessonNumber}`}>
                  <Button variant="chunkyOutline" size="sm" className="border-white/10">
                    Drill in Lesson {pattern.lessonNumber}
                    <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bento p-12 text-center space-y-4">
          <BookOpen className="w-12 h-12 text-[#ce82ff] mx-auto" />
          <h2 className="text-lg font-bold text-white">No grammar patterns found</h2>
          <p className="text-xs text-[#9a9aa8] max-w-sm mx-auto">
            Try adjusting your search query or switch back to All Lessons.
          </p>
          <Button variant="chunkyOutline" onClick={() => setSearchQuery("")}>
            Clear Search
          </Button>
        </div>
      )}
    </div>
  );
}
