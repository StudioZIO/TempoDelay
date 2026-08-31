export const VersionHistory = () => {
  return (
    <section id="versions" className="py-20 bg-[#14161A] border-b border-gray-800/60 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-[#22D3EE] block mb-2">
            Development Timeline
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Version History & Changelog
          </h2>
        </div>

        <div className="max-w-4xl mx-auto p-8 rounded-2xl bg-[#1D2026] border border-gray-800 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-gray-800">
            <span className="px-4 py-1.5 rounded-xl bg-[#22D3EE] text-[#14161A] font-black text-lg">
              v1.0.0
            </span>
            <span className="text-xs text-gray-400 font-mono">Released: August 2026</span>
          </div>

          <p className="text-sm text-white font-bold">Initial Official Release of StudioZIO Tempo Delay</p>

          <div className="space-y-2 text-xs text-gray-300">
            <p>• Dual-channel independent stereo delay engine with Hermite fractional sample interpolation.</p>
            <p>• Sample-accurate host tempo sync with 16 rhythmic note division selections.</p>
            <p>• Ping-Pong cross-feedback matrix routing for wide spatial bouncing echoes.</p>
            <p>• Integrated 12 dB/octave High-Pass and Low-Pass filters inside feedback loop.</p>
            <p>• Analog soft-clipping Drive saturation stage (0.0 to +24.0 dB).</p>
            <p>• Mid/Side Stereo Width enhancer ranging from 0% (mono) to 200% (extra wide).</p>
          </div>
        </div>

      </div>
    </section>
  );
};
