/**
 * Format date to MM/DD/YYYY format
 */
export function formatDate(date?: Date): string {
  const d = date || new Date();
  const month = (d.getMonth() + 1).toString().padStart(2, "0");
  const day = d.getDate().toString().padStart(2, "0");
  const year = d.getFullYear();
  return `${month}/${day}/${year}`;
}

/**
 * Get current date in MM/DD/YYYY format
 */
export function getCurrentDate(): string {
  return formatDate(new Date());
}
