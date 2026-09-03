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
    own release notes.

    4.0.1 is final — the site says "Available now" and the spec table says
    4.0.1 — but the published artifact is still named for the release candidate
    it was cut as. That is a packaging label lagging behind the decision, not a
    different binary, and it is the one thing on this page that still reads RC1.
    When the release is re-tagged without the suffix, this URL, the SHA-256 on
    the download panel and the JSON-LD downloadUrl in index.html all change
    together; verify_dist.mjs fails the build if the URL and the JSON-LD
    disagree. Its release entry, for maintainers, is the same path with
    `/releases/tag/`. */
export const MACOS_DOWNLOAD_URL =
  'https://github.com/StudioZIO/StudioZIO-Releases/releases/download/tempo-delay-v4.0.1-RC1/StudioZIOTempoDelay-v4.0.1-RC1-macOS-arm64.pkg';
