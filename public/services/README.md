# Service Face Thumbnails & Artwork Specifications

All service face textures in the Nikneuron 3D Energy Cube are dynamically loaded and rendered as full-bleed 1024x1024 textures on the outer glass shell.

## Artwork Requirements

1. **Aspect Ratio & Resolution**:
   - **Aspect Ratio**: 1:1 (Square).
   - **Resolution**: 1024x1024px (WebP, SVG, or PNG).
   - Even if non-square or external images are provided, the engine's `drawCover(ctx, img, w, h)` utility automatically applies uniform center-crop scaling to guarantee zero letterboxing and zero empty bands.

2. **Color Profile & Background**:
   - **Background Tone**: Deep dark space / void background (`#010206` to `#0a2a5e`).
   - **Blending Compatibility**: Face materials use `THREE.AdditiveBlending` (with a switchable fallback to `THREE.NormalBlending`). With additive blending, black/dark pixels (`rgb(0,0,0)`) render as completely translucent windows into the cube, allowing the swirling inner plasma core and wireframe lattice to glow brightly through the glass.
   - Bright artwork lines (neon cyan `#4fd8ff`, hot pink `#ff5aa5`, gold, etc.) remain vivid and crisp.

3. **Safe Composition & Aperture**:
   - **Upper Holographic Window (y: 120 – 600)**: Place primary hero iconography, 3D meshes, biometric rings, or focal illustrations centered around `cx: 512, cy: 420`.
   - **Vignette Mask**: The engine applies a radial alpha mask with center alpha ~0.38 and edge alpha ~0.70.
   - **Bottom Text Scrim (y: 620 – 1024)**: The procedural canvas overlays a smooth dark-to-transparent scrim over this region where the service title, tagline, and callout action pill are dynamically typeset. Avoid placing static bottom text pills in the raw artwork to prevent visual clashes.
