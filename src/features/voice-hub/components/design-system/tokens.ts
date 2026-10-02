export function hexToRgb(hex: string | null | undefined): { r: number; g: number; b: number } | null {
  if (!hex || typeof hex !== 'string') return null;
  const clean = hex.trim().replace(/^#/, '');
  if (clean.length !== 6) return null;
  const num = parseInt(clean, 16);
  if (isNaN(num)) return null;
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

export function relativeLuminance(hex: string | null | undefined): number {
  const rgb = hexToRgb(hex);
  if (!rgb) return 0;
  const sRGB = [rgb.r / 255, rgb.g / 255, rgb.b / 255];
  const linear = sRGB.map((c) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)));
  return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
}

export function contrastRatio(hex1: string, hex2: string): number {
  const l1 = relativeLuminance(hex1);
  const l2 = relativeLuminance(hex2);
  const max = Math.max(l1, l2);
  const min = Math.min(l1, l2);
  return (max + 0.05) / (min + 0.05);
}

export function getAccessibleTextOnBrand(brandHex: string | null | undefined): '#ffffff' | '#000000' {
  if (!brandHex) return '#ffffff';
  const ratioWhite = contrastRatio(brandHex, '#ffffff');
  const ratioBlack = contrastRatio(brandHex, '#000000');
  return ratioWhite >= ratioBlack ? '#ffffff' : '#000000';
}

export function getAccessibleBrandForeground(brandHex: string | null | undefined): string {
  return getAccessibleTextOnBrand(brandHex);
}

export const colors = {
  brand: '#ff5618',
  slate: {
    50: '#f8fafc',
    100: '#f1f5f9',
    800: '#1e293b',
    900: '#0f172a',
  },
};
