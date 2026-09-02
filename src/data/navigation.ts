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

/** The macOS installer.

    The button downloads the file itself rather than opening a release page: a
    visitor who wants the plug-in should get the plug-in, not a page about it,
    and nothing on this site sends anyone to GitHub to look for an asset. The
    URL points at the central release registry, which holds the authoritative
    build; the asset in the TempoDelay repository is marked superseded by its
    own release notes. Its release entry, for maintainers, is the same path with
    `/releases/tag/tempo-delay-v4.0.1-RC1`.

    Change this together with the SHA-256 on the download panel, and with the
    JSON-LD downloadUrl in index.html — verify_dist.mjs fails the build if the
    two disagree. */
export const MACOS_DOWNLOAD_URL =
  'https://github.com/StudioZIO/StudioZIO-Releases/releases/download/tempo-delay-v4.0.1-RC1/StudioZIOTempoDelay-v4.0.1-RC1-macOS-arm64.pkg';
