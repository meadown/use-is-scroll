# @meadown/useisscroll

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-16.8%2B-61dafb.svg)](https://react.dev/)
[![Next.js](https://img.shields.io/badge/Next.js-13%2B-black.svg)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![GitHub](https://img.shields.io/badge/GitHub-meadown-black?style=flat&logo=github)](https://github.com/meadown)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Dewan%20Mobashirul-blue?style=flat&logo=linkedin)](https://linkedin.com/in/dewan-meadown)

A lightweight React hook to track window scroll position and document dimensions.

```_
AUTHOR
Dewan Mobashirul
Copyright (c) 2025 Dewan Mobashirul
All rights reserved
```

## Table of Contents

- [@meadown/useisscroll](#meadownuseisscroll)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
  - [Features](#features)
    - [Core Functionality](#core-functionality)
    - [Technical Advantages](#technical-advantages)
  - [Common Use Cases](#common-use-cases)
  - [Usage](#usage)
    - [Basic Example (Vertical Scrolling)](#basic-example-vertical-scrolling)
    - [Horizontal Scrolling with Custom Threshold](#horizontal-scrolling-with-custom-threshold)
    - [Complete Example](#complete-example)
    - [Real-World Examples](#real-world-examples)
      - [Sticky Navigation Bar](#sticky-navigation-bar)
      - [Scroll-to-Top Button](#scroll-to-top-button)
      - [Reading Progress Bar](#reading-progress-bar)
  - [API](#api)
    - [`useIsScroll(options?)`](#useisscrolloptions)
      - [Parameters](#parameters)
      - [Returns](#returns)
  - [TypeScript](#typescript)
  - [Browser Compatibility](#browser-compatibility)
  - [Server-Side Rendering (SSR)](#server-side-rendering-ssr)
  - [Performance Considerations](#performance-considerations)
  - [Troubleshooting](#troubleshooting)
    - [Common Issues](#common-issues)
  - [FAQ](#faq)
  - [Contributing](#contributing)
  - [License](#license)

## Installation

```bash
npm install @meadown/useisscroll
```

or with yarn:

```bash
yarn add @meadown/useisscroll
```

or with pnpm:

```bash
pnpm add @meadown/useisscroll
```

## Features

### Core Functionality

- **Real-time Scroll Tracking** - Monitor horizontal (X) and vertical (Y) scroll positions in pixels
- **Document Dimensions** - Access full document scrollable width and height
- **Smart Threshold Detection** - Customizable thresholds to detect when scrolling has occurred
- **Flexible Direction Control** - Choose to track horizontal or vertical scrolling independently

### Technical Advantages

- **Zero Dependencies** - Lightweight implementation with no external dependencies
- **Full TypeScript Support** - Complete type definitions included
- **Performance Optimized** - Uses passive event listeners for smooth scrolling
- **Automatic Cleanup** - Properly removes event listeners on component unmount
- **SSR Compatible** - Works with Next.js App Router and Pages Router
- **Tree-Shakeable** - ES modules support for optimal bundle sizes
- **Dual Package** - Supports both ESM and CommonJS

## Common Use Cases

This hook is perfect for implementing:

- **Sticky Headers/Navbars** - Show/hide navigation based on scroll position
- **Scroll Progress Indicators** - Display reading progress bars
- **Infinite Scroll** - Load more content as user scrolls down
- **Scroll-to-Top Buttons** - Show button after user scrolls past threshold
- **Parallax Effects** - Create scroll-based animations
- **Analytics Tracking** - Monitor user scroll depth
- **Dynamic Styling** - Change UI elements based on scroll position

## Usage

### Basic Example (Vertical Scrolling)

```tsx
import { useIsScroll } from "@meadown/useisscroll"

function MyComponent() {
  const { scrollY, isScrolled } = useIsScroll()

  return (
    <div>
      <p>Scroll Y: {scrollY}px</p>
      <p>Has scrolled: {isScrolled ? "Yes" : "No"}</p>
    </div>
  )
}
```

### Horizontal Scrolling with Custom Threshold

```tsx
import { useIsScroll } from "@meadown/useisscroll"

function MyComponent() {
  const { scrollX, isScrolled } = useIsScroll({
    direction: "x",
    xThreshold: 32,
  })

  return (
    <div>
      <p>Scroll X: {scrollX}px</p>
      <p>Has scrolled horizontally: {isScrolled ? "Yes" : "No"}</p>
    </div>
  )
}
```

### Complete Example

```tsx
import { useIsScroll } from "@meadown/useisscroll"

function ScrollTracker() {
  const { scrollX, scrollY, isScrolled, scrollWidth, scrollHeight } =
    useIsScroll({
      direction: "y",
      yThreshold: 100,
    })

  return (
    <div>
      <h2>Scroll Information</h2>
      <p>
        Scroll Position: X={scrollX}px, Y={scrollY}px
      </p>
      <p>
        Document Size: {scrollWidth}px × {scrollHeight}px
      </p>
      <p>Scrolled past threshold: {isScrolled ? "Yes" : "No"}</p>
    </div>
  )
}
```

### Real-World Examples

#### Dynamic Threshold Based on Screen Size

```tsx
import { useIsScroll } from "@meadown/useisscroll"
import { useState, useEffect } from "react"

function ResponsiveScrollDetection() {
  const [threshold, setThreshold] = useState(50)
  const { isScrolled } = useIsScroll({ yThreshold: threshold })

  useEffect(() => {
    // Adjust threshold based on screen width
    const updateThreshold = () => {
      setThreshold(window.innerWidth < 768 ? 30 : 50)
    }

    updateThreshold()
    window.addEventListener("resize", updateThreshold)
    return () => window.removeEventListener("resize", updateThreshold)
  }, [])

  return <div>{isScrolled ? "Scrolled!" : "At top"}</div>
}
```

#### Sticky Navigation Bar

```tsx
import { useIsScroll } from "@meadown/useisscroll"

function StickyNav() {
  const { isScrolled } = useIsScroll({ yThreshold: 50 })

  return (
    <nav
      className={`navbar ${isScrolled ? "navbar-sticky" : ""}`}
      style={{
        position: "fixed",
        top: 0,
        width: "100%",
        background: isScrolled ? "white" : "transparent",
        boxShadow: isScrolled ? "0 2px 4px rgba(0,0,0,0.1)" : "none",
        transition: "all 0.3s ease",
      }}
    >
      <div>Your Navigation Content</div>
    </nav>
  )
}
```

#### Scroll-to-Top Button

```tsx
import { useIsScroll } from "@meadown/useisscroll"

function ScrollToTopButton() {
  const { isScrolled, scrollY } = useIsScroll({ yThreshold: 300 })

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  if (!isScrolled) return null

  return (
    <button
      onClick={scrollToTop}
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        padding: "12px 16px",
        borderRadius: "50%",
        background: "#007bff",
        color: "white",
        border: "none",
        cursor: "pointer",
        opacity: scrollY > 300 ? 1 : 0,
        transition: "opacity 0.3s ease",
      }}
      aria-label="Scroll to top"
    >
      ↑
    </button>
  )
}
```

#### Reading Progress Bar

```tsx
import { useIsScroll } from "@meadown/useisscroll"

function ReadingProgress() {
  const { scrollY, scrollHeight } = useIsScroll()

  const progress = Math.min(
    (scrollY / (scrollHeight - window.innerHeight)) * 100,
    100
  )

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        height: "4px",
        background: "linear-gradient(to right, #4CAF50, #2196F3)",
        width: `${progress}%`,
        transition: "width 0.1s ease",
        zIndex: 9999,
      }}
    />
  )
}
```

## API

### `useIsScroll(options?)`

#### Parameters

- `options` (optional): Configuration object
  - `direction`: `'x' | 'y'` - Axis to evaluate for `isScrolled` (default: `'y'`)
  - `xThreshold`: `number` - Horizontal scroll threshold in pixels (default: `16`)
  - `yThreshold`: `number` - Vertical scroll threshold in pixels (default: `16`)

#### Returns

An object containing:

- `scrollX`: `number` - Current horizontal scroll offset in pixels
- `scrollY`: `number` - Current vertical scroll offset in pixels
- `isScrolled`: `boolean` - True when the selected axis exceeds its threshold
- `scrollWidth`: `number` - Full document scrollable width in pixels
- `scrollHeight`: `number` - Full document scrollable height in pixels

## TypeScript

This package includes TypeScript type definitions. All types are exported:

```tsx
import {
  useIsScroll,
  UseIsScrollOption,
  UseIsScrollReturn,
  ScrollPosition,
  ScrollSize,
} from "@meadown/useisscroll"
```

## Browser Compatibility

This hook is compatible with all modern browsers that support:

- ES2020+ features
- React 16.8+ (Hooks)
- Window scroll events
- Passive event listeners

**Supported Browsers:**

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Opera 76+

**Note:** This package uses modern JavaScript features and may require polyfills for older browsers.

## Server-Side Rendering (SSR)

This hook is designed for client-side use and includes the `"use client"` directive for Next.js App Router compatibility.

**Next.js App Router (13+):**

```tsx
"use client"
import { useIsScroll } from "@meadown/useisscroll"

export default function MyComponent() {
  const { scrollY, isScrolled } = useIsScroll()
  // Component code...
}
```

**Next.js Pages Router:**

```tsx
import dynamic from "next/dynamic"

const ScrollComponent = dynamic(() => import("./ScrollComponent"), {
  ssr: false,
})

export default function Page() {
  return <ScrollComponent />
}
```

**Important:** The hook accesses `window` and `document` objects, which are not available during server-side rendering. Always ensure components using this hook are client-side only.

## Performance Considerations

This hook is optimized for performance with the following features:

**Built-in Optimizations:**

- Passive event listeners to improve scroll performance
- Single scroll event listener per hook instance
- Optimized with single state update per scroll event (prevents multiple re-renders)
- Automatic cleanup on component unmount
- Efficient dependency tracking for dynamic option changes

**Best Practices:**

- Avoid using this hook in multiple components on the same page when possible
- Consider memoizing child components that use scroll values to prevent unnecessary re-renders
- For heavy computations based on scroll values, use `useMemo` or `useCallback`

**Example with memoization:**

```tsx
import { useMemo } from "react"
import { useIsScroll } from "@meadown/useisscroll"

function MyComponent() {
  const { scrollY, isScrolled } = useIsScroll()

  const scrollPercentage = useMemo(() => {
    return Math.round((scrollY / document.documentElement.scrollHeight) * 100)
  }, [scrollY])

  return <div>Scrolled: {scrollPercentage}%</div>
}
```

**Note:** Scroll events fire frequently. If you're performing expensive operations based on scroll values, consider implementing your own throttling or debouncing logic.

## Troubleshooting

### Common Issues

**"window is not defined" error:**

- Make sure you're using the hook only in client-side components
- For Next.js, add `"use client"` directive or use dynamic imports with `ssr: false`

**Dynamic threshold updates:**

- The hook automatically responds to changes in `direction`, `xThreshold`, and `yThreshold` options
- When you change these values, the scroll listener is recreated with the new configuration
- This allows for dynamic threshold adjustments based on your component state

**High CPU usage:**

- Scroll events fire very frequently. Make sure you're not performing expensive calculations on every render
- Use `useMemo` and `useCallback` to optimize child components
- Consider implementing throttling for your use case

## FAQ

**Q: Can I use this hook multiple times in the same component?**
A: Yes, but each instance will add its own scroll listener. For better performance, use it once and pass the values down to child components.

**Q: Does this work with custom scrollable containers?**
A: No, this hook specifically tracks window scroll. For custom containers, you'll need a different solution that attaches listeners to specific DOM elements.

**Q: How do I track scroll percentage?**
A: Calculate it using the returned values:

```tsx
const { scrollY, scrollHeight } = useIsScroll()
const percentage = (scrollY / (scrollHeight - window.innerHeight)) * 100
```

**Q: Can I use this with React Native?**
A: No, this hook is designed for web browsers and uses web-specific APIs (`window`, `document`).

## Contributing

Contributions are welcome! If you'd like to contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

**Development Setup:**

```bash
# Clone the repository
git clone https://github.com/meadown/useisscroll.git
cd useisscroll

# Install dependencies (choose one)
npm install
# or
yarn install
# or
pnpm install

# Build the package
npm run build

# Watch mode for development
npm run dev
```

Please ensure your code follows the existing style and includes appropriate tests.

## License

[MIT](./LICENSE)
