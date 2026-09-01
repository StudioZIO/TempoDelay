import { Section } from './Section';

const MODULES = [
  {
    title: 'Sample accurate tempo sync',
    body: 'Locks to the DAW transport clock or a manual project BPM, with sixteen note subdivisions per channel including straight, dotted and triplet.',
  },
  {
    title: 'Independent dual L/R engine',
    body: 'Decoupled left and right delay lines. Run 1/4 on the left against 1/8D on the right, or free millisecond timing from 1 to 2000 ms.',
  },
  {
    title: 'Ping-pong routing matrix',
    body: 'One toggle swaps the feedback matrix from parallel repeats to cross-channel bounces travelling across the stereo field.',
  },
  {
    title: 'Analog modelled drive',
    body: 'A soft-clipping saturation stage sits inside the feedback path, moving from subtle harmonic warmth to hard analog crunch on the tails.',
  },
  {
    title: 'Tone shaping feedback filters',
    body: 'Dual 12 dB per octave high-pass and low-pass filters run inside the loop, so every repeat is carved again as it decays.',
  },
  {
    title: 'Mid/side stereo width',
    body: 'A width matrix from 0% mono collapse to 200% extra wide, for centred vocal throws or fully opened ambient tails.',
  },
];

export const Architecture = () => (
  <Section
    id="architecture"
    eyebrow="Architecture"
    title="Six modules, one signal path"
    lede="Every stage of the delay is addressable on its own, and every stage stays out of the way of the ones around it."
  >
    <div className="card-grid card-grid--3">
      {MODULES.map((module, index) => (
        <article key={module.title} className="panel module-card">
          <span className="idx">{String(index + 1).padStart(2, '0')}</span>
          <h3>{module.title}</h3>
          <p>{module.body}</p>
        </article>
      ))}
    </div>
  </Section>
);
