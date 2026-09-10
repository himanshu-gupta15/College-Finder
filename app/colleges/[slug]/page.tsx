import CollegeHeader from "@/components/college/CollegeHeader";
import CollegeOverview from "@/components/college/CollegeOverview";
import CoursesSection from "@/components/college/CoursesSection";
import FacilitiesSection from "@/components/college/FacilitiesSection";
import PlacementSection from "@/components/college/PlacementSection";
import ReviewsSection from "@/components/college/ReviewsSection";
import { collegeService } from "@/services/college.service";
import { ChevronRight, Home } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

interface CollegePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CollegePageProps): Promise<Metadata> {
  const { slug } = await params;
  const college = await collegeService.getCollegeBySlug(slug);

  if (!college) {
    return {
      title: "College Not Found - CollegeFinder",
      description: "The requested college profile was not found.",
    };
  }

  return {
    title: `${college.name} - Cutoffs, Fees, Placements & Reviews | CollegeFinder`,
    description: `Explore ${college.name} located in ${college.city}, ${college.state}. Check annual fees, placement packages (Avg ₹${college.placements?.[0]?.averagePackage || 0} LPA), NIRF rankings, and verified student reviews.`,
    openGraph: {
      title: `${college.name} (${college.shortName || college.name}) - Admission & Placements`,
      description: college.overview.slice(0, 160),
      images: college.bannerUrl ? [college.bannerUrl] : [],
    },
  };
}

export default async function CollegeDetailPage({ params }: CollegePageProps) {
  const { slug } = await params;
  let college = await collegeService.getCollegeBySlug(slug);

  if (!college) {
    college = await collegeService.getCollegeById(slug);
  }

  if (!college) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 space-y-6">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-slate-500">
        <Link href="/" className="hover:text-emerald-600 transition flex items-center gap-1">
          <Home className="h-3.5 w-3.5" />
          <span>Home</span>
        </Link>
        <ChevronRight className="h-3 w-3 text-slate-400" />
        <Link href="/colleges" className="hover:text-emerald-600 transition">
          Colleges
        </Link>
        <ChevronRight className="h-3 w-3 text-slate-400" />
        <Link
          href={`/colleges?collegeType=${encodeURIComponent(college.collegeType)}`}
          className="hover:text-emerald-600 transition"
        >
          {college.collegeType}
        </Link>
        <ChevronRight className="h-3 w-3 text-slate-400" />
        <span className="font-semibold text-slate-800 truncate max-w-[200px] sm:max-w-xs">
          {college.shortName || college.name}
        </span>
      </nav>

      {/* Main Header Component */}
      <CollegeHeader college={college as any} />

      {/* Body Grid with Sticky Navigation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left 2 Columns: Main Details Sections */}
        <div className="lg:col-span-2 space-y-8">
          <CollegeOverview college={college} />
          <CoursesSection courses={college.courses as any} />
          <PlacementSection placements={college.placements as any} />
          <FacilitiesSection facilities={college.facilities as any} />
          <ReviewsSection
            reviews={college.reviews as any}
            collegeRating={college.rating}
            reviewCount={college.reviewCount}
          />
        </div>

        {/* Right 1 Column: Sticky Highlights & Contact Card */}
        <aside className="space-y-6 lg:sticky lg:top-20">
          {/* Quick Summary Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2.5">
              Admission & Inquiry
            </h3>

            <div className="space-y-3 text-xs text-slate-600">
              <div>
                <span className="font-semibold text-slate-800 block">Campus Address:</span>
                <p className="mt-0.5">{college.address}</p>
              </div>

              <div>
                <span className="font-semibold text-slate-800 block">Affiliated Body:</span>
                <p className="mt-0.5">{college.affiliation || "Recognized University"}</p>
              </div>

              <div>
                <span className="font-semibold text-slate-800 block">Accreditation Status:</span>
                <p className="mt-0.5">{college.accreditation || "UGC / AICTE Approved"}</p>
              </div>

              {college.website && (
                <div className="pt-2">
                  <a
                    href={college.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-slate-900 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-slate-800 transition"
                  >
                    Visit Official Portal
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Compare Helper Card */}
          <div className="rounded-2xl border border-indigo-100 bg-indigo-50/60 p-5 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-indigo-950">
              Compare with Other Top Colleges
            </h3>
            <p className="text-xs text-indigo-800/80 leading-relaxed">
              Add {college.shortName || college.name} to the comparison matrix to evaluate it against other premier institutes side-by-side.
            </p>
            <Link
              href="/compare"
              className="inline-flex items-center gap-1 text-xs font-bold text-indigo-700 hover:text-indigo-900 hover:underline"
            >
              Open Comparison Matrix →
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
