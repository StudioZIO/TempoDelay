import { Chip } from './Chip';
import { MACOS_DOWNLOAD_URL, MASTERING_SUITE_URL } from '../data/navigation';
import { track } from '../analytics';

const MACOS_SHA256 =
  '4e919c509cca196e178a0a991d24c02eb7e1ba81c5890e0f4fce16aba94ec055';

export const Download = () => (
  <section id="download" className="section scroll-mt-24" aria-labelledby="download-title">
    <div className="shell">
      <div className="panel-float download-row">
        <div>
          <p className="eyebrow">OFFICIAL macOS INSTALLER</p>
          <h2 id="download-title">Tempo Delay 4.0.1</h2>
          <p className="lede">Version 4.0.1 &middot; Audio Unit (AU) &middot; VST3 &middot; AAX &middot; Standalone &middot; Pro Tools verified</p>

          <div className="chip-row mt-3 mb-3">
            <Chip>Free</Chip>
            <Chip>macOS 12+</Chip>
            <Chip>arm64</Chip>
            {/* Plain, not a flag chip. A flag marks a release state that is not
                simply shipping, and the chip's dot is what marks it rather than a
                second accent hue. The hub draws the same distinction: "Available
                now" is a plain chip, every other availability carries the dot. */}
            <Chip>Available now</Chip>
          </div>
          <p className="text-sm text-muted-foreground mt-3">
            Free to download and use &mdash; a signed, notarized .pkg, with no licence key and no
            account. Free to use in personal and commercial music productions. The installer
            download is 15.9 MB and needs 150 MB of free disk space once installed. Check it against
            this SHA-256 before you open it.
          </p>
        </div>

        <div className="actions">
          <a
            className="btn btn-primary"
            href={MACOS_DOWNLOAD_URL}
            onClick={() => track('download_click', { product: 'tempo-delay', version: '4.0.1' })}
          >
            Download for macOS
          </a>
          <a className="btn" href="#install">
            Installation guide
          </a>
          <a className="btn" href="#parameters">
            Parameter guide
          </a>
        </div>
      </div>

      <dl className="spec-grid download-spec-grid">
        <div>
          <dt>Installer</dt>
          <dd><code>StudioZIOTempoDelay-v4.0.1-macOS-arm64-AAX.pkg</code></dd>
        </div>
        <div>
          <dt>Release record</dt>
          <dd>
            <a href="https://github.com/StudioZIO/StudioZIO-Releases/releases/tag/tempo-delay-v4.0.1-aax-2026.09.10" className="download-release-link">
              tempo-delay-v4.0.1-aax-2026.09.10
            </a>
          </dd>
        </div>
        <div>
          <dt>SHA-256</dt>
          <dd className="sha">{MACOS_SHA256}</dd>
        </div>
      </dl>

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
    </div>
  </section>
);
