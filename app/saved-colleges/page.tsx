"use client";

import CollegeCard from "@/components/college/CollegeCard";
import { CollegeCardSkeleton } from "@/components/common/Skeleton";
import { useAuth } from "@/context/AuthContext";
import { useSavedColleges } from "@/context/SavedCollegesContext";
import { Bookmark, ChevronRight, Compass, Home, LogIn } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function SavedCollegesPage() {
  const { user, loading: authLoading } = useAuth();
  const { savedCollegeIds } = useSavedColleges();
  const [colleges, setColleges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setColleges([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    fetch("/api/saved-colleges")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          // Extract colleges from saved records
          setColleges(data.data.map((item: any) => item.college));
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [user, savedCollegeIds]);

  if (authLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 text-center text-sm text-slate-500">
        Authenticating user profile...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center space-y-4">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
          <Bookmark className="h-8 w-8" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Sign In to View Saved Colleges</h1>
        <p className="text-sm text-slate-600 max-w-md mx-auto">
          You need an active account to save college shortlists, compare fee budgets, and track application deadlines.
        </p>
        <div className="pt-2 flex items-center justify-center gap-3">
          <Link
            href="/login?redirect=/saved-colleges"
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700"
          >
            <LogIn className="h-4 w-4" />
            <span>Sign In to Account</span>
          </Link>
          <Link
            href="/signup?redirect=/saved-colleges"
            className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Create New Account
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 space-y-6">
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-slate-500">
        <Link href="/" className="hover:text-emerald-600 transition flex items-center gap-1">
          <Home className="h-3.5 w-3.5" />
          <span>Home</span>
        </Link>
        <ChevronRight className="h-3 w-3 text-slate-400" />
        <span className="font-semibold text-slate-800">Saved Colleges</span>
      </nav>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Bookmark className="h-6 w-6 text-rose-500 fill-rose-500" />
            <span>Your Saved College Shortlist</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Colleges you have bookmarked for easy access, fee comparison, and application tracking
          </p>
        </div>

        <Link
          href="/colleges"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 hover:text-emerald-700"
        >
          <Compass className="h-4 w-4" />
          <span>Discover More Colleges</span>
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <CollegeCardSkeleton key={i} />
          ))}
        </div>
      ) : colleges.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {colleges.map((college) => (
            <CollegeCard key={college.id} college={college} />
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-500 mb-3">
            <Bookmark className="h-7 w-7" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Your Saved List is Empty</h3>
          <p className="mx-auto mt-1 max-w-sm text-xs text-slate-500">
            Browse through premier Indian engineering, management, or medical colleges and click the bookmark icon to save them here.
          </p>
          <Link
            href="/colleges"
            className="mt-5 inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-700"
          >
            <Compass className="h-4 w-4" />
            <span>Explore Colleges</span>
          </Link>
        </div>
      )}
    </div>
  );
}
