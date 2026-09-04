import { Section } from './Section';

/**
 * Every value below is restated from a fact the repository already asserts
 * (JSON-LD, the APVTS parameter manifest or the release metadata) -- with one
 * exception: the Windows row is a scope decision by the owner, not something
 * the code can corroborate. It is stated as planned with no date because that
 * is exactly what is known, and saying nothing read as unfinished rather than
 * deliberate.
 */
const SPECIFICATION: { key: string; value: string }[] = [
  { key: 'Release', value: '4.0.1 (Schema 8)' },
  { key: 'Formats', value: 'Audio Unit (AUv2), VST3, Standalone' },
  { key: 'Price', value: 'Free' },
  { key: 'Platform', value: 'macOS 12+, Apple Silicon (arm64)' },
  { key: 'Windows', value: 'Planned, no date announced' },
  { key: 'Automatable parameters', value: '32 APVTS parameters' },
  { key: 'Sample rate', value: '44.1 – 192 kHz' },
  { key: 'Reported latency', value: '0 samples' },
  { key: 'Engine', value: '64-bit float' },
  { key: 'Delay time', value: '1 – 5000 ms per channel' },
  { key: 'Note divisions', value: '16 per channel, straight, dotted and triplet' },
  { key: 'Feedback filters', value: 'HPF and LPF, 20 Hz – 20 kHz each' },
  { key: 'Stereo width', value: '0 – 200% mid/side' },
  { key: 'Installer', value: '12.1 MB signed and notarized .pkg; 150 MB free disk space' },
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
