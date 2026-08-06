import React, { useState } from 'react';
import { INSTALLATION_STEPS } from '../data/websiteContent';

export const InstallationGuide: React.FC = () => {
  const [platform, setPlatform] = useState<'macOS' | 'Windows'>('macOS');

  const steps = INSTALLATION_STEPS[platform];

  return (
    <section id="installation" className="py-20 bg-[#14161A] border-b border-gray-800/60 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-[#22D3EE] block mb-2">
            Setup Instructions
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Installation Guide Placeholder
          </h2>
          <p className="mt-4 text-gray-300 text-base leading-relaxed">
            Step-by-step installation instructions for setting up StudioZIO Tempo Delay on your computer.
          </p>
        </div>

        {/* Platform Toggle */}
        <div className="flex justify-center mb-12">
          <div className="bg-[#1D2026] p-1.5 rounded-xl border border-gray-800 inline-flex space-x-2">
            <button
              type="button"
              onClick={() => setPlatform('macOS')}
              className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all focus:outline-none focus:ring-2 focus:ring-[#22D3EE] ${
                platform === 'macOS'
                  ? 'bg-[#22D3EE] text-[#14161A] shadow-md shadow-[#22D3EE]/20'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              macOS Setup
            </button>

            <button
              type="button"
              onClick={() => setPlatform('Windows')}
              className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all focus:outline-none focus:ring-2 focus:ring-[#22D3EE] ${
                platform === 'Windows'
                  ? 'bg-[#22D3EE] text-[#14161A] shadow-md shadow-[#22D3EE]/20'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              Windows Setup
            </button>
          </div>
        </div>

        {/* Steps List Cards */}
        <div className="max-w-4xl mx-auto space-y-4">
          {steps.map((s) => (
            <div
              key={s.step}
              className="p-6 rounded-2xl bg-[#1D2026] border border-gray-800/80 hover:border-gray-700 transition-all flex items-start space-x-5 shadow-lg"
            >
              <div className="w-10 h-10 rounded-xl bg-[#22D3EE]/10 border border-[#22D3EE]/30 text-[#22D3EE] font-black text-lg flex items-center justify-center shrink-0">
                {s.step}
              </div>

              <div className="space-y-1">
                <h3 className="text-lg font-bold text-white">{s.title}</h3>
                <p className="text-sm text-gray-300 leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Component Path Reference Grid */}
        <div className="max-w-4xl mx-auto mt-12 p-6 rounded-2xl bg-[#1D2026] border border-gray-800 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#F5A524]">
            Default Plugin Target Directory Paths
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono text-gray-300">
            <div className="p-3 rounded-xl bg-[#14161A] border border-gray-800 space-y-1">
              <span className="text-gray-500 font-sans text-[10px] uppercase font-bold block">macOS AU Component</span>
              <span className="text-[#22D3EE] font-bold">/Library/Audio/Plug-Ins/Components/</span>
            </div>

            <div className="p-3 rounded-xl bg-[#14161A] border border-gray-800 space-y-1">
              <span className="text-gray-500 font-sans text-[10px] uppercase font-bold block">macOS VST3 Bundle</span>
              <span className="text-[#22D3EE] font-bold">/Library/Audio/Plug-Ins/VST3/</span>
            </div>

            <div className="p-3 rounded-xl bg-[#14161A] border border-gray-800 space-y-1">
              <span className="text-gray-500 font-sans text-[10px] uppercase font-bold block">Windows 64-Bit VST3</span>
              <span className="text-[#F5A524] font-bold">C:\Program Files\Common Files\VST3\</span>
            </div>

            <div className="p-3 rounded-xl bg-[#14161A] border border-gray-800 space-y-1">
              <span className="text-gray-500 font-sans text-[10px] uppercase font-bold block">Standalone Application</span>
              <span className="text-white font-bold">/Applications or C:\Program Files\StudioZIO\</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
