export type ParameterCategory = 
  | 'Global & Sync'
  | 'Time & Division'
  | 'Feedback & Routing'
  | 'Tone & Saturation'
  | 'Stereo & Output';

export interface ParameterSpec {
  id: string;
  name: string;
  category: ParameterCategory;
  type: 'toggle' | 'select' | 'knob';
  defaultValue: number | string;
  unit?: string;
  min?: number;
  max?: number;
  step?: number;
  options?: string[];
  description: string;
  dspDetail: string;
}

export interface FormatInfo {
  id: 'au' | 'vst3' | 'standalone';
  name: string;
  fullName: string;
  badgeText: string;
  platforms: ('macOS' | 'Windows')[];
  description: string;
  fileExtension: string;
  targetDAWs: string[];
}

export interface SystemRequirement {
  platform: 'macOS' | 'Windows';
  osVersion: string;
  architecture: string;
  ram: string;
  diskSpace: string;
  formats: string[];
  notes: string[];
}

export interface VersionRelease {
  version: string;
  releaseDate: string;
  tagline: string;
  highlights: string[];
  changes: {
    category: 'Feature' | 'Performance' | 'DSP Engine' | 'Compatibility';
    description: string;
  }[];
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'General' | 'Audio DSP' | 'Compatibility' | 'Installation';
}

export interface RoutingSimState {
  power: boolean;
  sync: boolean;
  bpm: number;
  leftDivision: string;
  rightDivision: string;
  leftTimeMs: number;
  rightTimeMs: number;
  leftFeedback: number;
  rightFeedback: number;
  pingPong: boolean;
  hpfCutoff: number;
  lpfCutoff: number;
  driveDb: number;
  widthPercent: number;
  mixPercent: number;
}

export interface SupportFormState {
  fullName: string;
  email: string;
  subject: string;
  operatingSystem: string;
  daw: string;
  message: string;
  submitted: boolean;
  error?: string;
}
