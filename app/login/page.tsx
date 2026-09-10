import LoginForm from "@/components/auth/LoginForm";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Sign In - CollegeFinder",
  description: "Sign in to access your saved college shortlists and personalized recommendations.",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-[calc(100vh-14rem)] items-center justify-center px-4 py-12">
      <Suspense fallback={<div className="text-sm text-slate-500">Loading sign in...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
