"use client";

interface MarkdownToggleProps {
  value: "interpret" | "literal";
  onChange: (value: "interpret" | "literal") => void;
}

export function MarkdownToggle({ value, onChange }: MarkdownToggleProps) {
  const chipClass = (active: boolean) =>
    `rounded-md border px-3 py-1.5 text-xs font-medium transition-colors ${
      active
        ? "bg-primary/15 border-primary text-primary"
        : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
    }`;

  return (
    <div className="space-y-2">
      <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        Markdown handling
      </label>
      <div className="flex gap-2">
        <button className={chipClass(value === "interpret")} onClick={() => onChange("interpret")}>
          Interpret formatting
        </button>
        <button className={chipClass(value === "literal")} onClick={() => onChange("literal")}>
          Preserve as literal text
        </button>
      </div>
    </div>
  );
}
