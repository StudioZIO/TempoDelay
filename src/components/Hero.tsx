import { Chip } from './Chip';
import { TempoDelayMock } from './TempoDelayMock';

/* The direct asset in the TempoDelay repo is marked "superseded for current
   downloads" by its own release notes; the authoritative build lives in the
   central release registry, whose README asks people to download from the
   versioned release page and verify the published SHA-256 there. Linking the
   page rather than a file also means a re-cut asset cannot strand this link. */
const MACOS_DOWNLOAD_URL =
  'https://github.com/StudioZIO/StudioZIO-Releases/releases/tag/tempo-delay-v4.0.1-RC1';

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
