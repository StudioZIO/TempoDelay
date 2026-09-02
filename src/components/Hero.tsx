import { Chip } from './Chip';
import { TempoDelayMock } from './TempoDelayMock';
import { MACOS_DOWNLOAD_URL } from '../data/navigation';

export const Hero = () => (
  <section id="overview" className="hero tech-grid">
    <div className="shell">
      <div className="hero-grid">
        <div>
          <p className="eyebrow">Time Effect · v4.0.1</p>

          <h1>
            Independent stereo delay,{' '}
            <span className="accent">locked to the host grid.</span>
          </h1>

          <p className="lede">
            Tempo Delay runs two fully independent delay buffers, each with its own note division,
            cross-channel ping-pong routing that throws repeats across the stereo field, and filtered
            feedback that reshapes every pass on its way round the loop.
          </p>

          <div className="hero-actions">
            <a className="btn btn-primary" href={MACOS_DOWNLOAD_URL}>
              Download for macOS
            </a>
            <a className="btn" href="#simulator">
              See the routing
            </a>
          </div>

          <div className="chip-row mt-6">
            <Chip>AU · VST3</Chip>
            <Chip tone="signal" dot>
              Notarized
            </Chip>
          </div>
        </div>

        <TempoDelayMock />
      </div>
    </div>
  </section>
);
