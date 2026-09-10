"use client";

import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import { useAuth } from "@/context/AuthContext";
import { AlertCircle, Lock, Mail, User } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/colleges";
  const { signup } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);

    try {
      const res = await signup(name, email, password);
      if (!res.success) {
        setError(res.error || "Failed to register account");
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
        <h1 className="text-2xl font-bold text-slate-900">Create Student Account</h1>
        <p className="text-xs text-slate-500 mt-1">
          Save favorite colleges, track application cutoffs, and build comparisons
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
          label="Full Name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Aryan Sharma"
          required
          icon={<User className="h-4 w-4" />}
        />

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
          label="Password (min 6 characters)"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Create a strong password"
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
          Create Free Account
        </Button>
      </form>

      <div className="mt-6 border-t border-slate-100 pt-5 text-center text-xs text-slate-600">
        Already have an account?{" "}
        <Link
          href={`/login${redirectPath !== "/colleges" ? `?redirect=${encodeURIComponent(redirectPath)}` : ""}`}
          className="font-bold text-emerald-600 hover:text-emerald-700 hover:underline"
        >
          Sign In Here
        </Link>
      </div>
    </div>
  );
}
