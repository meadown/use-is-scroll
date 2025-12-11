/*
 * useIsScroll.vertical.test.ts
 * Created by Dewan Mobashirul
 * Copyright (c) 2025 Dewan Mobashirul
 * All rights reserved
 */


/*
 * Tests for vertical scrolling behavior
 *
 * These tests verify:
 * - Default Y-axis (up/down) scrolling - this is the most common use case
 * - Default 16px threshold for detecting scroll
 * - Custom threshold support for different UX requirements
 * - Use case: Hide/show header, fade in elements, trigger animations
 */

import { renderHook, act } from '@testing-library/react';
import useIsScroll from '../useIsScroll';

describe('useIsScroll - Vertical Scrolling', () => {
  beforeEach(() => {
    // Setup: Reset scroll position to top of page
    Object.defineProperty(window, 'scrollX', {
      writable: true,
      configurable: true,
      value: 0, // No horizontal scroll
    });
    Object.defineProperty(window, 'scrollY', {
      writable: true,
      configurable: true,
      value: 0, // Start at top
    });

    // Setup: Mock document dimensions
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

  it('should update isScrolled when scrolling past default threshold (16px)', () => {
    // Given: Hook with default settings (vertical, 16px threshold)
    const { result } = renderHook(() => useIsScroll());

    // Initially: User at top of page
    expect(result.current.isScrolled).toBe(false); // 0px <= 16px threshold

    // When: User scrolls down past the default 16px threshold
    act(() => {
      Object.defineProperty(window, 'scrollY', {
        writable: true,
        configurable: true,
        value: 20, // Scroll down 20px
      });
      window.dispatchEvent(new Event('scroll'));
    });

    // Then: Hook detects scroll past threshold
    expect(result.current.scrollY).toBe(20); // Captures exact position
    expect(result.current.isScrolled).toBe(true); // 20px > 16px threshold
  });

  it('should respect custom yThreshold', () => {
    // Given: Hook with custom 50px threshold
    // Use case: Only hide header after user has scrolled significantly
    const { result } = renderHook(() => useIsScroll({ yThreshold: 50 }));

    // When: User scrolls 30px (below custom threshold)
    act(() => {
      Object.defineProperty(window, 'scrollY', {
        writable: true,
        configurable: true,
        value: 30,
      });
      window.dispatchEvent(new Event('scroll'));
    });

    // Then: Still not considered "scrolled"
    expect(result.current.scrollY).toBe(30); // Position tracked
    expect(result.current.isScrolled).toBe(false); // 30px <= 50px threshold

    // When: User scrolls past the custom threshold
    act(() => {
      Object.defineProperty(window, 'scrollY', {
        writable: true,
        configurable: true,
        value: 60, // Now past 50px threshold
      });
      window.dispatchEvent(new Event('scroll'));
    });

    // Then: Now crosses the threshold
    expect(result.current.scrollY).toBe(60); // Position tracked
    expect(result.current.isScrolled).toBe(true); // 60px > 50px threshold
  });

  it('should update scroll position on scroll event', () => {
    // Given: Hook tracking scroll position
    const { result } = renderHook(() => useIsScroll());

    // When: User scrolls to arbitrary position
    act(() => {
      Object.defineProperty(window, 'scrollY', {
        writable: true,
        configurable: true,
        value: 100, // Scroll to 100px
      });
      window.dispatchEvent(new Event('scroll'));
    });

    // Then: Hook captures the exact scroll position
    expect(result.current.scrollY).toBe(100); // Exact position returned
  });
});
