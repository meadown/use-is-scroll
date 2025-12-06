/*
 * useIsScroll.ts
 * Created by Dewan Mobashirul
 * Copyright (c) 2025 Dewan Mobashirul
 * All rights reserved
 */

"use client"

import { useState, useEffect } from "react"

import {
  UseIsScrollReturn,
  UseIsScrollOption,
  ScrollPosition,
  ScrollSize,
} from "./useIsScroll.types"
import { getInitialScrollValues } from "./utils"

const SCROLL_Y_THRESHOLD_PX = 16
const SCROLL_X_THRESHOLD_PX = 16

/**
 * useIsScroll: Track window scroll position and document dimensions.
 *
 * @param {Object} [options] Optional configuration.
 * @param {"x"|"y"} [options.direction="y"] - Axis to evaluate for `isScrolled`.
 * @param {number} [options.xThreshold=16] - Horizontal threshold in pixels.
 * @param {number} [options.yThreshold=16] - Vertical threshold in pixels.
 *
 * @returns `scrollX`, `scrollY`, `isScrolled`, `scrollWidth`, `scrollHeight`
 * @property {number} scrollX - Current horizontal scroll offset in pixels.
 * @property {number} scrollY - Current vertical scroll offset in pixels.
 * @property {boolean} isScrolled - True when the selected axis exceeds its threshold.
 * @property {number} scrollWidth - Full document scrollable width in pixels.
 * @property {number} scrollHeight - Full document scrollable height in pixels.
 *
 * @example
 * // Default (vertical) usage
 * const { scrollY, isScrolled } = useIsScroll()
 *
 * @example
 * // Horizontal tracking with custom thresholds
 * const { scrollX, isScrolled } = useIsScroll({ direction: "x", xThreshold: 32 })
 *
 * Adds a passive scroll listener and cleans up on unmount.
 */
export default function useIsScroll({
  direction = "y",
  xThreshold,
  yThreshold,
}: UseIsScrollOption = {}): UseIsScrollReturn {
  const initialValues = getInitialScrollValues()

  const [scrollX, setScrollX] = useState<number>(initialValues.scrollX)
  const [scrollY, setScrollY] = useState<number>(initialValues.scrollY)
  const [scrollWidth, setScrollWidth] = useState<number>(
    initialValues.scrollWidth
  )
  const [scrollHeight, setScrollHeight] = useState<number>(
    initialValues.scrollHeight
  )
  const [isScrolled, setIsScrolled] = useState<boolean>(false)

  function setIsScrolledFromThreshold({ scrollX, scrollY }: ScrollPosition) {
    const xThresholdValue = xThreshold ?? SCROLL_X_THRESHOLD_PX
    const yThresholdValue = yThreshold ?? SCROLL_Y_THRESHOLD_PX
    if (direction === "x") {
      setIsScrolled(scrollX > xThresholdValue)
      return
    }
    if (direction === "y") {
      setIsScrolled(scrollY > yThresholdValue)
      return
    }

    // Default to vertical scroll check
    const thresholdValue = yThresholdValue
    setIsScrolled(scrollY > thresholdValue)
  }

  function setScrollPosition({ scrollX, scrollY }: ScrollPosition) {
    setScrollX(scrollX)
    setScrollY(scrollY)
  }

  function setDocumentScrollSize({ scrollWidth, scrollHeight }: ScrollSize) {
    setScrollWidth(scrollWidth)
    setScrollHeight(scrollHeight)
  }

  function handleWindowScroll() {
    // SSR safety check
    if (typeof window === "undefined") return

    const { scrollX, scrollY } = window
    const { scrollWidth, scrollHeight } = document.documentElement

    setScrollPosition({ scrollX, scrollY })
    setDocumentScrollSize({ scrollWidth, scrollHeight })
    setIsScrolledFromThreshold({ scrollX, scrollY })
  }

  useEffect(() => {
    // SSR safety check
    if (typeof window === "undefined") return

    // Initial scroll
    handleWindowScroll()

    // Event listener for window scroll
    window.addEventListener("scroll", handleWindowScroll, { passive: true })

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("scroll", handleWindowScroll)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return {
    scrollX,
    scrollY,
    isScrolled,
    scrollWidth,
    scrollHeight,
  }
}
