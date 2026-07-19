"use client";

import { useEffect } from "react";
import { hydrateFavorites } from "@/lib/orbit-store";

/**
 * Mounts once on the client to hydrate persisted favorites from
 * localStorage into the zustand store. Renders nothing.
 */
export function StoreHydration() {
  useEffect(() => {
    hydrateFavorites();
  }, []);
  return null;
}
