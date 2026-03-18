"use client";

import { Slider } from "@/components/ui/slider";

interface QualitySliderProps {
  value: number;
  onChange: (value: number) => void;
}

export function QualitySlider({ value, onChange }: QualitySliderProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Quality
        </label>
        <span className={`font-mono text-xs ${
          value >= 80 ? "text-green-500" : value >= 40 ? "text-amber-500" : "text-red-500"
        }`}>{value}%</span>
      </div>
      <Slider
        value={value}
        onValueChange={(val: number | readonly number[]) => {
          onChange(Array.isArray(val) ? val[0] : val);
        }}
        min={1}
        max={100}
        step={1}
      />
      <p className="text-xs text-muted-foreground">
        Lower = smaller file, higher = better quality
      </p>
    </div>
  );
}
