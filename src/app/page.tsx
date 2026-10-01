import { getSession } from '@/core/auth/session';
import { SiteHeader } from '@/components/navigation/site-header';
import { SiteFooter } from '@/components/navigation/site-footer';
import { HeroSection } from '@/components/landing/hero-section';
import { HowItWorksSection } from '@/components/landing/how-it-works-section';
import { InteractiveSandbox } from '@/components/landing/interactive-sandbox';
import { FeaturesSection } from '@/components/landing/features-section';
import { FinalCTASection } from '@/components/landing/final-cta-section';
import { SocialProofSection } from '@/components/landing/social-proof-section';

export default async function HomePage() {
  const session = await getSession();

  return (
    <div className='min-h-screen bg-(--bg) text-(--text) flex flex-col relative overflow-x-hidden selection:bg-[#58cc02]/30 selection:text-white'>
      {/* Detached Floating Island Nav */}
      <SiteHeader session={session} />

      <main className='flex-1 flex flex-col'>
        {/* Hero Section with Interactive 3-Tab Learning Studio */}
        <HeroSection session={session} />

        {/* Double-Bezel Social Proof Metrics */}
        <SocialProofSection />

        {/* The 3-Step Guided Loop (Vocab Priming → Grammar Slot → Practice) */}
        <HowItWorksSection />

        {/* Live Practice Telemetry Sandbox (Try a Japanese Question Right Now) */}
        <InteractiveSandbox />

        {/* Asymmetrical Bento Grid (SWOT Matrix, L1..N Guardrail, Non-Toxic Streaks, 50-Lesson Roadmap) */}
        <FeaturesSection />

        {/* Double-Bezel Final CTA Island */}
        <FinalCTASection session={session} />
      </main>

      <SiteFooter />
    </div>
  );
}
