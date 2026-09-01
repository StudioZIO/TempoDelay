import { Logo } from './Logo';
import { NAV_LINKS } from '../data/navigation';

const navItems = () =>
  NAV_LINKS.map((link) => (
    <li key={link.label}>
      <a href={link.href} {...(link.active ? { 'aria-current': 'page' as const } : {})}>
        {link.label}
      </a>
    </li>
  ));

/**
 * Sticky header: hairline bottom border, translucent background with a blur,
 * logo left, four mono uppercase links right.
 *
 * Below the fold-out width the links collapse into a native disclosure rather
 * than wrapping onto a second row, which is what they did once Contact made
 * them four. It is the same compact menu the hub and the Mastering Suite site
 * use, and it needs no JavaScript: <details> carries the open state itself.
 */
export const SiteHeader = () => (
  <header className="site-header">
    <div className="shell bar">
      <Logo product="Tempo Delay" />

      <nav className="nav-links" aria-label="StudioZIO properties">
        <ul>{navItems()}</ul>
      </nav>

      <details className="nav-compact">
        <summary aria-label="Menu" aria-controls="compact-menu">
          <span className="open" aria-hidden="true">≡</span>
          <span className="shut" aria-hidden="true">×</span>
        </summary>
        <nav className="panel" id="compact-menu" aria-label="StudioZIO properties, compact menu">
          <ul>{navItems()}</ul>
        </nav>
      </details>
    </div>
  </header>
);
