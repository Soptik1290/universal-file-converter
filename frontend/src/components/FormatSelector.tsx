"use client";

import { Badge } from "@/components/ui/badge";
import { getFormatLabel, getCategoryLabel } from "@/lib/formats";
import type { FormatRegistry } from "@/lib/types";

interface FormatSelectorProps {
  availableOutputs: string[];
  selectedFormat: string | undefined;
  onSelect: (format: string) => void;
  isAmbiguous?: boolean;
  availableCategories?: string[];
  selectedCategory?: string;
  onCategoryChange?: (category: string) => void;
  formatRegistry?: FormatRegistry | null;
}

export function FormatSelector({
  availableOutputs,
  selectedFormat,
  onSelect,
  isAmbiguous,
  availableCategories,
  selectedCategory,
  onCategoryChange,
  formatRegistry,
}: FormatSelectorProps) {
  return (
    <div className="space-y-3">
      {isAmbiguous && availableCategories && onCategoryChange && (
        <div>
          <p className="mb-2 text-xs font-medium text-muted-foreground">
            Convert as:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {availableCategories.map((cat) => (
              <Badge
                key={cat}
                variant={selectedCategory === cat ? "default" : "outline"}
                className={`cursor-pointer transition-all duration-200 ${
                  selectedCategory === cat ? "shadow-glow" : "hover:border-primary/50 hover:shadow-glow"
                }`}
                onClick={() => onCategoryChange(cat)}
              >
                {getCategoryLabel(cat)}
              </Badge>
            ))}
          </div>
        </div>
      )}

      <div>
        <p className="mb-2 text-xs font-medium text-muted-foreground">
          Output format:
        </p>
        <div className="flex flex-wrap gap-1.5">
          {(isAmbiguous && selectedCategory && formatRegistry
            ? formatRegistry[selectedCategory]?.outputs || []
            : availableOutputs
          ).map((format) => (
            <Badge
              key={format}
              variant={selectedFormat === format ? "default" : "outline"}
              className={`cursor-pointer transition-all duration-200 ${
                selectedFormat === format
                  ? "shadow-glow"
                  : "hover:border-primary/40 hover:bg-primary/5"
              }`}
              onClick={() => onSelect(format)}
            >
              {getFormatLabel(format)}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
