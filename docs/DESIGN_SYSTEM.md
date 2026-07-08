---
name: High-Performance Habit Tracker
colors:
  surface: '#121414'
  surface-dim: '#121414'
  surface-bright: '#37393a'
  surface-container-lowest: '#0c0f0f'
  surface-container-low: '#1a1c1c'
  surface-container: '#1e2020'
  surface-container-high: '#282a2b'
  surface-container-highest: '#333535'
  on-surface: '#e2e2e2'
  on-surface-variant: '#c4c9ac'
  inverse-surface: '#e2e2e2'
  inverse-on-surface: '#2f3131'
  outline: '#8e9379'
  outline-variant: '#444933'
  surface-tint: '#abd600'
  primary: '#ffffff'
  on-primary: '#283500'
  primary-container: '#c3f400'
  on-primary-container: '#556d00'
  inverse-primary: '#506600'
  secondary: '#c6c6c6'
  on-secondary: '#303030'
  secondary-container: '#474747'
  on-secondary-container: '#b5b5b5'
  tertiary: '#ffffff'
  on-tertiary: '#313030'
  tertiary-container: '#e5e2e1'
  on-tertiary-container: '#656464'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#c3f400'
  primary-fixed-dim: '#abd600'
  on-primary-fixed: '#161e00'
  on-primary-fixed-variant: '#3c4d00'
  secondary-fixed: '#e2e2e2'
  secondary-fixed-dim: '#c6c6c6'
  on-secondary-fixed: '#1b1b1b'
  on-secondary-fixed-variant: '#474747'
  tertiary-fixed: '#e5e2e1'
  tertiary-fixed-dim: '#c8c6c5'
  on-tertiary-fixed: '#1c1b1b'
  on-tertiary-fixed-variant: '#474646'
  background: '#121414'
  on-background: '#e2e2e2'
  surface-variant: '#333535'
typography:
  display-stat:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '800'
    lineHeight: 48px
    letterSpacing: -0.04em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 34px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-caps:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.1em
  stat-label:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  container-padding: 1rem
  gutter: 1rem
  card-gap: 0.75rem
  section-margin: 2rem
  touch-target: 48px
---

## Brand & Style

The design system is engineered for high-performance habit accountability. It targets individuals who view discipline as a lifestyle, demanding a UI that feels like a precision tool rather than a casual social app. 

The aesthetic is **Dark-Mode Minimalism** fused with **High-Performance Tech**. It draws inspiration from athletic performance software (Whoop, Strava) and developer tools. The core identity is "Uncompromising Clarity"—utilizing a pitch-black foundation to eliminate visual noise, allowing the user's progress to shine through with electric intensity. The emotional response should be one of focus, urgency, and technical sophistication.

## Colors

This design system utilizes a high-contrast, OLED-optimized palette. 

- **Primary (Electric Lime):** Reserved for active streaks, primary call-to-actions, and successful completion states. It serves as the "energy" of the system.
- **Background (Pitch Black):** The base layer of the application is true hex `#000000` to maximize contrast and focus.
- **Surface (Deep Charcoal):** Hex `#121212` is used for cards and containers to create subtle depth against the pitch-black background.
- **Typography:** Headlines and primary data points use pure white. Secondary metadata and inactive labels use a muted gray to maintain visual hierarchy.
- **Semantic Indicators:** Standardized colors for status tracking: Green for total success, Yellow for partial progress, Red for "failed" days, and Blue for the "Today" indicator.

## Typography

The system relies on **Inter** for its modern, neutral, and highly legible characteristics. For data-heavy elements and labels, **JetBrains Mono** is introduced to provide a technical, "performance-tracking" feel.

- **Numerals:** Use `display-stat` for the primary "Day X" counter and "Time Remaining" clocks.
- **Hierarchy:** Use tight letter-spacing on large headlines to maintain a compact, aggressive look. 
- **Labels:** Small labels for metadata (e.g., "WATER INTAKE", "WORKOUT 1") should always be uppercase with increased tracking for readability.
- **Accessibility:** Ensure body text never drops below 16px to maintain high legibility during workouts or high-activity scenarios.

## Layout & Spacing

This is a **mobile-first PWA layout**. The design system avoids complex grids in favor of a single-column, card-stacking model that facilitates fast vertical scrolling.

- **Safe Zones:** Content must respect a 16px (1rem) horizontal margin on all mobile devices.
- **The Rhythm:** Use a strict 4px/8px baseline grid. Components are separated by `card-gap` (12px) or `section-margin` (32px) for clear logical grouping.
- **Bottom-Heavy:** Key actions and navigation are positioned at the bottom of the screen (within the "thumb zone") to accommodate one-handed use during physical activity.
- **Responsive:** On larger screens (Tablets), the single column caps at 600px width and centers, preserving the focused mobile experience.

## Elevation & Depth

In a Pitch Black environment, traditional shadows are ineffective. Depth is achieved through **Tonal Layering** and **Glassmorphism**:

- **Layer 0 (Base):** True Black (#000000).
- **Layer 1 (Cards):** Deep Charcoal (#121212).
- **Layer 2 (Overlays/Modals):** A semi-transparent `#1A1A1A` with a 20px backdrop-blur (Glassmorphism). This is used for Bottom Sheets and the Sticky Nav bar.
- **Stroke Depth:** Instead of shadows, use 1px solid borders for active elements. Inactive elements use `#222222`, while focused/active elements use the Primary Electric Lime.
- **Glow:** Highly critical status items (like an active timer) may use a subtle outer glow of the Primary color (opacity 0.15) to simulate a light-emitting screen.

## Shapes

The shape language is "Soft-Tech." It balances the harshness of the black/lime palette with approachable, ergonomic corners.

- **Primary Cards:** Use a 16px (`rounded-lg`) corner radius to create a distinct, modern container feel.
- **Buttons & Inputs:** Follow the `rounded-lg` rule for consistency.
- **Progress Indicators:** Use perfectly circular (pill-shaped) tracks for progress rings and habit-completion toggles.
- **Heatmaps:** GitHub-style activity squares should have a small 2px radius to remain legible at small scales.

## Components

- **Habit Cards:** High-contrast containers (#121212) featuring a Primary color check-action on the right. When a habit is "checked," the card border should transition from subtle gray to Electric Lime.
- **Progress Rings:** Large, center-aligned SVG strokes. The "track" is dark gray, and the "progress" is the Primary Electric Lime with a subtle glow.
- **Sticky Bottom Nav:** A glassmorphic bar (80% opacity) with a 20px blur. Icons should be minimal line-art; the active state is indicated by the Primary color and a small dot below the icon.
- **Bottom Sheets:** Used for all data entry (e.g., logging water, adding a photo). Sheets slide up from the bottom with a 16px top-corner radius and a dimming backdrop overlay.
- **Heatmap (GitHub Style):** A 7x11 grid representing the 75 days. Empty days are dark gray; completed days are Electric Lime. The "Current Day" should pulse subtly.
- **Buttons:**
  - *Primary:* Solid Electric Lime with Black text. 
  - *Secondary:* Outline (1px Electric Lime) with White text.
  - *Ghost:* White text, no background, used for "Cancel" or "Back" actions.