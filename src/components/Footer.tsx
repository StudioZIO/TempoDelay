export const Footer = () => {
  return (
    <footer className="bg-[#14161A] text-gray-400 py-12 border-t border-gray-800 text-center text-xs space-y-4">
      <p>© 2026 StudioZIO. All rights reserved. Native AU, VST3 & Standalone Stereo Delay Audio Plugin.</p>
      <div className="flex justify-center space-x-4">
        <a href="#overview" className="hover:text-[#22D3EE]">Overview</a>
        <a href="#routing-visualizer" className="hover:text-[#22D3EE]">Routing</a>
        <a href="#parameters" className="hover:text-[#22D3EE]">Parameters</a>
        <a href="#downloads" className="hover:text-[#22D3EE]">Downloads</a>
        <a href="#support" className="hover:text-[#22D3EE]">Support</a>
      </div>
    </footer>
  );
};
