"use client";

import { useAuth } from "@/context/AuthContext";
import React, { createContext, useContext, useEffect, useState } from "react";

interface SavedCollegesContextType {
  savedCollegeIds: Set<string>;
  loading: boolean;
  toggleSave: (collegeId: string) => Promise<{ isSaved: boolean; error?: string }>;
  isSaved: (collegeId: string) => boolean;
  refreshSaved: () => Promise<void>;
}

const SavedCollegesContext = createContext<SavedCollegesContextType | undefined>(undefined);

export function SavedCollegesProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [savedCollegeIds, setSavedCollegeIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  const refreshSaved = async () => {
    if (!user) {
      setSavedCollegeIds(new Set());
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/saved-colleges");
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          const ids = new Set<string>(json.data.map((item: any) => item.college.id));
          setSavedCollegeIds(ids);
        }
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshSaved();
  }, [user]);

  const toggleSave = async (collegeId: string): Promise<{ isSaved: boolean; error?: string }> => {
    if (!user) {
      return { isSaved: false, error: "Please log in to save colleges to your profile." };
    }

    const currentlySaved = savedCollegeIds.has(collegeId);

    // Optimistic UI update
    setSavedCollegeIds((prev) => {
      const next = new Set(prev);
      if (currentlySaved) {
        next.delete(collegeId);
      } else {
        next.add(collegeId);
      }
      return next;
    });

    try {
      if (currentlySaved) {
        const res = await fetch(`/api/saved-colleges/${collegeId}`, {
          method: "DELETE",
        });
        if (!res.ok) {
          throw new Error("Failed to remove saved college");
        }
        return { isSaved: false };
      } else {
        const res = await fetch("/api/saved-colleges", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ collegeId }),
        });
        if (!res.ok) {
          throw new Error("Failed to save college");
        }
        return { isSaved: true };
      }
    } catch (err: any) {
      // Revert optimistic update
      setSavedCollegeIds((prev) => {
        const next = new Set(prev);
        if (currentlySaved) {
          next.add(collegeId);
        } else {
          next.delete(collegeId);
        }
        return next;
      });
      return { isSaved: currentlySaved, error: err.message || "Failed to update saved college" };
    }
  };

  const isSaved = (collegeId: string) => savedCollegeIds.has(collegeId);

  return (
    <SavedCollegesContext.Provider
      value={{
        savedCollegeIds,
        loading,
        toggleSave,
        isSaved,
        refreshSaved,
      }}
    >
      {children}
    </SavedCollegesContext.Provider>
  );
}

export function useSavedColleges() {
  const context = useContext(SavedCollegesContext);
  if (!context) {
    throw new Error("useSavedColleges must be used within a SavedCollegesProvider");
  }
  return context;
}
