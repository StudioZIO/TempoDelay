import { useState } from 'react';

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#14161A]/90 border-b border-gray-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <a href="#main-content" className="flex items-center space-x-3 group">
            <div className="w-9 h-9 rounded-xl bg-[#22D3EE] text-[#14161A] font-black flex items-center justify-center text-base shadow-lg shadow-[#22D3EE]/20">
              SZ
            </div>
            <div className="flex flex-col">
              <span className="text-lg sm:text-xl font-extrabold text-white tracking-tight group-hover:text-[#22D3EE] transition-colors">StudioZIO</span>
              <span className="text-[10px] font-mono text-gray-400 tracking-wider uppercase -mt-1">Audio Software</span>
            </div>
          </a>

          <nav className="hidden lg:flex items-center space-x-6 text-xs font-semibold tracking-wide text-gray-300">
            <a href="#overview" className="hover:text-[#22D3EE] transition-colors">Overview</a>
            <a href="#routing-visualizer" className="hover:text-[#22D3EE] transition-colors">Routing</a>
            <a href="#parameters" className="hover:text-[#22D3EE] transition-colors">32 APVTS Params</a>
            <a href="#features" className="hover:text-[#22D3EE] transition-colors">Features</a>
            <a href="#formats" className="hover:text-[#22D3EE] transition-colors">Formats</a>
            <a href="#requirements" className="hover:text-[#22D3EE] transition-colors">Requirements</a>
            <a href="#downloads" className="hover:text-[#22D3EE] transition-colors">Downloads</a>
            <a href="#faq" className="hover:text-[#22D3EE] transition-colors">FAQ</a>
            <a href="#support" className="hover:text-[#22D3EE] transition-colors">Support</a>
          </nav>

          <div className="hidden sm:flex items-center space-x-4">
            <a href="#downloads" className="px-4 py-2 rounded-xl bg-[#22D3EE] hover:bg-[#06B6D4] text-[#14161A] font-extrabold text-xs transition-all shadow-md shadow-[#22D3EE]/20">
              v4.0.1 — Coming Soon
            </a>
          </div>

          <div className="flex lg:hidden">
            <button type="button" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-expanded={mobileMenuOpen} {...(mobileMenuOpen ? { 'aria-controls': 'mobile-menu' } : {})} className="p-2 rounded-lg bg-[#1D2026] text-gray-300 hover:text-white border border-gray-800">
              <span className="sr-only">Toggle navigation menu</span>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div id="mobile-menu" className="lg:hidden bg-[#1D2026] border-b border-gray-800 px-4 pt-3 pb-6 space-y-3 text-sm font-medium">
          <a href="#overview" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-gray-200 hover:text-[#22D3EE]">Overview</a>
          <a href="#routing-visualizer" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-gray-200 hover:text-[#22D3EE]">Routing Visualizer</a>
          <a href="#parameters" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-gray-200 hover:text-[#22D3EE]">32 APVTS Parameters</a>
          <a href="#features" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-gray-200 hover:text-[#22D3EE]">Features</a>
          <a href="#downloads" onClick={() => setMobileMenuOpen(false)} className="block w-full text-center py-3 bg-[#22D3EE] text-[#14161A] font-extrabold rounded-xl mt-2">
            v4.0.1 — Coming Soon
          </a>
        </div>
      )}
    </header>
  );
};
