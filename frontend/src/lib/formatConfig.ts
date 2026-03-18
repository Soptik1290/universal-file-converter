/**
 * Format popularity configuration for the "+N more" chip pattern.
 * Top formats are shown directly, rest go into a "more" dialog.
 */

const POPULAR_FORMATS: Record<string, string[]> = {
  image: ["jpg", "png", "webp", "heic", "gif"],
  document: ["pdf", "docx", "html", "md", "txt"],
  data: ["csv", "xlsx", "json", "pdf", "html"],
  // These categories typically have fewer formats — show all
  presentation: [],
  ocr: [],
};

export function getPopularAndOther(
  availableOutputs: string[],
  category: string
): { popular: string[]; other: string[] } {
  const popularList = POPULAR_FORMATS[category];

  // If no popular list defined or empty, show all formats directly
  if (!popularList || popularList.length === 0) {
    return { popular: availableOutputs, other: [] };
  }

  const popular: string[] = [];
  const other: string[] = [];

  // Maintain popularity order for popular formats
  for (const fmt of popularList) {
    if (availableOutputs.includes(fmt)) {
      popular.push(fmt);
    }
  }

  // Rest go to "other" in their original order
  for (const fmt of availableOutputs) {
    if (!popularList.includes(fmt)) {
      other.push(fmt);
    }
  }

  return { popular, other };
}
