import { renderToString } from 'react-dom/server';
import App from './App';

/**
 * Renders the home route to static HTML at build time so the first paint does
 * not wait for the bundle to download, parse and execute. Only "/" is
 * prerendered: the output contract permits exactly one HTML document, and the
 * home route is the one every visitor and every crawler lands on.
 */
export const render = () => renderToString(<App />);
