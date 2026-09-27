import React, { Suspense } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { AuthCard } from "@/modules/auth/components/auth-card";
import { ResetPasswordForm } from "@/modules/auth/components/reset-password-form";

export const metadata = {
  title: "Reset Password - NihongoFlow",
  description: "Reset your NihongoFlow account password.",
};

export default function ResetPasswordPage() {
  return (
    <AuthCard
      title="Reset Password"
      subtitle="Enter your details to regain access to your account."
      footer={
        <p className="text-slate-400">
          Remembered your password?{" "}
          <Link href="/login" className="font-semibold text-rose-400 hover:text-rose-300 hover:underline">
            Back to sign in
          </Link>
        </p>
      }
    >
      <Suspense
        fallback={
          <div className="py-8 text-center text-slate-400 flex items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin" /> Loading...
          </div>
        }
      >
        <ResetPasswordForm />
      </Suspense>
    </AuthCard>
  );
}
