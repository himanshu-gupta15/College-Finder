import { Building2, CheckCircle2, Dumbbell, Home, Laptop, Library, Shield, Utensils, Wifi } from "lucide-react";

interface FacilityItem {
  id: string;
  name: string;
  icon?: string | null;
  description?: string | null;
}

interface FacilitiesSectionProps {
  facilities: FacilityItem[];
}

export default function FacilitiesSection({ facilities }: FacilitiesSectionProps) {
  if (!facilities || facilities.length === 0) return null;

  const getIcon = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes("wifi") || lower.includes("wi-fi")) return Wifi;
    if (lower.includes("library")) return Library;
    if (lower.includes("hostel") || lower.includes("residence")) return Home;
    if (lower.includes("lab") || lower.includes("comput")) return Laptop;
    if (lower.includes("gym") || lower.includes("sport") || lower.includes("pool")) return Dumbbell;
    if (lower.includes("cafe") || lower.includes("dining")) return Utensils;
    return Building2;
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
      <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
        <Building2 className="h-5 w-5 text-emerald-600" />
        <span>Campus Infrastructure & Facilities</span>
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {facilities.map((fac) => {
          const Icon = getIcon(fac.name);
          return (
            <div
              key={fac.id}
              className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/70 p-3.5"
            >
              <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600 shrink-0">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800">{fac.name}</h3>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                  {fac.description || "State-of-the-art facility available on campus."}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
