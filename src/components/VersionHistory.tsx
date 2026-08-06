import React from 'react';
import { VERSION_HISTORY } from '../data/websiteContent';

export const VersionHistory: React.FC = () => {
  return (
    <section id="versions" className="py-20 bg-[#14161A] border-b border-gray-800/60 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-[#22D3EE] block mb-2">
            Development Timeline
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Version History & Changelog
          </h2>
          <p className="mt-4 text-gray-300 text-base leading-relaxed">
            Detailed release notes and revision log for StudioZIO Tempo Delay binaries.
          </p>
        </div>

        {/* Timeline Stack */}
        <div className="max-w-4xl mx-auto space-y-8">
          {VERSION_HISTORY.map((rel) => (
            <div
              key={rel.version}
              className="p-8 rounded-2xl bg-[#1D2026] border border-gray-800 shadow-xl space-y-6 relative overflow-hidden"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-800">
                <div className="flex items-center space-x-4">
                  <span className="px-4 py-1.5 rounded-xl bg-[#22D3EE] text-[#14161A] font-black text-lg shadow-md shadow-[#22D3EE]/20">
                    v{rel.version}
                  </span>
                  <div>
                    <h3 className="text-xl font-bold text-white">{rel.tagline}</h3>
                    <span className="text-xs text-gray-400 font-mono">Released: {rel.releaseDate}</span>
                  </div>
                </div>

                <span className="self-start sm:self-auto px-3 py-1 rounded-full text-xs font-bold bg-[#F5A524]/10 text-[#F5A524] border border-[#F5A524]/30">
                  Initial Commercial Build
                </span>
              </div>

              {/* Highlights List */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Release Highlights
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {rel.highlights.map((item, i) => (
                    <div key={i} className="p-3 rounded-xl bg-[#14161A] border border-gray-800/80 text-xs text-gray-300 flex items-start space-x-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#22D3EE] mt-1.5 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Categorized Changes Table */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Technical Changelog Breakdown
                </h4>
                <div className="space-y-2">
                  {rel.changes.map((change, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-[#14161A]/60 border border-gray-800 flex items-center space-x-3 text-xs"
                    >
                      <span className={`px-2.5 py-0.5 rounded font-mono font-bold text-[10px] shrink-0 ${
                        change.category === 'Feature' ? 'bg-[#22D3EE]/20 text-[#22D3EE]' :
                        change.category === 'DSP Engine' ? 'bg-[#F5A524]/20 text-[#F5A524]' :
                        change.category === 'Performance' ? 'bg-purple-500/20 text-purple-300' :
                        'bg-gray-800 text-gray-300'
                      }`}>
                        {change.category}
                      </span>
                      <span className="text-gray-300">{change.description}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
