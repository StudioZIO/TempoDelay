import { Architecture } from './components/Architecture';
import { Download } from './components/Download';
import { ErrorBoundary } from './components/ErrorBoundary';
import { HearIt } from './components/HearIt';
import { Hero } from './components/Hero';
import { InteractiveVisualizer } from './components/InteractiveVisualizer';
import { ParameterGuide } from './components/ParameterGuide';
import { SiteFooter } from './components/SiteFooter';
import { SiteHeader } from './components/SiteHeader';
import { Specification } from './components/Specification';
import { TempoDelayInterface } from './components/TempoDelayInterface';

/* One document, one route. The client-side router existed for /contact, which
   now lives on the hub with the other two sites' support links; with nothing
   left to route, the link interception, the focus-and-scroll reset and the
   title switching go with it. The title comes from index.html again. */
export const App = () => (
  <ErrorBoundary>
    <SiteHeader />
    <main id="main-content" tabIndex={-1}>
      <Hero />
      <HearIt />
      <TempoDelayInterface />
      <Architecture />
      <InteractiveVisualizer />
      <ParameterGuide />
      <Specification />
      <Download />
    </main>
    <SiteFooter />
  </ErrorBoundary>
);

export default App;
