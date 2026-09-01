import { useEffect, useRef, type MouseEvent } from 'react';
import { Architecture } from './components/Architecture';
import { ContactPage } from './components/ContactPage';
import { Download } from './components/Download';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Hero } from './components/Hero';
import { InteractiveVisualizer } from './components/InteractiveVisualizer';
import { ParameterGuide } from './components/ParameterGuide';
import { SiteFooter } from './components/SiteFooter';
import { SiteHeader } from './components/SiteHeader';
import { Specification } from './components/Specification';
import { isInternalHref, navigate, useRoute } from './router';

export const App = () => {
  const route = useRoute();
  const main = useRef<HTMLElement>(null);
  const firstRender = useRef(true);

  // A client-side route change moves neither focus nor scroll on its own, so a
  // screen reader would stay parked where the previous page left it.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    window.scrollTo({ top: 0, behavior: 'auto' });
    main.current?.focus();
  }, [route]);

  // Plain <a href="/contact"> stays a real link — crawlable, middle-clickable,
  // and it still works if this handler never runs. Only a plain left click on
  // an internal href is taken over.
  const onClick = (event: MouseEvent<HTMLDivElement>) => {
    if (event.defaultPrevented || event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    const anchor = (event.target as HTMLElement).closest?.('a');
    if (!anchor) return;

    const href = anchor.getAttribute('href');
    if (!href || anchor.hasAttribute('download') || anchor.target === '_blank') return;
    if (!isInternalHref(href)) return;

    event.preventDefault();
    navigate(href);
  };

  return (
    <ErrorBoundary>
      <div onClick={onClick}>
        <SiteHeader />
        <main id="main-content" ref={main} tabIndex={-1}>
          {route === 'contact' ? (
            <ContactPage />
          ) : (
            <>
              <Hero />
              <Architecture />
              <InteractiveVisualizer />
              <ParameterGuide />
              <Specification />
              <Download />
            </>
          )}
        </main>
        <SiteFooter />
      </div>
    </ErrorBoundary>
  );
};

export default App;
