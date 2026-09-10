"use client";

import { useAuth } from "@/context/AuthContext";
import { Bookmark, Calendar, ChevronRight, Home, LogOut, Mail, ShieldCheck, User as UserIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const [stats, setStats] = useState({ savedCount: 0 });

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login?redirect=/profile");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      fetch("/api/saved-colleges")
        .then((res) => res.json())
        .then((data) => {
          if (data.success && Array.isArray(data.data)) {
            setStats({ savedCount: data.data.length });
          }
        })
        .catch(() => {});
    }
  }, [user]);

  if (loading || !user) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 text-center text-sm text-slate-500">
        Loading user profile...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-slate-500">
        <Link href="/" className="hover:text-emerald-600 transition flex items-center gap-1">
          <Home className="h-3.5 w-3.5" />
          <span>Home</span>
        </Link>
        <ChevronRight className="h-3 w-3 text-slate-400" />
        <span className="font-semibold text-slate-800">My Profile</span>
      </nav>

      {/* Profile Header Card */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-600 to-indigo-600 text-2xl font-bold text-white shadow-sm">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-slate-900">{user.name}</h1>
                <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800 uppercase">
                  {user.role}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                <Mail className="h-3.5 w-3.5" />
                <span>{user.email}</span>
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              logout();
              router.push("/");
            }}
            className="flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-xs font-bold text-rose-700 hover:bg-rose-100 transition self-start sm:self-auto"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Profile Statistics Grid */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-slate-100 pt-6">
          <Link
            href="/saved-colleges"
            className="group rounded-2xl border border-slate-100 bg-slate-50 p-4 transition hover:border-emerald-500 hover:bg-emerald-50/50"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 group-hover:text-emerald-700">
                Saved Colleges
              </span>
              <Bookmark className="h-4 w-4 text-rose-500" />
            </div>
            <div className="mt-2 text-3xl font-extrabold text-slate-900 group-hover:text-emerald-800">
              {stats.savedCount}
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">
              Click to view shortlisted colleges →
            </span>
          </Link>

          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Account Status
              </span>
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
            </div>
            <div className="mt-2 text-base font-bold text-emerald-700">
              Verified Student
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">
              Full access to cutoffs and comparisons
            </span>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Security Protocol
              </span>
              <Calendar className="h-4 w-4 text-indigo-600" />
            </div>
            <div className="mt-2 text-base font-bold text-indigo-900">
              JWT + HTTP-Only
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">
              Secure cookie-based authentication
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
