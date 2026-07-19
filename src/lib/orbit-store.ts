"use client";

import { create } from "zustand";
import {
  tools,
  budgetRank,
  type AiTool,
  type BudgetTier,
} from "@/lib/ai-data";
import type { QuizAnswers } from "@/lib/recommend";

export type SortId = "featured" | "popular" | "rating" | "all";

interface OrbitState {
  // filters
  searchQuery: string;
  activeTasks: string[];
  budget: BudgetTier | null;
  sort: SortId;
  favoritesOnly: boolean;

  // selection
  compareIds: string[];
  /** per-tool selected model index (for the compare deck model selector) */
  compareModelSelections: Record<string, number>;
  favoriteIds: string[];
  recentlyViewedIds: string[];
  detailToolId: string | null;

  // quiz
  quizOpen: boolean;
  quizStep: number;
  quizAnswers: QuizAnswers;

  // filter actions
  setSearch: (q: string) => void;
  toggleTask: (t: string) => void;
  clearTasks: () => void;
  setBudget: (b: BudgetTier | null) => void;
  setSort: (s: SortId) => void;
  toggleFavoritesOnly: () => void;
  resetFilters: () => void;

  // compare actions
  toggleCompare: (id: string) => void;
  clearCompare: () => void;
  setCompareModel: (toolId: string, modelIndex: number) => void;

  // favorite actions
  toggleFavorite: (id: string) => void;
  clearFavorites: () => void;

  // recently viewed
  pushRecentlyViewed: (id: string) => void;
  clearRecentlyViewed: () => void;

  // detail modal
  openDetail: (id: string) => void;
  closeDetail: () => void;

  // quiz actions
  openQuiz: (prefill?: Partial<QuizAnswers>) => void;
  closeQuiz: () => void;
  setQuizStep: (step: number) => void;
  setQuizAnswer: <K extends keyof QuizAnswers>(key: K, value: QuizAnswers[K] | null) => void;
  resetQuiz: () => void;
}

const MAX_COMPARE = 3;
const FAVES_KEY = "orbit:favorites";
const RECENT_KEY = "orbit:recently-viewed";
const MAX_RECENT = 6;

/** Load favorites from localStorage (safe for SSR). */
function loadFavorites(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(FAVES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

/** Persist favorites to localStorage. */
function persistFavorites(ids: string[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(FAVES_KEY, JSON.stringify(ids));
  } catch {
    /* ignore quota / privacy errors */
  }
}

/** Load recently-viewed tool ids from localStorage. */
function loadRecent(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(RECENT_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

function persistRecent(ids: string[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(RECENT_KEY, JSON.stringify(ids));
  } catch {
    /* ignore */
  }
}

const EMPTY_QUIZ: QuizAnswers = {
  task: null,
  budget: null,
  priority: null,
  teamSize: null,
};

export const useOrbitStore = create<OrbitState>((set) => ({
  searchQuery: "",
  activeTasks: ["Writing", "Images"],
  budget: "Freemium",
  sort: "featured",
  favoritesOnly: false,

  compareIds: ["chatgpt", "midjourney"],
  compareModelSelections: {},
  favoriteIds: [],
  recentlyViewedIds: [],
  detailToolId: null,

  quizOpen: false,
  quizStep: 0,
  quizAnswers: EMPTY_QUIZ,

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
  toggleFavoritesOnly: () => set((s) => ({ favoritesOnly: !s.favoritesOnly })),
  resetFilters: () =>
    set({
      searchQuery: "",
      activeTasks: [],
      budget: null,
      sort: "all",
      favoritesOnly: false,
    }),

  toggleCompare: (id) =>
    set((s) => {
      const isRemoving = s.compareIds.includes(id);
      const nextIds = isRemoving
        ? s.compareIds.filter((x) => x !== id)
        : s.compareIds.length < MAX_COMPARE
          ? [...s.compareIds, id]
          : s.compareIds;
      // when removing, also drop its model selection
      const nextSel = { ...s.compareModelSelections };
      if (isRemoving) delete nextSel[id];
      return { compareIds: nextIds, compareModelSelections: nextSel };
    }),
  clearCompare: () => set({ compareIds: [], compareModelSelections: {} }),
  setCompareModel: (toolId, modelIndex) =>
    set((s) => ({
      compareModelSelections: { ...s.compareModelSelections, [toolId]: modelIndex },
    })),

  toggleFavorite: (id) =>
    set((s) => {
      const next = s.favoriteIds.includes(id)
        ? s.favoriteIds.filter((x) => x !== id)
        : [...s.favoriteIds, id];
      persistFavorites(next);
      return { favoriteIds: next };
    }),
  clearFavorites: () => {
    persistFavorites([]);
    return set({ favoriteIds: [] });
  },

  pushRecentlyViewed: (id) =>
    set((s) => {
      const next = [id, ...s.recentlyViewedIds.filter((x) => x !== id)].slice(
        0,
        MAX_RECENT
      );
      persistRecent(next);
      return { recentlyViewedIds: next };
    }),
  clearRecentlyViewed: () => {
    persistRecent([]);
    return set({ recentlyViewedIds: [] });
  },

  openDetail: (id) =>
    set((s) => {
      const next = [
        id,
        ...s.recentlyViewedIds.filter((x) => x !== id),
      ].slice(0, MAX_RECENT);
      persistRecent(next);
      return { detailToolId: id, recentlyViewedIds: next };
    }),
  closeDetail: () => set({ detailToolId: null }),

  openQuiz: (prefill) =>
    set((s) => ({
      quizOpen: true,
      quizStep: 0,
      quizAnswers: { ...EMPTY_QUIZ, ...prefill },
    })),
  closeQuiz: () => set({ quizOpen: false }),
  setQuizStep: (step) => set({ quizStep: step }),
  setQuizAnswer: (key, value) =>
    set((s) => ({ quizAnswers: { ...s.quizAnswers, [key]: value } })),
  resetQuiz: () => set({ quizAnswers: EMPTY_QUIZ, quizStep: 0 }),
}));

/** Hydrate persisted state from localStorage once on the client. */
export function hydrateFavorites() {
  const favs = loadFavorites();
  const recent = loadRecent();
  useOrbitStore.setState({
    favoriteIds: favs,
    recentlyViewedIds: recent,
  });
}

export const MAX_COMPARE_TOOLS = MAX_COMPARE;
export { FAVES_KEY };

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
  favoritesOnly: boolean;
  favoriteIds: string[];
}): AiTool[] {
  const { searchQuery, activeTasks, budget, sort, favoritesOnly, favoriteIds } =
    params;
  const q = searchQuery.trim().toLowerCase();

  let list = tools.filter((t) => {
    if (favoritesOnly && !favoriteIds.includes(t.id)) return false;
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
