type LogoProps = {
  /** Optional mono uppercase product suffix, e.g. "Tempo Delay". */
  product?: string;
  /** Compact variant used in the footer. */
  size?: 'md' | 'sm';
  href?: string;
};

/**
 * The single StudioZIO mark: a waveform tile plus the Studio/ZIO wordmark.
 * The retired bar-chart, "Z" and "SZ" tiles must never come back.
 *
 * The path, the 24-unit viewBox and the 2-unit stroke are the same ones the hub
 * and Mastering Suite draw, byte for byte. This site used to draw a smooth sine
 * instead, which read as a second mark when you moved between the properties.
 * The stroke takes currentColor so the tile's colour lives in one CSS rule.
 */
export const Logo = ({ product, size = 'md', href = '#main-content' }: LogoProps) => (
  <a href={href} className={size === 'sm' ? 'logo logo--sm' : 'logo'} aria-label={`StudioZIO${product ? ` ${product}` : ''}`}>
    <span className="logo-mark" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" role="presentation" focusable="false">
        <path
          d="M2 12h3l2.6-7.2L11 19l3-9 2.4 4.4H22"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
    <span className="logo-word">
      Studio<b>ZIO</b>
    </span>
    {/* A real space: the wordmark and the suffix are separate elements, so
        without one the visible text reads "StudioZIOTempo Delay" while the
        accessible name has a space, and the two no longer match. */}
    {product ? <> <span className="logo-suffix">{product}</span></> : null}
  </a>
);
