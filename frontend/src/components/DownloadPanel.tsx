"use client";

import { Download, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DownloadPanelProps {
  downloadUrl: string;
  filename: string;
  onConvertAgain?: () => void;
}

export function DownloadPanel({
  downloadUrl,
  filename,
  onConvertAgain,
}: DownloadPanelProps) {
  return (
    <div className="flex gap-2">
      <Button
        className="flex-1 bg-primary text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20"
        render={<a href={downloadUrl} download={filename} />}
      >
        <Download className="mr-1.5 h-4 w-4" />
        Download
      </Button>
      {onConvertAgain && (
        <Button variant="outline" onClick={onConvertAgain}>
          <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
          Convert again
        </Button>
      )}
    </div>
  );
}
