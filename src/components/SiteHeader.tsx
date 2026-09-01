import { Logo } from './Logo';
import { NAV_LINKS } from '../data/navigation';

/**
 * Sticky header: hairline bottom border, translucent background with a blur,
 * logo left, exactly four mono uppercase links right. No dropdown, no submenu.
 */
export const SiteHeader = () => (
  <header className="site-header">
    <div className="shell bar">
      <Logo product="Tempo Delay" />

      <nav className="nav-links" aria-label="StudioZIO properties">
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
    </div>
  </header>
);
