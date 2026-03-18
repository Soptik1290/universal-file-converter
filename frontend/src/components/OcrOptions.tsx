"use client";

import type { ConversionOptions } from "@/lib/types";

interface OcrOptionsProps {
  options: ConversionOptions;
  onChange: (options: ConversionOptions) => void;
}

const LANGUAGES = [
  { code: "eng", label: "English" },
  { code: "ces", label: "Czech" },
  { code: "deu", label: "German" },
  { code: "fra", label: "French" },
  { code: "spa", label: "Spanish" },
  { code: "ita", label: "Italian" },
];

export function OcrOptions({ options, onChange }: OcrOptionsProps) {
  const selected = options.ocrLanguages ?? ["eng"];

  const toggleLang = (code: string) => {
    const next = selected.includes(code)
      ? selected.filter((l) => l !== code)
      : [...selected, code];
    if (next.length > 0) {
      onChange({ ...options, ocrLanguages: next });
    }
  };

  const chipClass = (active: boolean) =>
    `rounded-md border px-3 py-1.5 text-xs font-medium transition-colors ${
      active
        ? "bg-primary/15 border-primary text-primary"
        : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
    }`;

  return (
    <div className="space-y-2">
      <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        OCR Languages
      </label>
      <div className="flex flex-wrap gap-2">
        {LANGUAGES.map((lang) => (
          <button
            key={lang.code}
            onClick={() => toggleLang(lang.code)}
            className={chipClass(selected.includes(lang.code))}
          >
            {lang.label}
          </button>
        ))}
      </div>
    </div>
  );
}
