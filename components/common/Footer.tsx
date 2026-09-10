import { Compass, GraduationCap, Heart, MapPin, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-900 text-slate-400">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 to-emerald-400 text-white">
                <GraduationCap className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                College<span className="text-emerald-400">Finder</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              India's modern college discovery and comparison engine. Search, evaluate fees, analyze real placement statistics, and shortlist your dream college.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>Verified Data • NIRF & NAAC Integrated</span>
            </div>
          </div>

          {/* Popular Streams */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Explore by Stream
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/colleges?collegeType=Engineering" className="hover:text-emerald-400 transition-colors">
                  Engineering Colleges (IIT, NIT, BITS)
                </Link>
              </li>
              <li>
                <Link href="/colleges?collegeType=Management" className="hover:text-emerald-400 transition-colors">
                  Management & MBA (IIM, FMS, XLRI)
                </Link>
              </li>
              <li>
                <Link href="/colleges?collegeType=Medical" className="hover:text-emerald-400 transition-colors">
                  Medical & MBBS (AIIMS, CMC)
                </Link>
              </li>
              <li>
                <Link href="/colleges?collegeType=Law" className="hover:text-emerald-400 transition-colors">
                  Law Universities (NLSIU, NALSAR)
                </Link>
              </li>
              <li>
                <Link href="/colleges?collegeType=Design" className="hover:text-emerald-400 transition-colors">
                  Design Institutes (NID, IIT IDC)
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular Education Hubs */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Top Education Hubs
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/colleges?state=Delhi" className="hover:text-emerald-400 transition-colors">
                  Colleges in Delhi NCR
                </Link>
              </li>
              <li>
                <Link href="/colleges?city=Bengaluru" className="hover:text-emerald-400 transition-colors">
                  Colleges in Bengaluru
                </Link>
              </li>
              <li>
                <Link href="/colleges?city=Mumbai" className="hover:text-emerald-400 transition-colors">
                  Colleges in Mumbai
                </Link>
              </li>
              <li>
                <Link href="/colleges?city=Chennai" className="hover:text-emerald-400 transition-colors">
                  Colleges in Chennai
                </Link>
              </li>
              <li>
                <Link href="/colleges?city=Hyderabad" className="hover:text-emerald-400 transition-colors">
                  Colleges in Hyderabad
                </Link>
              </li>
            </ul>
          </div>

          {/* Tools & Resources */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Platform Tools
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/colleges" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <Compass className="h-3.5 w-3.5" />
                  College Search & Filter
                </Link>
              </li>
              <li>
                <Link href="/compare" className="hover:text-emerald-400 transition-colors">
                  College Compare Matrix
                </Link>
              </li>
              <li>
                <Link href="/saved-colleges" className="hover:text-emerald-400 transition-colors">
                  Saved Shortlists
                </Link>
              </li>
              <li>
                <Link href="/colleges?sort=rating_desc" className="hover:text-emerald-400 transition-colors">
                  Top Ranked Colleges
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} CollegeFinder. Built for AI Software Engineer Track A Assignment.</p>
          <div className="flex items-center gap-1">
            <span>Engineered with precision for students across India</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
