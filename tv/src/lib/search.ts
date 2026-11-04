type Searchable = { name: string; country: string };

/** Lower case, accents removed: "Hội An" → "hoi an". */
export function fold(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .trim();
}

/** Destinations whose name or country contains the query, in their original order. */
export function searchDestinations<T extends Searchable>(all: T[], query: string): T[] {
  const q = fold(query);
  if (!q) return [];
  return all.filter((d) => fold(d.name).includes(q) || fold(d.country).includes(q));
}
