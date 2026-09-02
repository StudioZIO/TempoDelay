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

/** The macOS installer, and the release entry it belongs to.

    The button downloads the file itself rather than opening the release page:
    a visitor who wants the plug-in should get the plug-in, not a page about it.
    The release entry stays linked beside it, because that is where the build's
    notes and its published checksum live, and because a direct asset link is
    the one that breaks if a release is ever re-cut — if this file 404s, the
    entry below is still the way in. Both point at the central release
    registry, which holds the authoritative build; the asset in the TempoDelay
    repository is marked superseded by its own release notes.

    Change these together with the SHA-256 on the download panel. */
export const MACOS_RELEASE_URL =
  'https://github.com/StudioZIO/StudioZIO-Releases/releases/tag/tempo-delay-v4.0.1-RC1';
export const MACOS_DOWNLOAD_URL =
  'https://github.com/StudioZIO/StudioZIO-Releases/releases/download/tempo-delay-v4.0.1-RC1/StudioZIOTempoDelay-v4.0.1-RC1-macOS-arm64.pkg';
