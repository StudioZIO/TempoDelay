import { useState } from 'react';

export const InteractiveVisualizer = () => {
  const [pingPong, setPingPong] = useState(true);
  const [bpm, setBpm] = useState(120);
  const [leftDiv, setLeftDiv] = useState('1/4');
  const [rightDiv, setRightDiv] = useState('1/8D');
  const [leftFeedback] = useState(50);
  const [rightFeedback] = useState(50);
  const [driveDb] = useState(4.0);
  const [hpfCutoff] = useState(150);
  const [lpfCutoff] = useState(7500);
  const [width] = useState(130);

  const [isPulseActive, setIsPulseActive] = useState(false);
  const [pulseKey, setPulseKey] = useState(0);

  const getMsFromDiv = (division: string, targetBpm: number) => {
    const quarterMs = (60000 / targetBpm);
    const divMap: Record<string, number> = {
      '1/32': quarterMs / 8,
      '1/16': quarterMs / 4,
      '1/8': quarterMs / 2,
      '1/8D': (quarterMs / 2) * 1.5,
      '1/4': quarterMs,
      '1/4D': quarterMs * 1.5,
      '1/2': quarterMs * 2,
      '1/1': quarterMs * 4,
    };
    return Math.round(divMap[division] || quarterMs);
  };

  const leftMs = getMsFromDiv(leftDiv, bpm);
  const rightMs = getMsFromDiv(rightDiv, bpm);

  const triggerPulse = () => {
    setIsPulseActive((prev) => {
      const nextState = !prev;
      if (nextState) {
        setPulseKey((k) => k + 1);
      }
      return nextState;
    });
  };

  return (
    <section id="routing-visualizer" className="py-20 bg-[#14161A] border-b border-gray-800/60 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Prominent Educational Disclaimer */}
        <div className="mb-8 p-4 rounded-xl bg-[#F5A524]/10 border-2 border-[#F5A524]/60 flex items-center justify-between text-[#F5A524]">
          <div className="flex items-center space-x-3">
            <svg className="w-6 h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <span className="text-xs font-black uppercase tracking-widest block">
                Educational Interactive Visualization
              </span>
              <span className="text-xs sm:text-sm font-semibold text-gray-200">
                This diagram demonstrates DSP signal routing mechanics (Ping-Pong cross-feedback, delay times, and filters). It is NOT the actual native plugin GUI interface.
              </span>
            </div>
          </div>
        </div>

        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-[#22D3EE] block mb-2">
            Signal Flow Simulator
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            How Ping-Pong Delay Routing Works
          </h2>
          <p className="mt-4 text-gray-300 text-base leading-relaxed">
            Experiment with controls below to visualize how audio signals travel through Left & Right delay buffers, cross-channel ping-pong feedback paths, drive saturation, and tone filters.
          </p>
        </div>

        <div className="bg-[#1D2026] rounded-3xl border border-gray-800 p-6 lg:p-8 shadow-2xl space-y-8">

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pb-6 border-b border-gray-800">
            <div className="p-3.5 rounded-xl bg-[#14161A] border border-gray-800 space-y-2">
              <span className="text-xs font-bold uppercase text-gray-400 block">Routing Mode</span>
              <button
                type="button"
                onClick={() => setPingPong(!pingPong)}
                className={`w-full py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-between ${
                  pingPong ? 'bg-[#22D3EE] text-[#14161A]' : 'bg-gray-800 text-gray-300'
                }`}
              >
                <span>{pingPong ? 'Ping-Pong (Cross)' : 'Standard (Parallel)'}</span>
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-[#14161A] border border-gray-800 space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-gray-400">Tempo</span>
                <span className="font-mono text-[#F5A524]">{bpm} BPM</span>
              </div>
              <input
                type="range"
                min="60"
                max="200"
                value={bpm}
                onChange={(e) => setBpm(parseInt(e.target.value))}
                aria-label="Tempo in BPM"
                className="w-full h-2 bg-gray-800 rounded-lg appearance-none accent-[#F5A524]"
              />
            </div>

            <div className="p-3.5 rounded-xl bg-[#14161A] border border-gray-800 space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-[#22D3EE]">Left Division</span>
                <span className="font-mono text-[#22D3EE]">{leftMs} ms</span>
              </div>
              <select
                value={leftDiv}
                onChange={(e) => setLeftDiv(e.target.value)}
                aria-label="Left delay division"
                className="w-full py-1.5 px-2 bg-[#1D2026] text-white border border-gray-700 rounded-lg font-mono text-xs"
              >
                {['1/16', '1/8', '1/8D', '1/4', '1/4D', '1/2'].map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div className="p-3.5 rounded-xl bg-[#14161A] border border-gray-800 space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-[#F5A524]">Right Division</span>
                <span className="font-mono text-[#F5A524]">{rightMs} ms</span>
              </div>
              <select
                value={rightDiv}
                onChange={(e) => setRightDiv(e.target.value)}
                aria-label="Right delay division"
                className="w-full py-1.5 px-2 bg-[#1D2026] text-white border border-gray-700 rounded-lg font-mono text-xs"
              >
                {['1/16', '1/8', '1/8D', '1/4', '1/4D', '1/2'].map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>

          {/* SVG Diagram Canvas */}
          <div className="relative bg-[#14161A] rounded-2xl border border-gray-800 p-6 overflow-x-auto">
            <svg viewBox="0 0 900 420" className="w-full h-auto">
              <defs>
                <marker id="arrow-cyan" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
                  <path d="M0,0 L8,4 L0,8 Z" fill="#22D3EE" />
                </marker>
                <marker id="arrow-amber" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
                  <path d="M0,0 L8,4 L0,8 Z" fill="#F5A524" />
                </marker>
              </defs>

              <g transform="translate(40, 90)">
                <rect width="90" height="50" rx="8" fill="#1D2026" stroke="#22D3EE" strokeWidth="2" />
                <text x="45" y="24" fill="#22D3EE" textAnchor="middle" fontSize="12" fontWeight="bold">INPUT (L)</text>
                <text x="45" y="40" fill="#94A3B8" textAnchor="middle" fontSize="10">Audio In</text>
              </g>

              <g transform="translate(40, 270)">
                <rect width="90" height="50" rx="8" fill="#1D2026" stroke="#F5A524" strokeWidth="2" />
                <text x="45" y="24" fill="#F5A524" textAnchor="middle" fontSize="12" fontWeight="bold">INPUT (R)</text>
                <text x="45" y="40" fill="#94A3B8" textAnchor="middle" fontSize="10">Audio In</text>
              </g>

              <g transform="translate(200, 75)">
                <rect width="140" height="80" rx="10" fill="#1D2026" stroke="#22D3EE" strokeWidth="2.5" />
                <text x="70" y="26" fill="#FFFFFF" textAnchor="middle" fontSize="13" fontWeight="black">LEFT BUFFER</text>
                <text x="70" y="46" fill="#22D3EE" textAnchor="middle" fontSize="12" fontWeight="bold">{leftDiv} ({leftMs} ms)</text>
                <text x="70" y="66" fill="#94A3B8" textAnchor="middle" fontSize="10">FB: {leftFeedback}%</text>
              </g>

              <g transform="translate(200, 255)">
                <rect width="140" height="80" rx="10" fill="#1D2026" stroke="#F5A524" strokeWidth="2.5" />
                <text x="70" y="26" fill="#FFFFFF" textAnchor="middle" fontSize="13" fontWeight="black">RIGHT BUFFER</text>
                <text x="70" y="46" fill="#F5A524" textAnchor="middle" fontSize="12" fontWeight="bold">{rightDiv} ({rightMs} ms)</text>
                <text x="70" y="66" fill="#94A3B8" textAnchor="middle" fontSize="10">FB: {rightFeedback}%</text>
              </g>

              <path d="M 130 115 L 200 115" stroke="#22D3EE" strokeWidth="2.5" markerEnd="url(#arrow-cyan)" />
              <path d="M 130 295 L 200 295" stroke="#F5A524" strokeWidth="2.5" markerEnd="url(#arrow-amber)" />

              {!pingPong ? (
                <g>
                  <path d="M 340 100 C 400 60, 400 30, 270 30 C 230 30, 230 65, 230 75" fill="none" stroke="#22D3EE" strokeWidth="2.5" strokeDasharray="4 4" markerEnd="url(#arrow-cyan)" />
                  <text x="310" y="25" fill="#22D3EE" fontSize="10" fontWeight="bold">Direct Feedback (L)</text>

                  <path d="M 340 310 C 400 350, 400 380, 270 380 C 230 380, 230 345, 230 335" fill="none" stroke="#F5A524" strokeWidth="2.5" strokeDasharray="4 4" markerEnd="url(#arrow-amber)" />
                  <text x="310" y="395" fill="#F5A524" fontSize="10" fontWeight="bold">Direct Feedback (R)</text>
                </g>
              ) : (
                <g>
                  <path d="M 340 115 C 410 115, 170 295, 200 295" fill="none" stroke="#22D3EE" strokeWidth="3" markerEnd="url(#arrow-cyan)" />
                  <text x="360" y="180" fill="#22D3EE" fontSize="11" fontWeight="extrabold">Ping-Pong Cross L → R</text>

                  <path d="M 340 295 C 410 295, 170 115, 200 115" fill="none" stroke="#F5A524" strokeWidth="3" markerEnd="url(#arrow-amber)" />
                  <text x="360" y="240" fill="#F5A524" fontSize="11" fontWeight="extrabold">Ping-Pong Cross R → L</text>
                </g>
              )}

              <g transform="translate(450, 80)">
                <rect width="130" height="70" rx="10" fill="#1D2026" stroke="#64748B" strokeWidth="2" />
                <text x="65" y="22" fill="#FFFFFF" textAnchor="middle" fontSize="11" fontWeight="bold">TONE & DRIVE (L)</text>
                <text x="65" y="40" fill="#22D3EE" textAnchor="middle" fontSize="10">Drive: +{driveDb} dB</text>
                <text x="65" y="56" fill="#94A3B8" textAnchor="middle" fontSize="9">HPF:{hpfCutoff}Hz | LPF:{lpfCutoff}Hz</text>
              </g>

              <g transform="translate(450, 260)">
                <rect width="130" height="70" rx="10" fill="#1D2026" stroke="#64748B" strokeWidth="2" />
                <text x="65" y="22" fill="#FFFFFF" textAnchor="middle" fontSize="11" fontWeight="bold">TONE & DRIVE (R)</text>
                <text x="65" y="40" fill="#F5A524" textAnchor="middle" fontSize="10">Drive: +{driveDb} dB</text>
                <text x="65" y="56" fill="#94A3B8" textAnchor="middle" fontSize="9">HPF:{hpfCutoff}Hz | LPF:{lpfCutoff}Hz</text>
              </g>

              <path d="M 340 115 L 450 115" stroke="#22D3EE" strokeWidth="2" markerEnd="url(#arrow-cyan)" />
              <path d="M 340 295 L 450 295" stroke="#F5A524" strokeWidth="2" markerEnd="url(#arrow-amber)" />

              <g transform="translate(630, 165)">
                <rect width="110" height="80" rx="10" fill="#1D2026" stroke="#22D3EE" strokeWidth="2" />
                <text x="55" y="28" fill="#FFFFFF" textAnchor="middle" fontSize="12" fontWeight="bold">STEREO WIDTH</text>
                <text x="55" y="48" fill="#22D3EE" textAnchor="middle" fontSize="13" fontWeight="bold">{width}%</text>
                <text x="55" y="66" fill="#94A3B8" textAnchor="middle" fontSize="10">Mid/Side Matrix</text>
              </g>

              <path d="M 580 115 L 630 185" stroke="#22D3EE" strokeWidth="2" />
              <path d="M 580 295 L 630 225" stroke="#F5A524" strokeWidth="2" />

              <g transform="translate(780, 175)">
                <rect width="90" height="60" rx="10" fill="#22D3EE" />
                <text x="45" y="26" fill="#14161A" textAnchor="middle" fontSize="12" fontWeight="black">MASTER OUT</text>
                <text x="45" y="44" fill="#14161A" textAnchor="middle" fontSize="11" fontWeight="bold">35% Wet Blend</text>
              </g>

              <path d="M 740 205 L 780 205" stroke="#22D3EE" strokeWidth="3" markerEnd="url(#arrow-cyan)" />

              {isPulseActive && (
                <g key={pulseKey}>
                  <defs>
                    <filter id="glow-cyan" x="-50%" y="-50%" width="200%" height="200%">
                      <feGaussianBlur stdDeviation="3" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                    <filter id="glow-amber" x="-50%" y="-50%" width="200%" height="200%">
                      <feGaussianBlur stdDeviation="3" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>

                  {/* Left Input -> Left Buffer */}
                  <circle r="7" fill="#22D3EE" filter="url(#glow-cyan)">
                    <animateMotion path="M 40 115 L 200 115" dur="1.2s" repeatCount="indefinite" />
                  </circle>

                  {/* Left Buffer -> Tone L */}
                  <circle r="7" fill="#22D3EE" filter="url(#glow-cyan)">
                    <animateMotion path="M 340 115 L 450 115" dur="1.2s" begin="0.3s" repeatCount="indefinite" />
                  </circle>

                  {/* Tone L -> Stereo Width */}
                  <circle r="7" fill="#22D3EE" filter="url(#glow-cyan)">
                    <animateMotion path="M 580 115 L 630 185" dur="1.2s" begin="0.6s" repeatCount="indefinite" />
                  </circle>

                  {/* Ping Pong Cross L -> R */}
                  {pingPong && (
                    <circle r="7" fill="#22D3EE" filter="url(#glow-cyan)">
                      <animateMotion path="M 340 115 C 410 115, 170 295, 200 295" dur="1.5s" begin="0.4s" repeatCount="indefinite" />
                    </circle>
                  )}

                  {/* Right Input -> Right Buffer */}
                  <circle r="7" fill="#F5A524" filter="url(#glow-amber)">
                    <animateMotion path="M 40 295 L 200 295" dur="1.2s" begin="0.2s" repeatCount="indefinite" />
                  </circle>

                  {/* Right Buffer -> Tone R */}
                  <circle r="7" fill="#F5A524" filter="url(#glow-amber)">
                    <animateMotion path="M 340 295 L 450 295" dur="1.2s" begin="0.5s" repeatCount="indefinite" />
                  </circle>

                  {/* Tone R -> Stereo Width */}
                  <circle r="7" fill="#F5A524" filter="url(#glow-amber)">
                    <animateMotion path="M 580 295 L 630 225" dur="1.2s" begin="0.8s" repeatCount="indefinite" />
                  </circle>

                  {/* Ping Pong Cross R -> L */}
                  {pingPong && (
                    <circle r="7" fill="#F5A524" filter="url(#glow-amber)">
                      <animateMotion path="M 340 295 C 410 295, 170 115, 200 115" dur="1.5s" begin="0.6s" repeatCount="indefinite" />
                    </circle>
                  )}

                  {/* Stereo Width -> Master Out */}
                  <circle r="8" fill="#FFFFFF" filter="url(#glow-cyan)">
                    <animateMotion path="M 740 205 L 780 205" dur="0.8s" begin="0.9s" repeatCount="indefinite" />
                  </circle>
                </g>
              )}
            </svg>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-[#14161A] border border-gray-800">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-gray-300 block">Interactive Signal Pulse Test</span>
              <span className="text-xs text-gray-400 block">Click to emit a simulated transient and watch echoes travel through L/R routing paths.</span>
            </div>

            <button
              type="button"
              onClick={triggerPulse}
              className={`px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-md flex items-center justify-center space-x-2.5 shrink-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#22D3EE] ${
                isPulseActive
                  ? 'bg-[#22D3EE] text-[#14161A] shadow-lg shadow-[#22D3EE]/30 scale-105 border border-[#22D3EE]'
                  : 'bg-[#1D2026] text-gray-400 border border-gray-700/80 hover:text-white hover:border-gray-500'
              }`}
            >
              <span className={`w-2.5 h-2.5 rounded-full ${isPulseActive ? 'bg-[#14161A] animate-ping' : 'bg-gray-500'}`}></span>
              <span>{isPulseActive ? 'Impulse Active (Click to Stop)' : 'Simulate Impulse Ping'}</span>
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};
