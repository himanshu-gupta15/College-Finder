"use client";

import { ComparisonItem, useComparison } from "@/context/ComparisonContext";
import { Award, Check, ExternalLink, IndianRupee, MapPin, Plus, Star, Trash2, TrendingUp, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

interface CompareTableProps {
  initialColleges?: any[];
}

export default function CompareTable({ initialColleges }: CompareTableProps) {
  const { items, removeFromCompare, clearComparison, addToCompare } = useComparison();
  const [collegesData, setCollegesData] = useState<any[]>(initialColleges || []);
  const [loading, setLoading] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch full details of compared colleges
  useEffect(() => {
    if (items.length === 0) {
      setCollegesData([]);
      return;
    }

    const slugs = items.map((i) => i.slug).join(",");
    setLoading(true);
    fetch(`/api/colleges/compare?slugs=${slugs}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setCollegesData(data.data);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [items]);

  // Handle searching for a college to add inside the comparison modal
  const handleSearchColleges = async (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    try {
      const res = await fetch(`/api/colleges?search=${encodeURIComponent(query)}&limit=6`);
      const data = await res.json();
      if (data.success && data.data) {
        setSearchResults(data.data);
      }
    } catch {
      // ignore
    }
  };

  const handleAddCollege = (college: any) => {
    addToCompare({
      id: college.id,
      slug: college.slug,
      name: college.name,
      shortName: college.shortName,
      city: college.city,
      state: college.state,
      collegeType: college.collegeType,
      logoUrl: college.logoUrl,
      minFees: college.minFees,
      maxFees: college.maxFees,
      rating: college.rating,
    });
    setAddModalOpen(false);
    setSearchQuery("");
    setSearchResults([]);
  };

  const formatLakhs = (amount: number) => {
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)} Lakhs`;
    }
    return `₹${amount?.toLocaleString("en-IN")}`;
  };

  if (items.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 mb-4">
          <ScaleIcon className="h-8 w-8" />
        </div>
        <h3 className="text-xl font-bold text-slate-900">No Colleges Selected for Comparison</h3>
        <p className="mx-auto mt-2 max-w-md text-sm text-slate-600">
          Select up to 3 colleges from the discovery page or quick search to view side-by-side fee structures, placements, and ratings.
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <Link
            href="/colleges"
            className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700"
          >
            Explore All Colleges
          </Link>
          <button
            onClick={() => setAddModalOpen(true)}
            className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            + Add College by Name
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Comparing {items.length} of 3 Colleges
          </h2>
          <span className="text-xs text-slate-500">
            Side-by-side metric evaluation to find the best academic and financial fit
          </span>
        </div>

        <div className="flex items-center gap-2">
          {items.length < 3 && (
            <button
              onClick={() => setAddModalOpen(true)}
              className="flex items-center gap-1.5 rounded-xl border border-emerald-600 bg-emerald-50 px-3.5 py-2 text-xs font-bold text-emerald-700 hover:bg-emerald-100 transition"
            >
              <Plus className="h-4 w-4" />
              <span>Add College ({3 - items.length} slot left)</span>
            </button>
          )}

          <button
            onClick={clearComparison}
            className="flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-650 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition"
          >
            <Trash2 className="h-4 w-4" />
            <span>Clear All</span>
          </button>
        </div>
      </div>

      {/* Comparison Table Container */}
      <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-xs custom-scrollbar">
        <table className="w-full min-w-[700px] border-collapse text-left text-sm">
          <thead>
            {/* Header row with college logos, titles, and remove button */}
            <tr className="border-b border-slate-200 bg-slate-50/70">
              <th className="w-1/4 p-5 align-top text-xs font-bold uppercase tracking-wider text-slate-500">
                Institutional Profile
              </th>
              {collegesData.map((col) => (
                <th key={col.id} className="w-1/4 p-5 align-top">
                  <div className="flex flex-col justify-between h-full space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xs">
                        {col.logoUrl ? (
                          <Image
                            src={col.logoUrl}
                            alt={col.name}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-emerald-100 text-emerald-800 font-bold text-lg">
                            {col.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => removeFromCompare(col.id)}
                        className="rounded-lg p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition"
                        title="Remove from comparison"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>

                    <div>
                      <Link
                        href={`/colleges/${col.slug}`}
                        className="font-bold text-slate-900 hover:text-emerald-600 line-clamp-2 text-base transition"
                      >
                        {col.name}
                      </Link>
                      <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                        <MapPin className="h-3.5 w-3.5 text-slate-400" />
                        <span>
                          {col.city}, {col.state}
                        </span>
                      </div>
                    </div>
                  </div>
                </th>
              ))}
              {/* Empty placeholder column if < 3 */}
              {Array.from({ length: 3 - collegesData.length }).map((_, i) => (
                <th key={`empty-${i}`} className="w-1/4 p-5 align-middle text-center border-l border-dashed border-slate-200">
                  <button
                    onClick={() => setAddModalOpen(true)}
                    className="flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-300 p-6 text-slate-400 hover:border-emerald-500 hover:text-emerald-600 transition w-full"
                  >
                    <Plus className="h-6 w-6" />
                    <span className="text-xs font-semibold">Add College</span>
                  </button>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {/* Rating & Review Count */}
            <tr>
              <td className="p-4 font-semibold text-slate-700 bg-slate-50/40">Student Rating</td>
              {collegesData.map((col) => (
                <td key={col.id} className="p-4">
                  <div className="flex items-center gap-1.5">
                    <div className="flex items-center gap-1 rounded-md bg-amber-50 px-2 py-1 text-xs font-bold text-amber-800">
                      <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                      <span>{col.rating.toFixed(1)}</span>
                    </div>
                    <span className="text-xs text-slate-400">({col.reviewCount} reviews)</span>
                  </div>
                </td>
              ))}
              {Array.from({ length: 3 - collegesData.length }).map((_, i) => (
                <td key={`empty-rating-${i}`} className="p-4 text-slate-300 text-center">—</td>
              ))}
            </tr>

            {/* Annual Tuition Fees */}
            <tr>
              <td className="p-4 font-semibold text-slate-700 bg-slate-50/40">Annual Tuition Range</td>
              {collegesData.map((col) => (
                <td key={col.id} className="p-4">
                  <div className="font-bold text-slate-900">
                    {formatLakhs(col.minFees)} - {formatLakhs(col.maxFees)} / yr
                  </div>
                </td>
              ))}
              {Array.from({ length: 3 - collegesData.length }).map((_, i) => (
                <td key={`empty-fees-${i}`} className="p-4 text-slate-300 text-center">—</td>
              ))}
            </tr>

            {/* Average Placement Package */}
            <tr>
              <td className="p-4 font-semibold text-slate-700 bg-slate-50/40">Average Placement CTC</td>
              {collegesData.map((col) => {
                const p = col.placements?.[0];
                return (
                  <td key={col.id} className="p-4">
                    <span className="font-bold text-emerald-700 text-base">
                      {p ? `₹${p.averagePackage} LPA` : "N/A"}
                    </span>
                  </td>
                );
              })}
              {Array.from({ length: 3 - collegesData.length }).map((_, i) => (
                <td key={`empty-avg-${i}`} className="p-4 text-slate-300 text-center">—</td>
              ))}
            </tr>

            {/* Highest Placement Package */}
            <tr>
              <td className="p-4 font-semibold text-slate-700 bg-slate-50/40">Highest Placement CTC</td>
              {collegesData.map((col) => {
                const p = col.placements?.[0];
                return (
                  <td key={col.id} className="p-4">
                    <span className="font-bold text-indigo-700 text-base">
                      {p ? `₹${p.highestPackage} LPA` : "N/A"}
                    </span>
                  </td>
                );
              })}
              {Array.from({ length: 3 - collegesData.length }).map((_, i) => (
                <td key={`empty-high-${i}`} className="p-4 text-slate-300 text-center">—</td>
              ))}
            </tr>

            {/* College Discipline & Ownership */}
            <tr>
              <td className="p-4 font-semibold text-slate-700 bg-slate-50/40">Stream & Ownership</td>
              {collegesData.map((col) => (
                <td key={col.id} className="p-4">
                  <span className="text-xs font-medium text-slate-800">
                    {col.collegeType} • {col.ownership}
                  </span>
                </td>
              ))}
              {Array.from({ length: 3 - collegesData.length }).map((_, i) => (
                <td key={`empty-type-${i}`} className="p-4 text-slate-300 text-center">—</td>
              ))}
            </tr>

            {/* Accreditation */}
            <tr>
              <td className="p-4 font-semibold text-slate-700 bg-slate-50/40">Accreditation / Ranking</td>
              {collegesData.map((col) => (
                <td key={col.id} className="p-4 text-xs text-slate-800">
                  {col.accreditation || "UGC Recognized"}
                </td>
              ))}
              {Array.from({ length: 3 - collegesData.length }).map((_, i) => (
                <td key={`empty-acc-${i}`} className="p-4 text-slate-300 text-center">—</td>
              ))}
            </tr>

            {/* Established Year */}
            <tr>
              <td className="p-4 font-semibold text-slate-700 bg-slate-50/40">Established Year</td>
              {collegesData.map((col) => (
                <td key={col.id} className="p-4 text-xs text-slate-800">
                  {col.establishedYear}
                </td>
              ))}
              {Array.from({ length: 3 - collegesData.length }).map((_, i) => (
                <td key={`empty-est-${i}`} className="p-4 text-slate-300 text-center">—</td>
              ))}
            </tr>

            {/* Top Recruiters */}
            <tr>
              <td className="p-4 font-semibold text-slate-700 bg-slate-50/40">Top Marquee Recruiters</td>
              {collegesData.map((col) => {
                const recruiters = col.placements?.[0]?.topRecruiters;
                return (
                  <td key={col.id} className="p-4 text-xs text-slate-600 leading-relaxed">
                    {recruiters || "Top domestic and multinational organizations"}
                  </td>
                );
              })}
              {Array.from({ length: 3 - collegesData.length }).map((_, i) => (
                <td key={`empty-rec-${i}`} className="p-4 text-slate-300 text-center">—</td>
              ))}
            </tr>

            {/* Direct Page Link */}
            <tr>
              <td className="p-4 font-semibold text-slate-700 bg-slate-50/40">Full Profile</td>
              {collegesData.map((col) => (
                <td key={col.id} className="p-4">
                  <Link
                    href={`/colleges/${col.slug}`}
                    className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-2xs hover:bg-emerald-700"
                  >
                    <span>View Details</span>
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                </td>
              ))}
              {Array.from({ length: 3 - collegesData.length }).map((_, i) => (
                <td key={`empty-link-${i}`} className="p-4 text-slate-300 text-center">—</td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Modal to add colleges */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">Add College to Compare</h3>
              <button
                onClick={() => setAddModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchColleges(e.target.value)}
                placeholder="Type college name (e.g. IIT Delhi, BITS Pilani)..."
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none"
                autoFocus
              />
            </div>

            <div className="max-h-64 overflow-y-auto space-y-2">
              {searchResults.length > 0 ? (
                searchResults.map((c) => (
                  <div
                    key={c.id}
                    className="flex items-center justify-between rounded-xl border border-slate-100 p-3 hover:bg-slate-50 transition"
                  >
                    <div>
                      <div className="font-bold text-slate-900 text-sm">{c.name}</div>
                      <div className="text-xs text-slate-500">
                        {c.city}, {c.state} • {c.collegeType}
                      </div>
                    </div>
                    <button
                      onClick={() => handleAddCollege(c)}
                      className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700"
                    >
                      + Add
                    </button>
                  </div>
                ))
              ) : searchQuery ? (
                <div className="py-6 text-center text-xs text-slate-500">
                  No matching colleges found. Try typing another term.
                </div>
              ) : (
                <div className="py-6 text-center text-xs text-slate-400">
                  Start typing to find and select colleges for comparison.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ScaleIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
      <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
      <path d="M7 21h10" />
      <path d="M12 3v18" />
      <path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2" />
    </svg>
  );
}
