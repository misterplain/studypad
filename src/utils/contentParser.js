// Parse a content string that mixes prose and fenced code blocks into segments
// Supported code fences: ```lang\n...code...\n```
// Returns: Array<{ type: 'text' | 'code', text?: string, code?: string, language?: string }>

export function parseMixedContent(input) {
  if (!input) return [];
  const segments = [];
  // Support both ``` and ~~~ style fences
  const fenceRe = /(```|~~~)(\w+)?\n([\s\S]*?)\1/g;
  let lastIndex = 0;
  let match;

  while ((match = fenceRe.exec(input)) !== null) {
    const [full, _fence, lang, code] = match;
    const start = match.index;
    const end = start + full.length;

    if (start > lastIndex) {
      segments.push({ type: "text", text: input.slice(lastIndex, start) });
    }

    segments.push({
      type: "code",
      code: code.replace(/\n$/, ""),
      language: lang,
    });
    lastIndex = end;
  }

  if (lastIndex < input.length) {
    segments.push({ type: "text", text: input.slice(lastIndex) });
  }

  // Merge adjacent text segments
  const merged = [];
  for (const seg of segments) {
    const prev = merged[merged.length - 1];
    if (prev && prev.type === "text" && seg.type === "text") {
      prev.text += seg.text;
    } else {
      merged.push(seg);
    }
  }

  return merged;
}
