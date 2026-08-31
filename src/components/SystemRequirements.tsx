import { useState } from 'react';
import { SYSTEM_REQUIREMENTS } from '../data/websiteContent';

export const SystemRequirements = () => {
  const [platform, setPlatform] = useState<keyof typeof SYSTEM_REQUIREMENTS>('macOS');
  const req = SYSTEM_REQUIREMENTS[platform];

  return (
    <section id="requirements" className="py-20 bg-[#14161A] border-b border-gray-800/60 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-[#22D3EE] block mb-2">
            Technical Compatibility
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            System Requirements
          </h2>
        </div>

        <div className="flex justify-center mb-10">
          <div className="bg-[#1D2026] p-1.5 rounded-xl border border-gray-800 inline-flex space-x-2">
            <button
              type="button"
              onClick={() => setPlatform('macOS')}
              className={`px-6 py-2.5 rounded-lg text-sm font-bold ${
                platform === 'macOS' ? 'bg-[#22D3EE] text-[#14161A]' : 'text-gray-400'
              }`}
            >
              macOS
            </button>
            <button
              type="button"
              onClick={() => setPlatform('Windows')}
              className={`px-6 py-2.5 rounded-lg text-sm font-bold ${
                platform === 'Windows' ? 'bg-[#22D3EE] text-[#14161A]' : 'text-gray-400'
              }`}
            >
              Windows
            </button>
          </div>
        </div>

        <div className="max-w-4xl mx-auto bg-[#1D2026] p-8 rounded-2xl border border-gray-800 space-y-6">
          <h3 className="text-2xl font-black text-white">{platform} Specifications</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-[#14161A] border border-gray-800 space-y-1">
              <span className="text-gray-400 uppercase font-bold block">Operating System</span>
              <span className="text-white font-semibold">{req.osVersion}</span>
            </div>
            <div className="p-4 rounded-xl bg-[#14161A] border border-gray-800 space-y-1">
              <span className="text-gray-400 uppercase font-bold block">Architecture</span>
              <span className="text-[#F5A524] font-semibold">{req.architecture}</span>
            </div>
            <div className="p-4 rounded-xl bg-[#14161A] border border-gray-800 space-y-1">
              <span className="text-gray-400 uppercase font-bold block">System RAM</span>
              <span className="text-white font-semibold">{req.ram}</span>
            </div>
            <div className="p-4 rounded-xl bg-[#14161A] border border-gray-800 space-y-1">
              <span className="text-gray-400 uppercase font-bold block">Disk Space</span>
              <span className="text-white font-semibold">{req.diskSpace}</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
