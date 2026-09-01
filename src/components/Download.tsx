import { Chip } from './Chip';
import { Section } from './Section';
import { MASTERING_SUITE_URL } from '../data/navigation';
import { CONTACT_PATH } from '../router';

const MACOS_DOWNLOAD_URL =
  'https://github.com/StudioZIO/TempoDelay/releases/download/v4.0.1-RC1/StudioZIOTempoDelay-v4.0.1-RC1-macOS-arm64.pkg';

export const Download = () => (
  <Section
    id="download"
    eyebrow="Download"
    title="Tempo Delay 4.0.1 for macOS"
    lede="Native Apple Silicon binaries for Audio Unit, VST3 and the standalone app, code signed and notarized by Apple."
  >
    <div className="panel-float download-row">
      <div>
        <div className="chip-row mb-3">
          <Chip>macOS 11+</Chip>
          <Chip>arm64</Chip>
          <Chip tone="signal" dot>
            Release candidate
          </Chip>
        </div>
        <p className="text-sm text-muted-foreground">
          StudioZIOTempoDelay-v4.0.1-RC1-macOS-arm64.pkg — approximately 24.5 MB, requiring 150 MB of
          free disk space once installed.
        </p>
      </div>

      <div className="actions">
        <a className="btn btn-primary" href={MACOS_DOWNLOAD_URL} download>
          Download for macOS
        </a>
        <a className="btn" href="#parameters">
          Parameter guide
        </a>
        <a className="btn" href={CONTACT_PATH}>
          Support
        </a>
      </div>
    </div>

    <div className="panel download-row mt-6">
      <div>
        <p className="eyebrow eyebrow--muted mb-2">Also from StudioZIO</p>
        <h3>Mastering Suite</h3>
        <p className="text-sm text-muted-foreground mt-2">
          The mastering chain that sits at the end of the same signal path.
        </p>
      </div>
      <div className="actions">
        <a className="btn" href={MASTERING_SUITE_URL}>
          Open Mastering Suite
        </a>
      </div>
    </div>
  </Section>
);
