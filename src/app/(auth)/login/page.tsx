import React from "react";
import Link from "next/link";
import { AuthCard } from "@/modules/auth/components/auth-card";
import { LoginForm } from "@/modules/auth/components/login-form";

export const metadata = {
  title: "Sign In - NihongoFlow",
  description: "Sign in to continue your Japanese learning journey with NihongoFlow.",
};

export default function LoginPage() {
  return (
    <AuthCard
      title="Welcome Back"
      subtitle="Sign in with your email and password to resume learning."
      footer={
        <p className="text-slate-400">
          Don&apos;t have an account yet?{" "}
          <Link href="/register" className="font-semibold text-rose-400 hover:text-rose-300 hover:underline">
            Create an account
          </Link>
        </p>
      }
    >
      <LoginForm />
    </AuthCard>
  );
}
