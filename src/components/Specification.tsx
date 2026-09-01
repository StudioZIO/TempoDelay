import { Section } from './Section';

/**
 * Every value below is restated from a fact the repository already asserts
 * (JSON-LD, the APVTS parameter manifest or the release metadata).
 */
const SPECIFICATION: { key: string; value: string }[] = [
  { key: 'Release', value: '4.0.1 (Schema 8)' },
  { key: 'Formats', value: 'Audio Unit (AUv2), VST3, Standalone' },
  { key: 'Platform', value: 'macOS 11+, Apple Silicon (arm64)' },
  { key: 'Automatable parameters', value: '32 APVTS parameters' },
  { key: 'Sample rate', value: '44.1 – 192 kHz' },
  { key: 'Reported latency', value: '0 samples' },
  { key: 'Engine', value: '64-bit float' },
  { key: 'Delay time', value: '1 – 2000 ms per channel' },
  { key: 'Note divisions', value: '16 per channel, straight, dotted and triplet' },
  { key: 'Feedback filters', value: 'HPF 20 – 2000 Hz, LPF 1 – 20 kHz' },
  { key: 'Stereo width', value: '0 – 200% mid/side' },
  { key: 'Installer', value: 'Signed .pkg, 150 MB free disk space' },
];

export const Specification = () => (
  <Section
    id="specification"
    eyebrow="Specification"
    title="What ships in the build"
    lede="The numbers below are the ones the plugin itself reports to the host."
  >
    <dl className="spec-grid">
      {SPECIFICATION.map((entry) => (
        <div key={entry.key}>
          <dt>{entry.key}</dt>
          <dd>{entry.value}</dd>
        </div>
      ))}
    </dl>
  </Section>
);
