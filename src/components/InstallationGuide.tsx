import { useState } from 'react';

export const InstallationGuide = () => {
  const [platform, setPlatform] = useState('macOS');

  const steps = platform === 'macOS' ? [
    'Download official StudioZIO_Tempo_Delay_v1.0.0_macOS.dmg installer.',
    'Mount the DMG disk image by double-clicking.',
    'Run the StudioZIO Tempo Delay Installer package.',
    'Select plugin formats (Audio Units AU, VST3, Standalone App).',
    'Open your DAW (Logic Pro, Ableton, FL Studio) to perform a plugin scan.'
  ] : [
    'Download official StudioZIO_Tempo_Delay_v1.0.0_Win64.exe installer.',
    'Run setup executable with administrator permissions.',
    'Verify VST3 target path (C:\\Program Files\\Common Files\\VST3).',
    'Complete installation wizard.',
    'Refresh VST3 plugins in your DAW.'
  ];

  return (
    <section id="installation" className="py-20 bg-[#14161A] border-b border-gray-800/60 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-[#22D3EE] block mb-2">
            Setup Instructions
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Installation Guide Placeholder
          </h2>
        </div>

        <div className="flex justify-center mb-10">
          <div className="bg-[#1D2026] p-1.5 rounded-xl border border-gray-800 inline-flex space-x-2">
            <button
              type="button"
              onClick={() => setPlatform('macOS')}
              className={`px-6 py-2 rounded-lg text-sm font-bold ${
                platform === 'macOS' ? 'bg-[#22D3EE] text-[#14161A]' : 'text-gray-400'
              }`}
            >
              macOS
            </button>
            <button
              type="button"
              onClick={() => setPlatform('Windows')}
              className={`px-6 py-2 rounded-lg text-sm font-bold ${
                platform === 'Windows' ? 'bg-[#22D3EE] text-[#14161A]' : 'text-gray-400'
              }`}
            >
              Windows
            </button>
          </div>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {steps.map((st, i) => (
            <div key={i} className="p-4 rounded-xl bg-[#1D2026] border border-gray-800 flex items-center space-x-4 text-sm text-gray-200">
              <span className="w-8 h-8 rounded-lg bg-[#22D3EE]/10 text-[#22D3EE] font-bold flex items-center justify-center shrink-0">
                {i + 1}
              </span>
              <span>{st}</span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
