"use client";

import { ArrowLeftRight } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  return (
    <header className="sticky top-0 z-50 h-14 border-b border-border/50 bg-background/80 glass">
      <div className="mx-auto flex h-full max-w-4xl items-center justify-between px-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15">
            <ArrowLeftRight className="h-4 w-4 text-primary" />
          </div>
          <span className="text-base font-semibold tracking-tight">
            FileForge
          </span>
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
}
