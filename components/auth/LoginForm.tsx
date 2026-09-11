"use client";

import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import { useAuth } from "@/context/AuthContext";
import { AlertCircle, Lock, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/colleges";
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await login(email, password);
      if (!res.success) {
        setError(res.error || "Failed to sign in");
      } else {
        router.push(redirectPath);
      }
    } catch {
      setError("An unexpected network error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Welcome Back</h1>
        <p className="text-xs text-slate-500 mt-1">
          Sign in to view and manage college profiles and shortlists
        </p>
      </div>

      {error && (
        <div className="mb-4 flex items-start gap-2 rounded-xl bg-rose-50 p-3 text-xs text-rose-700 border border-rose-200">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email Address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="name@example.com"
          required
          icon={<Mail className="h-4 w-4" />}
        />

        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          required
          icon={<Lock className="h-4 w-4" />}
        />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={loading}
          className="w-full mt-2"
        >
          Sign In to Account
        </Button>
      </form>

      <div className="mt-6 border-t border-slate-100 pt-5 text-center text-xs text-slate-600">
        Don&apos;t have an account yet?{" "}
        <Link
          href={`/signup${redirectPath !== "/colleges" ? `?redirect=${encodeURIComponent(redirectPath)}` : ""}`}
          className="font-bold text-emerald-600 hover:text-emerald-700 hover:underline"
        >
          Create an Account
        </Link>
      </div>
    </div>
  );
}
