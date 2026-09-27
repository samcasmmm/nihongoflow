import Link from 'next/link';
import { getSession } from '@/core/auth/session';
import { SiteHeader } from '@/components/navigation/site-header';
import { SiteFooter } from '@/components/navigation/site-footer';
import {
  ArrowRight,
  Flame,
  Zap,
  Sparkles,
  Layers,
  Compass,
  CheckCircle2,
  ShieldCheck,
  RotateCcw,
  Check,
  Clock,
  TrendingUp,
  Lock,
  Target,
  Activity,
  Volume2,
  CheckCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default async function HomePage() {
  const session = await getSession();

  return (
    <div className='min-h-screen bg-(--bg) text-(--text) flex flex-col relative overflow-x-hidden selection:bg-[#58cc02] selection:text-black'>
      {/* Top Navigation */}
      <SiteHeader session={session} />

      {/* Hero Section with Aurora, Grid & Meteors */}
      <main className='flex-1 flex flex-col justify-center relative'>
        {/* Layer 1: Atmospheric Aurora Glow */}
        <div className='absolute inset-0 hero-aurora pointer-events-none' />

        {/* Layer 2: Masked Radial Dot Grid */}
        <div className='absolute inset-0 hero-grid pointer-events-none' />

        {/* Layer 3: Faint Japanese Typographic Watermarks */}
        <div className='absolute inset-0 overflow-hidden pointer-events-none select-none'>
          <span className='absolute top-16 left-8 text-8xl font-display font-extrabold text-white/2'>狐</span>
          <span className='absolute top-44 right-12 text-9xl font-display font-extrabold text-white/2'>語</span>
          <span className='absolute bottom-20 left-1/4 text-8xl font-display font-extrabold text-white/1.5'>道</span>
          <span className='absolute bottom-32 right-1/4 text-8xl font-display font-extrabold text-white/2'>学</span>
        </div>

        <div className='w-full max-w-[92%] lg:max-w-[80%] mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24 text-center relative z-10'>
          {/* Mascot Tag */}
          <div className='inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#181826] border border-white/10 text-white text-xs font-bold mb-6 shadow-md'>
            <span>🦊</span>
            <span className='text-[#9a9aa8]'>Minna-style Syllabus • </span>
            <span className='text-[#58cc02] font-extrabold'>SWOT Diagnostic Feedback</span>
          </div>

          {/* Main Headline with one reserved glow-text */}
          <h1 className='text-4xl sm:text-6xl lg:text-7xl font-display font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight sm:leading-none'>
            Master Japanese through <br className='hidden sm:inline' />
            <span className='glow-text'>a proven guided loop</span>
          </h1>

          <p className='mt-6 text-base sm:text-lg text-[#9a9aa8] max-w-2xl mx-auto leading-relaxed font-sans'>
            Textbook structure meets playful confidence. Step through{' '}
            <strong className='text-white font-semibold'>Vocabulary → Grammar → Cumulative Practice</strong>, then get
            instant SWOT diagnostic feedback to know exactly what to practice next.
          </p>

          {/* CTA Buttons */}
          <div className='mt-10 flex flex-col sm:flex-row items-center justify-center gap-4'>
            <Link href={session ? '/dashboard' : '/register'}>
              <Button variant='chunky' size='lg' className='w-full sm:w-auto text-base'>
                {session ? 'Continue Study Flow 🦊' : 'Start Learning in < 3 Minutes 🦊'}
                <ArrowRight className='w-5 h-5 ml-2' />
              </Button>
            </Link>
            <Link href='/placement'>
              <Button variant='chunkyOutline' size='lg' className='w-full sm:w-auto text-base'>
                <Compass className='w-5 h-5 mr-2 text-[#1cb0f6]' />
                Take Placement Quiz
              </Button>
            </Link>
          </div>

          {/* Floating Stat Card Preview */}
          <div className='mt-14 max-w-md mx-auto'>
            <div className='float-card p-5 rounded-2xl bg-[#14141f]/95 border border-white/10 shadow-2xl backdrop-blur-xl text-left space-y-3'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-2.5'>
                  <span className='text-2xl'>🦊</span>
                  <div>
                    <span className='text-xs uppercase font-extrabold tracking-wider text-[#58cc02]'>
                      NihongoFlow Companion
                    </span>
                    <h3 className='text-sm font-bold text-white'>Daily Learning Routine</h3>
                  </div>
                </div>
                <div className='chip'>
                  <Flame className='w-3.5 h-3.5 text-[#ff9600] fill-[#ff9600]' />
                  <span>12 Days</span>
                </div>
              </div>

              {/* XP Progress Bar */}
              <div className='space-y-1.5 pt-1'>
                <div className='flex items-center justify-between text-xs'>
                  <span className='text-[#9a9aa8] font-medium'>Daily Goal (10 XP)</span>
                  <span className='text-white font-bold'>8 / 10 XP</span>
                </div>
                <div className='w-full h-2.5 rounded-full bg-[#181826] overflow-hidden p-0.5 border border-white/5'>
                  <div className='h-full rounded-full bg-linear-to-r from-[#58cc02] to-[#1cb0f6] w-[80%]' />
                </div>
              </div>

              <div className='pt-1 flex items-center justify-between text-[11px] text-[#9a9aa8] border-t border-white/5'>
                <span className='flex items-center gap-1 text-[#1cb0f6]'>
                  <Sparkles className='w-3 h-3' /> SWOT Diagnostic Active
                </span>
                <span className='text-emerald-400 font-semibold'>1 Freeze Available 🛡️</span>
              </div>
            </div>
          </div>

          {/* Bento Feature Grid (Reworked "Engineered for genuine fluency") */}
          <div className='mt-28 text-left'>
            <div className='text-center max-w-2xl mx-auto mb-14 space-y-2'>
              <span className='chip text-[#58cc02]'>
                <Sparkles className='w-3.5 h-3.5' />
                Pedagogical Architecture
              </span>
              <h2 className='text-3xl sm:text-5xl font-display font-extrabold text-white'>
                Engineered for genuine fluency
              </h2>
              <p className='text-sm text-[#9a9aa8]'>
                Every component is deliberately designed to turn textbook grammar into instinctual mastery.
              </p>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              {/* Card 1: Green Accent - Guided Curriculum Stepper */}
              <div
                className='bento p-6 sm:p-8 space-y-6 flex flex-col justify-between group'
                style={{ '--card-glow': 'rgba(88, 204, 2, 0.45)' } as React.CSSProperties}
              >
                <div className='space-y-4'>
                  <div className='flex items-start justify-between gap-4'>
                    <div className='flex items-center gap-3.5'>
                      <div className='w-12 h-12 rounded-2xl bg-[#58cc02]/15 border border-[#58cc02]/30 flex items-center justify-center text-[#58cc02] shadow-[0_0_20px_rgba(88,204,2,0.25)] transition-transform group-hover:scale-105 duration-200 shrink-0'>
                        <Layers className='w-6 h-6' />
                      </div>
                      <div>
                        <div className='flex items-center gap-2'>
                          <span className='text-[10px] uppercase font-extrabold text-[#58cc02] tracking-wider px-2 py-0.5 rounded-full bg-[#58cc02]/10 border border-[#58cc02]/20'>
                            Pedagogical Loop
                          </span>
                        </div>
                        <h3 className='text-xl sm:text-2xl font-display font-extrabold text-white mt-1'>
                          Cumulative Vocab & Grammar Stepper
                        </h3>
                      </div>
                    </div>
                    <span className='chip text-[#58cc02] text-[10px] hidden sm:inline-flex'>
                      <CheckCheck className='w-3 h-3' /> L1..N Constrained
                    </span>
                  </div>

                  <p className='text-xs sm:text-sm text-[#9a9aa8] leading-relaxed'>
                    Never stumble on unknown words while training grammar. Every practice sentence is tag-checked to use
                    only vocabulary from Lessons 1..N and grammar from Lesson N.
                  </p>
                </div>

                {/* Redesigned Visual Stepper Journey */}
                <div className='p-4 sm:p-5 rounded-2xl bg-[#0b0b12] border border-white/10 space-y-3.5 shadow-inner'>
                  <div className='flex items-center justify-between text-xs pb-2 border-b border-white/5'>
                    <div className='flex items-center gap-2'>
                      <span className='w-2 h-2 rounded-full bg-[#58cc02] animate-pulse' />
                      <span className='font-bold text-white text-xs'>Lesson 3 Guided Stepper</span>
                    </div>
                    <span className='text-[11px] font-bold text-[#58cc02] bg-[#58cc02]/10 px-2 py-0.5 rounded-full border border-[#58cc02]/20'>
                      Stage 3 of 4 Active
                    </span>
                  </div>

                  {/* Connected Step Pipeline */}
                  <div className='space-y-2.5 text-xs'>
                    {/* Stage 1: Vocab Priming */}
                    <div className='p-2.5 rounded-xl bg-[#141420] border border-[#58cc02]/30 flex items-center justify-between gap-3'>
                      <div className='flex items-center gap-2.5'>
                        <span className='w-5 h-5 rounded-full bg-[#58cc02]/20 text-[#58cc02] font-bold text-[10px] flex items-center justify-center'>
                          ✓
                        </span>
                        <div>
                          <div className='flex items-center gap-1.5'>
                            <span className='text-white font-bold'>語彙 Priming:</span>
                            <span className='text-emerald-300 font-semibold'>先生 【せんせい】</span>
                            <span className='text-[10px] text-[#9a9aa8] hidden sm:inline'>• Teacher</span>
                          </div>
                        </div>
                      </div>
                      <span className='text-[10px] text-[#9a9aa8] flex items-center gap-1 font-mono'>
                        <Volume2 className='w-3 h-3 text-[#58cc02]' /> Heiban [0]
                      </span>
                    </div>

                    {/* Connector */}
                    <div className='w-0.5 h-2 bg-linear-to-b from-[#58cc02] to-[#1cb0f6] ml-5' />

                    {/* Stage 2: Grammar Formula */}
                    <div className='p-2.5 rounded-xl bg-[#141420] border border-[#1cb0f6]/30 flex items-center justify-between gap-3'>
                      <div className='flex items-center gap-2.5'>
                        <span className='w-5 h-5 rounded-full bg-[#1cb0f6]/20 text-[#1cb0f6] font-bold text-[10px] flex items-center justify-center'>
                          ✓
                        </span>
                        <div className='flex items-center gap-1 font-mono text-[11px]'>
                          <span className='px-1.5 py-0.5 rounded bg-white/5 text-slate-300'>[ N₁ ]</span>
                          <span className='font-bold text-[#1cb0f6]'>は</span>
                          <span className='px-1.5 py-0.5 rounded bg-white/5 text-slate-300'>[ N₂ ]</span>
                          <span className='font-bold text-[#1cb0f6]'>です</span>
                        </div>
                      </div>
                      <span className='text-[10px] text-[#1cb0f6] font-bold'>Formulaic Mastery</span>
                    </div>

                    {/* Connector */}
                    <div className='w-0.5 h-2 bg-linear-to-b from-[#1cb0f6] to-[#58cc02] ml-5' />

                    {/* Stage 3: Cumulative Practice */}
                    <div className='p-3 rounded-xl bg-[#181828] border-2 border-[#58cc02] flex flex-col gap-1.5 shadow-[0_0_15px_rgba(88,204,2,0.15)]'>
                      <div className='flex items-center justify-between'>
                        <span className='text-[11px] uppercase font-extrabold text-[#58cc02] tracking-wider flex items-center gap-1'>
                          <Activity className='w-3 h-3' /> Active Cumulative Practice
                        </span>
                        <span className='text-[10px] font-mono text-[#58cc02] font-bold'>80% ACCURACY</span>
                      </div>
                      <div className='text-sm text-white font-medium pl-1'>
                        「 私は{' '}
                        <span className='text-[#58cc02] font-bold underline decoration-2 underline-offset-4'>先生</span>{' '}
                        です。」
                      </div>
                      <div className='flex items-center justify-between text-[10px] text-[#9a9aa8] pt-1 border-t border-white/5'>
                        <span className='text-emerald-400 flex items-center gap-1'>
                          <Check className='w-3 h-3' /> Tag check: Strictly L1..3 vocabulary only
                        </span>
                        <span className='text-white/60'>Next: SWOT Rollup →</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2: Blue Accent - 4-Quadrant SWOT Matrix */}
              <div
                className='bento p-6 sm:p-8 space-y-6 flex flex-col justify-between group'
                style={{ '--card-glow': 'rgba(28, 176, 246, 0.45)' } as React.CSSProperties}
              >
                <div className='space-y-4'>
                  <div className='flex items-start justify-between gap-4'>
                    <div className='flex items-center gap-3.5'>
                      <div className='w-12 h-12 rounded-2xl bg-[#1cb0f6]/15 border border-[#1cb0f6]/30 flex items-center justify-center text-[#1cb0f6] shadow-[0_0_20px_rgba(28,176,246,0.25)] transition-transform group-hover:scale-105 duration-200 shrink-0'>
                        <Zap className='w-6 h-6' />
                      </div>
                      <div>
                        <div className='flex items-center gap-2'>
                          <span className='text-[10px] uppercase font-extrabold text-[#1cb0f6] tracking-wider px-2 py-0.5 rounded-full bg-[#1cb0f6]/10 border border-[#1cb0f6]/20'>
                            Diagnostic Intelligence
                          </span>
                        </div>
                        <h3 className='text-xl sm:text-2xl font-display font-extrabold text-white mt-1'>
                          4-Quadrant SWOT Intelligence
                        </h3>
                      </div>
                    </div>
                    <span className='chip text-[#1cb0f6] text-[10px] hidden sm:inline-flex'>
                      <Target className='w-3 h-3' /> 34 Tags Tracked
                    </span>
                  </div>

                  <p className='text-xs sm:text-sm text-[#9a9aa8] leading-relaxed'>
                    A flat &quot;80%&quot; score is useless for learning. NihongoFlow decomposes every single response
                    into diagnostic error tags to construct your actionable SWOT matrix.
                  </p>
                </div>

                {/* Redesigned Tactical SWOT Matrix HUD */}
                <div className='p-4 sm:p-5 rounded-2xl bg-[#0b0b12] border border-white/10 space-y-3.5 shadow-inner'>
                  <div className='flex items-center justify-between text-xs pb-2 border-b border-white/5'>
                    <div className='flex items-center gap-2'>
                      <span className='w-2 h-2 rounded-full bg-[#1cb0f6] animate-pulse' />
                      <span className='font-bold text-white text-xs'>Live Telemetry Matrix</span>
                    </div>
                    <span className='text-[11px] font-mono text-[#1cb0f6]'>Config Thresholds: ≥80% / &lt;60%</span>
                  </div>

                  {/* 4 Distinct Quadrant Cells */}
                  <div className='grid grid-cols-2 gap-2.5 text-xs'>
                    {/* Strengths */}
                    <div className='p-3 rounded-xl bg-[#141420] border border-[#58cc02]/40 hover:border-[#58cc02] transition-colors space-y-1.5'>
                      <div className='flex items-center justify-between text-[#58cc02] font-extrabold text-[11px]'>
                        <span className='flex items-center gap-1'>
                          <span>STRENGTHS</span>
                        </span>
                        <span className='font-mono'>94%</span>
                      </div>
                      <p className='text-white font-semibold text-xs truncate'>は / を Particles</p>
                      <span className='text-[10px] text-emerald-400/80 block font-mono'>● Instinctive recall</span>
                    </div>

                    {/* Opportunities */}
                    <div className='p-3 rounded-xl bg-[#141420] border border-[#1cb0f6]/40 hover:border-[#1cb0f6] transition-colors space-y-1.5'>
                      <div className='flex items-center justify-between text-[#1cb0f6] font-extrabold text-[11px]'>
                        <span className='flex items-center gap-1'>
                          <span>OPPORTUNITIES</span>
                        </span>
                        <span className='font-mono'>76%</span>
                      </div>
                      <p className='text-white font-semibold text-xs truncate'>Past Tense (~ました)</p>
                      <span className='text-[10px] text-sky-400/80 block font-mono'>● 2 reviews to mastery</span>
                    </div>

                    {/* Weaknesses */}
                    <div className='p-3 rounded-xl bg-[#141420] border border-[#ff4b4b]/40 hover:border-[#ff4b4b] transition-colors space-y-1.5'>
                      <div className='flex items-center justify-between text-[#ff4b4b] font-extrabold text-[11px]'>
                        <span className='flex items-center gap-1'>
                          <span>WEAKNESSES</span>
                        </span>
                        <span className='font-mono'>42%</span>
                      </div>
                      <p className='text-white font-semibold text-xs truncate'>は vs が Distinction</p>
                      <span className='text-[10px] text-rose-400/80 block font-mono'>▲ Auto-drill triggered</span>
                    </div>

                    {/* Threats */}
                    <div className='p-3 rounded-xl bg-[#141420] border border-[#ff9600]/40 hover:border-[#ff9600] transition-colors space-y-1.5'>
                      <div className='flex items-center justify-between text-[#ff9600] font-extrabold text-[11px]'>
                        <span className='flex items-center gap-1'>
                          <span>THREATS</span>
                        </span>
                        <Clock className='w-3 h-3' />
                      </div>
                      <p className='text-white font-semibold text-xs truncate'>L1 Vocab Recall</p>
                      <span className='text-[10px] text-amber-400/80 block font-mono'>▼ 14-day decay scheduled</span>
                    </div>
                  </div>

                  <div className='pt-1 flex items-center justify-between text-[11px] text-[#9a9aa8] border-t border-white/5'>
                    <span className='text-slate-300 flex items-center gap-1'>
                      <TrendingUp className='w-3.5 h-3.5 text-[#1cb0f6]' /> Automated SWOT Rollup per session
                    </span>
                    <span className='text-[#1cb0f6] font-semibold'>Zero Guesswork</span>
                  </div>
                </div>
              </div>

              {/* Card 3: Orange Accent - Targeted Weakness Missions */}
              <div
                className='bento p-6 sm:p-8 space-y-6 flex flex-col justify-between group'
                style={{ '--card-glow': 'rgba(255, 150, 0, 0.45)' } as React.CSSProperties}
              >
                <div className='space-y-4'>
                  <div className='flex items-start justify-between gap-4'>
                    <div className='flex items-center gap-3.5'>
                      <div className='w-12 h-12 rounded-2xl bg-[#ff9600]/15 border border-[#ff9600]/30 flex items-center justify-center text-[#ff9600] shadow-[0_0_20px_rgba(255,150,0,0.25)] transition-transform group-hover:scale-105 duration-200 shrink-0'>
                        <RotateCcw className='w-6 h-6' />
                      </div>
                      <div>
                        <div className='flex items-center gap-2'>
                          <span className='text-[10px] uppercase font-extrabold text-[#ff9600] tracking-wider px-2 py-0.5 rounded-full bg-[#ff9600]/10 border border-[#ff9600]/20'>
                            Surgical Drills
                          </span>
                        </div>
                        <h3 className='text-xl sm:text-2xl font-display font-extrabold text-white mt-1'>
                          Targeted Weakness Missions
                        </h3>
                      </div>
                    </div>
                    <span className='chip text-[#ff9600] text-[10px] hidden sm:inline-flex'>Auto-Resolves at 80%</span>
                  </div>

                  <p className='text-xs sm:text-sm text-[#9a9aa8] leading-relaxed'>
                    Identified a blind spot? NihongoFlow doesn&apos;t repeat the whole textbook. It auto-generates
                    surgical 5-question missions that clear as soon as your accuracy recovers.
                  </p>
                </div>

                {/* Redesigned Tactical Drill Terminal */}
                <div className='p-4 sm:p-5 rounded-2xl bg-[#0b0b12] border border-white/10 space-y-3.5 shadow-inner'>
                  <div className='flex items-center justify-between text-xs pb-2 border-b border-white/5'>
                    <div className='flex items-center gap-2'>
                      <span className='w-2 h-2 rounded-full bg-[#ff9600] animate-pulse' />
                      <span className='font-mono text-white text-xs font-bold'>DRILL #042 // WA_GA_CONFUSION</span>
                    </div>
                    <span className='text-[10px] font-bold text-[#ff9600] bg-[#ff9600]/10 px-2 py-0.5 rounded-full border border-[#ff9600]/20'>
                      Active Drill
                    </span>
                  </div>

                  {/* Interactive Question Card Mockup */}
                  <div className='p-3.5 rounded-xl bg-[#141420] border border-white/10 space-y-3'>
                    <div className='flex items-center justify-between text-[11px] text-[#9a9aa8]'>
                      <span>Complete the question sentence:</span>
                      <span className='text-[#ff9600] font-mono font-bold'>Target Tag: particle_wa_ga</span>
                    </div>

                    <div className='text-base sm:text-lg text-white font-medium pl-1 tracking-wide'>
                      だれ（{' '}
                      <span className='px-2.5 py-0.5 rounded bg-[#ff9600]/20 text-[#ff9600] font-bold border border-[#ff9600]/40'>
                        が
                      </span>{' '}
                      ）先生ですか。
                    </div>

                    {/* Interactive Choices */}
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs'>
                      <div className='p-2 rounded-lg bg-red-950/20 border border-red-500/20 text-neutral-400 flex items-center justify-between'>
                        <span className='line-through text-[11px]'>[ A ] は (Topic marker)</span>
                        <span className='text-[10px] text-red-400 font-bold'>❌ Invalid</span>
                      </div>
                      <div className='p-2 rounded-lg bg-[#58cc02]/20 border border-[#58cc02]/60 text-white flex items-center justify-between shadow-[0_0_10px_rgba(88,204,2,0.2)]'>
                        <span className='font-bold text-[11px]'>[ B ] が (Subject marker)</span>
                        <span className='text-[10px] text-emerald-400 font-bold'>✓ Correct</span>
                      </div>
                    </div>
                  </div>

                  {/* Progress & Resolution Meter */}
                  <div className='space-y-1.5 pt-1'>
                    <div className='flex items-center justify-between text-xs'>
                      <span className='text-[#9a9aa8]'>Mission Progress: 4 / 5 Correct</span>
                      <span className='text-[#58cc02] font-mono font-bold'>80% Threshold Met</span>
                    </div>
                    <div className='w-full h-2 rounded-full bg-[#181828] overflow-hidden p-0.5 border border-white/5'>
                      <div className='h-full rounded-full bg-linear-to-r from-[#ff9600] via-[#58cc02] to-[#58cc02] w-[80%]' />
                    </div>
                    <div className='flex items-center justify-between text-[10px] text-emerald-400 pt-1'>
                      <span className='flex items-center gap-1 font-semibold'>
                        <Check className='w-3 h-3' /> Clears automatically when tag exits Weaknesses
                      </span>
                      <span className='text-white/60'>+25 XP</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 4: Purple Accent - Server-Authoritative & Zero Dark Patterns */}
              <div
                className='bento p-6 sm:p-8 space-y-6 flex flex-col justify-between group'
                style={{ '--card-glow': 'rgba(206, 130, 255, 0.45)' } as React.CSSProperties}
              >
                <div className='space-y-4'>
                  <div className='flex items-start justify-between gap-4'>
                    <div className='flex items-center gap-3.5'>
                      <div className='w-12 h-12 rounded-2xl bg-[#ce82ff]/15 border border-[#ce82ff]/30 flex items-center justify-center text-[#ce82ff] shadow-[0_0_20px_rgba(206,130,255,0.25)] transition-transform group-hover:scale-105 duration-200 shrink-0'>
                        <ShieldCheck className='w-6 h-6' />
                      </div>
                      <div>
                        <div className='flex items-center gap-2'>
                          <span className='text-[10px] uppercase font-extrabold text-[#ce82ff] tracking-wider px-2 py-0.5 rounded-full bg-[#ce82ff]/10 border border-[#ce82ff]/20'>
                            Ethical Pedagogy
                          </span>
                        </div>
                        <h3 className='text-xl sm:text-2xl font-display font-extrabold text-white mt-1'>
                          Honest Effort & Zero Dark Patterns
                        </h3>
                      </div>
                    </div>
                    <span className='chip text-[#ce82ff] text-[10px] hidden sm:inline-flex'>
                      <Lock className='w-3 h-3' /> Server-Authoritative
                    </span>
                  </div>

                  <p className='text-xs sm:text-sm text-[#9a9aa8] leading-relaxed'>
                    No timer anxiety, no guilt-trip shaming emails, and no pay-to-skip shortcuts. XP and streaks are
                    strictly server-computed to reward genuine, sustainable language acquisition.
                  </p>
                </div>

                {/* Redesigned Learner Protection Console */}
                <div className='p-4 sm:p-5 rounded-2xl bg-[#0b0b12] border border-white/10 space-y-3.5 shadow-inner'>
                  <div className='flex items-center justify-between text-xs pb-2 border-b border-white/5'>
                    <div className='flex items-center gap-2'>
                      <Flame className='w-4 h-4 text-[#ff9600] fill-[#ff9600]' />
                      <span className='font-bold text-white text-xs'>14-Day Honest Streak</span>
                    </div>
                    <span className='text-[11px] text-[#58cc02] bg-[#58cc02]/10 px-2 py-0.5 rounded-full font-semibold border border-[#58cc02]/20'>
                      🛡️ 1 Freeze Ready
                    </span>
                    <span className='text-[11px] text-[#ce82ff] font-semibold'>Level 3 Novice</span>
                  </div>

                  {/* 4 Ethical Guarantee Cards */}
                  <div className='grid grid-cols-2 gap-2 text-xs text-slate-200'>
                    <div className='p-2.5 rounded-xl bg-[#141420] border border-white/5 flex items-start gap-2'>
                      <CheckCircle2 className='w-4 h-4 text-[#58cc02] shrink-0 mt-0.5' />
                      <div>
                        <span className='font-bold text-white text-[11px] block'>Untimed Practice</span>
                        <span className='text-[10px] text-[#9a9aa8]'>No speed panic</span>
                      </div>
                    </div>

                    <div className='p-2.5 rounded-xl bg-[#141420] border border-white/5 flex items-start gap-2'>
                      <CheckCircle2 className='w-4 h-4 text-[#58cc02] shrink-0 mt-0.5' />
                      <div>
                        <span className='font-bold text-white text-[11px] block'>No Guilt Copy</span>
                        <span className='text-[10px] text-[#9a9aa8]'>Warm welcomes only</span>
                      </div>
                    </div>

                    <div className='p-2.5 rounded-xl bg-[#141420] border border-white/5 flex items-start gap-2'>
                      <CheckCircle2 className='w-4 h-4 text-[#58cc02] shrink-0 mt-0.5' />
                      <div>
                        <span className='font-bold text-white text-[11px] block'>Zero Pay-to-Skip</span>
                        <span className='text-[10px] text-[#9a9aa8]'>Honest milestones</span>
                      </div>
                    </div>

                    <div className='p-2.5 rounded-xl bg-[#141420] border border-white/5 flex items-start gap-2'>
                      <CheckCircle2 className='w-4 h-4 text-[#58cc02] shrink-0 mt-0.5' />
                      <div>
                        <span className='font-bold text-white text-[11px] block'>100% Original</span>
                        <span className='text-[10px] text-[#9a9aa8]'>Zero textbook piracy</span>
                      </div>
                    </div>
                  </div>

                  <div className='pt-1 flex items-center justify-between text-[11px] text-[#9a9aa8] border-t border-white/5'>
                    <span className='text-[#ce82ff] font-semibold flex items-center gap-1.5'>
                      <ShieldCheck className='w-3.5 h-3.5' /> Server-Validated Cryptographic State
                    </span>
                    <span className='text-slate-400'>Anti-Cheat Engine</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Rich Multi-Column Footer */}
      <SiteFooter />
    </div>
  );
}
