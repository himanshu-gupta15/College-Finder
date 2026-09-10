"use client";

import { useAuth } from "@/context/AuthContext";
import { useComparison } from "@/context/ComparisonContext";
import { Bookmark, Compass, GraduationCap, LogOut, Menu, Scale, User as UserIcon, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Header() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { items: comparisonItems } = useComparison();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === "/colleges" && pathname.startsWith("/colleges")) return true;
    return pathname === path;
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-emerald-500 text-white shadow-sm transition-transform duration-200 group-hover:scale-105">
            <GraduationCap className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-slate-900">
              College<span className="text-emerald-600">Finder</span>
            </span>
            <span className="hidden sm:block text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
              India Higher Education Discovery
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          <Link
            href="/colleges"
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
              isActive("/colleges")
                ? "bg-emerald-50 text-emerald-700"
                : "text-slate-650 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <Compass className="h-4 w-4 text-emerald-600" />
            <span>Discover Colleges</span>
          </Link>

          <Link
            href="/compare"
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors relative ${
              isActive("/compare")
                ? "bg-emerald-50 text-emerald-700"
                : "text-slate-650 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <Scale className="h-4 w-4 text-indigo-600" />
            <span>Compare</span>
            {comparisonItems.length > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[11px] font-bold text-white shadow-sm">
                {comparisonItems.length}
              </span>
            )}
          </Link>

          <Link
            href="/saved-colleges"
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
              isActive("/saved-colleges")
                ? "bg-emerald-50 text-emerald-700"
                : "text-slate-650 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <Bookmark className="h-4 w-4 text-rose-500" />
            <span>Saved Colleges</span>
          </Link>
        </nav>

        {/* Auth CTA Area */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <Link
                href="/profile"
                className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 py-1.5 pl-2.5 pr-3 text-sm font-medium text-slate-800 transition hover:bg-slate-100"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600 text-xs font-semibold text-white">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="max-w-[120px] truncate">{user.name}</span>
              </Link>
              <button
                onClick={() => logout()}
                title="Logout"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-rose-50 hover:text-rose-600"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-medium text-slate-700 transition hover:text-emerald-600"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-emerald-700 active:scale-[0.98]"
              >
                Create Account
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex md:hidden items-center gap-2">
          {comparisonItems.length > 0 && (
            <Link
              href="/compare"
              className="relative p-2 text-slate-600 hover:text-slate-900"
            >
              <Scale className="h-5 w-5" />
              <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white">
                {comparisonItems.length}
              </span>
            </Link>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-6 space-y-3">
          <Link
            href="/colleges"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50"
          >
            <Compass className="h-5 w-5 text-emerald-600" />
            Discover Colleges
          </Link>
          <Link
            href="/compare"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between px-3 py-2.5 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50"
          >
            <div className="flex items-center gap-3">
              <Scale className="h-5 w-5 text-indigo-600" />
              Compare Colleges
            </div>
            {comparisonItems.length > 0 && (
              <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-bold text-indigo-700">
                {comparisonItems.length}
              </span>
            )}
          </Link>
          <Link
            href="/saved-colleges"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50"
          >
            <Bookmark className="h-5 w-5 text-rose-500" />
            Saved Colleges
          </Link>

          <div className="border-t border-slate-100 pt-3">
            {user ? (
              <div className="space-y-2">
                <Link
                  href="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-base font-medium text-slate-800 hover:bg-slate-50"
                >
                  <UserIcon className="h-5 w-5 text-slate-500" />
                  My Profile ({user.name})
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="flex w-full items-center gap-3 px-3 py-2 rounded-lg text-base font-medium text-rose-600 hover:bg-rose-50"
                >
                  <LogOut className="h-5 w-5" />
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2 pt-1">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 text-sm font-medium text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 text-sm font-medium text-white bg-emerald-600 rounded-lg shadow-sm hover:bg-emerald-700"
                >
                  Create Account
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
