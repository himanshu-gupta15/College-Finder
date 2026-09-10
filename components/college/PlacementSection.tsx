import { Award, Briefcase, Building, CheckCircle2, Percent, TrendingUp } from "lucide-react";

interface PlacementData {
  id: string;
  year: number;
  highestPackage: number;
  averagePackage: number;
  medianPackage?: number | null;
  placementRate: number;
  topRecruiters: string;
}

interface PlacementSectionProps {
  placements: PlacementData[];
}

export default function PlacementSection({ placements }: PlacementSectionProps) {
  if (!placements || placements.length === 0) {
    return null;
  }

  const current = placements[0];
  const recruiters = current.topRecruiters
    ? current.topRecruiters.split(",").map((r) => r.trim()).filter(Boolean)
    : [];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-emerald-600" />
          <span>Placement Statistics & Salary Packages ({current.year})</span>
        </h2>
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
          {current.placementRate}% Placed
        </span>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-4">
          <div className="flex items-center gap-2 text-indigo-700 mb-1">
            <Award className="h-4 w-4" />
            <span className="text-xs font-bold uppercase tracking-wider">
              Highest CTC Offered
            </span>
          </div>
          <div className="text-2xl font-black text-indigo-900">
            ₹{current.highestPackage} LPA
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            Offered by international / domestic marquee tech recruiters
          </span>
        </div>

        <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-4">
          <div className="flex items-center gap-2 text-emerald-700 mb-1">
            <TrendingUp className="h-4 w-4" />
            <span className="text-xs font-bold uppercase tracking-wider">
              Average CTC Package
            </span>
          </div>
          <div className="text-2xl font-black text-emerald-900">
            ₹{current.averagePackage} LPA
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            Comprehensive batch average across all participating disciplines
          </span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center gap-2 text-slate-700 mb-1">
            <Percent className="h-4 w-4" />
            <span className="text-xs font-bold uppercase tracking-wider">
              Placement Percentage
            </span>
          </div>
          <div className="text-2xl font-black text-slate-900">
            {current.placementRate}%
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            Total registered eligible students placed in graduating batch
          </span>
        </div>
      </div>

      {/* Top Recruiters */}
      {recruiters.length > 0 && (
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
            <Building className="h-3.5 w-3.5" />
            <span>Top Marquee Recruiters</span>
          </h3>
          <div className="flex flex-wrap gap-2">
            {recruiters.map((recruiter, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-800 shadow-2xs"
              >
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                {recruiter}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
