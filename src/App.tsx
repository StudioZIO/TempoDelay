import { Architecture } from './components/Architecture';
import { Download } from './components/Download';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Hero } from './components/Hero';
import { InteractiveVisualizer } from './components/InteractiveVisualizer';
import { ParameterGuide } from './components/ParameterGuide';
import { SiteFooter } from './components/SiteFooter';
import { SiteHeader } from './components/SiteHeader';
import { Specification } from './components/Specification';

export const App = () => {
  return (
    <ErrorBoundary>
      <SiteHeader />
      <main id="main-content">
        <Hero />
        <Architecture />
        <InteractiveVisualizer />
        <ParameterGuide />
        <Specification />
        <Download />
      </main>
      <SiteFooter />
    </ErrorBoundary>
  );
};

export default App;
