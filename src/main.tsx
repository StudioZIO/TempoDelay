import { createRoot, hydrateRoot } from 'react-dom/client';
import App from './App';
import './styles/global.css';
import { routeFor } from './router';

const rootElement = document.getElementById('root');

if (rootElement) {
  // index.html ships the home route prerendered. Hydrate it when that is the
  // route being served; on any other route the markup describes a different
  // page, so render from scratch rather than asking React to reconcile two
  // unrelated trees.
  const prerendered = rootElement.childElementCount > 0;
  const isPrerenderedRoute = routeFor(window.location.pathname) === 'home';

  if (prerendered && isPrerenderedRoute) {
    hydrateRoot(rootElement, <App />);
  } else {
    rootElement.replaceChildren();
    createRoot(rootElement).render(<App />);
  }
}
