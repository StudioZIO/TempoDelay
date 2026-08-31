export const Features = () => {
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
