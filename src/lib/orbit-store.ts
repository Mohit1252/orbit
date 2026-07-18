"use client";

import { create } from "zustand";
import {
  tools,
  budgetRank,
  type AiTool,
  type BudgetTier,
} from "@/lib/ai-data";

export type SortId = "featured" | "popular" | "rating" | "all";

interface OrbitState {
  // filters
  searchQuery: string;
  activeTasks: string[];
  budget: BudgetTier | null;
  sort: SortId;

  // selection
  compareIds: string[];
  detailToolId: string | null;

  // filter actions
  setSearch: (q: string) => void;
  toggleTask: (t: string) => void;
  clearTasks: () => void;
  setBudget: (b: BudgetTier | null) => void;
  setSort: (s: SortId) => void;
  resetFilters: () => void;

  // compare actions
  toggleCompare: (id: string) => void;
  clearCompare: () => void;

  // detail modal
  openDetail: (id: string) => void;
  closeDetail: () => void;
}

const MAX_COMPARE = 3;

export const useOrbitStore = create<OrbitState>((set) => ({
  searchQuery: "",
  activeTasks: ["Writing", "Images"],
  budget: "Freemium",
  sort: "featured",

  compareIds: ["chatgpt", "midjourney"],
  detailToolId: null,

  setSearch: (q) => set({ searchQuery: q }),
  toggleTask: (t) =>
    set((s) => ({
      activeTasks: s.activeTasks.includes(t)
        ? s.activeTasks.filter((x) => x !== t)
        : [...s.activeTasks, t],
    })),
  clearTasks: () => set({ activeTasks: [] }),
  setBudget: (b) => set({ budget: b }),
  setSort: (s) => set({ sort: s }),
  resetFilters: () =>
    set({ searchQuery: "", activeTasks: [], budget: null, sort: "all" }),

  toggleCompare: (id) =>
    set((s) => ({
      compareIds: s.compareIds.includes(id)
        ? s.compareIds.filter((x) => x !== id)
        : s.compareIds.length < MAX_COMPARE
          ? [...s.compareIds, id]
          : s.compareIds,
    })),
  clearCompare: () => set({ compareIds: [] }),

  openDetail: (id) => set({ detailToolId: id }),
  closeDetail: () => set({ detailToolId: null }),
}));

export const MAX_COMPARE_TOOLS = MAX_COMPARE;

/**
 * Pure function that derives the filtered + sorted tool list from filter
 * primitives. Designed to be called inside `useMemo` in a component — NOT
 * as a zustand selector (it returns a new array each call, which would
 * cause infinite re-renders with the default Object.is equality).
 */
export function filterAndSortTools(params: {
  searchQuery: string;
  activeTasks: string[];
  budget: BudgetTier | null;
  sort: SortId;
}): AiTool[] {
  const { searchQuery, activeTasks, budget, sort } = params;
  const q = searchQuery.trim().toLowerCase();

  let list = tools.filter((t) => {
    if (q) {
      const haystack = [
        t.name,
        t.vendor,
        t.tagline,
        t.description,
        ...t.tags,
        ...t.tasks,
      ]
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    // task: tool matches if it covers ANY selected task (OR — browse semantics)
    if (activeTasks.length > 0) {
      const hasAny = activeTasks.some((task) => t.tasks.includes(task));
      if (!hasAny) return false;
    }
    // budget: show tools at or below the selected tier ("under $X/mo")
    if (budget !== null) {
      if (budgetRank[t.budget] > budgetRank[budget]) return false;
    }
    return true;
  });

  switch (sort) {
    case "featured":
      list = list.sort((a, b) => Number(!!b.featured) - Number(!!a.featured));
      break;
    case "popular":
      list = list.sort((a, b) => b.reviews - a.reviews);
      break;
    case "rating":
      list = list.sort((a, b) => b.rating - a.rating);
      break;
    case "all":
    default:
      break;
  }
  return list;
}
