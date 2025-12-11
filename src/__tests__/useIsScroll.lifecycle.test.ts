/*
 * useIsScroll.lifecycle.test.ts
 * Created by Dewan Mobashirul
 * Copyright (c) 2025 Dewan Mobashirul
 * All rights reserved
 */

/*
 * Tests for hook lifecycle, dimensions, cleanup, and option updates
 *
 * These tests verify advanced features:
 * - Document dimensions tracking (full page width/height)
 * - Proper cleanup to prevent memory leaks
 * - Dynamic option updates (changing direction/threshold on the fly)
 */

import { renderHook, act } from '@testing-library/react';
import useIsScroll from '../useIsScroll';

describe('useIsScroll - Lifecycle & Advanced Features', () => {
  beforeEach(() => {
    // Setup: Reset scroll position to origin
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
      value: 1000, // Initial page width
    });
    Object.defineProperty(document.documentElement, 'scrollHeight', {
      writable: true,
      configurable: true,
      value: 2000, // Initial page height
    });
  });

  afterEach(() => {
    // Cleanup: Clear any mocks after each test
    jest.clearAllMocks();
  });

  describe('Document Dimensions', () => {
    it('should track document scrollWidth and scrollHeight', () => {
      // Given: Hook is initialized
      // Use case: Knowing total scrollable area for scroll progress bars
      const { result } = renderHook(() => useIsScroll());

      // Initially: Returns initial document dimensions
      expect(result.current.scrollWidth).toBe(1000); // Total width
      expect(result.current.scrollHeight).toBe(2000); // Total height

      // When: Document size changes (e.g., content loads dynamically)
      act(() => {
        Object.defineProperty(document.documentElement, 'scrollWidth', {
          writable: true,
          configurable: true,
          value: 1500, // Page grew wider
        });
        Object.defineProperty(document.documentElement, 'scrollHeight', {
          writable: true,
          configurable: true,
          value: 3000, // Page grew taller
        });
        window.dispatchEvent(new Event('scroll'));
      });

      // Then: Hook updates to reflect new dimensions
      expect(result.current.scrollWidth).toBe(1500); // Updated width
      expect(result.current.scrollHeight).toBe(3000); // Updated height
    });
  });

  describe('Cleanup', () => {
    it('should remove scroll event listener on unmount', () => {
      // Given: Spy on window.removeEventListener to verify cleanup
      // Important: Prevents memory leaks in SPAs
      const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');
      const { unmount } = renderHook(() => useIsScroll());

      // When: Component unmounts (user navigates away)
      unmount();

      // Then: Hook cleans up its scroll listener
      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        'scroll',
        expect.any(Function) // The specific handler function
      );
    });
  });

  describe('Dynamic Option Updates', () => {
    it('should update when direction changes', () => {
      // Given: Hook starts tracking vertical scroll
      // Use case: UI that switches between horizontal/vertical modes
      const { result, rerender } = renderHook(
        ({ direction }: { direction: 'x' | 'y' }) => useIsScroll({ direction }),
        { initialProps: { direction: 'y' as 'x' | 'y' } }
      );

      // Setup: Scroll both directions
      act(() => {
        Object.defineProperty(window, 'scrollY', {
          writable: true,
          configurable: true,
          value: 50, // Scrolled down 50px
        });
        Object.defineProperty(window, 'scrollX', {
          writable: true,
          configurable: true,
          value: 10, // Scrolled right 10px
        });
        window.dispatchEvent(new Event('scroll'));
      });

      // Initially: Vertical scroll (50px) exceeds threshold (16px)
      expect(result.current.isScrolled).toBe(true);

      // When: Direction changes to horizontal
      rerender({ direction: 'x' });

      // Then: Now checking horizontal scroll (10px) vs threshold (16px)
      expect(result.current.isScrolled).toBe(false); // 10px < 16px
    });

    it('should update when threshold changes', () => {
      // Given: Hook with low threshold (10px)
      // Use case: Adjusting sensitivity based on user preferences
      const { result, rerender } = renderHook(
        ({ yThreshold }) => useIsScroll({ yThreshold }),
        { initialProps: { yThreshold: 10 } }
      );

      // Setup: Scroll to 15px
      act(() => {
        Object.defineProperty(window, 'scrollY', {
          writable: true,
          configurable: true,
          value: 15,
        });
        window.dispatchEvent(new Event('scroll'));
      });

      // Initially: 15px > 10px threshold
      expect(result.current.isScrolled).toBe(true);

      // When: Threshold increases to 20px (same scroll position)
      rerender({ yThreshold: 20 });

      // Then: Same position (15px) now below new threshold (20px)
      expect(result.current.isScrolled).toBe(false);
    });
  });
});
