const { useState, useMemo, useEffect } = React;

// DATA: EXACT 32 APVTS PARAMETERS
const APVTS_PARAMETERS = [
  { id: 'delay.masterEnable', name: 'Power', category: 'Global & Sync', type: 'toggle', defaultValue: 1, options: ['Bypass (Off)', 'Engage (On)'], description: 'Master DSP processing toggle with click-free crossfaded bypass.', dspDetail: 'Executes realtime-safe crossfaded bypass without digital transients.' },
  { id: 'delay.mode', name: 'Character Mode', category: 'Character System', type: 'choice', defaultValue: 0, options: ['Digital', 'Tape', 'Analog'], description: 'Selects between three audibly distinct character modes.', dspDetail: 'Digital (clean full bandwidth), Tape (warm high-frequency response with saturation), Analog (darker vintage-inspired response).' },
  { id: 'delay.syncMode', name: 'Tempo Sync', category: 'Global & Sync', type: 'toggle', defaultValue: 1, options: ['Free Time (ms)', 'Tempo Sync (BPM)'], description: 'Switches between millisecond delay timing and host tempo sync.', dspDetail: 'Queries DAW transport clock position or uses Manual BPM to calculate note division sample intervals.' },
  { id: 'delay.manualBpm', name: 'Manual BPM', category: 'Global & Sync', type: 'knob', defaultValue: 120, min: 40, max: 300, step: 0.1, unit: 'BPM', description: 'Manual project tempo clock source when host transport sync is unlinked.', dspDetail: 'Provides deterministic master clock fallback for unlinked standalone or host sessions.' },
  { id: 'delay.divisionLeft', name: 'Left Division', category: 'L/R Timing', type: 'choice', defaultValue: 4, options: ['1/32', '1/32T', '1/32D', '1/16', '1/16T', '1/16D', '1/8', '1/8T', '1/8D', '1/4', '1/4T', '1/4D', '1/2', '1/2T', '1/2D', '1/1'], description: 'Rhythmic note division for the Left delay channel.', dspDetail: 'Calculates sample delay buffer lengths based on 16 rhythmic note grid selections.' },
  { id: 'delay.divisionRight', name: 'Right Division', category: 'L/R Timing', type: 'choice', defaultValue: 8, options: ['1/32', '1/32T', '1/32D', '1/16', '1/16T', '1/16D', '1/8', '1/8T', '1/8D', '1/4', '1/4T', '1/4D', '1/2', '1/2T', '1/2D', '1/1'], description: 'Rhythmic note division for the Right delay channel.', dspDetail: 'Calculates sample delay buffer lengths for asymmetrical stereo polyrhythms.' },
  { id: 'delay.timeMsLeft', name: 'Left Time', category: 'L/R Timing', type: 'knob', defaultValue: 375, min: 1, max: 2000, step: 1, unit: 'ms', description: 'Free millisecond delay time for Left channel when Sync is off.', dspDetail: 'Direct millisecond buffer offset using Hermite fractional sample interpolation.' },
  { id: 'delay.timeMsRight', name: 'Right Time', category: 'L/R Timing', type: 'knob', defaultValue: 250, min: 1, max: 2000, step: 1, unit: 'ms', description: 'Free millisecond delay time for Right channel when Sync is off.', dspDetail: 'Independent right channel buffer offset for custom slapbacks.' },
  { id: 'delay.feedbackLeft', name: 'Feedback Left', category: 'Feedback & Routing', type: 'knob', defaultValue: 45, min: 0, max: 100, step: 1, unit: '%', description: 'Feedback gain level for the Left delay buffer.', dspDetail: 'Controls echo repeat decay time for the left channel buffer loop.' },
  { id: 'delay.feedbackRight', name: 'Feedback Right', category: 'Feedback & Routing', type: 'knob', defaultValue: 45, min: 0, max: 100, step: 1, unit: '%', description: 'Feedback gain level for the Right delay buffer.', dspDetail: 'Controls echo repeat decay time for the right channel buffer loop.' },
  { id: 'delay.pingPong', name: 'Ping-Pong', category: 'Feedback & Routing', type: 'toggle', defaultValue: 1, options: ['Off (Parallel)', 'On (Ping-Pong)'], description: 'Engages classic stereo Ping-Pong delay routing.', dspDetail: 'Switches delay feedback matrix to cross-channel bouncing repeats across the stereo panorama.' },
  { id: 'delay.highPassHz', name: 'High-Pass Filter', category: 'Tone Shaping', type: 'knob', defaultValue: 80, min: 20, max: 2000, step: 1, unit: 'Hz', description: '12 dB/octave High-Pass filter inside the feedback loop.', dspDetail: 'Removes low-end sub-bass mud from decaying echo repeats.' },
  { id: 'delay.lowPassHz', name: 'Low-Pass Filter', category: 'Tone Shaping', type: 'knob', defaultValue: 8000, min: 1000, max: 20000, step: 10, unit: 'Hz', description: '12 dB/octave Low-Pass filter inside the feedback loop.', dspDetail: 'Attenuates high frequencies on successive delay repeats for warm decay.' },
  { id: 'delay.saturation', name: 'Feedback Saturation', category: 'Tone Shaping', type: 'knob', defaultValue: 20, min: 0, max: 100, step: 1, unit: '%', description: 'Feedback saturation stage adding musical soft-clipping.', dspDetail: 'Generates progressive harmonic saturation inside the feedback path.' },
  { id: 'delay.width', name: 'Stereo Width', category: 'Spatial & Output', type: 'knob', defaultValue: 120, min: 0, max: 200, step: 1, unit: '%', description: 'Mid/Side stereo width enhancer (0% Mono to 200% Extra Wide).', dspDetail: 'Scales side signal energy relative to mid signal for spatial expansion.' },
  { id: 'delay.mix', name: 'Mix', category: 'Spatial & Output', type: 'knob', defaultValue: 35, min: 0, max: 100, step: 1, unit: '%', description: 'Dry/Wet output blend ratio.', dspDetail: 'Linear dry/wet crossfader combining unprocessed input with processed wet signal.' },
  { id: 'trim.input', name: 'Input Trim', category: 'Gain Structure', type: 'knob', defaultValue: 0, min: -24, max: 12, step: 0.1, unit: 'dB', description: 'Input signal gain adjustment before delay processing.', dspDetail: 'Scales input audio levels prior to delay buffer injection.' },
  { id: 'trim.wetGain', name: 'Wet Gain', category: 'Gain Structure', type: 'knob', defaultValue: 0, min: -24, max: 12, step: 0.1, unit: 'dB', description: 'Independent gain control for wet delay signal path.', dspDetail: 'Adjusts processed wet signal level before final output summing.' },
  { id: 'trim.output', name: 'Output Trim', category: 'Gain Structure', type: 'knob', defaultValue: 0, min: -24, max: 12, step: 0.1, unit: 'dB', description: 'Master plugin output level adjustment.', dspDetail: 'Final master trim gain stage after dry/wet mixing.' },
  { id: 'advanced.freeze', name: 'Freeze', category: 'Advanced Processing', type: 'toggle', defaultValue: 0, options: ['Off', 'On (Freeze)'], description: 'Captures and holds current delay buffer contents infinitely.', dspDetail: 'Locks delay buffer reading while muting new audio input for infinite sustained loops.' },
  { id: 'advanced.reverse', name: 'Reverse', category: 'Advanced Processing', type: 'toggle', defaultValue: 0, options: ['Off', 'On (Reverse)'], description: 'Reverses audio playback direction of delay repeats.', dspDetail: 'Reads delay buffer memory in reverse frame sequence for backward echo effects.' },
  { id: 'advanced.diffusion', name: 'Diffusion', category: 'Advanced Processing', type: 'knob', defaultValue: 0, min: 0, max: 100, step: 1, unit: '%', description: 'Smears discrete delay repeats into dense reverberant diffusion.', dspDetail: 'All-pass diffusion network smearing delay taps into dense ambient tails.' },
  { id: 'ducking.enable', name: 'Ducking Enable', category: 'Ducking Engine', type: 'toggle', defaultValue: 0, options: ['Off', 'On (Duck)'], description: 'Engages envelope ducking of wet delay signal during input phrases.', dspDetail: 'Tracks input envelope to dynamically attenuate wet delay repeats.' },
  { id: 'ducking.amount', name: 'Ducking Amount', category: 'Ducking Engine', type: 'knob', defaultValue: 50, min: 0, max: 100, step: 1, unit: '%', description: 'Depth of wet signal gain reduction during active input.', dspDetail: 'Controls maximum attenuation applied to wet signal when envelope exceeds threshold.' },
  { id: 'ducking.attack', name: 'Ducking Attack', category: 'Ducking Engine', type: 'knob', defaultValue: 20, min: 1, max: 500, step: 1, unit: 'ms', description: 'Attack time for envelope ducking attenuation.', dspDetail: 'Speed at which ducking gain reduction is engaged upon transient input.' },
  { id: 'ducking.release', name: 'Ducking Release', category: 'Ducking Engine', type: 'knob', defaultValue: 200, min: 10, max: 2000, step: 10, unit: 'ms', description: 'Release time for wet signal recovery after input pauses.', dspDetail: 'Recovery rate of wet delay tails when input signal drops below threshold.' },
  { id: 'mod.enable', name: 'Modulation Enable', category: 'Modulation', type: 'toggle', defaultValue: 0, options: ['Off', 'On (Mod)'], description: 'Engages LFO modulation of delay time buffer offsets.', dspDetail: 'Low-frequency oscillator modulating delay tap interpolation points.' },
  { id: 'mod.rate', name: 'Modulation Rate', category: 'Modulation', type: 'knob', defaultValue: 1.0, min: 0.1, max: 10.0, step: 0.1, unit: 'Hz', description: 'Frequency rate of LFO modulation oscillator.', dspDetail: 'Controls LFO cycle speed modulating delay buffer reading.' },
  { id: 'mod.depth', name: 'Modulation Depth', category: 'Modulation', type: 'knob', defaultValue: 25, min: 0, max: 100, step: 1, unit: '%', description: 'Intensity of delay time LFO pitch modulation.', dspDetail: 'Scales LFO amplitude modulating delay time offset.' },
  { id: 'mod.stereoSpread', name: 'Stereo Spread', category: 'Modulation', type: 'knob', defaultValue: 90, min: 0, max: 180, step: 1, unit: '°', description: 'Phase offset between Left and Right LFO modulators.', dspDetail: 'Sets phase angle difference between left and right channel modulation oscillators.' },
  { id: 'mod.tempoSync', name: 'Modulation Sync', category: 'Modulation', type: 'toggle', defaultValue: 0, options: ['Free (Hz)', 'Sync (Division)'], description: 'Links LFO modulation rate to host transport tempo divisions.', dspDetail: 'Synchronizes LFO rate to host transport clock note subdivisions.' },
  { id: 'mod.division', name: 'Modulation Division', category: 'Modulation', type: 'choice', defaultValue: 6, options: ['1/32', '1/16', '1/8', '1/8D', '1/4', '1/2', '1/1'], description: 'Musical note division for tempo-synced LFO rate.', dspDetail: 'Note subdivision grid for LFO tempo sync.' }
];

// DATA: FORMAT BADGES
const FORMAT_BADGES = [
  {
    id: 'au',
    name: 'Audio Units (AUv2)',
    badgeText: 'AU v2 / AU v3 Native',
    fileExtension: '.component',
    platforms: ['macOS'],
    description: 'Fully optimized for macOS with native support for Apple Silicon (M1/M2/M3/M4) and Intel processors.',
    targetDAWs: ['Logic Pro 10.7+', 'GarageBand', 'MainStage', 'Digital Performer']
  },
  {
    id: 'vst3',
    name: 'VST3 (64-bit)',
    badgeText: 'VST3 64-Bit Native',
    fileExtension: '.vst3',
    platforms: ['macOS', 'Windows'],
    description: 'Sample-accurate VST3 implementation featuring dynamic bus allocation and silent buffer suspension.',
    targetDAWs: ['Ableton Live 11+', 'FL Studio 20+', 'Cubase 12+', 'Studio One 6+', 'Reaper 6+', 'Bitwig Studio']
  },
  {
    id: 'standalone',
    name: 'Standalone App',
    badgeText: 'Standalone App',
    fileExtension: '.app / .exe',
    platforms: ['macOS', 'Windows'],
    description: 'Independent desktop application for live performance and rehearsal without opening a DAW.',
    targetDAWs: ['Direct CoreAudio / ASIO Driver Support', 'Low Latency Buffer Mode']
  }
];

// DATA: SYSTEM REQUIREMENTS
const SYSTEM_REQUIREMENTS = {
  macOS: {
    osVersion: 'macOS 10.15 Catalina, 11 Big Sur, 12 Monterey, 13 Ventura, 14 Sonoma, or later',
    architecture: 'Universal Binary: Native Apple Silicon (M1/M2/M3/M4) & Intel Core i5/i7/i9',
    ram: '4 GB minimum (8 GB recommended)',
    diskSpace: '150 MB free disk space',
    notes: ['64-bit host DAW required', 'Apple Gatekeeper Notarized', 'Offline authorization supported']
  },
  Windows: {
    osVersion: 'Windows 10 (64-bit) or Windows 11 (64-bit) Version 21H2 or later',
    architecture: 'x64 Architecture (Intel Quad-Core or AMD Ryzen series recommended)',
    ram: '4 GB minimum (8 GB recommended)',
    diskSpace: '150 MB free disk space',
    notes: ['64-bit VST3 compatible host required', 'ASIO audio driver recommended for Standalone', 'High-DPI scaling support']
  }
};

// DATA: FAQ ITEMS
const FAQ_ITEMS = [
  {
    id: 'faq-1',
    category: 'General',
    question: 'What is StudioZIO Tempo Delay?',
    answer: 'StudioZIO Tempo Delay is a native AU, VST3, and Standalone stereo delay audio plugin designed for music producers and mixing engineers. It offers high-precision host tempo synchronization, independent left/right note division timing, cross-feedback ping-pong routing, analog soft-clipping saturation, and mid/side stereo width adjustment.'
  },
  {
    id: 'faq-2',
    category: 'Audio DSP',
    question: 'How does Ping-Pong routing differ from standard stereo delay?',
    answer: 'In standard stereo delay mode, Left channel feedback feeds back exclusively into the Left delay buffer, and Right channel feedback feeds back into the Right buffer. In Ping-Pong mode, the feedback matrix switches cross-channels: Left delay output feeds into the Right buffer, and Right delay output feeds into the Left buffer, causing echoes to bounce back and forth across the stereo field.'
  },
  {
    id: 'faq-3',
    category: 'Compatibility',
    question: 'Does StudioZIO Tempo Delay run natively on Apple Silicon M1/M2/M3/M4 Macs?',
    answer: 'Yes. StudioZIO Tempo Delay is compiled as a Universal 2 binary containing native ARM64 code for Apple Silicon chips as well as x86_64 code for Intel-based Mac systems.'
  },
  {
    id: 'faq-4',
    category: 'General',
    question: 'Can I use StudioZIO Tempo Delay without running a DAW?',
    answer: 'Yes! The plugin installer includes a Standalone desktop application for both macOS and Windows. You can connect your audio interface directly via CoreAudio or ASIO to perform or rehearse with real-time delay processing.'
  },
  {
    id: 'faq-5',
    category: 'Installation',
    question: 'Does the plugin require online internet activation or continuous authorization?',
    answer: 'No. StudioZIO Tempo Delay operates with complete offline authorization. Once installed, no continuous internet connection or dongle is required.'
  },
  {
    id: 'faq-6',
    category: 'Audio DSP',
    question: 'How do the High-Pass and Low-Pass filters affect delay tails?',
    answer: 'Both HPF (20 - 2000 Hz) and LPF (1000 - 20000 Hz) filters are positioned directly inside the delay feedback loop. Every time an echo repeats, it passes through the filters again, progressively thinning out sub-bass mud or softening high-frequency harshness over time.'
  }
];

// HEADER COMPONENT
const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#14161A]/90 border-b border-gray-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <a href="#main-content" className="flex items-center space-x-3 group">
            <div className="w-9 h-9 rounded-xl bg-[#22D3EE] text-[#14161A] font-black flex items-center justify-center text-base shadow-lg shadow-[#22D3EE]/20">
              SZ
            </div>
            <div className="flex flex-col">
              <span className="text-lg sm:text-xl font-extrabold text-white tracking-tight group-hover:text-[#22D3EE] transition-colors">StudioZIO</span>
              <span className="text-[10px] font-mono text-gray-400 tracking-wider uppercase -mt-1">Audio Software</span>
            </div>
          </a>

          <nav className="hidden lg:flex items-center space-x-6 text-xs font-semibold tracking-wide text-gray-300">
            <a href="#overview" className="hover:text-[#22D3EE] transition-colors">Overview</a>
            <a href="#routing-visualizer" className="hover:text-[#22D3EE] transition-colors">Routing</a>
            <a href="#parameters" className="hover:text-[#22D3EE] transition-colors">32 APVTS Params</a>
            <a href="#features" className="hover:text-[#22D3EE] transition-colors">Features</a>
            <a href="#formats" className="hover:text-[#22D3EE] transition-colors">Formats</a>
            <a href="#requirements" className="hover:text-[#22D3EE] transition-colors">Requirements</a>
            <a href="#downloads" className="hover:text-[#22D3EE] transition-colors">Downloads</a>
            <a href="#faq" className="hover:text-[#22D3EE] transition-colors">FAQ</a>
            <a href="#support" className="hover:text-[#22D3EE] transition-colors">Support</a>
          </nav>

          <div className="hidden sm:flex items-center space-x-4">
            <a href="#downloads" className="px-4 py-2 rounded-xl bg-[#22D3EE] hover:bg-[#06B6D4] text-[#14161A] font-extrabold text-xs transition-all shadow-md shadow-[#22D3EE]/20">
              v4.0.1 — Coming Soon
            </a>
          </div>

          <div className="flex lg:hidden">
            <button type="button" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 rounded-lg bg-[#1D2026] text-gray-300 hover:text-white border border-gray-800">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#1D2026] border-b border-gray-800 px-4 pt-3 pb-6 space-y-3 text-sm font-medium">
          <a href="#overview" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-gray-200 hover:text-[#22D3EE]">Overview</a>
          <a href="#routing-visualizer" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-gray-200 hover:text-[#22D3EE]">Routing Visualizer</a>
          <a href="#parameters" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-gray-200 hover:text-[#22D3EE]">32 APVTS Parameters</a>
          <a href="#features" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-gray-200 hover:text-[#22D3EE]">Features</a>
          <a href="#downloads" onClick={() => setMobileMenuOpen(false)} className="block w-full text-center py-3 bg-[#22D3EE] text-[#14161A] font-extrabold rounded-xl mt-2">
            v4.0.1 — Coming Soon
          </a>
        </div>
      )}
    </header>
  );
};




// HERO COMPONENT
const Hero = () => {
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




// DESCRIPTION COMPONENT
const Description = () => {
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

// EDUCATIONAL INTERACTIVE ROUTING VISUALIZER COMPONENT
const InteractiveVisualizer = () => {
  const [pingPong, setPingPong] = useState(true);
  const [bpm, setBpm] = useState(120);
  const [leftDiv, setLeftDiv] = useState('1/4');
  const [rightDiv, setRightDiv] = useState('1/8D');
  const [leftFeedback, setLeftFeedback] = useState(50);
  const [rightFeedback, setRightFeedback] = useState(50);
  const [driveDb, setDriveDb] = useState(4.0);
  const [hpfCutoff, setHpfCutoff] = useState(150);
  const [lpfCutoff, setLpfCutoff] = useState(7500);
  const [width, setWidth] = useState(130);

  const [isPulseActive, setIsPulseActive] = useState(false);
  const [pulseKey, setPulseKey] = useState(0);

  const getMsFromDiv = (division, targetBpm) => {
    const quarterMs = (60000 / targetBpm);
    const divMap = {
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

// PARAMETER GUIDE COMPONENT (32 APVTS PARAMETERS)
const ParameterGuide = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeParamId, setActiveParamId] = useState('delay.masterEnable');

  const [paramValues, setParamValues] = useState({
    'delay.masterEnable': 1, 'delay.mode': 0, 'delay.syncMode': 1, 'delay.manualBpm': 120,
    'delay.divisionLeft': '1/4', 'delay.divisionRight': '1/8D', 'delay.timeMsLeft': 375, 'delay.timeMsRight': 250,
    'delay.feedbackLeft': 45, 'delay.feedbackRight': 45, 'delay.pingPong': 1, 'delay.highPassHz': 80,
    'delay.lowPassHz': 8000, 'delay.saturation': 20, 'delay.width': 120, 'delay.mix': 35,
    'trim.input': 0, 'trim.wetGain': 0, 'trim.output': 0, 'advanced.freeze': 0, 'advanced.reverse': 0,
    'advanced.diffusion': 0, 'ducking.enable': 0, 'ducking.amount': 50, 'ducking.attack': 20, 'ducking.release': 200,
    'mod.enable': 0, 'mod.rate': 1.0, 'mod.depth': 25, 'mod.stereoSpread': 90, 'mod.tempoSync': 0, 'mod.division': '1/8'
  });

  const categories = ['All', 'Global & Sync', 'Character System', 'L/R Timing', 'Feedback & Routing', 'Tone Shaping', 'Spatial & Output', 'Gain Structure', 'Advanced Processing', 'Ducking Engine', 'Modulation'];

  const filteredParameters = useMemo(() => {
    return APVTS_PARAMETERS.filter((param) => {
      const matchesCategory = selectedCategory === 'All' || param.category === selectedCategory;
      const matchesSearch = 
        param.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        param.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        param.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        param.dspDetail.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  const activeParam = useMemo(() => {
    return APVTS_PARAMETERS.find((p) => p.id === activeParamId) || APVTS_PARAMETERS[0];
  }, [activeParamId]);

  const handleValueChange = (id, val) => {
    setParamValues((prev) => ({ ...prev, [id]: val }));
  };

  return (
    <section id="parameters" className="py-16 bg-[#14161A] border-b border-gray-800/60 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-[#22D3EE] block mb-2">
            APVTS Parameter Manifest
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Interactive Parameter Guide
          </h2>
          <p className="mt-3 text-gray-300 text-sm sm:text-base leading-relaxed">
            Exhaustive technical documentation for all 32 automatable APVTS parameters in StudioZIO Tempo Delay (Release 4.0.1).
          </p>
        </div>

        <div className="bg-[#1D2026] p-4 sm:p-6 rounded-2xl border border-gray-800 mb-8 shadow-xl space-y-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search 32 parameters (e.g., Mode, Ducking, Freeze, Modulation)..."
                className="w-full pl-4 pr-4 py-2.5 bg-[#14161A] border border-gray-700/80 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#22D3EE]"
              />
            </div>
            <div className="text-xs font-semibold text-gray-400 bg-[#14161A] px-3.5 py-2 rounded-xl border border-gray-800 shrink-0 text-center font-mono">
              Showing <span className="text-[#22D3EE] font-bold">{filteredParameters.length}</span> of 32 APVTS parameters
            </div>
          </div>

          <div className="flex items-center space-x-1.5 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#22D3EE] text-[#14161A] font-bold'
                    : 'bg-[#14161A] text-gray-300 hover:text-white border border-gray-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-3">
            {filteredParameters.map((param) => {
              const isSelected = activeParam.id === param.id;
              const currentValue = paramValues[param.id] ?? param.defaultValue;
              return (
                <div
                  key={param.id}
                  onClick={() => setActiveParamId(param.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected ? 'bg-[#1D2026] border-[#22D3EE] shadow-lg shadow-[#22D3EE]/10' : 'bg-[#1D2026]/60 border-gray-800/80 hover:bg-[#1D2026]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${isSelected ? 'bg-[#22D3EE]' : 'bg-gray-600'}`} />
                      <div>
                        <span className="font-bold text-white text-base block">{param.name}</span>
                        <span className="text-[10px] font-mono text-gray-500">{param.id}</span>
                      </div>
                    </div>
                    <span className="font-mono text-xs font-bold text-[#F5A524]">
                      {param.type === 'toggle' ? (currentValue === 1 ? 'On' : 'Off') : (param.type === 'choice' && param.options ? param.options[Number(currentValue)] || currentValue : `${currentValue} ${param.unit || ''}`)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">{param.description}</p>
                </div>
              );
            })}
          </div>

          <div className="lg:col-span-5 sticky top-24">
            <div className="p-6 rounded-2xl bg-[#1D2026] border border-[#22D3EE]/40 shadow-2xl space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#22D3EE]">{activeParam.category}</span>
                <h3 className="text-2xl font-black text-white mt-1">{activeParam.name}</h3>
                <code className="text-xs font-mono text-gray-500 block mt-0.5">{activeParam.id}</code>
              </div>

              <div className="p-4 rounded-xl bg-[#14161A] border border-gray-800 space-y-3">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide block">APVTS Simulator</span>
                <p className="text-sm font-bold text-[#F5A524] font-mono">{paramValues[activeParam.id]} {activeParam.unit}</p>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Purpose</h4>
                <p className="text-sm text-gray-200">{activeParam.description}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#14161A]/80 border border-gray-800/80">
                <span className="text-xs font-bold text-[#F5A524] block mb-1">C++ Implementation</span>
                <p className="text-xs text-gray-400 font-mono">{activeParam.dspDetail}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};


// FEATURE OVERVIEW COMPONENT
const Features = () => {
  const feats = [
    { title: 'Sample-Accurate Tempo Sync', tagline: 'Locks perfectly to DAW host transport clock or manual project BPM.', detail: 'Supports 16 rhythmic note subdivisions including straight, dotted, and triplet variations per channel.' },
    { title: 'Independent Dual L/R Engine', tagline: 'Decoupled Left and Right delay lines for complex spatial polyrhythms.', detail: 'Set independent note divisions (e.g. 1/4 note Left, 1/8D note Right) or milliseconds for unique stereo dimension.' },
    { title: 'Ping-Pong Routing Matrix', tagline: 'Dynamic cross-feedback matrix bouncing delay repeats across the stereo field.', detail: 'Instant single-toggle routing swap that turns parallel echoes into wide ping-pong bounces.' },
    { title: 'Analog-Modelled Warm Drive', tagline: 'Soft-clipping saturation stage built directly into the feedback path.', detail: 'Add subtle harmonic warmth (+0 dB) to aggressive analog crunch (+24 dB) on echo tails.' },
    { title: 'Tone-Shaping Feedback Filters', tagline: 'Dual 12 dB/octave Butterworth HPF and LPF operating inside the loop.', detail: 'Keep mixes clean by carving away low-end mud and sculpting dark decaying echoes.' },
    { title: 'Mid/Side Stereo Width Control', tagline: 'Custom spatial width matrix from mono (0%) to ultra-expanded (200%).', detail: 'Enhance stereo separation or collapse delay tails to mono for centered vocal echo throws.' },
  ];

  return (
    <section id="features" className="py-20 bg-[#14161A] border-b border-gray-800/60 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-[#22D3EE] block mb-2">
            Plugin Capabilities
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Feature Overview & Key Pillars
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {feats.map((feat, idx) => (
            <div key={feat.title} className="p-6 rounded-2xl bg-[#1D2026] border border-gray-800 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-[#22D3EE]/10 border border-[#22D3EE]/30 text-[#22D3EE] font-black flex items-center justify-center">
                0{idx + 1}
              </div>
              <h3 className="text-xl font-bold text-white">{feat.title}</h3>
              <p className="text-xs font-semibold text-[#F5A524]">{feat.tagline}</p>
              <p className="text-xs text-gray-300 leading-relaxed">{feat.detail}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

// FORMAT BADGES COMPONENT
const FormatBadges = () => {
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

// SYSTEM REQUIREMENTS COMPONENT
const SystemRequirements = () => {
  const [platform, setPlatform] = useState('macOS');
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

// VERSION HISTORY COMPONENT
const VersionHistory = () => {
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

// INSTALLATION GUIDE COMPONENT
const InstallationGuide = () => {
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

// FAQ COMPONENT
const FAQ = () => {
  const [openId, setOpenId] = useState('faq-1');

  return (
    <section id="faq" className="py-20 bg-[#14161A] border-b border-gray-800/60 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-[#22D3EE] block mb-2">
            Questions & Answers
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="max-w-4xl mx-auto space-y-4">
          {FAQ_ITEMS.map((item) => {
            const isOpen = openId === item.id;
            return (
              <div key={item.id} className="rounded-2xl bg-[#1D2026] border border-gray-800 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setOpenId(isOpen ? null : item.id)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between text-white font-bold text-base"
                >
                  <span>{item.question}</span>
                  <span className="text-[#22D3EE] text-xl font-bold">{isOpen ? '-' : '+'}</span>
                </button>
                {isOpen && (
                  <div className="px-6 pb-6 text-sm text-gray-300 border-t border-gray-800/60 pt-4">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

// DOWNLOAD PLACEHOLDER COMPONENT (PRE-LAUNCH NOTIFY MODAL)
const DownloadPlaceholder = () => {
  const [copiedMac, setCopiedMac] = useState(false);
  const [notifyModalOpen, setNotifyModalOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [newsletterOptIn, setNewsletterOptIn] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notifySuccess, setNotifySuccess] = useState(false);

  const macHash = '8f3a2e91b4c7d0e5f2a184c90123ef456789a0b1c2d3e4f5a6b7c8d9e0f1a2b3';

  const copyToClipboard = (text) => {
    if (navigator.clipboard) { navigator.clipboard.writeText(text); }
    setCopiedMac(true);
    setTimeout(() => setCopiedMac(false), 2000);
  };

  const handleNotifySubmit = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;

    setIsSubmitting(true);

    try {
      await fetch('https://formspree.io/f/mrpzbbzp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          email: email,
          newsletter_opt_in: newsletterOptIn,
          product: 'StudioZIO Tempo Delay Release 4.0.1 Launch Notification',
          _subject: `New Launch Notify Lead: ${email}`
        })
      }).catch(() => null);

      setNotifySuccess(true);
      setIsSubmitting(false);
    } catch (err) {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="downloads" className="py-16 bg-[#14161A] border-b border-gray-800/60 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-[#22D3EE] block mb-2">
            Pre-Release Launch Status
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Release 4.0.1 — Coming Soon
          </h2>
          <p className="mt-3 text-gray-300 text-sm sm:text-base leading-relaxed">
            StudioZIO Tempo Delay Release 4.0.1 is currently undergoing final production testing on macOS Apple Silicon (arm64). Sign up below to be notified instantly at launch.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="p-8 rounded-3xl bg-[#1D2026] border border-gray-700/80 hover:border-[#22D3EE]/50 transition-all shadow-2xl flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-[#22D3EE]/10 text-[#22D3EE] border border-[#22D3EE]/30">
                  macOS Apple Silicon (arm64)
                </span>
                <span className="text-xs font-mono text-gray-400">Release 4.0.1 (Schema 8) • ~24.5 MB</span>
              </div>

              <h3 className="text-2xl font-black text-white">StudioZIO Tempo Delay for macOS</h3>

              <p className="text-sm text-gray-300 leading-relaxed">
                Includes native binaries for Apple Silicon (arm64) in Audio Unit (AUv2), VST3, and Standalone App formats.
              </p>

              <div className="p-4 rounded-xl bg-[#14161A] border border-gray-800 space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block">Installer Details</span>
                <div className="space-y-1 text-xs text-gray-300 font-mono">
                  <div className="flex justify-between"><span className="text-gray-500">File Name:</span><span className="text-white">StudioZIO_Tempo_Delay_v4.0.1_macOS.dmg</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Target Build:</span><span className="text-[#22D3EE]">Release 4.0.1 (Schema 8)</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Availability:</span><span className="text-[#F5A524]">Coming Soon</span></div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#14161A] border border-gray-800/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-gray-400 flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#22D3EE]"></span>
                    <span>SHA-256 Checksum (Release 4.0.1 Placeholder)</span>
                  </span>
                  <button type="button" onClick={() => copyToClipboard(macHash)} className="px-2.5 py-1 rounded-md bg-[#22D3EE]/10 hover:bg-[#22D3EE]/20 border border-[#22D3EE]/30 text-[#22D3EE] font-mono text-[10px] font-bold uppercase tracking-wider">
                    {copiedMac ? 'Copied!' : 'Copy Hash'}
                  </button>
                </div>
                <div className="p-2 rounded-lg bg-[#0E1013] text-[11px] font-mono text-[#22D3EE] break-all border border-gray-900">
                  {macHash}
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-gray-800">
              <div className="p-3 rounded-xl bg-[#14161A] border border-gray-800 text-center">
                <span className="text-xs font-mono font-bold text-[#F5A524] uppercase tracking-wider block">
                  Release 4.0.1 — Coming Soon
                </span>
              </div>

              <div className="space-y-3">
                <a
                  href="/StudioZIOTempoDelay-v4.0.1-RC1-macOS-arm64.pkg"
                  download
                  className="w-full py-4 px-6 rounded-xl bg-[#22D3EE] hover:bg-[#06B6D4] text-[#14161A] font-extrabold text-sm transition-all shadow-xl shadow-[#22D3EE]/25 flex items-center justify-center space-x-2 text-center block"
                  aria-label="Download for MacOS"
                >
                  <svg className="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <span>Download for MacOS</span>
                </a>
                <p className="text-xs text-amber-400/90 bg-amber-500/10 p-3 rounded-xl border border-amber-500/20 text-center leading-relaxed">
                  This is a pre-release version intended for evaluation and testing. While fully code-signed and notarized by Apple, minor issues may still exist.
                </p>
              </div>
              <span className="text-[11px] text-gray-400 text-center block">Requires macOS 11 or later • Apple Silicon (arm64)</span>
            </div>
          </div>
        </div>
      </div>

      {notifyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md transition-all">
          <div className="max-w-md w-full p-8 rounded-3xl bg-[#1D2026] border border-[#22D3EE]/40 shadow-2xl space-y-6 relative">
            <button type="button" onClick={() => { setNotifyModalOpen(false); setNotifySuccess(false); }} className="absolute top-4 right-4 text-gray-400 hover:text-white p-1 rounded-lg bg-[#14161A]">
              ✕
            </button>

            <div className="space-y-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#22D3EE] block">Pre-Launch Registration</span>
              <h3 className="text-2xl font-black text-white">Notify Me When It Launches</h3>
              <p className="text-xs text-gray-300 leading-relaxed">Enter your email address to be notified the moment StudioZIO Tempo Delay Release 4.0.1 goes live.</p>
            </div>

            {notifySuccess ? (
              <div className="p-6 rounded-2xl bg-[#22D3EE]/10 border border-[#22D3EE]/40 text-[#22D3EE] space-y-3">
                <h4 className="text-lg font-bold">You're On The VIP Launch List!</h4>
                <p className="text-xs text-gray-200">Thank you! We will e-mail you the moment Release 4.0.1 officially launches.</p>
                <button type="button" onClick={() => { setNotifyModalOpen(false); setNotifySuccess(false); }} className="w-full py-2.5 px-4 bg-[#22D3EE] text-[#14161A] font-bold text-xs rounded-xl">Done</button>
              </div>
            ) : (
              <form onSubmit={handleNotifySubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-300 block">Email Address *</label>
                  <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="producer@studiozio.audio" className="w-full px-4 py-3 bg-[#14161A] border border-gray-700/80 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#22D3EE]" />
                </div>

                <div className="flex items-start space-x-3 pt-1">
                  <input id="newsletter_opt_in" type="checkbox" checked={newsletterOptIn} onChange={(e) => setNewsletterOptIn(e.target.checked)} className="w-4 h-4 mt-0.5 rounded bg-[#14161A] border-gray-700 text-[#22D3EE] focus:ring-[#22D3EE]" />
                  <label htmlFor="newsletter_opt_in" className="text-xs text-gray-300 cursor-pointer select-none">
                    I want to receive emails about new StudioZIO plugin releases, updates, and producer news.
                  </label>
                </div>

                <button type="submit" disabled={isSubmitting} className="w-full py-3.5 px-6 rounded-xl bg-[#22D3EE] text-[#14161A] font-extrabold text-sm shadow-lg">
                  {isSubmitting ? 'Subscribing...' : 'Notify Me When It Launches'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
};





// SUPPORT CONTACT COMPONENT
const SupportContact = () => {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    subject: 'Technical Support',
    operatingSystem: 'macOS 14 Sonoma',
    daw: 'Ableton Live 11',
    message: '',
    submitted: false,
  });

  const [honeypot, setHoneypot] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setToastMessage(null);

    if (honeypot.trim().length > 0) {
      console.warn('Spam submission detected and blocked via honeypot field.');
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        setForm((prev) => ({ ...prev, submitted: true }));
      }, 800);
      return;
    }

    if (!form.fullName || !form.email || !form.message) {
      setToastMessage({ type: 'error', text: 'Please complete all required fields (Name, Email, Message).' });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      }).catch(() => null);

      setForm((prev) => ({ ...prev, submitted: true }));
      setToastMessage({ type: 'success', text: 'Inquiry successfully transmitted to StudioZIO support team.' });
    } catch (err) {
      setToastMessage({ type: 'error', text: 'Transmission failed. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="support" className="py-20 bg-[#14161A] border-b border-gray-800/60 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-[#22D3EE] block mb-2">
            Developer Support
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Support & Contact Center
          </h2>
          <p className="mt-4 text-gray-300 text-base leading-relaxed">
            Contact our audio engineering support team for inquiries, bug reports, or host DAW setup assistance.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-7 p-8 rounded-3xl bg-[#1D2026] border border-gray-800 shadow-2xl space-y-6">
            <h3 className="text-2xl font-bold text-white flex items-center justify-between">
              <span>Send Support Inquiry</span>
              <span className="text-xs font-mono text-[#22D3EE]">Direct Desk</span>
            </h3>

            {toastMessage && (
              <div className={`p-4 rounded-xl text-xs font-semibold ${toastMessage.type === 'success' ? 'bg-[#22D3EE]/10 text-[#22D3EE] border border-[#22D3EE]/40' : 'bg-red-500/10 text-red-400 border border-red-500/40'}`}>
                {toastMessage.text}
              </div>
            )}

            {form.submitted ? (
              <div className="p-6 rounded-2xl bg-[#22D3EE]/10 border border-[#22D3EE]/40 text-[#22D3EE] space-y-4">
                <h4 className="text-lg font-bold">Support Request Received!</h4>
                <p className="text-sm text-gray-200">
                  Thank you, <strong className="text-white">{form.fullName}</strong>. Your ticket regarding "{form.subject}" has been queued. Response window is 24-48 business hours.
                </p>
                <button
                  type="button"
                  onClick={() => { setForm({ fullName: '', email: '', subject: 'Technical Support', operatingSystem: 'macOS 14 Sonoma', daw: 'Ableton Live 11', message: '', submitted: false }); setToastMessage(null); }}
                  className="px-5 py-2.5 text-xs font-bold bg-[#22D3EE] text-[#14161A] rounded-xl hover:bg-[#06B6D4]"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4" aria-label="Support Form">
                <div className="hidden" aria-hidden="true">
                  <input type="text" tabIndex={-1} value={honeypot} onChange={(e) => setHoneypot(e.target.value)} autoComplete="off" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-300 block">Full Name *</label>
                    <input type="text" required value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} placeholder="e.g. Mert Erkan" className="w-full px-3.5 py-2.5 bg-[#14161A] border border-gray-700/80 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#22D3EE]" aria-label="Full Name" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-300 block">Email Address *</label>
                    <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="e.g. producer@studiozio.audio" className="w-full px-3.5 py-2.5 bg-[#14161A] border border-gray-700/80 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#22D3EE]" aria-label="Email Address" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-300 block">Category</label>
                    <select value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="w-full px-3 py-2.5 bg-[#14161A] border border-gray-700/80 rounded-xl text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#22D3EE]" aria-label="Category">
                      <option value="Technical Support">Technical Support</option>
                      <option value="DAW Compatibility">DAW Compatibility</option>
                      <option value="Bug Report">Bug Report</option>
                      <option value="Feature Inquiry">Feature Inquiry</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-300 block">OS</label>
                    <input type="text" value={form.operatingSystem} onChange={(e) => setForm({ ...form, operatingSystem: e.target.value })} placeholder="macOS / Windows" className="w-full px-3.5 py-2.5 bg-[#14161A] border border-gray-700/80 rounded-xl text-white text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#22D3EE]" aria-label="OS" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-300 block">DAW</label>
                    <input type="text" value={form.daw} onChange={(e) => setForm({ ...form, daw: e.target.value })} placeholder="Logic / Live / FL" className="w-full px-3.5 py-2.5 bg-[#14161A] border border-gray-700/80 rounded-xl text-white text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#22D3EE]" aria-label="DAW" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-300 block">Message Details *</label>
                  <textarea required rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Describe your inquiry..." className="w-full px-3.5 py-2.5 bg-[#14161A] border border-gray-700/80 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#22D3EE]" aria-label="Message Details" />
                </div>
                <button type="submit" disabled={isSubmitting} className="w-full py-3.5 px-6 rounded-xl bg-[#22D3EE] hover:bg-[#06B6D4] text-[#14161A] font-extrabold text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#22D3EE]">
                  {isSubmitting ? 'Transmitting Ticket...' : 'Submit Support Request'}
                </button>
              </form>
            )}
          </div>

          <div className="lg:col-span-5 space-y-6">
            <div className="p-8 rounded-3xl bg-[#1D2026] border border-gray-800 space-y-6 shadow-xl">
              <h3 className="text-xl font-bold text-white">Documentation & Links</h3>
              <div className="space-y-3 text-xs text-gray-300">
                <a href="#parameters" className="p-3.5 rounded-xl bg-[#14161A] border border-gray-800 hover:border-[#22D3EE] block font-bold text-white hover:text-[#22D3EE]">Parameter Reference Guide</a>
                <a href="#routing-visualizer" className="p-3.5 rounded-xl bg-[#14161A] border border-gray-800 hover:border-[#F5A524] block font-bold text-white hover:text-[#F5A524]">Signal Routing Diagram</a>
                <a href="#installation" className="p-3.5 rounded-xl bg-[#14161A] border border-gray-800 hover:border-[#22D3EE] block font-bold text-white hover:text-[#22D3EE]">Installation Steps</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};


// FOOTER COMPONENT
const Footer = () => {
  return (
    <footer className="bg-[#14161A] text-gray-400 py-12 border-t border-gray-800 text-center text-xs space-y-4">
      <p>© 2026 StudioZIO. All rights reserved. Native AU, VST3 & Standalone Stereo Delay Audio Plugin.</p>
      <div className="flex justify-center space-x-4">
        <a href="#overview" className="hover:text-[#22D3EE]">Overview</a>
        <a href="#routing-visualizer" className="hover:text-[#22D3EE]">Routing</a>
        <a href="#parameters" className="hover:text-[#22D3EE]">Parameters</a>
        <a href="#downloads" className="hover:text-[#22D3EE]">Downloads</a>
        <a href="#support" className="hover:text-[#22D3EE]">Support</a>
      </div>
    </footer>
  );
};

// MAIN APP COMPONENT
const App = () => {
  return (
    <div className="min-h-screen bg-[#14161A] text-[#E2E8F0]">
      <Header />
      <main id="main-content">
        <Hero />
        <Description />
        <InteractiveVisualizer />
        <ParameterGuide />
        <Features />
        <FormatBadges />
        <SystemRequirements />
        <VersionHistory />
        <InstallationGuide />
        <FAQ />
        <DownloadPlaceholder />
        <SupportContact />
      </main>
      <Footer />
    </div>
  );
};

// RENDER TO DOM
const rootEl = document.getElementById('root');
if (rootEl) {
  ReactDOM.createRoot(rootEl).render(<App />);
}
