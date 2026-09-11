import { Section } from './Section';

/**
 * Installation guide, on the one canonical document rather than a route of its
 * own: this site is one document by contract (verify_dist.mjs fails a second
 * index.html or a second sitemap URL), so the guide is a section with its own
 * anchor, #install, linked from the download panel.
 *
 * Every path below is read from the frozen release artifact, not written from
 * memory: StudioZIOTempoDelay-v4.0.1-macOS-arm64-AAX.pkg, release
 * tempo-delay-v4.0.1-aax-2026.09.10, SHA-256 4e919c50…c055. Its Distribution
 * declares four components, hostArchitectures="arm64" and macOS 12.0 minimum;
 * each component's PackageInfo install-location and payload bundle name give
 * the destinations. They match release-truth/tempo-delay-4.0.1.yaml in
 * StudioZIO/StudioZIO-Releases. Change them only together with a new artifact.
 *
 * Host rows keep the hub's distinction (studiozio.vercel.app/community/
 * compatibility/): REAPER, Logic Pro and Pro Tools carry StudioZIO Verified;
 * every other host is listed by format support only, not by test evidence.
 */

const STEPS: { title: string; body: string }[] = [
  {
    title: 'Download the installer',
    body:
      'Get StudioZIOTempoDelay-v4.0.1-macOS-arm64-AAX.pkg from the download panel above. It comes from the StudioZIO release registry, and the panel lists its SHA-256; to check your copy, run shasum -a 256 on the file in Terminal and compare the two.',
  },
  {
    title: 'Open the package',
    body:
      'Double-click the .pkg. It is Developer ID signed and notarized by Apple, so macOS Installer opens it as it is. No security setting needs to change.',
  },
  {
    title: 'Choose the formats',
    body:
      'The Installation Type step lists four components: Audio Unit, VST3, AAX for Pro Tools, and the Standalone application. All four are selected; untick any format you do not use.',
  },
  {
    title: 'Install',
    body:
      'Click Install and confirm with an administrator password. The components go into the shared system folders listed below, so every account on the Mac can use them.',
  },
  {
    title: 'Restart or rescan your host',
    body:
      'Quit and reopen your DAW so it scans its plug-in folders again. Most hosts scan at launch; some also offer a manual rescan in their plug-in settings.',
  },
  {
    title: 'Find it in your host',
    body:
      'Look for StudioZIO Tempo Delay under the manufacturer StudioZIO in the plug-in list. Without a host, open StudioZIOTempoDelay from Applications.',
  },
];

const DESTINATIONS: { format: string; path: string }[] = [
  { format: 'Audio Unit (AU)', path: '/Library/Audio/Plug-Ins/Components/StudioZIOTempoDelay.component' },
  { format: 'VST3', path: '/Library/Audio/Plug-Ins/VST3/StudioZIOTempoDelay.vst3' },
  { format: 'AAX', path: '/Library/Application Support/Avid/Audio/Plug-Ins/StudioZIOTempoDelay.aaxplugin' },
  { format: 'Standalone', path: '/Applications/StudioZIOTempoDelay.app' },
];

const HOSTS: { host: string; format: string; status: string }[] = [
  { host: 'Logic Pro', format: 'Audio Unit (AU)', status: 'StudioZIO Verified' },
  { host: 'Pro Tools', format: 'AAX', status: 'StudioZIO Verified' },
  { host: 'REAPER', format: 'VST3 or AU', status: 'StudioZIO Verified' },
  { host: 'Elgato Wave Link', format: 'Audio Unit (AU), the format Wave Link loads on macOS', status: 'Format support only' },
  { host: 'Other macOS hosts', format: 'VST3 or AU, whichever the host supports', status: 'Format support only' },
  { host: 'No host', format: 'Standalone application', status: 'Runs on its own' },
];

const COMPATIBILITY_URL = 'https://studiozio.vercel.app/community/compatibility/';
const SUPPORT_URL = 'https://github.com/StudioZIO/Support/issues';
const CONTACT_URL = 'https://studiozio.vercel.app/contact/';

export const Install = () => (
  <Section
    id="install"
    eyebrow="Installation"
    title="Install Tempo Delay on macOS"
    lede="One signed, notarized installer puts all four formats in the standard macOS plug-in folders. Tempo Delay 4.0.1 is built for Apple Silicon (arm64) only and needs macOS 12 or later."
  >
    <ol className="card-grid card-grid--3">
      {STEPS.map((step, index) => (
        <li key={step.title} className="panel module-card">
          <span className="idx">{String(index + 1).padStart(2, '0')}</span>
          <h3>{step.title}</h3>
          <p>{step.body}</p>
        </li>
      ))}
    </ol>

    <h3 className="mt-12 mb-4">Where each format is installed</h3>
    <dl className="spec-grid">
      {DESTINATIONS.map((entry) => (
        <div key={entry.format}>
          <dt>{entry.format}</dt>
          <dd><code className="break-all text-sm">{entry.path}</code></dd>
        </div>
      ))}
    </dl>

    <h3 className="mt-12 mb-4">Which format your host loads</h3>
    <dl className="spec-grid">
      {HOSTS.map((entry) => (
        <div key={entry.host}>
          <dt>{entry.host}</dt>
          <dd>{entry.format}</dd>
          <dd className="text-sm text-muted-foreground">{entry.status}</dd>
        </div>
      ))}
    </dl>
    <p className="text-sm text-muted-foreground mt-4">
      StudioZIO Verified means direct test evidence for that host; format support only means the
      host loads the format, not that StudioZIO has tested it there. The current record is on the{' '}
      <a className="download-release-link underline underline-offset-2" href={COMPATIBILITY_URL}>
        compatibility page
      </a>
      .
    </p>

    <div className="card-grid card-grid--2 mt-12">
      <div className="panel module-card">
        <h3>Check that it appears</h3>
        <p>
          Logic Pro validates Audio Units when it starts; its Plug-in Manager shows the result. For a
          check outside any host, run <code>auval -v aufx Tdel Szio</code> in Terminal: it ends with
          AU VALIDATION SUCCEEDED when the Audio Unit is installed and loads. In Pro Tools, the
          plug-in appears in an insert slot's plug-in menu after the next launch.
        </p>
      </div>
      <div className="panel module-card">
        <h3>If it does not appear</h3>
        <p>
          Check that the bundle is at the path listed above for your format, that the Mac runs
          macOS 12 or later, and that the host runs natively on Apple Silicon: a host opened with
          Rosetta cannot load an arm64-only plug-in. Then quit and reopen the host or rescan. If it is
          still missing, open an issue on{' '}
          <a className="download-release-link underline underline-offset-2" href={SUPPORT_URL}>
            StudioZIO Support
          </a>{' '}
          or use the{' '}
          <a className="download-release-link underline underline-offset-2" href={CONTACT_URL}>
            contact form
          </a>
          , with your macOS version, host and version, and the format you tried.
        </p>
      </div>
    </div>
  </Section>
);
