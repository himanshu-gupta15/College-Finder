"use client";

import Button from "@/components/common/Button";
import Pagination from "@/components/common/Pagination";
import { useAuth } from "@/context/AuthContext";
import {
  Building2,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  GraduationCap,
  IndianRupee,
  Lock,
  MapPin,
  Pencil,
  Plus,
  Search,
  ShieldAlert,
  ShieldCheck,
  Star,
  Trash2,
  TrendingUp,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

interface AdminCollegeItem {
  id: string;
  slug: string;
  name: string;
  shortName?: string | null;
  collegeType: string;
  ownership: string;
  city: string;
  state: string;
  minFees: number;
  maxFees: number;
  rating: number;
  reviewCount: number;
  logoUrl?: string | null;
  updatedAt: string;
  placements?: {
    highestPackage: number;
    averagePackage: number;
    year: number;
  }[];
  facilities?: { name: string }[];
  _count?: {
    courses: number;
    reviews: number;
    savedBy: number;
  };
}

export default function AdminCollegesPage() {
  const router = useRouter();
  const { user, loading: authLoading, login } = useAuth();

  const [colleges, setColleges] = useState<AdminCollegeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [ownershipStats, setOwnershipStats] = useState<
    { ownership: string; _count: { id: number } }[]
  >([]);

  // Delete modal state
  const [collegeToDelete, setCollegeToDelete] =
    useState<AdminCollegeItem | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Quick admin login helper for demo/evaluator convenience
  const [loggingInAsAdmin, setLoggingInAsAdmin] = useState(false);

  const fetchColleges = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search.trim()) params.set("search", search.trim());
      if (selectedType) params.set("collegeType", selectedType);
      params.set("page", page.toString());
      params.set("limit", "12");

      const res = await fetch(`/api/admin/colleges?${params.toString()}`);
      const data = await res.json();

      if (res.ok && data.success) {
        setColleges(data.data || []);
        if (data.pagination) {
          setTotalPages(data.pagination.totalPages || 1);
          setTotalCount(data.pagination.total || 0);
          if (data.pagination.ownershipStats) {
            setOwnershipStats(data.pagination.ownershipStats);
          }
        }
      } else {
        setColleges([]);
      }
    } catch {
      setColleges([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === "admin") {
      fetchColleges();
    }
  }, [user, page, selectedType]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchColleges();
  };

  const handleQuickAdminLogin = async () => {
    setLoggingInAsAdmin(true);
    const res = await login("admin@collegefinder.com", "Password123");
    setLoggingInAsAdmin(false);
    if (res.success) {
      router.refresh();
    } else {
      setNotification({
        type: "error",
        text: res.error || "Failed to log in with demo admin credentials.",
      });
    }
  };

  const handleDelete = async () => {
    if (!collegeToDelete) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/colleges/${collegeToDelete.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setNotification({
          type: "success",
          text: `"${collegeToDelete.name}" deleted successfully.`,
        });
        setCollegeToDelete(null);
        fetchColleges();
      } else {
        setNotification({
          type: "error",
          text: data.error?.message || "Failed to delete college.",
        });
      }
    } catch {
      setNotification({
        type: "error",
        text: "Network error occurred while deleting college.",
      });
    } finally {
      setDeleting(false);
    }
  };

  // If auth is still resolving
  if (authLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent"></div>
        <p className="mt-3 text-sm text-slate-500 font-medium">
          Verifying administrative permissions...
        </p>
      </div>
    );
  }

  // If user is not logged in or not admin
  if (!user || user.role !== "admin") {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center space-y-6">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100 text-amber-600 shadow-xs">
          <ShieldAlert className="h-8 w-8" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Administrator Access Required
          </h1>
          <p className="mt-2 text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
            The College Management Portal allows verified administrators to add,
            edit, and manage institute profiles and placement records.
          </p>
        </div>

        {user ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-3 text-left">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-700 font-bold">
                {user.name.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">{user.name}</p>
                <p className="text-xs text-slate-500">{user.email} (Role: {user.role})</p>
              </div>
            </div>
            <p className="text-xs text-amber-700 bg-amber-50 p-3 rounded-xl border border-amber-200">
              Your current account does not have administrative rights. Switch to an
              admin account below to proceed.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <Button
                variant="primary"
                size="md"
                className="w-full"
                isLoading={loggingInAsAdmin}
                onClick={handleQuickAdminLogin}
              >
                Switch to Demo Admin Account
              </Button>
              <Link
                href="/login"
                className="w-full text-center px-4 py-2 text-sm font-medium border border-slate-200 rounded-lg hover:bg-slate-50"
              >
                Sign In with Different Credentials
              </Link>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <p className="text-sm font-medium text-slate-700">
              Sign in with administrative credentials or use 1-click demo access:
            </p>
            <Button
              variant="primary"
              size="lg"
              className="w-full shadow-md"
              isLoading={loggingInAsAdmin}
              onClick={handleQuickAdminLogin}
            >
              Sign In as Demo Admin (admin@collegefinder.com)
            </Button>
            <div className="text-xs text-slate-400">
              Default password: <code className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">Password123</code>
            </div>
          </div>
        )}
      </div>
    );
  }

  const publicCount =
    ownershipStats.find((s) => s.ownership === "Public")?._count?.id || 0;
  const privateCount =
    ownershipStats.find((s) => s.ownership === "Private")?._count?.id || 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 pb-20">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">
              <ShieldCheck className="h-3 w-3" /> Admin Dashboard
            </span>
            <span className="text-xs text-slate-400">• Higher Education Catalog</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Institute Management & Editor
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Add new colleges, modify fees, placement statistics, affiliations, and facilities.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/colleges"
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition shadow-xs flex items-center gap-1.5"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Browse Public Catalog
          </Link>
          <Link
            href="/admin/colleges/new"
            className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition shadow-sm flex items-center gap-1.5 active:scale-[0.98]"
          >
            <Plus className="h-4 w-4" />
            Add New College
          </Link>
        </div>
      </div>

      {/* Notifications */}
      {notification && (
        <div
          className={`flex items-center justify-between p-4 rounded-xl border text-sm font-medium ${
            notification.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-rose-50 border-rose-200 text-rose-800"
          }`}
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>{notification.text}</span>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="text-xs hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">Total Institutes</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{totalCount}</p>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <Building2 className="h-6 w-6" />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">Public (Govt/IIT/NIT)</p>
            <p className="text-2xl font-bold text-indigo-700 mt-1">{publicCount}</p>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
            <GraduationCap className="h-6 w-6" />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">Private / Deemed</p>
            <p className="text-2xl font-bold text-amber-700 mt-1">{privateCount}</p>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
            <Building2 className="h-6 w-6" />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">Admin Account</p>
            <p className="text-sm font-bold text-slate-900 mt-1 truncate max-w-[150px]">
              {user.name}
            </p>
            <p className="text-[11px] text-emerald-600 font-medium">Verified Admin</p>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-700 font-bold">
            {user.name.charAt(0)}
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <form
          onSubmit={handleSearchSubmit}
          className="relative flex-1 w-full flex items-center"
        >
          <Search className="absolute left-3.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by institute name, acronym, city, or state..."
            className="w-full pl-10 pr-24 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:border-emerald-500 focus:ring-emerald-100 transition"
          />
          <button
            type="submit"
            className="absolute right-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition"
          >
            Search
          </button>
        </form>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={selectedType}
            onChange={(e) => {
              setSelectedType(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-100"
          >
            <option value="">All Categories</option>
            <option value="Engineering">Engineering</option>
            <option value="Management">Management</option>
            <option value="Medical">Medical</option>
            <option value="Arts & Science">Arts & Science</option>
            <option value="Law">Law</option>
            <option value="Design">Design</option>
          </select>
        </div>
      </div>

      {/* Colleges Table / List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-16 text-center space-y-2">
            <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent"></div>
            <p className="text-xs text-slate-500">Loading colleges...</p>
          </div>
        ) : colleges.length === 0 ? (
          <div className="py-16 text-center space-y-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
              <Building2 className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800">No colleges found</p>
              <p className="text-xs text-slate-500 mt-0.5">
                Try adjusting your search criteria or register a new college.
              </p>
            </div>
            <Link
              href="/admin/colleges/new"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs"
            >
              <Plus className="h-3.5 w-3.5" />
              Add First College
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/75 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 pl-5 pr-3">Institute Name</th>
                  <th className="py-3.5 px-3">Type & Model</th>
                  <th className="py-3.5 px-3">Location</th>
                  <th className="py-3.5 px-3">Annual Fees</th>
                  <th className="py-3.5 px-3">Rating</th>
                  <th className="py-3.5 px-3">Placements</th>
                  <th className="py-3.5 pr-5 pl-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {colleges.map((col) => {
                  const placement = col.placements?.[0];
                  return (
                    <tr
                      key={col.id}
                      className="hover:bg-slate-50/70 transition duration-150 group"
                    >
                      {/* Name & Logo */}
                      <td className="py-4 pl-5 pr-3">
                        <div className="flex items-center gap-3">
                          <div className="relative h-10 w-10 shrink-0 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400">
                            {col.logoUrl ? (
                              <Image
                                src={col.logoUrl}
                                alt={col.name}
                                fill
                                sizes="40px"
                                className="object-cover"
                              />
                            ) : (
                              <Building2 className="h-5 w-5 text-slate-400" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <Link
                              href={`/admin/colleges/${col.id}/edit`}
                              className="font-bold text-slate-900 hover:text-emerald-600 transition truncate block max-w-xs"
                            >
                              {col.name}
                            </Link>
                            <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-0.5">
                              {col.shortName && (
                                <span className="font-semibold text-slate-600">
                                  {col.shortName} •
                                </span>
                              )}
                              <span className="font-mono text-slate-400">
                                /colleges/{col.slug}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Type & Model */}
                      <td className="py-4 px-3 whitespace-nowrap">
                        <div className="flex flex-col gap-1 items-start">
                          <span className="font-semibold text-slate-800">
                            {col.collegeType}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              col.ownership === "Public"
                                ? "bg-indigo-50 text-indigo-700 border border-indigo-200"
                                : "bg-amber-50 text-amber-700 border border-amber-200"
                            }`}
                          >
                            {col.ownership}
                          </span>
                        </div>
                      </td>

                      {/* Location */}
                      <td className="py-4 px-3 whitespace-nowrap">
                        <div className="flex items-center gap-1 text-slate-600">
                          <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                          <span>
                            {col.city}, {col.state}
                          </span>
                        </div>
                      </td>

                      {/* Annual Fees */}
                      <td className="py-4 px-3 whitespace-nowrap">
                        <div className="font-semibold text-slate-800">
                          ₹{(col.minFees / 100000).toFixed(1)}L - ₹
                          {(col.maxFees / 100000).toFixed(1)}L
                        </div>
                        <span className="text-[10px] text-slate-400">per annum</span>
                      </td>

                      {/* Rating */}
                      <td className="py-4 px-3 whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                          <span className="font-bold text-slate-900">
                            {col.rating.toFixed(1)}
                          </span>
                          <span className="text-slate-400 text-[10px]">
                            ({col.reviewCount})
                          </span>
                        </div>
                      </td>

                      {/* Placements */}
                      <td className="py-4 px-3 whitespace-nowrap">
                        {placement ? (
                          <div>
                            <div className="font-semibold text-emerald-700">
                              ₹{placement.averagePackage} LPA avg
                            </div>
                            <div className="text-[10px] text-slate-400">
                              ₹{placement.highestPackage} LPA max
                            </div>
                          </div>
                        ) : (
                          <span className="text-slate-400 text-[11px]">N/A</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-4 pr-5 pl-3 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={`/colleges/${col.slug}`}
                            target="_blank"
                            title="View Public Page"
                            className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-slate-100 rounded-lg transition"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Link>
                          <Link
                            href={`/admin/colleges/${col.id}/edit`}
                            title="Edit Details"
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                            <span>Edit</span>
                          </Link>
                          <button
                            type="button"
                            onClick={() => setCollegeToDelete(col)}
                            title="Delete Record"
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex justify-center">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={(newPage) => setPage(newPage)}
            />
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {collegeToDelete && (
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
              Are you sure you want to permanently delete{" "}
              <strong className="text-slate-900">{collegeToDelete.name}</strong>?
              This will remove all associated placements, facilities, and reviews.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                disabled={deleting}
                onClick={() => setCollegeToDelete(null)}
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
    </div>
  );
}
