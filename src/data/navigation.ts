export type NavLink = {
  label: string;
  href: string;
  /** True for the property this site represents. */
  active?: boolean;
};

/** One flat link per StudioZIO property, then the shared support desk. No
    submenus. Contact is the same fourth entry on all three sites and points at
    the one form, rather than each site keeping its own. */
export const NAV_LINKS: NavLink[] = [
  { label: 'Hub', href: 'https://studiozio.vercel.app/' },
  { label: 'Mastering Suite', href: 'https://studioziomasteringsuite.vercel.app/' },
  { label: 'Tempo Delay', href: '/', active: true },
  { label: 'Contact', href: 'https://studiozio.vercel.app/contact' },
];

export const MASTERING_SUITE_URL = 'https://studioziomasteringsuite.vercel.app/';
