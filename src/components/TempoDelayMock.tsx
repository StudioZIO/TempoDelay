/* The plug-in surface as the plug-in actually presents it.

   This panel used to draw five rotary knobs. The window has none — it is
   sliders and numeric fields — and the four readouts above them disagreed
   with the shipped defaults on three of four values. What the window really
   leads with is a signal-path rail: every stage in the order the audio
   reaches it, which is the sentence printed across the top of the interface.

   So that is what this draws, and the numbers are the plug-in's own defaults
   rather than invented ones.

   Flat rendering only: no bloom, no blur, no filter of any kind. */

/** The eight stages the window puts across the top, left to right.

    Values are the APVTS defaults from src/data/parameters.ts, which is
    generated from the plug-in source and is what the parameter guide on this
    same page publishes. Note that the shipped screenshot is captured on the
    "Default Stereo Delay" preset, whose feedback, mix and delay times differ
    from those defaults -- the rail follows the manifest so that it cannot
    contradict the table two sections further down. */
const STAGES = [
  { key: 'Tempo', value: '120.0' },
  { key: 'Left', value: '1/8D' },
  { key: 'Right', value: '1/8' },
  { key: 'Tone', value: '80–8k' },
  { key: 'Fdbk', value: '40 %' },
  { key: 'Char', value: 'Digital' },
  { key: 'Width', value: '100 %' },
  { key: 'Mix', value: '35 %' },
];

export const TempoDelayMock = () => (
  <div className="panel overflow-hidden">
    <div className="mock">
      <div className="mock-head">
        <span className="mock-title">
          <span className="dot" aria-hidden="true" />
          Tempo Delay
        </span>
        <span className="chip chip--bare">Release 4.0.1</span>
      </div>

      <div className="mock-body">
        <div className="rail-head">
          <span>Signal path</span>
          <span>in the order the audio takes</span>
        </div>
        <div className="rail">
          {STAGES.map((stage) => (
            <span className="st" key={stage.key}>
              <span className="k">{stage.key}</span>
              <span className="v">{stage.value}</span>
            </span>
          ))}
        </div>

        {/* The headline claims the delay is locked to the host grid, so the
            motion states exactly that: the head crosses one bar at 120 BPM in
            2 s, and the two taps sit where the shipped divisions put them —
            1/8 dotted at 375 ms and 1/8 at 250 ms of a 2 s bar, which is 37.5%
            and 25% across. Nothing here is a free-running sweep. */}
        <div className="grid-pulse">
          <span className="gp-head">
            <span>Host grid</span>
            <span>120.0 BPM</span>
          </span>
          <span className="gp-track">
            <span className="beat" aria-hidden="true" />
            <span className="beat" aria-hidden="true" />
            <span className="beat" aria-hidden="true" />
            <span className="beat" aria-hidden="true" />
            <span className="gp-headmark" aria-hidden="true" />
            <span className="tap tap--l" aria-hidden="true" />
            <span className="tap tap--r" aria-hidden="true" />
          </span>
          <span className="gp-foot">
            <span>
              L <b>1/8D · 375 ms</b>
            </span>
            <span>
              R <b>1/8 · 250 ms</b>
            </span>
          </span>
        </div>

        {/* Left and right are told apart by their labels, not by a second
            accent hue — the window draws both channels in the same cyan. */}
        <div className="echo">
          <span className="echo-corr">
            <span className="echo-label">
              <span>Stereo echo field</span>
              <span>correlation +1.00</span>
            </span>
            <span className="echo-bar">
              <i />
            </span>
          </span>
          <span className="echo-big">
            100
            <small>ms L / R</small>
          </span>
        </div>
      </div>
    </div>
  </div>
);
