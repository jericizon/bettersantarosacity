// Enum values like 'public-services' read as 'Public services' in copy.
// Single-word Title-Case values (e.g. PlaceCategoryEnum) pass through unchanged.
export function humanizeLabel(value: string): string {
  const words = value.replaceAll('-', ' ')
  return words.charAt(0).toUpperCase() + words.slice(1)
}
