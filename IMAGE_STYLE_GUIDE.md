# Visual Style Guide — The Digital Alchemy
*Unified Visual Direction & Generation Standard for thedigitalalchemy.co.in*

---

## 1. Brand Essence & Visual Identity

The Digital Alchemy is a premier software engineering and digital services agency based in Delhi, India. The brand combines deep technical rigor with modern aesthetic elegance.

### Color Foundation
- **Canvas / Surfaces:** Warm off-white paper canvas (`#f7f7f5` / `rgb(247, 247, 245)`), layered onto subtle dark surface cards (`#141417` / `#1c1c21`).
- **Chrome / Navigation:** Deep charcoal glass navbar (`#0f0f12` with 85% opacity, `backdrop-filter: blur(16px)`).
- **Ink / Typography:** Deep rich charcoal ink (`#0f0f12`), muted secondary ink (`#575762`).
- **Brand Accents:**
  - **Primary Core:** Electric Indigo (`#5856d6`) and Vibrant Azure Blue (`#0071e3`) with subtle Violet (`#5e5ce6`) undertones (matching the Bhadawar AI chat pill and core gradient).
  - **Secondary Accents:** Warm Tangerine / Copper (`#ff8a3d`), Mint / Verdigris (`#00c7be`), Coral (`#ff5a36`), Gold (`#ffd166`), and Pink (`#ff2d55`).

---

## 2. Style Rules for All Generated Imagery

Every image across the site—heroes, feature bands, and cards—must look like it was commissioned for a single, unified brand photoshoot or 3D art direction series.

### 2.1 Aesthetic & Rendering
- **Look & Feel:** High-end architectural studio photography or hyper-detailed, clean 3D industrial render (Octane / Cinema 4D aesthetic).
- **Lighting:** Soft cinematic directional studio lighting, gentle rim lighting with subtle indigo/blue and warm ambient fills. Deep, natural drop shadows—never harsh or blown out.
- **Depth of Field:** Shallow depth of field with creamy optical bokeh in the backdrop, drawing focus to crisp foreground devices, monitors, or workspaces.
- **Materials & Textures:** Matte space-grey anodized aluminum, dark smoked glass, fine walnut or dark slate studio surfaces, subtle optical glass reflections.

### 2.2 Color Grading & Mood
- Predominantly neutral greys, deep charcoal, and warm off-white surfaces.
- Subtle indigo/violet, cobalt blue, and cyan/teal accent rim lighting that harmonizes with the site's CSS variable token system.
- Avoid neon cyberpunk cliches, avoid hyper-saturated rainbow glows, and avoid flat stock photography.

### 2.3 Strict Composition & Negative Space Rules
- **Hero Banners:** Must have intentional negative space or clean ambient background on one side (or along the top/bottom) so hero copy and typography remain legible if overlaid.
- **Focal Point:** Centered or rule-of-thirds composition tailored to the container aspect ratio (16:9 for heroes, 4:3 or 16:10 for cards).

### 2.4 Strict Negative Constraints (Zero Exceptions)
- ❌ **NO readable text, words, letters, or numbers:** Screens and monitors must display abstract, elegant UI blocks, line charts, node graphs, or stylized syntax-colored code blocks. No gibberish or AI-hallucinated pseudo-English.
- ❌ **NO recognizable trademarks or brand logos:** No Apple logos, Windows logos, Google logos, or commercial trademarks on device chassis or interfaces.
- ❌ **NO recognizable human faces or portraits:** Any human presence must be silhouettes, blurred over-the-shoulder perspectives, or hands interacting with clean hardware/stylus.
- ❌ **NO random industrial hardware for digital services:** No bare metal billets, raw fiber patch cords, optical sensor circuit boards, or microwave waveguides representing software development. Server racks and cabling belong ONLY on Cloud/DevOps infrastructure pages.
- ❌ **NO watermarks, artifacts, or compression grain.**

---

## 3. Screen & Device Representation Standard

When software, websites, or apps are shown on monitors, laptops, tablets, or phones:
- **Devices:** Sleek, bezel-less modern hardware (minimalist matte aluminum unibody laptops, edge-to-edge smartphones, ultra-thin studio displays).
- **Interface Content:** Clean, professional vector-style user interfaces:
  - Responsive website layouts with navigation bars, hero sections, and card grids.
  - Analytics dashboards with clean sparklines, bar graphs, and metric pills.
  - Development tools with sleek dark IDE syntax highlighting (blue, purple, mint, orange accents).
  - Workflow node graphs with connecting glowing lines and nodes.

---

## 4. Reusable Prompt Formula

Every generation prompt follows this standardized structure:

```text
[Subject & Setting] + [Device & Abstract UI Details] + [Lighting & Color Grading] + [Composition & Depth] + [Strict Exclusions & Brand Style Token]
```

### Base Prompt Template:
> **Cinematic, ultra-high-resolution studio photography of [specific setting / workspace]. A sleek minimalist workspace with [devices / displays] displaying [abstract, beautiful UI / code / workflow without readable words]. Subtle indigo, violet, and deep blue accent rim lighting glowing against dark charcoal and matte anodized metal finishes. Soft directional studio illumination, natural soft shadows, shallow depth of field with smooth background bokeh. Clean minimalist architectural composition with balanced negative space. Photorealistic, 8k, modern Scandinavian and tech design agency aesthetic. Completely clean screens with no legible text, no letters, no logos, no watermarks, no distorted hands, no faces.**

---

## 5. Technical Delivery Specifications

- **File Format:** Modern WebP format with sharp compression.
- **Hero Image Dimensions:** `2400 × 1350` (16:9 ratio), max target size `< 250 KB`.
- **Card / Visual Dimensions:** `1600 × 1000` or `1200 × 900` (16:10 / 4:3 ratio), max target size `< 120 KB`.
- **Responsive Delivery:** Next.js `<Image>` component with `sizes="100vw"` on bleed heroes and explicit aspect ratios to prevent Cumulative Layout Shift (CLS).
- **Loading Strategy:** `priority` and eager loading for above-the-fold heroes; `loading="lazy"` with generated base64 blur placeholders for below-the-fold section imagery.
- **Accessibility:** Contextual, descriptive `alt` text on informative images; empty `alt=""` on decorative hero bleeds accompanied by `aria-hidden="true"` where appropriate.
