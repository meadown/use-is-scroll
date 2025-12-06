/*
 * useIsScroll.types.ts
 * Created by Dewan Mobashirul
 * Copyright (c) 2025 Dewan Mobashirul
 * All rights reserved
 */

export interface ScrollPosition {
  scrollX: number
  scrollY: number
}

export interface ScrollSize {
  scrollWidth: number
  scrollHeight: number
}

export interface UseIsScrollOption {
  direction?: "x" | "y"
  xThreshold?: number
  yThreshold?: number
}

export interface UseIsScrollReturn {
  scrollX: number
  scrollY: number
  isScrolled: boolean
  scrollWidth: number
  scrollHeight: number
}
