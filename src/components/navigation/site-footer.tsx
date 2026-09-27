import React from 'react';
import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';

export function SiteFooter() {
  return (
    <footer className='border-t border-white/5 bg-[#08080d] text-[#9a9aa8] text-sm relative mt-20'>
      {/* Top Subtle Accent Gradient */}
      <div className='absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-[#58cc02]/30 to-transparent' />

      <div className='w-full max-w-[92%] lg:max-w-[80%] mx-auto px-4 sm:px-6 lg:px-8 py-16'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10'>
          {/* Brand & Mascot Column (Spans 2 on large screens) */}
          <div className='lg:col-span-2 space-y-4'>
            <Link href='/' className='flex items-center gap-2.5 group'>
              <span className='text-3xl filter drop-shadow-[0_2px_8px_rgba(255,150,0,0.4)] transition-transform group-hover:scale-110 duration-150'>
                🦊
              </span>
              <div className='flex flex-col'>
                <span className='text-2xl font-display font-extrabold tracking-tight text-white flex items-center gap-0.5 leading-none'>
                  Nihongo<span className='text-[#58cc02]'>Flow</span>
                </span>
                <span className='text-[10px] uppercase font-bold tracking-widest text-[#9a9aa8]'>
                  Master Japanese Naturally
                </span>
              </div>
            </Link>

            <p className='text-xs sm:text-sm text-[#9a9aa8] max-w-sm leading-relaxed'>
              Textbook rigor engineered for modern digital learners. Experience guided cumulative practice, actionable
              SWOT diagnostics, and honest, server-authoritative progress.
            </p>

            {/* Status & Ethics Badges */}
            <div className='flex flex-wrap items-center gap-2 pt-2'>
              <div className='inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#181826] border border-white/10 text-[11px] text-emerald-400 font-semibold'>
                <span className='w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse' />
                All Systems Operational
              </div>
              <div className='inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#181826] border border-white/10 text-[11px] text-[#ce82ff] font-semibold'>
                <ShieldCheck className='w-3 h-3' />
                Zero Dark Patterns
              </div>
            </div>
          </div>

          {/* Column 2: Curriculum & Practice */}
          <div className='space-y-3'>
            <h4 className='text-xs uppercase font-extrabold tracking-wider text-white font-display'>Curriculum</h4>
            <ul className='space-y-2 text-xs'>
              <li>
                <Link href='/placement' className='hover:text-white transition-colors flex items-center gap-1'>
                  Placement Assessment
                  <span className='text-[9px] bg-[#58cc02]/20 text-[#58cc02] px-1.5 py-0.2 rounded font-bold'>New</span>
                </Link>
              </li>
              <li>
                <Link href='/methodology' className='hover:text-white transition-colors'>
                  Guided 3-Stage Stepper
                </Link>
              </li>
              <li>
                <Link href='/methodology#swot' className='hover:text-white transition-colors'>
                  SWOT Diagnostic Engine
                </Link>
              </li>
              <li>
                <Link href='/methodology#vocabulary' className='hover:text-white transition-colors'>
                  Cumulative Vocab Rule
                </Link>
              </li>
              <li>
                <Link href='/dashboard' className='hover:text-white transition-colors'>
                  Learner Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Resources & Pedagogy */}
          <div className='space-y-3'>
            <h4 className='text-xs uppercase font-extrabold tracking-wider text-white font-display'>Pedagogy</h4>
            <ul className='space-y-2 text-xs'>
              <li>
                <Link href='/methodology' className='hover:text-white transition-colors'>
                  Teaching Methodology
                </Link>
              </li>
              <li>
                <Link href='/faq' className='hover:text-white transition-colors'>
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link href='/terms#copyright' className='hover:text-white transition-colors'>
                  100% Original Content
                </Link>
              </li>
              <li>
                <Link href='/contact' className='hover:text-white transition-colors'>
                  Feedback & Errata
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Trust & Transparency */}
          <div className='space-y-3'>
            <h4 className='text-xs uppercase font-extrabold tracking-wider text-white font-display'>Transparency</h4>
            <ul className='space-y-2 text-xs'>
              <li>
                <Link href='/privacy' className='hover:text-white transition-colors'>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href='/terms' className='hover:text-white transition-colors'>
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href='/privacy#gdpr' className='hover:text-white transition-colors'>
                  Data Rights & GDPR
                </Link>
              </li>
              <li>
                <Link href='/contact' className='hover:text-white transition-colors'>
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className='mt-14 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs'>
          <div className='flex items-center gap-2 text-[#9a9aa8]'>
            <span>© {new Date().getFullYear()} NihongoFlow.</span>
            <span>All rights reserved.</span>
            <span className='hidden sm:inline'>•</span>
            <span className='hidden sm:inline text-slate-400'>Crafted with care for serious Japanese learners.</span>
          </div>

          <div className='flex items-center gap-5 text-xs'>
            <Link href='/privacy' className='hover:text-white transition-colors'>
              Privacy
            </Link>
            <Link href='/terms' className='hover:text-white transition-colors'>
              Terms
            </Link>
            <Link href='/faq' className='hover:text-white transition-colors'>
              FAQ
            </Link>
            <Link href='/contact' className='hover:text-white transition-colors'>
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
