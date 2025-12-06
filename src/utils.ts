/*
 * utils.ts
 * Created by Dewan Mobashirul
 * Copyright (c) 2025 Dewan Mobashirul
 * All rights reserved
 */

import { ScrollPosition, ScrollSize } from "./useIsScroll.types"

/**
 * Safely retrieves initial scroll values with SSR support.
 * Returns zero values if window is not available (SSR environment).
 */
export function getInitialScrollValues(): ScrollPosition & ScrollSize {
  if (typeof window === "undefined") {
    return { scrollX: 0, scrollY: 0, scrollWidth: 0, scrollHeight: 0 }
  }
  return {
    scrollX: window.scrollX ?? 0,
    scrollY: window.scrollY ?? 0,
    scrollWidth: document.documentElement.scrollWidth ?? 0,
    scrollHeight: document.documentElement.scrollHeight ?? 0,
  }
}
