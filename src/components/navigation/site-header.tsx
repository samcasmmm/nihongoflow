"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Menu, X, BookOpen, Compass, HelpCircle, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
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
    <header className="border-b border-white/5 bg-[#0a0a0f]/85 backdrop-blur-md sticky top-0 z-50">
      <div className="w-full max-w-[92%] lg:max-w-[80%] mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <span className="text-3xl filter drop-shadow-[0_2px_8px_rgba(255,150,0,0.4)] transition-transform group-hover:scale-110 duration-150">
            🦊
          </span>
          <div className="flex flex-col">
            <span className="text-2xl font-display font-extrabold tracking-tight text-white flex items-center gap-0.5 leading-none">
              Nihongo<span className="text-[#58cc02]">Flow</span>
            </span>
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#9a9aa8]">
              Master Japanese Naturally
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 text-sm font-semibold text-[#9a9aa8]">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl transition-colors ${
                  isActive
                    ? "text-white bg-white/10"
                    : "hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon className="w-3.5 h-3.5 opacity-70" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Action Buttons */}
        <div className="hidden sm:flex items-center gap-3">
          {session ? (
            <Link href="/dashboard">
              <Button variant="chunky" size="default">
                Dashboard
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </Link>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm" className="text-sm font-semibold text-[#9a9aa8] hover:text-white">
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button variant="chunky" size="default">
                  Get Started Free 🦊
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex sm:hidden items-center gap-2">
          {session && (
            <Link href="/dashboard">
              <Button variant="chunky" size="sm" className="text-xs">
                Dashboard
              </Button>
            </Link>
          )}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-[#9a9aa8] hover:text-white hover:bg-white/5 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-b border-white/10 bg-[#0c0c14] px-4 pt-3 pb-6 space-y-3 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${
                    isActive
                      ? "text-white bg-white/10"
                      : "text-[#9a9aa8] hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className="pt-3 border-t border-white/5 flex flex-col gap-2">
            {session ? (
              <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="chunky" size="default" className="w-full">
                  Go to Dashboard 🦊
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="chunky" size="default" className="w-full">
                    Get Started Free 🦊
                  </Button>
                </Link>
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" size="default" className="w-full text-sm font-semibold text-[#9a9aa8]">
                    Sign In to Existing Account
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
