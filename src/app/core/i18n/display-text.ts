export function displayText(value: string | number | boolean | null | undefined): string {
  return String(value ?? '')
    .replace(/\s*;\s*/g, ', ')
    .replace(/[\u2013\u2014]/g, '-');
}
