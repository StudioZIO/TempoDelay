import { Analytics } from '@vercel/analytics/react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Description } from './components/Description';
import { InteractiveVisualizer } from './components/InteractiveVisualizer';
import { ParameterGuide } from './components/ParameterGuide';
import { Features } from './components/Features';
import { FormatBadges } from './components/FormatBadges';
import { SystemRequirements } from './components/SystemRequirements';
import { VersionHistory } from './components/VersionHistory';
import { InstallationGuide } from './components/InstallationGuide';
import { FAQ } from './components/FAQ';
import { DownloadPlaceholder } from './components/DownloadPlaceholder';
import { SupportContact } from './components/SupportContact';
import { Footer } from './components/Footer';

export const App = () => {
  return (
    <>
      <div className="min-h-screen bg-[#14161A] text-[#E2E8F0]">
        <Header />
        <main id="main-content">
          <Hero />
          <Description />
          <InteractiveVisualizer />
          <ParameterGuide />
          <Features />
          <FormatBadges />
          <SystemRequirements />
          <VersionHistory />
          <InstallationGuide />
          <FAQ />
          <DownloadPlaceholder />
          <SupportContact />
        </main>
        <Footer />
      </div>
      <Analytics />
    </>
  );
};

export default App;
