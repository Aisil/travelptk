---
name: Karelia Nordic Travel
colors:
  surface: '#12131a'
  surface-dim: '#12131a'
  surface-bright: '#383941'
  surface-container-lowest: '#0d0e15'
  surface-container-low: '#1a1b22'
  surface-container: '#1e1f26'
  surface-container-high: '#292931'
  surface-container-highest: '#33343c'
  on-surface: '#e3e1ec'
  on-surface-variant: '#b9caca'
  inverse-surface: '#e3e1ec'
  inverse-on-surface: '#2f3038'
  outline: '#849495'
  outline-variant: '#3a494a'
  surface-tint: '#00dce5'
  primary: '#e9feff'
  on-primary: '#003739'
  primary-container: '#00f5ff'
  on-primary-container: '#006c71'
  inverse-primary: '#00696e'
  secondary: '#c6c6c7'
  on-secondary: '#2f3131'
  secondary-container: '#454747'
  on-secondary-container: '#b4b5b5'
  tertiary: '#fcf8fd'
  on-tertiary: '#303033'
  tertiary-container: '#dfdce0'
  on-tertiary-container: '#616064'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#63f7ff'
  primary-fixed-dim: '#00dce5'
  on-primary-fixed: '#002021'
  on-primary-fixed-variant: '#004f53'
  secondary-fixed: '#e2e2e2'
  secondary-fixed-dim: '#c6c6c7'
  on-secondary-fixed: '#1a1c1c'
  on-secondary-fixed-variant: '#454747'
  tertiary-fixed: '#e4e1e6'
  tertiary-fixed-dim: '#c8c5ca'
  on-tertiary-fixed: '#1b1b1e'
  on-tertiary-fixed-variant: '#47464a'
  background: '#12131a'
  on-background: '#e3e1ec'
  surface-variant: '#33343c'
typography:
  display-xl:
    fontFamily: Space Grotesk
    fontSize: 80px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.04em
  headline-lg:
    fontFamily: Space Grotesk
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Space Grotesk
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Space Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.4'
    letterSpacing: 0.05em
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: '0'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: '0'
  label-caps:
    fontFamily: Space Grotesk
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1.0'
    letterSpacing: 0.15em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  container-max: 1280px
  gutter: 24px
  section-padding-y: 120px
  element-gap: 32px
  stack-sm: 8px
  stack-md: 16px
---

## Brand & Style

This design system embodies the stark, majestic contrast of the North. It is built on a foundation of **Premium Minimalism** and **High-Contrast Boldness**, drawing a direct parallel between the dark, volcanic depths of the earth and the ethereal glow of the aurora borealis. 

The aesthetic is characterized by extreme polarities: deep, ink-like dark sections juxtaposed against pristine, expansive white canvases. This creates a rhythmic "breathing" effect as the user scrolls through the directory. The mood is sophisticated, quiet, and exclusive, aimed at high-end travelers who value clarity, precision, and immersive natural beauty. 

Key visual drivers include:
- **Cinematic Scale:** Large-format typography and edge-to-edge imagery.
- **Glassmorphic Precision:** Overlays that suggest ice and clarity.
- **Geometric Rigidity:** A disciplined grid that reflects modern Nordic architecture.

## Colors

The palette is intentionally limited to amplify the high-contrast narrative. 

- **The Deep (Zinc-900/950):** Used for primary landing sections, footers, and immersive backgrounds to create a sense of vastness and luxury.
- **The Arctic (White):** Used for content-heavy directory sections to ensure maximum legibility and a sense of cleanliness.
- **The Aurora (Teal/Cyan):** A vibrant, high-energy accent. It must be used sparingly for interactive elements, progress indicators, and critical calls to action to maintain its impact.
- **Status & Utility:** Grays are pulled from the Zinc scale to maintain a neutral, cool temperature across all UI states.

## Typography

This design system utilizes a dual-font strategy to balance character with utility.

- **Primary Headings:** `Space Grotesk` is used for all display and headline levels. It must be set in **bold uppercase** for primary sections to mimic high-end editorial layouts. Tight letter-spacing on large headers adds a sense of "premium tension."
- **Body & Data:** `Inter` provides a neutral, highly legible contrast to the geometric headings. It handles all descriptive text, directory listings, and technical details.
- **Accents:** Use the `label-caps` style for small metadata (e.g., "7 DAYS", "FROM $1,200") to maintain the geometric architectural feel even at small scales.

## Layout & Spacing

The layout follows a **Fixed Grid** model for desktop to maintain the "editorial directory" feel, transitioning to a fluid single-column for mobile.

- **Rhythm:** A strict 12-column grid is used. White space is treated as a premium asset; vertical padding between major sections is generous (`120px+`) to allow the high-contrast transitions to feel intentional.
- **Alignment:** Content is generally left-aligned to mirror the structured nature of Nordic design.
- **Desktop:** 12 columns, 24px gutters, 80px side margins.
- **Mobile:** 4 columns, 16px gutters, 20px side margins. Primary headers should downscale but maintain their uppercase, bold impact.

## Elevation & Depth

Depth is conveyed through material properties rather than traditional shadows in dark mode, while light mode utilizes soft, diffused shadows.

- **Dark Mode Depth:** Uses "Tonal Layers." The base background is Zinc-950. Cards or elevated surfaces use Zinc-900 or a 5% white overlay. 
- **Light Mode Depth:** Uses "Ambient Shadows." Shadows on white backgrounds are extra-diffused (32px+ blur) with very low opacity (5-8%) to avoid looking "dirty."
- **Glassmorphism:** Navigation bars and modal overlays utilize a `backdrop-blur-xl` with a 10% white or black tint (depending on mode). This simulates the appearance of frosted ice.
- **Interactive Depth:** Buttons do not use shadows but instead use color shifts or subtle scale transforms (98%) to indicate a press.

## Shapes

The shape language is a blend of hard architectural lines and "Soft-Tech" corners.

- **Cards & Containers:** Use `rounded-2xl` (1.5rem / 24px). This softens the high-contrast impact and makes the premium photography within them feel more approachable.
- **Buttons & Inputs:** Use a slightly reduced `rounded-lg` (1rem / 16px) to maintain a distinct hierarchy between the container and the action.
- **Icons:** Should be linear, 2px stroke width, with slightly rounded terminal ends to match the UI's radius.

## Components

- **Primary Button:** Solid Teal background with black text. No border. High-contrast hover state (slight brighten).
- **Secondary Button:** Ghost style with a White or Zinc-200 border (2px) and uppercase label.
- **Directory Cards:** `rounded-2xl` corners. In light mode, a 1px Zinc-100 border and soft shadow. In dark mode, no border, just a Zinc-900 fill. Images within cards should have a subtle zoom effect on hover.
- **Glass Navigation:** Fixed top bar with `backdrop-blur-md`. Links are uppercase `label-caps` with a Teal underline on active/hover.
- **Chips/Badges:** Small, pill-shaped tags for "Nature," "Adventure," or "Luxury." These use a semi-transparent version of the Teal accent (10% opacity) with solid Teal text.
- **Input Fields:** Large, 1px border-bottom only for a minimalist "form" look, or fully enclosed `rounded-lg` containers for search filters.