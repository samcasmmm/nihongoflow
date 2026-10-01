"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Compass,
  Check,
  Volume2,
  Activity,
  Layers,
  Sparkles,
  BarChart3,
  Flame,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { ScrollReveal } from "./scroll-reveal";
import type { SessionPayload } from "@/core/auth/session";

interface HeroSectionProps {
  session?: SessionPayload | null;
}

export function HeroSection({ session }: HeroSectionProps) {
  const [activeTab, setActiveTab] = useState<"lesson" | "swot" | "pitch">("lesson");
  const [selectedParticle, setSelectedParticle] = useState<string | null>("は");

  return (
    <section className="relative min-h-[100dvh] flex flex-col justify-center overflow-hidden pt-24 pb-20">
      {/* Layer 1: Atmospheric Aurora Mesh */}
      <div className="absolute inset-0 hero-aurora pointer-events-none" />

      {/* Layer 2: Geometric Dot Grid */}
      <div className="absolute inset-0 hero-grid pointer-events-none" />

      {/* Layer 3: Subtle Kanji Watermarks */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
        <span className="absolute top-[12%] left-[4%] text-[13rem] font-display font-extrabold text-white/[0.015] leading-none">
          狐
        </span>
        <span className="absolute top-[20%] right-[6%] text-[15rem] font-display font-extrabold text-white/[0.02] leading-none">
          流
        </span>
        <span className="absolute bottom-[22%] left-[16%] text-[11rem] font-display font-extrabold text-white/[0.012] leading-none">
          道
        </span>
        <span className="absolute bottom-[10%] right-[18%] text-[12rem] font-display font-extrabold text-white/[0.016] leading-none">
          学
        </span>
      </div>

      <div className="w-full max-w-6xl mx-auto px-5 sm:px-8 text-center relative z-10">
        {/* Eyebrow Micro-Badge */}
        <ScrollReveal delay={0} duration={600}>
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/10 text-xs text-[#9a9aa8] mb-8 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)]">
            <span className="text-sm">🦊</span>
            <span className="font-mono text-[11px] uppercase tracking-wider text-[#58cc02] font-semibold">
              Minna-Style Textbook Sequence
            </span>
            <span className="w-px h-3 bg-white/10" />
            <span className="text-[#f5f5f7] font-medium hidden sm:inline">
              4-Quadrant SWOT Intelligence
            </span>
          </div>
        </ScrollReveal>

        {/* Grand Headline */}
        <ScrollReveal delay={100} duration={800}>
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.05]">
            Learn Japanese with{" "}
            <span className="glow-text">surgical clarity</span>,
            <br className="hidden sm:inline" /> not random guesswork.
          </h1>
        </ScrollReveal>

        {/* Sub-headline */}
        <ScrollReveal delay={200} duration={800}>
          <p className="mt-6 text-base sm:text-lg text-[#9a9aa8] max-w-2xl mx-auto leading-relaxed font-sans">
            Follow a proven textbook loop:{" "}
            <strong className="text-white font-medium">
              Vocabulary → Grammar → Cumulative Practice
            </strong>
            . Every question decomposes into diagnostic error tags to show you exactly what to drill next.
          </p>
        </ScrollReveal>

        {/* Dual Button-in-Button Island CTAs */}
        <ScrollReveal delay={300} duration={700}>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href={session ? "/dashboard" : "/register"} className="group w-full sm:w-auto">
              <span className="island-btn-primary w-full sm:w-auto">
                <span>{session ? "Enter Learning Studio" : "Start Learning Free"}</span>
                <span className="island-icon-bubble">
                  <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
                </span>
              </span>
            </Link>
            <Link href="/placement" className="group w-full sm:w-auto">
              <span className="island-btn-secondary w-full sm:w-auto">
                <span>Take Placement Quiz</span>
                <span className="island-icon-bubble">
                  <Compass className="w-4 h-4 text-[#1cb0f6]" strokeWidth={1.5} />
                </span>
              </span>
            </Link>
          </div>
        </ScrollReveal>

        {/* Interactive Flagship Product Window: Hardware Double-Bezel Architecture */}
        <ScrollReveal delay={450} duration={900}>
          <div className="mt-16 sm:mt-20 max-w-4xl mx-auto">
            {/* Double-Bezel: Machined Outer Shell */}
            <div className="double-bezel-shell">
              {/* Double-Bezel: Inner Hardware Core */}
              <div className="double-bezel-core p-4 sm:p-7 text-left">
                {/* Window Chrome Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-white/[0.06] gap-4">
                  {/* Left: Window Dots + Lesson Indicator */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
                      <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
                      <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
                    </div>
                    <div className="h-4 w-px bg-white/10 mx-1" />
                    <span className="text-xs font-mono font-medium text-[#9a9aa8]">
                      LESSON 01 <span className="text-white/40">/</span> 自己紹介 (Self Introduction)
                    </span>
                  </div>

                  {/* Right: Interactive Studio View Switcher */}
                  <div className="flex items-center gap-1 p-1 rounded-full bg-black/40 border border-white/5 text-xs">
                    <button
                      type="button"
                      onClick={() => setActiveTab("lesson")}
                      className={`px-3 py-1 rounded-full font-medium transition-all duration-300 ${
                        activeTab === "lesson"
                          ? "bg-white/15 text-white shadow-sm"
                          : "text-[#9a9aa8] hover:text-white"
                      }`}
                    >
                      Guided Loop
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab("swot")}
                      className={`px-3 py-1 rounded-full font-medium transition-all duration-300 ${
                        activeTab === "swot"
                          ? "bg-white/15 text-white shadow-sm"
                          : "text-[#9a9aa8] hover:text-white"
                      }`}
                    >
                      SWOT Radar
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab("pitch")}
                      className={`px-3 py-1 rounded-full font-medium transition-all duration-300 ${
                        activeTab === "pitch"
                          ? "bg-white/15 text-white shadow-sm"
                          : "text-[#9a9aa8] hover:text-white"
                      }`}
                    >
                      Pitch Accent
                    </button>
                  </div>
                </div>

                {/* Tab 1: Guided Lesson View */}
                {activeTab === "lesson" && (
                  <div className="pt-6 space-y-6">
                    {/* Stepper Progress Indicator */}
                    <div className="grid grid-cols-3 gap-2 text-center text-xs">
                      <div className="p-2 rounded-xl bg-[#58cc02]/10 border border-[#58cc02]/30 text-[#58cc02] font-semibold flex items-center justify-center gap-1.5">
                        <Check className="w-3.5 h-3.5" strokeWidth={2} />
                        <span>1. Vocab Priming</span>
                      </div>
                      <div className="p-2 rounded-xl bg-[#1cb0f6]/10 border border-[#1cb0f6]/30 text-[#1cb0f6] font-semibold flex items-center justify-center gap-1.5">
                        <Check className="w-3.5 h-3.5" strokeWidth={2} />
                        <span>2. Grammar Pattern</span>
                      </div>
                      <div className="p-2 rounded-xl bg-[#ce82ff]/15 border border-[#ce82ff]/40 text-[#ce82ff] font-bold flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(206,130,255,0.15)]">
                        <Activity className="w-3.5 h-3.5" strokeWidth={2} />
                        <span>3. Cumulative Practice</span>
                      </div>
                    </div>

                    {/* Interactive Question Card */}
                    <div className="p-5 sm:p-6 rounded-2xl bg-[#12121e] border border-white/[0.08] space-y-4">
                      <div className="flex items-center justify-between text-xs text-[#9a9aa8]">
                        <span className="font-mono text-[11px] uppercase tracking-wider text-[#58cc02] font-semibold flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5" strokeWidth={1.5} />
                          Cumulative Sentence Verification (L1 Vocab Only)
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/5 text-[10px] font-mono">
                          Tag: particle.topic_marker
                        </span>
                      </div>

                      {/* Prompt */}
                      <div className="text-xs text-[#9a9aa8]">
                        Complete the Japanese translation for:{" "}
                        <span className="text-white font-semibold">
                          &quot;I am a student.&quot;
                        </span>
                      </div>

                      {/* Interactive Sentence with Particle Hole */}
                      <div className="flex items-center gap-2 sm:gap-3 text-lg sm:text-2xl font-bold text-white flex-wrap py-2">
                        <span>わたし</span>
                        <span
                          className={`px-3 py-1 rounded-xl border text-base sm:text-xl transition-all duration-300 ${
                            selectedParticle === "は"
                              ? "bg-[#58cc02]/20 border-[#58cc02] text-[#58cc02]"
                              : "bg-white/5 border-white/20 text-[#9a9aa8]"
                          }`}
                        >
                          {selectedParticle || "?"}
                        </span>
                        <span>学生</span>
                        <span className="text-white/80 font-normal">です。</span>
                      </div>

                      {/* Interactive Choice Buttons */}
                      <div className="pt-2 flex items-center gap-2.5">
                        <span className="text-xs text-[#9a9aa8] mr-1">Select Particle:</span>
                        {["は", "が", "を", "に"].map((p) => (
                          <button
                            key={p}
                            type="button"
                            onClick={() => setSelectedParticle(p)}
                            className={`w-10 h-10 rounded-xl font-bold text-sm transition-all duration-200 cursor-pointer ${
                              selectedParticle === p
                                ? p === "は"
                                  ? "bg-[#58cc02] text-white shadow-[0_4px_16px_rgba(88,204,2,0.4)] scale-105"
                                  : "bg-[#ff4b4b] text-white shadow-[0_4px_16px_rgba(255,75,75,0.4)] scale-105"
                                : "bg-white/5 border border-white/10 text-white hover:bg-white/10"
                            }`}
                          >
                            {p}
                          </button>
                        ))}
                      </div>

                      {/* Live Diagnostic Evaluation Result */}
                      {selectedParticle === "は" ? (
                        <div className="p-3 rounded-xl bg-[#58cc02]/10 border border-[#58cc02]/30 flex items-center justify-between text-xs text-[#58cc02]">
                          <span className="flex items-center gap-2 font-medium">
                            <Check className="w-4 h-4 shrink-0" strokeWidth={2} />
                            <span>
                              <strong>Correct.</strong> &quot;は&quot; marks &quot;わたし&quot; as the sentence topic.
                            </span>
                          </span>
                          <span className="font-mono text-[11px] font-bold shrink-0 ml-2">
                            +10 XP · SWOT Logged
                          </span>
                        </div>
                      ) : selectedParticle ? (
                        <div className="p-3 rounded-xl bg-[#ff4b4b]/10 border border-[#ff4b4b]/30 flex items-center justify-between text-xs text-[#ff4b4b]">
                          <span className="flex items-center gap-2 font-medium">
                            <span>
                              <strong>Diagnostic notice:</strong> &quot;{selectedParticle}&quot; does not mark the topic in nominal sentences. Tagged as <code>particle.misuse</code>.
                            </span>
                          </span>
                          <span className="font-mono text-[11px] font-bold shrink-0 ml-2">
                            Added to Drill Queue
                          </span>
                        </div>
                      ) : null}
                    </div>
                  </div>
                )}

                {/* Tab 2: SWOT Diagnostic Radar View */}
                {activeTab === "swot" && (
                  <div className="pt-6 space-y-4">
                    <div className="flex items-center justify-between text-xs">
                      <div>
                        <h4 className="text-white font-bold text-sm">
                          Personalized SWOT Matrix
                        </h4>
                        <p className="text-[#9a9aa8] text-xs">
                          Real-time breakdown across 34 diagnostic error tags
                        </p>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-[#1cb0f6]/10 border border-[#1cb0f6]/20 text-[#1cb0f6] text-[11px] font-mono font-semibold">
                        Aggregated: 48 Responses
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      {/* Strengths */}
                      <div className="p-3.5 rounded-xl bg-[#58cc02]/5 border border-[#58cc02]/25 space-y-1.5">
                        <div className="flex items-center justify-between text-[#58cc02] font-bold text-[11px]">
                          <span>STRENGTHS (≥ 80%)</span>
                          <span className="font-mono">94%</span>
                        </div>
                        <p className="text-white font-semibold">は vs を Particle Distinction</p>
                        <p className="text-[11px] text-[#9a9aa8]">
                          18/19 correct · Instinctive recall under 1.8s
                        </p>
                      </div>

                      {/* Opportunities */}
                      <div className="p-3.5 rounded-xl bg-[#1cb0f6]/5 border border-[#1cb0f6]/25 space-y-1.5">
                        <div className="flex items-center justify-between text-[#1cb0f6] font-bold text-[11px]">
                          <span>OPPORTUNITIES (60–79%)</span>
                          <span className="font-mono">76%</span>
                        </div>
                        <p className="text-white font-semibold">Past Tense Affirmative (~ました)</p>
                        <p className="text-[11px] text-[#9a9aa8]">
                          2 more correct answers to reach mastery
                        </p>
                      </div>

                      {/* Weaknesses */}
                      <div className="p-3.5 rounded-xl bg-[#ff4b4b]/5 border border-[#ff4b4b]/25 space-y-1.5">
                        <div className="flex items-center justify-between text-[#ff4b4b] font-bold text-[11px]">
                          <span>WEAKNESSES (&lt; 60%)</span>
                          <span className="font-mono">42%</span>
                        </div>
                        <p className="text-white font-semibold">Topic &quot;は&quot; vs Subject &quot;が&quot;</p>
                        <p className="text-[11px] text-[#9a9aa8]">
                          High error rate on unknown noun clauses · Targeted drill recommended
                        </p>
                      </div>

                      {/* Threats */}
                      <div className="p-3.5 rounded-xl bg-[#ff9600]/5 border border-[#ff9600]/25 space-y-1.5">
                        <div className="flex items-center justify-between text-[#ff9600] font-bold text-[11px]">
                          <span>THREATS (Decay Risk)</span>
                          <span className="font-mono">14 Days</span>
                        </div>
                        <p className="text-white font-semibold">Lesson 1 Vocabulary Retention</p>
                        <p className="text-[11px] text-[#9a9aa8]">
                          Unreviewed for 2 weeks · Projected retention decay to 58%
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab 3: Pitch Accent View */}
                {activeTab === "pitch" && (
                  <div className="pt-6 space-y-4">
                    <div className="text-xs text-[#9a9aa8]">
                      Japanese is a pitch-accent language. NihongoFlow annotates every word with its accurate mora pitch contour.
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[
                        {
                          word: "先生",
                          kana: "せんせい",
                          meaning: "Teacher",
                          type: "Heiban [0]",
                          contour: "Low → High → High → High",
                          accent: "#58cc02",
                        },
                        {
                          word: "学生",
                          kana: "がくせい",
                          meaning: "Student",
                          type: "Atamadaka [1]",
                          contour: "High → Low → Low → Low",
                          accent: "#1cb0f6",
                        },
                        {
                          word: "会社員",
                          kana: "かいしゃいん",
                          meaning: "Employee",
                          type: "Nakadaka [3]",
                          contour: "Low → High → High → Low",
                          accent: "#ce82ff",
                        },
                      ].map((item) => (
                        <div
                          key={item.word}
                          className="p-4 rounded-xl bg-[#12121e] border border-white/[0.08] space-y-2.5"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-lg font-bold text-white">{item.word}</span>
                            <span
                              className="text-[10px] font-mono px-2 py-0.5 rounded-full"
                              style={{
                                color: item.accent,
                                backgroundColor: `${item.accent}15`,
                                border: `1px solid ${item.accent}30`,
                              }}
                            >
                              {item.type}
                            </span>
                          </div>
                          <div className="text-xs text-[#9a9aa8]">
                            【{item.kana}】 · {item.meaning}
                          </div>
                          <div className="p-2 rounded-lg bg-black/30 border border-white/5 text-[11px] font-mono text-white/80 flex items-center justify-between">
                            <span>{item.contour}</span>
                            <Volume2 className="w-3.5 h-3.5" style={{ color: item.accent }} strokeWidth={1.5} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Footer Bar inside Window */}
                <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs text-[#9a9aa8]">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#58cc02]" strokeWidth={1.5} />
                    <span>Server-authoritative progress · Zero textbook infringement</span>
                  </div>
                  <div className="flex items-center gap-1 font-mono text-[11px] text-white/70">
                    <Flame className="w-3.5 h-3.5 text-[#ff9600]" strokeWidth={1.5} />
                    <span>Effort-Based Streaks</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
