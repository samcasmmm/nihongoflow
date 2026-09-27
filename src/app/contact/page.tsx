import React from 'react';
import Link from 'next/link';
import { getSession } from '@/core/auth/session';
import { SiteHeader } from '@/components/navigation/site-header';
import { SiteFooter } from '@/components/navigation/site-footer';
import { Button } from '@/components/ui/button';
import { Mail, MessageSquare, Send, HelpCircle } from 'lucide-react';

export const metadata = {
  title: 'Contact & Support — NihongoFlow 🦊',
  description: 'Get in touch with the NihongoFlow team for support, feature suggestions, or pedagogical feedback.',
};

export default async function ContactPage() {
  const session = await getSession();

  return (
    <div className='min-h-screen bg-(--bg) text-(--text) flex flex-col'>
      <SiteHeader session={session} />

      <main className='flex-1 w-full max-w-[92%] lg:max-w-[80%] mx-auto px-4 sm:px-6 lg:px-8 py-16'>
        {/* Header */}
        <div className='text-center max-w-2xl mx-auto space-y-4 mb-14'>
          <div className='inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#181826] border border-[#58cc02]/30 text-[#58cc02] text-xs font-bold'>
            <MessageSquare className='w-3.5 h-3.5' />
            <span>Learner Support</span>
          </div>
          <h1 className='text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight'>
            We&apos;re Here to Help
          </h1>
          <p className='text-sm sm:text-base text-[#9a9aa8] leading-relaxed'>
            Have a question about a grammar explanation, found a typo in an example sentence, or have an idea to make
            NihongoFlow better? Drop us a note.
          </p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          {/* Direct Channels */}
          <div className='space-y-4 md:col-span-1'>
            <div
              className='bento p-5 space-y-3'
              style={{ '--card-glow': 'rgba(88, 204, 2, 0.3)' } as React.CSSProperties}
            >
              <div className='w-10 h-10 rounded-xl bg-[#58cc02]/15 border border-[#58cc02]/30 flex items-center justify-center text-[#58cc02]'>
                <Mail className='w-5 h-5' />
              </div>
              <h3 className='font-bold text-white text-base'>Direct Email</h3>
              <p className='text-xs text-[#9a9aa8] leading-relaxed'>General questions, pedagogy inquiries & support:</p>
              <a
                href='mailto:support@nihongoflow.com'
                className='text-xs font-semibold text-[#58cc02] hover:underline block truncate'
              >
                support@nihongoflow.com
              </a>
            </div>

            <div
              className='bento p-5 space-y-3'
              style={{ '--card-glow': 'rgba(28, 176, 246, 0.3)' } as React.CSSProperties}
            >
              <div className='w-10 h-10 rounded-xl bg-[#1cb0f6]/15 border border-[#1cb0f6]/30 flex items-center justify-center text-[#1cb0f6]'>
                <HelpCircle className='w-5 h-5' />
              </div>
              <h3 className='font-bold text-white text-base'>Instant FAQ</h3>
              <p className='text-xs text-[#9a9aa8] leading-relaxed'>
                Looking for answers about placement tests, dark pattern promises, or original content?
              </p>
              <Link href='/faq' className='text-xs font-semibold text-[#1cb0f6] hover:underline block'>
                Browse FAQ section →
              </Link>
            </div>
          </div>

          {/* Feedback Form Card */}
          <div
            className='bento md:col-span-2 p-6 sm:p-8 space-y-6'
            style={{ '--card-glow': 'rgba(206, 130, 255, 0.3)' } as React.CSSProperties}
          >
            <div>
              <h3 className='text-xl font-display font-bold text-white'>Send a Message</h3>
              <p className='text-xs text-[#9a9aa8] mt-1'>We typically reply within 24 business hours.</p>
            </div>

            <form onSubmit={undefined} className='space-y-4'>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <div className='space-y-1.5'>
                  <label htmlFor='contact-name' className='text-xs font-semibold text-white'>
                    Your Name
                  </label>
                  <input
                    id='contact-name'
                    type='text'
                    defaultValue={session?.name || ''}
                    placeholder='Kenji / Sarah'
                    className='w-full px-3.5 py-2.5 rounded-xl bg-[#0f0f17] border border-white/10 text-white text-xs placeholder:text-neutral-500 focus:outline-none focus:border-[#58cc02] transition-colors'
                  />
                </div>

                <div className='space-y-1.5'>
                  <label htmlFor='contact-email' className='text-xs font-semibold text-white'>
                    Email Address
                  </label>
                  <input
                    id='contact-email'
                    type='email'
                    defaultValue={session?.email || ''}
                    placeholder='you@example.com'
                    required
                    className='w-full px-3.5 py-2.5 rounded-xl bg-[#0f0f17] border border-white/10 text-white text-xs placeholder:text-neutral-500 focus:outline-none focus:border-[#58cc02] transition-colors'
                  />
                </div>
              </div>

              <div className='space-y-1.5'>
                <label htmlFor='contact-subject' className='text-xs font-semibold text-white'>
                  Topic / Category
                </label>
                <select
                  id='contact-subject'
                  className='w-full px-3.5 py-2.5 rounded-xl bg-[#0f0f17] border border-white/10 text-white text-xs focus:outline-none focus:border-[#58cc02] transition-colors'
                >
                  <option value='pedagogy'>Pedagogy / Sentence Errata Report</option>
                  <option value='swot'>SWOT Diagnostics / Bug Report</option>
                  <option value='account'>Account / Login Support</option>
                  <option value='feature'>Feature Suggestion</option>
                  <option value='other'>Other Inquiry</option>
                </select>
              </div>

              <div className='space-y-1.5'>
                <label htmlFor='contact-message' className='text-xs font-semibold text-white'>
                  Message
                </label>
                <textarea
                  id='contact-message'
                  rows={4}
                  required
                  placeholder="Tell us what's on your mind or how we can help..."
                  className='w-full px-3.5 py-2.5 rounded-xl bg-[#0f0f17] border border-white/10 text-white text-xs placeholder:text-neutral-500 focus:outline-none focus:border-[#58cc02] transition-colors resize-none'
                />
              </div>

              <Button type='button' variant='chunky' size='default' className='w-full sm:w-auto' onClick={undefined}>
                <Send className='w-4 h-4 mr-2' />
                Submit Message 🦊
              </Button>
            </form>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
