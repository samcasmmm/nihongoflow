"use client";

import React, { useState, useEffect, useTransition, useCallback, useMemo } from "react";
import { KanaCardWithProgress, DeckStats } from "@/modules/decks/repositories/deck-repository";
import { Button } from "@/components/ui/button";
import {
  Shuffle,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Volume2,
  HelpCircle,
  Grid,
  CreditCard,
  Target,
} from "lucide-react";
import Link from "next/link";

interface Props {
  initialCards: KanaCardWithProgress[];
  initialStats: DeckStats;
}

type ViewMode = "chart" | "drill" | "flashcard";
type CategoryTab = "base" | "dakuten" | "yoon";

// 11 Rows x 5 Cols Gojūon Matrix for Hiragana Base
const GOJUON_MATRIX: Array<Array<{ char: string; romaji: string } | null>> = [
  // 1. Vowels (A-row)
  [
    { char: "あ", romaji: "a" },
    { char: "い", romaji: "i" },
    { char: "う", romaji: "u" },
    { char: "え", romaji: "e" },
    { char: "お", romaji: "o" },
  ],
  // 2. Ka-row
  [
    { char: "か", romaji: "ka" },
    { char: "き", romaji: "ki" },
    { char: "く", romaji: "ku" },
    { char: "け", romaji: "ke" },
    { char: "こ", romaji: "ko" },
  ],
  // 3. Sa-row
  [
    { char: "さ", romaji: "sa" },
    { char: "し", romaji: "shi" },
    { char: "す", romaji: "su" },
    { char: "せ", romaji: "se" },
    { char: "そ", romaji: "so" },
  ],
  // 4. Ta-row
  [
    { char: "た", romaji: "ta" },
    { char: "ち", romaji: "chi" },
    { char: "つ", romaji: "tsu" },
    { char: "て", romaji: "te" },
    { char: "と", romaji: "to" },
  ],
  // 5. Na-row
  [
    { char: "な", romaji: "na" },
    { char: "に", romaji: "ni" },
    { char: "ぬ", romaji: "nu" },
    { char: "ね", romaji: "ne" },
    { char: "の", romaji: "no" },
  ],
  // 6. Ha-row
  [
    { char: "は", romaji: "ha" },
    { char: "ひ", romaji: "hi" },
    { char: "ふ", romaji: "fu" },
    { char: "へ", romaji: "he" },
    { char: "ほ", romaji: "ho" },
  ],
  // 7. Ma-row
  [
    { char: "ま", romaji: "ma" },
    { char: "み", romaji: "mi" },
    { char: "む", romaji: "mu" },
    { char: "め", romaji: "me" },
    { char: "も", romaji: "mo" },
  ],
  // 8. Ya-row (Gaps at index 1 and 3)
  [
    { char: "や", romaji: "ya" },
    null,
    { char: "ゆ", romaji: "yu" },
    null,
    { char: "よ", romaji: "yo" },
  ],
  // 9. Ra-row
  [
    { char: "ら", romaji: "ra" },
    { char: "り", romaji: "ri" },
    { char: "る", romaji: "ru" },
    { char: "れ", romaji: "re" },
    { char: "ろ", romaji: "ro" },
  ],
  // 10. Wa-row (Gaps at index 1, 2, 3)
  [
    { char: "わ", romaji: "wa" },
    null,
    null,
    null,
    { char: "を", romaji: "o" },
  ],
  // 11. N-row (Gaps at index 1, 2, 3, 4)
  [
    { char: "ん", romaji: "n" },
    null,
    null,
    null,
    null,
  ],
];

// Dakuten & Handakuten 5 rows x 5 cols
const DAKUTEN_MATRIX: Array<Array<{ char: string; romaji: string } | null>> = [
  // Ga-row
  [
    { char: "が", romaji: "ga" },
    { char: "ぎ", romaji: "gi" },
    { char: "ぐ", romaji: "gu" },
    { char: "げ", romaji: "ge" },
    { char: "ご", romaji: "go" },
  ],
  // Za-row
  [
    { char: "ざ", romaji: "za" },
    { char: "じ", romaji: "ji" },
    { char: "ず", romaji: "zu" },
    { char: "ぜ", romaji: "ze" },
    { char: "ぞ", romaji: "zo" },
  ],
  // Da-row
  [
    { char: "だ", romaji: "da" },
    { char: "ぢ", romaji: "ji" },
    { char: "づ", romaji: "zu" },
    { char: "で", romaji: "de" },
    { char: "ど", romaji: "do" },
  ],
  // Ba-row
  [
    { char: "ば", romaji: "ba" },
    { char: "び", romaji: "bi" },
    { char: "ぶ", romaji: "bu" },
    { char: "べ", romaji: "be" },
    { char: "ぼ", romaji: "bo" },
  ],
  // Pa-row
  [
    { char: "ぱ", romaji: "pa" },
    { char: "ぴ", romaji: "pi" },
    { char: "ぷ", romaji: "pu" },
    { char: "ぺ", romaji: "pe" },
    { char: "ぽ", romaji: "po" },
  ],
];

export function HiraganaDeck({ initialCards, initialStats }: Props) {
  const [viewMode, setViewMode] = useState<ViewMode>("chart");
  const [categoryTab, setCategoryTab] = useState<CategoryTab>("base");
  const [cards, setCards] = useState<KanaCardWithProgress[]>(initialCards);
  const [stats, setStats] = useState<DeckStats>(initialStats);
  const [selectedCardForModal, setSelectedCardForModal] = useState<KanaCardWithProgress | null>(null);

  // Drill Mode State (matching Image 2)
  const [drillIndex, setDrillIndex] = useState(0);
  const [drillScore, setDrillScore] = useState(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);

  // Flashcard Mode State
  const [cardIndex, setCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Gamification Session state
  const [sessionXp, setSessionXp] = useState(0);
  const [toast, setToast] = useState<{ show: boolean; text: string }>({ show: false, text: "" });
  const [, startTransition] = useTransition();

  // Map quick lookup by character
  const cardByCharMap = useMemo(() => {
    const map = new Map<string, KanaCardWithProgress>();
    for (const c of cards) {
      map.set(c.character, c);
    }
    return map;
  }, [cards]);

  const showToast = useCallback((text: string) => {
    setToast({ show: true, text });
    setTimeout(() => {
      setToast({ show: false, text: "" });
    }, 2200);
  }, []);

  // Sync Leitner progress with server
  const syncProgress = useCallback(
    (cardId: string, action: "know_it" | "still_learning") => {
      const target = cards.find((c) => c.id === cardId);
      if (!target) return;

      const oldBox = target.box;
      const newBox = action === "know_it" ? Math.min(5, oldBox + 1) : 1;

      // Optimistic update
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

      setSessionXp((prev) => prev + 1);
      showToast(action === "know_it" ? `+1 XP • Box ${newBox} 🎯` : "+1 XP • Box 1 Reset 🔁");

      startTransition(async () => {
        try {
          await fetch(`/api/cards/${cardId}/progress`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ cardType: "kana", action }),
          });
        } catch (e) {
          console.error("Progress sync error:", e);
        }
      });
    },
    [cards, showToast]
  );

  // Generate 4-option Drill Questions (Image 2 style)
  const drillQuestions = useMemo(() => {
    // Curated questions matching Image 2 prompt style
    const sampleWords = [
      {
        promptRomaji: "atta",
        correctChar: "あった",
        options: ["あっち", "あた", "あたし", "あった"],
        correctIndex: 3,
        cardChar: "あ",
      },
      {
        promptRomaji: "neko",
        correctChar: "ねこ",
        options: ["ねこ", "いぬ", "とり", "さる"],
        correctIndex: 0,
        cardChar: "ね",
      },
      {
        promptRomaji: "sakura",
        correctChar: "さくら",
        options: ["すずき", "さくら", "さかな", "やま"],
        correctIndex: 1,
        cardChar: "さ",
      },
      {
        promptRomaji: "arigatou",
        correctChar: "ありがとう",
        options: ["おはよう", "すみません", "ありがとう", "さようなら"],
        correctIndex: 2,
        cardChar: "あ",
      },
      {
        promptRomaji: "sensei",
        correctChar: "せんせい",
        options: ["がくせい", "せんせい", "かいしゃいん", "いしゃ"],
        correctIndex: 1,
        cardChar: "せ",
      },
      {
        promptRomaji: "nihon",
        correctChar: "にほん",
        options: ["にほん", "ちゅうごく", "かんこく", "あめりか"],
        correctIndex: 0,
        cardChar: "に",
      },
    ];
    return sampleWords;
  }, []);

  const currentDrill = drillQuestions[drillIndex] || drillQuestions[0];

  const handleDrillSelect = useCallback(
    (index: number) => {
      if (isAnswerRevealed) return;
      setSelectedOptionIndex(index);
      setIsAnswerRevealed(true);

      const isCorrect = index === currentDrill.correctIndex;
      if (isCorrect) {
        setDrillScore((prev) => prev + 1);
        const card = cardByCharMap.get(currentDrill.cardChar);
        if (card) {
          syncProgress(card.id, "know_it");
        }
      } else {
        const card = cardByCharMap.get(currentDrill.cardChar);
        if (card) {
          syncProgress(card.id, "still_learning");
        }
      }

      // Auto advance after 1.5s
      setTimeout(() => {
        setIsAnswerRevealed(false);
        setSelectedOptionIndex(null);
        setDrillIndex((prev) => (prev + 1) % drillQuestions.length);
      }, 1500);
    },
    [isAnswerRevealed, currentDrill, cardByCharMap, syncProgress, drillQuestions.length]
  );

  // Keyboard navigation for Drill (1, 2, 3, 4) and Flashcards
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (["INPUT", "TEXTAREA"].includes((e.target as HTMLElement)?.tagName)) return;

      if (viewMode === "drill") {
        if (e.key === "1") handleDrillSelect(0);
        else if (e.key === "2") handleDrillSelect(1);
        else if (e.key === "3") handleDrillSelect(2);
        else if (e.key === "4") handleDrillSelect(3);
      } else if (viewMode === "flashcard") {
        if (e.code === "Space") {
          e.preventDefault();
          setIsFlipped((prev) => !prev);
        } else if (e.key === "1") {
          const c = cards[cardIndex];
          if (c) syncProgress(c.id, "still_learning");
          if (cardIndex < cards.length - 1) setCardIndex((prev) => prev + 1);
          setIsFlipped(false);
        } else if (e.key === "2") {
          const c = cards[cardIndex];
          if (c) syncProgress(c.id, "know_it");
          if (cardIndex < cards.length - 1) setCardIndex((prev) => prev + 1);
          setIsFlipped(false);
        } else if (e.code === "ArrowRight") {
          if (cardIndex < cards.length - 1) setCardIndex((prev) => prev + 1);
          setIsFlipped(false);
        } else if (e.code === "ArrowLeft") {
          if (cardIndex > 0) setCardIndex((prev) => prev - 1);
          setIsFlipped(false);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [viewMode, handleDrillSelect, cards, cardIndex, syncProgress]);

  // Audio pronunciation simulation (Web Speech API)
  const speakKana = (text: string) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "ja-JP";
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto text-[#f1f5f9]">
      {/* Top Header & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs text-[#8297ad] hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Dashboard
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-tight">
              Hiragana Syllabary
            </h1>
            <span className="chip text-[#f5c518] border-[#f5c518]/30 bg-[#f5c518]/10 text-xs font-mono font-bold">
              {stats.masteredCount} / 104 Mastered
            </span>
          </div>
        </div>

        {/* View Switcher: Chart (Image 1), Drill (Image 2), Flashcard */}
        <div className="inline-flex items-center bg-[#131d27] p-1 rounded-2xl border border-white/10 shadow-lg">
          <button
            onClick={() => setViewMode("chart")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              viewMode === "chart"
                ? "bg-[#f5c518] text-[#0f1722] shadow-md shadow-[#f5c518]/20"
                : "text-[#8297ad] hover:text-white"
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            <span>Chart View</span>
          </button>
          <button
            onClick={() => setViewMode("drill")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              viewMode === "drill"
                ? "bg-[#f5c518] text-[#0f1722] shadow-md shadow-[#f5c518]/20"
                : "text-[#8297ad] hover:text-white"
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            <span>Drill Mode</span>
          </button>
          <button
            onClick={() => setViewMode("flashcard")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              viewMode === "flashcard"
                ? "bg-[#f5c518] text-[#0f1722] shadow-md shadow-[#f5c518]/20"
                : "text-[#8297ad] hover:text-white"
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Flashcard</span>
          </button>
        </div>
      </div>

      {/* Floating XP / Feedback Toast */}
      {toast.show && (
        <div className="fixed bottom-8 right-8 z-50 animate-bounce bg-[#131d27] border-2 border-[#f5c518] text-white px-4 py-2.5 rounded-2xl shadow-2xl shadow-[#f5c518]/20 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#f5c518]" />
          <span className="text-xs font-bold font-mono">{toast.text}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. CHART VIEW (EXACTLY MATCHING IMAGE 1: 5-COLUMNS TRADITIONAL GOJUON)   */}
      {/* ========================================================================= */}
      {viewMode === "chart" && (
        <div className="space-y-6">
          {/* Sub-tabs: Base 46, Dakuten 25, Yōon 33 */}
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCategoryTab("base")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  categoryTab === "base"
                    ? "bg-[#1b2735] text-[#f5c518] border border-[#f5c518]/50"
                    : "text-[#8297ad] hover:text-white bg-white/5"
                }`}
              >
                Base 46 (あ-ん)
              </button>
              <button
                onClick={() => setCategoryTab("dakuten")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  categoryTab === "dakuten"
                    ? "bg-[#1b2735] text-[#f5c518] border border-[#f5c518]/50"
                    : "text-[#8297ad] hover:text-white bg-white/5"
                }`}
              >
                Dakuten & Handakuten (25)
              </button>
              <button
                onClick={() => setCategoryTab("yoon")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  categoryTab === "yoon"
                    ? "bg-[#1b2735] text-[#f5c518] border border-[#f5c518]/50"
                    : "text-[#8297ad] hover:text-white bg-white/5"
                }`}
              >
                Yōon Blends (33)
              </button>
            </div>

            <div className="text-xs text-[#8297ad] font-mono hidden sm:flex items-center gap-1.5">
              <span>Click tile for audio & mnemonic</span>
            </div>
          </div>

          {/* Golden Highlighted Grid Matrix (Matching Image 1) */}
          <div className="bg-[#0f1722] p-4 sm:p-8 rounded-3xl border border-white/5 shadow-2xl flex justify-center">
            {categoryTab === "base" && (
              <div className="grid grid-cols-5 gap-2.5 sm:gap-3.5 w-full max-w-md mx-auto">
                {GOJUON_MATRIX.flatMap((row, rIdx) =>
                  row.map((cell, cIdx) => {
                    if (!cell) {
                      // Empty placeholder tile (Matching Image 1)
                      return (
                        <div
                          key={`empty-${rIdx}-${cIdx}`}
                          className="w-full aspect-[4/5] rounded-2xl bg-[#141d27]/70 border border-white/[0.04]"
                        />
                      );
                    }

                    const cardData = cardByCharMap.get(cell.char);
                    const box = cardData?.box || 1;
                    // Pill bar fill width based on Leitner Box
                    const fillPercent = Math.min(100, box * 20);

                    return (
                      <button
                        key={cell.char}
                        onClick={() => {
                          speakKana(cell.char);
                          if (cardData) setSelectedCardForModal(cardData);
                        }}
                        className="group relative w-full aspect-[4/5] rounded-2xl bg-[#131d27] border-2 border-[#f5c518] hover:bg-[#1a2735] hover:scale-105 active:scale-95 transition-all duration-200 flex flex-col items-center justify-between py-2 sm:py-3 px-1 shadow-md shadow-black/40 cursor-pointer"
                        title={`${cell.char} (${cell.romaji}) - Click to preview`}
                      >
                        {/* Japanese Glyph */}
                        <span className="text-xl sm:text-2xl font-bold text-white group-hover:scale-110 transition-transform">
                          {cell.char}
                        </span>

                        {/* Romaji */}
                        <span className="text-xs sm:text-sm font-medium text-[#f5c518] font-mono">
                          {cell.romaji}
                        </span>

                        {/* Yellow Pill Underline Progress (Matching Image 1) */}
                        <div className="w-7 sm:w-8 h-1.5 rounded-full bg-[#202c3a] overflow-hidden">
                          <div
                            className="h-full bg-[#f5c518] rounded-full transition-all"
                            style={{ width: `${fillPercent}%` }}
                          />
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            )}

            {categoryTab === "dakuten" && (
              <div className="grid grid-cols-5 gap-2.5 sm:gap-3.5 w-full max-w-md mx-auto">
                {DAKUTEN_MATRIX.flatMap((row, rIdx) =>
                  row.map((cell, cIdx) => {
                    if (!cell) {
                      return (
                        <div
                          key={`dakuten-empty-${rIdx}-${cIdx}`}
                          className="w-full aspect-[4/5] rounded-2xl bg-[#141d27]/70 border border-white/[0.04]"
                        />
                      );
                    }

                    const cardData = cardByCharMap.get(cell.char);
                    const box = cardData?.box || 1;
                    const fillPercent = Math.min(100, box * 20);

                    return (
                      <button
                        key={cell.char}
                        onClick={() => {
                          speakKana(cell.char);
                          if (cardData) setSelectedCardForModal(cardData);
                        }}
                        className="group relative w-full aspect-[4/5] rounded-2xl bg-[#131d27] border-2 border-[#f5c518] hover:bg-[#1a2735] hover:scale-105 active:scale-95 transition-all duration-200 flex flex-col items-center justify-between py-2 sm:py-3 px-1 shadow-md shadow-black/40 cursor-pointer"
                      >
                        <span className="text-xl sm:text-2xl font-bold text-white group-hover:scale-110 transition-transform">
                          {cell.char}
                        </span>
                        <span className="text-xs sm:text-sm font-medium text-[#f5c518] font-mono">
                          {cell.romaji}
                        </span>
                        <div className="w-7 sm:w-8 h-1.5 rounded-full bg-[#202c3a] overflow-hidden">
                          <div
                            className="h-full bg-[#f5c518] rounded-full transition-all"
                            style={{ width: `${fillPercent}%` }}
                          />
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            )}

            {categoryTab === "yoon" && (
              <div className="grid grid-cols-3 sm:grid-cols-3 gap-3 w-full max-w-md mx-auto">
                {cards
                  .filter((c) => c.category === "yoon")
                  .map((card) => {
                    const fillPercent = Math.min(100, card.box * 20);
                    return (
                      <button
                        key={card.id}
                        onClick={() => {
                          speakKana(card.character);
                          setSelectedCardForModal(card);
                        }}
                        className="group relative w-full aspect-[4/5] rounded-2xl bg-[#131d27] border-2 border-[#f5c518] hover:bg-[#1a2735] hover:scale-105 active:scale-95 transition-all duration-200 flex flex-col items-center justify-between py-3 px-1 shadow-md shadow-black/40 cursor-pointer"
                      >
                        <span className="text-xl sm:text-2xl font-bold text-white group-hover:scale-110 transition-transform">
                          {card.character}
                        </span>
                        <span className="text-xs sm:text-sm font-medium text-[#f5c518] font-mono">
                          {card.romaji}
                        </span>
                        <div className="w-8 h-1.5 rounded-full bg-[#202c3a] overflow-hidden">
                          <div
                            className="h-full bg-[#f5c518] rounded-full transition-all"
                            style={{ width: `${fillPercent}%` }}
                          />
                        </div>
                      </button>
                    );
                  })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. DRILL MODE (EXACTLY MATCHING IMAGE 2: 4 TALL CARDS WITH [1] [2] [3] [4])*/}
      {/* ========================================================================= */}
      {viewMode === "drill" && (
        <div className="space-y-8 bg-[#0f1722] p-6 sm:p-12 rounded-3xl border border-white/5 shadow-2xl min-h-[460px] flex flex-col justify-between">
          <div className="space-y-3 text-center sm:text-left">
            <div className="flex items-center justify-between text-xs text-[#8297ad]">
              <span className="chip border-white/10 bg-white/5 font-mono text-[11px]">
                Question {drillIndex + 1} of {drillQuestions.length}
              </span>
              <span className="chip text-[#f5c518] border-[#f5c518]/30 bg-[#f5c518]/10 font-bold font-mono">
                Score: {drillScore} Correct
              </span>
            </div>

            {/* Prompt matching Image 2 typography */}
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight text-center pt-4">
              Select the correct character(s) for &ldquo;{currentDrill.promptRomaji}&rdquo;
            </h2>
          </div>

          {/* 4 Tall Cards in a Row (Matching Image 2) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 my-6">
            {currentDrill.options.map((optionText, idx) => {
              const isSelected = selectedOptionIndex === idx;
              const isCorrectAnswer = idx === currentDrill.correctIndex;

              let cardStyle =
                "bg-[#131d27] border-2 border-[#223142] hover:border-[#f5c518] hover:bg-[#182330]";

              if (isAnswerRevealed) {
                if (isCorrectAnswer) {
                  cardStyle = "bg-[#58cc02]/20 border-2 border-[#58cc02] text-white";
                } else if (isSelected && !isCorrectAnswer) {
                  cardStyle = "bg-[#ff4b4b]/20 border-2 border-[#ff4b4b] text-white";
                } else {
                  cardStyle = "bg-[#131d27]/60 border-2 border-transparent opacity-40";
                }
              }

              return (
                <button
                  key={`${optionText}-${idx}`}
                  disabled={isAnswerRevealed}
                  onClick={() => handleDrillSelect(idx)}
                  className={`w-full aspect-[3/4] sm:min-h-[220px] rounded-2xl p-5 flex flex-col items-center justify-between transition-all duration-200 active:scale-95 cursor-pointer shadow-lg ${cardStyle}`}
                >
                  <div className="w-full" />

                  {/* Japanese Word / Characters Centered */}
                  <div className="text-2xl sm:text-3xl font-bold text-white tracking-wide">
                    {optionText}
                  </div>

                  {/* Bottom Number Badge [1], [2], [3], [4] (Matching Image 2) */}
                  <div className="w-7 h-7 rounded-lg bg-[#1a2634] border border-white/5 flex items-center justify-center text-xs font-mono text-[#8297ad]">
                    {idx + 1}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Bottom Keyboard Hint */}
          <div className="flex items-center justify-center gap-2 text-xs text-[#8297ad] pt-2">
            <span>Press keys</span>
            <kbd className="px-2 py-0.5 rounded bg-white/10 text-white font-mono">1</kbd>
            <kbd className="px-2 py-0.5 rounded bg-white/10 text-white font-mono">2</kbd>
            <kbd className="px-2 py-0.5 rounded bg-white/10 text-white font-mono">3</kbd>
            <kbd className="px-2 py-0.5 rounded bg-white/10 text-white font-mono">4</kbd>
            <span>on your keyboard</span>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. TACTILE 3D CARD MODE (MATCHING THE SAME SLEEK DARK AESTHETIC)          */}
      {/* ========================================================================= */}
      {viewMode === "flashcard" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between text-xs text-[#8297ad]">
            <span className="font-mono">
              Card {cardIndex + 1} of {cards.length}
            </span>
            <span className="chip text-[#f5c518] border-[#f5c518]/30 bg-[#f5c518]/10 font-mono">
              Box {cards[cardIndex]?.box || 1} • {cards[cardIndex]?.category}
            </span>
          </div>

          {/* 3D Card */}
          <div
            onClick={() => setIsFlipped((prev) => !prev)}
            className="cursor-pointer select-none min-h-[340px] w-full"
            style={{ perspective: "1200px" }}
          >
            <div
              className={`relative w-full h-full min-h-[340px] transition-transform duration-500 rounded-3xl border-2 shadow-2xl p-8 flex flex-col justify-between ${
                isFlipped
                  ? "bg-[#16212e] border-[#f5c518]"
                  : "bg-[#131d27] border-[#223142] hover:border-[#f5c518]"
              }`}
              style={{
                transformStyle: "preserve-3d",
                transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
              }}
            >
              {/* Front Face */}
              <div
                className={`absolute inset-0 p-8 flex flex-col justify-between ${
                  isFlipped ? "opacity-0 pointer-events-none" : "opacity-100"
                } transition-opacity duration-300`}
                style={{ backfaceVisibility: "hidden" }}
              >
                <div className="flex items-center justify-between">
                  <span className="chip text-[#f5c518] border-[#f5c518]/30 bg-[#f5c518]/10 font-mono text-xs">
                    Row: {cards[cardIndex]?.rowGroup}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (cards[cardIndex]) speakKana(cards[cardIndex].character);
                    }}
                    className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-[#f5c518] hover:bg-white/10"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="text-center py-6">
                  <div className="text-8xl sm:text-9xl font-display font-extrabold text-white tracking-wider filter drop-shadow-[0_10px_20px_rgba(245,197,24,0.15)]">
                    {cards[cardIndex]?.character}
                  </div>
                  <div className="mt-4 text-xs font-mono text-[#8297ad]">
                    Press <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white">Space</kbd> or click to flip
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-[#8297ad] border-t border-white/5 pt-3">
                  <span>Reviewed {cards[cardIndex]?.timesReviewed} times</span>
                  <span>Accuracy: {cards[cardIndex]?.timesReviewed ? Math.round(((cards[cardIndex]?.timesCorrect || 0) / cards[cardIndex]!.timesReviewed) * 100) : 0}%</span>
                </div>
              </div>

              {/* Back Face */}
              <div
                className={`absolute inset-0 p-8 flex flex-col justify-between ${
                  !isFlipped ? "opacity-0 pointer-events-none" : "opacity-100"
                } transition-opacity duration-300`}
                style={{
                  backfaceVisibility: "hidden",
                  transform: "rotateY(180deg)",
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-display font-extrabold text-white">
                    {cards[cardIndex]?.character}
                  </span>
                  <span className="text-2xl font-mono font-black text-[#f5c518] bg-[#f5c518]/10 px-4 py-1 rounded-xl border border-[#f5c518]/30">
                    /{cards[cardIndex]?.romaji}/
                  </span>
                </div>

                <div className="space-y-4 py-4">
                  {cards[cardIndex]?.mnemonic && (
                    <div className="bg-[#1b2635] p-4 rounded-2xl border border-white/5 space-y-1">
                      <div className="flex items-center gap-1.5 text-xs text-[#f5c518] font-bold">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Mnemonic</span>
                      </div>
                      <p className="text-sm text-white">{cards[cardIndex]?.mnemonic}</p>
                    </div>
                  )}

                  {cards[cardIndex]?.exampleWord && (
                    <div className="bg-[#1b2635] p-4 rounded-2xl border border-white/5 space-y-1">
                      <div className="flex items-center gap-1.5 text-xs text-[#58cc02] font-bold">
                        <HelpCircle className="w-3.5 h-3.5" />
                        <span>Example Vocabulary</span>
                      </div>
                      <div className="flex items-baseline justify-between">
                        <span className="text-base font-bold text-white">
                          {cards[cardIndex]?.exampleWord}{" "}
                          <span className="text-xs text-[#8297ad] font-mono">
                            ({cards[cardIndex]?.exampleReading})
                          </span>
                        </span>
                        <span className="text-xs text-[#1cb0f6] font-medium">
                          {cards[cardIndex]?.exampleMeaning}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs text-[#8297ad] border-t border-white/5 pt-3">
                  <span>Press <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white">1</kbd> Still Learning</span>
                  <span>Press <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white">2</kbd> Know It</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Decision Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => {
                if (cards[cardIndex]) syncProgress(cards[cardIndex].id, "still_learning");
                if (cardIndex < cards.length - 1) setCardIndex((prev) => prev + 1);
                setIsFlipped(false);
              }}
              className="py-4 px-6 rounded-2xl bg-[#ff4b4b]/15 hover:bg-[#ff4b4b]/25 border-2 border-[#ff4b4b]/40 text-white font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            >
              <XCircle className="w-5 h-5 text-rose-400" />
              <span>Still Learning [1]</span>
            </button>

            <button
              onClick={() => {
                if (cards[cardIndex]) syncProgress(cards[cardIndex].id, "know_it");
                if (cardIndex < cards.length - 1) setCardIndex((prev) => prev + 1);
                setIsFlipped(false);
              }}
              className="py-4 px-6 rounded-2xl bg-[#58cc02]/15 hover:bg-[#58cc02]/25 border-2 border-[#58cc02]/40 text-white font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            >
              <CheckCircle2 className="w-5 h-5 text-[#58cc02]" />
              <span>Know It! [2]</span>
            </button>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between">
            <Button
              variant="chunkyOutline"
              size="sm"
              disabled={cardIndex === 0}
              onClick={() => {
                setCardIndex((prev) => Math.max(0, prev - 1));
                setIsFlipped(false);
              }}
            >
              <ChevronLeft className="w-4 h-4 mr-1" /> Prev
            </Button>

            <Button
              variant="chunkyOutline"
              size="sm"
              onClick={() => {
                const shuffled = [...cards].sort(() => Math.random() - 0.5);
                setCards(shuffled);
                setCardIndex(0);
                setIsFlipped(false);
                showToast("Deck shuffled 🔀");
              }}
            >
              <Shuffle className="w-4 h-4 mr-1 text-[#f5c518]" /> Shuffle
            </Button>

            <Button
              variant="chunkyOutline"
              size="sm"
              disabled={cardIndex === cards.length - 1}
              onClick={() => {
                setCardIndex((prev) => Math.min(cards.length - 1, prev + 1));
                setIsFlipped(false);
              }}
            >
              Next <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      )}

      {/* Interactive Detail Modal for clicked kana character in Chart View */}
      {selectedCardForModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#131d27] border-2 border-[#f5c518] rounded-3xl max-w-sm w-full p-6 space-y-5 shadow-2xl relative animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between">
              <div>
                <span className="chip text-[#f5c518] border-[#f5c518]/30 bg-[#f5c518]/10 font-mono text-xs">
                  Box {selectedCardForModal.box} • {selectedCardForModal.category}
                </span>
                <div className="text-5xl font-extrabold text-white mt-2 font-display">
                  {selectedCardForModal.character}
                </div>
                <div className="text-xl font-mono text-[#f5c518] font-bold mt-1">
                  /{selectedCardForModal.romaji}/
                </div>
              </div>

              <button
                onClick={() => speakKana(selectedCardForModal.character)}
                className="w-10 h-10 rounded-2xl bg-[#1b2635] border border-white/10 flex items-center justify-center text-[#f5c518] hover:scale-105 active:scale-95 transition-transform"
                title="Pronounce"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>

            {selectedCardForModal.mnemonic && (
              <div className="bg-[#1b2635] p-3.5 rounded-2xl border border-white/5 space-y-1">
                <div className="text-xs text-[#f5c518] font-bold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Mnemonic Tip</span>
                </div>
                <p className="text-xs text-white leading-relaxed">
                  {selectedCardForModal.mnemonic}
                </p>
              </div>
            )}

            {selectedCardForModal.exampleWord && (
              <div className="bg-[#1b2635] p-3.5 rounded-2xl border border-white/5 space-y-1">
                <div className="text-xs text-[#58cc02] font-bold">Example Word</div>
                <div className="flex items-baseline justify-between text-xs">
                  <span className="font-bold text-white">
                    {selectedCardForModal.exampleWord} ({selectedCardForModal.exampleReading})
                  </span>
                  <span className="text-[#1cb0f6]">{selectedCardForModal.exampleMeaning}</span>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2.5 pt-2">
              <Button
                variant="chunkyOutline"
                size="sm"
                onClick={() => {
                  syncProgress(selectedCardForModal.id, "still_learning");
                  setSelectedCardForModal(null);
                }}
              >
                Reset Box 1
              </Button>
              <Button
                variant="chunky"
                size="sm"
                className="bg-[#f5c518] hover:bg-[#e0b210] text-[#0f1722] border-[#cca20e]"
                onClick={() => {
                  syncProgress(selectedCardForModal.id, "know_it");
                  setSelectedCardForModal(null);
                }}
              >
                Know It (+1 XP)
              </Button>
            </div>

            <button
              onClick={() => setSelectedCardForModal(null)}
              className="w-full text-center text-xs text-[#8297ad] hover:text-white pt-1"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
