import React, { Suspense } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { AuthCard } from "@/modules/auth/components/auth-card";
import { VerifyForm } from "@/modules/auth/components/verify-form";

export const metadata = {
  title: "Verify Email - NihongoFlow",
  description: "Verify your email address to activate your NihongoFlow account.",
};

export default function VerifyPage() {
  return (
    <AuthCard
      title="Verify Account"
      subtitle="Confirm your email to complete your registration."
      footer={
        <p className="text-slate-400">
          Need help?{" "}
          <Link href="/login" className="font-semibold text-rose-400 hover:text-rose-300 hover:underline">
            Return to login
          </Link>
        </p>
      }
    >
      <Suspense
        fallback={
          <div className="py-8 text-center text-slate-400 flex items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin" /> Loading verification...
          </div>
        }
      >
        <VerifyForm />
      </Suspense>
    </AuthCard>
  );
}
