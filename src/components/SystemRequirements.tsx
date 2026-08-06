import React, { useState } from 'react';
import { SYSTEM_REQUIREMENTS } from '../data/websiteContent';

export const SystemRequirements: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'macOS' | 'Windows'>('macOS');

  const req = SYSTEM_REQUIREMENTS.find((r) => r.platform === activeTab) || SYSTEM_REQUIREMENTS[0];

  const daws = [
    { name: 'Apple Logic Pro', version: 'v10.7+', mac: true, win: false },
    { name: 'Ableton Live', version: 'v11+', mac: true, win: true },
    { name: 'FL Studio', version: 'v20+', mac: true, win: true },
    { name: 'Steinberg Cubase', version: 'v12+', mac: true, win: true },
    { name: 'PreSonus Studio One', version: 'v6+', mac: true, win: true },
    { name: 'Avid Pro Tools', version: 'v2023+ (via VST3/AU wrapper)', mac: true, win: true },
    { name: 'Cockos Reaper', version: 'v6+', mac: true, win: true },
    { name: 'Bitwig Studio', version: 'v5+', mac: true, win: true },
  ];

  return (
    <section id="requirements" className="py-20 bg-[#14161A] border-b border-gray-800/60 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-[#22D3EE] block mb-2">
            Technical Compatibility
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            System Requirements
          </h2>
          <p className="mt-4 text-gray-300 text-base leading-relaxed">
            Minimum hardware and operating system specifications for StudioZIO Tempo Delay.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex justify-center mb-10">
          <div className="bg-[#1D2026] p-1.5 rounded-xl border border-gray-800 inline-flex space-x-2">
            <button
              type="button"
              onClick={() => setActiveTab('macOS')}
              className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all focus:outline-none focus:ring-2 focus:ring-[#22D3EE] ${
                activeTab === 'macOS'
                  ? 'bg-[#22D3EE] text-[#14161A] shadow-md shadow-[#22D3EE]/20'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              macOS Requirements
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('Windows')}
              className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all focus:outline-none focus:ring-2 focus:ring-[#22D3EE] ${
                activeTab === 'Windows'
                  ? 'bg-[#22D3EE] text-[#14161A] shadow-md shadow-[#22D3EE]/20'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              Windows Requirements
            </button>
          </div>
        </div>

        {/* System Req Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Specs List (7 cols) */}
          <div className="lg:col-span-7 bg-[#1D2026] p-8 rounded-2xl border border-gray-800 space-y-6 shadow-xl">
            <div className="flex items-center justify-between pb-4 border-b border-gray-800">
              <h3 className="text-2xl font-black text-white flex items-center space-x-3">
                <span>{req.platform} Specifications</span>
              </h3>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#14161A] text-[#22D3EE] border border-gray-800">
                Placeholder Spec Sheet
              </span>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-[#14161A] border border-gray-800 space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block">Operating System</span>
                <span className="text-sm font-semibold text-white">{req.osVersion}</span>
              </div>

              <div className="p-4 rounded-xl bg-[#14161A] border border-gray-800 space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block">Processor Architecture</span>
                <span className="text-sm font-semibold text-[#F5A524]">{req.architecture}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-[#14161A] border border-gray-800 space-y-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block">System RAM</span>
                  <span className="text-sm font-semibold text-white">{req.ram}</span>
                </div>

                <div className="p-4 rounded-xl bg-[#14161A] border border-gray-800 space-y-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block">Available Storage</span>
                  <span className="text-sm font-semibold text-white">{req.diskSpace}</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#14161A] border border-gray-800 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block">System & License Notes</span>
                <ul className="space-y-1.5 text-xs text-gray-300">
                  {req.notes.map((note) => (
                    <li key={note} className="flex items-center space-x-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#22D3EE]" />
                      <span>{note}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* DAW Matrix List (5 cols) */}
          <div className="lg:col-span-5 bg-[#1D2026] p-8 rounded-2xl border border-gray-800 shadow-xl space-y-6">
            <h3 className="text-xl font-extrabold text-white flex items-center justify-between">
              <span>Verified DAW Support</span>
              <span className="text-xs font-mono text-[#22D3EE]">64-Bit Host</span>
            </h3>

            <div className="space-y-2.5">
              {daws.map((daw) => {
                const isSupported = activeTab === 'macOS' ? daw.mac : daw.win;
                return (
                  <div
                    key={daw.name}
                    className="p-3 rounded-xl bg-[#14161A] border border-gray-800/80 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-white block">{daw.name}</span>
                      <span className="text-gray-500 font-mono text-[10px]">{daw.version}</span>
                    </div>

                    <span className={`px-2.5 py-1 rounded-md font-bold text-[11px] ${
                      isSupported
                        ? 'bg-[#22D3EE]/20 text-[#22D3EE] border border-[#22D3EE]/40'
                        : 'bg-gray-800 text-gray-500'
                    }`}>
                      {isSupported ? 'Verified Compatible' : 'N/A'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
