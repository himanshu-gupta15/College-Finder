import SignupForm from "@/components/auth/SignupForm";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Create Free Student Account - CollegeFinder",
  description: "Sign up to track application deadlines, save target colleges, and evaluate programs.",
};

export default function SignupPage() {
  return (
    <div className="flex min-h-[calc(100vh-14rem)] items-center justify-center px-4 py-12">
      <Suspense fallback={<div className="text-sm text-slate-500">Loading registration...</div>}>
        <SignupForm />
      </Suspense>
    </div>
  );
}
