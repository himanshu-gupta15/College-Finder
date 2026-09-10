import CollegeCard from "@/components/college/CollegeCard";
import CollegeSearch from "@/components/college/CollegeSearch";
import { collegeService } from "@/services/college.service";
import {
  ArrowRight,
  Award,
  BookOpen,
  Briefcase,
  Building,
  CheckCircle,
  Compass,
  GraduationCap,
  MapPin,
  Scale,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default async function HomePage() {
  // Fetch top featured colleges for the homepage
  const { colleges: featuredColleges } = await collegeService.getColleges({
    sort: "rating_desc",
    limit: 6,
    page: 1,
  });

  const streams = [
    {
      name: "Engineering",
      count: "25+ Top Institutes",
      tag: "B.Tech / M.Tech",
      href: "/colleges?collegeType=Engineering",
      icon: BookOpen,
      color: "bg-blue-50 text-blue-700 border-blue-200",
    },
    {
      name: "Management",
      count: "10+ IIMs & B-Schools",
      tag: "MBA / PGDM",
      href: "/colleges?collegeType=Management",
      icon: TrendingUp,
      color: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    {
      name: "Medical",
      count: "AIIMS & Premier Colleges",
      tag: "MBBS / MD",
      href: "/colleges?collegeType=Medical",
      icon: ShieldCheck,
      color: "bg-rose-50 text-rose-700 border-rose-200",
    },
    {
      name: "Design & Arts",
      count: "NID & Top Colleges",
      tag: "B.Des / M.Des",
      href: "/colleges?collegeType=Design",
      icon: Sparkles,
      color: "bg-amber-50 text-amber-700 border-amber-200",
    },
    {
      name: "Law & Legal Studies",
      count: "NLSIU & NLU Network",
      tag: "B.A. LL.B. (Hons)",
      href: "/colleges?collegeType=Law",
      icon: Scale,
      color: "bg-purple-50 text-purple-700 border-purple-200",
    },
    {
      name: "Commerce & Sciences",
      count: "DU SRCC, Hindu, Miranda",
      tag: "B.A. / B.Sc",
      href: "/colleges?collegeType=Arts%20%26%20Science",
      icon: GraduationCap,
      color: "bg-teal-50 text-teal-700 border-teal-200",
    },
  ];

  const popularCities = [
    { city: "New Delhi", count: "12 Colleges", state: "Delhi NCR", img: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=500&auto=format&fit=crop&q=80" },
    { city: "Bengaluru", count: "10 Colleges", state: "Karnataka", img: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=500&auto=format&fit=crop&q=80" },
    { city: "Mumbai", count: "8 Colleges", state: "Maharashtra", img: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=500&auto=format&fit=crop&q=80" },
    { city: "Chennai", count: "7 Colleges", state: "Tamil Nadu", img: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=500&auto=format&fit=crop&q=80" },
  ];

  return (
    <div className="flex flex-col space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 text-white pt-16 pb-24 px-4 sm:px-6 lg:px-8">
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30" />

        <div className="relative mx-auto max-w-5xl text-center space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold text-emerald-300 backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Over 60+ Premier Indian Institutions Indexed</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight sm:leading-none text-balance">
            Find Your Dream College in India. <br />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              Compare Fees, CTC & Rankings.
            </span>
          </h1>

          <p className="mx-auto max-w-2xl text-base sm:text-lg text-slate-300 leading-relaxed">
            Data-backed discovery platform for Indian students. Search verified cutoffs, compare realistic placement packages, and evaluate multi-disciplinary degree programs.
          </p>

          {/* Hero Search Box */}
          <div className="pt-4">
            <CollegeSearch />
          </div>

          {/* Quick Metrics Strip */}
          <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto text-left">
            <div className="rounded-2xl border border-slate-800 bg-slate-800/50 p-4 backdrop-blur-xs">
              <div className="text-2xl font-extrabold text-white">60+</div>
              <div className="text-xs text-slate-400 mt-0.5">Premier Institutes</div>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-800/50 p-4 backdrop-blur-xs">
              <div className="text-2xl font-extrabold text-emerald-400">₹92 LPA</div>
              <div className="text-xs text-slate-400 mt-0.5">Peak Placement CTC</div>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-800/50 p-4 backdrop-blur-xs">
              <div className="text-2xl font-extrabold text-indigo-400">14+</div>
              <div className="text-xs text-slate-400 mt-0.5">States & Education Hubs</div>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-800/50 p-4 backdrop-blur-xs">
              <div className="text-2xl font-extrabold text-amber-400">100%</div>
              <div className="text-xs text-slate-400 mt-0.5">Verified Database Data</div>
            </div>
          </div>
        </div>
      </section>

      {/* Explore by Stream Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
              Academic Disciplines
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
              Explore Colleges by Stream
            </h2>
          </div>
          <Link
            href="/colleges"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-600 hover:text-emerald-700"
          >
            <span>View All Streams</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {streams.map((stream) => {
            const Icon = stream.icon;
            return (
              <Link
                key={stream.name}
                href={stream.href}
                className="group flex items-start gap-4 rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs transition-all hover:-translate-y-0.5 hover:border-emerald-500 hover:shadow-md"
              >
                <div className={`rounded-xl p-3 border ${stream.color} shrink-0`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                    {stream.tag}
                  </span>
                  <h3 className="font-bold text-slate-900 group-hover:text-emerald-600 transition text-base mt-1">
                    {stream.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">{stream.count}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured Premier Colleges Grid */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
              Top Ranked Institutions
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
              Featured Institutes of National Importance
            </h2>
          </div>
          <Link
            href="/colleges?sort=rating_desc"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-600 hover:text-emerald-700"
          >
            <span>Explore All 60+ Colleges</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredColleges.map((college) => (
            <CollegeCard key={college.id} college={college as any} />
          ))}
        </div>
      </section>

      {/* Education Hubs by City */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        <div className="mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
            Geographic Discovery
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
            Top Education Hubs Across India
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {popularCities.map((hub) => (
            <Link
              key={hub.city}
              href={`/colleges?city=${encodeURIComponent(hub.city)}`}
              className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-900 h-48 shadow-xs hover:shadow-lg transition"
            >
              <Image
                src={hub.img}
                alt={hub.city}
                fill
                className="object-cover opacity-60 group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 100vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <span className="text-[11px] font-semibold text-emerald-400">
                  {hub.state}
                </span>
                <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition">
                  {hub.city}
                </h3>
                <p className="text-xs text-slate-300">{hub.count}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Compare Feature CTA Banner */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white p-8 sm:p-12 shadow-xl">
          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-500/20 px-3 py-1 text-xs font-bold text-indigo-300">
              <Scale className="h-4 w-4" />
              <span>Multi-College Comparison Engine</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Confused Between 2 or 3 Colleges? Compare Them Side-by-Side.
            </h2>

            <p className="text-sm sm:text-base text-indigo-200 leading-relaxed">
              Evaluate real fee structures, average CTC packages, NIRF rankings, and accreditation matrices horizontally on desktop or mobile.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link
                href="/compare"
                className="rounded-xl bg-white px-6 py-3 text-sm font-bold text-indigo-950 shadow-md transition hover:bg-indigo-50 active:scale-[0.98]"
              >
                Launch Comparison Matrix
              </Link>
              <Link
                href="/colleges"
                className="rounded-xl border border-indigo-400/40 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700/50"
              >
                Browse Colleges First
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
