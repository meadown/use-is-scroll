/*
 * useIsScroll.horizontal.test.ts
 * Created by Dewan Mobashirul
 * Copyright (c) 2025 Dewan Mobashirul
 * All rights reserved
 */

/*
 * Tests for horizontal scrolling behavior
 *
 * These tests verify:
 * - Tracking scroll on the X axis (left/right scrolling)
 * - Custom threshold support for horizontal scrolling
 * - Use case: Useful for carousels, horizontal galleries, or wide tables
 */

import { renderHook, act } from '@testing-library/react';
import useIsScroll from '../useIsScroll';

describe('useIsScroll - Horizontal Scrolling', () => {
  beforeEach(() => {
    // Setup: Reset scroll position to origin (top-left)
    Object.defineProperty(window, 'scrollX', {
      writable: true,
      configurable: true,
      value: 0, // No horizontal scroll
    });
    Object.defineProperty(window, 'scrollY', {
      writable: true,
      configurable: true,
      value: 0, // No vertical scroll
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

  it('should track horizontal scroll when direction is "x"', () => {
    // Given: Hook configured to track horizontal scrolling
    const { result } = renderHook(() => useIsScroll({ direction: 'x' }));

    // Initially: User hasn't scrolled yet
    expect(result.current.isScrolled).toBe(false); // 0px <= 16px default threshold

    // When: User scrolls horizontally to the right
    act(() => {
      Object.defineProperty(window, 'scrollX', {
        writable: true,
        configurable: true,
        value: 20, // Scroll 20px to the right
      });
      window.dispatchEvent(new Event('scroll'));
    });

    // Then: Hook detects horizontal scroll past threshold
    expect(result.current.scrollX).toBe(20); // Captures X position
    expect(result.current.isScrolled).toBe(true); // 20px > 16px default threshold
  });

  it('should respect custom xThreshold', () => {
    // Given: Hook with custom 100px horizontal threshold
    // Use case: Only trigger UI changes after significant horizontal scroll
    const { result } = renderHook(() =>
      useIsScroll({ direction: 'x', xThreshold: 100 })
    );

    // When: User scrolls 50px horizontally (below threshold)
    act(() => {
      Object.defineProperty(window, 'scrollX', {
        writable: true,
        configurable: true,
        value: 50,
      });
      window.dispatchEvent(new Event('scroll'));
    });

    // Then: Not considered "scrolled" yet
    expect(result.current.scrollX).toBe(50); // Position tracked
    expect(result.current.isScrolled).toBe(false); // 50px <= 100px threshold

    // When: User scrolls past the custom threshold
    act(() => {
      Object.defineProperty(window, 'scrollX', {
        writable: true,
        configurable: true,
        value: 150, // Now past 100px threshold
      });
      window.dispatchEvent(new Event('scroll'));
    });

    // Then: Now considered "scrolled"
    expect(result.current.scrollX).toBe(150); // Position tracked
    expect(result.current.isScrolled).toBe(true); // 150px > 100px threshold
  });
});
