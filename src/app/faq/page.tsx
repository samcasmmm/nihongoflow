import React from 'react';
import Link from 'next/link';
import { getSession } from '@/core/auth/session';
import { SiteHeader } from '@/components/navigation/site-header';
import { SiteFooter } from '@/components/navigation/site-footer';
import { Button } from '@/components/ui/button';
import { HelpCircle } from 'lucide-react';

export const metadata = {
  title: 'Frequently Asked Questions — NihongoFlow 🦊',
  description:
    'Find answers to common questions about NihongoFlow, our guided lesson loop, SWOT diagnostics, and original curriculum.',
};

const faqs = [
  {
    q: 'How does NihongoFlow compare to textbooks like Minna no Nihongo?',
    a: 'NihongoFlow uses the battle-tested lesson progression sequence of classic Japanese classroom syllabi (e.g. Lesson 1 introduces ~は~です, Lesson 2 introduces これ/それ/あれ, etc.). However, every sentence, vocabulary list, explanation, and visual asset is 100% original. Unlike static paper textbooks, NihongoFlow tags your mistakes, dynamically calculates your SWOT matrix, and prescribes targeted drills.',
  },
  {
    q: 'What makes the SWOT diagnostic report different from a standard score?',
    a: "Standard quizzes tell you '80% - Good Job' without explaining what failed. In NihongoFlow, if you translate a sentence incorrectly because of particle confusion, that failure is tagged under 'particle_wa_ga'. If your accuracy with that tag drops below 60%, it enters your Weaknesses quadrant and automatically generates a targeted 5-question mission to eliminate that specific blind spot.",
  },
  {
    q: 'Are all practice sentences and examples original?',
    a: 'Yes, 100%. We take intellectual property and pedagogical integrity seriously. None of our example sentences or dialogues are ported or copied from Minna no Nihongo, Genki, or any copyrighted textbook. All learning material is authored originally for NihongoFlow.',
  },
  {
    q: 'I already know some Japanese. Do I have to start at Lesson 1?',
    a: 'Not at all! We offer a free 6-question Diagnostic Placement Assessment. It tests kana, basic copula, demonstratives, location markers, and direction particles. Based on your performance, the engine recommends starting at Lesson 1 (Absolute Beginner), Lesson 2 (Basic Sentences), or Lesson 3+ (Elementary I). You can also manually adjust your starting level at any time.',
  },
  {
    q: "Are there paywalls, 'hearts/lives', or pay-to-skip mechanics?",
    a: 'No. We believe language learning requires psychological safety. We enforce zero dark patterns: no heart systems that lock you out when you make mistakes, no timers inducing panic during practice, no shaming emails if your streak breaks, and no pay-to-skip shortcuts.',
  },
  {
    q: 'How do streak freezes work?',
    a: 'Consistency matters, but life happens. NihongoFlow awards earned streak freezes that automatically activate if you miss a calendar day. Streak freezes protect your continuity without guilt or paid gimmicks.',
  },
  {
    q: 'Can I export or delete my learning data?',
    a: 'Yes. In accordance with GDPR and CCPA, you can export your entire profile, quiz history, flashcard progress, and error tags as a standard JSON file directly from your Account settings. You can also delete your account with one click, which immediately purges all database records.',
  },
];

export default async function FaqPage() {
  const session = await getSession();

  return (
    <div className='min-h-screen bg-(--bg) text-(--text) flex flex-col'>
      <SiteHeader session={session} />

      <main className='flex-1 w-full max-w-[92%] lg:max-w-[80%] mx-auto px-4 sm:px-6 lg:px-8 py-16'>
        {/* Header */}
        <div className='text-center max-w-2xl mx-auto space-y-4 mb-16'>
          <div className='inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#181826] border border-[#1cb0f6]/30 text-[#1cb0f6] text-xs font-bold'>
            <HelpCircle className='w-3.5 h-3.5' />
            <span>Clear Answers</span>
          </div>
          <h1 className='text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight'>
            Frequently Asked Questions
          </h1>
          <p className='text-sm sm:text-base text-[#9a9aa8] leading-relaxed'>
            Everything you need to know about NihongoFlow, our pedagogical methodology, diagnostic intelligence, and
            privacy commitments.
          </p>
        </div>

        {/* FAQ List */}
        <div className='space-y-4'>
          {faqs.map((faq, index) => (
            <div
              key={index}
              className='bento p-6 sm:p-7 space-y-3'
              style={{ '--card-glow': 'rgba(88, 204, 2, 0.25)' } as React.CSSProperties}
            >
              <h3 className='text-lg font-display font-bold text-white flex items-start gap-3'>
                <span className='text-[#58cc02] shrink-0 font-mono text-sm mt-0.5'>Q{index + 1}.</span>
                <span>{faq.q}</span>
              </h3>
              <p className='text-xs sm:text-sm text-[#c0c0d0] leading-relaxed pl-7'>{faq.a}</p>
            </div>
          ))}
        </div>

        {/* Contact prompt */}
        <div className='mt-14 p-6 sm:p-8 rounded-2xl bg-[#0f0f17] border border-white/5 text-center space-y-3'>
          <h3 className='text-lg font-display font-bold text-white'>Have a question not listed here?</h3>
          <p className='text-xs sm:text-sm text-[#9a9aa8]'>
            We love talking about language learning, curriculum structure, and app feedback.
          </p>
          <div className='pt-2'>
            <Link href='/contact'>
              <Button variant='chunky' size='default'>
                Get in Touch with Us 🦊
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
