"use client";

import { Filter, IndianRupee, RotateCcw, Search, Star } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface FilterOptions {
  states: string[];
  cities: string[];
  collegeTypes: string[];
}

interface CollegeFiltersProps {
  initialOptions?: FilterOptions;
  onFilterApplied?: () => void;
}

export default function CollegeFilters({
  initialOptions,
  onFilterApplied,
}: CollegeFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [options, setOptions] = useState<FilterOptions>(
    initialOptions || {
      states: ["Delhi", "Maharashtra", "Karnataka", "Tamil Nadu", "Uttar Pradesh", "Telangana", "West Bengal", "Gujarat"],
      cities: ["New Delhi", "Mumbai", "Bengaluru", "Chennai", "Kanpur", "Hyderabad", "Kolkata", "Ahmedabad", "Pune"],
      collegeTypes: ["Engineering", "Management", "Medical", "Arts & Science", "Law", "Design"],
    }
  );

  // Local filter states synced with URL
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const [selectedState, setSelectedState] = useState(searchParams.get("state") || "");
  const [selectedCity, setSelectedCity] = useState(searchParams.get("city") || "");
  const [selectedType, setSelectedType] = useState(searchParams.get("collegeType") || "");
  const [selectedOwnership, setSelectedOwnership] = useState(searchParams.get("ownership") || "");
  const [selectedRating, setSelectedRating] = useState(searchParams.get("minRating") || "");
  const [maxFees, setMaxFees] = useState(searchParams.get("maxFees") || "");

  // Load distinct filter options and update cities when selectedState changes
  useEffect(() => {
    if (initialOptions && !selectedState) return;

    const url = selectedState
      ? `/api/colleges/filters?state=${encodeURIComponent(selectedState)}`
      : "/api/colleges/filters";

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setOptions((prev) => ({
            ...prev,
            states: data.data.states?.length ? data.data.states : prev.states,
            cities: data.data.cities || [],
            collegeTypes: data.data.collegeTypes?.length ? data.data.collegeTypes : prev.collegeTypes,
          }));
        }
      })
      .catch(() => {});
  }, [selectedState, initialOptions]);

  // Keep in sync if search params change externally
  useEffect(() => {
    setSearchTerm(searchParams.get("search") || "");
    setSelectedState(searchParams.get("state") || "");
    setSelectedCity(searchParams.get("city") || "");
    setSelectedType(searchParams.get("collegeType") || "");
    setSelectedOwnership(searchParams.get("ownership") || "");
    setSelectedRating(searchParams.get("minRating") || "");
    setMaxFees(searchParams.get("maxFees") || "");
  }, [searchParams]);

  const applyFilters = (overrides: Record<string, string | null> = {}) => {
    const params = new URLSearchParams(searchParams.toString());

    const updates = {
      search: searchTerm,
      state: selectedState,
      city: selectedCity,
      collegeType: selectedType,
      ownership: selectedOwnership,
      minRating: selectedRating,
      maxFees: maxFees,
      page: "1", // reset to page 1 on filter update
      ...overrides,
    };

    Object.entries(updates).forEach(([key, val]) => {
      if (val && val.trim() !== "") {
        params.set(key, val);
      } else {
        params.delete(key);
      }
    });

    router.push(`/colleges?${params.toString()}`);
    if (onFilterApplied) onFilterApplied();
  };

  const handleReset = () => {
    setSearchTerm("");
    setSelectedState("");
    setSelectedCity("");
    setSelectedType("");
    setSelectedOwnership("");
    setSelectedRating("");
    setMaxFees("");
    router.push("/colleges");
    if (onFilterApplied) onFilterApplied();
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2 text-slate-900 font-bold">
          <Filter className="h-4 w-4 text-emerald-600" />
          <span>Filters</span>
        </div>
        <button
          onClick={handleReset}
          className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-emerald-600 transition"
        >
          <RotateCcw className="h-3 w-3" />
          <span>Reset All</span>
        </button>
      </div>

      {/* College Search input */}
      <div className="space-y-1.5">
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
          Search by Name or Keyword
        </label>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && applyFilters()}
            placeholder="e.g. IIT, BITS, Engineering..."
            className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-xs text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-none"
          />
        </div>
      </div>

      {/* College Stream / Category */}
      <div className="space-y-1.5">
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
          Stream / Discipline
        </label>
        <select
          value={selectedType}
          onChange={(e) => {
            setSelectedType(e.target.value);
            applyFilters({ collegeType: e.target.value });
          }}
          className="w-full rounded-lg border border-slate-200 bg-white py-2 px-3 text-xs text-slate-800 focus:border-emerald-500 focus:outline-none"
        >
          <option value="">All Streams</option>
          {options.collegeTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      {/* State Filter */}
      <div className="space-y-1.5">
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
          State
        </label>
        <select
          value={selectedState}
          onChange={(e) => {
            setSelectedState(e.target.value);
            setSelectedCity(""); // reset city when state changes
            applyFilters({ state: e.target.value, city: "" });
          }}
          className="w-full rounded-lg border border-slate-200 bg-white py-2 px-3 text-xs text-slate-800 focus:border-emerald-500 focus:outline-none"
        >
          <option value="">All States</option>
          {options.states.map((st) => (
            <option key={st} value={st}>
              {st}
            </option>
          ))}
        </select>
      </div>

      {/* City Filter */}
      <div className="space-y-1.5">
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
          City
        </label>
        <select
          value={selectedCity}
          onChange={(e) => {
            setSelectedCity(e.target.value);
            applyFilters({ city: e.target.value });
          }}
          className="w-full rounded-lg border border-slate-200 bg-white py-2 px-3 text-xs text-slate-800 focus:border-emerald-500 focus:outline-none"
        >
          <option value="">All Cities</option>
          {options.cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>

      {/* Ownership Type */}
      <div className="space-y-2">
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
          Ownership
        </label>
        <div className="flex items-center gap-2">
          {["", "Public", "Private"].map((own) => (
            <button
              key={own || "all"}
              type="button"
              onClick={() => {
                setSelectedOwnership(own);
                applyFilters({ ownership: own });
              }}
              className={`flex-1 rounded-lg py-1.5 text-xs font-semibold border transition ${
                selectedOwnership === own
                  ? "border-emerald-600 bg-emerald-50 text-emerald-700"
                  : "border-slate-200 bg-white text-slate-650 hover:bg-slate-50"
              }`}
            >
              {own === "" ? "Any" : own}
            </button>
          ))}
        </div>
      </div>

      {/* Minimum Rating */}
      <div className="space-y-2">
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
          Minimum Rating
        </label>
        <div className="grid grid-cols-4 gap-1.5">
          {["", "4.0", "4.5", "4.8"].map((rat) => (
            <button
              key={rat || "all"}
              type="button"
              onClick={() => {
                setSelectedRating(rat);
                applyFilters({ minRating: rat });
              }}
              className={`flex items-center justify-center gap-1 rounded-lg py-1.5 text-xs font-semibold border transition ${
                selectedRating === rat
                  ? "border-amber-500 bg-amber-50 text-amber-800"
                  : "border-slate-200 bg-white text-slate-650 hover:bg-slate-50"
              }`}
            >
              {rat === "" ? (
                "Any"
              ) : (
                <>
                  <span>{rat}</span>
                  <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                </>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Max Annual Fees */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
            Max Annual Fees
          </label>
          <span className="text-xs font-bold text-emerald-700">
            {maxFees ? `₹${(Number(maxFees) / 100000).toFixed(1)} Lakhs` : "No Limit"}
          </span>
        </div>
        <input
          type="range"
          min="50000"
          max="1500000"
          step="50000"
          value={maxFees || "1500000"}
          onChange={(e) => setMaxFees(e.target.value)}
          onMouseUp={() => applyFilters({ maxFees })}
          onTouchEnd={() => applyFilters({ maxFees })}
          className="w-full accent-emerald-600 cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-slate-400">
          <span>₹50K</span>
          <span>₹5L</span>
          <span>₹15L+</span>
        </div>
      </div>

      <button
        onClick={() => applyFilters()}
        className="w-full rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white shadow-xs transition hover:bg-emerald-700 active:scale-[0.98]"
      >
        Apply Filters
      </button>
    </div>
  );
}
