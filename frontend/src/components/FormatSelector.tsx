"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { FormatDialog } from "./FormatDialog";
import { getFormatLabel, getCategoryLabel } from "@/lib/formats";
import { getPopularAndOther } from "@/lib/formatConfig";
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
  const [dialogOpen, setDialogOpen] = useState(false);

  const outputs =
    isAmbiguous && selectedCategory && formatRegistry
      ? formatRegistry[selectedCategory]?.outputs || []
      : availableOutputs;

  const category = selectedCategory || "";
  const { popular, other } = getPopularAndOther(outputs, category);

  return (
    <div className="space-y-3">
      {isAmbiguous && availableCategories && onCategoryChange && (
        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Convert as
          </p>
          <div className="flex flex-wrap gap-1.5">
            {availableCategories.map((cat) => (
              <Badge
                key={cat}
                variant={selectedCategory === cat ? "default" : "outline"}
                className={`cursor-pointer px-3 py-1.5 text-xs font-medium transition-colors ${
                  selectedCategory === cat
                    ? "bg-primary/15 border-primary text-primary"
                    : "hover:border-primary/40 hover:text-foreground"
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
        <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Convert to
        </p>
        <div className="flex flex-wrap gap-1.5">
          {popular.map((format) => (
            <Badge
              key={format}
              variant={selectedFormat === format ? "default" : "outline"}
              className={`cursor-pointer px-3 py-1.5 text-xs font-medium transition-all ${
                selectedFormat === format
                  ? "bg-primary/15 border-primary text-primary shadow-sm shadow-primary/20"
                  : "hover:border-primary/40 hover:text-foreground"
              }`}
              onClick={() => onSelect(format)}
            >
              {getFormatLabel(format)}
            </Badge>
          ))}

          {other.length > 0 && (
            <>
              <Badge
                variant="outline"
                className="cursor-pointer border-dashed px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                onClick={() => setDialogOpen(true)}
              >
                +{other.length} more
              </Badge>

              <FormatDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                formats={outputs}
                selectedFormat={selectedFormat}
                onSelect={onSelect}
                category={category}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
