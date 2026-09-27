"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, ArrowRight, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const json = await res.json();

      if (!res.ok || json.error) {
        setErrorMessage(json.error?.message || "Invalid credentials. Please try again.");
        return;
      }

      // Redirect to dashboard
      router.push("/dashboard");
      router.refresh();
    } catch {
      setErrorMessage("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-[#ff4b4b]/10 border border-[#ff4b4b]/30 text-[#ff4b4b] text-xs flex items-start gap-2.5 font-medium">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-[#ff4b4b]" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="space-y-1.5">
        <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-[#9a9aa8]">
          Email address
        </Label>
        <Input
          id="email"
          type="email"
          required
          autoComplete="email"
          placeholder="learner@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-[#181826] border-white/10 text-white placeholder:text-[#9a9aa8]/50 focus-visible:ring-[#58cc02] h-11 rounded-xl"
        />
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="password" className="text-xs font-bold uppercase tracking-wider text-[#9a9aa8]">
            Password
          </Label>
          <Link href="/reset" className="text-xs text-[#1cb0f6] hover:underline font-semibold">
            Forgot password?
          </Link>
        </div>
        <Input
          id="password"
          type="password"
          required
          autoComplete="current-password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="bg-[#181826] border-white/10 text-white placeholder:text-[#9a9aa8]/50 focus-visible:ring-[#58cc02] h-11 rounded-xl"
        />
      </div>

      <div className="pt-2">
        <Button
          type="submit"
          disabled={loading}
          variant="chunky"
          size="lg"
          className="w-full text-base"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              Signing in...
            </>
          ) : (
            <>
              Sign In 🦊
              <ArrowRight className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
