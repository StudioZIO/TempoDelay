export const Description = () => {
  return (
    <section id="overview" className="py-20 bg-[#14161A] border-b border-gray-800/60 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-[#22D3EE] block mb-2">
            Audio Plugin Overview
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Precision Stereo Delay Architecture for Production & Mixing
          </h2>
          <p className="mt-4 text-gray-300 text-base leading-relaxed">
            StudioZIO Tempo Delay delivers pristine audio quality, sample-accurate host transport synchronization, and total independent control over Left and Right delay buffers.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          
          <div className="p-8 rounded-2xl bg-[#1D2026] border border-gray-800 shadow-xl space-y-6">
            <div className="w-12 h-12 rounded-xl bg-[#22D3EE]/10 border border-[#22D3EE]/30 flex items-center justify-center text-[#22D3EE]">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>

            <h3 className="text-2xl font-bold text-white">
              Independent Dual Channel Delay Buffers
            </h3>

            <p className="text-gray-300 leading-relaxed text-sm">
              Unlike mono-derived stereo delays, StudioZIO Tempo Delay maintains two completely isolated delay buffers for Left and Right audio channels. Each channel can be assigned its own rhythmic note division (from 1/32 to 1/1, including straight, dotted, and triplet variations) or millisecond timing from 1.0 ms to 2000.0 ms.
            </p>

            <div className="space-y-2 pt-2 text-xs text-gray-300">
              <p className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-[#22D3EE]" />
                <span><strong className="text-white">Sample-Accurate Sync:</strong> Locks directly to DAW host transport and grid tempo changes.</span>
              </p>
              <p className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-[#22D3EE]" />
                <span><strong className="text-white">Interpolated Delay Lines:</strong> Fractional Hermite interpolation prevents pitch artifacts.</span>
              </p>
            </div>
          </div>

          <div className="p-8 rounded-2xl bg-[#1D2026] border border-gray-800 shadow-xl space-y-6">
            <div className="w-12 h-12 rounded-xl bg-[#F5A524]/10 border border-[#F5A524]/30 flex items-center justify-center text-[#F5A524]">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>

            <h3 className="text-2xl font-bold text-white">
              Ping-Pong Matrix, Drive & Tone Filters
            </h3>

            <p className="text-gray-300 leading-relaxed text-sm">
              Shape the character of your delay tails with an internal feedback loop processing chain. Toggle Ping-Pong mode to bounce delay repeats cross-channel between Left and Right speakers. Inject analog soft-clipping saturation with the Drive control (+0 to +24 dB), and sculpt frequencies using High-Pass and Low-Pass filters inside the feedback path.
            </p>

            <div className="space-y-2 pt-2 text-xs text-gray-300">
              <p className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-[#F5A524]" />
                <span><strong className="text-white">Loop Saturation:</strong> Soft-clipping hyperbolic tangent drive stage adds warm harmonics.</span>
              </p>
              <p className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-[#F5A524]" />
                <span><strong className="text-white">Mid/Side Stereo Width:</strong> Adjust spatial width from 0% mono collapse to 200% extra wide.</span>
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
