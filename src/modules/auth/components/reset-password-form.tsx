"use client";

import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Loader2, ArrowRight, AlertCircle, CheckCircle2, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const tokenFromUrl = searchParams.get("token") || "";

  // Request Reset State
  const [email, setEmail] = useState("");
  const [requestSent, setRequestSent] = useState(false);

  // Perform Reset State
  const [token, setToken] = useState(tokenFromUrl);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetCompleted, setResetCompleted] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Handle requesting a reset email
  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const json = await res.json();
      if (!res.ok || json.error) {
        setErrorMessage(json.error?.message || "Failed to process reset request.");
        return;
      }

      setRequestSent(true);
    } catch {
      setErrorMessage("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle setting a new password
  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (newPassword.length < 8) {
      setErrorMessage("Password must be at least 8 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password: newPassword }),
      });

      const json = await res.json();
      if (!res.ok || json.error) {
        setErrorMessage(json.error?.message || "Failed to reset password. The link may have expired.");
        return;
      }

      setResetCompleted(true);
    } catch {
      setErrorMessage("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (resetCompleted) {
    return (
      <div className="py-4 text-center space-y-4">
        <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-white">Password Updated!</h3>
        <p className="text-sm text-slate-300">
          Your password has been changed successfully. You can now log in with your new credentials.
        </p>
        <div className="pt-2">
          <Link href="/login">
            <Button className="w-full h-11 bg-rose-600 hover:bg-rose-500 text-white font-medium">
              Proceed to Login
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // If token is present, show password reset input
  if (token) {
    return (
      <form onSubmit={handleResetSubmit} className="space-y-4">
        {errorMessage && (
          <div className="p-3.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="space-y-1.5">
          <Label htmlFor="token" className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Reset Token
          </Label>
          <Input
            id="token"
            type="text"
            required
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className="bg-slate-950/60 border-white/10 text-white placeholder:text-slate-500 focus-visible:ring-rose-500/40 focus-visible:border-rose-500/60 h-11"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="new-password" className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
            New Password (min. 8 characters)
          </Label>
          <Input
            id="new-password"
            type="password"
            required
            autoComplete="new-password"
            placeholder="••••••••"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="bg-slate-950/60 border-white/10 text-white placeholder:text-slate-500 focus-visible:ring-rose-500/40 focus-visible:border-rose-500/60 h-11"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="confirm-new-password" className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Confirm New Password
          </Label>
          <Input
            id="confirm-new-password"
            type="password"
            required
            autoComplete="new-password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="bg-slate-950/60 border-white/10 text-white placeholder:text-slate-500 focus-visible:ring-rose-500/40 focus-visible:border-rose-500/60 h-11"
          />
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full h-11 bg-rose-600 hover:bg-rose-500 text-white font-medium shadow-lg shadow-rose-600/25"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              Saving new password...
            </>
          ) : (
            <>
              Set New Password
              <ArrowRight className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>
      </form>
    );
  }

  // Otherwise, show request reset link email form
  return (
    <div className="space-y-4">
      {requestSent ? (
        <div className="text-center space-y-4 py-2">
          <div className="w-14 h-14 mx-auto rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <KeyRound className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-semibold text-white">Instructions Dispatched</h3>
          <p className="text-sm text-slate-300 leading-relaxed">
            If an account matches <span className="font-semibold text-rose-300">{email}</span>, we have sent instructions to reset your password.
          </p>
          <div className="pt-2">
            <Link href="/login">
              <Button variant="outline" className="w-full border-white/10 hover:bg-white/5 text-slate-200">
                Back to Login
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleRequestSubmit} className="space-y-4">
          {errorMessage && (
            <div className="p-3.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          <p className="text-xs text-slate-400">
            Enter your registered email address and we will send you a secure link to reset your password.
          </p>

          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
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
              className="bg-slate-950/60 border-white/10 text-white placeholder:text-slate-500 focus-visible:ring-rose-500/40 focus-visible:border-rose-500/60 h-11"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-11 bg-rose-600 hover:bg-rose-500 text-white font-medium shadow-lg shadow-rose-600/25"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Sending reset link...
              </>
            ) : (
              <>
                Send Reset Link
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </form>
      )}
    </div>
  );
}
