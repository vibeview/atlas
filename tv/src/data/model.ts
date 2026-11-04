import data from './destinations.json';

export type RowId = 'popular' | 'cities' | 'coast' | 'mountains';

export type Experience = { title: string; line: string; icon: string };

export type Destination = {
  slug: string;
  name: string;
  country: string;
  tagline: string;
  description: string;
  tags: string[];
  bestMonths: string;
  timeZone: string;
  airport: string;
  rating: number;
  experiences: Experience[];
};

export type Row = { id: RowId; title: string; slugs: string[] };

export const destinations = data.destinations as Destination[];
export const rows = data.rows as Row[];
export const bySlug: Record<string, Destination> = Object.fromEntries(destinations.map((d) => [d.slug, d]));
