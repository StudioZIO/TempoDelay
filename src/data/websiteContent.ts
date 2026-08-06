import { FormatInfo, SystemRequirement, VersionRelease, FAQItem } from '../types/plugin';

export const PRODUCT_BASELINE = {
  name: 'StudioZIO Tempo Delay',
  version: '4.0.1',
  schemaVersion: '8',
  tagline: 'Modern stereo delay with multiple tonal personalities.',
  heroDescription: 'StudioZIO Tempo Delay is a modern stereo delay featuring independent left/right timing, three character modes, advanced routing, modulation, ducking, diffusion, freeze and reverse processing.',
  formats: ['Audio Unit (AUv2)', 'VST3', 'Standalone'],
  architecture: 'Apple Silicon (arm64)',
  os: 'macOS 11+',
  supportedDAWs: ['Logic Pro', 'REAPER']
};

export const FORMAT_BADGES: FormatInfo[] = [
  {
    id: 'au',
    name: 'Audio Unit (AUv2)',
    fullName: 'Apple Audio Unit Native Plugin',
    badgeText: 'AU v2 Native',
    platforms: ['macOS'],
    fileExtension: '.component',
    description: 'Validated native Audio Unit (AUv2) implementation for Apple Silicon (arm64) macOS systems.',
    targetDAWs: ['Logic Pro', 'REAPER']
  },
  {
    id: 'vst3',
    name: 'VST3 (64-bit)',
    fullName: 'Steinberg VST3 Audio Plugin',
    badgeText: 'VST3 Native',
    platforms: ['macOS'],
    fileExtension: '.vst3',
    description: 'Native 64-bit VST3 architecture featuring dynamic bus allocation and host state recall.',
    targetDAWs: ['REAPER', 'Logic Pro (via VST3 wrapper)']
  },
  {
    id: 'standalone',
    name: 'Standalone Application',
    fullName: 'StudioZIO Standalone Desktop Audio Application',
    badgeText: 'Standalone App',
    platforms: ['macOS'],
    fileExtension: '.app',
    description: 'Independent desktop audio application for live rehearsal and low-latency standalone performance.',
    targetDAWs: ['Direct CoreAudio Driver Support', 'Low Latency Buffer Mode']
  }
];

export const SYSTEM_REQUIREMENTS: SystemRequirement[] = [
  {
    platform: 'macOS',
    osVersion: 'macOS 11 Big Sur, 12 Monterey, 13 Ventura, 14 Sonoma, or 15 Sequoia',
    architecture: 'Native Apple Silicon (arm64: M1 / M2 / M3 / M4)',
    ram: '4 GB minimum (8 GB recommended for dense DAW sessions)',
    diskSpace: '150 MB free disk space for plugin binaries and standalone application',
    formats: ['Audio Unit (AUv2)', 'VST3', 'Standalone App'],
    notes: [
      'Validated DAWs: Logic Pro, REAPER',
      'Apple Silicon arm64 native architecture',
      'Zero reported processing latency to host DAW',
      'Offline license authorization'
    ]
  }
];

export const VERSION_HISTORY: VersionRelease[] = [
  {
    version: '4.0.1',
    releaseDate: 'August 2026',
    tagline: 'Current Shipping Production Release (Schema 8)',
    highlights: [
      '32 APVTS automatable parameters with host state recall.',
      'Three audibly distinct Character modes: Digital, Tape, Analog.',
      'Advanced processing engines: Freeze, Reverse, Diffusion, and Envelope Ducking.',
      'LFO Modulation engine with Tempo Sync and Stereo Spread.',
      'Classic stereo Ping-Pong routing matrix.',
      'Zero reported processing latency engine.'
    ],
    changes: [
      { category: 'Release', description: 'Production release 4.0.1 (Schema 8) for macOS Apple Silicon (arm64).' },
      { category: 'DSP Engine', description: 'Character modes refined for distinct tonal personalities (Digital, Tape, Analog).' },
      { category: 'Processing', description: 'Integrated Freeze, Reverse, Diffusion, and Ducking envelope processors.' },
      { category: 'Architecture', description: 'Native AUv2, VST3, and Standalone validation on Logic Pro & REAPER.' }
    ]
  }
];

export const INSTALLATION_STEPS = {
  macOS: [
    { step: 1, title: 'Download macOS Disk Image', desc: 'Download official StudioZIO_Tempo_Delay_v4.0.1_macOS.dmg installer.' },
    { step: 2, title: 'Mount DMG Archive', desc: 'Double-click the .dmg file to open the installer volume.' },
    { step: 3, title: 'Run Package Installer', desc: 'Launch StudioZIO Tempo Delay Installer.pkg and complete guided setup.' },
    { step: 4, title: 'Format Allocation', desc: 'Installs AUv2 (.component) to /Library/Audio/Plug-Ins/Components and VST3 to /Library/Audio/Plug-Ins/VST3.' },
    { step: 5, title: 'Rescan Plug-ins in DAW', desc: 'Open Logic Pro or REAPER to automatically scan and validate StudioZIO Tempo Delay.' }
  ]
};

export const FAQ_ITEMS: FAQItem[] = [
  {
    id: 'faq-1',
    category: 'Audio DSP',
    question: 'What character modes are available in StudioZIO Tempo Delay?',
    answer: 'StudioZIO Tempo Delay features three audibly distinct character modes: Digital (clean, full bandwidth, transparent), Tape (warmer high-frequency response with musical saturation), and Analog (darker, vintage-inspired response with stronger coloration).'
  },
  {
    id: 'faq-2',
    category: 'Audio DSP',
    question: 'Does the plugin report processing latency to the DAW?',
    answer: 'No. StudioZIO Tempo Delay features zero reported processing latency, allowing realtime-safe tracking and mix bus execution without sample delay offset.'
  },
  {
    id: 'faq-3',
    category: 'Audio DSP',
    question: 'How does the Ducking engine function?',
    answer: 'The advanced Ducking engine features Amount, Attack, and Release controls. It dynamically attenuates wet delay tails during active input signal phrases and releases delay repeats when input drops.'
  },
  {
    id: 'faq-4',
    category: 'Audio DSP',
    question: 'What advanced processing features are included?',
    answer: 'In addition to independent L/R delay timing and character modes, the plugin includes Freeze (infinite buffer loop), Reverse playback, Diffusion (smearing delay taps), LFO Modulation, and classic Ping-Pong routing.'
  },
  {
    id: 'faq-5',
    category: 'Compatibility',
    question: 'Which operating systems and formats are currently validated?',
    answer: 'Production release 4.0.1 is validated on macOS for Apple Silicon (arm64) systems in Audio Unit (AUv2), VST3, and Standalone formats. Officially validated DAWs include Logic Pro and REAPER.'
  },
  {
    id: 'faq-6',
    category: 'System',
    question: 'Does the plugin support preset management and automation?',
    answer: 'Yes. StudioZIO Tempo Delay includes an integrated Preset Browser supporting Factory and User presets, full host state restore, and 32 automatable APVTS parameters.'
  }
];

export const KEY_FEATURES = [
  {
    title: 'Independent L/R Delay',
    tagline: 'Decoupled Left and Right delay lines with free millisecond or tempo-synced timing.',
    detail: 'Set independent musical note divisions (straight, dotted, triplet) or millisecond delay times per channel with Stereo Width control.',
    module: 'Delay Engine',
    icon: 'split'
  },
  {
    title: 'Digital • Tape • Analog',
    tagline: 'Three selectable character modes offering distinct tonal personalities.',
    detail: 'Digital delivers clean transparent bandwidth; Tape offers high-frequency warmth and saturation; Analog provides dark vintage coloration.',
    module: 'Character System',
    icon: 'sliders'
  },
  {
    title: '32 Automatable Parameters',
    tagline: 'Complete APVTS parameter manifest for precise host automation.',
    detail: 'Full host state recall, deterministic parameter smoothing, and complete DAW automation integration.',
    module: 'APVTS Core',
    icon: 'clock'
  },
  {
    title: 'Tempo Sync + Manual BPM',
    tagline: 'Sample-accurate host transport sync or manual tempo clock source.',
    detail: 'Synchronize delay repeats to host transport or set explicit manual project BPM (40–300 BPM).',
    module: 'Tempo Clock',
    icon: 'clock'
  },
  {
    title: 'Freeze / Reverse / Diffusion',
    tagline: 'Advanced processing engines for creative sound design.',
    detail: 'Capture infinite audio loops with Freeze, reverse buffer playback, or smear delay repeats into dense spatial reverberation with Diffusion.',
    module: 'Advanced DSP',
    icon: 'waveform'
  },
  {
    title: 'Ducking Engine',
    tagline: 'Dynamic envelope follower keeping vocal and lead transients clear.',
    detail: 'Dedicated Ducking Amount, Attack, and Release controls attenuate wet repeats during input phrases and release tails during pauses.',
    module: 'Ducking Core',
    icon: 'sparkles'
  },
  {
    title: 'Zero Reported Latency',
    tagline: 'Realtime-safe audio processing without sample offset.',
    detail: 'Zero reported processing latency ensures realtime tracking and mix bus processing without host buffer alignment issues.',
    module: 'System DSP',
    icon: 'flame'
  },
  {
    title: 'AU • VST3 • Standalone',
    tagline: 'Native macOS Apple Silicon (arm64) audio plugin formats.',
    detail: 'Validated on Logic Pro and REAPER with native CoreAudio standalone desktop application support.',
    module: 'Formats',
    icon: 'maximize'
  }
];
