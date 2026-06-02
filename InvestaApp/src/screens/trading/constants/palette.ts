// Fixed sector color palette for consistent charts and badges
// Each sector maps to a stable color so the same sector always shows the same color
// across renders and screens.
export const SECTOR_COLORS: Record<string, string> = {
  'Technology': '#3B82F6',
  'Banking': '#10B981',
  'Oil & Gas': '#F59E0B',
  'Consumer Goods': '#EF4444',
  'Healthcare': '#8B5CF6',
  'Automobile': '#EC4899',
  'Telecom': '#06B6D4',
  'Financial Services': '#14B8A6',
  'FMCG': '#F97316',
  'Pharmaceuticals': '#A855F7',
  'Metals': '#64748B',
  'Real Estate': '#0EA5E9',
  'Power': '#84CC16',
  'Cement': '#737373',
  'IT Services': '#3B82F6',
  'Private Banks': '#10B981',
  'Refineries': '#F59E0B',
  'Other': '#6B7280',
};

// Fallback palette for sectors not in the map (use index-based)
export const SECTOR_COLOR_FALLBACK: string[] = [
  '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
  '#EC4899', '#06B6D4', '#6B7280', '#14B8A6', '#F97316',
  '#A855F7', '#0EA5E9', '#84CC16',
];

/**
 * Returns a stable color for a sector.
 * If the sector is in the map, returns that color.
 * Otherwise returns a color from the fallback palette by index.
 */
export function colorForSector(sector: string, index: number = 0): string {
  if (sector && SECTOR_COLORS[sector]) {
    return SECTOR_COLORS[sector];
  }
  return SECTOR_COLOR_FALLBACK[index % SECTOR_COLOR_FALLBACK.length];
}
