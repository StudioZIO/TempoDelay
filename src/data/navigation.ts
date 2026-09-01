export type NavLink = {
  label: string;
  href: string;
  /** True for the property this site represents. */
  active?: boolean;
};

/** One flat link per StudioZIO property. No submenus. */
export const NAV_LINKS: NavLink[] = [
  { label: 'Hub', href: 'https://studiozio.vercel.app/' },
  { label: 'Mastering Suite', href: 'https://studioziomasteringsuite.vercel.app/' },
  { label: 'Tempo Delay', href: '/', active: true },
];

export const MASTERING_SUITE_URL = 'https://studioziomasteringsuite.vercel.app/';
