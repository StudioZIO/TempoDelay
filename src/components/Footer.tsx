import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#14161A] text-gray-400 py-12 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-gray-800/80">
          
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-[#22D3EE] text-[#14161A] font-black flex items-center justify-center text-sm">
                SZ
              </div>
              <span className="text-lg font-bold text-white tracking-tight">StudioZIO</span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              StudioZIO Tempo Delay is a native AU, VST3, and Standalone stereo delay audio plugin for music producers and sound engineers.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-white block">Navigation</span>
            <ul className="space-y-1.5 text-xs">
              <li><a href="#overview" className="hover:text-[#22D3EE] transition-colors">Overview</a></li>
              <li><a href="#parameters" className="hover:text-[#22D3EE] transition-colors">Parameter Guide</a></li>
              <li><a href="#routing-visualizer" className="hover:text-[#22D3EE] transition-colors">Signal Flow Diagram</a></li>
              <li><a href="#features" className="hover:text-[#22D3EE] transition-colors">Features & DSP Modules</a></li>
            </ul>
          </div>

          {/* Formats & Technical */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-white block">Technical</span>
            <ul className="space-y-1.5 text-xs">
              <li><a href="#formats" className="hover:text-[#22D3EE] transition-colors">Plugin Formats (AU / VST3 / App)</a></li>
              <li><a href="#requirements" className="hover:text-[#22D3EE] transition-colors">System Requirements</a></li>
              <li><a href="#versions" className="hover:text-[#22D3EE] transition-colors">Version Changelog</a></li>
              <li><a href="#installation" className="hover:text-[#22D3EE] transition-colors">Installation Steps</a></li>
            </ul>
          </div>

          {/* Support & Downloads */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-white block">Resources</span>
            <ul className="space-y-1.5 text-xs">
              <li><a href="#downloads" className="hover:text-[#22D3EE] transition-colors">Download Center</a></li>
              <li><a href="#faq" className="hover:text-[#22D3EE] transition-colors">Frequently Asked Questions</a></li>
              <li><a href="#support" className="hover:text-[#22D3EE] transition-colors">Support Center</a></li>
            </ul>
          </div>

        </div>

        {/* Bottom Ecosystem Statement & Copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-gray-400 gap-4">
          <div className="space-y-1 text-center md:text-left">
            <p className="font-medium text-gray-300">
              StudioZIO is an independent audio software company founded by producer and recording artist{' '}
              <a 
                href="https://zio.audio" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-[#22D3EE] hover:text-[#F5A524] underline underline-offset-2 transition-colors font-semibold"
              >
                ZIO
              </a>.
            </p>
            <p className="text-[11px] text-gray-500">
              © 2026 StudioZIO. All rights reserved. Built as a native C++/JUCE audio processing architecture.
            </p>
          </div>

          <div className="flex items-center space-x-4 shrink-0">
            <a href="#main-content" className="hover:text-[#22D3EE] transition-colors flex items-center space-x-1 text-gray-400">
              <span>Back to Top</span>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
};
