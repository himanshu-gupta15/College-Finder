import { BookOpen, Calendar, CheckCircle2, Flag, MapPin, ShieldCheck, Users } from "lucide-react";

interface CollegeOverviewProps {
  college: {
    name: string;
    overview: string;
    establishedYear: number;
    collegeType: string;
    ownership: string;
    affiliation?: string | null;
    accreditation?: string | null;
    city: string;
    state: string;
  };
}

export default function CollegeOverview({ college }: CollegeOverviewProps) {
  const highlights = [
    { label: "Institution Type", value: college.collegeType, icon: BookOpen },
    { label: "Ownership Structure", value: college.ownership, icon: ShieldCheck },
    { label: "Established Year", value: `${college.establishedYear} (${new Date().getFullYear() - college.establishedYear} Years of Excellence)`, icon: Calendar },
    { label: "Accreditation", value: college.accreditation || "UGC / AICTE Recognized", icon: Flag },
    { label: "Location", value: `${college.city}, ${college.state}`, icon: MapPin },
    { label: "Campus Governance", value: college.affiliation || "Autonomous University", icon: Users },
  ];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-6">
      <div>
        <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
          About {college.name}
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-slate-700 whitespace-pre-line">
          {college.overview}
        </p>
      </div>

      {/* Key Facts Matrix */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
          Quick Facts & Key Highlights
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {highlights.map((h, idx) => {
            const Icon = h.icon;
            return (
              <div
                key={idx}
                className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-3"
              >
                <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-[11px] font-medium text-slate-400 block uppercase">
                    {h.label}
                  </span>
                  <span className="text-xs font-bold text-slate-800 line-clamp-1 mt-0.5">
                    {h.value}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
