"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, BookOpen, ShieldCheck } from "lucide-react";
import { ScrollReveal } from "./scroll-reveal";
import type { SessionPayload } from "@/core/auth/session";

interface FinalCTASectionProps {
  session?: SessionPayload | null;
}

export function FinalCTASection({ session }: FinalCTASectionProps) {
  return (
    <section className="relative py-24 sm:py-36 overflow-hidden z-10">
      {/* Ambient aurora glow behind the CTA */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] rounded-full bg-[#58cc02]/[0.05] blur-[140px]" />
        <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[350px] rounded-full bg-[#1cb0f6]/[0.04] blur-[120px]" />
      </div>

      <div className="w-full max-w-4xl mx-auto px-5 sm:px-8 relative z-10">
        <ScrollReveal duration={800}>
          {/* Double-Bezel CTA Island */}
          <div className="double-bezel-shell">
            <div className="double-bezel-core text-center px-6 sm:px-14 py-14 sm:py-20 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#58cc02]/10 border border-[#58cc02]/20 text-[#58cc02] text-xs font-mono font-semibold">
                <Sparkles className="w-3.5 h-3.5" strokeWidth={1.5} />
                <span>Zero Paywalls on Core Pedagogical Loop</span>
              </div>

              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-display font-extrabold text-white leading-tight">
                Ready to learn Japanese <br className="hidden sm:inline" />
                <span className="glow-text">with true diagnostic mastery?</span>
              </h2>

              <p className="text-sm sm:text-base text-[#9a9aa8] max-w-lg mx-auto leading-relaxed">
                Step away from random flashcard decks. Experience structured lessons, formulaic grammar patterns, and real-time SWOT feedback.
              </p>

              {/* Island Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href={session ? "/dashboard" : "/register"}
                  className="group w-full sm:w-auto"
                >
                  <span className="island-btn-primary w-full sm:w-auto">
                    <span>
                      {session ? "Enter Learning Studio" : "Start Learning Free"}
                    </span>
                    <span className="island-icon-bubble">
                      <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
                    </span>
                  </span>
                </Link>

                <Link href="/methodology" className="group w-full sm:w-auto">
                  <span className="island-btn-secondary w-full sm:w-auto">
                    <span>Read Methodology</span>
                    <span className="island-icon-bubble">
                      <BookOpen className="w-4 h-4 text-[#1cb0f6]" strokeWidth={1.5} />
                    </span>
                  </span>
                </Link>
              </div>

              <div className="pt-4 flex flex-wrap items-center justify-center gap-4 text-xs font-mono text-[#9a9aa8]/70">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#58cc02]" strokeWidth={1.5} />
                  No credit card required
                </span>
                <span className="w-1 h-1 rounded-full bg-white/20" />
                <span>Server-authoritative progress</span>
                <span className="w-1 h-1 rounded-full bg-white/20" />
                <span>Zero dark patterns</span>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
