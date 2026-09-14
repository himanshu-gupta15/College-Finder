"use client";

import { useAuth } from "@/context/AuthContext";
import { useComparison } from "@/context/ComparisonContext";
import { useSavedColleges } from "@/context/SavedCollegesContext";
import {
  Award,
  Bookmark,
  Check,
  ExternalLink,
  Globe,
  IndianRupee,
  MapPin,
  Pencil,
  Scale,
  Share2,
  Star,
  TrendingUp,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface CollegeHeaderProps {
  college: {
    id: string;
    slug: string;
    name: string;
    shortName?: string | null;
    establishedYear: number;
    collegeType: string;
    ownership: string;
    affiliation?: string | null;
    accreditation?: string | null;
    rating: number;
    reviewCount: number;
    minFees: number;
    maxFees: number;
    city: string;
    state: string;
    address: string;
    website?: string | null;
    logoUrl?: string | null;
    bannerUrl?: string | null;
    placements?: {
      highestPackage: number;
      averagePackage: number;
    }[];
  };
}

export default function CollegeHeader({ college }: CollegeHeaderProps) {
  const { user } = useAuth();
  const { isSaved, toggleSave } = useSavedColleges();
  const { addToCompare, removeFromCompare, isInComparison } = useComparison();
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const saved = isSaved(college.id);
  const inComparison = isInComparison(college.id);
  const placement = college.placements?.[0];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCompareClick = () => {
    if (inComparison) {
      removeFromCompare(college.id);
      showToast(`${college.shortName || college.name} removed from comparison`);
    } else {
      const res = addToCompare({
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
      showToast(res.message);
    }
  };

  const handleSaveClick = async () => {
    const res = await toggleSave(college.id);
    if (res.error) {
      showToast(res.error);
    } else {
      showToast(res.isSaved ? "Saved to your shortlist!" : "Removed from saved colleges");
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: college.name,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast("Page URL copied to clipboard!");
    }
  };

  return (
    <div className="relative rounded-3xl border border-slate-200 bg-white shadow-xs overflow-hidden">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white shadow-xl animate-in fade-in slide-in-from-bottom-5">
          {toastMessage}
        </div>
      )}

      {/* Banner Backdrop */}
      <div className="relative h-48 sm:h-64 w-full bg-slate-800">
        {college.bannerUrl && (
          <Image
            src={college.bannerUrl}
            alt={`${college.name} campus banner`}
            fill
            priority
            className="object-cover opacity-60"
            sizes="(max-width: 1200px) 100vw, 1200px"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />
      </div>

      {/* Main Header Info Area */}
      <div className="relative px-4 pb-6 pt-0 sm:px-8">
        {/* Floating Logo */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-16 sm:-mt-20 mb-4">
          <div className="flex items-end gap-3 sm:gap-4">
            <div className="relative h-20 w-20 sm:h-28 sm:w-28 shrink-0 overflow-hidden rounded-2xl border-4 border-white bg-white shadow-md">
              {college.logoUrl ? (
                <Image
                  src={college.logoUrl}
                  alt={college.name}
                  fill
                  className="object-cover"
                  sizes="112px"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-emerald-600 text-white font-bold text-3xl">
                  {college.name.charAt(0)}
                </div>
              )}
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-md bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
                  {college.collegeType}
                </span>
                <span className="rounded-md bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700">
                  {college.ownership}
                </span>
                {college.accreditation && (
                  <span className="flex items-center gap-1 rounded-md bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-700">
                    <Award className="h-3.5 w-3.5 text-indigo-600" />
                    {college.accreditation}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons: Edit (Admin), Compare, Save, Share */}
          <div className="flex flex-wrap items-center gap-2">
            {user?.role === "admin" && (
              <Link
                href={`/admin/colleges/${college.id}/edit`}
                className="flex items-center gap-1.5 rounded-xl border border-emerald-300 bg-emerald-50 px-3.5 py-2.5 text-sm font-bold text-emerald-800 hover:bg-emerald-100 transition shadow-xs"
              >
                <Pencil className="h-4 w-4 text-emerald-700" />
                <span>Edit College (Admin)</span>
              </Link>
            )}

            <button
              onClick={handleCompareClick}
              className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${
                inComparison
                  ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                  : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              {inComparison ? (
                <>
                  <Check className="h-4 w-4 text-indigo-600" />
                  <span>In Compare</span>
                </>
              ) : (
                <>
                  <Scale className="h-4 w-4 text-slate-500" />
                  <span>Add to Compare</span>
                </>
              )}
            </button>

            <button
              onClick={handleSaveClick}
              className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${
                saved
                  ? "border-rose-200 bg-rose-50 text-rose-600"
                  : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              <Bookmark className={`h-4 w-4 ${saved ? "fill-rose-600" : ""}`} />
              <span>{saved ? "Saved" : "Save College"}</span>
            </button>

            <button
              onClick={handleShare}
              title="Share"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-300 bg-white text-slate-600 hover:bg-slate-50"
            >
              <Share2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Title and Detailed Subtitle */}
        <div className="mt-3">
          <h1 className="text-xl sm:text-3xl font-extrabold text-slate-900 tracking-tight break-words">
            {college.name}
          </h1>

          <div className="mt-2 flex flex-wrap items-center gap-y-2 gap-x-4 text-sm text-slate-600">
            <div className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-slate-400" />
              <span>{college.address || `${college.city}, ${college.state}`}</span>
            </div>

            <span className="text-slate-300">•</span>
            <span>Estd. {college.establishedYear}</span>

            {college.affiliation && (
              <>
                <span className="text-slate-300">•</span>
                <span>{college.affiliation}</span>
              </>
            )}

            {college.website && (
              <>
                <span className="text-slate-300">•</span>
                <a
                  href={college.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 font-medium text-emerald-600 hover:underline"
                >
                  <Globe className="h-3.5 w-3.5" />
                  <span>Official Website</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </>
            )}
          </div>
        </div>

        {/* Quick Highlights Metrics Bar */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 border-t border-slate-100 pt-5">
          <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-100">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Student Rating
            </span>
            <div className="flex items-center gap-1.5 mt-1">
              <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
              <span className="text-xl font-bold text-slate-900">
                {college.rating.toFixed(1)}
              </span>
              <span className="text-xs text-slate-400">
                ({college.reviewCount} reviews)
              </span>
            </div>
          </div>

          <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-100">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Annual Fees Range
            </span>
            <div className="flex items-center gap-1 mt-1">
              <IndianRupee className="h-4 w-4 text-slate-700" />
              <span className="text-lg font-bold text-slate-900">
                {college.minFees >= 100000 ? `₹${(college.minFees / 100000).toFixed(1)}L` : `₹${college.minFees.toLocaleString("en-IN")}`} - {college.maxFees >= 100000 ? `₹${(college.maxFees / 100000).toFixed(1)}L` : `₹${college.maxFees.toLocaleString("en-IN")}`}
              </span>
            </div>
          </div>

          <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-100">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Average CTC Package
            </span>
            <div className="flex items-center gap-1.5 mt-1">
              <TrendingUp className="h-4 w-4 text-emerald-600" />
              <span className="text-lg font-bold text-emerald-700">
                {placement ? `₹${placement.averagePackage} LPA` : "N/A"}
              </span>
            </div>
          </div>

          <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-100">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Highest CTC Offered
            </span>
            <div className="flex items-center gap-1.5 mt-1">
              <Award className="h-4 w-4 text-indigo-600" />
              <span className="text-lg font-bold text-indigo-700">
                {placement ? `₹${placement.highestPackage} LPA` : "N/A"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
