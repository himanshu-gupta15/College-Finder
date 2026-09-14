"use client";

import Button from "@/components/common/Button";
import {
  AlertCircle,
  Building2,
  Check,
  ChevronLeft,
  DollarSign,
  ExternalLink,
  GraduationCap,
  Image as ImageIcon,
  MapPin,
  Plus,
  RefreshCw,
  Sparkles,
  Star,
  Trash2,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

function normalizeUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  if (!trimmed) return null;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return "https://" + trimmed;
}

const STANDARD_FACILITIES = [
  "Wi-Fi Campus",
  "Central Library",
  "Boys Hostel",
  "Girls Hostel",
  "Sports Complex",
  "High-Tech Computer Labs",
  "Cafeteria",
  "Auditorium",
  "Gymnasium",
  "Medical Hospital",
  "Placement Cell",
  "Innovation & Incubation Hub",
  "Swimming Pool",
  "ATM & Banking Facility",
  "Transport Service",
];

const COLLEGE_TYPES = [
  "Engineering",
  "Management",
  "Medical",
  "Arts & Science",
  "Law",
  "Design",
  "Architecture",
  "Pharmacy",
  "Commerce",
];

interface AdminCollegeFormProps {
  initialData?: {
    id?: string;
    name: string;
    slug: string;
    shortName?: string | null;
    overview: string;
    establishedYear: number;
    collegeType: string;
    ownership: "Public" | "Private";
    affiliation?: string | null;
    accreditation?: string | null;
    rating: number;
    reviewCount: number;
    minFees: number;
    maxFees: number;
    city: string;
    state: string;
    address: string;
    website?: string | null;
    logoUrl?: string | null;
    bannerUrl?: string | null;
    placements?: {
      year: number;
      highestPackage: number;
      averagePackage: number;
      medianPackage?: number | null;
      placementRate: number;
      topRecruiters: string;
    }[];
    facilities?: { name: string }[];
  };
  isEdit?: boolean;
}

export default function AdminCollegeForm({
  initialData,
  isEdit = false,
}: AdminCollegeFormProps) {
  const router = useRouter();

  // Core Fields
  const [name, setName] = useState(initialData?.name || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [slugAuto, setSlugAuto] = useState(!isEdit);
  const [shortName, setShortName] = useState(initialData?.shortName || "");
  const [overview, setOverview] = useState(initialData?.overview || "");
  const [establishedYear, setEstablishedYear] = useState<number | string>(
    initialData?.establishedYear || new Date().getFullYear() - 20
  );
  const [collegeType, setCollegeType] = useState(
    initialData?.collegeType || "Engineering"
  );
  const [ownership, setOwnership] = useState<"Public" | "Private">(
    initialData?.ownership || "Public"
  );
  const [affiliation, setAffiliation] = useState(
    initialData?.affiliation || ""
  );
  const [accreditation, setAccreditation] = useState(
    initialData?.accreditation || ""
  );
  const [rating, setRating] = useState<number>(initialData?.rating || 4.2);
  const [reviewCount, setReviewCount] = useState<number>(
    initialData?.reviewCount || 0
  );

  // Fees
  const [minFees, setMinFees] = useState<number | string>(
    initialData?.minFees || 100000
  );
  const [maxFees, setMaxFees] = useState<number | string>(
    initialData?.maxFees || 250000
  );

  // Location & Media
  const [city, setCity] = useState(initialData?.city || "");
  const [state, setState] = useState(initialData?.state || "");
  const [address, setAddress] = useState(initialData?.address || "");
  const [website, setWebsite] = useState(initialData?.website || "");
  const [logoUrl, setLogoUrl] = useState(initialData?.logoUrl || "");
  const [bannerUrl, setBannerUrl] = useState(initialData?.bannerUrl || "");

  // Placements
  const latestPlacement = initialData?.placements?.[0];
  const [placementYear, setPlacementYear] = useState<number>(
    latestPlacement?.year || 2024
  );
  const [highestPackage, setHighestPackage] = useState<number | string>(
    latestPlacement?.highestPackage ?? 24.5
  );
  const [averagePackage, setAveragePackage] = useState<number | string>(
    latestPlacement?.averagePackage ?? 8.5
  );
  const [medianPackage, setMedianPackage] = useState<number | string>(
    latestPlacement?.medianPackage ?? 7.5
  );
  const [placementRate, setPlacementRate] = useState<number | string>(
    latestPlacement?.placementRate ?? 90
  );
  const [topRecruiters, setTopRecruiters] = useState<string>(
    latestPlacement?.topRecruiters || "TCS, Infosys, Amazon, Microsoft, Wipro"
  );

  // Facilities
  const initialFacilities =
    initialData?.facilities?.map((f) => f.name) || [
      "Wi-Fi Campus",
      "Central Library",
      "Sports Complex",
      "High-Tech Computer Labs",
    ];
  const [selectedFacilities, setSelectedFacilities] =
    useState<string[]>(initialFacilities);
  const [customFacility, setCustomFacility] = useState("");

  // States
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Handle Slug Auto Generation
  const handleNameChange = (val: string) => {
    setName(val);
    if (slugAuto && !isEdit) {
      const generated = val
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
      setSlug(generated);
    }
  };

  const regenerateSlug = () => {
    const generated = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
    setSlug(generated);
  };

  const toggleFacility = (facility: string) => {
    if (selectedFacilities.includes(facility)) {
      setSelectedFacilities(selectedFacilities.filter((f) => f !== facility));
    } else {
      setSelectedFacilities([...selectedFacilities, facility]);
    }
  };

  const addCustomFacility = () => {
    const trimmed = customFacility.trim();
    if (trimmed && !selectedFacilities.includes(trimmed)) {
      setSelectedFacilities([...selectedFacilities, trimmed]);
      setCustomFacility("");
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!name.trim() || name.trim().length < 2) {
      newErrors.name = "College name must be at least 2 characters.";
    }
    if (!slug.trim() || !/^[a-z0-9-]+$/.test(slug)) {
      newErrors.slug =
        "Slug must be lowercase alphanumeric and hyphens (e.g. iit-delhi).";
    }
    if (!overview.trim() || overview.trim().length < 10) {
      newErrors.overview = "Overview must be at least 10 characters.";
    }
    const year = Number(establishedYear);
    if (isNaN(year) || year < 1800 || year > new Date().getFullYear() + 1) {
      newErrors.establishedYear = `Established year must be between 1800 and ${new Date().getFullYear()}.`;
    }
    if (!city.trim()) {
      newErrors.city = "City is required.";
    }
    if (!state.trim()) {
      newErrors.state = "State is required.";
    }
    if (!address.trim() || address.trim().length < 5) {
      newErrors.address = "Detailed address is required (at least 5 characters).";
    }

    const minF = Number(minFees);
    const maxF = Number(maxFees);
    if (isNaN(minF) || minF < 0) {
      newErrors.minFees = "Minimum fee must be 0 or higher.";
    }
    if (isNaN(maxF) || maxF < 0) {
      newErrors.maxFees = "Maximum fee must be 0 or higher.";
    }
    if (!isNaN(minF) && !isNaN(maxF) && minF > maxF) {
      newErrors.maxFees = "Maximum fee cannot be less than Minimum fee.";
    }

    const highPkg = Number(highestPackage);
    const avgPkg = Number(averagePackage);
    if (!isNaN(highPkg) && !isNaN(avgPkg) && highPkg > 0 && avgPkg > highPkg) {
      newErrors.averagePackage = "Average package cannot exceed Highest package.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    if (!validateForm()) {
      setStatusMessage({
        type: "error",
        text: "Please correct the highlighted errors before saving.",
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setLoading(true);

    const payload = {
      name: name.trim(),
      slug: slug.trim(),
      shortName: shortName.trim() || null,
      overview: overview.trim(),
      establishedYear: Number(establishedYear),
      collegeType,
      ownership,
      affiliation: affiliation.trim() || null,
      accreditation: accreditation.trim() || null,
      rating: Number(rating),
      reviewCount: Number(reviewCount),
      minFees: Number(minFees),
      maxFees: Number(maxFees),
      city: city.trim(),
      state: state.trim(),
      address: address.trim(),
      website: normalizeUrl(website),
      logoUrl: normalizeUrl(logoUrl),
      bannerUrl: normalizeUrl(bannerUrl),
      placement: {
        year: Number(placementYear),
        highestPackage: Number(highestPackage),
        averagePackage: Number(averagePackage),
        medianPackage: medianPackage ? Number(medianPackage) : null,
        placementRate: Number(placementRate),
        topRecruiters: topRecruiters.trim(),
      },
      facilities: selectedFacilities,
    };

    try {
      const url = isEdit
        ? `/api/admin/colleges/${initialData?.id}`
        : "/api/admin/colleges";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        if (data.error?.details) {
          const detailErrors: Record<string, string> = {};
          Object.entries(data.error.details).forEach(([k, v]) => {
            if (Array.isArray(v) && v.length > 0) {
              detailErrors[k] = v[0] as string;
            }
          });
          setErrors(detailErrors);
        }
        setStatusMessage({
          type: "error",
          text:
            data.error?.message ||
            "Failed to save college details. Please check values.",
        });
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }

      setStatusMessage({
        type: "success",
        text: isEdit
          ? "College details updated successfully!"
          : "New college created successfully!",
      });

      // Redirect after brief delay
      setTimeout(() => {
        router.push(`/colleges/${data.data.slug}`);
        router.refresh();
      }, 1200);
    } catch {
      setStatusMessage({
        type: "error",
        text: "Network or server error occurred while saving.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!initialData?.id) return;
    setDeleting(true);

    try {
      const res = await fetch(`/api/admin/colleges/${initialData.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setStatusMessage({
          type: "error",
          text: data.error?.message || "Failed to delete college.",
        });
        setConfirmDelete(false);
        return;
      }

      router.push("/admin/colleges");
      router.refresh();
    } catch {
      setStatusMessage({
        type: "error",
        text: "Network error occurred while deleting college.",
      });
      setConfirmDelete(false);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <Link
            href="/admin/colleges"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-emerald-600 transition mb-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Admin Colleges
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            {isEdit ? `Edit: ${initialData?.name}` : "Add New College Profile"}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {isEdit
              ? "Modify academic rankings, location, fees, placements, and facilities."
              : "Register a premier higher education institute with complete profile details."}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {isEdit && initialData?.slug && (
            <Link
              href={`/colleges/${initialData.slug}`}
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 shadow-xs transition"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              View Live Page
            </Link>
          )}

          {isEdit && (
            <button
              type="button"
              onClick={() => setConfirmDelete(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 transition"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete College
            </button>
          )}
        </div>
      </div>

      {/* Status Banner */}
      {statusMessage && (
        <div
          className={`flex items-start gap-3 p-4 rounded-xl border text-sm font-medium ${
            statusMessage.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-rose-50 border-rose-200 text-rose-800"
          }`}
        >
          {statusMessage.type === "success" ? (
            <Check className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
          )}
          <div>{statusMessage.text}</div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="p-2.5 rounded-xl bg-rose-50">
                <Trash2 className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Delete College Record?
              </h3>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              Are you sure you want to delete{" "}
              <strong className="text-slate-900">{name}</strong>? This action
              will permanently remove all related placements, reviews, and
              saved records.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                disabled={deleting}
                onClick={() => setConfirmDelete(false)}
                className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition"
              >
                Cancel
              </button>
              <Button
                variant="danger"
                size="md"
                isLoading={deleting}
                onClick={handleDelete}
              >
                Confirm Delete
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: Core Identification */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Core Institute Identity
              </h2>
              <p className="text-xs text-slate-500">
                Official name, unique URL slug, acronym, and foundational history.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Full Name */}
            <div className="md:col-span-2 space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                College Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Indian Institute of Technology Bombay"
                className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 transition ${
                  errors.name
                    ? "border-rose-400 focus:ring-rose-200"
                    : "border-slate-200 focus:border-emerald-500 focus:ring-emerald-100"
                }`}
              />
              {errors.name && (
                <p className="text-xs text-rose-600 font-medium">
                  {errors.name}
                </p>
              )}
            </div>

            {/* Short Name / Acronym */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Short Name / Acronym (Optional)
              </label>
              <input
                type="text"
                value={shortName}
                onChange={(e) => setShortName(e.target.value)}
                placeholder="e.g. IIT Bombay"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:border-emerald-500 focus:ring-emerald-100 transition"
              />
            </div>

            {/* URL Slug */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-slate-700">
                  URL Slug <span className="text-rose-500">*</span>
                </label>
                {!isEdit && (
                  <button
                    type="button"
                    onClick={regenerateSlug}
                    className="text-[11px] font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                  >
                    <RefreshCw className="h-3 w-3" /> Auto-Generate
                  </button>
                )}
              </div>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-xs text-slate-400 font-mono select-none">
                  /colleges/
                </span>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => {
                    setSlugAuto(false);
                    setSlug(e.target.value);
                  }}
                  placeholder="iit-bombay"
                  className={`w-full pl-22 pr-3.5 py-2.5 text-sm font-mono rounded-xl border bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 transition ${
                    errors.slug
                      ? "border-rose-400 focus:ring-rose-200"
                      : "border-slate-200 focus:border-emerald-500 focus:ring-emerald-100"
                  }`}
                />
              </div>
              {errors.slug && (
                <p className="text-xs text-rose-600 font-medium">
                  {errors.slug}
                </p>
              )}
            </div>

            {/* Established Year */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Established Year <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                required
                min={1800}
                max={new Date().getFullYear()}
                value={establishedYear}
                onChange={(e) => setEstablishedYear(e.target.value)}
                className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 transition ${
                  errors.establishedYear
                    ? "border-rose-400 focus:ring-rose-200"
                    : "border-slate-200 focus:border-emerald-500 focus:ring-emerald-100"
                }`}
              />
              {errors.establishedYear && (
                <p className="text-xs text-rose-600 font-medium">
                  {errors.establishedYear}
                </p>
              )}
            </div>

            {/* Overview / About */}
            <div className="md:col-span-2 space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Institute Overview & Profile Description{" "}
                <span className="text-rose-500">*</span>
              </label>
              <textarea
                required
                rows={4}
                value={overview}
                onChange={(e) => setOverview(e.target.value)}
                placeholder="Comprehensive summary of the institute's pedigree, campus vibe, flagship programs, and national stature..."
                className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 transition ${
                  errors.overview
                    ? "border-rose-400 focus:ring-rose-200"
                    : "border-slate-200 focus:border-emerald-500 focus:ring-emerald-100"
                }`}
              />
              {errors.overview && (
                <p className="text-xs text-rose-600 font-medium">
                  {errors.overview}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Section 2: Classification, Accreditation & Ratings */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-700">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Classification & Accreditations
              </h2>
              <p className="text-xs text-slate-500">
                Stream type, public/private governance, NIRF ranking, and star ratings.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* College Type */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Primary Stream / Type <span className="text-rose-500">*</span>
              </label>
              <select
                value={collegeType}
                onChange={(e) => setCollegeType(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:border-emerald-500 focus:ring-emerald-100 transition"
              >
                {COLLEGE_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            {/* Ownership */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Ownership Model <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-2 pt-0.5">
                {(["Public", "Private"] as const).map((own) => (
                  <button
                    key={own}
                    type="button"
                    onClick={() => setOwnership(own)}
                    className={`py-2 px-3 text-xs font-bold rounded-xl border transition text-center ${
                      ownership === own
                        ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                        : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {own}
                  </button>
                ))}
              </div>
            </div>

            {/* Star Rating */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-slate-700">
                  Rating (Out of 5.0)
                </label>
                <span className="flex items-center gap-1 text-xs font-bold text-amber-600">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  {rating.toFixed(1)}
                </span>
              </div>
              <input
                type="range"
                min="1.0"
                max="5.0"
                step="0.1"
                value={rating}
                onChange={(e) => setRating(parseFloat(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
            </div>

            {/* Affiliation */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Affiliation Body (Optional)
              </label>
              <input
                type="text"
                value={affiliation}
                onChange={(e) => setAffiliation(e.target.value)}
                placeholder="e.g. Autonomous / Ministry of Education"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:border-emerald-500 focus:ring-emerald-100 transition"
              />
            </div>

            {/* Accreditation / NIRF */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Accreditation / NIRF Rank
              </label>
              <input
                type="text"
                value={accreditation}
                onChange={(e) => setAccreditation(e.target.value)}
                placeholder="e.g. NIRF #3 (Engineering), NAAC A++"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:border-emerald-500 focus:ring-emerald-100 transition"
              />
            </div>

            {/* Review Count */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Review Count
              </label>
              <input
                type="number"
                min={0}
                value={reviewCount}
                onChange={(e) => setReviewCount(parseInt(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:border-emerald-500 focus:ring-emerald-100 transition"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Campus Location & Media Assets */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
            <div className="p-2 rounded-lg bg-amber-50 text-amber-700">
              <MapPin className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Location & Media Assets
              </h2>
              <p className="text-xs text-slate-500">
                Campus geography, official portal, and high-definition photography.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* City */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                City <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Mumbai"
                className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 transition ${
                  errors.city
                    ? "border-rose-400 focus:ring-rose-200"
                    : "border-slate-200 focus:border-emerald-500 focus:ring-emerald-100"
                }`}
              />
              {errors.city && (
                <p className="text-xs text-rose-600 font-medium">
                  {errors.city}
                </p>
              )}
            </div>

            {/* State */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                State <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="e.g. Maharashtra"
                className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 transition ${
                  errors.state
                    ? "border-rose-400 focus:ring-rose-200"
                    : "border-slate-200 focus:border-emerald-500 focus:ring-emerald-100"
                }`}
              />
              {errors.state && (
                <p className="text-xs text-rose-600 font-medium">
                  {errors.state}
                </p>
              )}
            </div>

            {/* Full Street Address */}
            <div className="md:col-span-2 space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Complete Campus Street Address{" "}
                <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. Main Gate Rd, IIT Area, Powai, Mumbai, Maharashtra 400076"
                className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 transition ${
                  errors.address
                    ? "border-rose-400 focus:ring-rose-200"
                    : "border-slate-200 focus:border-emerald-500 focus:ring-emerald-100"
                }`}
              />
              {errors.address && (
                <p className="text-xs text-rose-600 font-medium">
                  {errors.address}
                </p>
              )}
            </div>

            {/* Official Website */}
            <div className="md:col-span-2 space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Official Website URL
              </label>
              <input
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://www.iitb.ac.in"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:border-emerald-500 focus:ring-emerald-100 transition"
              />
            </div>

            {/* Logo Image URL */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Logo Image URL
              </label>
              <input
                type="url"
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                placeholder="https://images.unsplash.com/photo-..."
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:border-emerald-500 focus:ring-emerald-100 transition"
              />
            </div>

            {/* Banner Image URL */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Campus Banner Photo URL
              </label>
              <input
                type="url"
                value={bannerUrl}
                onChange={(e) => setBannerUrl(e.target.value)}
                placeholder="https://images.unsplash.com/photo-..."
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:border-emerald-500 focus:ring-emerald-100 transition"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Fees & Placement Statistics */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Financials & Placement Record
              </h2>
              <p className="text-xs text-slate-500">
                Annual tuition fee range and latest campus recruitment performance.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Min Annual Fees */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Minimum Annual Fee (₹ INR) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                required
                min={0}
                step={5000}
                value={minFees}
                onChange={(e) => setMinFees(e.target.value)}
                placeholder="e.g. 150000"
                className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 transition ${
                  errors.minFees
                    ? "border-rose-400 focus:ring-rose-200"
                    : "border-slate-200 focus:border-emerald-500 focus:ring-emerald-100"
                }`}
              />
              {errors.minFees && (
                <p className="text-xs text-rose-600 font-medium">
                  {errors.minFees}
                </p>
              )}
            </div>

            {/* Max Annual Fees */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Maximum Annual Fee (₹ INR) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                required
                min={0}
                step={5000}
                value={maxFees}
                onChange={(e) => setMaxFees(e.target.value)}
                placeholder="e.g. 260000"
                className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 transition ${
                  errors.maxFees
                    ? "border-rose-400 focus:ring-rose-200"
                    : "border-slate-200 focus:border-emerald-500 focus:ring-emerald-100"
                }`}
              />
              {errors.maxFees && (
                <p className="text-xs text-rose-600 font-medium">
                  {errors.maxFees}
                </p>
              )}
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4">
              Placement Highlights (Latest Graduating Batch)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {/* Year */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  Placement Batch Year
                </label>
                <input
                  type="number"
                  value={placementYear}
                  onChange={(e) => setPlacementYear(parseInt(e.target.value) || 2024)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-2 focus:border-emerald-500 focus:ring-emerald-100"
                />
              </div>

              {/* Highest Package */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  Highest Package (LPA)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={highestPackage}
                  onChange={(e) => setHighestPackage(e.target.value)}
                  placeholder="e.g. 120.0"
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-2 focus:border-emerald-500 focus:ring-emerald-100"
                />
              </div>

              {/* Average Package */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  Average Package (LPA)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={averagePackage}
                  onChange={(e) => setAveragePackage(e.target.value)}
                  placeholder="e.g. 21.8"
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-2 focus:border-emerald-500 focus:ring-emerald-100"
                />
                {errors.averagePackage && (
                  <p className="text-xs text-rose-500 mt-1 font-medium">{errors.averagePackage}</p>
                )}
              </div>

              {/* Placement Rate */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  Placement Rate (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  value={placementRate}
                  onChange={(e) => setPlacementRate(e.target.value)}
                  placeholder="e.g. 96"
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-2 focus:border-emerald-500 focus:ring-emerald-100"
                />
              </div>

              {/* Top Recruiters */}
              <div className="sm:col-span-2 md:col-span-4 space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  Top Recruiters (Comma Separated)
                </label>
                <input
                  type="text"
                  value={topRecruiters}
                  onChange={(e) => setTopRecruiters(e.target.value)}
                  placeholder="e.g. Microsoft, Google, Goldman Sachs, McKinsey, Bain & Company, Amazon"
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-2 focus:border-emerald-500 focus:ring-emerald-100"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 5: Campus Facilities */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
            <div className="p-2 rounded-lg bg-rose-50 text-rose-700">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Campus Facilities & Amenities
              </h2>
              <p className="text-xs text-slate-500">
                Select available on-campus infrastructure for student convenience.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex flex-wrap gap-2.5">
              {STANDARD_FACILITIES.map((fac) => {
                const isChecked = selectedFacilities.includes(fac);
                return (
                  <button
                    key={fac}
                    type="button"
                    onClick={() => toggleFacility(fac)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full border transition cursor-pointer ${
                      isChecked
                        ? "bg-emerald-50 border-emerald-300 text-emerald-800 shadow-xs"
                        : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {isChecked && <Check className="h-3.5 w-3.5 text-emerald-600" />}
                    {fac}
                  </button>
                );
              })}
            </div>

            {/* Custom Facility input */}
            <div className="flex items-center gap-2 max-w-sm pt-2">
              <input
                type="text"
                value={customFacility}
                onChange={(e) => setCustomFacility(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addCustomFacility();
                  }
                }}
                placeholder="Add custom facility..."
                className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:border-emerald-500 focus:ring-emerald-100"
              />
              <button
                type="button"
                onClick={addCustomFacility}
                className="px-3 py-1.5 text-xs font-semibold bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition shrink-0"
              >
                + Add
              </button>
            </div>
          </div>
        </div>

        {/* Form Actions Footer */}
        <div className="sticky bottom-4 z-20 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200 p-4 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-500 font-medium">
            Fields marked with <span className="text-rose-500 font-bold">*</span> are required.
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Link
              href="/admin/colleges"
              className="flex-1 sm:flex-initial px-5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 rounded-xl transition text-center"
            >
              Cancel
            </Link>
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={loading}
              className="flex-1 sm:flex-initial px-6 py-2.5 text-xs font-bold shadow-md"
            >
              {isEdit ? "Save College Changes" : "Publish New College"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
