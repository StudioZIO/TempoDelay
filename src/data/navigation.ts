export type NavLink = {
  label: string;
  href: string;
  /** True for the property this site represents. */
  active?: boolean;
};

/** One flat Products bridge, one link per StudioZIO property, then the shared
    support desk. No submenus. Contact points at the one form rather than each
    site keeping its own. */
export const NAV_LINKS: NavLink[] = [
  { label: 'Hub', href: 'https://studiozio.vercel.app/' },
  { label: 'Products', href: 'https://studiozio.vercel.app/#catalog-title' },
  { label: 'Mastering Suite', href: 'https://studioziomasteringsuite.vercel.app/' },
  { label: 'Tempo Delay', href: '/', active: true },
  { label: 'Notes', href: 'https://studiozio.vercel.app/notes/' },
  { label: 'Contact', href: 'https://studiozio.vercel.app/contact/' },
];

/** The footer carries the estate's full index, identical on all four
    surfaces, so that any menu is reachable from any site. The header does not:
    the press kit is for journalists, who go looking for it, and ZIO is the
    artist surface rather than a product — neither belongs in a six-item
    product header.

    This list is shared state. It is the same eight entries on the hub, the
    Mastering Suite site and here, and changing it means changing it
    everywhere in the same commit; a footer that differs between properties is
    how a page ends up with nothing linking to it. */
export const FOOTER_LINKS: NavLink[] = [
  ...NAV_LINKS,
  { label: 'Press kit', href: 'https://studiozio.vercel.app/press/' },
  { label: 'ZIO', href: 'https://zio-audio.vercel.app/' },
];

export const MASTERING_SUITE_URL = 'https://studioziomasteringsuite.vercel.app/';
export const INSTAGRAM_URL = 'https://www.instagram.com/studio_zio_plugin/';
export const KVR_TEMPO_DELAY_URL =
  'https://www.kvraudio.com/product/studiozio-tempo-delay-by-studiozio';

/** The macOS installer.

    The button downloads the file itself rather than opening a release page: a
    visitor who wants the plug-in should get the plug-in, not a page about it,
    and nothing on this site sends anyone to GitHub to look for an asset. The
    URL points at the central release registry, which holds the authoritative
    build; the asset in the TempoDelay repository is marked superseded by its
    own release notes.

    4.0.1 is final and the artifact is named for it. The release it was cut as,
    tempo-delay-v4.0.1-RC1, is still published and still downloadable — its
    asset is byte-identical to this one, so nothing that already links to it
    breaks — but this is the one the site points at.

    Change this together with the SHA-256 on the download panel and the JSON-LD
    downloadUrl in index.html; verify_dist.mjs fails the build if the URL and
    the JSON-LD disagree. The release entry, for maintainers, is the same path
    with `/releases/tag/`. */
export const MACOS_DOWNLOAD_URL =
  'https://github.com/StudioZIO/StudioZIO-Releases/releases/download/tempo-delay-v4.0.1-aax-2026.09.10/StudioZIOTempoDelay-v4.0.1-macOS-arm64-AAX.pkg';
