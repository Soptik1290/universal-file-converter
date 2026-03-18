"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { getFormatLabel } from "@/lib/formats";

interface FormatDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formats: string[];
  selectedFormat?: string;
  onSelect: (format: string) => void;
  category?: string;
}

export function FormatDialog({
  open,
  onOpenChange,
  formats,
  selectedFormat,
  onSelect,
  category,
}: FormatDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>All output formats</DialogTitle>
          <DialogDescription>
            {category
              ? `Available formats for ${category} conversion`
              : "Select an output format"}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-wrap gap-2 py-2">
          {formats.map((format) => (
            <Badge
              key={format}
              variant={selectedFormat === format ? "default" : "outline"}
              className={`cursor-pointer px-3 py-1.5 text-xs font-medium transition-colors ${
                selectedFormat === format
                  ? "bg-primary/15 border-primary text-primary"
                  : "hover:border-primary/40 hover:text-foreground"
              }`}
              onClick={() => {
                onSelect(format);
                onOpenChange(false);
              }}
            >
              {getFormatLabel(format)}
            </Badge>
          ))}
        </div>

        <p className="text-xs text-muted-foreground">
          Some exotic formats may take longer to process.
        </p>
      </DialogContent>
    </Dialog>
  );
}
