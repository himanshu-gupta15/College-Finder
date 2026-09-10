import { Compass, GraduationCap, Home } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-14rem)] flex-col items-center justify-center px-4 py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 mb-4">
        <GraduationCap className="h-8 w-8" />
      </div>
      <h1 className="text-4xl font-extrabold text-slate-900">404 - College or Page Not Found</h1>
      <p className="mx-auto mt-2 max-w-md text-sm text-slate-600">
        We couldn&apos;t find the college or page you were looking for. The institution slug might have changed, or the address might be misspelled.
      </p>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/colleges"
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700"
        >
          <Compass className="h-4 w-4" />
          <span>Explore All Colleges</span>
        </Link>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          <Home className="h-4 w-4" />
          <span>Return Home</span>
        </Link>
      </div>
    </div>
  );
}
