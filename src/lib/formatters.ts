export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatPct(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`;
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-ZA').format(value);
}

export function formatPoints(value: number): string {
  return value.toFixed(2);
}

export function sanitizeText(input: string): string {
  return input.replace(/[<>&"'`]/g, '').trim().slice(0, 500);
}

export function sanitizePositiveNumber(input: unknown): number {
  const n = Number(input);
  if (!isFinite(n) || isNaN(n)) return 0;
  return Math.max(0, n);
}
