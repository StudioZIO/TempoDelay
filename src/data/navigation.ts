export type NavLink = {
  label: string;
  href: string;
  /** True for the property this site represents. */
  active?: boolean;
};

/** The estate's two lists, identical on every StudioZIO surface.

    The header is the shared desks only. The three product sites left it: with
    the search box beside them, eight entries folded onto a second row, and the
    owner's call was that the products belong behind Products, where the
    catalogue describes them. Anyone who knows a product name types it in the
    box.

    Products points at /products/, the catalogue page itself, not at the home
    page's catalogue section. The catalogue is where every product has a card,
    and it is the page the hub's own tests keep linked from every header and
    footer; sending this site's visitors to a section of a different page left
    two of the four properties pointing somewhere else.

    The footer is the shared index minus the product links. It used to repeat
    them, and with three products it would have listed the same destinations
    twice on one screen; the owner asked for the shorter list, and the hub,
    the Mastering Suite site and the MixRack site now all carry it. Changing
    either list means changing it on every surface in the same commit — a menu
    that differs between properties is how a page ends up with nothing linking
    to it. */
/** The hub's origin. The wordmark and the two lists all resolve against it,
    so the estate's address is written down once. */
export const HUB_URL = 'https://www.studiozio.tech';
const HUB = HUB_URL;

export const NAV_LINKS: NavLink[] = [
  { label: 'Hub', href: `${HUB}/` },
  { label: 'Products', href: `${HUB}/products/` },
  { label: 'Notes', href: `${HUB}/notes/` },
  { label: 'Community', href: `${HUB}/community/` },
  { label: 'Contact', href: `${HUB}/contact/` }
];

export const FOOTER_LINKS: NavLink[] = [
  { label: 'Hub', href: `${HUB}/` },
  { label: 'Products', href: `${HUB}/products/` },
  { label: 'Notes', href: `${HUB}/notes/` },
  { label: 'Contact', href: `${HUB}/contact/` },
  { label: 'Press kit', href: `${HUB}/press/` },
  { label: 'ZIO', href: 'https://zio-audio.vercel.app/' }
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

    From 4.0.3 the plug-ins, the installer file and the release tag carry one
    version: tempo-delay-v4.0.3 installs StudioZIOTempoDelay-v4.0.3-macOS-arm64.pkg,
    whose plug-ins report 4.0.3. The superseded 4.1.0 and 4.0.1 releases stay
    published and downloadable, so nothing that already links to one breaks;
    this is the build the site points at.

    Change this together with the SHA-256 on the download panel and the JSON-LD
    downloadUrl in index.html; verify_dist.mjs fails the build if the URL and
    the JSON-LD disagree. The release entry, for maintainers, is the same path
    with `/releases/tag/`. */
export const MACOS_DOWNLOAD_URL =
  'https://github.com/StudioZIO/StudioZIO-Releases/releases/download/tempo-delay-v4.0.3/StudioZIOTempoDelay-v4.0.3-macOS-arm64.pkg';
