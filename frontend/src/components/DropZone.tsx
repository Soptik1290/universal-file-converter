"use client";

import { useCallback, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Upload } from "lucide-react";

interface DropZoneProps {
  onFilesAdded: (files: FileList | File[]) => void;
  compact?: boolean;
}

export function DropZone({ onFilesAdded, compact }: DropZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      if (e.dataTransfer.files.length > 0) {
        onFilesAdded(e.dataTransfer.files);
      }
    },
    [onFilesAdded]
  );

  const handleClick = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        onFilesAdded(e.target.files);
        e.target.value = "";
      }
    },
    [onFilesAdded]
  );

  return (
    <motion.div
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDragEnter={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      animate={isDragOver ? { scale: 1.02 } : { scale: 1 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={`relative flex cursor-pointer flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed bg-card transition-all duration-200 ${
        compact ? "min-h-[120px] p-6" : "min-h-[200px] p-12"
      } ${
        isDragOver
          ? "border-primary bg-primary/5 shadow-glow"
          : "border-border hover:border-primary/40 hover:shadow-glow"
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        multiple
        className="hidden"
        onChange={handleChange}
      />

      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 3, ease: "easeInOut", repeat: Infinity }}
        className={`rounded-xl p-3 transition-all duration-200 ${
          isDragOver ? "bg-primary/15" : "bg-muted"
        }`}
      >
        <Upload
          className={`transition-all duration-200 ${
            compact ? "h-5 w-5" : "h-8 w-8"
          } ${isDragOver ? "text-primary scale-110" : "text-muted-foreground"}`}
        />
      </motion.div>

      <div className="text-center">
        <p className="text-sm font-medium">
          {isDragOver ? "Release to upload" : "Drop files here or click to browse"}
        </p>
        {!compact && (
          <p className="mt-1 text-xs text-muted-foreground">
            Images, documents, spreadsheets, and more
          </p>
        )}
      </div>

      {!compact && (
        <button
          type="button"
          className="rounded-md border border-primary/30 px-3 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary/10"
          onClick={(e) => {
            e.stopPropagation();
            inputRef.current?.click();
          }}
        >
          Browse files
        </button>
      )}
    </motion.div>
  );
}
