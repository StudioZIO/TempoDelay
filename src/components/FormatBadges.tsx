import React from 'react';
import { FORMAT_BADGES } from '../data/websiteContent';

export const FormatBadges: React.FC = () => {
  return (
    <section id="formats" className="py-16 bg-[#14161A] border-b border-gray-800/60 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-[#22D3EE] block mb-2">
            Native Format Support
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Plugin Formats & Architecture
          </h2>
          <p className="mt-3 text-gray-300 text-sm sm:text-base leading-relaxed">
            Native 64-bit Audio Units (AUv2 & AUv3), VST3, and Standalone desktop app formats engineered for Apple Silicon & Windows.
          </p>
        </div>

        {/* Formats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {FORMAT_BADGES.map((format) => (
            <div
              key={format.id}
              className="p-8 rounded-3xl bg-[#1D2026] border border-gray-700/80 hover:border-[#22D3EE]/50 transition-all shadow-xl group flex flex-col justify-between space-y-6 hover:translate-y-[-2px]"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full text-xs font-bold font-mono bg-[#22D3EE]/10 text-[#22D3EE] border border-[#22D3EE]/30">
                    {format.badgeText}
                  </span>
                  <span className="text-xs font-mono text-gray-400">{format.fileExtension}</span>
                </div>

                <h3 className="text-2xl font-bold text-white group-hover:text-[#22D3EE] transition-colors">
                  {format.name}
                </h3>

                <p className="text-xs text-gray-300 leading-relaxed">
                  {format.description}
                </p>

                <div className="space-y-2 pt-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block">
                    Tested DAW Hosts:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {format.targetDAWs.map((daw) => (
                      <span
                        key={daw}
                        className="px-2.5 py-1 rounded-lg bg-[#14161A] text-gray-300 border border-gray-800 text-[11px] font-mono"
                      >
                        {daw}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-800 text-[11px] font-mono text-gray-500 flex justify-between">
                <span>Platform: {format.platforms.join(' & ')}</span>
                <span className="text-[#22D3EE]">64-Bit Native</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
