import React, { useState } from 'react';

export const InteractiveVisualizer: React.FC = () => {
  const [pingPong, setPingPong] = useState(true);
  const [leftDiv, setLeftDiv] = useState('1/4');
  const [rightDiv, setRightDiv] = useState('1/8D');
  const [driveDb, setDriveDb] = useState(4.0);
  const [hpfCutoff, setHpfCutoff] = useState(150);
  const [lpfCutoff, setLpfCutoff] = useState(7500);
  const [width, setWidth] = useState(130);
  const [mix, setMix] = useState(40);
  const [leftFeedback, setLeftFeedback] = useState(50);
  const [rightFeedback, setRightFeedback] = useState(50);

  const [isPulseActive, setIsPulseActive] = useState(false);
  const [pulseKey, setPulseKey] = useState(0);

  // Exact ON/OFF Toggle Switch Handler (NO setTimeout)
  const triggerPulse = () => {
    setIsPulseActive((prev) => {
      const nextState = !prev;
      if (nextState) {
        setPulseKey((k) => k + 1);
      }
      return nextState;
    });
  };

  const leftMs = 500;
  const rightMs = 375;

  return (
    <section id="routing-visualizer" className="py-16 bg-[#14161A] border-b border-gray-800/60 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Banner Notice */}
        <div className="mb-6 p-3 rounded-xl bg-[#22D3EE]/10 border border-[#22D3EE]/30 text-center">
          <span className="text-xs font-mono font-bold text-[#22D3EE] tracking-widest uppercase">
            EDUCATIONAL VISUALIZATION — NOT THE ACTUAL NATIVE PLUGIN INTERFACE
          </span>
        </div>

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-[#22D3EE] block mb-2">
            Signal Routing Architecture
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Interactive Signal Flow & Delay Matrix
          </h2>
          <p className="mt-3 text-gray-300 text-sm sm:text-base leading-relaxed">
            Understand how stereo delay buffers, cross-channel ping-pong feedback loops, saturation, and tone filters process your audio signal.
          </p>
        </div>

        {/* Top Control Panel: Routing Mode Toggle */}
        <div className="p-6 rounded-3xl bg-[#1D2026] border border-gray-800 shadow-2xl space-y-6 mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-gray-400 block">
                Routing Mode Matrix
              </span>
              <div className="inline-flex p-1 rounded-2xl bg-[#14161A] border border-gray-800">
                <button
                  type="button"
                  onClick={() => setPingPong(true)}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    pingPong
                      ? 'bg-[#22D3EE] text-[#14161A] shadow-md shadow-[#22D3EE]/20'
                      : 'text-gray-400 hover:text-white'
                  }`}
                  aria-label="Select Ping-Pong Routing Mode"
                >
                  Ping-Pong (Cross Feedback)
                </button>
                <button
                  type="button"
                  onClick={() => setPingPong(false)}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    !pingPong
                      ? 'bg-[#F5A524] text-[#14161A] shadow-md shadow-[#F5A524]/20'
                      : 'text-gray-400 hover:text-white'
                  }`}
                  aria-label="Select Standard Stereo Routing Mode"
                >
                  Standard (Parallel Stereo)
                </button>
              </div>
            </div>

            <div className="space-y-2 text-center md:text-right">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-gray-400 block">
                Signal Impulse Switch
              </span>
              <button
                type="button"
                onClick={triggerPulse}
                className={`px-8 py-3.5 rounded-2xl font-bold text-xs tracking-wider uppercase transition-all shadow-xl flex items-center space-x-2.5 mx-auto md:ml-auto cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#22D3EE] ${
                  isPulseActive
                    ? 'bg-[#22D3EE] text-[#14161A] shadow-lg shadow-[#22D3EE]/30 scale-105 border border-[#22D3EE]'
                    : 'bg-[#1D2026] text-gray-400 border border-gray-700/80 hover:text-white hover:border-gray-500'
                }`}
                aria-label="Toggle Audio Impulse Ping"
              >
                <span className={`w-3 h-3 rounded-full ${isPulseActive ? 'bg-[#14161A] animate-ping' : 'bg-gray-500'}`}></span>
                <span>{isPulseActive ? 'Impulse Active (Click to Stop)' : 'Simulate Impulse Ping'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Visualizer SVG Diagram Panel */}
        <div className="p-8 rounded-3xl bg-[#1D2026] border border-gray-800 shadow-2xl space-y-8 relative overflow-hidden">
          <div className="w-full overflow-x-auto">
            <svg viewBox="0 0 900 420" className="w-full h-auto min-w-[750px]">
              <defs>
                <marker id="arrow-cyan" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M0,0 L10,5 L0,10 Z" fill="#22D3EE" />
                </marker>
                <marker id="arrow-amber" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M0,0 L10,5 L0,10 Z" fill="#F5A524" />
                </marker>

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

              {/* INPUT (L) */}
              <g transform="translate(40, 90)">
                <rect width="90" height="50" rx="8" fill="#1D2026" stroke="#22D3EE" strokeWidth="2" />
                <text x="45" y="24" fill="#22D3EE" textAnchor="middle" fontSize="12" fontWeight="bold">INPUT (L)</text>
                <text x="45" y="40" fill="#94A3B8" textAnchor="middle" fontSize="10">Audio In</text>
              </g>

              {/* INPUT (R) */}
              <g transform="translate(40, 270)">
                <rect width="90" height="50" rx="8" fill="#1D2026" stroke="#F5A524" strokeWidth="2" />
                <text x="45" y="24" fill="#F5A524" textAnchor="middle" fontSize="12" fontWeight="bold">INPUT (R)</text>
                <text x="45" y="40" fill="#94A3B8" textAnchor="middle" fontSize="10">Audio In</text>
              </g>

              {/* LEFT BUFFER */}
              <g transform="translate(200, 75)">
                <rect width="140" height="80" rx="10" fill="#1D2026" stroke="#22D3EE" strokeWidth="2.5" />
                <text x="70" y="26" fill="#FFFFFF" textAnchor="middle" fontSize="13" fontWeight="black">LEFT BUFFER</text>
                <text x="70" y="46" fill="#22D3EE" textAnchor="middle" fontSize="12" fontWeight="bold">{leftDiv} ({leftMs} ms)</text>
                <text x="70" y="66" fill="#94A3B8" textAnchor="middle" fontSize="10">FB: {leftFeedback}%</text>
              </g>

              {/* RIGHT BUFFER */}
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

              {/* TONE & DRIVE (L) */}
              <g transform="translate(450, 80)">
                <rect width="130" height="70" rx="10" fill="#1D2026" stroke="#64748B" strokeWidth="2" />
                <text x="65" y="22" fill="#FFFFFF" textAnchor="middle" fontSize="11" fontWeight="bold">TONE & DRIVE (L)</text>
                <text x="65" y="40" fill="#22D3EE" textAnchor="middle" fontSize="10">Drive: +{driveDb} dB</text>
                <text x="65" y="56" fill="#94A3B8" textAnchor="middle" fontSize="9">HPF:{hpfCutoff}Hz | LPF:{lpfCutoff}Hz</text>
              </g>

              {/* TONE & DRIVE (R) */}
              <g transform="translate(450, 260)">
                <rect width="130" height="70" rx="10" fill="#1D2026" stroke="#64748B" strokeWidth="2" />
                <text x="65" y="22" fill="#FFFFFF" textAnchor="middle" fontSize="11" fontWeight="bold">TONE & DRIVE (R)</text>
                <text x="65" y="40" fill="#F5A524" textAnchor="middle" fontSize="10">Drive: +{driveDb} dB</text>
                <text x="65" y="56" fill="#94A3B8" textAnchor="middle" fontSize="9">HPF:{hpfCutoff}Hz | LPF:{lpfCutoff}Hz</text>
              </g>

              <path d="M 340 115 L 450 115" stroke="#22D3EE" strokeWidth="2" markerEnd="url(#arrow-cyan)" />
              <path d="M 340 295 L 450 295" stroke="#F5A524" strokeWidth="2" markerEnd="url(#arrow-amber)" />

              {/* STEREO WIDTH */}
              <g transform="translate(630, 165)">
                <rect width="110" height="80" rx="10" fill="#1D2026" stroke="#22D3EE" strokeWidth="2" />
                <text x="55" y="28" fill="#FFFFFF" textAnchor="middle" fontSize="12" fontWeight="bold">STEREO WIDTH</text>
                <text x="55" y="48" fill="#22D3EE" textAnchor="middle" fontSize="13" fontWeight="bold">{width}%</text>
                <text x="55" y="66" fill="#94A3B8" textAnchor="middle" fontSize="10">Mid/Side Matrix</text>
              </g>

              <path d="M 580 115 L 630 185" stroke="#22D3EE" strokeWidth="2" />
              <path d="M 580 295 L 630 225" stroke="#F5A524" strokeWidth="2" />

              {/* MASTER OUT */}
              <g transform="translate(780, 175)">
                <rect width="90" height="60" rx="10" fill="#22D3EE" />
                <text x="45" y="26" fill="#14161A" textAnchor="middle" fontSize="12" fontWeight="black">MASTER OUT</text>
                <text x="45" y="44" fill="#14161A" textAnchor="middle" fontSize="11" fontWeight="bold">35% Wet Blend</text>
              </g>

              <path d="M 740 205 L 780 205" stroke="#22D3EE" strokeWidth="3" markerEnd="url(#arrow-cyan)" />

              {/* CONTINUOUS GLOWING PULSE ANIMATION TRAVERSING ENTIRE DIAGRAM WHEN ON */}
              {isPulseActive && (
                <g key={pulseKey}>
                  <circle r="7" fill="#22D3EE" filter="url(#glow-cyan)">
                    <animateMotion path="M 40 115 L 200 115" dur="1.2s" repeatCount="indefinite" />
                  </circle>
                  <circle r="7" fill="#22D3EE" filter="url(#glow-cyan)">
                    <animateMotion path="M 340 115 L 450 115" dur="1.2s" begin="0.3s" repeatCount="indefinite" />
                  </circle>
                  <circle r="7" fill="#22D3EE" filter="url(#glow-cyan)">
                    <animateMotion path="M 580 115 L 630 185" dur="1.2s" begin="0.6s" repeatCount="indefinite" />
                  </circle>
                  {pingPong && (
                    <circle r="7" fill="#22D3EE" filter="url(#glow-cyan)">
                      <animateMotion path="M 340 115 C 410 115, 170 295, 200 295" dur="1.5s" begin="0.4s" repeatCount="indefinite" />
                    </circle>
                  )}

                  <circle r="7" fill="#F5A524" filter="url(#glow-amber)">
                    <animateMotion path="M 40 295 L 200 295" dur="1.2s" begin="0.2s" repeatCount="indefinite" />
                  </circle>
                  <circle r="7" fill="#F5A524" filter="url(#glow-amber)">
                    <animateMotion path="M 340 295 L 450 295" dur="1.2s" begin="0.5s" repeatCount="indefinite" />
                  </circle>
                  <circle r="7" fill="#F5A524" filter="url(#glow-amber)">
                    <animateMotion path="M 580 295 L 630 225" dur="1.2s" begin="0.8s" repeatCount="indefinite" />
                  </circle>
                  {pingPong && (
                    <circle r="7" fill="#F5A524" filter="url(#glow-amber)">
                      <animateMotion path="M 340 295 C 410 295, 170 115, 200 115" dur="1.5s" begin="0.6s" repeatCount="indefinite" />
                    </circle>
                  )}

                  <circle r="8" fill="#FFFFFF" filter="url(#glow-cyan)">
                    <animateMotion path="M 740 205 L 780 205" dur="0.8s" begin="0.9s" repeatCount="indefinite" />
                  </circle>
                </g>
              )}
            </svg>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-[#14161A] border border-gray-800">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-gray-300 block">Interactive Signal Pulse Switch</span>
              <span className="text-xs text-gray-400 block">Click the ON/OFF switch to start or stop the real-time signal impulse simulation.</span>
            </div>

            <button
              type="button"
              onClick={triggerPulse}
              className={`px-6 py-3 rounded-xl text-sm font-extrabold transition-all shadow-lg flex items-center justify-center space-x-2 shrink-0 cursor-pointer ${
                isPulseActive
                  ? 'bg-[#22D3EE] text-[#14161A] shadow-[#22D3EE]/30 scale-105 border border-[#22D3EE]'
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
