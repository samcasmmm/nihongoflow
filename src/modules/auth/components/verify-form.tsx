"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Loader2, CheckCircle2, AlertCircle, ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function VerifyForm() {
  const searchParams = useSearchParams();
  const tokenParam = searchParams.get("token") || "";
  const isPending = searchParams.get("pending") === "true";

  const [token, setToken] = useState(tokenParam);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const performVerification = useCallback(async (tokenToVerify: string) => {
    if (!tokenToVerify) return;
    setLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch(`/api/auth/verify?token=${encodeURIComponent(tokenToVerify)}`);
      const json = await res.json();

      if (!res.ok || json.error) {
        setErrorMessage(json.error?.message || "Invalid or expired verification link.");
        return;
      }

      setSuccess(true);
    } catch {
      setErrorMessage("Network error during verification. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!tokenParam) return;

    let isSubscribed = true;

    async function execute() {
      setLoading(true);
      setErrorMessage(null);

      try {
        const res = await fetch(`/api/auth/verify?token=${encodeURIComponent(tokenParam)}`);
        const json = await res.json();

        if (!isSubscribed) return;

        if (!res.ok || json.error) {
          setErrorMessage(json.error?.message || "Invalid or expired verification link.");
          return;
        }

        setSuccess(true);
      } catch {
        if (isSubscribed) {
          setErrorMessage("Network error during verification. Please try again.");
        }
      } finally {
        if (isSubscribed) {
          setLoading(false);
        }
      }
    }

    void execute();

    return () => {
      isSubscribed = false;
    };
  }, [tokenParam]);

  if (loading) {
    return (
      <div className="py-8 text-center space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-rose-500 mx-auto" />
        <p className="text-slate-300 font-medium text-sm">Verifying your NihongoFlow account...</p>
      </div>
    );
  }

  if (success) {
    return (
      <div className="py-6 text-center space-y-5">
        <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
          <CheckCircle2 className="w-9 h-9" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">Email Verified!</h3>
          <p className="text-sm text-slate-300 mt-1.5">
            Your account is now fully active. Ready to begin your Japanese study flow?
          </p>
        </div>

        <div className="pt-2">
          <Link href="/dashboard">
            <Button className="w-full h-11 bg-rose-600 hover:bg-rose-500 text-white font-medium shadow-lg shadow-rose-600/25">
              Enter Dashboard
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {isPending && !tokenParam && (
        <div className="p-3.5 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-sm flex items-start gap-2.5">
          <ShieldCheck className="w-5 h-5 shrink-0 mt-0.5 text-indigo-400" />
          <span>Please verify your email address to continue enjoying NihongoFlow.</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-3.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-start gap-2.5">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-400" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          performVerification(token);
        }}
        className="space-y-4"
      >
        <div className="space-y-1.5">
          <Label htmlFor="token" className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Verification Token
          </Label>
          <Input
            id="token"
            type="text"
            required
            placeholder="Paste your 64-character verification token"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className="bg-slate-950/60 border-white/10 text-white placeholder:text-slate-500 focus-visible:ring-rose-500/40 focus-visible:border-rose-500/60 h-11"
          />
        </div>

        <Button
          type="submit"
          disabled={!token || loading}
          className="w-full h-11 bg-rose-600 hover:bg-rose-500 text-white font-medium shadow-lg shadow-rose-600/25 transition-all"
        >
          Verify Email Now
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </form>
    </div>
  );
}
