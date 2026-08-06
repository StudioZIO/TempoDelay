import React from 'react';
import { KEY_FEATURES } from '../data/websiteContent';

export const Features: React.FC = () => {
  return (
    <section id="features" className="py-20 bg-[#14161A] border-b border-gray-800/60 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-[#22D3EE] block mb-2">
            C++ DSP Architecture
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Core DSP Modules & Feature Overview
          </h2>
          <p className="mt-4 text-gray-300 text-base leading-relaxed">
            Engineered with dedicated C++ audio processing classes reflecting real hardware & analog DSP modeling.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {KEY_FEATURES.map((feat, idx) => (
            <div
              key={feat.title}
              className="p-6 rounded-2xl bg-[#1D2026] border border-gray-800 hover:border-gray-700 transition-all shadow-xl group flex flex-col justify-between hover:shadow-[#22D3EE]/5"
            >
              <div className="space-y-4">
                
                {/* Icon Container & C++ Module Badge */}
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-[#22D3EE]/10 border border-[#22D3EE]/30 flex items-center justify-center text-[#22D3EE] group-hover:scale-110 group-hover:bg-[#22D3EE] group-hover:text-[#14161A] transition-all">
                    {idx === 0 && (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                    {idx === 1 && (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                      </svg>
                    )}
                    {idx === 2 && (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                      </svg>
                    )}
                    {idx === 3 && (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                      </svg>
                    )}
                    {idx === 4 && (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                      </svg>
                    )}
                    {idx === 5 && (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    )}
                  </div>
                  
                  <span className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-[#F5A524]/10 border border-[#F5A524]/30 text-[#F5A524]">
                    {feat.module}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white group-hover:text-[#22D3EE] transition-colors">
                  {feat.title}
                </h3>

                <p className="text-sm font-medium text-[#F5A524]">
                  {feat.tagline}
                </p>

                <p className="text-xs text-gray-300 leading-relaxed">
                  {feat.detail}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-800 text-[11px] font-mono text-gray-500 flex justify-between items-center">
                <span>Core Module {idx + 1}</span>
                <span className="text-[#22D3EE] flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#22D3EE] inline-block"></span>
                  <span>C++ Active</span>
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
