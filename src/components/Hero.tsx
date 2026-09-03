import { Chip } from './Chip';
import { TempoDelayMock } from './TempoDelayMock';
import { MACOS_DOWNLOAD_URL } from '../data/navigation';
import { track } from '../analytics';

/* The hero arrives rather than appearing. The core system specifies `rise` at
   0.7s with a 60ms stagger per hero item, and the hub and Mastering Suite both
   run it; this site defined the keyframes but never applied the class, so
   arriving here from either of them felt like a cut rather than a transition.
   The stagger puts the copy first and the plug-in panel a beat behind it.
   `prefers-reduced-motion` already collapses the whole thing to 0.001ms. */
export const Hero = () => (
  <section id="overview" className="hero tech-grid">
    <div className="shell">
      <div className="hero-grid">
        <div className="rise">
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
            <a
              className="btn btn-primary"
              href={MACOS_DOWNLOAD_URL}
              onClick={() => track('download_click', { product: 'tempo-delay', version: '4.0.1' })}
            >
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

        <div className="rise rise-2">
          <TempoDelayMock />
        </div>
      </div>
    </div>
  </section>
);
