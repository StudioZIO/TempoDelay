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
 */
export const Logo = ({ product, size = 'md', href = '#main-content' }: LogoProps) => (
  <a href={href} className={size === 'sm' ? 'logo logo--sm' : 'logo'} aria-label={`StudioZIO${product ? ` ${product}` : ''}`}>
    <span className="logo-mark" aria-hidden="true">
      <svg viewBox="0 0 20 20" fill="none" role="presentation" focusable="false">
        <path
          d="M1 10c1.6-6 3.2-6 4.8 0s3.2 6 4.8 0 3.2-6 4.8 0"
          stroke="var(--primary)"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <path d="M18.6 10h.4" stroke="var(--muted-foreground)" strokeWidth="1.6" strokeLinecap="round" />
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
