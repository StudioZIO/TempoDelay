import { FORMAT_BADGES } from '../data/websiteContent';

export const FormatBadges = () => {
  return (
    <section id="formats" className="py-20 bg-[#14161A] border-b border-gray-800/60 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-[#22D3EE] block mb-2">
            Native Architecture
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Supported Plugin Formats & Platforms
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {FORMAT_BADGES.map((fmt) => (
            <div key={fmt.id} className="p-8 rounded-2xl bg-[#1D2026] border border-gray-800 space-y-6">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-xs font-black bg-[#22D3EE]/10 text-[#22D3EE] border border-[#22D3EE]/30">
                  {fmt.badgeText}
                </span>
                <span className="text-xs font-mono text-gray-400">{fmt.fileExtension}</span>
              </div>

              <h3 className="text-2xl font-black text-white">{fmt.name}</h3>
              <p className="text-sm text-gray-300">{fmt.description}</p>

              <div className="space-y-2 pt-2">
                <span className="text-xs font-bold uppercase text-gray-400 block">Verified DAWs</span>
                <div className="flex flex-wrap gap-1.5">
                  {fmt.targetDAWs.map((daw) => (
                    <span key={daw} className="px-2 py-0.5 rounded text-[11px] font-mono bg-gray-800/60 text-gray-300">
                      {daw}
                    </span>
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
