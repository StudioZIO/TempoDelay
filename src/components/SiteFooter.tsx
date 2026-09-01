import { Logo } from './Logo';
import { NAV_LINKS } from '../data/navigation';
import { CONTACT_PATH } from '../router';

export const SiteFooter = () => (
  <footer className="site-footer">
    <div className="shell inner">
      <Logo size="sm" />

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

      {/* Deliberately outside the four-link property nav above: support is a
          page on this site, not a sibling property. */}
      <nav aria-label="This site, footer">
        <ul>
          <li>
            <a href={CONTACT_PATH}>Support</a>
          </li>
        </ul>
      </nav>

      <p className="copy">© 2026 StudioZIO</p>
    </div>
  </footer>
);
