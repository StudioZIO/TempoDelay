const KNOBS = [
  { key: 'FB L', value: '45%', angle: -34 },
  { key: 'FB R', value: '45%', angle: -34 },
  { key: 'HPF', value: '80 Hz', angle: -108 },
  { key: 'LPF', value: '8 kHz', angle: 62 },
  { key: 'DRIVE', value: '20%', angle: -86 },
];

const Knob = ({ label, value, angle }: { label: string; value: string; angle: number }) => (
  <div className="knob">
    <svg viewBox="0 0 46 46" role="presentation" focusable="false" aria-hidden="true">
      <circle cx="23" cy="23" r="17" fill="var(--surface-control)" stroke="var(--border)" />
      <circle cx="23" cy="23" r="17" fill="none" stroke="var(--primary)" strokeWidth="2" strokeDasharray="70 200" strokeLinecap="round" transform="rotate(120 23 23)" />
      {/* transform-origin comes from .knob .ind, so the attribute carries the angle only */}
      <g className="ind" transform={`rotate(${angle})`}>
        <path d="M23 9v9" stroke="var(--foreground)" strokeWidth="2" strokeLinecap="round" />
      </g>
    </svg>
    <span className="k">{label}</span>
    <span className="v">{value}</span>
  </div>
);

/**
 * Static representation of the plugin surface. Flat rendering only:
 * no bloom, no blur, no filter of any kind.
 */
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
        <div className="mock-readouts">
          <div className="readout">
            <span className="k">L Div</span>
            <span className="v">1/4</span>
          </div>
          <div className="readout">
            <span className="k">R Div</span>
            <span className="v v--signal">1/8D</span>
          </div>
          <div className="readout">
            <span className="k">Mix</span>
            <span className="v v--plain">35%</span>
          </div>
          <div className="readout">
            <span className="k">Width</span>
            <span className="v v--plain">120%</span>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_5.5rem]">
          <div className="lane">
            <div className="lane-head">
              <span>Routing</span>
              <span>Ping-Pong</span>
            </div>
            <div className="lane-row">
              <span className="ch">L</span>
              <div className="lane-track">
                <span className="lane-sweep" aria-hidden="true" />
                <span className="lane-tap" style={{ left: '32%' }} aria-hidden="true" />
                <span className="lane-tap" style={{ left: '64%' }} aria-hidden="true" />
              </div>
            </div>
            <div className="lane-row lane-row--r">
              <span className="ch">R</span>
              <div className="lane-track">
                <span className="lane-sweep lane-sweep--offset" aria-hidden="true" />
                <span className="lane-tap" style={{ left: '21%' }} aria-hidden="true" />
                <span className="lane-tap" style={{ left: '48%' }} aria-hidden="true" />
              </div>
            </div>
            <div className="lane-foot">
              <span>120 BPM</span>
              <span>Tape</span>
            </div>
          </div>

          <div className="meter-stack" aria-hidden="true">
            <span className="meter" />
            <span className="meter" />
            <span className="meter" />
            <span className="meter" />
          </div>
        </div>

        <div className="mock-knobs">
          {KNOBS.map((knob) => (
            <Knob key={knob.key} label={knob.key} value={knob.value} angle={knob.angle} />
          ))}
        </div>
      </div>
    </div>
  </div>
);
