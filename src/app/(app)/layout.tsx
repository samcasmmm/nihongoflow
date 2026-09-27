import React from 'react';
import { redirect } from 'next/navigation';
import { getSession } from '@/core/auth/session';
import Link from 'next/link';
import { LogOut, Flame, Trophy } from 'lucide-react';
import { SiteFooter } from '@/components/navigation/site-footer';

export default async function AppShellLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  return (
    <div className='min-h-screen bg-(--bg) text-(--text) flex flex-col font-sans'>
      {/* Top Bar / Navigation */}
      <header className='border-b border-white/5 bg-[#0a0a0f]/80 backdrop-blur-md sticky top-0 z-50'>
        <div className='w-full max-w-[92%] lg:max-w-[80%] mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between'>
          <div className='flex items-center gap-6'>
            <Link href='/dashboard' className='flex items-center gap-2 group'>
              <span className='text-3xl filter drop-shadow-[0_2px_8px_rgba(255,150,0,0.4)] transition-transform group-hover:scale-110 duration-150'>
                🦊
              </span>
              <div className='flex flex-col'>
                <span className='text-xl font-display font-extrabold tracking-tight text-white leading-none'>
                  Nihongo<span className='text-[#58cc02]'>Flow</span>
                </span>
                <span className='text-[9px] uppercase font-bold tracking-widest text-[#9a9aa8]'>
                  Master Japanese Naturally
                </span>
              </div>
            </Link>

            <nav className='hidden md:flex items-center gap-1 text-sm font-semibold text-[#9a9aa8]'>
              <Link href='/dashboard' className='px-3 py-1.5 rounded-xl hover:bg-white/5 text-white'>
                Dashboard
              </Link>
              <Link href='/placement' className='px-3 py-1.5 rounded-xl hover:bg-white/5 hover:text-white'>
                Placement
              </Link>
              <Link href='/methodology' className='px-3 py-1.5 rounded-xl hover:bg-white/5 hover:text-white'>
                Methodology
              </Link>
              <Link href='/faq' className='px-3 py-1.5 rounded-xl hover:bg-white/5 hover:text-white'>
                FAQ
              </Link>
            </nav>
          </div>

          <div className='flex items-center gap-4'>
            {/* Gamification chips from design.md §4 */}
            <div className='flex items-center gap-2'>
              <div className='chip'>
                <Flame className='w-3.5 h-3.5 text-[#ff9600] fill-[#ff9600]' />
                <span className='text-[#ff9600]'>0 Days</span>
              </div>
              <div className='chip'>
                <Trophy className='w-3.5 h-3.5 text-[#ce82ff]' />
                <span className='text-[#ce82ff]'>0 XP</span>
              </div>
            </div>

            {/* User Profile & Logout */}
            <div className='flex items-center gap-2 border-l border-white/10 pl-3'>
              <span className='text-xs text-[#9a9aa8] hidden sm:inline-block max-w-30 truncate font-medium'>
                {session.name || session.email}
              </span>
              <form action='/api/auth/logout' method='POST'>
                <button
                  type='submit'
                  className='p-2 rounded-xl text-[#9a9aa8] hover:text-white hover:bg-white/5 transition-colors cursor-pointer'
                  title='Sign out'
                >
                  <LogOut className='w-4 h-4' />
                </button>
              </form>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className='flex-1 w-full max-w-[92%] lg:max-w-[80%] mx-auto px-4 sm:px-6 lg:px-8 py-8'>{children}</main>

      {/* App Shell Footer */}
      <SiteFooter />
    </div>
  );
}
