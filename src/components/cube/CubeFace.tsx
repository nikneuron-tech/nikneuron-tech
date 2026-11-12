import * as THREE from 'three';
import { ServiceConfig } from '../../config/services.config';
import { CUBE_THEME_CONFIG } from '../../config/cubeTheme.config';

// Texture & image memory caches to prevent GPU memory leaks
const textureCache = new Map<string, THREE.CanvasTexture>();
const imageCache = new Map<string, HTMLImageElement>();

/**
 * Checks if layout debug mode is requested via URL query string (?debug=layout)
 */
function isDebugLayoutActive(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const params = new URLSearchParams(window.location.search);
    return params.get('debug') === 'layout' || window.location.search.includes('debug=layout');
  } catch {
    return false;
  }
}

/**
 * Reusable full-cover image drawer.
 * Scales uniformly to fill the entire w x h canvas, centered and cropped.
 * Guarantees zero letterboxing and zero empty bands regardless of aspect ratio.
 */
export function drawCover(
  ctx: CanvasRenderingContext2D,
  img: CanvasImageSource,
  w: number,
  h: number
): void {
  let imgW = 0;
  let imgH = 0;

  if (img instanceof HTMLImageElement) {
    imgW = img.naturalWidth || img.width;
    imgH = img.naturalHeight || img.height;
  } else if (img instanceof HTMLVideoElement) {
    imgW = img.videoWidth || img.width;
    imgH = img.videoHeight || img.height;
  } else if (img instanceof HTMLCanvasElement || (typeof OffscreenCanvas !== 'undefined' && img instanceof OffscreenCanvas)) {
    imgW = img.width;
    imgH = img.height;
  } else if (typeof ImageBitmap !== 'undefined' && img instanceof ImageBitmap) {
    imgW = img.width;
    imgH = img.height;
  } else {
    imgW = (img as any).width || 0;
    imgH = (img as any).height || 0;
  }

  // Fallback if dimensions cannot be determined
  if (!imgW || !imgH) {
    imgW = w;
    imgH = h;
  }

  // Scale uniformly to completely cover destination bounds
  const scale = Math.max(w / imgW, h / imgH);
  const renderW = imgW * scale;
  const renderH = imgH * scale;

  // Center-crop offsets
  const dx = (w - renderW) / 2;
  const dy = (h - renderH) / 2;

  ctx.save();
  ctx.beginPath();
  ctx.rect(0, 0, w, h);
  ctx.clip();
  ctx.drawImage(img, dx, dy, renderW, renderH);
  ctx.restore();
}

/**
 * Measures text and calculates the largest font size (between min and max)
 * so that the text fits within maxWidth without wrapping or overflowing.
 */
function fitText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  maxFontSize: number,
  minFontSize: number,
  fontFamily: string,
  fontWeight: string = 'bold'
): number {
  let size = maxFontSize;
  ctx.font = `${fontWeight} ${size}px ${fontFamily}`;
  let width = ctx.measureText(text).width;
  while (width > maxWidth && size > minFontSize) {
    size -= 1;
    ctx.font = `${fontWeight} ${size}px ${fontFamily}`;
    width = ctx.measureText(text).width;
  }
  return size;
}

/**
 * Truncates text with an ellipsis if it exceeds maxWidth.
 */
function truncateText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string {
  if (ctx.measureText(text).width <= maxWidth) return text;
  let truncated = text;
  while (truncated.length > 0 && ctx.measureText(truncated + '...').width > maxWidth) {
    truncated = truncated.slice(0, -1);
  }
  return truncated.trim() + '...';
}

/**
 * Draws procedural cyber placeholder graphics if an artwork image is missing or loading.
 * Ensures the entire face is filled with high-tech graphics.
 */
function drawProceduralFallback(
  ctx: CanvasRenderingContext2D,
  service: ServiceConfig,
  w: number,
  h: number,
  isHovered: boolean
): void {
  const cx = Math.round(w / 2);
  const cy = Math.round(h * 0.40); // Centered in upper viewing aperture

  ctx.save();
  ctx.strokeStyle = service.accentColor;
  ctx.lineWidth = 2;
  ctx.globalAlpha = isHovered ? 0.75 : 0.45;

  // Concentric cyber reticles
  ctx.beginPath();
  ctx.arc(cx, cy, 180, 0, Math.PI * 2);
  ctx.stroke();

  ctx.beginPath();
  ctx.setLineDash([12, 10]);
  ctx.arc(cx, cy, 135, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.beginPath();
  ctx.arc(cx, cy, 85, 0, Math.PI * 2);
  ctx.stroke();

  // Central glowing core emblem
  ctx.fillStyle = isHovered ? '#ff5aa5' : service.accentColor;
  ctx.globalAlpha = isHovered ? 0.85 : 0.55;
  ctx.beginPath();
  ctx.arc(cx, cy, 22, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

/**
 * Draws the debug overlay when ?debug=layout is in the URL.
 * Displays safe margins, center crosshairs, and labeled baselines aligned to 1px.
 */
function drawDebugLayout(
  ctx: CanvasRenderingContext2D,
  cfg: typeof CUBE_THEME_CONFIG
): void {
  ctx.save();
  ctx.shadowBlur = 0;

  // 1. Safe Margin Box (Dashed yellow)
  ctx.strokeStyle = '#ffff00';
  ctx.lineWidth = 2;
  ctx.setLineDash([8, 6]);
  ctx.strokeRect(
    cfg.SAFE_MARGIN,
    cfg.SAFE_MARGIN,
    cfg.CANVAS_SIZE - 2 * cfg.SAFE_MARGIN,
    cfg.CANVAS_SIZE - 2 * cfg.SAFE_MARGIN
  );

  // 2. Center Crosshairs (Dashed cyan)
  ctx.strokeStyle = '#4fd8ff';
  ctx.beginPath();
  ctx.moveTo(cfg.CANVAS_SIZE / 2, 0);
  ctx.lineTo(cfg.CANVAS_SIZE / 2, cfg.CANVAS_SIZE);
  ctx.moveTo(0, cfg.CANVAS_SIZE / 2);
  ctx.lineTo(cfg.CANVAS_SIZE, cfg.CANVAS_SIZE / 2);
  ctx.stroke();

  // 3. Horizontal Baselines & Guides
  ctx.strokeStyle = 'rgba(255, 90, 165, 0.9)';
  ctx.setLineDash([4, 4]);
  const guides = [
    { y: cfg.TOP_BAR_Y_MIN, label: `TOP_BAR_MIN y:${cfg.TOP_BAR_Y_MIN}` },
    { y: cfg.TOP_BAR_Y, label: `TOP_BAR_BASELINE y:${cfg.TOP_BAR_Y}` },
    { y: cfg.TOP_BAR_Y_MAX, label: `TOP_BAR_MAX y:${cfg.TOP_BAR_Y_MAX}` },
    { y: cfg.SCRIM_Y_START, label: `SCRIM_START y:${cfg.SCRIM_Y_START}` },
    { y: cfg.TITLE_Y, label: `TITLE_BASELINE y:${cfg.TITLE_Y}` },
    { y: cfg.TAGLINE_Y, label: `TAGLINE_BASELINE y:${cfg.TAGLINE_Y}` },
    { y: Math.round(cfg.PILL_Y - cfg.PILL_HEIGHT / 2), label: `PILL_TOP y:${Math.round(cfg.PILL_Y - cfg.PILL_HEIGHT / 2)}` },
    { y: cfg.PILL_Y, label: `PILL_BASELINE y:${cfg.PILL_Y}` },
    { y: Math.round(cfg.PILL_Y + cfg.PILL_HEIGHT / 2), label: `PILL_BOTTOM y:${Math.round(cfg.PILL_Y + cfg.PILL_HEIGHT / 2)}` },
    { y: cfg.CANVAS_SIZE - cfg.SAFE_MARGIN, label: `SAFE_MARGIN_BOTTOM y:${cfg.CANVAS_SIZE - cfg.SAFE_MARGIN}` },
  ];

  ctx.font = '13px monospace';
  ctx.fillStyle = '#ffff00';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'bottom';

  guides.forEach((g) => {
    ctx.beginPath();
    ctx.moveTo(cfg.SAFE_MARGIN, g.y);
    ctx.lineTo(cfg.CANVAS_SIZE - cfg.SAFE_MARGIN, g.y);
    ctx.stroke();
    ctx.fillText(g.label, cfg.SAFE_MARGIN + 8, g.y - 3);
  });

  // Top Debug Header Banner
  ctx.fillStyle = '#ffff00';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.font = 'bold 15px monospace';
  ctx.fillText('[ DEBUG: LAYOUT GRID 1024x1024 — ALIGNED TO 1PX ]', cfg.CANVAS_SIZE / 2, 24);

  ctx.restore();
}

/**
 * Creates or retrieves a 1024x1024 (devicePixelRatio-aware) CanvasTexture for a cube face.
 * Employs full-bleed cover artwork, per-face radial alpha mask (so the plasma core glows through the center),
 * and pixel-perfect layout alignment.
 */
export function createServiceFaceTexture(
  service: ServiceConfig,
  isHovered = false
): THREE.CanvasTexture {
  const isDebug = isDebugLayoutActive();
  const cacheKey = `${service.id}_${isHovered ? 'hover' : 'normal'}${isDebug ? '_debug' : ''}`;

  if (textureCache.has(cacheKey)) {
    return textureCache.get(cacheKey)!;
  }

  const cfg = CUBE_THEME_CONFIG;
  const canonicalSize = cfg.CANVAS_SIZE; // 1024px canonical layout space
  const dpr = typeof window !== 'undefined' ? Math.max(1, Math.min(window.devicePixelRatio || 1, 2)) : 1;

  // Main high-resolution canvas
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(canonicalSize * dpr);
  canvas.height = Math.round(canonicalSize * dpr);
  const ctx = canvas.getContext('2d', { alpha: true })!;

  // Offscreen canvas for applying the radial vignette alpha mask
  const offCanvas = document.createElement('canvas');
  offCanvas.width = Math.round(canonicalSize * dpr);
  offCanvas.height = Math.round(canonicalSize * dpr);
  const offCtx = offCanvas.getContext('2d', { alpha: true })!;

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 16;
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;

  const renderFace = (img?: HTMLImageElement) => {
    // Reset transforms and clear both physical canvases
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    offCtx.setTransform(1, 0, 0, 1, 0, 0);
    offCtx.clearRect(0, 0, offCanvas.width, offCanvas.height);
    offCtx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const W = canonicalSize;
    const H = canonicalSize;

    // -------------------------------------------------------------
    // A. FULL-COVER ARTWORK & PER-FACE VIGNETTE / ALPHA MASK
    // -------------------------------------------------------------
    const centerAlpha = isHovered
      ? cfg.ART_ALPHA_CENTER + cfg.HOVER_ALPHA_BOOST
      : cfg.ART_ALPHA_CENTER;
    const edgeAlpha = isHovered
      ? Math.min(1.0, cfg.ART_ALPHA_EDGE + cfg.HOVER_ALPHA_BOOST)
      : cfg.ART_ALPHA_EDGE;

    if (img && img.complete && img.naturalWidth > 0) {
      // 1. Draw full-bleed cover image (uniformly scaled, center-cropped, 0 letterbox)
      drawCover(offCtx, img, W, H);

      // 2. Apply per-face vignette mask so core is clearly visible at center (~0.38)
      //    rising to edge (~0.70) so the face reads as a solid pane
      offCtx.globalCompositeOperation = 'destination-in';
      const maskGrad = offCtx.createRadialGradient(
        W / 2,
        Math.round(H * 0.42),
        60,
        W / 2,
        H / 2,
        Math.round(W * 0.64)
      );
      maskGrad.addColorStop(0, `rgba(0, 0, 0, ${centerAlpha})`);
      maskGrad.addColorStop(0.55, `rgba(0, 0, 0, ${(centerAlpha + edgeAlpha) / 2})`);
      maskGrad.addColorStop(1, `rgba(0, 0, 0, ${edgeAlpha})`);
      offCtx.fillStyle = maskGrad;
      offCtx.fillRect(0, 0, W, H);
      offCtx.globalCompositeOperation = 'source-over';

      // 3. Blit masked artwork onto main face canvas
      ctx.drawImage(offCanvas, 0, 0, W, H);
    } else {
      // Procedural full-bleed background gradient while loading or on error
      const bgGrad = ctx.createRadialGradient(W / 2, H / 2, 60, W / 2, H / 2, Math.round(W * 0.68));
      bgGrad.addColorStop(0, `rgba(10, 36, 85, ${centerAlpha})`);
      bgGrad.addColorStop(0.6, `rgba(5, 16, 45, ${(centerAlpha + edgeAlpha) / 2})`);
      bgGrad.addColorStop(1, `rgba(2, 6, 20, ${edgeAlpha})`);
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, W, H);

      drawProceduralFallback(ctx, service, W, H, isHovered);
    }

    // -------------------------------------------------------------
    // B. BOTTOM INFO BAND: GRADIENT SCRIM (y=620 to y=1024)
    // Dark-to-transparent scrim ensures text is always readable over artwork
    // -------------------------------------------------------------
    const scrimGrad = ctx.createLinearGradient(0, cfg.SCRIM_Y_START, 0, cfg.SCRIM_Y_END);
    scrimGrad.addColorStop(0, 'rgba(2, 4, 10, 0.0)');
    scrimGrad.addColorStop(0.32, 'rgba(2, 4, 10, 0.72)');
    scrimGrad.addColorStop(0.70, 'rgba(2, 4, 10, 0.92)');
    scrimGrad.addColorStop(1, 'rgba(2, 4, 10, 0.98)');
    ctx.fillStyle = scrimGrad;
    ctx.fillRect(0, cfg.SCRIM_Y_START, W, cfg.SCRIM_Y_END - cfg.SCRIM_Y_START);

    // -------------------------------------------------------------
    // C. NEON FRAME & CORNER TICKS (Inset 20px, 4px width)
    // -------------------------------------------------------------
    const frameColor = isHovered ? '#ffffff' : service.accentColor;
    const shadowColor = isHovered ? '#ff5aa5' : service.accentColor;
    const frameSize = W - 2 * cfg.FRAME_INSET;

    ctx.save();
    ctx.strokeStyle = frameColor;
    ctx.lineWidth = cfg.FRAME_WIDTH;
    ctx.shadowColor = shadowColor;
    ctx.shadowBlur = Math.round((isHovered ? 26 : 14) * cfg.GLOW);
    ctx.strokeRect(cfg.FRAME_INSET, cfg.FRAME_INSET, frameSize, frameSize);

    // Corner tick accents
    ctx.lineWidth = 3;
    const tick = cfg.TICK_LENGTH;
    const inset = cfg.FRAME_INSET;
    const right = W - inset;
    const bottom = H - inset;

    ctx.beginPath();
    // Top-Left
    ctx.moveTo(inset, inset + tick);
    ctx.lineTo(inset, inset);
    ctx.lineTo(inset + tick, inset);
    // Top-Right
    ctx.moveTo(right - tick, inset);
    ctx.lineTo(right, inset);
    ctx.lineTo(right, inset + tick);
    // Bottom-Left
    ctx.moveTo(inset, bottom - tick);
    ctx.lineTo(inset, bottom);
    ctx.lineTo(inset + tick, bottom);
    // Bottom-Right
    ctx.moveTo(right - tick, bottom);
    ctx.lineTo(right, bottom);
    ctx.lineTo(right, bottom - tick);
    ctx.stroke();
    ctx.restore();

    // -------------------------------------------------------------
    // D. TOP BAR (y=56 to y=112, baseline center y=84)
    // -------------------------------------------------------------
    ctx.save();
    ctx.shadowBlur = 0;
    ctx.textBaseline = 'middle';

    // Left: "SERVICE // 0X"
    ctx.textAlign = 'left';
    ctx.font = 'bold 24px Unbounded, sans-serif';
    ctx.fillStyle = frameColor;
    const serviceNum = service.faceIndex + 1 < 10 ? `0${service.faceIndex + 1}` : `${service.faceIndex + 1}`;
    ctx.fillText(`SERVICE // ${serviceNum}`, cfg.SAFE_MARGIN, cfg.TOP_BAR_Y);

    // Right: Status tag
    ctx.textAlign = 'right';
    ctx.font = '600 18px Manrope, sans-serif';
    ctx.fillStyle = isHovered ? '#e8fbff' : '#8b99bd';
    ctx.fillText('LIVE // 24/7 READY', W - cfg.SAFE_MARGIN, cfg.TOP_BAR_Y);
    ctx.restore();

    // -------------------------------------------------------------
    // E. SERVICE TITLE (Horizontally Centered, Uppercase, y ~ 800)
    // Shrinks font dynamically so it never overflows or wraps
    // -------------------------------------------------------------
    const maxAvailableWidth = W - 2 * cfg.SAFE_MARGIN; // 912px
    const titleText = service.title.toUpperCase();

    const titleFontSize = fitText(
      ctx,
      titleText,
      maxAvailableWidth,
      cfg.TITLE_MAX_FONT_SIZE,
      cfg.TITLE_MIN_FONT_SIZE,
      'Unbounded, sans-serif',
      'bold'
    );

    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = `bold ${titleFontSize}px Unbounded, sans-serif`;
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = shadowColor;
    ctx.shadowBlur = Math.round((isHovered ? 26 : 14) * cfg.GLOW);
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 2;
    ctx.fillText(titleText, Math.round(W / 2), cfg.TITLE_Y);
    ctx.restore();

    // -------------------------------------------------------------
    // F. SERVICE TAGLINE (Single line, Centered, y ~ 860)
    // Truncated with ellipsis if longer than max width
    // -------------------------------------------------------------
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = `500 ${cfg.TAGLINE_FONT_SIZE}px Manrope, sans-serif`;
    ctx.fillStyle = isHovered ? '#e8fbff' : '#9bb0d8';
    ctx.shadowBlur = 0;

    const safeTagline = truncateText(ctx, service.tagline, maxAvailableWidth);
    ctx.fillText(safeTagline, Math.round(W / 2), cfg.TAGLINE_Y);
    ctx.restore();

    // -------------------------------------------------------------
    // G. CALLOUT PILL BUTTON (Centered, y ~ 930, fixed 380x60)
    // -------------------------------------------------------------
    const pillX = Math.round(W / 2 - cfg.PILL_WIDTH / 2);
    const pillY = Math.round(cfg.PILL_Y - cfg.PILL_HEIGHT / 2);

    ctx.save();
    ctx.beginPath();
    ctx.roundRect(pillX, pillY, cfg.PILL_WIDTH, cfg.PILL_HEIGHT, cfg.PILL_RADIUS);

    if (isHovered) {
      ctx.fillStyle = 'rgba(255, 90, 165, 0.28)';
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3;
      ctx.shadowColor = '#ff5aa5';
      ctx.shadowBlur = Math.round(28 * cfg.GLOW);
    } else {
      ctx.fillStyle = 'rgba(8, 24, 60, 0.65)';
      ctx.strokeStyle = 'rgba(79, 216, 255, 0.85)';
      ctx.lineWidth = cfg.PILL_BORDER_WIDTH;
      ctx.shadowColor = service.accentColor;
      ctx.shadowBlur = Math.round(14 * cfg.GLOW);
    }
    ctx.fill();
    ctx.stroke();

    // Text inside Pill
    ctx.shadowBlur = 0;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = `bold ${cfg.PILL_FONT_SIZE}px Unbounded, sans-serif`;
    ctx.fillStyle = isHovered ? '#ffffff' : '#4fd8ff';
    ctx.fillText(isHovered ? 'VIEW DEMO ➔' : 'CLICK TO VIEW', Math.round(W / 2), cfg.PILL_Y);
    ctx.restore();

    // -------------------------------------------------------------
    // H. DEBUG LAYOUT OVERLAY (?debug=layout)
    // -------------------------------------------------------------
    if (isDebug) {
      drawDebugLayout(ctx, cfg);
    }

    texture.needsUpdate = true;
  };

  // Check image cache or initiate fetch
  if (imageCache.has(service.thumbnailPath)) {
    renderFace(imageCache.get(service.thumbnailPath));
  } else {
    // Render immediate placeholder while loading
    renderFace();

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = service.thumbnailPath;
    img.onload = () => {
      imageCache.set(service.thumbnailPath, img);
      renderFace(img);
    };
    img.onerror = () => {
      // On error, procedural placeholder remains rendered cleanly
      renderFace();
    };
  }

  textureCache.set(cacheKey, texture);
  return texture;
}

/**
 * Disposes all cached CanvasTextures and images to prevent GPU memory leaks.
 */
export function disposeFaceTextureCache(): void {
  textureCache.forEach((tex) => tex.dispose());
  textureCache.clear();
  imageCache.clear();
}
