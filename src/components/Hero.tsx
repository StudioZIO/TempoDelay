import { useEffect, useState } from 'react';

export const Hero = () => {
  const [pulsePos, setPulsePos] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulsePos((prev) => (prev + 1) % 100);
    }, 40);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="overview" className="relative py-16 sm:py-24 bg-[#14161A] border-b border-gray-800/60 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#1D2026] border border-gray-800 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-[#22D3EE] animate-ping"></span>
              <span className="text-[#22D3EE] font-bold">Release 4.0.1</span>
              <span className="text-gray-500">•</span>
              <span className="text-gray-300">Schema 8 • Apple Silicon arm64</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-none">
              StudioZIO <br className="hidden sm:inline" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#22D3EE] via-cyan-300 to-[#F5A524]">
                Tempo Delay
              </span>
            </h1>

            <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              StudioZIO Tempo Delay is a modern stereo delay featuring independent left/right timing, three character modes (Digital, Tape, Analog), advanced routing, modulation, ducking, diffusion, freeze and reverse processing.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <a href="#downloads" className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#22D3EE] hover:bg-[#06B6D4] text-[#14161A] font-extrabold text-sm transition-all shadow-xl shadow-[#22D3EE]/25 flex items-center justify-center space-x-2">
                <span>Release 4.0.1 — Coming Soon</span>
              </a>
              <a href="#routing-visualizer" className="w-full sm:w-auto px-7 py-4 rounded-xl bg-[#1D2026] hover:bg-gray-800 text-white font-bold text-sm border border-gray-800 transition-all flex items-center justify-center space-x-2">
                <span>Explore Signal Routing</span>
              </a>
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-3 text-[11px] font-mono text-gray-400">
              <span className="px-2.5 py-1 rounded-md bg-[#1D2026] border border-gray-800/80 flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#22D3EE]"></span>
                <span>Audio Unit (AUv2)</span>
              </span>
              <span className="px-2.5 py-1 rounded-md bg-[#1D2026] border border-gray-800/80 flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#22D3EE]"></span>
                <span>VST3 64-Bit</span>
              </span>
              <span className="px-2.5 py-1 rounded-md bg-[#1D2026] border border-gray-800/80 flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#F5A524]"></span>
                <span>Standalone App</span>
              </span>
              <span className="px-2.5 py-1 rounded-md bg-[#1D2026] border border-gray-800/80 flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#F5A524]"></span>
                <span>macOS Apple Silicon (arm64)</span>
              </span>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="p-6 rounded-3xl bg-[#1D2026] border border-gray-800 shadow-2xl space-y-5 relative overflow-hidden group hover:border-[#22D3EE]/40 transition-all">
              <div className="flex items-center justify-between pb-3 border-b border-gray-800">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-[#22D3EE]"></div>
                  <span className="text-xs font-bold text-white tracking-wide">StudioZIO Tempo Delay</span>
                </div>
                <div className="flex items-center space-x-2 text-[10px] font-mono text-gray-400">
                  <span className="px-2 py-0.5 rounded bg-[#14161A] text-[#22D3EE] font-bold">RELEASE 4.0.1</span>
                  <span className="px-2 py-0.5 rounded bg-[#14161A] text-[#F5A524] font-bold">MODE: TAPE</span>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-3 text-center">
                <div className="p-3 rounded-xl bg-[#14161A] border border-gray-800 space-y-1">
                  <span className="text-[10px] font-mono text-gray-400 block">L DIV</span>
                  <div className="w-9 h-9 mx-auto rounded-full border-2 border-[#22D3EE] flex items-center justify-center text-[10px] font-bold text-[#22D3EE] bg-[#22D3EE]/10">1/4</div>
                </div>
                <div className="p-3 rounded-xl bg-[#14161A] border border-gray-800 space-y-1">
                  <span className="text-[10px] font-mono text-gray-400 block">R DIV</span>
                  <div className="w-9 h-9 mx-auto rounded-full border-2 border-[#F5A524] flex items-center justify-center text-[10px] font-bold text-[#F5A524] bg-[#F5A524]/10">1/8D</div>
                </div>
                <div className="p-3 rounded-xl bg-[#14161A] border border-gray-800 space-y-1">
                  <span className="text-[10px] font-mono text-gray-400 block">DUCK</span>
                  <div className="w-9 h-9 mx-auto rounded-full border-2 border-[#22D3EE] flex items-center justify-center text-[10px] font-bold text-[#22D3EE] bg-[#22D3EE]/10">50%</div>
                </div>
                <div className="p-3 rounded-xl bg-[#14161A] border border-gray-800 space-y-1">
                  <span className="text-[10px] font-mono text-gray-400 block">FREEZE</span>
                  <div className="w-9 h-9 mx-auto rounded-full border-2 border-gray-700 flex items-center justify-center text-[10px] font-bold text-gray-400 bg-gray-800/40">OFF</div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#14161A] border border-gray-800 space-y-2 relative overflow-hidden">
                <div className="flex justify-between text-[10px] font-mono text-gray-400">
                  <span>SIGNAL ROUTING PREVIEW</span>
                  <span className="text-[#22D3EE]">PING-PONG MATRIX</span>
                </div>
                <div className="space-y-2 py-1">
                  <div className="h-2 rounded-full bg-gray-800 relative overflow-hidden">
                    <div className="absolute top-0 bottom-0 w-12 bg-gradient-to-r from-transparent via-[#22D3EE] to-transparent rounded-full shadow-[0_0_12px_#22D3EE]" style={{ left: `${pulsePos}%` }}></div>
                  </div>
                  <div className="h-2 rounded-full bg-gray-800 relative overflow-hidden">
                    <div className="absolute top-0 bottom-0 w-12 bg-gradient-to-r from-transparent via-[#F5A524] to-transparent rounded-full shadow-[0_0_12px_#F5A524]" style={{ left: `${(pulsePos + 50) % 100}%` }}></div>
                  </div>
                </div>
                <div className="text-[10px] font-mono text-gray-500 text-right">
                  Zero Reported Latency Engine
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between text-[11px] font-mono text-gray-400 border-t border-gray-800/80">
                <span>64-bit Float Engine</span>
                <span className="text-[#22D3EE]">Logic Pro & REAPER</span>
              </div>
            </div>
          </div>

        </div>

        <div className="mt-16 pt-8 border-t border-gray-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="p-4 rounded-2xl bg-[#1D2026] border border-gray-800/80">
            <span className="text-2xl font-black text-[#22D3EE] block">32 APVTS</span>
            <span className="text-xs text-gray-400 font-mono mt-1 block">Automatable Params</span>
          </div>
          <div className="p-4 rounded-2xl bg-[#1D2026] border border-gray-800/80">
            <span className="text-2xl font-black text-white block">44.1 – 192</span>
            <span className="text-xs text-gray-400 font-mono mt-1 block">kHz Sample Rate</span>
          </div>
          <div className="p-4 rounded-2xl bg-[#1D2026] border border-gray-800/80">
            <span className="text-2xl font-black text-[#F5A524] block">0 Samples</span>
            <span className="text-xs text-gray-400 font-mono mt-1 block">Reported Latency</span>
          </div>
          <div className="p-4 rounded-2xl bg-[#1D2026] border border-gray-800/80">
            <span className="text-2xl font-black text-white block">arm64</span>
            <span className="text-xs text-gray-400 font-mono mt-1 block">Apple Silicon Native</span>
          </div>
        </div>
      </div>
    </section>
  );
};
