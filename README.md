# @meadown/useisscroll

A lightweight React hook to track window scroll position and document dimensions.

## Installation

```bash
npm install @meadown/useisscroll
```

or with yarn:

```bash
yarn add @meadown/useisscroll
```

## Features

- Track horizontal and vertical scroll positions
- Monitor document scroll dimensions
- Customizable scroll thresholds
- TypeScript support
- Lightweight with no dependencies
- Passive scroll event listeners for better performance

## Usage

### Basic Example (Vertical Scrolling)

```tsx
import { useIsScroll } from '@meadown/useisscroll'

function MyComponent() {
  const { scrollY, isScrolled } = useIsScroll()

  return (
    <div>
      <p>Scroll Y: {scrollY}px</p>
      <p>Has scrolled: {isScrolled ? 'Yes' : 'No'}</p>
    </div>
  )
}
```

### Horizontal Scrolling with Custom Threshold

```tsx
import { useIsScroll } from '@meadown/useisscroll'

function MyComponent() {
  const { scrollX, isScrolled } = useIsScroll({
    direction: 'x',
    xThreshold: 32
  })

  return (
    <div>
      <p>Scroll X: {scrollX}px</p>
      <p>Has scrolled horizontally: {isScrolled ? 'Yes' : 'No'}</p>
    </div>
  )
}
```

### Complete Example

```tsx
import { useIsScroll } from '@meadown/useisscroll'

function ScrollTracker() {
  const { scrollX, scrollY, isScrolled, scrollWidth, scrollHeight } = useIsScroll({
    direction: 'y',
    yThreshold: 100
  })

  return (
    <div>
      <h2>Scroll Information</h2>
      <p>Scroll Position: X={scrollX}px, Y={scrollY}px</p>
      <p>Document Size: {scrollWidth}px × {scrollHeight}px</p>
      <p>Scrolled past threshold: {isScrolled ? 'Yes' : 'No'}</p>
    </div>
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
  ScrollSize
} from '@meadown/useisscroll'
```

## License

MIT

## Author

Dewan Mobashirul

Copyright (c) 2025 Dewan Mobashirul. All rights reserved.
