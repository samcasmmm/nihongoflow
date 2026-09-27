import React from 'react';
import { getSession } from '@/core/auth/session';
import { SiteHeader } from '@/components/navigation/site-header';
import { SiteFooter } from '@/components/navigation/site-footer';
import { Shield, Lock, EyeOff, Download, Trash2, CheckCircle2 } from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy — NihongoFlow 🦊',
  description:
    'Learn how NihongoFlow protects your personal information, stores your learning data, and respects your privacy.',
};

export default async function PrivacyPage() {
  const session = await getSession();

  return (
    <div className='min-h-screen bg-(--bg) text-(--text) flex flex-col'>
      <SiteHeader session={session} />

      <main className='flex-1 w-full max-w-[92%] lg:max-w-[80%] mx-auto px-4 sm:px-6 lg:px-8 py-16'>
        {/* Header */}
        <div className='space-y-4 mb-12'>
          <div className='inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#181826] border border-[#58cc02]/30 text-[#58cc02] text-xs font-bold'>
            <Shield className='w-3.5 h-3.5' />
            <span>Learner-First Privacy</span>
          </div>
          <h1 className='text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight'>Privacy Policy</h1>
          <p className='text-sm sm:text-base text-[#9a9aa8] leading-relaxed'>
            Last updated: September 2026. At NihongoFlow, your learning journey is your personal endeavor. We collect
            only what is strictly required to teach you Japanese and assess your language fluency.
          </p>
        </div>

        {/* 3 Core Pillars Bento */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-12'>
          <div
            className='bento p-5 space-y-2'
            style={{ '--card-glow': 'rgba(88, 204, 2, 0.3)' } as React.CSSProperties}
          >
            <div className='w-9 h-9 rounded-lg bg-[#58cc02]/15 border border-[#58cc02]/30 flex items-center justify-center text-[#58cc02]'>
              <EyeOff className='w-5 h-5' />
            </div>
            <h3 className='font-bold text-white text-base'>Zero Ad Trackers</h3>
            <p className='text-xs text-[#9a9aa8] leading-relaxed'>
              We never sell your data, use third-party advertising tracking scripts, or build shadow profiles.
            </p>
          </div>

          <div
            className='bento p-5 space-y-2'
            style={{ '--card-glow': 'rgba(28, 176, 246, 0.3)' } as React.CSSProperties}
          >
            <div className='w-9 h-9 rounded-lg bg-[#1cb0f6]/15 border border-[#1cb0f6]/30 flex items-center justify-center text-[#1cb0f6]'>
              <Lock className='w-5 h-5' />
            </div>
            <h3 className='font-bold text-white text-base'>Modern Encryption</h3>
            <p className='text-xs text-[#9a9aa8] leading-relaxed'>
              Passwords are salted and hashed using Argon2/bcrypt. Sessions use encrypted HTTP-only JWT cookies.
            </p>
          </div>

          <div
            className='bento p-5 space-y-2'
            style={{ '--card-glow': 'rgba(206, 130, 255, 0.3)' } as React.CSSProperties}
          >
            <div className='w-9 h-9 rounded-lg bg-[#ce82ff]/15 border border-[#ce82ff]/30 flex items-center justify-center text-[#ce82ff]'>
              <Download className='w-5 h-5' />
            </div>
            <h3 className='font-bold text-white text-base'>Complete Ownership</h3>
            <p className='text-xs text-[#9a9aa8] leading-relaxed'>
              Export all your learning data in standard JSON or permanently delete your account in one click.
            </p>
          </div>
        </div>

        {/* Policy Body */}
        <div className='bento p-8 sm:p-10 space-y-8 text-sm leading-relaxed text-[#c0c0d0]'>
          <section className='space-y-3'>
            <h2 className='text-xl font-display font-bold text-white flex items-center gap-2'>
              <span className='text-[#58cc02]'>1.</span> Information We Collect
            </h2>
            <p>When you create an account and study with NihongoFlow, we store the following data:</p>
            <ul className='list-disc list-inside space-y-1.5 pl-2 text-xs sm:text-sm text-[#9a9aa8]'>
              <li>
                <strong className='text-white'>Account Information:</strong> Your email address, encrypted password
                hash, and optional display name.
              </li>
              <li>
                <strong className='text-white'>Learning Metrics & Progress:</strong> Completed lessons, flashcard
                Leitner box states, practice quiz answers, and timestamped XP/streak events.
              </li>
              <li>
                <strong className='text-white'>Diagnostic Error Tags:</strong> Specific pedagogical categories of
                incorrect answers (e.g.,{' '}
                <code className='bg-[#181826] px-1.5 py-0.5 rounded text-white text-xs'>particle_wa_ga</code>,{' '}
                <code className='bg-[#181826] px-1.5 py-0.5 rounded text-white text-xs'>te_form_conjugation</code>) used
                exclusively to construct your personal SWOT diagnostic report.
              </li>
            </ul>
          </section>

          <section className='space-y-3 pt-4 border-t border-white/5'>
            <h2 className='text-xl font-display font-bold text-white flex items-center gap-2'>
              <span className='text-[#58cc02]'>2.</span> How We Use Your Data
            </h2>
            <p>Your data is strictly utilized to operate the language learning engine:</p>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs'>
              <div className='p-3 rounded-lg bg-[#181826] border border-white/5 flex items-start gap-2'>
                <CheckCircle2 className='w-4 h-4 text-[#58cc02] shrink-0 mt-0.5' />
                <span>To compute your SWOT Strengths, Weaknesses, Opportunities, and Threats</span>
              </div>
              <div className='p-3 rounded-lg bg-[#181826] border border-white/5 flex items-start gap-2'>
                <CheckCircle2 className='w-4 h-4 text-[#58cc02] shrink-0 mt-0.5' />
                <span>To schedule spaced repetition intervals for Leitner flashcards</span>
              </div>
              <div className='p-3 rounded-lg bg-[#181826] border border-white/5 flex items-start gap-2'>
                <CheckCircle2 className='w-4 h-4 text-[#58cc02] shrink-0 mt-0.5' />
                <span>To auto-generate targeted weakness reinforcement missions</span>
              </div>
              <div className='p-3 rounded-lg bg-[#181826] border border-white/5 flex items-start gap-2'>
                <CheckCircle2 className='w-4 h-4 text-[#58cc02] shrink-0 mt-0.5' />
                <span>To authenticate your sessions securely without third-party trackers</span>
              </div>
            </div>
          </section>

          <section id='gdpr' className='space-y-3 pt-4 border-t border-white/5'>
            <h2 className='text-xl font-display font-bold text-white flex items-center gap-2'>
              <span className='text-[#58cc02]'>3.</span> Your Rights (GDPR & CCPA Compliance)
            </h2>
            <p>Regardless of your geographical location, we grant you full autonomy over your data:</p>
            <ul className='space-y-2 text-xs sm:text-sm pl-2'>
              <li className='flex items-start gap-2'>
                <Download className='w-4 h-4 text-[#1cb0f6] shrink-0 mt-0.5' />
                <span>
                  <strong className='text-white'>Right of Portability:</strong> You can export your entire profile, quiz
                  history, flashcard box counts, and diagnostic tag data as a machine-readable JSON file at any time
                  from your Account settings.
                </span>
              </li>
              <li className='flex items-start gap-2'>
                <Trash2 className='w-4 h-4 text-[#ff4b4b] shrink-0 mt-0.5' />
                <span>
                  <strong className='text-white'>Right of Erasure:</strong> You can permanently delete your account
                  directly through the application. Deletion immediately and irrevocably cascades across our PostgreSQL
                  database.
                </span>
              </li>
            </ul>
          </section>

          <section className='space-y-3 pt-4 border-t border-white/5'>
            <h2 className='text-xl font-display font-bold text-white flex items-center gap-2'>
              <span className='text-[#58cc02]'>4.</span> Cookies and Local Storage
            </h2>
            <p>
              We only use functional, secure, HTTP-only cookies necessary for session management and authentication
              (`auth_session`). We do not use third-party analytics cookies, advertising pixels, or cross-site tracking
              beacons.
            </p>
          </section>

          <section className='space-y-3 pt-4 border-t border-white/5'>
            <h2 className='text-xl font-display font-bold text-white flex items-center gap-2'>
              <span className='text-[#58cc02]'>5.</span> Contact Us
            </h2>
            <p>
              For privacy-related inquiries or requests, contact our data protection team at{' '}
              <a href='mailto:privacy@nihongoflow.com' className='text-[#58cc02] hover:underline font-semibold'>
                privacy@nihongoflow.com
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
