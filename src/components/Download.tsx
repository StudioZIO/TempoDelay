import { Chip } from './Chip';
import { Section } from './Section';
import { MACOS_DOWNLOAD_URL, MASTERING_SUITE_URL } from '../data/navigation';
import { track } from '../analytics';

const MACOS_SHA256 =
  'adae51020ee920d607f04e15c8db3c044c8dadd7bf3e01762dd56cc1c70072c7';

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
          <Chip>Free</Chip>
          <Chip>macOS 12+</Chip>
          <Chip>arm64</Chip>
          {/* Plain, not the amber signal chip. Amber is data and exception
              state across the estate; a shipping release is neither. The hub
              draws the same distinction: "Available now" is a plain chip, every
              other availability gets the signal treatment. */}
          <Chip>Available now</Chip>
        </div>
        <p className="text-sm text-muted-foreground">
          Free to download and use &mdash; a signed, notarized .pkg, with no licence key and no
          account. The installer download is 12.1 MB and needs 150 MB of free disk space once
          installed. Check it against this SHA-256 before you open it.
        </p>
        <p className="sha mt-2 text-muted-foreground">{MACOS_SHA256}</p>
      </div>

      <div className="actions">
        <a
          className="btn btn-primary"
          href={MACOS_DOWNLOAD_URL}
          onClick={() => track('download_click', { product: 'tempo-delay', version: '4.0.1' })}
        >
          Download for macOS
        </a>
        <a className="btn" href="#parameters">
          Parameter guide
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
