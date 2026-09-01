import { createRoot, hydrateRoot } from 'react-dom/client';
import App from './App';
import './styles/global.css';

const rootElement = document.getElementById('root');

if (rootElement) {
  // index.html ships the home markup prerendered, and home is now the only
  // route, so the document always describes the tree React is about to render.
  // Hydrate it rather than throwing it away and rendering the same thing again.
  if (rootElement.childElementCount > 0) {
    hydrateRoot(rootElement, <App />);
  } else {
    createRoot(rootElement).render(<App />);
  }
}
