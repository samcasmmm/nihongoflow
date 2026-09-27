import React from 'react';
import Link from 'next/link';
import { getSession } from '@/core/auth/session';
import { SiteHeader } from '@/components/navigation/site-header';
import { SiteFooter } from '@/components/navigation/site-footer';
import { Button } from '@/components/ui/button';
import { BookOpen, Layers, Zap, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const metadata = {
  title: 'Pedagogical Methodology — NihongoFlow 🦊',
  description:
    'Explore the pedagogical architecture of NihongoFlow: Guided 3-stage steppers, cumulative vocabulary constraints, and 4-quadrant SWOT feedback.',
};

export default async function MethodologyPage() {
  const session = await getSession();

  return (
    <div className='min-h-screen bg-(--bg) text-(--text) flex flex-col'>
      <SiteHeader session={session} />

      <main className='flex-1 w-full max-w-[92%] lg:max-w-[80%] mx-auto px-4 sm:px-6 lg:px-8 py-16'>
        {/* Hero Header */}
        <div className='text-center max-w-3xl mx-auto space-y-4 mb-16'>
          <div className='inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#181826] border border-[#58cc02]/30 text-[#58cc02] text-xs font-bold'>
            <BookOpen className='w-3.5 h-3.5' />
            <span>Pedagogical Architecture</span>
          </div>
          <h1 className='text-4xl sm:text-6xl font-display font-extrabold text-white tracking-tight'>
            How NihongoFlow Works
          </h1>
          <p className='text-base sm:text-lg text-[#9a9aa8] leading-relaxed'>
            Most language apps oscillate between chaotic gamification and dense, impenetrable textbooks. NihongoFlow
            bridges the gap: the proven structure of Japanese classroom syllabi married with real-time diagnostic
            intelligence.
          </p>
        </div>

        {/* Pillar 1: Guided 3-Stage Stepper */}
        <section
          className='bento p-8 sm:p-10 space-y-6 mb-12'
          style={{ '--card-glow': 'rgba(88, 204, 2, 0.4)' } as React.CSSProperties}
        >
          <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/5 pb-6'>
            <div className='flex items-center gap-3.5'>
              <div className='w-12 h-12 rounded-xl bg-[#58cc02]/15 border border-[#58cc02]/30 flex items-center justify-center text-[#58cc02] shrink-0'>
                <Layers className='w-6 h-6' />
              </div>
              <div>
                <span className='text-xs uppercase font-extrabold text-[#58cc02] tracking-wider block'>Pillar 1</span>
                <h2 className='text-2xl font-display font-bold text-white'>The Guided 3-Stage Stepper</h2>
              </div>
            </div>
            <span className='chip text-[#58cc02] text-xs'>
              <CheckCircle2 className='w-3.5 h-3.5' /> Structured Progression
            </span>
          </div>

          <p className='text-sm sm:text-base text-[#c0c0d0] leading-relaxed'>
            Every lesson follows a synchronized three-stage learning rhythm designed around cognitive load theory:
          </p>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-4 pt-2'>
            <div className='p-4 rounded-xl bg-[#0f0f17] border border-white/5 space-y-2'>
              <div className='text-xs font-bold text-[#58cc02] uppercase tracking-wider'>Step 1 • Vocabulary</div>
              <h3 className='font-bold text-white text-base'>Lexical Priming</h3>
              <p className='text-xs text-[#9a9aa8] leading-relaxed'>
                You study the ~25 target words first with kana, romaji toggle, and pitch-accent context before facing
                any grammar formulas.
              </p>
            </div>

            <div className='p-4 rounded-xl bg-[#0f0f17] border border-white/5 space-y-2'>
              <div className='text-xs font-bold text-[#1cb0f6] uppercase tracking-wider'>Step 2 • Grammar</div>
              <h3 className='font-bold text-white text-base'>Formulaic Understanding</h3>
              <p className='text-xs text-[#9a9aa8] leading-relaxed'>
                Breakdown of 3–5 core patterns with explicit slot-and-filler formulas, particle roles, and typical
                learner traps.
              </p>
            </div>

            <div className='p-4 rounded-xl bg-[#0f0f17] border border-white/5 space-y-2'>
              <div className='text-xs font-bold text-[#ce82ff] uppercase tracking-wider'>Step 3 • Practice</div>
              <h3 className='font-bold text-white text-base'>Cumulative Production</h3>
              <p className='text-xs text-[#9a9aa8] leading-relaxed'>
                Transformations and sentence completions strictly constrained to words you have already mastered in
                Lessons 1..N.
              </p>
            </div>
          </div>
        </section>

        {/* Pillar 2: Cumulative Vocabulary Constraint */}
        <section
          id='vocabulary'
          className='bento p-8 sm:p-10 space-y-6 mb-12'
          style={{ '--card-glow': 'rgba(28, 176, 246, 0.4)' } as React.CSSProperties}
        >
          <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/5 pb-6'>
            <div className='flex items-center gap-3.5'>
              <div className='w-12 h-12 rounded-xl bg-[#1cb0f6]/15 border border-[#1cb0f6]/30 flex items-center justify-center text-[#1cb0f6] shrink-0'>
                <ShieldCheck className='w-6 h-6' />
              </div>
              <div>
                <span className='text-xs uppercase font-extrabold text-[#1cb0f6] tracking-wider block'>Pillar 2</span>
                <h2 className='text-2xl font-display font-bold text-white'>The Cumulative Vocabulary Rule</h2>
              </div>
            </div>
            <span className='chip text-[#1cb0f6] text-xs'>Zero Out-of-Syllabus Words</span>
          </div>

          <p className='text-sm sm:text-base text-[#c0c0d0] leading-relaxed'>
            The #1 frustration in self-study is being tested on a grammar point like &quot;where someone is going&quot;
            (<code className='bg-[#181826] px-1.5 py-0.5 rounded text-[#58cc02]'>へいきます</code>) while simultaneously
            stumbling over an unfamiliar destination noun like &quot;embassy&quot; (
            <code className='bg-[#181826] px-1.5 py-0.5 rounded text-[#1cb0f6]'>たいしかん</code>).
          </p>

          <div className='p-4 rounded-xl bg-[#0f0f17] border border-white/5 flex items-center gap-3 text-xs sm:text-sm text-slate-200'>
            <CheckCircle2 className='w-5 h-5 text-[#58cc02] shrink-0' />
            <span>
              In NihongoFlow, any practice sentence in Lesson N is <strong>programmatically checked</strong> against a
              strict tag validator: it may <em>only</em> contain vocabulary introduced in Lessons 1..N.
            </span>
          </div>
        </section>

        {/* Pillar 3: 4-Quadrant SWOT Matrix */}
        <section
          id='swot'
          className='bento p-8 sm:p-10 space-y-6 mb-12'
          style={{ '--card-glow': 'rgba(255, 150, 0, 0.4)' } as React.CSSProperties}
        >
          <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/5 pb-6'>
            <div className='flex items-center gap-3.5'>
              <div className='w-12 h-12 rounded-xl bg-[#ff9600]/15 border border-[#ff9600]/30 flex items-center justify-center text-[#ff9600] shrink-0'>
                <Zap className='w-6 h-6' />
              </div>
              <div>
                <span className='text-xs uppercase font-extrabold text-[#ff9600] tracking-wider block'>Pillar 3</span>
                <h2 className='text-2xl font-display font-bold text-white'>4-Quadrant SWOT Diagnostics</h2>
              </div>
            </div>
            <span className='chip text-[#ff9600] text-xs'>Actionable Feedback</span>
          </div>

          <p className='text-sm sm:text-base text-[#c0c0d0] leading-relaxed'>
            Traditional quizzes tell you &quot;You got 70%—Great job!&quot; That is useless for learning. NihongoFlow
            decomposes every single response into diagnostic error tags and categorizes them into a 4-quadrant SWOT
            matrix:
          </p>

          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2'>
            <div className='p-4 rounded-xl bg-[#181826] border border-[#58cc02]/30 space-y-2'>
              <div className='flex items-center justify-between'>
                <span className='font-bold text-[#58cc02]'>Strengths (S)</span>
                <span className='chip text-[#58cc02] text-[10px]'>≥ 80% Accuracy</span>
              </div>
              <p className='text-xs text-[#9a9aa8]'>
                Grammar patterns and particles you have internalised. You don&apos;t need to waste time reviewing these
                right now.
              </p>
            </div>

            <div className='p-4 rounded-xl bg-[#181826] border border-[#1cb0f6]/30 space-y-2'>
              <div className='flex items-center justify-between'>
                <span className='font-bold text-[#1cb0f6]'>Opportunities (O)</span>
                <span className='chip text-[#1cb0f6] text-[10px]'>60% – 79% Accuracy</span>
              </div>
              <p className='text-xs text-[#9a9aa8]'>
                Near-mastery concepts. A few quick transformation reps will push these into solid instinctive memory.
              </p>
            </div>

            <div className='p-4 rounded-xl bg-[#181826] border border-[#ff4b4b]/30 space-y-2'>
              <div className='flex items-center justify-between'>
                <span className='font-bold text-[#ff4b4b]'>Weaknesses (W)</span>
                <span className='chip text-[#ff4b4b] text-[10px]'>&lt; 60% Accuracy</span>
              </div>
              <p className='text-xs text-[#9a9aa8]'>
                Critical confusion points (e.g. confusing topic particle は with subject particle が). Directly triggers
                targeted missions.
              </p>
            </div>

            <div className='p-4 rounded-xl bg-[#181826] border border-[#ff9600]/30 space-y-2'>
              <div className='flex items-center justify-between'>
                <span className='font-bold text-[#ff9600]'>Threats (T)</span>
                <span className='chip text-[#ff9600] text-[10px]'>&gt; 14 Days Idle</span>
              </div>
              <p className='text-xs text-[#9a9aa8]'>
                Older vocabulary items showing decay symptoms based on our Leitner interval calculator.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <div className='text-center py-10 space-y-5'>
          <h2 className='text-2xl sm:text-3xl font-display font-bold text-white'>
            Experience the Guided Loop for Yourself
          </h2>
          <div className='flex flex-col sm:flex-row items-center justify-center gap-4'>
            <Link href='/placement'>
              <Button variant='chunky' size='lg'>
                Take Free Placement Assessment 🦊
              </Button>
            </Link>
            <Link href='/register'>
              <Button variant='outline' size='lg' className='border-white/10 text-white'>
                Create Free Account
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
