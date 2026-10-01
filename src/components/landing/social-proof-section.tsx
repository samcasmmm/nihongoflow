"use client";

import React from "react";
import { Users, BookOpen, Layers, BarChart3 } from "lucide-react";
import { ScrollReveal } from "./scroll-reveal";
import { AnimatedCounter } from "./animated-counter";

const stats = [
  {
    icon: BookOpen,
    value: 50,
    suffix: "",
    label: "Structured Lessons",
    subtext: "Sequenced N5 → N4",
    color: "#58cc02",
  },
  {
    icon: Layers,
    value: 1200,
    suffix: "+",
    label: "Cumulative Vocab Items",
    subtext: "Pitch Accent Annotated",
    color: "#1cb0f6",
  },
  {
    icon: BarChart3,
    value: 34,
    suffix: " Tags",
    label: "SWOT Diagnostic Tags",
    subtext: "Decomposed Error Telemetry",
    color: "#ce82ff",
  },
  {
    icon: Users,
    value: 100,
    suffix: "%",
    label: "Original Curriculum",
    subtext: "Zero Copyright Porting",
    color: "#ff9600",
  },
];

export function SocialProofSection() {
  return (
    <section className="relative py-12 sm:py-16 z-10">
      {/* Top subtle hairline */}
      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />

      <div className="w-full max-w-5xl mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <ScrollReveal key={stat.label} delay={i * 80} duration={600}>
                {/* Double-Bezel Mini Shell */}
                <div className="p-1 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:border-white/15 transition-all duration-300 group">
                  <div className="p-4 sm:p-5 rounded-[calc(1rem-0.125rem)] bg-[#0c0c14] border border-white/[0.04] text-center space-y-1 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]">
                    <div
                      className="w-9 h-9 rounded-xl mx-auto mb-2.5 flex items-center justify-center transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110"
                      style={{
                        backgroundColor: `${stat.color}15`,
                        boxShadow: `0 0 20px ${stat.color}18`,
                      }}
                    >
                      <Icon className="w-4 h-4" style={{ color: stat.color }} strokeWidth={1.5} />
                    </div>
                    <div
                      className="text-2xl sm:text-3xl font-display font-extrabold"
                      style={{ color: stat.color }}
                    >
                      <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                    </div>
                    <div className="text-xs text-white font-semibold">{stat.label}</div>
                    <div className="text-[11px] text-[#9a9aa8] font-mono">{stat.subtext}</div>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>

      {/* Bottom subtle hairline */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />
    </section>
  );
}
