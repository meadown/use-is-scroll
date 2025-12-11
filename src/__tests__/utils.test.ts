/*
 * utils.test.ts
 * Created by Dewan Mobashirul
 * Copyright (c) 2025 Dewan Mobashirul
 * All rights reserved
 */

import { getInitialScrollValues } from '../utils';

describe('getInitialScrollValues', () => {
  describe('browser environment', () => {
    beforeEach(() => {
      Object.defineProperty(window, 'scrollX', {
        writable: true,
        configurable: true,
        value: 100,
      });
      Object.defineProperty(window, 'scrollY', {
        writable: true,
        configurable: true,
        value: 200,
      });
      Object.defineProperty(document.documentElement, 'scrollWidth', {
        writable: true,
        configurable: true,
        value: 1500,
      });
      Object.defineProperty(document.documentElement, 'scrollHeight', {
        writable: true,
        configurable: true,
        value: 3000,
      });
    });

    it('should return current scroll position and document dimensions', () => {
      const result = getInitialScrollValues();

      expect(result).toEqual({
        scrollX: 100,
        scrollY: 200,
        scrollWidth: 1500,
        scrollHeight: 3000,
      });
    });

    it('should return zero values when scroll values are not available', () => {
      Object.defineProperty(window, 'scrollX', {
        writable: true,
        configurable: true,
        value: undefined,
      });
      Object.defineProperty(window, 'scrollY', {
        writable: true,
        configurable: true,
        value: undefined,
      });

      const result = getInitialScrollValues();

      expect(result.scrollX).toBe(0);
      expect(result.scrollY).toBe(0);
    });
  });

  describe('SSR environment simulation', () => {
    it('should handle missing scroll properties gracefully', () => {
      // Test with undefined/null scroll values
      const originalScrollX = Object.getOwnPropertyDescriptor(window, 'scrollX');
      const originalScrollY = Object.getOwnPropertyDescriptor(window, 'scrollY');
      const originalScrollWidth = Object.getOwnPropertyDescriptor(
        document.documentElement,
        'scrollWidth'
      );
      const originalScrollHeight = Object.getOwnPropertyDescriptor(
        document.documentElement,
        'scrollHeight'
      );

      Object.defineProperty(window, 'scrollX', {
        value: undefined,
        configurable: true,
      });
      Object.defineProperty(window, 'scrollY', {
        value: undefined,
        configurable: true,
      });
      Object.defineProperty(document.documentElement, 'scrollWidth', {
        value: undefined,
        configurable: true,
      });
      Object.defineProperty(document.documentElement, 'scrollHeight', {
        value: undefined,
        configurable: true,
      });

      const result = getInitialScrollValues();

      expect(result).toEqual({
        scrollX: 0,
        scrollY: 0,
        scrollWidth: 0,
        scrollHeight: 0,
      });

      // Restore original properties
      if (originalScrollX) {
        Object.defineProperty(window, 'scrollX', originalScrollX);
      }
      if (originalScrollY) {
        Object.defineProperty(window, 'scrollY', originalScrollY);
      }
      if (originalScrollWidth) {
        Object.defineProperty(document.documentElement, 'scrollWidth', originalScrollWidth);
      }
      if (originalScrollHeight) {
        Object.defineProperty(document.documentElement, 'scrollHeight', originalScrollHeight);
      }
    });
  });
});
