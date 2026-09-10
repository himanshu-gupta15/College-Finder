"use client";

import { ArrowRight, Building, MapPin, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CollegeSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/colleges?search=${encodeURIComponent(query.trim())}`);
    } else {
      router.push("/colleges");
    }
  };

  const quickLinks = [
    { label: "IITs", query: "IIT" },
    { label: "IIMs", query: "IIM" },
    { label: "Engineering", query: "Engineering", type: "collegeType" },
    { label: "Medical / AIIMS", query: "Medical", type: "collegeType" },
    { label: "Delhi NCR", query: "Delhi", type: "state" },
    { label: "Bengaluru", query: "Bengaluru", type: "city" },
  ];

  return (
    <div className="w-full max-w-3xl mx-auto">
      <form
        onSubmit={handleSearch}
        className="relative flex items-center rounded-2xl bg-white p-2 shadow-lg ring-1 ring-slate-900/10 transition-all focus-within:ring-2 focus-within:ring-emerald-500"
      >
        <div className="flex pl-3 text-slate-400">
          <Search className="h-6 w-6 text-emerald-600" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by college name, city (e.g. Mumbai), state, or course..."
          className="w-full bg-transparent px-3 py-3 text-base text-slate-900 placeholder:text-slate-400 focus:outline-none"
        />
        <button
          type="submit"
          className="flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 active:scale-[0.98]"
        >
          <span>Search</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </form>

      {/* Quick search tags */}
      <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs">
        <span className="text-slate-500 font-medium">Popular Searches:</span>
        {quickLinks.map((item) => (
          <button
            key={item.label}
            type="button"
            onClick={() => {
              if (item.type === "collegeType") {
                router.push(`/colleges?collegeType=${item.query}`);
              } else if (item.type === "state") {
                router.push(`/colleges?state=${item.query}`);
              } else if (item.type === "city") {
                router.push(`/colleges?city=${item.query}`);
              } else {
                router.push(`/colleges?search=${encodeURIComponent(item.query)}`);
              }
            }}
            className="rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-slate-700 backdrop-blur-xs transition hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-700"
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}
