"use client";

interface MarkdownToggleProps {
  value: "interpret" | "literal";
  onChange: (value: "interpret" | "literal") => void;
}

export function MarkdownToggle({ value, onChange }: MarkdownToggleProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm">Markdown handling</label>
      <div className="flex gap-2">
        <button
          onClick={() => onChange("interpret")}
          className={`rounded-md border px-3 py-1.5 text-sm transition-all duration-200 ${
            value === "interpret"
              ? "border-primary bg-primary text-primary-foreground shadow-glow"
              : "border-border hover:bg-muted hover:border-primary/40"
          }`}
        >
          Interpret formatting
        </button>
        <button
          onClick={() => onChange("literal")}
          className={`rounded-md border px-3 py-1.5 text-sm transition-all duration-200 ${
            value === "literal"
              ? "border-primary bg-primary text-primary-foreground shadow-glow"
              : "border-border hover:bg-muted hover:border-primary/40"
          }`}
        >
          Preserve as literal text
        </button>
      </div>
    </div>
  );
}
