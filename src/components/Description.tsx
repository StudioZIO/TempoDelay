import React from 'react';

export const Description: React.FC = () => {
  return (
    <section id="overview" className="py-20 bg-[#14161A] border-b border-gray-800/60 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-[#22D3EE] block mb-2">
            Audio Plugin Overview
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Precision Stereo Delay Architecture for Production & Mixing
          </h2>
          <p className="mt-4 text-gray-300 text-base sm:text-lg leading-relaxed">
            StudioZIO Tempo Delay delivers pristine audio quality, sample-accurate host transport synchronization, and total independent control over Left and Right delay buffers.
          </p>
        </div>

        {/* 2-Column Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-stretch">
          
          {/* Column 1: Core Engine Architecture */}
          <div className="p-8 rounded-2xl bg-[#1D2026] border border-gray-800/80 shadow-xl flex flex-col justify-between">
            <div className="space-y-6">
              <div className="w-12 h-12 rounded-xl bg-[#22D3EE]/10 border border-[#22D3EE]/30 flex items-center justify-center text-[#22D3EE]">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>

              <h3 className="text-2xl font-bold text-white">
                Independent Dual Channel Delay Buffers
              </h3>

              <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
                Unlike mono-derived stereo delays, StudioZIO Tempo Delay maintains two completely isolated delay buffers for the Left and Right audio channels. Each channel can be assigned its own rhythmic note division (from 1/32 to 1/1, including straight, dotted, and triplet variations) or explicit millisecond timing from 1.0 ms to 2000.0 ms.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 rounded-full bg-[#22D3EE]/20 flex items-center justify-center text-[#22D3EE] mt-0.5 shrink-0">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-sm text-gray-300"><strong className="text-white">Sample-Accurate Sync:</strong> Locks directly to DAW host transport, grid tempo changes, and time signatures.</span>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 rounded-full bg-[#22D3EE]/20 flex items-center justify-center text-[#22D3EE] mt-0.5 shrink-0">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-sm text-gray-300"><strong className="text-white">Interpolated Delay Lines:</strong> Fractional Hermite interpolation prevents pitch artifacts when adjusting parameters in real-time.</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-800 text-xs text-gray-400 flex items-center justify-between">
              <span>Dual Buffer Engine</span>
              <span className="text-[#22D3EE] font-mono">2x Independent L/R Lines</span>
            </div>
          </div>

          {/* Column 2: Feedback & Tone Shaping Matrix */}
          <div className="p-8 rounded-2xl bg-[#1D2026] border border-gray-800/80 shadow-xl flex flex-col justify-between">
            <div className="space-y-6">
              <div className="w-12 h-12 rounded-xl bg-[#F5A524]/10 border border-[#F5A524]/30 flex items-center justify-center text-[#F5A524]">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>

              <h3 className="text-2xl font-bold text-white">
                Ping-Pong Matrix, Drive & Tone Filters
              </h3>

              <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
                Shape the character of your delay tails with an internal feedback loop processing chain. Toggle Ping-Pong mode to bounce delay repeats cross-channel between Left and Right speakers. Inject analog soft-clipping saturation with the Drive control (+0 to +24 dB), and sculpt low and high frequencies using 12 dB/octave High-Pass and Low-Pass filters inside the feedback path.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 rounded-full bg-[#F5A524]/20 flex items-center justify-center text-[#F5A524] mt-0.5 shrink-0">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-sm text-gray-300"><strong className="text-white">Loop Saturation:</strong> Warm hyperbolic tangent drive stage adds rich harmonic overtones to decaying echoes.</span>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 rounded-full bg-[#F5A524]/20 flex items-center justify-center text-[#F5A524] mt-0.5 shrink-0">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-sm text-gray-300"><strong className="text-white">Mid/Side Stereo Expansion:</strong> Adjust stereo width from 0% mono collapse to 200% expanded side energy.</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-800 text-xs text-gray-400 flex items-center justify-between">
              <span>Internal Feedback Path</span>
              <span className="text-[#F5A524] font-mono">Drive + HPF + LPF + M/S</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
