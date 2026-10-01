"use client";

import React from "react";
import {
  BookOpen,
  Puzzle,
  BarChart3,
  Check,
  Volume2,
  Sparkles,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { ScrollReveal } from "./scroll-reveal";

const steps = [
  {
    number: "01",
    phase: "PHASE ONE",
    title: "Vocabulary Priming & Pitch Accent",
    subtitle: "Acoustic & Semantic Memory",
    description:
      "Every lesson starts with curated vocabulary. We annotate reading, Kanji breakdown, and exact mora pitch accent so you speak natural Japanese from day one without robotic intonation.",
    accent: "#58cc02",
    icon: BookOpen,
    preview: (
      <div className="space-y-2.5 text-xs">
        {[
          {
            kanji: "車",
            kana: "くるま",
            meaning: "Car / Automobile",
            accent: "Heiban [0]",
            contour: "Low → High → High",
            mora: "ku - ru - ma",
          },
          {
            kanji: "時計",
            kana: "とけい",
            meaning: "Clock / Watch",
            accent: "Heiban [0]",
            contour: "Low → High → High",
            mora: "to - ke - i",
          },
          {
            kanji: "本",
            kana: "ほん",
            meaning: "Book",
            accent: "Atamadaka [1]",
            contour: "High → Low",
            mora: "ho - n",
          },
        ].map((item) => (
          <div
            key={item.kanji}
            className="p-3 rounded-xl bg-[#10101a] border border-white/[0.06] flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <span className="w-6 h-6 rounded-lg bg-[#58cc02]/15 text-[#58cc02] text-xs font-bold flex items-center justify-center">
                ✓
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white">{item.kanji}</span>
                  <span className="text-emerald-400 font-mono text-[11px]">
                    【{item.kana}】
                  </span>
                </div>
                <div className="text-[11px] text-[#9a9aa8]">{item.meaning}</div>
              </div>
            </div>
            <div className="text-right font-mono text-[10px] text-[#9a9aa8] hidden sm:block">
              <span className="text-[#58cc02] flex items-center gap-1 justify-end">
                <Volume2 className="w-3 h-3" strokeWidth={1.5} />
                {item.accent}
              </span>
              <span className="text-white/60">{item.contour}</span>
            </div>
          </div>
        ))}
        <div className="p-2.5 rounded-lg bg-[#58cc02]/5 border border-[#58cc02]/20 flex items-center justify-between text-[11px] text-[#58cc02]">
          <span className="flex items-center gap-1.5 font-medium">
            <Sparkles className="w-3.5 h-3.5" strokeWidth={1.5} />
            <span>Cumulative Lock: Added to L1..N Active Bank</span>
          </span>
          <span className="font-mono font-bold">+3 Words</span>
        </div>
      </div>
    ),
  },
  {
    number: "02",
    phase: "PHASE TWO",
    title: "Structural Grammar Patterns",
    subtitle: "Slot-Based Formulaic Architecture",
    description:
      "Grammar is never memorized as wall-of-text rules. We present each sentence pattern as an interactive slot formula, clarifying how particles connect subject, destination, and verb.",
    accent: "#1cb0f6",
    icon: Puzzle,
    preview: (
      <div className="space-y-3 text-xs">
        {/* Formula Slots */}
        <div className="p-3.5 rounded-xl bg-[#10101a] border border-[#1cb0f6]/30 space-y-2">
          <div className="text-[10px] uppercase font-mono tracking-wider text-[#1cb0f6] font-bold">
            Pattern Formula: Movement to Destination
          </div>
          <div className="flex items-center gap-1.5 flex-wrap font-mono text-xs">
            <span className="px-2 py-1 rounded-md bg-white/5 border border-white/10 text-white">
              [ Place / 場所 ]
            </span>
            <span className="text-lg font-bold text-[#1cb0f6]">へ</span>
            <span className="px-2 py-1 rounded-md bg-white/5 border border-white/10 text-white">
              [ 行きます / 来ます ]
            </span>
          </div>
        </div>

        {/* Concrete Example */}
        <div className="p-3.5 rounded-xl bg-[#10101a] border border-white/[0.06] space-y-1.5">
          <div className="text-[10px] uppercase font-mono text-[#9a9aa8]">
            Slot Applied Example
          </div>
          <div className="text-sm font-semibold text-white">
            明日、東京<span className="text-[#1cb0f6] font-bold">へ</span>行きます。
          </div>
          <div className="text-[#9a9aa8] text-xs">
            Tomorrow, I will go to Tokyo.
          </div>
        </div>

        {/* Nuance Note */}
        <div className="p-2.5 rounded-lg bg-[#1cb0f6]/5 border border-[#1cb0f6]/20 text-[11px] text-[#1cb0f6] flex items-center justify-between">
          <span>Particle &quot;へ&quot; (pronounced &quot;e&quot;) marks the physical direction.</span>
          <span className="font-mono font-bold">L5 Pattern</span>
        </div>
      </div>
    ),
  },
  {
    number: "03",
    phase: "PHASE THREE",
    title: "Cumulative Practice & SWOT Telemetry",
    subtitle: "Decomposed Error Diagnostics",
    description:
      "Practice questions strictly enforce cumulative vocabulary constraints: only words from Lessons 1..N. Every answer you submit is analyzed into error tags that feed your diagnostic SWOT matrix.",
    accent: "#ce82ff",
    icon: BarChart3,
    preview: (
      <div className="space-y-3 text-xs">
        {/* Practice Item */}
        <div className="p-3.5 rounded-xl bg-[#10101a] border border-[#ce82ff]/30 space-y-2">
          <div className="flex items-center justify-between text-[10px] font-mono text-[#ce82ff] font-bold">
            <span>TRANSFORMATION TEST</span>
            <span>Accuracy: 100%</span>
          </div>
          <div className="text-xs text-[#9a9aa8]">
            Transform to Negative Politeness:
          </div>
          <div className="flex items-center gap-2 text-sm font-bold text-white">
            <span className="line-through text-[#9a9aa8]">行きます</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#ce82ff]" strokeWidth={1.5} />
            <span className="text-emerald-400">行きません</span>
          </div>
        </div>

        {/* SWOT Telemetry Logged */}
        <div className="grid grid-cols-2 gap-2">
          <div className="p-2.5 rounded-lg bg-[#58cc02]/10 border border-[#58cc02]/25 text-[11px]">
            <span className="text-[10px] font-mono font-bold text-[#58cc02] block">
              STRENGTH LOGGED
            </span>
            <span className="text-white font-medium">verb.masu_negation</span>
            <span className="text-[10px] text-emerald-400 block font-mono">
              98% Mastery
            </span>
          </div>
          <div className="p-2.5 rounded-lg bg-[#1cb0f6]/10 border border-[#1cb0f6]/25 text-[11px]">
            <span className="text-[10px] font-mono font-bold text-[#1cb0f6] block">
              NEXT DRILL QUEUE
            </span>
            <span className="text-white font-medium">particle.wa_vs_ga</span>
            <span className="text-[10px] text-[#1cb0f6] block font-mono">
              Drill Scheduled
            </span>
          </div>
        </div>
      </div>
    ),
  },
];

export function HowItWorksSection() {
  return (
    <section className="relative py-24 sm:py-32 overflow-hidden z-10">
      <div className="w-full max-w-6xl mx-auto px-5 sm:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-20 sm:mb-24">
          <ScrollReveal delay={0} duration={600}>
            <div className="eyebrow-badge text-[#58cc02] border-[#58cc02]/20 bg-[#58cc02]/5 mb-4">
              <span>01 / The Pedagogical Engine</span>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={100} duration={800}>
            <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight leading-tight">
              The 3-Step Guided Loop
            </h2>
          </ScrollReveal>

          <ScrollReveal delay={200} duration={800}>
            <p className="mt-4 text-base sm:text-lg text-[#9a9aa8]">
              No aimless browsing. Every lesson guides you through structured priming, formulaic pattern recognition, and cumulative practice.
            </p>
          </ScrollReveal>
        </div>

        {/* Steps List: Alternating Editorial Layout */}
        <div className="space-y-16 sm:space-y-24">
          {steps.map((step, index) => {
            const isEven = index % 2 === 1;
            const Icon = step.icon;

            return (
              <div
                key={step.number}
                className={`flex flex-col ${
                  isEven ? "lg:flex-row-reverse" : "lg:flex-row"
                } items-center gap-10 sm:gap-16`}
              >
                {/* Text Content */}
                <div className="w-full lg:w-1/2 space-y-4">
                  <ScrollReveal delay={100} duration={700}>
                    <div className="flex items-center gap-3">
                      <span
                        className="text-xs font-mono font-bold px-2.5 py-1 rounded-full"
                        style={{
                          color: step.accent,
                          backgroundColor: `${step.accent}15`,
                          border: `1px solid ${step.accent}30`,
                        }}
                      >
                        STEP {step.number}
                      </span>
                      <span className="text-xs font-mono text-[#9a9aa8] uppercase tracking-wider">
                        {step.phase}
                      </span>
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-display font-extrabold text-white mt-2">
                      {step.title}
                    </h3>
                    <p className="text-sm font-semibold text-[#f5f5f7]/80">
                      {step.subtitle}
                    </p>

                    <p className="text-sm sm:text-base text-[#9a9aa8] leading-relaxed pt-1">
                      {step.description}
                    </p>
                  </ScrollReveal>
                </div>

                {/* Visual Preview: Double-Bezel Hardware Frame */}
                <div className="w-full lg:w-1/2">
                  <ScrollReveal delay={250} duration={800}>
                    <div className="double-bezel-shell">
                      <div className="double-bezel-core p-5 sm:p-6">
                        {/* Card Header */}
                        <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-white/[0.06]">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-7 h-7 rounded-lg flex items-center justify-center"
                              style={{ backgroundColor: `${step.accent}20` }}
                            >
                              <Icon
                                className="w-3.5 h-3.5"
                                style={{ color: step.accent }}
                                strokeWidth={1.5}
                              />
                            </div>
                            <span className="text-xs font-bold text-white">
                              {step.title}
                            </span>
                          </div>
                          <span className="text-[10px] font-mono text-[#9a9aa8]">
                            Interactive Simulator
                          </span>
                        </div>

                        {/* Interactive UI Mockup */}
                        {step.preview}
                      </div>
                    </div>
                  </ScrollReveal>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
