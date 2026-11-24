export type QualityPreset = 'low' | 'medium' | 'high';

export interface CubeThemeConfig {
  // --- Opacity & Core Visibility Tunables ---
  CORE_INTENSITY: number; // Plasma shader intensity multiplier (default: 0.85, clamped to prevent blowout)
  CORE_ALPHA: number; // Plasma shader alpha base (default: 0.55)
  CORE_RADIUS: number; // Radius of icosahedron plasma core sphere (default: 0.85)
  CORE_PULSE: number; // Core scale pulse amplitude (+/- 0.04)

  // --- Inner Energy Mechanism Tunables (Living Mechanism inside glass shell) ---
  INNER_PLASMA_SIZE: number; // Size of rounded plasma cube (~1.05-1.3, default: 1.10)
  INNER_WIRE_SIZE: number; // Size of counter-rotating wireframe cube (~1.30-1.45, default: 1.35)
  ROT_SPEED_PLASMA: number; // Plasma cube rotation speed (rad/s, default: 0.35)
  ROT_SPEED_WIRE: number; // Wireframe cube rotation speed (rad/s, default: 0.25)
  PULSE_AMOUNT: number; // Eased scale breathing pulse amplitude (+/- 0.03)
  PLASMA_INTENSITY: number; // Plasma shader intensity ceiling (default: 0.85)
  PLASMA_ALPHA: number; // Base transparency alpha (default: 0.50)
  SPARK_COUNT: number; // Number of sparks orbiting the nucleus (default: 4)
  HOVER_SPEEDUP: number; // Inner rotation acceleration multiplier on face hover (default: 1.4)

  FACE_OPACITY: number; // Face material opacity at rest (~0.60)
  ART_ALPHA_CENTER: number; // Artwork alpha at center of face vignette (~0.30 so core shines through)
  ART_ALPHA_EDGE: number; // Artwork alpha at edges (~0.70 so face reads as solid glass pane)
  HOVER_ALPHA_BOOST: number; // Boost added to artwork alpha on hover (+0.15)

  GLOW: number; // Canvas shadow and glow multiplier
  GLOW_OPACITY: number; // Soft outer glow sprite opacity (default: 0.25)
  LATTICE_OPACITY: number; // Inner pink wireframe lattice opacity (default: 0.35)
  BLOOM_ON: boolean; // Flag to enable/disable post-processing bloom (default: false)
  QUALITY: QualityPreset; // Quality preset: 'low' | 'medium' | 'high'

  // --- Face Selection & Focus Tunables ---
  SELECTED_OPACITY: number; // Opacity of active/selected face (default: 0.90)
  DIM_FACTOR: number; // Dim unselected faces to ~60% of base (0.60 * 0.60 = 0.36)

  // --- Fixed 1024x1024 Layout Grid Constants ---
  CANVAS_SIZE: number; // 1024px canonical canvas dimension
  SAFE_MARGIN: number; // 56px safe margin on all sides
  FRAME_INSET: number; // 20px thin neon frame inset
  FRAME_WIDTH: number; // 4px frame border
  TICK_LENGTH: number; // 16px corner tick marks

  TOP_BAR_Y_MIN: number; // 56
  TOP_BAR_Y_MAX: number; // 112
  TOP_BAR_Y: number; // 84 (midpoint baseline)

  SCRIM_Y_START: number; // 620 (start of bottom dark gradient scrim)
  SCRIM_Y_END: number; // 1024 (end of bottom scrim)

  TITLE_Y: number; // 800 (center Y for uppercase service title)
  TITLE_MAX_FONT_SIZE: number; // 50px starting size
  TITLE_MIN_FONT_SIZE: number; // 22px minimum shrink-to-fit size

  TAGLINE_Y: number; // 860 (center Y for single-line tagline)
  TAGLINE_FONT_SIZE: number; // 22px

  PILL_Y: number; // 930 (center Y for action pill)
  PILL_WIDTH: number; // 380px fixed width
  PILL_HEIGHT: number; // 60px fixed height
  PILL_RADIUS: number; // 30px pill corner radius
  PILL_BORDER_WIDTH: number; // 2.5px pill border width
  PILL_FONT_SIZE: number; // 22px bold font
}

/**
 * Global configuration containing all visual tunables, quality settings,
 * and pixel-perfect layout constants for the Nikneuron 3D Energy Cube.
 */
export const CUBE_THEME_CONFIG: CubeThemeConfig = {
  // Core plasma tunables (guarantees zero color overflow or white blowout)
  CORE_INTENSITY: 0.85,
  CORE_ALPHA: 0.55,
  CORE_RADIUS: 0.85,
  CORE_PULSE: 0.04,

  // Inner Energy Mechanism defaults (never clips glass shell, 0.95 max half-size)
  INNER_PLASMA_SIZE: 1.10,
  INNER_WIRE_SIZE: 1.35,
  ROT_SPEED_PLASMA: 0.35,
  ROT_SPEED_WIRE: 0.25,
  PULSE_AMOUNT: 0.03,
  PLASMA_INTENSITY: 0.85,
  PLASMA_ALPHA: 0.50,
  SPARK_COUNT: 4,
  HOVER_SPEEDUP: 1.4,

  // Face glass transparency & per-face alpha vignette
  FACE_OPACITY: 0.60,
  ART_ALPHA_CENTER: 0.30,
  ART_ALPHA_EDGE: 0.70,
  HOVER_ALPHA_BOOST: 0.15,

  // Soft atmospheric glow and wireframe lattice
  GLOW: 1.25,
  GLOW_OPACITY: 0.25,
  LATTICE_OPACITY: 0.35,
  BLOOM_ON: false,
  QUALITY: 'medium',

  // Face selection hierarchy
  SELECTED_OPACITY: 0.90,
  DIM_FACTOR: 0.60, // Unselected faces dim to 60% of base opacity (0.60 * 0.60 = 0.36)

  // Canonical 1024x1024 Canvas Grid Dimensions
  CANVAS_SIZE: 1024,
  SAFE_MARGIN: 56,
  FRAME_INSET: 20,
  FRAME_WIDTH: 4,
  TICK_LENGTH: 16,

  // Top Bar (y: 56-112, midpoint: 84)
  TOP_BAR_Y_MIN: 56,
  TOP_BAR_Y_MAX: 112,
  TOP_BAR_Y: 84,

  // Bottom Text Scrim (y: 620-1024)
  SCRIM_Y_START: 620,
  SCRIM_Y_END: 1024,

  // Service Title (Centered, y: 800)
  TITLE_Y: 800,
  TITLE_MAX_FONT_SIZE: 50,
  TITLE_MIN_FONT_SIZE: 22,

  // Service Tagline (Centered, y: 860)
  TAGLINE_Y: 860,
  TAGLINE_FONT_SIZE: 22,

  // Callout Action Pill (Centered, y: 930)
  PILL_Y: 930,
  PILL_WIDTH: 380,
  PILL_HEIGHT: 60,
  PILL_RADIUS: 30,
  PILL_BORDER_WIDTH: 2.5,
  PILL_FONT_SIZE: 22,
};
