"use client";

import React from "react";
import {
  Layers,
  Zap,
  ShieldCheck,
  Sparkles,
  Check,
  Target,
  Flame,
  Volume2,
  Clock,
  BookOpen,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { ScrollReveal } from "./scroll-reveal";

export function FeaturesSection() {
  return (
    <section className="relative py-24 sm:py-32 overflow-hidden z-10">
      <div className="w-full max-w-6xl mx-auto px-5 sm:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 sm:mb-20">
          <ScrollReveal delay={0} duration={600}>
            <div className="eyebrow-badge text-[#ce82ff] border-[#ce82ff]/20 bg-[#ce82ff]/5 mb-4">
              <span>03 / System Architecture</span>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={100} duration={800}>
            <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight">
              Engineered for Serious Retention
            </h2>
          </ScrollReveal>

          <ScrollReveal delay={200} duration={800}>
            <p className="mt-4 text-base sm:text-lg text-[#9a9aa8]">
              Most language apps optimize for dopamine. NihongoFlow optimizes for syntactic fluency and diagnostic accuracy.
            </p>
          </ScrollReveal>
        </div>

        {/* Asymmetrical Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Bento Tile 1: The SWOT Diagnostic Engine (Col-span 8) */}
          <div className="lg:col-span-8">
            <ScrollReveal delay={100} duration={700}>
              <div className="double-bezel-shell h-full">
                <div className="double-bezel-core p-6 sm:p-8 flex flex-col justify-between h-full space-y-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-[#ce82ff]/15 flex items-center justify-center">
                          <Zap className="w-4 h-4 text-[#ce82ff]" strokeWidth={1.5} />
                        </div>
                        <span className="text-xs font-mono uppercase tracking-wider text-[#ce82ff] font-semibold">
                          Diagnostic Intelligence
                        </span>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-mono text-[#9a9aa8]">
                        34 Error Tags Active
                      </span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-display font-extrabold text-white">
                      4-Quadrant SWOT Matrix: Accuracy ≠ Mastery
                    </h3>
                    <p className="text-sm text-[#9a9aa8] leading-relaxed">
                      A flat &quot;80% accuracy&quot; score hides critical blind spots. NihongoFlow decomposes every practice question into atomic tags—such as particle misuse, verb inflection slips, or temporal decay.
                    </p>
                  </div>

                  {/* Visual Preview: Diagnostic Matrix Breakdown */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div className="p-3.5 rounded-xl bg-[#58cc02]/10 border border-[#58cc02]/25 space-y-1">
                      <div className="flex items-center justify-between text-[#58cc02] font-mono text-[11px] font-bold">
                        <span>STRENGTHS</span>
                        <span>94%</span>
                      </div>
                      <div className="text-white text-xs font-semibold">
                        Direct Object &quot;を&quot; with Action Verbs
                      </div>
                      <div className="text-[10px] text-[#9a9aa8] font-mono">
                        ● Instinctive · 21 attempts verified
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#1cb0f6]/10 border border-[#1cb0f6]/25 space-y-1">
                      <div className="flex items-center justify-between text-[#1cb0f6] font-mono text-[11px] font-bold">
                        <span>OPPORTUNITIES</span>
                        <span>76%</span>
                      </div>
                      <div className="text-white text-xs font-semibold">
                        Te-Form (~て) Verb Connection
                      </div>
                      <div className="text-[10px] text-[#9a9aa8] font-mono">
                        ● 3 consecutive correct to reach mastery
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#ff4b4b]/10 border border-[#ff4b4b]/25 space-y-1">
                      <div className="flex items-center justify-between text-[#ff4b4b] font-mono text-[11px] font-bold">
                        <span>WEAKNESSES</span>
                        <span>42%</span>
                      </div>
                      <div className="text-white text-xs font-semibold">
                        Topic &quot;は&quot; vs Subject &quot;が&quot;
                      </div>
                      <div className="text-[10px] text-[#9a9aa8] font-mono">
                        ▲ Tagged for immediate micro-drill
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#ff9600]/10 border border-[#ff9600]/25 space-y-1">
                      <div className="flex items-center justify-between text-[#ff9600] font-mono text-[11px] font-bold">
                        <span>THREATS</span>
                        <span>14 Days</span>
                      </div>
                      <div className="text-white text-xs font-semibold">
                        Lesson 1 Vocab Recall Decay
                      </div>
                      <div className="text-[10px] text-[#9a9aa8] font-mono">
                        ▼ Spaced repetition interval reached
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Bento Tile 2: Cumulative Vocab Guardrail (Col-span 4) */}
          <div className="lg:col-span-4">
            <ScrollReveal delay={200} duration={700}>
              <div className="double-bezel-shell h-full">
                <div className="double-bezel-core p-6 sm:p-7 flex flex-col justify-between h-full space-y-6">
                  <div className="space-y-3">
                    <div className="w-8 h-8 rounded-xl bg-[#58cc02]/15 flex items-center justify-center">
                      <Layers className="w-4 h-4 text-[#58cc02]" strokeWidth={1.5} />
                    </div>
                    <span className="text-xs font-mono uppercase tracking-wider text-[#58cc02] font-semibold block">
                      Pedagogical Guardrail
                    </span>
                    <h3 className="text-xl font-display font-extrabold text-white">
                      L1..N Cumulative Vocabulary Constraint
                    </h3>
                    <p className="text-xs sm:text-sm text-[#9a9aa8] leading-relaxed">
                      Never fail a grammar test because of an unfamiliar word. Every sentence in Lesson N is tag-checked against Lessons 1..N.
                    </p>
                  </div>

                  {/* Visual Preview: Tag Verification Inspector */}
                  <div className="p-3.5 rounded-xl bg-[#12121e] border border-white/[0.08] space-y-2 text-xs">
                    <div className="text-[10px] font-mono text-[#58cc02] flex items-center gap-1 font-bold">
                      <Check className="w-3.5 h-3.5" strokeWidth={2} />
                      TAG INTEGRITY VERIFIED
                    </div>
                    <div className="text-white font-medium text-xs">
                      「駅で本を買いました。」
                    </div>
                    <div className="flex flex-wrap gap-1 text-[10px] font-mono text-[#9a9aa8] pt-1">
                      <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-emerald-400">
                        駅 (L2)
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-emerald-400">
                        で (L5)
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-emerald-400">
                        本 (L1)
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-emerald-400">
                        買いました (L5)
                      </span>
                    </div>
                    <div className="text-[10px] text-white/50 pt-1 border-t border-white/5">
                      ✓ Zero out-of-syllabus terms detected
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Bento Tile 3: Non-Punitive Motivation & Streak Shields (Col-span 4) */}
          <div className="lg:col-span-4">
            <ScrollReveal delay={300} duration={700}>
              <div className="double-bezel-shell h-full">
                <div className="double-bezel-core p-6 sm:p-7 flex flex-col justify-between h-full space-y-6">
                  <div className="space-y-3">
                    <div className="w-8 h-8 rounded-xl bg-[#ff9600]/15 flex items-center justify-center">
                      <Flame className="w-4 h-4 text-[#ff9600]" strokeWidth={1.5} />
                    </div>
                    <span className="text-xs font-mono uppercase tracking-wider text-[#ff9600] font-semibold block">
                      Effort-Based System
                    </span>
                    <h3 className="text-xl font-display font-extrabold text-white">
                      Server-Authoritative Streaks &amp; Freezes
                    </h3>
                    <p className="text-xs sm:text-sm text-[#9a9aa8] leading-relaxed">
                      No toxic shaming, no pay-to-win streak repairs, no client-side spoofing. When life happens, automated streak freezes protect your momentum.
                    </p>
                  </div>

                  {/* Visual Preview: Streak Shield Card */}
                  <div className="p-3.5 rounded-xl bg-[#12121e] border border-white/[0.08] space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-[#ff9600] font-bold">
                        <Flame className="w-3.5 h-3.5 fill-[#ff9600]" />
                        14-Day Streak Active
                      </span>
                      <span className="text-[10px] font-mono text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-400/10 border border-emerald-400/20">
                        Shield Ready
                      </span>
                    </div>
                    <div className="p-2 rounded-lg bg-black/40 border border-white/5 text-[11px] text-[#9a9aa8] flex items-center justify-between">
                      <span>Weekly Freezes Available:</span>
                      <span className="font-mono text-white font-bold">1 / 1 🛡️</span>
                    </div>
                    <div className="text-[10px] text-white/50">
                      Non-punitive: Missing a day automatically consumes a freeze without penalty.
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Bento Tile 4: Minna-Style Structured Sequence (Col-span 8) */}
          <div className="lg:col-span-8">
            <ScrollReveal delay={400} duration={700}>
              <div className="double-bezel-shell h-full">
                <div className="double-bezel-core p-6 sm:p-8 flex flex-col justify-between h-full space-y-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-[#1cb0f6]/15 flex items-center justify-center">
                          <BookOpen className="w-4 h-4 text-[#1cb0f6]" strokeWidth={1.5} />
                        </div>
                        <span className="text-xs font-mono uppercase tracking-wider text-[#1cb0f6] font-semibold">
                          Pedagogical Roadmap
                        </span>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-mono text-[#9a9aa8]">
                        50 Sequential Lessons
                      </span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-display font-extrabold text-white">
                      The Standard Japanese Textbook Sequence (100% Original Content)
                    </h3>
                    <p className="text-sm text-[#9a9aa8] leading-relaxed">
                      Follow the globally acclaimed textbook syllabus order: start with copula sentences and personal identification, advance through directional particles, verb conjugations, and relative clauses.
                    </p>
                  </div>

                  {/* Visual Preview: Milestone Timeline */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
                    <div className="p-3 rounded-xl bg-[#12121e] border border-white/[0.08] space-y-1">
                      <div className="text-[10px] font-mono text-[#58cc02] font-bold">
                        LESSONS 01–10
                      </div>
                      <div className="text-white text-xs font-semibold">
                        Foundations &amp; Particles
                      </div>
                      <div className="text-[10px] text-[#9a9aa8]">
                        Nominal sentences, demonstratives (これ/それ), existence (ある/いる).
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-[#12121e] border border-white/[0.08] space-y-1">
                      <div className="text-[10px] font-mono text-[#1cb0f6] font-bold">
                        LESSONS 11–25
                      </div>
                      <div className="text-white text-xs font-semibold">
                        Verbal Conjugation Mastery
                      </div>
                      <div className="text-[10px] text-[#9a9aa8]">
                        Te-form, Nai-form, Ta-form, sequential actions &amp; permissions.
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-[#12121e] border border-white/[0.08] space-y-1">
                      <div className="text-[10px] font-mono text-[#ce82ff] font-bold">
                        LESSONS 26–50
                      </div>
                      <div className="text-white text-xs font-semibold">
                        Intermediate Synthesis
                      </div>
                      <div className="text-[10px] text-[#9a9aa8]">
                        Modality (~んです), conditionals (~たら), passive, and causative.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
