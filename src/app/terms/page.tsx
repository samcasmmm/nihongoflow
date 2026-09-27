import React from 'react';
import { getSession } from '@/core/auth/session';
import { SiteHeader } from '@/components/navigation/site-header';
import { SiteFooter } from '@/components/navigation/site-footer';
import { FileText, Sparkles } from 'lucide-react';

export const metadata = {
  title: 'Terms of Service — NihongoFlow 🦊',
  description: 'Read the NihongoFlow terms of service, acceptable use guidelines, and content copyright statements.',
};

export default async function TermsPage() {
  const session = await getSession();

  return (
    <div className='min-h-screen bg-(--bg) text-(--text) flex flex-col'>
      <SiteHeader session={session} />

      <main className='flex-1 w-full max-w-[92%] lg:max-w-[80%] mx-auto px-4 sm:px-6 lg:px-8 py-16'>
        {/* Header */}
        <div className='space-y-4 mb-12'>
          <div className='inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#181826] border border-[#1cb0f6]/30 text-[#1cb0f6] text-xs font-bold'>
            <FileText className='w-3.5 h-3.5' />
            <span>Service Agreement</span>
          </div>
          <h1 className='text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight'>
            Terms of Service
          </h1>
          <p className='text-sm sm:text-base text-[#9a9aa8] leading-relaxed'>
            Effective Date: September 2026. By accessing or using NihongoFlow, you agree to be bound by these Terms of
            Service.
          </p>
        </div>

        {/* Content & Copyright Highlights */}
        <div
          className='bento p-6 sm:p-8 space-y-4 mb-12 border-[#58cc02]/30'
          style={{ '--card-glow': 'rgba(88, 204, 2, 0.3)' } as React.CSSProperties}
        >
          <div className='flex items-center gap-3'>
            <div className='w-10 h-10 rounded-xl bg-[#58cc02]/15 border border-[#58cc02]/30 flex items-center justify-center text-[#58cc02]'>
              <Sparkles className='w-5 h-5' />
            </div>
            <div>
              <h3 className='text-lg font-display font-bold text-white'>Original Content Guarantee</h3>
              <p className='text-xs text-[#9a9aa8]'>
                Respecting intellectual property with original pedagogical material
              </p>
            </div>
          </div>
          <p className='text-xs sm:text-sm text-[#c0c0d0] leading-relaxed'>
            All example sentences, grammar pattern descriptions, illustrations, practice exercises, and diagnostic tags
            on NihongoFlow are <strong>100% original works</strong> created specifically for this platform. While our
            guided progression sequence references standardized modern Japanese syllabi (such as JLPT N5/N4 levels), no
            copyrighted text, dialogues, or illustrations are reproduced from third-party textbooks.
          </p>
        </div>

        {/* Terms Sections */}
        <div className='bento p-8 sm:p-10 space-y-8 text-sm leading-relaxed text-[#c0c0d0]'>
          <section className='space-y-3'>
            <h2 className='text-xl font-display font-bold text-white flex items-center gap-2'>
              <span className='text-[#1cb0f6]'>1.</span> Acceptance of Terms
            </h2>
            <p>
              By creating an account or accessing any part of NihongoFlow (&quot;the Service&quot;), you acknowledge
              that you have read, understood, and agree to be bound by these Terms. If you do not agree, you must
              discontinue using the platform.
            </p>
          </section>

          <section className='space-y-3 pt-4 border-t border-white/5'>
            <h2 className='text-xl font-display font-bold text-white flex items-center gap-2'>
              <span className='text-[#1cb0f6]'>2.</span> Account Registration & Security
            </h2>
            <p>
              When creating an account, you must provide valid credentials. You are solely responsible for maintaining
              the confidentiality of your account credentials and password. NihongoFlow reserves the right to terminate
              accounts that attempt to bypass authentication or engage in unauthorized scraping.
            </p>
          </section>

          <section className='space-y-3 pt-4 border-t border-white/5'>
            <h2 className='text-xl font-display font-bold text-white flex items-center gap-2'>
              <span className='text-[#1cb0f6]'>3.</span> Server-Authoritative Gamification
            </h2>
            <p>To maintain the integrity of our diagnostic SWOT engine and ensure meaningful educational progress:</p>
            <ul className='list-disc list-inside space-y-1.5 pl-2 text-xs sm:text-sm text-[#9a9aa8]'>
              <li>
                XP, streaks, and mission progress are server-authoritative and calculated from genuine completed events.
              </li>
              <li>
                Repeatedly brute-forcing answer submissions or using client-side automated bots to farm XP is prohibited
                and will result in metric rollbacks.
              </li>
              <li>
                Streak freezes are provided as an educational buffer for real-world life interruptions, not as a
                speculative currency.
              </li>
            </ul>
          </section>

          <section id='copyright' className='space-y-3 pt-4 border-t border-white/5'>
            <h2 className='text-xl font-display font-bold text-white flex items-center gap-2'>
              <span className='text-[#1cb0f6]'>4.</span> Intellectual Property Rights
            </h2>
            <p>
              The code, UI components, animations, character designs (including our fox mascot 🦊), audio clips, and
              exercise sentence banks are the intellectual property of NihongoFlow. You are granted a personal,
              revocable, non-transferable license to use the platform for personal language learning purposes.
            </p>
          </section>

          <section className='space-y-3 pt-4 border-t border-white/5'>
            <h2 className='text-xl font-display font-bold text-white flex items-center gap-2'>
              <span className='text-[#1cb0f6]'>5.</span> Limitation of Liability
            </h2>
            <p>
              NihongoFlow is provided on an &quot;as is&quot; and &quot;as available&quot; basis without warranties of
              any kind. While our curriculum is engineered according to established second-language acquisition
              principles, we make no guarantees regarding official JLPT test scores or employment qualifications.
            </p>
          </section>

          <section className='space-y-3 pt-4 border-t border-white/5'>
            <h2 className='text-xl font-display font-bold text-white flex items-center gap-2'>
              <span className='text-[#1cb0f6]'>6.</span> Contact
            </h2>
            <p>
              Questions regarding these Terms should be directed to{' '}
              <a href='mailto:legal@nihongoflow.com' className='text-[#1cb0f6] hover:underline font-semibold'>
                legal@nihongoflow.com
              </a>
              .
            </p>
          </section>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
