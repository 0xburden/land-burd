# AGENTS.md - Coding Agent Guidelines

This document provides guidelines for AI coding agents working in this repository.

## Project Overview

A personal landing page for 0xburden that mimics a macOS desktop experience. Built with Astro, React, Tailwind CSS v4, and DaisyUI.

## Tech Stack

- **Framework**: Astro 5.x with React integration
- **Styling**: Tailwind CSS v4 + DaisyUI v5
- **Language**: TypeScript (strict mode)
- **Package Manager**: pnpm
- **Animation**: GSAP (for draggable/resizable components)
- **Icons**: Google Material Symbols
- **Fonts**: IBM Plex Mono (terminal)

## Commands

### Development

```sh
pnpm install          # Install dependencies
pnpm dev              # Start dev server at localhost:4321
pnpm build            # Build for production
pnpm preview          # Preview production build
```

### Linting

```sh
pnpm eslint .                    # Lint all files
pnpm eslint src/                 # Lint src directory
pnpm eslint src/components/      # Lint specific directory
pnpm eslint path/to/file.tsx     # Lint single file
pnpm eslint . --fix              # Auto-fix issues
```

### Type Checking

```sh
pnpm astro check                 # Run Astro type checking
npx tsc --noEmit                 # TypeScript type check only
```

## Code Style Guidelines

### Formatting Rules (ESLint Enforced)

- **Quotes**: Use double quotes (`"`) for strings
- **Semicolons**: No semicolons (omit them)
- **Indentation**: 2 spaces

```typescript
// Correct
import { useState } from "react"
const name = "0xburden"

// Incorrect
import { useState } from 'react';
const name = '0xburden';
```

### TypeScript

- Use strict mode (configured in tsconfig.json)
- Define interfaces for component props
- Use explicit return types for complex functions
- Prefer `interface` over `type` for object shapes

```typescript
// Props interface pattern
interface TerminalProps {
  onClose: () => void
  onMinimize: () => void
}

export default function Terminal({ onClose, onMinimize }: TerminalProps) {
  // ...
}
```

### React Components

- Use function components with hooks
- Export components as default exports
- Use `useRef` with proper typing: `useRef<HTMLDivElement>(null)`
- Handle SSR with `typeof window !== "undefined"` checks

```typescript
// SSR-safe window access
const isMobile = typeof window !== "undefined" && window.innerWidth < 768
```

### Astro Components

- Use `.astro` extension for static/layout components
- Use `.tsx` for interactive React components with `client:load`
- Define Props interface in frontmatter

```astro
---
interface Props {
  title: string
}
const { title } = Astro.props
---
```

### Imports

Order imports as follows:
1. React/framework imports
2. Third-party libraries
3. Local components
4. Types/interfaces

```typescript
import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import { Draggable } from "gsap/Draggable"
import Terminal from "./Terminal"
import MenuBar from "./MenuBar"
```

### Naming Conventions

- **Components**: PascalCase (`Terminal.tsx`, `MenuBar.tsx`)
- **Files**: PascalCase for components, kebab-case for assets
- **Variables/Functions**: camelCase
- **Constants**: camelCase or UPPER_SNAKE_CASE for true constants
- **Interfaces**: PascalCase with descriptive names (`TerminalProps`, `DesktopIcon`)
- **Event Handlers**: Prefix with `handle` (`handleClick`, `handleMinimize`)

### Tailwind CSS

- Use Tailwind v4 syntax with `@import "tailwindcss"`
- DaisyUI loaded via `@plugin "daisyui"`
- Prefer Tailwind classes over inline styles
- Use responsive prefixes: `md:`, `sm:`, etc.
- Use arbitrary values sparingly: `text-[0.5rem]`

```tsx
// Responsive classes pattern
className="w-24 md:w-20 text-6xl md:text-5xl"
```

### Error Handling

- Use optional chaining: `inputRef.current?.focus()`
- Guard clauses for early returns
- Check for browser APIs before using them

### File Structure

```
src/
├── components/       # React (.tsx) and Astro (.astro) components
├── layouts/          # Astro layout components
├── pages/            # Astro pages (file-based routing)
└── styles/           # Global CSS (Tailwind)
public/               # Static assets (images, favicons)
```

### Accessibility

- Include `aria-label` on interactive elements without visible text
- Use semantic HTML elements
- Ensure proper button `type` attributes
- Support keyboard navigation

```tsx
<button
  type="button"
  onClick={onClose}
  aria-label="Close terminal"
/>
```

### Responsive Design

- Mobile-first approach
- md breakpoint (768px) for desktop features
- Terminal: 100vw on mobile, 25-75vw on desktop
- Hide non-essential UI on mobile (nav items)

## Notes

- No test framework is currently configured
- The LSP may show false errors for Tailwind v4 syntax in CSS files - these can be ignored
- GSAP is used for drag/resize functionality in the Terminal component
