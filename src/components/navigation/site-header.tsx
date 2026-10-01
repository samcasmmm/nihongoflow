"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowRight,
  BookOpen,
  Compass,
  HelpCircle,
  Shield,
  Sparkles,
} from "lucide-react";
import type { SessionPayload } from "@/core/auth/session";

interface SiteHeaderProps {
  session?: SessionPayload | null;
}

export function SiteHeader({ session }: SiteHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { href: "/methodology", label: "Methodology", icon: BookOpen },
    { href: "/placement", label: "Placement Test", icon: Compass },
    { href: "/faq", label: "FAQ", icon: HelpCircle },
    { href: "/privacy", label: "Transparency", icon: Shield },
  ];

  return (
    <>
      {/* Floating Island Nav — detached from top with rounded-full pill design */}
      <header className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-5 px-4 pointer-events-none">
        <nav className="pointer-events-auto w-full max-w-4xl bg-[#08080f]/80 backdrop-blur-2xl border border-white/10 rounded-full px-5 h-14 flex items-center justify-between shadow-[0_16px_40px_-10px_rgba(0,0,0,0.8),inset_0_1px_1px_0_rgba(255,255,255,0.12)]">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <span className="text-xl filter drop-shadow-[0_2px_10px_rgba(255,150,0,0.4)] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110">
              🦊
            </span>
            <span className="text-[17px] font-display font-extrabold tracking-tight text-white leading-none">
              Nihongo<span className="text-[#58cc02]">Flow</span>
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-1 text-[13px] font-medium text-[#9a9aa8]">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3.5 py-1.5 rounded-full transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    isActive
                      ? "text-white bg-white/10 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)]"
                      : "hover:text-white hover:bg-white/[0.05]"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Desktop Actions */}
          <div className="hidden sm:flex items-center gap-3 shrink-0">
            {session ? (
              <Link href="/dashboard" className="group">
                <span className="island-btn-primary !py-1.5 !px-4 !text-xs !gap-2">
                  <span>Dashboard</span>
                  <span className="island-icon-bubble !w-6 !h-6">
                    <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />
                  </span>
                </span>
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-[13px] font-medium text-[#9a9aa8] hover:text-white transition-colors px-3 py-1.5"
                >
                  Sign In
                </Link>
                <Link href="/register" className="group">
                  <span className="island-btn-primary !py-1.5 !px-4 !text-xs !gap-2">
                    <span>Start Free</span>
                    <span className="island-icon-bubble !w-6 !h-6">
                      <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />
                    </span>
                  </span>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger Morph */}
          <div className="flex sm:hidden items-center gap-2">
            {session && (
              <Link
                href="/dashboard"
                className="text-xs font-bold text-white px-3 py-1.5 rounded-full bg-white/10"
              >
                App
              </Link>
            )}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-full text-[#9a9aa8] hover:text-white transition-colors focus:outline-none"
              aria-label="Toggle menu"
            >
              <div className="relative w-5 h-5">
                <span
                  className={`absolute left-0 h-[2px] w-5 bg-current rounded-full transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    mobileMenuOpen
                      ? "top-[9px] rotate-45"
                      : "top-[3px] rotate-0"
                  }`}
                />
                <span
                  className={`absolute left-0 top-[9px] h-[2px] w-5 bg-current rounded-full transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    mobileMenuOpen ? "opacity-0 scale-x-0" : "opacity-100"
                  }`}
                />
                <span
                  className={`absolute left-0 h-[2px] w-5 bg-current rounded-full transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    mobileMenuOpen
                      ? "top-[9px] -rotate-45"
                      : "top-[15px] rotate-0"
                  }`}
                />
              </div>
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Glass Full-Screen Overlay with Staggered Link Reveals */}
      <div
        className={`fixed inset-0 z-40 sm:hidden transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          mobileMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="absolute inset-0 bg-[#08080f]/95 backdrop-blur-3xl" />
        <div className="relative z-10 flex flex-col items-center justify-center h-full gap-3 px-8">
          <div className="mb-6 text-center">
            <span className="text-4xl filter drop-shadow-[0_4px_16px_rgba(255,150,0,0.5)]">
              🦊
            </span>
            <div className="text-xl font-display font-extrabold text-white mt-2">
              Nihongo<span className="text-[#58cc02]">Flow</span>
            </div>
            <p className="text-xs text-[#9a9aa8] mt-1">
              Textbook Loop + SWOT Diagnostics
            </p>
          </div>

          {navLinks.map((link, i) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-6 py-3.5 rounded-full text-base font-medium w-full max-w-xs transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  isActive
                    ? "text-white bg-white/10 border border-white/10"
                    : "text-[#9a9aa8] hover:text-white hover:bg-white/[0.05]"
                } ${
                  mobileMenuOpen
                    ? "translate-y-0 opacity-100"
                    : "translate-y-8 opacity-0"
                }`}
                style={{
                  transitionDelay: mobileMenuOpen ? `${100 + i * 50}ms` : "0ms",
                }}
              >
                <Icon className="w-4 h-4 text-[#58cc02]" strokeWidth={1.5} />
                <span>{link.label}</span>
              </Link>
            );
          })}

          <div
            className={`mt-6 flex flex-col gap-3 w-full max-w-xs transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              mobileMenuOpen
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-0"
            }`}
            style={{
              transitionDelay: mobileMenuOpen ? "320ms" : "0ms",
            }}
          >
            {session ? (
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="island-btn-primary w-full text-center"
              >
                <span>Go to Dashboard</span>
                <span className="island-icon-bubble">
                  <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
                </span>
              </Link>
            ) : (
              <>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="island-btn-primary w-full text-center"
                >
                  <span>Start Learning Free</span>
                  <span className="island-icon-bubble">
                    <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
                  </span>
                </Link>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="island-btn-secondary w-full text-center"
                >
                  <span>Sign In</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
