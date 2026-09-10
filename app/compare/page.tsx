import CompareTable from "@/components/compare/CompareTable";
import { ChevronRight, Home, Scale } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Compare Colleges Side-by-Side - Fees, Placements & Ratings | CollegeFinder",
  description:
    "Compare up to 3 Indian colleges side-by-side. Analyze tuition fees, highest CTC packages, average salaries, NIRF ranks, and campus facilities.",
};

export default function ComparePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 space-y-6">
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-slate-500">
        <Link href="/" className="hover:text-emerald-600 transition flex items-center gap-1">
          <Home className="h-3.5 w-3.5" />
          <span>Home</span>
        </Link>
        <ChevronRight className="h-3 w-3 text-slate-400" />
        <Link href="/colleges" className="hover:text-emerald-600 transition">
          Colleges
        </Link>
        <ChevronRight className="h-3 w-3 text-slate-400" />
        <span className="font-semibold text-slate-800">Compare Colleges</span>
      </nav>

      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white p-6 sm:p-8">
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-2 rounded-lg bg-indigo-500/20 px-3 py-1 text-xs font-semibold text-indigo-300">
            <Scale className="h-3.5 w-3.5" />
            <span>Side-by-Side Decision Matrix</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Compare Indian Higher Education Institutions
          </h1>
          <p className="text-xs sm:text-sm text-indigo-200">
            Evaluate key decision metrics including annual tuition expenses, median packages, alumni reviews, and stream accreditations across 2 to 3 selected institutions.
          </p>
        </div>
      </div>

      {/* Main Compare Matrix Table */}
      <CompareTable />
    </div>
  );
}
