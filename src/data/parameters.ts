export const APVTS_PARAMETERS = [
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

/** The seven filter groups the design system exposes as category chips. */
export const PARAMETER_GROUPS = [
  'Global & Sync',
  'L/R Timing',
  'Tone Shaping',
  'Character System',
  'Ducking Engine',
  'Modulation',
  'Output',
] as const;

export type ParameterGroup = (typeof PARAMETER_GROUPS)[number];

/** Folds the manifest's fine-grained categories onto the seven chips. */
export const GROUP_BY_CATEGORY: Record<string, ParameterGroup> = {
  'Global & Sync': 'Global & Sync',
  'L/R Timing': 'L/R Timing',
  'Feedback & Routing': 'L/R Timing',
  'Tone Shaping': 'Tone Shaping',
  'Character System': 'Character System',
  'Advanced Processing': 'Character System',
  'Ducking Engine': 'Ducking Engine',
  Modulation: 'Modulation',
  'Spatial & Output': 'Output',
  'Gain Structure': 'Output',
};
