export const FORMAT_BADGES = [
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

export const SYSTEM_REQUIREMENTS = {
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

export const FAQ_ITEMS = [
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
