/*
 * useIsScroll.initialization.test.ts
 * Created by Dewan Mobashirul
 * Copyright (c) 2025 Dewan Mobashirul
 * All rights reserved
 */

/*
 * Tests how the hook initializes on first render.
 *
 * These tests verify:
 * - Default values when page is at the top
 * - Correct values when page is already scrolled (e.g., user refreshed mid-page)
 */

import { renderHook } from '@testing-library/react';
import useIsScroll from '../useIsScroll';

describe('useIsScroll - Initialization', () => {
  beforeEach(() => {
    // Setup: Simulate a fresh page load at the top
    // We need to mock these browser properties because jsdom doesn't have a real window

    Object.defineProperty(window, 'scrollX', {
      writable: true,
      configurable: true,
      value: 0, // Start at top-left corner
    });
    Object.defineProperty(window, 'scrollY', {
      writable: true,
      configurable: true,
      value: 0, // Start at top-left corner
    });

    Object.defineProperty(document.documentElement, 'scrollWidth', {
      writable: true,
      configurable: true,
      value: 1000, // Mock page width
    });
    Object.defineProperty(document.documentElement, 'scrollHeight', {
      writable: true,
      configurable: true,
      value: 2000, // Mock page height
    });
  });

  it('should return initial scroll values with default options', () => {
    // When: Hook is initialized without any options
    const { result } = renderHook(() => useIsScroll());

    // Then: Should return current scroll position and page dimensions
    expect(result.current.scrollX).toBe(0); // No horizontal scroll
    expect(result.current.scrollY).toBe(0); // No vertical scroll
    expect(result.current.isScrolled).toBe(false); // Not past threshold (default 16px)
    expect(result.current.scrollWidth).toBe(1000); // Full page width
    expect(result.current.scrollHeight).toBe(2000); // Full page height
  });

  it('should initialize with current scroll position if already scrolled', () => {
    // Given: User has scrolled down before hook initializes
    // (e.g., page refresh, or component mounts late)
    Object.defineProperty(window, 'scrollY', {
      writable: true,
      configurable: true,
      value: 100, // Already scrolled 100px down
    });

    // When: Hook is initialized
    const { result } = renderHook(() => useIsScroll());

    // Then: Should detect the current scroll position
    expect(result.current.scrollY).toBe(100); // Captures current position
    expect(result.current.isScrolled).toBe(true); // 100px > 16px threshold
  });
});
