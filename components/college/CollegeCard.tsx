"use client";

import { useComparison } from "@/context/ComparisonContext";
import { useSavedColleges } from "@/context/SavedCollegesContext";
import { Award, Bookmark, Check, ChevronRight, IndianRupee, MapPin, Plus, Scale, Star, TrendingUp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export interface CollegeCardData {
  id: string;
  slug: string;
  name: string;
  shortName?: string | null;
  overview: string;
  establishedYear: number;
  collegeType: string;
  ownership: string;
  accreditation?: string | null;
  rating: number;
  reviewCount: number;
  minFees: number;
  maxFees: number;
  city: string;
  state: string;
  logoUrl?: string | null;
  bannerUrl?: string | null;
  courses?: {
    course: {
      name: string;
      degree: string;
      code: string;
    };
    annualFees: number;
  }[];
  placements?: {
    year: number;
    highestPackage: number;
    averagePackage: number;
    topRecruiters?: string;
  }[];
}

interface CollegeCardProps {
  college: CollegeCardData;
}

export default function CollegeCard({ college }: CollegeCardProps) {
  const { isSaved, toggleSave } = useSavedColleges();
  const { addToCompare, removeFromCompare, isInComparison } = useComparison();
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const saved = isSaved(college.id);
  const inComparison = isInComparison(college.id);
  const placement = college.placements?.[0];

  const formatLakhs = (amount: number) => {
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`;
    }
    return `₹${amount.toLocaleString("en-IN")}`;
  };

  const handleCompareClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

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

  const handleSaveClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const res = await toggleSave(college.id);
    if (res.error) {
      showToast(res.error);
    } else {
      showToast(res.isSaved ? "Saved to your profile!" : "Removed from saved colleges");
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md">
      {/* Toast popup */}
      {toastMessage && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-30 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-medium text-white shadow-lg animate-in fade-in zoom-in-95 duration-150">
          {toastMessage}
        </div>
      )}

      <div>
        {/* Top Header: Logo, Name, Location & Actions */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3.5">
            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-slate-100 bg-slate-50">
              {college.logoUrl ? (
                <Image
                  src={college.logoUrl}
                  alt={college.name}
                  fill
                  className="object-cover"
                  sizes="48px"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-emerald-100 text-emerald-800 font-bold text-lg">
                  {college.name.charAt(0)}
                </div>
              )}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-1.5 mb-1">
                <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
                  {college.collegeType}
                </span>
                <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-650">
                  {college.ownership}
                </span>
                {college.accreditation && (
                  <span className="flex items-center gap-1 rounded-md bg-indigo-50 px-2 py-0.5 text-[11px] font-medium text-indigo-700">
                    <Award className="h-3 w-3" />
                    {college.accreditation}
                  </span>
                )}
              </div>

              <Link
                href={`/colleges/${college.slug}`}
                className="font-bold text-slate-900 transition hover:text-emerald-600 line-clamp-1 text-base sm:text-lg"
              >
                {college.name}
              </Link>

              <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                <span>
                  {college.city}, {college.state}
                </span>
                <span className="text-slate-300">•</span>
                <span>Estd {college.establishedYear}</span>
              </div>
            </div>
          </div>

          {/* Quick Rating Badge & Save Heart */}
          <div className="flex flex-col items-end gap-1.5 shrink-0">
            <div className="flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-bold text-amber-700">
              <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
              <span>{college.rating.toFixed(1)}</span>
            </div>
            <button
              onClick={handleSaveClick}
              aria-label={saved ? "Remove from saved" : "Save college"}
              className={`p-1.5 rounded-lg border transition ${
                saved
                  ? "border-rose-200 bg-rose-50 text-rose-600"
                  : "border-slate-200 text-slate-400 hover:border-slate-300 hover:text-slate-600"
              }`}
            >
              <Bookmark className={`h-4 w-4 ${saved ? "fill-rose-600" : ""}`} />
            </button>
          </div>
        </div>

        {/* Short Overview snippet */}
        <p className="mt-3 text-xs text-slate-600 line-clamp-2 leading-relaxed">
          {college.overview}
        </p>

        {/* Key Metrics: Fees & Placements */}
        <div className="mt-4 grid grid-cols-2 gap-2 rounded-xl bg-slate-50/80 p-3 border border-slate-100">
          <div>
            <span className="text-[11px] font-medium text-slate-400 block uppercase tracking-wider">
              Annual Fees
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <IndianRupee className="h-3.5 w-3.5 text-slate-700" />
              <span className="text-sm font-bold text-slate-900">
                {formatLakhs(college.minFees)} - {formatLakhs(college.maxFees)}
              </span>
            </div>
          </div>

          <div>
            <span className="text-[11px] font-medium text-slate-400 block uppercase tracking-wider">
              Avg / High CTC
            </span>
            <div className="flex items-center gap-1 mt-0.5">
              <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />
              <span className="text-sm font-bold text-emerald-700">
                {placement ? `₹${placement.averagePackage} LPA` : "N/A"}
              </span>
              {placement && (
                <span className="text-xs text-slate-400">
                  / ₹{placement.highestPackage}L
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Popular Courses Tags */}
        {college.courses && college.courses.length > 0 && (
          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-medium text-slate-400">Courses:</span>
            {college.courses.slice(0, 3).map((item, idx) => (
              <span
                key={idx}
                className="rounded-md border border-slate-200 bg-white px-2 py-0.5 text-[11px] text-slate-700"
              >
                {item.course.degree || item.course.code}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Card Actions Footer */}
      <div className="mt-5 flex items-center gap-2 border-t border-slate-100 pt-3.5">
        <button
          onClick={handleCompareClick}
          className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg border py-2 text-xs font-semibold transition ${
            inComparison
              ? "border-indigo-600 bg-indigo-50 text-indigo-700"
              : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
          }`}
        >
          {inComparison ? (
            <>
              <Check className="h-3.5 w-3.5 text-indigo-600" />
              <span>Added to Compare</span>
            </>
          ) : (
            <>
              <Scale className="h-3.5 w-3.5 text-slate-500" />
              <span>Add to Compare</span>
            </>
          )}
        </button>

        <Link
          href={`/colleges/${college.slug}`}
          className="flex-1 flex items-center justify-center gap-1 rounded-lg bg-emerald-600 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-emerald-700 active:scale-[0.98]"
        >
          <span>View Details</span>
          <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
