"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export interface ComparisonItem {
  id: string;
  slug: string;
  name: string;
  shortName?: string | null;
  city: string;
  state: string;
  collegeType: string;
  logoUrl?: string | null;
  minFees: number;
  maxFees: number;
  rating: number;
}

interface ComparisonContextType {
  items: ComparisonItem[];
  addToCompare: (college: ComparisonItem) => { success: boolean; message: string };
  removeFromCompare: (id: string) => void;
  clearComparison: () => void;
  isInComparison: (id: string) => boolean;
}

const ComparisonContext = createContext<ComparisonContextType | undefined>(undefined);

const STORAGE_KEY = "college_discovery_comparison";
const MAX_COMPARISON_LIMIT = 3;

export function ComparisonProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ComparisonItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setItems(parsed.slice(0, MAX_COMPARISON_LIMIT));
        }
      }
    } catch {
      // ignore localStorage parse error
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
      } catch {
        // ignore localStorage write errors
      }
    }
  }, [items, isLoaded]);

  const addToCompare = (college: ComparisonItem) => {
    if (items.some((i) => i.id === college.id || i.slug === college.slug)) {
      return { success: false, message: `${college.shortName || college.name} is already in comparison` };
    }

    if (items.length >= MAX_COMPARISON_LIMIT) {
      return {
        success: false,
        message: `Comparison limit reached! You can compare at most ${MAX_COMPARISON_LIMIT} colleges. Please remove one first.`,
      };
    }

    setItems((prev) => [...prev, college]);
    return { success: true, message: `${college.shortName || college.name} added to comparison` };
  };

  const removeFromCompare = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id && i.slug !== id));
  };

  const clearComparison = () => {
    setItems([]);
  };

  const isInComparison = (id: string) => {
    return items.some((i) => i.id === id || i.slug === id);
  };

  return (
    <ComparisonContext.Provider
      value={{
        items,
        addToCompare,
        removeFromCompare,
        clearComparison,
        isInComparison,
      }}
    >
      {children}
    </ComparisonContext.Provider>
  );
}

export function useComparison() {
  const context = useContext(ComparisonContext);
  if (!context) {
    throw new Error("useComparison must be used within a ComparisonProvider");
  }
  return context;
}
