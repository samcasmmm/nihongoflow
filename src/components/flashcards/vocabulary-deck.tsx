"use client";

import React, { useState, useEffect, useTransition, useCallback, useMemo } from "react";
import { VocabCardWithProgress, VocabDeckStats } from "@/modules/vocabulary/repositories/vocabulary-repository";
import { Button } from "@/components/ui/button";
import {
  RotateCcw,
  Shuffle,
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  Volume2,
  Sparkles,
  Layers,
  ArrowLeft,
  Trophy,
  BookOpen,
} from "lucide-react";
import Link from "next/link";

interface Props {
  initialCards: VocabCardWithProgress[];
  initialStats: VocabDeckStats;
  initialLessonNumber?: number;
}

export function VocabularyDeck({ initialCards, initialStats }: Props) {
  const [filterMode, setFilterMode] = useState<string>("all");
  const [cards, setCards] = useState<VocabCardWithProgress[]>(initialCards);
  const [stats, setStats] = useState<VocabDeckStats>(initialStats);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [xpToast, setXpToast] = useState<{ show: boolean; text: string }>({
    show: false,
    text: "",
  });
  const [sessionReviewedCount, setSessionReviewedCount] = useState(0);
  const [sessionXpEarned, setSessionXpEarned] = useState(0);
  const [, startTransition] = useTransition();

  // Filter cards based on selected filter
  const displayedCards = useMemo(() => {
    if (filterMode === "all") return cards;
    if (filterMode.startsWith("upto-")) {
      const maxL = parseInt(filterMode.replace("upto-", ""), 10);
      return cards.filter((c) => c.lessonNumber <= maxL);
    }
    if (filterMode.startsWith("lesson-")) {
      const l = parseInt(filterMode.replace("lesson-", ""), 10);
      return cards.filter((c) => c.lessonNumber === l);
    }
    return cards;
  }, [cards, filterMode]);

  const currentCard = displayedCards[currentIndex] || displayedCards[0];

  const handleFilterChange = (mode: string) => {
    setFilterMode(mode);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const handleFlip = () => {
    setIsFlipped((prev) => !prev);
  };

  const handleNext = useCallback(() => {
    if (currentIndex < displayedCards.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setIsFlipped(false);
    }
  }, [currentIndex, displayedCards.length]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setIsFlipped(false);
    }
  }, [currentIndex]);

  const showToast = useCallback((text: string) => {
    setXpToast({ show: true, text });
    setTimeout(() => {
      setXpToast({ show: false, text: "" });
    }, 2200);
  }, []);

  const handleShuffle = useCallback(() => {
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
    showToast("Deck shuffled 🔀");
  }, [cards, showToast]);

  const speakJapanese = useCallback((text: string) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "ja-JP";
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  const submitProgress = useCallback(
    async (action: "know_it" | "still_learning") => {
      if (!currentCard) return;

      const cardId = currentCard.id;
      const oldBox = currentCard.box;

      // Optimistic state update
      const newBox = action === "know_it" ? Math.min(5, oldBox + 1) : 1;

      setCards((prev) =>
        prev.map((c) =>
          c.id === cardId
            ? {
                ...c,
                box: newBox,
                timesReviewed: c.timesReviewed + 1,
                timesCorrect: c.timesCorrect + (action === "know_it" ? 1 : 0),
              }
            : c
        )
      );

      // Update stats
      setStats((prev) => {
        const dist = { ...prev.boxDistribution };
        const oldKey = `box${oldBox}` as keyof typeof dist;
        const newKey = `box${newBox}` as keyof typeof dist;
        dist[oldKey] = Math.max(0, dist[oldKey] - 1);
        dist[newKey] = (dist[newKey] || 0) + 1;
        return {
          ...prev,
          boxDistribution: dist,
          masteredCount: newBox === 5 ? prev.masteredCount + 1 : prev.masteredCount,
        };
      });

      setSessionReviewedCount((prev) => prev + 1);
      setSessionXpEarned((prev) => prev + 1);

      if (action === "know_it") {
        showToast(`+1 XP • Advanced to Box ${newBox} 🎯`);
      } else {
        showToast("+1 XP • Queued for reinforcement (Box 1) 🔁");
      }

      // Advance to next card
      if (currentIndex < displayedCards.length - 1) {
        setCurrentIndex((prev) => prev + 1);
        setIsFlipped(false);
      }

      // Call server API in background
      startTransition(async () => {
        try {
          await fetch(`/api/cards/${cardId}/progress`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ cardType: "vocab", action }),
          });
        } catch (err) {
          console.error("Failed to sync card progress:", err);
        }
      });
    },
    [currentCard, currentIndex, displayedCards.length, showToast]
  );

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (["INPUT", "TEXTAREA"].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.code === "Space") {
        e.preventDefault();
        handleFlip();
      } else if (e.key === "1") {
        submitProgress("still_learning");
      } else if (e.key === "2") {
        submitProgress("know_it");
      } else if (e.code === "ArrowRight") {
        handleNext();
      } else if (e.code === "ArrowLeft") {
        handlePrev();
      } else if (e.key.toLowerCase() === "s") {
        handleShuffle();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNext, handlePrev, handleShuffle, submitProgress]);

  const boxColors = [
    { label: "Box 1: Learning", bg: "bg-rose-500/20", border: "border-rose-500/40", text: "text-rose-400" },
    { label: "Box 2: Review", bg: "bg-amber-500/20", border: "border-amber-500/40", text: "text-amber-400" },
    { label: "Box 3: Familiar", bg: "bg-blue-500/20", border: "border-blue-500/40", text: "text-blue-400" },
    { label: "Box 4: Strong", bg: "bg-purple-500/20", border: "border-purple-500/40", text: "text-purple-400" },
    { label: "Box 5: Mastered", bg: "bg-[#58cc02]/20", border: "border-[#58cc02]/40", text: "text-[#58cc02]" },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header and Live Session Counter */}
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
            <span>Vocabulary Flashcards</span>
            <span className="text-xs font-mono font-normal chip text-[#1cb0f6] border-[#1cb0f6]/30 bg-[#1cb0f6]/10">
              Picture Association
            </span>
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="chip text-[#58cc02] border-[#58cc02]/30 bg-[#58cc02]/10 font-mono text-xs flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>+{sessionXpEarned} XP this session</span>
          </div>
          <div className="chip text-[#9a9aa8] border-white/10 bg-white/5 font-mono text-xs">
            {sessionReviewedCount} words reviewed
          </div>
        </div>
      </div>

      {/* Cumulative & Lesson Filters Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => handleFilterChange("all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterMode === "all"
                ? "bg-white text-[#13151b] shadow-md"
                : "text-[#9a9aa8] hover:text-white bg-white/5 hover:bg-white/10"
            }`}
          >
            All Lessons (1–5)
          </button>
          <button
            onClick={() => handleFilterChange("upto-2")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterMode === "upto-2"
                ? "bg-[#1cb0f6] text-white shadow-md shadow-[#1cb0f6]/20"
                : "text-[#9a9aa8] hover:text-white bg-white/5 hover:bg-white/10"
            }`}
          >
            Cumulative (Up to L2)
          </button>
          <button
            onClick={() => handleFilterChange("lesson-1")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterMode === "lesson-1"
                ? "bg-[#58cc02] text-white shadow-md shadow-[#58cc02]/20"
                : "text-[#9a9aa8] hover:text-white bg-white/5 hover:bg-white/10"
            }`}
          >
            Lesson 1 Only
          </button>
          <button
            onClick={() => handleFilterChange("lesson-2")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterMode === "lesson-2"
                ? "bg-[#ff9600] text-white shadow-md shadow-[#ff9600]/20"
                : "text-[#9a9aa8] hover:text-white bg-white/5 hover:bg-white/10"
            }`}
          >
            Lesson 2 Only
          </button>
          <button
            onClick={() => handleFilterChange("lesson-3")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterMode === "lesson-3"
                ? "bg-[#ce82ff] text-white shadow-md shadow-[#ce82ff]/20"
                : "text-[#9a9aa8] hover:text-white bg-white/5 hover:bg-white/10"
            }`}
          >
            Lesson 3
          </button>
        </div>

        <button
          onClick={handleShuffle}
          className="inline-flex items-center gap-1.5 text-xs text-[#9a9aa8] hover:text-white bg-white/5 px-2.5 py-1.5 rounded-xl transition-colors"
          title="Shuffle Deck (Press S)"
        >
          <Shuffle className="w-3.5 h-3.5 text-[#1cb0f6]" />
          <span>Shuffle (S)</span>
        </button>
      </div>

      {/* Leitner Box Distribution Stats Bar */}
      <div className="bento p-3 bg-white/[0.02] border-white/5">
        <div className="flex items-center justify-between text-xs text-[#9a9aa8] mb-2 font-mono">
          <div className="flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-[#1cb0f6]" />
            <span>Spaced Repetition Mastery Distribution</span>
          </div>
          <span className="text-[#58cc02] font-bold">
            {stats.masteredCount} / {stats.totalCards} Mastered (Box 5)
          </span>
        </div>
        <div className="grid grid-cols-5 gap-2">
          {boxColors.map((box, idx) => {
            const bNum = idx + 1;
            const count =
              stats.boxDistribution[`box${bNum}` as keyof typeof stats.boxDistribution] || 0;
            return (
              <div
                key={bNum}
                className={`rounded-lg p-2 border ${box.bg} ${box.border} text-center transition-all`}
              >
                <div className={`text-xs font-mono font-bold ${box.text}`}>Box {bNum}</div>
                <div className="text-sm font-extrabold text-white mt-0.5">{count}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Floating XP / Feedback Toast */}
      {xpToast.show && (
        <div className="fixed bottom-8 right-8 z-50 animate-bounce bg-[#1a1d26] border border-[#58cc02]/40 text-white px-4 py-2.5 rounded-2xl shadow-xl shadow-[#58cc02]/10 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#58cc02]" />
          <span className="text-xs font-bold">{xpToast.text}</span>
        </div>
      )}

      {/* Main Flashcard Section */}
      {displayedCards.length > 0 && currentCard ? (
        <div className="space-y-4">
          {/* Card Meta Indicator */}
          <div className="flex items-center justify-between text-xs text-[#9a9aa8]">
            <span className="font-mono">
              Card {currentIndex + 1} of {displayedCards.length}
            </span>
            <div className="flex items-center gap-2">
              <span className="chip text-[#1cb0f6] border-[#1cb0f6]/30 bg-[#1cb0f6]/10 text-[11px] font-mono">
                Lesson {currentCard.lessonNumber}
              </span>
              <span className="chip text-white border-white/10 bg-white/5 text-[11px] uppercase font-mono">
                {currentCard.partOfSpeech}
              </span>
            </div>
          </div>

          {/* 3D Tactile Card Container */}
          <div
            onClick={handleFlip}
            className="cursor-pointer perspective-1000 select-none group min-h-[360px] sm:min-h-[400px] w-full"
            style={{ perspective: "1200px" }}
          >
            <div
              className={`relative w-full h-full min-h-[360px] sm:min-h-[400px] transition-transform duration-500 rounded-3xl border border-white/10 shadow-2xl p-8 flex flex-col justify-between ${
                isFlipped ? "bg-[#181a24] border-[#1cb0f6]/40" : "bg-[#14161f] border-white/10"
              }`}
              style={{
                transformStyle: "preserve-3d",
                transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
              }}
            >
              {/* FRONT FACE: Picture + Japanese Word */}
              <div
                className={`absolute inset-0 p-8 flex flex-col justify-between ${
                  isFlipped ? "opacity-0 pointer-events-none" : "opacity-100"
                } transition-opacity duration-300`}
                style={{ backfaceVisibility: "hidden" }}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`chip text-[11px] font-mono font-bold ${
                      boxColors[currentCard.box - 1].bg
                    } ${boxColors[currentCard.box - 1].border} ${
                      boxColors[currentCard.box - 1].text
                    }`}
                  >
                    {boxColors[currentCard.box - 1].label}
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      speakJapanese(currentCard.reading || currentCard.word);
                    }}
                    className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#1cb0f6] hover:bg-white/10 hover:scale-105 active:scale-95 transition-all"
                    title="Pronounce"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Big Visual Graphic + Japanese Word */}
                <div className="text-center py-4 space-y-3">
                  {currentCard.imageUrl && (
                    <div className="text-5xl sm:text-6xl filter drop-shadow-md select-none">
                      {currentCard.imageUrl}
                    </div>
                  )}
                  <div className="text-4xl sm:text-6xl font-display font-extrabold text-white tracking-wide">
                    {currentCard.word}
                  </div>
                  <div className="text-xs font-mono text-[#9a9aa8]">
                    Click card or press <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white">Space</kbd> to reveal meaning
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-[#9a9aa8] border-t border-white/5 pt-3">
                  <span>Reviewed {currentCard.timesReviewed} times</span>
                  <span>Accuracy: {currentCard.timesReviewed > 0 ? Math.round((currentCard.timesCorrect / currentCard.timesReviewed) * 100) : 0}%</span>
                </div>
              </div>

              {/* BACK FACE: Reading, Meaning, POS, Example Sentence */}
              <div
                className={`absolute inset-0 p-8 flex flex-col justify-between ${
                  !isFlipped ? "opacity-0 pointer-events-none" : "opacity-100"
                } transition-opacity duration-300`}
                style={{
                  backfaceVisibility: "hidden",
                  transform: "rotateY(180deg)",
                }}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-2xl sm:text-3xl font-display font-extrabold text-white">
                      {currentCard.word}
                    </div>
                    <div className="text-sm font-mono text-[#1cb0f6] font-bold mt-0.5">
                      {currentCard.reading} • /{currentCard.romaji}/
                    </div>
                  </div>

                  <span className="text-xl sm:text-2xl font-bold text-[#58cc02] bg-[#58cc02]/10 px-3 py-1 rounded-xl border border-[#58cc02]/30">
                    {currentCard.meaning}
                  </span>
                </div>

                {/* Example sentence */}
                <div className="bg-[#1e2029] p-4 rounded-2xl border border-white/5 space-y-1.5 my-2">
                  <div className="flex items-center gap-1.5 text-xs text-[#ff9600] font-bold">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Contextual Example Sentence</span>
                  </div>
                  <div className="text-sm text-white font-medium">
                    {currentCard.exampleSentence}
                  </div>
                  <div className="text-xs text-[#9a9aa8] font-mono">
                    {currentCard.exampleReading}
                  </div>
                  <div className="text-xs text-[#1cb0f6] italic">
                    {currentCard.exampleMeaning}
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-[#9a9aa8] border-t border-white/5 pt-3">
                  <span>Press <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white">1</kbd> Still Learning</span>
                  <span>Press <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white">2</kbd> Know It</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Decision Buttons (Know It / Still Learning) */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => submitProgress("still_learning")}
              className="py-4 px-6 rounded-2xl bg-[#ea2b2b]/15 hover:bg-[#ea2b2b]/25 border-2 border-[#ea2b2b]/40 text-white font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98] group"
            >
              <div className="w-6 h-6 rounded-lg bg-[#ea2b2b]/20 flex items-center justify-center text-rose-400 group-hover:scale-110 transition-transform">
                <X className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="text-sm">Still Learning</div>
                <div className="text-[10px] text-[#9a9aa8] font-mono">Reset to Box 1 • Key [1]</div>
              </div>
            </button>

            <button
              onClick={() => submitProgress("know_it")}
              className="py-4 px-6 rounded-2xl bg-[#58cc02]/15 hover:bg-[#58cc02]/25 border-2 border-[#58cc02]/40 text-white font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98] group"
            >
              <div className="w-6 h-6 rounded-lg bg-[#58cc02]/20 flex items-center justify-center text-[#58cc02] group-hover:scale-110 transition-transform">
                <Check className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="text-sm">Know It!</div>
                <div className="text-[10px] text-[#9a9aa8] font-mono">Next Box + 1 XP • Key [2]</div>
              </div>
            </button>
          </div>

          {/* Prev / Flip / Next Nav Controls */}
          <div className="flex items-center justify-between pt-2">
            <Button
              variant="chunkyOutline"
              size="sm"
              onClick={handlePrev}
              disabled={currentIndex === 0}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Prev [←]
            </Button>

            <Button
              variant="chunkyOutline"
              size="sm"
              onClick={handleFlip}
              className="border-white/20"
            >
              <RotateCcw className="w-4 h-4 mr-1" />
              Flip Card [Space]
            </Button>

            <Button
              variant="chunkyOutline"
              size="sm"
              onClick={handleNext}
              disabled={currentIndex === displayedCards.length - 1}
            >
              Next [→]
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      ) : (
        <div className="bento p-12 text-center space-y-4">
          <Trophy className="w-12 h-12 text-[#1cb0f6] mx-auto" />
          <h2 className="text-xl font-bold text-white">Deck Complete!</h2>
          <p className="text-sm text-[#9a9aa8] max-w-md mx-auto">
            You reviewed all vocabulary in this filter. Continue with other lessons or practice cumulative sentence drills.
          </p>
          <Button variant="chunky" onClick={() => setCurrentIndex(0)}>
            Review Again
          </Button>
        </div>
      )}
    </div>
  );
}
