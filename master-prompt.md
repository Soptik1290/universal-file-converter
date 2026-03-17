# Master Prompt: Universal File Converter

## Project Overview

Build a full-stack **Universal File Converter** web application. The app allows users to upload one or more files, automatically detects file types, and offers all available conversion options for each file. The UI is modern, responsive, and supports drag & drop with file previews.

**Tech Stack:**

- **Frontend:** Next.js 14+ (App Router), TypeScript, Tailwind CSS, shadcn/ui
- **Backend:** Python FastAPI (handles all heavy file conversions)
- **Communication:** REST API between Next.js and FastAPI
- **Containerization:** Docker Compose (Next.js + FastAPI services)

---

## Architecture

```
┌─────────────────────────────────────┐
│         Next.js Frontend            │
│  (Upload UI, Preview, Progress)     │
│         Port: 3000                  │
└──────────────┬──────────────────────┘
               │ REST API (multipart/form-data)
               ▼
┌─────────────────────────────────────┐
│        Python FastAPI Backend       │
│  (Conversion Engine, File Processing│
│   OCR, LibreOffice, FFmpeg, etc.)   │
│         Port: 8000                  │
└─────────────────────────────────────┘
```

---

## Supported Conversions

### 1. Images

**Input formats:** JPG/JPEG, PNG, GIF, BMP, TIFF, WebP, HEIC/HEIF, AVIF, SVG, ICO, RAW (CR2, NEF, ARW), JXL (JPEG XL), QOI

**Output formats:** JPG, PNG, GIF, BMP, TIFF, WebP, AVIF, ICO, JXL (JPEG XL), PDF, SVG (raster → vector trace via potrace)

**Options per conversion:**
- **Quality slider** (1–100) for lossy formats (JPG, WebP, AVIF, JXL)
- **Resize:** preset buttons (Thumbnail 150px, Small 480px, Medium 1024px, HD 1920px, 4K 3840px) + custom width×height with lock aspect ratio toggle
- **Strip/keep EXIF metadata** toggle
- **Background color** for transparent → non-transparent (e.g. PNG → JPG)

**Python libraries:** Pillow, pillow-heif, pillow-jxl (or imagemagick fallback), potrace, rawpy

### 2. Text / Document Files

**Input formats:** TXT, MD (Markdown), HTML, CSS, JSON, XML, YAML, TOML, CSV, TSV, RST (reStructuredText), LATEX (.tex), RTF, DOCX, ODT, EPUB, LOG, INI, CFG, ENV

**Output formats:** TXT, MD, HTML, PDF, DOCX, ODT, EPUB, RST, LATEX, RTF, JSON (structured), XML

**Special: Markdown ↔ Rich Text handling:**
- When converting **TO Markdown**: detect formatting (bold, italic, headers, lists, links, tables) and produce proper `**bold**`, `*italic*`, `# heading`, `- list`, `[link](url)`, `| table |` syntax
- When converting **FROM Markdown**: parse MD syntax and apply real formatting (HTML with CSS, DOCX with styles, PDF with typography)
- Provide a **toggle**: "Preserve MD syntax as literal text" vs "Interpret MD formatting" — user decides which behavior they want
- Use **pandoc** as primary conversion engine for document formats (MD, RST, LATEX, DOCX, ODT, EPUB, HTML)

**PDF generation options:**
- Page size (A4, Letter, Legal, A3)
- Orientation (portrait/landscape)
- Margins (preset: normal, narrow, wide, custom)
- Font family + size
- Include page numbers toggle
- Header/footer text

**Python libraries:** pandoc (via pypandoc), python-docx, WeasyPrint or wkhtmltopdf (HTML→PDF), python-pptx, ebooklib

### 3. Tabular / Data Files

**Input formats:** CSV, TSV, XLSX, XLS, ODS, JSON, XML, YAML, TOML, Parquet, SQLite (.db/.sqlite)

**Output formats:** CSV, TSV, XLSX, JSON, XML, YAML, TOML, Parquet, PDF (table), HTML (table), Markdown (table), SQL (CREATE + INSERT statements)

**Options:**
- **Delimiter selection** for CSV/TSV (auto-detect or manual: comma, tab, semicolon, pipe)
- **Sheet selection** for multi-sheet XLSX (show sheet names, let user pick which to convert)
- **Encoding** selection (UTF-8, Latin-1, Windows-1250, etc.) — auto-detect with chardet
- **Header row** toggle (first row is header yes/no)

**Python libraries:** pandas, openpyxl, pyarrow (Parquet), chardet, pyyaml, toml

### 4. Presentations

**Input formats:** PPTX, ODP, PDF (pages → slides)

**Output formats:** PDF, images (PNG/JPG per slide), PPTX (from PDF/images)

**Options:**
- **DPI** for slide-to-image (72, 150, 300)
- **Individual slides or all** selection

**Python libraries:** python-pptx, LibreOffice (headless), pdf2image

### 5. OCR (PDF/Image → Text)

**Input:** Scanned PDF, image files (JPG, PNG, TIFF, etc.)

**Output:** TXT, MD, DOCX, searchable PDF, HTML

**Options:**
- **Language** selection (multi-select: Czech, English, German, etc.)
- **Output format** (plain text, Markdown with detected structure, DOCX)

**Python libraries:** pytesseract + Tesseract OCR engine, pdf2image

---

## Frontend Specification

### Layout & Design

- **Single-page app** with clean, minimal UI
- **Dark/light mode** toggle (persist in localStorage) — use next-themes
- **Color scheme:** neutral grays + one accent color (blue or violet)
- **Font:** Inter or system font stack

### Upload Zone

- Large **drag & drop zone** (dashed border, icon, text: "Drop files here or click to browse")
- Support **multiple file upload** (no limit on count, configurable max size per file: default 100MB)
- On hover/drag-over: visual feedback (border color change, background highlight)
- After upload: show **file list** below the drop zone with:
  - Thumbnail preview (images), file icon (others), or first-page preview (PDF)
  - File name + size
  - Detected file type badge
  - Remove button (×) per file
  - "Clear all" button

### Conversion Panel

For each uploaded file (or batch if same type):

1. **Auto-detect** file type and show available output formats as **clickable chips/buttons**
2. Group output formats by category (e.g., "Images", "Documents", "Data")
3. When user selects an output format, **expand an options panel** below with relevant settings:
   - Quality slider (if applicable)
   - Resize options (if image)
   - PDF options (if converting to PDF)
   - Markdown formatting toggle (if MD involved)
   - Encoding/delimiter (if data file)
4. **"Convert" button** — prominent, primary color
5. Show **progress bar** per file during conversion (use SSE or polling)
6. After conversion: show **download button** per file + **"Download all as ZIP"** button

### Batch Mode

- If multiple files of the same type are uploaded, offer **"Apply to all"** option
- Single format selection + options applied to all files at once
- Progress bar shows overall + per-file progress
- Final output: individual downloads + ZIP

### Responsive Design

- Mobile: stack layout, full-width drop zone, scrollable file list
- Tablet: 2-column layout
- Desktop: comfortable max-width container (1200px), centered

---

## Backend Specification (FastAPI)

### API Endpoints

```
POST   /api/convert              — Upload file(s) + conversion params, returns job ID
GET    /api/status/{job_id}      — Poll conversion progress (0-100%)
GET    /api/download/{job_id}    — Download converted file
GET    /api/download/{job_id}/zip — Download all converted files as ZIP
GET    /api/formats              — List all supported input→output format mappings
POST   /api/detect               — Upload file, return detected type + available conversions
DELETE /api/job/{job_id}         — Clean up job files
```

### Conversion Pipeline

```python
# Pseudocode for the conversion pipeline
async def convert(file: UploadFile, output_format: str, options: dict) -> Path:
    # 1. Save uploaded file to temp directory
    # 2. Detect input format (by extension + magic bytes via python-magic)
    # 3. Validate: is input→output supported?
    # 4. Select conversion strategy (direct or chain)
    #    e.g., HEIC → JPG: direct via pillow-heif
    #    e.g., DOCX → PDF: via pandoc or LibreOffice
    #    e.g., XLSX → PDF: pandas read → HTML table → WeasyPrint
    # 5. Apply options (quality, resize, etc.)
    # 6. Execute conversion
    # 7. Return output file path
    # 8. Schedule cleanup (delete temp files after 1 hour)
```

### File Detection

Use dual detection strategy:
1. **File extension** — primary hint
2. **python-magic** (libmagic) — MIME type from file header bytes
3. If mismatch: trust magic bytes, warn user

### Error Handling

- Invalid file: return 400 with clear message ("Unsupported format", "Corrupted file")
- Conversion failure: return 500 with actionable message + log details server-side
- File too large: return 413 with max size info
- Timeout: conversions have max 5 min timeout

### Temp File Management

- All uploads go to `/tmp/converter/{job_id}/input/`
- All outputs go to `/tmp/converter/{job_id}/output/`
- Background task cleans up jobs older than 1 hour
- On startup: clean any leftover temp dirs

---

## Project Structure

```
file-converter/
├── docker-compose.yml
├── frontend/
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.ts
│   ├── next.config.js
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx          # Root layout with ThemeProvider
│   │   │   ├── page.tsx            # Main converter page
│   │   │   └── globals.css         # Tailwind base + custom styles
│   │   ├── components/
│   │   │   ├── DropZone.tsx        # Drag & drop upload area
│   │   │   ├── FileList.tsx        # Uploaded files with previews
│   │   │   ├── FileCard.tsx        # Individual file card
│   │   │   ├── FormatSelector.tsx  # Output format chips
│   │   │   ├── ConversionOptions.tsx # Dynamic options panel
│   │   │   ├── QualitySlider.tsx   # Image quality control
│   │   │   ├── ResizeOptions.tsx   # Image resize presets + custom
│   │   │   ├── PdfOptions.tsx      # PDF generation settings
│   │   │   ├── MarkdownToggle.tsx  # MD formatting mode toggle
│   │   │   ├── DataOptions.tsx     # CSV/encoding/sheet options
│   │   │   ├── OcrOptions.tsx      # OCR language + format
│   │   │   ├── ProgressBar.tsx     # Conversion progress
│   │   │   ├── DownloadPanel.tsx   # Download buttons + ZIP
│   │   │   ├── ThemeToggle.tsx     # Dark/light mode switch
│   │   │   └── ui/                 # shadcn/ui components
│   │   ├── lib/
│   │   │   ├── api.ts             # API client functions
│   │   │   ├── formats.ts         # Format definitions + icons
│   │   │   ├── utils.ts           # Helpers (file size formatting, etc.)
│   │   │   └── types.ts           # TypeScript interfaces
│   │   └── hooks/
│   │       ├── useFileUpload.ts   # Upload logic + state
│   │       ├── useConversion.ts   # Conversion polling + state
│   │       └── useTheme.ts        # Theme management
├── backend/
│   ├── requirements.txt
│   ├── Dockerfile
│   ├── main.py                    # FastAPI app + routes
│   ├── config.py                  # Settings (max file size, cleanup interval, etc.)
│   ├── converters/
│   │   ├── __init__.py
│   │   ├── base.py               # Abstract converter class
│   │   ├── image.py              # Image conversions (Pillow, etc.)
│   │   ├── document.py           # Text/document conversions (pandoc)
│   │   ├── data.py               # Tabular data conversions (pandas)
│   │   ├── presentation.py       # Presentation conversions
│   │   └── ocr.py                # OCR processing
│   ├── utils/
│   │   ├── detection.py          # File type detection
│   │   ├── cleanup.py            # Temp file management
│   │   └── zip_builder.py        # ZIP creation for batch downloads
│   └── format_registry.py        # Central registry: input → [outputs] mapping
└── README.md
```

---

## Implementation Order

Build in this exact order to ensure each step is testable:

### Phase 1: Foundation
1. Initialize Next.js project with TypeScript + Tailwind + shadcn/ui
2. Initialize FastAPI project with basic structure
3. Set up Docker Compose with both services
4. Implement `/api/formats` endpoint (returns all supported mappings)
5. Implement file detection (`/api/detect`)

### Phase 2: Upload & UI
6. Build DropZone component with drag & drop
7. Build FileList + FileCard with previews
8. Implement upload to backend (multipart/form-data)
9. Build FormatSelector (chips based on detected type)
10. Build basic ConversionOptions panel

### Phase 3: Image Conversion
11. Implement image converter (Pillow + plugins)
12. Add quality slider + resize options
13. Add EXIF strip/keep toggle
14. Test: JPG, PNG, WebP, HEIC, AVIF, JXL, SVG, TIFF, BMP, ICO, RAW

### Phase 4: Document Conversion
15. Implement document converter (pandoc + python-docx + WeasyPrint)
16. Add Markdown ↔ formatting toggle
17. Add PDF options panel
18. Test: MD, TXT, HTML, DOCX, RTF, ODT, EPUB, RST, LATEX

### Phase 5: Data & Presentations
19. Implement tabular data converter (pandas + openpyxl)
20. Add delimiter/encoding/sheet options
21. Implement presentation converter
22. Test full data flow: CSV ↔ XLSX ↔ JSON ↔ YAML ↔ Parquet

### Phase 6: OCR
23. Integrate Tesseract OCR
24. Build OCR options panel (language, output format)
25. Test: scanned PDF → text, image → text

### Phase 7: Batch & Polish
26. Implement batch conversion (multiple files, same settings)
27. Add ZIP download
28. Add progress bars (SSE or polling)
29. Add dark/light mode
30. Responsive design pass
31. Error handling + edge cases
32. Cleanup scheduler

---

## Docker Compose

```yaml
version: "3.9"
services:
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:8000
    depends_on:
      - backend

  backend:
    build: ./backend
    ports:
      - "8000:8000"
    volumes:
      - tmp_data:/tmp/converter
    environment:
      - MAX_FILE_SIZE=104857600  # 100MB
      - CLEANUP_INTERVAL=3600    # 1 hour
      - TESSERACT_LANGS=ces+eng+deu

volumes:
  tmp_data:
```

### Backend Dockerfile base:
```dockerfile
FROM python:3.12-slim

# System deps for conversions
RUN apt-get update && apt-get install -y \
    libmagic1 \
    pandoc \
    libreoffice-core libreoffice-writer libreoffice-calc libreoffice-impress \
    tesseract-ocr tesseract-ocr-ces tesseract-ocr-deu \
    poppler-utils \
    potrace \
    libheif-dev \
    libjxl-dev \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

---

## Key Implementation Details

### Format Registry Pattern

```python
# format_registry.py
FORMAT_MAP = {
    "image": {
        "inputs": ["jpg", "jpeg", "png", "gif", "bmp", "tiff", "webp", "heic", "heif", "avif", "svg", "ico", "cr2", "nef", "arw", "jxl", "qoi"],
        "outputs": ["jpg", "png", "gif", "bmp", "tiff", "webp", "avif", "ico", "jxl", "pdf", "svg"],
        "options": ["quality", "resize", "strip_metadata", "background_color"]
    },
    "document": {
        "inputs": ["txt", "md", "html", "css", "json", "xml", "yaml", "toml", "csv", "tsv", "rst", "tex", "rtf", "docx", "odt", "epub", "log", "ini", "cfg", "env"],
        "outputs": ["txt", "md", "html", "pdf", "docx", "odt", "epub", "rst", "tex", "rtf"],
        "options": ["md_formatting", "pdf_page_size", "pdf_orientation", "pdf_margins", "pdf_font", "pdf_page_numbers"]
    },
    "data": {
        "inputs": ["csv", "tsv", "xlsx", "xls", "ods", "json", "xml", "yaml", "toml", "parquet", "db", "sqlite"],
        "outputs": ["csv", "tsv", "xlsx", "json", "xml", "yaml", "toml", "parquet", "pdf", "html", "md", "sql"],
        "options": ["delimiter", "encoding", "sheet", "header_row"]
    },
    "presentation": {
        "inputs": ["pptx", "odp", "pdf"],
        "outputs": ["pdf", "png", "jpg", "pptx"],
        "options": ["dpi", "slide_selection"]
    },
    "ocr": {
        "inputs": ["pdf", "jpg", "jpeg", "png", "tiff", "bmp"],
        "outputs": ["txt", "md", "docx", "pdf", "html"],
        "options": ["language", "output_format"]
    }
}
```

### Smart Type Detection

```python
# detection.py
import magic

EXTENSION_TO_CATEGORY = {
    # images
    "jpg": "image", "jpeg": "image", "png": "image", "gif": "image",
    "heic": "image", "heif": "image", "avif": "image", "webp": "image",
    "jxl": "image", "svg": "image", "bmp": "image", "tiff": "image",
    "ico": "image", "qoi": "image", "cr2": "image", "nef": "image", "arw": "image",
    # documents
    "txt": "document", "md": "document", "html": "document", "htm": "document",
    "rst": "document", "tex": "document", "rtf": "document", "docx": "document",
    "odt": "document", "epub": "document",
    # data
    "csv": "data", "tsv": "data", "xlsx": "data", "xls": "data",
    "ods": "data", "json": "data", "xml": "data", "yaml": "data", "yml": "data",
    "toml": "data", "parquet": "data", "db": "data", "sqlite": "data",
    # presentations
    "pptx": "presentation", "odp": "presentation",
    # ambiguous — needs context
    "pdf": None,  # could be OCR, document, or presentation source
}

def detect_file(filepath: str, filename: str) -> dict:
    """Returns {category, format, mime_type, is_ambiguous, available_outputs}"""
    ext = filename.rsplit(".", 1)[-1].lower()
    mime = magic.from_file(filepath, mime=True)
    
    # PDF is ambiguous: check if it's scanned (image-based) or text-based
    if ext == "pdf":
        is_scanned = check_pdf_is_scanned(filepath)
        return {
            "category": "ocr" if is_scanned else "document",
            "format": "pdf",
            "mime_type": mime,
            "is_ambiguous": True,  # Let user also pick other categories
            "available_categories": ["document", "presentation", "ocr"]
        }
    
    category = EXTENSION_TO_CATEGORY.get(ext)
    return {
        "category": category,
        "format": ext,
        "mime_type": mime,
        "is_ambiguous": False,
        "available_outputs": FORMAT_MAP[category]["outputs"] if category else []
    }
```

---

## Quality & Style Guidelines

### Frontend
- Use **shadcn/ui** components consistently (Button, Card, Slider, Select, Badge, Progress, Tooltip, Tabs)
- All states handled: empty, loading, error, success
- Animations: use Framer Motion for file card enter/exit, progress transitions
- Accessible: proper ARIA labels, keyboard navigation, screen reader support
- Toast notifications for errors and success (sonner or shadcn toast)

### Backend
- Type hints everywhere, Pydantic models for request/response
- Async where possible (file I/O, conversion subprocess calls)
- Structured logging (loguru or structlog)
- Unit tests for each converter module
- Max 5 concurrent conversions per user (rate limiting)

### Error UX
- File too large → "This file is X MB. Maximum allowed is 100 MB."
- Unsupported format → "We don't support .xyz files yet. Supported formats: ..."
- Conversion failure → "Something went wrong converting your file. Try a different output format or check if the file is corrupted."
- Network error → "Connection lost. Your files are safe — click retry."

---

## Environment Variables

```env
# Frontend (.env.local)
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_MAX_FILE_SIZE=104857600

# Backend (.env)
MAX_FILE_SIZE=104857600
MAX_CONCURRENT_JOBS=20
CLEANUP_INTERVAL_SECONDS=3600
TESSERACT_LANGUAGES=ces+eng+deu
ALLOWED_ORIGINS=http://localhost:3000
LOG_LEVEL=INFO
```

---

## Notes for Claude Code

- Start by creating the project structure and Docker setup first
- Use `pnpm` as the package manager for the frontend
- Install shadcn/ui components as needed: `pnpm dlx shadcn-ui@latest add button card slider select badge progress tooltip tabs toast`
- For the backend, use a virtual environment inside Docker
- Test each conversion category independently before wiring everything together
- When a conversion chain is needed (e.g., DOCX → HTML → PDF), implement it as a pipeline in the converter, not in the route handler
- Keep the format registry as the single source of truth — the frontend fetches it from `/api/formats` at startup
- The frontend should NEVER do file conversions — all processing happens on the backend
