# BirthHub 360 Design System

## 1. Introduction
This document outlines the consolidated Design System for BirthHub 360. It serves as the single source of truth for all visual elements, ensuring the platform feels like a cohesive "Intelligent Business Command Center".

We use Tailwind CSS (v4 structure via PostCSS) and CSS variables in `src/styles/globals.css`. Do not create parallel JS token files (`tokens.ts`).

## 2. Color System
The color system reflects precision, intelligence, and premium technology.

### Brand Colors
- **Obsidian (Navy):** `#0b132b` - The dark foundation. Authoritative, technological.
- **Gold:** `#d4af37` - The strategic accent. Premium, highlighted actions.
- **White / Off-White:** `#ffffff` / `#f8fafc` - Breathing room and high contrast.

### Semantic Colors
- **Success:** `#10b981` (Emerald)
- **Warning:** `#f59e0b` (Amber)
- **Danger:** `#ef4444` (Red)
- **Info:** `#3b82f6` (Blue)
- **Intelligence (Iris/Blue):** Used sparingly for AI highlights without aggressive glowing effects.

### Surfaces (Light/Dark Mode via CSS variables)
- **Background:** Page background.
- **Surface:** Card and panel backgrounds.
- **Surface Elevated:** Modals, dropdowns.
- **Surface Interactive:** Hover states for structural elements.
- **Lines/Borders:** Subtle separators (`--color-line`).

## 3. Typography
- **Display / Headings:** Sans-serif/Display font (`var(--font-display)`) for large impact.
- **Body:** System UI or a clean sans-serif (`var(--font-sans)`) for maximum data legibility.
- **Mono:** `IBM Plex Mono` for tabular data, IDs, and financial metrics.

## 4. Spacing System
A logical 4pt grid system:
- `spacing-0`: 0px
- `spacing-1`: 4px
- `spacing-2`: 8px
- `spacing-3`: 12px
- `spacing-4`: 16px
- `spacing-6`: 24px
- `spacing-8`: 32px
- `spacing-12`: 48px

## 5. Radius System
Purposeful rounding. No excessive "pill" shapes unless explicitly an action badge.
- `radius-none`: 0px (Sharper, more serious components)
- `radius-sm`: 4px (Inner elements, small inputs)
- `radius-md`: 8px (Standard cards, buttons)
- `radius-lg`: 12px (Large panels, modals)
- `radius-full`: 9999px (Avatars, specific status dots)

## 6. Shadows & Depth
- **shadow-none:** Default for most surfaces (flat design).
- **shadow-sm:** Subtle depth for active buttons.
- **shadow-md:** Floating cards, headers.
- **shadow-lg:** Popovers, tooltips.
- **shadow-xl:** Modals, Command Menu (highest Z-index).

## 7. Motion & Animation
- No bounce or elastic easing.
- **duration-fast:** 150ms (Hover states, microinteractions)
- **duration-normal:** 200ms (Dialog opens, page transitions)
- **duration-slow:** 300ms (Complex state reveals, orbital animations)
- **easing:** `ease-out` (Decelerating, mechanical, predictable)

## 8. Components Baseline
- **Buttons:** Solid Gold (primary) or Navy (secondary) with predictable hover states. No gradients.
- **Inputs:** Clean borders, subtle focus rings (no heavy outlines).
- **Cards:** Defined by subtle background shifts rather than heavy borders.
- **Orbital System:** The primary visual metaphor for 360 orchestration. Animated SVG or CSS paths mapping Data -> Intelligence -> Execution.
