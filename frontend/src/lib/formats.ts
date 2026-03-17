export const CATEGORY_COLORS: Record<string, string> = {
  image: "bg-blue-500/10 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300",
  document:
    "bg-emerald-500/10 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
  data: "bg-amber-500/10 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
  presentation:
    "bg-purple-500/10 text-purple-700 dark:bg-purple-500/15 dark:text-purple-300",
  ocr: "bg-rose-500/10 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300",
};

export const FORMAT_LABELS: Record<string, string> = {
  jpg: "JPEG",
  jpeg: "JPEG",
  png: "PNG",
  gif: "GIF",
  bmp: "BMP",
  tiff: "TIFF",
  webp: "WebP",
  heic: "HEIC",
  heif: "HEIF",
  avif: "AVIF",
  svg: "SVG",
  ico: "ICO",
  jxl: "JPEG XL",
  qoi: "QOI",
  cr2: "RAW (CR2)",
  nef: "RAW (NEF)",
  arw: "RAW (ARW)",
  pdf: "PDF",
  txt: "Plain Text",
  md: "Markdown",
  html: "HTML",
  css: "CSS",
  json: "JSON",
  xml: "XML",
  yaml: "YAML",
  toml: "TOML",
  csv: "CSV",
  tsv: "TSV",
  rst: "reStructuredText",
  tex: "LaTeX",
  rtf: "RTF",
  docx: "DOCX",
  odt: "ODT",
  epub: "EPUB",
  log: "Log File",
  ini: "INI",
  cfg: "Config",
  env: "ENV",
  xlsx: "Excel",
  xls: "Excel (Legacy)",
  ods: "ODS",
  parquet: "Parquet",
  db: "SQLite",
  sqlite: "SQLite",
  sql: "SQL",
  pptx: "PowerPoint",
  odp: "ODP",
};

export function getFormatLabel(format: string): string {
  return FORMAT_LABELS[format.toLowerCase()] || format.toUpperCase();
}

export function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    image: "Image",
    document: "Document",
    data: "Data",
    presentation: "Presentation",
    ocr: "OCR",
  };
  return labels[category] || category;
}
