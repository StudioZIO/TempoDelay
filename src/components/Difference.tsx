import { Section } from './Section';

/**
 * The four things about this delay that the Architecture and Specification
 * sections do not already say. Architecture lists the six modules and the
 * specification lists the numbers; this section is the argument for why the
 * unusual ones are unusual, so nothing here repeats either of them.
 *
 * Every claim is drawn from a parameter in src/data/parameters.ts, and every
 * readout is a value the plugin reports.
 */
const CLAIMS: { title: string; body: string; key: string; value: string }[] = [
  {
    title: 'You can move the delay time while it plays',
    body:
      'Reads land between sample positions using Hermite interpolation rather than snapping to the nearest one, and the modulation LFO moves those same interpolation points. Dragging a delay control bends pitch the way tape does instead of tearing.',
    key: 'Reads',
    value: 'HERMITE FRACTIONAL · 64-BIT FLOAT',
  },
  {
    title: 'Character modes change the circuit, not a curve',
    body:
      'Digital, Tape and Analog are three processing paths inside the feedback loop rather than three EQ presets on the output. Digital stays full bandwidth, Tape warms the top end as it saturates, and Analog is darker on every pass.',
    key: 'Character',
    value: 'DIGITAL · TAPE · ANALOG',
  },
  {
    title: 'The repeats can stop behaving like repeats',
    body:
      'Freeze locks the buffer and mutes new input so a tail sustains indefinitely. Reverse reads the same buffer backwards. Diffusion smears discrete taps through an all-pass network into an ambient wash, and ducking tracks the dry input envelope to pull the wet down while you are still playing.',
    key: 'Advanced',
    value: 'FREEZE · REVERSE · DIFFUSION · DUCK',
  },
  {
    title: 'The two modulators are deliberately out of phase',
    body:
      'Left and right LFOs run at one rate with an adjustable phase angle between them, so the channels drift apart instead of wobbling together. Spread sets that angle: at 100 per cent the right channel runs ninety degrees behind the left, which is as far apart as they go, and the movement reads as width rather than as vibrato.',
    key: 'Stereo spread',
    value: '0 – 100% SPREAD · 90° AT FULL',
  },
];

export const Difference = () => (
  <Section
    id="different"
    eyebrow="What makes it different"
    title="Two delays, not one delay with an offset"
    lede="Most stereo delays compute a single time and derive the other channel from it. This one runs two independent buffers, which changes what you can write rather than just how it sounds."
  >
    <div className="claims">
      {CLAIMS.map((claim) => (
        <div className="claim" key={claim.title}>
          <h3>{claim.title}</h3>
          <p>{claim.body}</p>
          <dl className="claim-readout">
            <dt>{claim.key}</dt>
            <dd>{claim.value}</dd>
          </dl>
        </div>
      ))}
    </div>
  </Section>
);
