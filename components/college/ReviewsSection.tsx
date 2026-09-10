import { CheckCircle2, MessageSquare, Star, ThumbsDown, ThumbsUp, UserCheck } from "lucide-react";

interface ReviewItem {
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
  reviews: ReviewItem[];
  collegeRating: number;
  reviewCount: number;
}

export default function ReviewsSection({
  reviews,
  collegeRating,
  reviewCount,
}: ReviewsSectionProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-emerald-600" />
            <span>Student & Alumni Reviews</span>
          </h2>
          <span className="text-xs text-slate-500">
            Unfiltered insights from enrolled students and recent graduates
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 rounded-xl bg-amber-500/10 px-3.5 py-1.5 text-amber-800 font-bold text-sm">
            <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
            <span>{collegeRating.toFixed(1)} / 5.0</span>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            Based on {reviewCount} ratings
          </span>
        </div>
      </div>

      {reviews.length === 0 ? (
        <div className="rounded-xl bg-slate-50 p-6 text-center text-sm text-slate-500">
          No student reviews have been posted for this institution yet.
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="rounded-xl border border-slate-200 bg-slate-50/50 p-5 space-y-3"
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
                  <span>{rev.rating.toFixed(1)}</span>
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
