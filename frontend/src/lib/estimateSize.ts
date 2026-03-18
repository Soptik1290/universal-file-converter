/**
 * Rough output file size estimation based on format and quality.
 * Returns estimated size in bytes. Values are ballpark approximations.
 */

// Compression ratios relative to input size (midpoint estimates)
const IMAGE_RATIOS: Record<string, { base: number; qualityFactor: boolean }> = {
  jpg: { base: 0.35, qualityFactor: true },
  jpeg: { base: 0.35, qualityFactor: true },
  png: { base: 0.9, qualityFactor: false },
  webp: { base: 0.3, qualityFactor: true },
  avif: { base: 0.2, qualityFactor: true },
  heic: { base: 0.25, qualityFactor: true },
  gif: { base: 0.7, qualityFactor: false },
  bmp: { base: 3.0, qualityFactor: false },
  tiff: { base: 1.1, qualityFactor: false },
  ico: { base: 0.5, qualityFactor: false },
  jxl: { base: 0.22, qualityFactor: true },
  svg: { base: 0.15, qualityFactor: false },
  qoi: { base: 0.8, qualityFactor: false },
  pdf: { base: 1.2, qualityFactor: false },
};

const DOC_RATIOS: Record<string, number> = {
  pdf: 1.0,
  docx: 0.8,
  html: 1.5,
  md: 0.3,
  txt: 0.25,
  odt: 0.85,
  epub: 0.7,
  rtf: 1.8,
  rst: 0.3,
  tex: 0.35,
};

const DATA_RATIOS: Record<string, number> = {
  csv: 0.3,
  tsv: 0.3,
  xlsx: 0.15,
  json: 0.5,
  xml: 0.7,
  yaml: 0.45,
  toml: 0.4,
  parquet: 0.08,
  sql: 0.6,
  html: 0.8,
  pdf: 1.2,
  md: 0.4,
};

// Resize preset areas relative to a "standard" 1920x1080 image
const RESIZE_AREAS: Record<string, number> = {
  thumb: (150 * 150) / (1920 * 1080),
  small: (480 * 480) / (1920 * 1080),
  medium: (1024 * 1024) / (1920 * 1080),
  hd: 1.0,
  "4k": (3840 * 2160) / (1920 * 1080),
  ico16: (16 * 16) / (1920 * 1080),
  ico32: (32 * 32) / (1920 * 1080),
  ico48: (48 * 48) / (1920 * 1080),
  ico256: (256 * 256) / (1920 * 1080),
};

export function estimateOutputSize(
  inputSize: number,
  inputFormat: string,
  outputFormat: string,
  quality?: number,
  resizePreset?: string,
  resizeWidth?: number,
  resizeHeight?: number
): number {
  const inFmt = inputFormat.toLowerCase();
  const outFmt = outputFormat.toLowerCase();

  let ratio = 1.0;

  // Determine ratio based on output format
  const imageEntry = IMAGE_RATIOS[outFmt];
  if (imageEntry) {
    ratio = imageEntry.base;
    if (imageEntry.qualityFactor && quality !== undefined) {
      // Quality 1-100: lower quality = smaller file
      // Scale ratio by quality factor (at q=50, file is ~60% of q=100)
      const qFactor = 0.3 + 0.7 * (quality / 100);
      ratio *= qFactor;
    }
  } else if (DOC_RATIOS[outFmt]) {
    ratio = DOC_RATIOS[outFmt];
  } else if (DATA_RATIOS[outFmt]) {
    ratio = DATA_RATIOS[outFmt];
  }

  // Adjust for input format (some inputs are already compressed)
  const inputImage = IMAGE_RATIOS[inFmt];
  if (inputImage && imageEntry) {
    // If converting between image formats, adjust relative to each other
    const inputRatio = inputImage.base || 1;
    ratio = ratio / inputRatio;
  }

  // Apply resize factor
  if (resizePreset && resizePreset !== "original" && RESIZE_AREAS[resizePreset]) {
    ratio *= Math.sqrt(RESIZE_AREAS[resizePreset]);
  } else if (resizeWidth && resizeHeight) {
    // Rough: assume original is ~2MP, calculate area ratio
    const originalArea = 2_000_000;
    const newArea = resizeWidth * resizeHeight;
    ratio *= Math.sqrt(Math.min(newArea / originalArea, 1));
  }

  // Clamp to reasonable bounds
  const estimated = Math.round(inputSize * Math.max(ratio, 0.01));
  return Math.max(estimated, 100); // minimum 100 bytes
}
