import React from "react";
import Link from "next/link";
import { AuthCard } from "@/modules/auth/components/auth-card";
import { RegisterForm } from "@/modules/auth/components/register-form";

export const metadata = {
  title: "Create Account - NihongoFlow",
  description: "Join NihongoFlow to master Japanese through structured lessons and diagnostic SWOT feedback.",
};

export default function RegisterPage() {
  return (
    <AuthCard
      title="Begin Your Journey"
      subtitle="Create an account to start your structured Japanese curriculum."
      footer={
        <p className="text-slate-400">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-rose-400 hover:text-rose-300 hover:underline">
            Sign in
          </Link>
        </p>
      }
    >
      <RegisterForm />
    </AuthCard>
  );
}
