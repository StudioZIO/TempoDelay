import React from 'react';
import { ErrorBoundary } from './components/ErrorBoundary';
import { SEO } from './components/SEO';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Description } from './components/Description';
import { ParameterGuide } from './components/ParameterGuide';
import { InteractiveVisualizer } from './components/InteractiveVisualizer';
import { Features } from './components/Features';
import { FormatBadges } from './components/FormatBadges';
import { SystemRequirements } from './components/SystemRequirements';
import { VersionHistory } from './components/VersionHistory';
import { InstallationGuide } from './components/InstallationGuide';
import { FAQ } from './components/FAQ';
import { DownloadPlaceholder } from './components/DownloadPlaceholder';
import { SupportContact } from './components/SupportContact';
import { Footer } from './components/Footer';

export const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <SEO />
      <div className="min-h-screen bg-[#14161A] text-[#E2E8F0] font-sans antialiased selection:bg-[#22D3EE] selection:text-[#14161A]">
        {/* Header */}
        <Header />

        {/* Main Page Container */}
        <main id="main-content">
          {/* 1. Hero Section */}
          <Hero />

          {/* 2. Plugin Description */}
          <Description />

          {/* Educational Delay Routing Visualizer */}
          <InteractiveVisualizer />

          {/* 3. Interactive Parameter Guide */}
          <ParameterGuide />

          {/* 4. Feature Overview */}
          <Features />

          {/* 5. Format Badges */}
          <FormatBadges />

          {/* 6. System Requirements */}
          <SystemRequirements />

          {/* 7. Version History */}
          <VersionHistory />

          {/* 8. Installation Guide */}
          <InstallationGuide />

          {/* 9. FAQ */}
          <FAQ />

          {/* 10. Download Section */}
          <DownloadPlaceholder />

          {/* 11. Support / Contact */}
          <SupportContact />
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </ErrorBoundary>
  );
};

export default App;
