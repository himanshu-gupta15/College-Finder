"use client";

import CollegeCard from "@/components/college/CollegeCard";
import CollegeFilters from "@/components/college/CollegeFilters";
import Pagination from "@/components/common/Pagination";
import { CollegeCardSkeleton, CollegeListSkeleton } from "@/components/common/Skeleton";
import { AlertCircle, ArrowUpDown, Building, Filter, RotateCcw, Search, SlidersHorizontal, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function CollegeDiscoveryContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [colleges, setColleges] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  // Lock background scroll when mobile filter drawer is open
  useEffect(() => {
    if (mobileFilterOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileFilterOpen]);

  // Active query parameters
  const page = Number(searchParams.get("page")) || 1;
  const sort = searchParams.get("sort") || "rating_desc";
  const search = searchParams.get("search") || "";
  const state = searchParams.get("state") || "";
  const city = searchParams.get("city") || "";
  const collegeType = searchParams.get("collegeType") || "";
  const ownership = searchParams.get("ownership") || "";
  const minRating = searchParams.get("minRating") || "";
  const maxFees = searchParams.get("maxFees") || "";

  // Fetch colleges from backend API with current query params
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setFetchError(null);

    const query = new URLSearchParams(searchParams.toString());
    if (!query.has("limit")) query.set("limit", "12");

    fetch(`/api/colleges?${query.toString()}`)
      .then(async (res) => {
        const data = await res.json();
        if (!isMounted) return;
        if (!res.ok || !data.success) {
          throw new Error(data.error?.message || "Failed to retrieve colleges from directory");
        }
        if (Array.isArray(data.data)) {
          setColleges(data.data);
          if (data.pagination) {
            setTotal(data.pagination.total);
            setTotalPages(data.pagination.totalPages);
          }
        }
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error("Failed to fetch colleges:", err);
        setFetchError(err.message || "Unable to connect to college directory service");
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [searchParams, reloadKey]);

  const handleSortChange = (newSort: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", newSort);
    params.set("page", "1");
    router.push(`/colleges?${params.toString()}`);
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`/colleges?${params.toString()}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const removeFilter = (key: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(key);
    params.set("page", "1");
    router.push(`/colleges?${params.toString()}`);
  };

  const activeFilterPills = [
    search && { label: `Search: "${search}"`, key: "search" },
    collegeType && { label: `Stream: ${collegeType}`, key: "collegeType" },
    state && { label: `State: ${state}`, key: "state" },
    city && { label: `City: ${city}`, key: "city" },
    ownership && { label: `Ownership: ${ownership}`, key: "ownership" },
    minRating && { label: `Min Rating: ${minRating}★`, key: "minRating" },
    maxFees && { label: `Max Fees: ₹${(Number(maxFees) / 100000).toFixed(1)}L`, key: "maxFees" },
  ].filter(Boolean) as { label: string; key: string }[];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      {/* Title & Results summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Discover & Search Colleges in India
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {loading ? "Searching colleges..." : `Showing ${colleges.length} of ${total} accredited colleges matching your criteria`}
          </p>
        </div>

        {/* Sorting & Mobile Filter Trigger */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="flex lg:hidden items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-2xs"
          >
            <SlidersHorizontal className="h-4 w-4 text-emerald-600" />
            <span>Filters {activeFilterPills.length > 0 && `(${activeFilterPills.length})`}</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline text-xs font-semibold text-slate-500 uppercase">
              Sort By:
            </span>
            <div className="relative">
              <select
                value={sort}
                onChange={(e) => handleSortChange(e.target.value)}
                className="rounded-xl border border-slate-300 bg-white py-2 pl-3 pr-8 text-xs font-semibold text-slate-800 shadow-2xs focus:border-emerald-500 focus:outline-none"
              >
                <option value="rating_desc">Highest Rated</option>
                <option value="fees_asc">Fees: Low to High</option>
                <option value="fees_desc">Fees: High to Low</option>
                <option value="package_desc">Placement Package</option>
                <option value="rating_asc">Lowest Rated</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Active Filter Pills Bar */}
      {activeFilterPills.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs font-semibold text-slate-400">Active Filters:</span>
          {activeFilterPills.map((pill) => (
            <button
              key={pill.key}
              onClick={() => removeFilter(pill.key)}
              className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-800 hover:bg-emerald-100 transition"
            >
              <span>{pill.label}</span>
              <X className="h-3 w-3 text-emerald-600" />
            </button>
          ))}
          <button
            onClick={() => router.push("/colleges")}
            className="text-xs font-semibold text-rose-600 hover:underline ml-1"
          >
            Clear All
          </button>
        </div>
      )}

      {/* Main Grid with Filter Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Desktop Filter Sidebar */}
        <aside className="hidden lg:block lg:col-span-1 sticky top-20">
          <CollegeFilters />
        </aside>

        {/* Mobile Filter Drawer */}
        {mobileFilterOpen && (
          <div className="fixed inset-0 z-50 flex items-end lg:hidden bg-slate-950/60 backdrop-blur-xs">
            <div className="w-full max-h-[90vh] overflow-y-auto rounded-t-3xl bg-white p-5 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <h3 className="text-base font-bold text-slate-900">Filter Colleges</h3>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <CollegeFilters onFilterApplied={() => setMobileFilterOpen(false)} />
            </div>
          </div>
        )}

        {/* College Cards Grid */}
        <section className="lg:col-span-3 space-y-6">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {Array.from({ length: 6 }).map((_, i) => (
                <CollegeCardSkeleton key={i} />
              ))}
            </div>
          ) : fetchError ? (
            <div className="rounded-3xl border border-rose-200 bg-rose-50/50 p-12 text-center space-y-4">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-100 text-rose-600 mb-2">
                <AlertCircle className="h-7 w-7" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Failed to Load Colleges
                </h3>
                <p className="mx-auto mt-1 max-w-md text-xs text-slate-600 leading-relaxed">
                  {fetchError}. Please check your connection or try refreshing the directory.
                </p>
              </div>
              <button
                onClick={() => setReloadKey((k) => k + 1)}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 transition cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Retry Search</span>
              </button>
            </div>
          ) : colleges.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {colleges.map((college) => (
                  <CollegeCard key={college.id} college={college} />
                ))}
              </div>

              {/* Pagination */}
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </>
          ) : (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 mb-3">
                <Search className="h-7 w-7" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">
                No colleges match your current filters
              </h3>
              <p className="mx-auto mt-1 max-w-sm text-xs text-slate-500">
                Try widening your fee range, choosing another stream, or clearing specific state and city filters.
              </p>
              <button
                onClick={() => router.push("/colleges")}
                className="mt-5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-700"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default function CollegesPage() {
  return (
    <Suspense fallback={<CollegeListSkeleton />}>
      <CollegeDiscoveryContent />
    </Suspense>
  );
}
