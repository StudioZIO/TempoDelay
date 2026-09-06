import { Logo } from './Logo';
import { INSTAGRAM_URL, KVR_TEMPO_DELAY_URL, NAV_LINKS } from '../data/navigation';

export const SiteFooter = () => (
  <footer className="site-footer">
    <div className="shell inner">
      <div className="footer-brand">
        <Logo size="sm" />
        <a
          className="social-link"
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram — studio_zio_plugin"
        >
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.8" />
            <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.8" />
            <circle cx="17.4" cy="6.7" r="1.1" fill="currentColor" />
          </svg>
        </a>
        <a
          className="kvr-link"
          href={KVR_TEMPO_DELAY_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Tempo Delay — KVR Audio"
          title="Tempo Delay — KVR Audio"
        >
          <svg viewBox="0 0 42 22" aria-hidden="true">
            <text x="1" y="16" fill="currentColor" fontFamily="monospace" fontSize="13" fontWeight="700" letterSpacing="1">KVR</text>
          </svg>
        </a>
      </div>

      <nav aria-label="StudioZIO properties, footer">
        <ul>
          {NAV_LINKS.map((link) => (
            <li key={link.label}>
              <a href={link.href} {...(link.active ? { 'aria-current': 'page' as const } : {})}>
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <p className="copy">© 2026 StudioZIO</p>
    </div>
  </footer>
);
