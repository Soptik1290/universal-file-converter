"use client";

import { Switch } from "@/components/ui/switch";

interface ResizeConfig {
  width?: number;
  height?: number;
  preset?: string;
  lockAspect?: boolean;
}

interface ResizeOptionsProps {
  resize: ResizeConfig | undefined;
  onChange: (resize: ResizeConfig | undefined) => void;
  outputFormat?: string;
}

const PRESETS = [
  { key: "thumb", label: "Thumbnail (150px)", value: 150 },
  { key: "small", label: "Small (480px)", value: 480 },
  { key: "medium", label: "Medium (1024px)", value: 1024 },
  { key: "hd", label: "HD (1920px)", value: 1920 },
  { key: "4k", label: "4K (3840px)", value: 3840 },
];

const ICO_PRESETS = [
  { key: "ico16", label: "16x16", value: 16 },
  { key: "ico32", label: "32x32", value: 32 },
  { key: "ico48", label: "48x48", value: 48 },
  { key: "ico256", label: "256x256", value: 256 },
];

export function ResizeOptions({ resize, onChange, outputFormat }: ResizeOptionsProps) {
  const presets = outputFormat === "ico" ? ICO_PRESETS : PRESETS;
  const activePreset = resize?.preset;

  const chipClass = (active: boolean) =>
    `rounded-md border px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
      active
        ? "bg-primary/15 border-primary text-primary"
        : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
    }`;

  return (
    <div className="space-y-3">
      <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        Resize
      </label>

      <div className="flex flex-wrap gap-1.5">
        <button className={chipClass(!resize)} onClick={() => onChange(undefined)}>
          Original
        </button>
        {presets.map((p) => (
          <button
            key={p.key}
            className={chipClass(activePreset === p.key)}
            onClick={() =>
              onChange({
                width: p.value,
                height: outputFormat === "ico" ? p.value : undefined,
                preset: p.key,
                lockAspect: true,
              })
            }
          >
            {p.label}
          </button>
        ))}
        <button
          className={chipClass(activePreset === "custom")}
          onClick={() =>
            onChange({
              width: resize?.width || 800,
              height: resize?.height || 600,
              preset: "custom",
              lockAspect: resize?.lockAspect ?? true,
            })
          }
        >
          Custom
        </button>
      </div>

      {activePreset === "custom" && (
        <div className="flex items-center gap-3">
          <input
            type="number"
            placeholder="Width"
            value={resize?.width ?? ""}
            onChange={(e) =>
              onChange({
                ...resize,
                width: Number(e.target.value) || undefined,
                preset: "custom",
              })
            }
            className="w-24 rounded-lg border border-border bg-background px-2 py-1.5 text-sm transition-colors focus:border-primary focus:ring-1 focus:ring-primary/30 focus:outline-none"
          />
          <span className="text-xs text-muted-foreground">x</span>
          <input
            type="number"
            placeholder="Height"
            value={resize?.height ?? ""}
            onChange={(e) =>
              onChange({
                ...resize,
                height: Number(e.target.value) || undefined,
                preset: "custom",
              })
            }
            className="w-24 rounded-lg border border-border bg-background px-2 py-1.5 text-sm transition-colors focus:border-primary focus:ring-1 focus:ring-primary/30 focus:outline-none"
          />
          <div className="flex items-center gap-1.5">
            <Switch
              checked={resize?.lockAspect ?? true}
              onCheckedChange={(lockAspect) =>
                onChange({ ...resize, lockAspect, preset: "custom" })
              }
            />
            <label className="text-xs text-muted-foreground">Lock</label>
          </div>
        </div>
      )}
    </div>
  );
}
