import React from 'react';
import Link from 'next/link';

interface AuthCardProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export function AuthCard({ title, subtitle, children, footer }: AuthCardProps) {
  return (
    <div className='min-h-screen w-full flex items-center justify-center bg-(--bg) p-4 sm:p-6 lg:p-8 relative overflow-hidden'>
      {/* Decorative ambient glow orbs */}
      <div className='absolute top-1/4 -left-20 w-80 h-80 bg-[#58cc02]/10 rounded-full blur-3xl pointer-events-none' />
      <div className='absolute bottom-1/4 -right-20 w-96 h-96 bg-[#1cb0f6]/10 rounded-full blur-3xl pointer-events-none' />

      {/* Hero grid background */}
      <div className='absolute inset-0 hero-grid pointer-events-none' />

      <div className='w-full max-w-md relative z-10'>
        {/* Brand Header */}
        <div className='text-center mb-6'>
          <Link
            href='/'
            className='inline-flex items-center gap-2 group transition-transform duration-150 hover:scale-105'
          >
            <span className='text-4xl filter drop-shadow-[0_2px_8px_rgba(255,150,0,0.4)]'>🦊</span>
            <div className='flex flex-col text-left'>
              <span className='text-2xl font-display font-extrabold tracking-tight text-white leading-none'>
                Nihongo<span className='text-[#58cc02]'>Flow</span>
              </span>
              <span className='text-[10px] uppercase font-bold tracking-widest text-[#9a9aa8]'>
                Master Japanese Naturally
              </span>
            </div>
          </Link>
        </div>

        {/* Auth Panel */}
        <div
          className='bento p-6 sm:p-8 space-y-6 shadow-2xl'
          style={{ '--card-glow': 'rgba(88, 204, 2, 0.2)' } as React.CSSProperties}
        >
          <div>
            <h1 className='text-2xl font-display font-extrabold text-white tracking-tight'>{title}</h1>
            <p className='text-xs text-[#9a9aa8] mt-1'>{subtitle}</p>
          </div>

          {children}

          {footer && <div className='pt-4 border-t border-white/5 text-center text-xs text-[#9a9aa8]'>{footer}</div>}
        </div>

        <p className='text-center text-xs text-[#9a9aa8] mt-6'>Textbook sequence • Diagnostic SWOT feedback</p>
      </div>
    </div>
  );
}
