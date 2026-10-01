"use client";

import React, { useState } from "react";
import {
  Check,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Activity,
  Layers,
} from "lucide-react";
import { ScrollReveal } from "./scroll-reveal";

interface Challenge {
  id: string;
  title: string;
  level: string;
  english: string;
  beforeHole: string;
  afterHole: string;
  correctOption: string;
  options: string[];
  explanation: string;
  errorExplanations: Record<string, string>;
  swotTag: string;
  vocabTags: string[];
}

const challenges: Challenge[] = [
  {
    id: "q1",
    title: "Particle Distinction: Topic Marker",
    level: "Lesson 01",
    english: "I am an office worker.",
    beforeHole: "わたし",
    afterHole: "会社員 です。",
    correctOption: "は",
    options: ["は", "が", "を", "に"],
    explanation: "「は」 (pronounced 'wa') marks 「わたし」 as the primary topic of the sentence.",
    errorExplanations: {
      が: "「が」 marks exhaustive focus or spontaneous events. For standard topic declaration, 「は」 is required.",
      を: "「を」 marks direct objects of transitive actions. It cannot attach to the topic.",
      に: "「に」 marks specific points in time or destinations, not sentence topics.",
    },
    swotTag: "particle.topic_marker",
    vocabTags: ["わたし (L1)", "会社員 (L1)", "です (L1)"],
  },
  {
    id: "q2",
    title: "Particle Distinction: Movement Destination",
    level: "Lesson 05",
    english: "Tomorrow, I will go to Kyoto.",
    beforeHole: "明日、京都",
    afterHole: "行きます。",
    correctOption: "へ",
    options: ["へ", "で", "を", "から"],
    explanation: "「へ」 (pronounced 'e') designates the directional target of movement verbs like 行きます.",
    errorExplanations: {
      で: "「で」 indicates where an action takes place (or the means/transport), not the destination itself.",
      を: "「を」 indicates the path traversed (e.g. 公園を歩く), not the goal destination.",
      から: "「から」 indicates the starting point ('from Kyoto'), which changes the sentence meaning.",
    },
    swotTag: "particle.direction_he",
    vocabTags: ["明日 (L1)", "京都 (L3)", "行きます (L5)"],
  },
];

export function InteractiveSandbox() {
  const [selectedChallengeIdx, setSelectedChallengeIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  const activeChallenge = challenges[selectedChallengeIdx];
  const isCorrect = selectedAnswer === activeChallenge.correctOption;
  const isSubmitted = selectedAnswer !== null;

  const handleSelect = (option: string) => {
    setSelectedAnswer(option);
  };

  const handleSwitchChallenge = (idx: number) => {
    setSelectedChallengeIdx(idx);
    setSelectedAnswer(null);
  };

  return (
    <section className="relative py-20 sm:py-28 overflow-hidden z-10">
      {/* Background glow orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#58cc02]/[0.04] blur-[120px] pointer-events-none rounded-full" />

      <div className="w-full max-w-4xl mx-auto px-5 sm:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <ScrollReveal delay={0} duration={600}>
            <div className="eyebrow-badge text-[#1cb0f6] border-[#1cb0f6]/20 bg-[#1cb0f6]/5 mb-4">
              <span>02 / Live Telemetry Demo</span>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={100} duration={800}>
            <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight">
              Test-Drive the Engine
            </h2>
          </ScrollReveal>

          <ScrollReveal delay={200} duration={800}>
            <p className="mt-3 text-sm sm:text-base text-[#9a9aa8]">
              Try a real practice question right now. Notice how every selection generates immediate diagnostic telemetry, not just a score.
            </p>
          </ScrollReveal>
        </div>

        {/* Sandbox Window */}
        <ScrollReveal delay={300} duration={800}>
          <div className="double-bezel-shell">
            <div className="double-bezel-core p-5 sm:p-8 space-y-6">
              {/* Question Switcher Tabs */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-white/[0.06]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#58cc02] animate-pulse" />
                  <span className="text-xs font-mono text-white font-semibold">
                    ACTIVE SANDBOX
                  </span>
                  <span className="text-xs font-mono text-[#9a9aa8]">
                    ({activeChallenge.level})
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {challenges.map((c, i) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => handleSwitchChallenge(i)}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 ${
                        selectedChallengeIdx === i
                          ? "bg-white/15 text-white border border-white/20 shadow-sm"
                          : "text-[#9a9aa8] hover:text-white hover:bg-white/5"
                      }`}
                    >
                      Sample {i + 1}: {c.correctOption}
                    </button>
                  ))}
                </div>
              </div>

              {/* Challenge Content */}
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#9a9aa8]">
                    English Translation Target:
                  </span>
                  <span className="text-xs font-mono text-[#58cc02] flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" strokeWidth={1.5} />
                    Cumulative Vocabulary Verified
                  </span>
                </div>

                <div className="text-base sm:text-lg font-semibold text-white">
                  &quot;{activeChallenge.english}&quot;
                </div>

                {/* Sentence with Slot */}
                <div className="p-5 sm:p-6 rounded-2xl bg-[#08080f] border border-white/[0.08] flex items-center gap-2 sm:gap-3 text-lg sm:text-2xl font-bold text-white flex-wrap">
                  <span>{activeChallenge.beforeHole}</span>
                  <span
                    className={`min-w-10 px-3 py-1 rounded-xl text-center border font-mono transition-all duration-300 ${
                      !isSubmitted
                        ? "border-dashed border-white/30 text-[#9a9aa8] bg-white/[0.02]"
                        : isCorrect
                        ? "border-[#58cc02] text-[#58cc02] bg-[#58cc02]/20 shadow-[0_0_20px_rgba(88,204,2,0.3)]"
                        : "border-[#ff4b4b] text-[#ff4b4b] bg-[#ff4b4b]/20 shadow-[0_0_20px_rgba(255,75,75,0.3)]"
                    }`}
                  >
                    {selectedAnswer || "?"}
                  </span>
                  <span>{activeChallenge.afterHole}</span>
                </div>

                {/* Particle Selection Buttons */}
                <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs text-[#9a9aa8] font-mono">
                      Choose Slot Value:
                    </span>
                    {activeChallenge.options.map((opt) => {
                      const isOptSelected = selectedAnswer === opt;
                      const isOptCorrect = opt === activeChallenge.correctOption;

                      let btnStyle = "bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-white/20";
                      if (isSubmitted && isOptSelected) {
                        btnStyle = isOptCorrect
                          ? "bg-[#58cc02] text-white border-[#58cc02] shadow-[0_4px_16px_rgba(88,204,2,0.4)] scale-105"
                          : "bg-[#ff4b4b] text-white border-[#ff4b4b] shadow-[0_4px_16px_rgba(255,75,75,0.4)] scale-105";
                      }

                      return (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => handleSelect(opt)}
                          className={`w-11 h-11 rounded-xl font-bold text-base border transition-all duration-200 cursor-pointer ${btnStyle}`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>

                  {isSubmitted && (
                    <button
                      type="button"
                      onClick={() => setSelectedAnswer(null)}
                      className="text-xs text-[#9a9aa8] hover:text-white underline font-mono cursor-pointer self-start sm:self-auto"
                    >
                      Reset selection
                    </button>
                  )}
                </div>

                {/* Live Telemetry Diagnostic Response Panel */}
                {isSubmitted && (
                  <div
                    className={`mt-4 p-4 rounded-xl border text-xs space-y-2.5 transition-all duration-300 ${
                      isCorrect
                        ? "bg-[#58cc02]/10 border-[#58cc02]/30 text-white"
                        : "bg-[#ff4b4b]/10 border-[#ff4b4b]/30 text-white"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {isCorrect ? (
                          <div className="w-5 h-5 rounded-full bg-[#58cc02] text-black font-bold flex items-center justify-center text-xs">
                            ✓
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-full bg-[#ff4b4b] text-white font-bold flex items-center justify-center text-xs">
                            ✕
                          </div>
                        )}
                        <span className="font-bold text-sm">
                          {isCorrect
                            ? "Correct Application"
                            : "Diagnostic Slip Detected"}
                        </span>
                      </div>
                      <span className="font-mono text-[11px] px-2.5 py-0.5 rounded-full bg-black/40 border border-white/10 text-white/90">
                        Tag: {activeChallenge.swotTag}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-white/90 leading-relaxed">
                      {isCorrect
                        ? activeChallenge.explanation
                        : activeChallenge.errorExplanations[selectedAnswer!] ||
                          "Incorrect particle application."}
                    </p>

                    <div className="pt-2 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] font-mono text-[#9a9aa8]">
                      <span>
                        Telemetry routing:{" "}
                        <strong className="text-white">
                          {isCorrect
                            ? "Strengths Quadrant (+1)"
                            : "Weaknesses Quadrant (Targeted Drill Queued)"}
                        </strong>
                      </span>
                      <span>Vocabulary: {activeChallenge.vocabTags.join(" · ")}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
