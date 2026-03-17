from pathlib import Path

from loguru import logger

from converters.base import BaseConverter

try:
    import pytesseract
    HAS_TESSERACT = True
except ImportError:
    HAS_TESSERACT = False

try:
    from pdf2image import convert_from_path
    HAS_PDF2IMAGE = True
except ImportError:
    HAS_PDF2IMAGE = False


class OcrConverter(BaseConverter):
    async def convert(
        self, input_path: Path, output_format: str, options: dict
    ) -> Path:
        if not HAS_TESSERACT:
            raise RuntimeError("pytesseract is not installed")

        ext = input_path.suffix.lower().lstrip(".")
        output_dir = input_path.parent.parent / "output"
        output_dir.mkdir(parents=True, exist_ok=True)
        stem = input_path.stem
        output_path = output_dir / f"{stem}.{output_format}"

        languages = options.get("ocrLanguages", ["eng"])
        lang_str = "+".join(languages)

        # Get images for OCR
        images = self._get_images(input_path, ext)

        if output_format == "pdf":
            return self._to_searchable_pdf(images, output_path, lang_str)

        # Extract text from all pages
        all_text = []
        for img in images:
            text = pytesseract.image_to_string(img, lang=lang_str)
            all_text.append(text.strip())

        full_text = "\n\n".join(all_text)

        if output_format == "txt":
            output_path.write_text(full_text, encoding="utf-8")

        elif output_format == "md":
            # Basic structure detection: lines that are short and uppercase → headers
            lines = []
            for line in full_text.split("\n"):
                stripped = line.strip()
                if stripped and len(stripped) < 80 and stripped.isupper():
                    lines.append(f"## {stripped.title()}")
                else:
                    lines.append(line)
            output_path.write_text("\n".join(lines), encoding="utf-8")

        elif output_format == "html":
            paragraphs = full_text.split("\n\n")
            html_parts = [
                f"<p>{_escape_html(p.strip())}</p>"
                for p in paragraphs if p.strip()
            ]
            html = f"""<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>{stem} (OCR)</title></head>
<body>{"".join(html_parts)}</body></html>"""
            output_path.write_text(html, encoding="utf-8")

        elif output_format == "docx":
            self._to_docx(full_text, output_path)

        else:
            raise ValueError(f"Unsupported OCR output format: {output_format}")

        logger.info(f"OCR completed: {input_path.name} → {output_path.name}")
        return output_path

    def _get_images(self, input_path: Path, ext: str) -> list:
        """Convert input to list of PIL Images for OCR."""
        if ext == "pdf":
            if not HAS_PDF2IMAGE:
                raise RuntimeError("pdf2image is required for PDF OCR")
            return convert_from_path(str(input_path), dpi=300)

        from PIL import Image
        return [Image.open(str(input_path))]

    def _to_searchable_pdf(self, images: list, output_path: Path, lang: str) -> Path:
        """Create a searchable PDF using Tesseract's PDF output."""
        pdf_pages = []
        for img in images:
            pdf_bytes = pytesseract.image_to_pdf_or_hocr(img, lang=lang, extension="pdf")
            pdf_pages.append(pdf_bytes)

        if len(pdf_pages) == 1:
            output_path.write_bytes(pdf_pages[0])
        else:
            # Concatenate PDF pages — simple approach: write first, rest need merging
            # For simplicity, just write the first page if no PDF merger available
            try:
                from pypdf import PdfMerger
                merger = PdfMerger()
                for i, page_bytes in enumerate(pdf_pages):
                    tmp = output_path.parent / f"_ocr_page_{i}.pdf"
                    tmp.write_bytes(page_bytes)
                    merger.append(str(tmp))
                merger.write(str(output_path))
                merger.close()
                for f in output_path.parent.glob("_ocr_page_*.pdf"):
                    f.unlink()
            except ImportError:
                # Fallback: just use first page
                output_path.write_bytes(pdf_pages[0])

        logger.info(f"Searchable PDF created: {output_path.name}")
        return output_path

    def _to_docx(self, text: str, output_path: Path) -> None:
        """Create a DOCX document from OCR text."""
        from docx import Document

        doc = Document()
        for paragraph in text.split("\n\n"):
            stripped = paragraph.strip()
            if stripped:
                doc.add_paragraph(stripped)

        doc.save(str(output_path))

    def supported_input_formats(self) -> list[str]:
        return ["pdf", "jpg", "jpeg", "png", "tiff", "bmp"]

    def supported_output_formats(self) -> list[str]:
        return ["txt", "md", "docx", "pdf", "html"]


def _escape_html(text: str) -> str:
    return text.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
