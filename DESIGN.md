# Design System: VibeSpace Studio

## 1. Visual Theme & Atmosphere
A dark, immersive focus environment based on **Modern Dark Glassmorphism**. The dashboard uses layered transparent surfaces overlaying dynamic, organic nature backgrounds (such as slow-moving waves or swaying pine branches). High-end frosted panels with a custom blur factor (`blur(16px)`), extremely thin glowing card borders, and responsive, asymmetric layout blocks. The workspace is cozy, warm, and highly focused — avoiding the clinical corporate feel and the generic AI purple-neon aesthetic.

## 2. Color Palette & Roles
- **Deep Space Indigo Canvas** (#0b0813) — Default background backing when images/videos are adjusting or dimming.
- **Frosted Glass Panel** (rgba(16, 12, 28, 0.45)) — Card backgrounds, slide-out panels, and modal containers.
- **Glass Glow Border** (rgba(140, 82, 255, 0.15)) — High-end border borders for frosted containers, producing a subtle edge reflection.
- **Frost White** (#ffffff) — Primary typography, headers, main icons.
- **Lavender Slate** (#a29ebc) — Secondary text, slider labels, deactivated states, metadata.
- **Sunrise Tangerine** (#ff7b6b) — Focus state highlights, active Pomodoro ticking progress, selected background border, and active checkbox rings. (Maximum 1 accent, cozy warm tone instead of neon-purple).

## 3. Typography Rules
- **Display & Headings:** `Satoshi` — Track-tight (-0.02em), medium/bold weight. Kept small to medium scale for a professional look.
- **Body Text:** `Satoshi` — Line-height 1.6, max width of 65 characters per paragraph, Lavender Slate color.
- **Mono / Numbers:** `JetBrains Mono` — Applied to the Pomodoro timer digits, countdown clocks, task count badges, and system settings metrics.
- **Banned:** `Inter` is banned. Generic system fonts are banned. Serif fonts are banned in this dashboard interface.

## 4. Component Stylings
* **Buttons:** Flat borders with a solid frosted fill. Tactile click feedback (-1px Y-axis offset on active click). Sunrise Tangerine fill for primary CTAs, clear borders for secondary ones.
* **Cards & Panels:** Frosted Glass Panel fill. Rounded corners with a radius of `1.5rem` (`24px`). Diffused border glow using Glass Glow Border.
* **Inputs & Checkboxes:** Text input fields feature a frosted background, an inset shadow, and a Sunrise Tangerine border outline on focus. Checkboxes use custom smooth transition ticks.
* **Pomodoro Clock Face:** Central circular progress indicator. Large digital time in `JetBrains Mono` with a subtle Sunrise Tangerine shadow glow when running.
* **Sliders (Volume Mixers):** Thin tracks (`4px` height) in Lavender Slate with a round, flat thumb in Sunrise Tangerine.

## 5. Layout Principles
- No overlapping panels — all grids are separated by clean negative spacing (`24px` gutter).
- The central column is dedicated entirely to the Pomodoro Timer, leaving sidebars for Todo lists and Audio controllers.
- Grid-first container architecture using dynamic flex spacing. Max-width container constrained at `1440px` for ultra-wide monitors.
- Full-height backdrop layouts must use `min-height: 100dvh` to ensure stability on mobile viewports.

## 6. Motion & Interaction
- Spring physics for transitions (stiffness: 100, damping: 20) for panels opening, closing, and hover states.
- Hovering over cards causes a slight hover scale (`scale(1.02)`) and increases the border glow intensity.
- Fade-in staggered transition for dashboard cards when mounting (cascade waterfall entrance).
- Hardware-accelerated animations using `transform` and `opacity` exclusively.

## 7. Anti-Patterns (Banned)
- No emojis anywhere in the interface.
- No `Inter` font.
- No pure black (`#000000`) for surfaces or cards.
- No oversaturated accents or neon-glow drop-shadows.
- No generic AI copywriting phrases ("Elevate your focus", "Seamless workspace").
- No generic placeholder names or statistics (do not invent data, use placeholder brackets like `[task count]` if empty).
- No broken image links.
