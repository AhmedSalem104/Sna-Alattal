/**
 * Parse images field from database - handles both array and JSON string formats.
 * Some products may have images stored as double-escaped JSON strings instead of arrays.
 */
export function parseImages(images: unknown): string[] {
  if (Array.isArray(images)) return images;
  if (typeof images === 'string') {
    try {
      const parsed = JSON.parse(images);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
}
