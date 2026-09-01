import { useEffect, useState } from 'react';

/**
 * The security contract in scripts/verify_dist.mjs allows exactly one HTML
 * file in the output, so /contact cannot be a second document. vercel.json
 * already rewrites every path to index.html, so the route is resolved here
 * instead — a real URL, one document, no router dependency.
 */
export type Route = 'home' | 'contact';

export const CONTACT_PATH = '/contact';

const TITLES: Record<Route, string> = {
  home: 'Tempo Delay - StudioZIO Host-Synced Stereo Delay',
  contact: 'Support and contact - StudioZIO Tempo Delay',
};

export const routeFor = (pathname: string): Route =>
  pathname.replace(/\/+$/, '').toLowerCase() === CONTACT_PATH ? 'contact' : 'home';

/** True for links this app resolves itself rather than handing to the browser. */
export const isInternalHref = (href: string) => href === CONTACT_PATH || href === '/';

export const useRoute = (): Route => {
  const [route, setRoute] = useState<Route>(() =>
    typeof window === 'undefined' ? 'home' : routeFor(window.location.pathname),
  );

  useEffect(() => {
    const sync = () => setRoute(routeFor(window.location.pathname));
    window.addEventListener('popstate', sync);
    window.addEventListener('studiozio:navigate', sync);
    return () => {
      window.removeEventListener('popstate', sync);
      window.removeEventListener('studiozio:navigate', sync);
    };
  }, []);

  useEffect(() => {
    document.title = TITLES[route];
  }, [route]);

  return route;
};

/** Push a route without a reload, then let the app re-render and refocus. */
export const navigate = (href: string) => {
  if (window.location.pathname + window.location.hash === href) return;
  window.history.pushState({}, '', href);
  window.dispatchEvent(new Event('studiozio:navigate'));
};
