"use client";

import Button from "@/components/common/Button";
import { useAuth } from "@/context/AuthContext";
import {
  AlertCircle,
  CheckCircle2,
  GraduationCap,
  MessageSquare,
  Plus,
  Sparkles,
  Star,
  ThumbsDown,
  ThumbsUp,
  UserCheck,
  X,
} from "lucide-react";
import React, { useState } from "react";

export interface ReviewItem {
  id: string;
  reviewerName: string;
  rating: number;
  title: string;
  pros: string;
  cons: string;
  courseName?: string | null;
  batchYear?: string | null;
  verifiedStudent: boolean;
  createdAt: string | Date;
}

interface ReviewsSectionProps {
  collegeId: string;
  collegeName: string;
  reviews: ReviewItem[];
  collegeRating: number;
  reviewCount: number;
}

const RATING_LABELS: Record<number, string> = {
  1: "1.0 - Needs Significant Improvement",
  2: "2.0 - Below Expectations",
  3: "3.0 - Average / Decent",
  4: "4.0 - Very Good Institute",
  5: "5.0 - Exceptional / World Class",
};

export default function ReviewsSection({
  collegeId,
  collegeName,
  reviews: initialReviews,
  collegeRating: initialRating,
  reviewCount: initialCount,
}: ReviewsSectionProps) {
  const { user } = useAuth();

  const [reviews, setReviews] = useState<ReviewItem[]>(initialReviews || []);
  const [rating, setRating] = useState(initialRating);
  const [count, setCount] = useState(initialCount);

  // Modal / Form state
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRating, setSelectedRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [title, setTitle] = useState("");
  const [pros, setPros] = useState("");
  const [cons, setCons] = useState("");
  const [courseName, setCourseName] = useState("");
  const [batchYear, setBatchYear] = useState("");
  const [reviewerName, setReviewerName] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const openForm = () => {
    if (user?.name) {
      setReviewerName(user.name);
    }
    setFormError(null);
    setIsOpen(true);
  };

  const closeForm = () => {
    setIsOpen(false);
    setFormError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (selectedRating < 1 || selectedRating > 5) {
      setFormError("Please select a star rating from 1 to 5.");
      return;
    }
    if (title.trim().length < 3) {
      setFormError("Review title must be at least 3 characters.");
      return;
    }
    if (pros.trim().length < 10) {
      setFormError("Please provide more detail in the Pros section (at least 10 characters).");
      return;
    }
    if (cons.trim().length < 10) {
      setFormError("Please provide more detail in the Cons section (at least 10 characters).");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          collegeId,
          rating: selectedRating,
          title: title.trim(),
          pros: pros.trim(),
          cons: cons.trim(),
          reviewerName: reviewerName.trim() || user?.name || "Student",
          courseName: courseName.trim() || null,
          batchYear: batchYear.trim() || null,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setFormError(data.error?.message || "Failed to submit rating and review.");
        return;
      }

      const { review: newReview, collegeStats } = data.data;

      // Update local state
      setReviews([newReview, ...reviews]);
      if (collegeStats) {
        setRating(collegeStats.rating);
        setCount(collegeStats.reviewCount);
      }

      setSuccessToast("Thank you! Your rating and review have been published.");
      closeForm();

      // Reset fields
      setTitle("");
      setPros("");
      setCons("");
      setCourseName("");
      setBatchYear("");

      setTimeout(() => setSuccessToast(null), 5000);
    } catch {
      setFormError("A network error occurred while submitting. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const activeStars = hoverRating || selectedRating;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-6">
      {/* Header with Stats and "Rate & Write Review" CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-emerald-600" />
            <span>Student & Alumni Reviews</span>
          </h2>
          <span className="text-xs text-slate-500">
            Unfiltered insights from enrolled students and recent graduates
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 rounded-xl bg-amber-500/10 px-3.5 py-1.5 text-amber-800 font-bold text-sm">
            <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
            <span>{rating.toFixed(1)} / 5.0</span>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            Based on {count} {count === 1 ? "rating" : "ratings"}
          </span>

          <button
            type="button"
            onClick={openForm}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs transition active:scale-[0.98] cursor-pointer"
          >
            <Star className="h-3.5 w-3.5 fill-white" />
            <span>Rate & Write Review</span>
          </button>
        </div>
      </div>

      {/* Success Notification */}
      {successToast && (
        <div className="flex items-center justify-between gap-2 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>{successToast}</span>
          </div>
          <button
            onClick={() => setSuccessToast(null)}
            className="text-slate-400 hover:text-slate-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Review Submission Modal Dialog */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="w-full max-w-xl bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-5 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Rate & Review {collegeName}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Share your genuine feedback to guide future aspirants.
                </p>
              </div>
              <button
                type="button"
                onClick={closeForm}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {formError && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Star Rating Interactive Selector */}
              <div className="bg-slate-50/80 border border-slate-200/80 rounded-2xl p-4 text-center space-y-2">
                <label className="block text-xs font-semibold text-slate-700">
                  Select Your Overall Rating <span className="text-rose-500">*</span>
                </label>
                <div className="flex items-center justify-center gap-2 pt-1">
                  {[1, 2, 3, 4, 5].map((starVal) => {
                    const isFilled = starVal <= activeStars;
                    return (
                      <button
                        key={starVal}
                        type="button"
                        onClick={() => setSelectedRating(starVal)}
                        onMouseEnter={() => setHoverRating(starVal)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-1 transition-transform duration-150 hover:scale-120 active:scale-95 cursor-pointer"
                      >
                        <Star
                          className={`h-8 w-8 transition-colors ${
                            isFilled
                              ? "fill-amber-400 text-amber-400"
                              : "text-slate-300 hover:text-slate-400"
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>
                <div className="text-xs font-bold text-amber-700 h-4">
                  {RATING_LABELS[activeStars] || ""}
                </div>
              </div>

              {/* Review Title */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  Review Headline / Summary <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Exceptional faculty, strong coding culture, and vibrant campus life"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:border-emerald-500 focus:ring-emerald-100"
                />
              </div>

              {/* Pros */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <ThumbsUp className="h-3.5 w-3.5 text-emerald-600" />
                  <span>The Good (What do you like most?) <span className="text-rose-500">*</span></span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={pros}
                  onChange={(e) => setPros(e.target.value)}
                  placeholder="Discuss great placements, helpful professors, library access, tech fests, coding clubs, hostel amenities..."
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:border-emerald-500 focus:ring-emerald-100"
                />
              </div>

              {/* Cons */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <ThumbsDown className="h-3.5 w-3.5 text-rose-600" />
                  <span>Points to Consider (What could be improved?) <span className="text-rose-500">*</span></span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={cons}
                  onChange={(e) => setCons(e.target.value)}
                  placeholder="Mention academic workload, strict attendance rules, mess food quality, or administrative turnaround times..."
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:border-emerald-500 focus:ring-emerald-100"
                />
              </div>

              {/* Course & Batch info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">
                    Course / Degree (Optional)
                  </label>
                  <input
                    type="text"
                    value={courseName}
                    onChange={(e) => setCourseName(e.target.value)}
                    placeholder="e.g. B.Tech Computer Science"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:border-emerald-500 focus:ring-emerald-100"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">
                    Batch / Graduation Year (Optional)
                  </label>
                  <input
                    type="text"
                    value={batchYear}
                    onChange={(e) => setBatchYear(e.target.value)}
                    placeholder="e.g. 2025"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:border-emerald-500 focus:ring-emerald-100"
                  />
                </div>
              </div>

              {/* Reviewer Name */}
              {!user && (
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">
                    Your Name (Optional / Anonymous)
                  </label>
                  <input
                    type="text"
                    value={reviewerName}
                    onChange={(e) => setReviewerName(e.target.value)}
                    placeholder="e.g. Rohan V. (or leave blank to post as Verified Student)"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:border-emerald-500 focus:ring-emerald-100"
                  />
                </div>
              )}

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={closeForm}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                >
                  Cancel
                </button>
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  isLoading={submitting}
                  className="px-5 text-xs font-bold shadow-sm"
                >
                  Publish Rating & Review
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <div className="rounded-2xl bg-slate-50 p-8 text-center space-y-3">
          <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
            <Star className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-800">
              Be the first to rate {collegeName}
            </p>
            <p className="text-xs text-slate-500 mt-0.5 max-w-sm mx-auto">
              Share your personal experience regarding campus placements, academics, and infrastructure.
            </p>
          </div>
          <button
            type="button"
            onClick={openForm}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            Write First Review
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="rounded-xl border border-slate-200 bg-slate-50/50 p-5 space-y-3 hover:bg-slate-50/80 transition"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900">
                      {rev.reviewerName}
                    </span>
                    {rev.verifiedStudent && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-800">
                        <UserCheck className="h-3 w-3" />
                        Verified Student
                      </span>
                    )}
                  </div>
                  {(rev.courseName || rev.batchYear) && (
                    <span className="text-xs text-slate-500">
                      {rev.courseName} {rev.batchYear ? `• Class of ${rev.batchYear}` : ""}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1 rounded-md bg-amber-50 px-2 py-1 text-xs font-bold text-amber-700">
                  <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                  <span>{Number(rev.rating).toFixed(1)}</span>
                </div>
              </div>

              <h4 className="text-sm font-bold text-slate-800">{rev.title}</h4>

              {/* Pros & Cons Box */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="rounded-lg bg-emerald-50/60 p-3 border border-emerald-100/80">
                  <div className="flex items-center gap-1 text-emerald-800 font-bold mb-1">
                    <ThumbsUp className="h-3.5 w-3.5" />
                    <span>The Good (Pros)</span>
                  </div>
                  <p className="text-slate-700 leading-relaxed">{rev.pros}</p>
                </div>

                <div className="rounded-lg bg-rose-50/60 p-3 border border-rose-100/80">
                  <div className="flex items-center gap-1 text-rose-800 font-bold mb-1">
                    <ThumbsDown className="h-3.5 w-3.5" />
                    <span>Points to Consider (Cons)</span>
                  </div>
                  <p className="text-slate-700 leading-relaxed">{rev.cons}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
