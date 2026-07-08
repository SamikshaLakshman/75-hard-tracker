---
name: Hardline Performance
colors:
  surface: '#111508'
  surface-dim: '#111508'
  surface-bright: '#373b2c'
  surface-container-lowest: '#0c0f04'
  surface-container-low: '#1a1d10'
  surface-container: '#1e2113'
  surface-container-high: '#282b1d'
  surface-container-highest: '#333627'
  on-surface: '#e2e4cf'
  on-surface-variant: '#c4c9ac'
  inverse-surface: '#e2e4cf'
  inverse-on-surface: '#2f3223'
  outline: '#8e9379'
  outline-variant: '#444933'
  surface-tint: '#abd600'
  primary: '#ffffff'
  on-primary: '#283500'
  primary-container: '#c3f400'
  on-primary-container: '#556d00'
  inverse-primary: '#506600'
  secondary: '#c8c6c5'
  on-secondary: '#313030'
  secondary-container: '#474746'
  on-secondary-container: '#b7b5b4'
  tertiary: '#ffffff'
  on-tertiary: '#21323e'
  tertiary-container: '#d2e5f5'
  on-tertiary-container: '#556774'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#c3f400'
  primary-fixed-dim: '#abd600'
  on-primary-fixed: '#161e00'
  on-primary-fixed-variant: '#3c4d00'
  secondary-fixed: '#e5e2e1'
  secondary-fixed-dim: '#c8c6c5'
  on-secondary-fixed: '#1c1b1b'
  on-secondary-fixed-variant: '#474746'
  tertiary-fixed: '#d2e5f5'
  tertiary-fixed-dim: '#b6c9d8'
  on-tertiary-fixed: '#0b1d29'
  on-tertiary-fixed-variant: '#374956'
  background: '#111508'
  on-background: '#e2e4cf'
  surface-variant: '#333627'
typography:
  display-stat:
    fontFamily: Inter
    fontSize: 64px
    fontWeight: '800'
    lineHeight: 72px
    letterSpacing: -0.04em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
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
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.1em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  container-padding: 20px
  stack-gap: 16px
  grid-gutter: 12px
  safe-area-bottom: 84px
---

## Brand & Style
The design system is engineered for high-performance habit tracking, targeting individuals committed to extreme discipline. The brand personality is intense, uncompromising, and athletic, designed to evoke a sense of urgency and elite accomplishment. 

The visual style utilizes a **High-Contrast Dark** foundation with **Glassmorphic** accents. By leveraging a pitch-black background, the UI minimizes distractions and maximizes the vibrance of the Electric Lime accent, creating a "heads-up display" (HUD) feel. The aesthetic balances the raw energy of fitness culture with the precision of premium software, utilizing heavy whitespace to ensure that even data-dense tracking views feel organized and achievable.

## Colors
The palette is dominated by absolute black to ensure infinite contrast on OLED screens, reducing eye strain during early morning or late-night check-ins. 

- **Electric Lime (#CCFF00):** Reserved exclusively for active states, completion, and primary calls to action. It represents "Go" and "Success."
- **Surfaces:** Dark gray variants (Charcoal) are used to define card boundaries and interactive zones against the black background.
- **Semantic Colors:** Used sparingly for status indicators. Success green is distinct from the brand Lime to ensure clear differentiation between "Branded Action" and "System Validation."

## Typography
The system relies on **Inter** for its technical precision and readability at small sizes. 

- **Display Stats:** Large, heavy-weight numerals are used for streak counts and day numbers to emphasize progress. 
- **Hierarchy:** Use `label-caps` for section headers (e.g., "DAILY TASKS") to provide a structured, "data-center" aesthetic.
- **Scaling:** Headlines shift significantly between mobile and desktop to maintain a compact functional view on PWA mobile installs.

## Layout & Spacing
This design system follows a **Fluid Mobile-First** layout. On mobile, content is contained within a single column with consistent 20px horizontal margins. On desktop, the layout expands to a multi-column dashboard.

- **Stacking:** Elements use a consistent 16px gap to maintain a breathable, premium feel.
- **PWA Considerations:** A large `safe-area-bottom` is reserved for the fixed bottom navigation bar to ensure reachability on large-format mobile devices.
- **Grids:** Use a 4-column grid for mobile and a 12-column grid for desktop views.

## Elevation & Depth
Depth is created through **Tonal Layering** and **Glassmorphism**, rather than traditional shadows.

- **Level 0:** Pitch Black (#000000) - Main app background.
- **Level 1:** Deep Gray (#1A1A1A) - Standard card surfaces and input containers.
- **Level 2:** Charcoal (#2C2C2C) - Hover states or elevated modal elements.
- **Glassmorphism:** Use a `backdrop-filter: blur(12px)` with a semi-transparent white border (0.1 opacity) for navigation bars and overlays. This allows the vibrant content to peak through the UI layers.

## Shapes
The shape language is modern and approachable. 
- **Base Radius:** 16px (`rounded-lg`) is the standard for all cards and primary containers.
- **Interactive Elements:** Buttons and input fields use an 8px radius to feel slightly more precise than the structural cards.
- **Data Visuals:** Progress bars and XP tracks use fully rounded (pill) ends to indicate fluid movement.

## Components

### Checklist Cards
Cards use the `#1A1A1A` surface. When a task is checked, the border transitions from a subtle gray to the `primary_color_hex` (Electric Lime). Checkboxes are custom 24px squares with 6px rounded corners.

### Progress Rings & XP Bars
Progress rings use a heavy stroke (8px+). The "track" is `#2C2C2C` and the "indicator" is the Electric Lime. For XP bars, use a subtle glow effect (`box-shadow: 0 0 10px #CCFF0044`) to make them feel energized.

### Heatmaps
GitHub-style contribution maps use a 5-step scale:
- Empty: `#1A1A1A`
- Low: `#334400`
- Medium: `#668800`
- High: `#99BB00`
- Max: `#CCFF00`

### KPI Cards
KPIs should feature the `display-stat` typography. Secondary information (e.g., "% increase") should be placed at the bottom right of the card in `label-caps`.

### Level/Rank Badges
Badges are small, circular or shield-shaped components. Use high-contrast metallic gradients (Silver/Gold/Platinum) against the black background to denote prestige, accented with the brand Lime for the current active level.