import { useEffect, useMemo, useState } from 'react';

type Channel = 'left' | 'right';

type Edge = {
  id: string;
  d: string;
  channel: Channel;
  /** Pulse start offset, in seconds, so the passes stagger round the loop. */
  begin: string;
};

const DIVISIONS = ['1/16', '1/8', '1/8D', '1/4', '1/4D', '1/2'];

const DIVISION_MULTIPLIER: Record<string, number> = {
  '1/16': 0.25,
  '1/8': 0.5,
  '1/8D': 0.75,
  '1/4': 1,
  '1/4D': 1.5,
  '1/2': 2,
};

/** Straight-through path, always live in both routing modes. */
const THROUGH_EDGES: Edge[] = [
  { id: 'in-l', d: 'M 130 115 L 200 115', channel: 'left', begin: '0s' },
  { id: 'in-r', d: 'M 130 295 L 200 295', channel: 'right', begin: '0.15s' },
  { id: 'buf-l', d: 'M 340 115 L 450 115', channel: 'left', begin: '0.3s' },
  { id: 'buf-r', d: 'M 340 295 L 450 295', channel: 'right', begin: '0.45s' },
  { id: 'tone-l', d: 'M 580 115 L 630 185', channel: 'left', begin: '0.6s' },
  { id: 'tone-r', d: 'M 580 295 L 630 225', channel: 'right', begin: '0.75s' },
  { id: 'width-out', d: 'M 740 205 L 780 205', channel: 'left', begin: '0.85s' },
];

/** Ping-pong sends every repeat to the opposite buffer. */
const CROSS_EDGES: Edge[] = [
  { id: 'cross-lr', d: 'M 340 115 C 410 115, 170 295, 200 295', channel: 'left', begin: '0.35s' },
  { id: 'cross-rl', d: 'M 340 295 C 410 295, 170 115, 200 115', channel: 'right', begin: '0.55s' },
];

/** Parallel keeps every repeat on the side it started. */
const DIRECT_EDGES: Edge[] = [
  {
    id: 'direct-l',
    d: 'M 340 100 C 400 60, 400 30, 270 30 C 230 30, 230 65, 230 75',
    channel: 'left',
    begin: '0.35s',
  },
  {
    id: 'direct-r',
    d: 'M 340 310 C 400 350, 400 380, 270 380 C 230 380, 230 345, 230 335',
    channel: 'right',
    begin: '0.55s',
  },
];

/* Both channels are the instrument cyan. The right channel's paths and node
   borders run a deeper step of the same hue, which keeps two crossing lines
   separable without introducing a second accent colour; its text stays on the
   lighter --primary-text step so the readouts are as legible as the left's.
   The L and R labels, not the colour, are what name the channels. */
const strokeFor = (channel: Channel) => (channel === 'left' ? 'var(--primary)' : 'var(--primary-deep)');
const markerFor = (channel: Channel) => (channel === 'left' ? 'url(#td-arrow-left)' : 'url(#td-arrow-right)');

const usePrefersReducedMotion = () => {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return undefined;
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReduced(query.matches);
    sync();
    query.addEventListener('change', sync);
    return () => query.removeEventListener('change', sync);
  }, []);

  return reduced;
};

const SignalEdge = ({ edge, active, animate }: { edge: Edge; active: boolean; animate: boolean }) => (
  <path
    d={edge.d}
    fill="none"
    stroke={strokeFor(edge.channel)}
    strokeWidth="2"
    strokeLinecap="round"
    markerEnd={markerFor(edge.channel)}
    className={`edge${active ? '' : ' edge--idle'}${active && animate ? ' edge--flow' : ''}`}
    {...(active && animate ? { strokeDasharray: '8 20' } : {})}
  />
);

// Radii and opacity scale straight from the amplitude, so a full hold lands on
// exactly the values the visible-state work settled on (ring r 16 at 0.48,
// core r 7) and a decay shrinks the head to nothing instead of cutting it off
// mid-size, which read as a pop when the loop emptied.
const PulseHead = ({ edge, amplitude, animate }: { edge: Edge; amplitude: number; animate: boolean }) => {
  const stroke = strokeFor(edge.channel);
  if (!animate || amplitude <= 0) return null;
  return (
    <g>
      <circle r={amplitude * 16} fill={stroke} opacity={amplitude * 0.48}>
        <animateMotion path={edge.d} dur="0.9s" begin={edge.begin} repeatCount="indefinite" />
      </circle>
      <circle r={amplitude * 7} fill={stroke}>
        <animateMotion path={edge.d} dur="0.9s" begin={edge.begin} repeatCount="indefinite" />
      </circle>
    </g>
  );
};

export const InteractiveVisualizer = () => {
  const [pingPong, setPingPong] = useState(true);
  const [bpm, setBpm] = useState(120);
  const [leftDivision, setLeftDivision] = useState('1/8D');
  const [rightDivision, setRightDivision] = useState('1/8');
  const [running, setRunning] = useState(false);
  const [amplitude, setAmplitude] = useState(0);

  const reducedMotion = usePrefersReducedMotion();
  const decaying = !running && amplitude > 0;

  useEffect(() => {
    if (!decaying) return undefined;
    const timer = window.setInterval(() => {
      setAmplitude((current) => {
        const next = current * 0.55;
        return next < 0.07 ? 0 : next;
      });
    }, 900);
    return () => window.clearInterval(timer);
  }, [decaying]);

  const quarterMs = 60000 / bpm;
  const leftMs = Math.round(quarterMs * DIVISION_MULTIPLIER[leftDivision]);
  const rightMs = Math.round(quarterMs * DIVISION_MULTIPLIER[rightDivision]);

  const feedbackEdges = useMemo(() => [...CROSS_EDGES, ...DIRECT_EDGES], []);
  const activeFeedbackIds = pingPong ? ['cross-lr', 'cross-rl'] : ['direct-l', 'direct-r'];

  // Rest means rest: with nothing held, the loop empties out and the diagram
  // stops completely. While the toggle is on the amplitude is pinned so the
  // loop never dies; releasing it lets each pass decay to nothing, the way a
  // delay's repeats actually die out, and then the picture holds still.
  const liveAmplitude = running ? 1 : amplitude;
  const animate = !reducedMotion;
  const moving = animate && liveAmplitude > 0;

  const toggleImpulse = () => {
    if (running) {
      setRunning(false);
      return;
    }
    setRunning(true);
    setAmplitude(1);
  };

  const pulseEdges = [...THROUGH_EDGES, ...feedbackEdges.filter((edge) => activeFeedbackIds.includes(edge.id))];

  return (
    <section id="simulator" className="section scroll-mt-24">
      <div className="shell">
        <div className="section-head">
          <p className="eyebrow">Signal Flow Simulator</p>
          <h2>How the routing actually moves</h2>
          <p className="lede">
            Change the routing mode, tempo and note divisions to watch audio travel through both delay
            buffers, the cross-channel feedback matrix, the drive and tone stage, and the width matrix.
          </p>
        </div>

        <div className="notice-warn mb-8">
          <svg className="notice-mark" width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M12 9v3.5m0 3.5h.01M10.3 4.2 3.4 16.1c-.8 1.3.2 3 1.7 3h13.8c1.5 0 2.5-1.7 1.7-3L13.7 4.2c-.8-1.3-2.6-1.3-3.4 0Z"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div>
            <span className="notice-label">Educational interactive visualization</span>
            <p>
              This diagram demonstrates DSP signal routing mechanics: ping-pong cross feedback, delay
              times and feedback filters. It is not the native plugin interface.
            </p>
          </div>
        </div>

        <div className="panel p-5 sm:p-6 grid gap-6">
          <div className="control-strip">
            <div className="control">
              <div className="control-head">
                <span>Routing mode</span>
              </div>
              <button
                type="button"
                className="btn btn-sm w-full"
                aria-pressed={pingPong}
                onClick={() => setPingPong((current) => !current)}
              >
                {pingPong ? 'Ping-Pong' : 'Parallel'}
              </button>
            </div>

            <div className="control">
              <div className="control-head">
                <span>Tempo</span>
                <span className="val">{bpm} BPM</span>
              </div>
              <input
                type="range"
                className="range"
                min="60"
                max="200"
                value={bpm}
                onChange={(event) => setBpm(Number(event.target.value))}
                aria-label="Tempo in BPM"
              />
            </div>

            <div className="control">
              <div className="control-head">
                <span>Left division</span>
                <span className="val">{leftMs} ms</span>
              </div>
              <select
                className="field field-mono"
                value={leftDivision}
                onChange={(event) => setLeftDivision(event.target.value)}
                aria-label="Left delay division"
              >
                {DIVISIONS.map((division) => (
                  <option key={division} value={division}>
                    {division}
                  </option>
                ))}
              </select>
            </div>

            <div className="control">
              <div className="control-head">
                <span>Right division</span>
                <span className="val val--alt">{rightMs} ms</span>
              </div>
              <select
                className="field field-mono"
                value={rightDivision}
                onChange={(event) => setRightDivision(event.target.value)}
                aria-label="Right delay division"
              >
                {DIVISIONS.map((division) => (
                  <option key={division} value={division}>
                    {division}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="diagram-frame" data-impulse={running ? 'held' : 'rest'}>
            <svg viewBox="0 0 900 420" className="w-full h-auto" role="img" aria-label="Tempo Delay signal flow diagram">
              <defs>
                <marker id="td-arrow-left" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
                  <path d="M0,0 L8,4 L0,8 Z" fill="var(--primary)" />
                </marker>
                <marker id="td-arrow-right" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
                  <path d="M0,0 L8,4 L0,8 Z" fill="var(--primary-deep)" />
                </marker>
              </defs>

              {THROUGH_EDGES.map((edge) => (
                <SignalEdge key={edge.id} edge={edge} active animate={moving} />
              ))}

              {feedbackEdges.map((edge) => (
                <SignalEdge
                  key={edge.id}
                  edge={edge}
                  active={activeFeedbackIds.includes(edge.id)}
                  animate={moving}
                />
              ))}

              <g opacity={pingPong ? 1 : 0.12}>
                <text x="352" y="176" fill="var(--primary)" fontSize="11" fontFamily="var(--font-mono)">
                  CROSS L → R
                </text>
                <text x="352" y="248" fill="var(--primary-text)" fontSize="11" fontFamily="var(--font-mono)">
                  CROSS R → L
                </text>
              </g>
              <g opacity={pingPong ? 0.12 : 1}>
                <text x="286" y="22" fill="var(--primary)" fontSize="11" fontFamily="var(--font-mono)">
                  FEEDBACK L
                </text>
                <text x="286" y="400" fill="var(--primary-text)" fontSize="11" fontFamily="var(--font-mono)">
                  FEEDBACK R
                </text>
              </g>

              {/* Input L */}
              <g transform="translate(40, 90)">
                <rect width="90" height="50" rx="8" fill="var(--surface-raised)" stroke="var(--primary)" strokeWidth="1.5" />
                <text x="45" y="24" fill="var(--primary)" textAnchor="middle" fontSize="12" fontFamily="var(--font-mono)">
                  INPUT L
                </text>
                <text x="45" y="40" fill="var(--muted-foreground)" textAnchor="middle" fontSize="10">
                  Audio in
                </text>
              </g>

              {/* Input R */}
              <g transform="translate(40, 270)">
                <rect width="90" height="50" rx="8" fill="var(--surface-raised)" stroke="var(--primary-deep)" strokeWidth="1.5" />
                <text x="45" y="24" fill="var(--primary-text)" textAnchor="middle" fontSize="12" fontFamily="var(--font-mono)">
                  INPUT R
                </text>
                <text x="45" y="40" fill="var(--muted-foreground)" textAnchor="middle" fontSize="10">
                  Audio in
                </text>
              </g>

              {/* Left buffer — hero node */}
              <g transform="translate(200, 75)">
                <rect
                  width="140"
                  height="80"
                  rx="10"
                  fill="var(--surface-overlay)"
                  stroke="var(--primary)"
                  strokeWidth="2.5"
                  className={moving ? 'node-breathe' : undefined}
                />
                <text x="70" y="28" fill="var(--foreground)" textAnchor="middle" fontSize="13" fontWeight="600">
                  LEFT BUFFER
                </text>
                <text x="70" y="48" fill="var(--primary)" textAnchor="middle" fontSize="12" fontFamily="var(--font-mono)">
                  {leftDivision} · {leftMs} ms
                </text>
                <text x="70" y="66" fill="var(--muted-foreground)" textAnchor="middle" fontSize="10" fontFamily="var(--font-mono)">
                  FB 40%
                </text>
              </g>

              {/* Right buffer — hero node */}
              <g transform="translate(200, 255)">
                <rect
                  width="140"
                  height="80"
                  rx="10"
                  fill="var(--surface-overlay)"
                  stroke="var(--primary-deep)"
                  strokeWidth="2.5"
                  className={moving ? 'node-breathe' : undefined}
                />
                <text x="70" y="28" fill="var(--foreground)" textAnchor="middle" fontSize="13" fontWeight="600">
                  RIGHT BUFFER
                </text>
                <text x="70" y="48" fill="var(--primary-text)" textAnchor="middle" fontSize="12" fontFamily="var(--font-mono)">
                  {rightDivision} · {rightMs} ms
                </text>
                <text x="70" y="66" fill="var(--muted-foreground)" textAnchor="middle" fontSize="10" fontFamily="var(--font-mono)">
                  FB 40%
                </text>
              </g>

              {/* Tone & drive L */}
              <g transform="translate(450, 80)">
                <rect width="130" height="70" rx="10" fill="var(--surface-raised)" stroke="var(--primary)" strokeWidth="1.5" />
                <text x="65" y="26" fill="var(--foreground)" textAnchor="middle" fontSize="11" fontWeight="600">
                  TONE &amp; DRIVE L
                </text>
                <text x="65" y="43" fill="var(--primary)" textAnchor="middle" fontSize="10" fontFamily="var(--font-mono)">
                  DRIVE 30%
                </text>
                <text x="65" y="58" fill="var(--muted-foreground)" textAnchor="middle" fontSize="9" fontFamily="var(--font-mono)">
                  HPF 80 · LPF 8k
                </text>
              </g>

              {/* Tone & drive R */}
              <g transform="translate(450, 260)">
                <rect width="130" height="70" rx="10" fill="var(--surface-raised)" stroke="var(--primary-deep)" strokeWidth="1.5" />
                <text x="65" y="26" fill="var(--foreground)" textAnchor="middle" fontSize="11" fontWeight="600">
                  TONE &amp; DRIVE R
                </text>
                <text x="65" y="43" fill="var(--primary-text)" textAnchor="middle" fontSize="10" fontFamily="var(--font-mono)">
                  DRIVE 30%
                </text>
                <text x="65" y="58" fill="var(--muted-foreground)" textAnchor="middle" fontSize="9" fontFamily="var(--font-mono)">
                  HPF 80 · LPF 8k
                </text>
              </g>

              {/* Stereo width */}
              <g transform="translate(630, 165)">
                <rect width="110" height="80" rx="10" fill="var(--surface-raised)" stroke="var(--border)" strokeWidth="1.5" />
                <text x="55" y="30" fill="var(--foreground)" textAnchor="middle" fontSize="12" fontWeight="600">
                  STEREO WIDTH
                </text>
                <text x="55" y="50" fill="var(--primary)" textAnchor="middle" fontSize="13" fontFamily="var(--font-mono)">
                  100%
                </text>
                <text x="55" y="66" fill="var(--muted-foreground)" textAnchor="middle" fontSize="10">
                  Mid/side matrix
                </text>
              </g>

              {/* Master out — hero node */}
              <g transform="translate(780, 175)">
                <rect
                  width="90"
                  height="60"
                  rx="10"
                  fill="var(--surface-overlay)"
                  stroke="var(--primary)"
                  strokeWidth="2.5"
                  className={moving ? 'node-breathe' : undefined}
                />
                <text x="45" y="27" fill="var(--foreground)" textAnchor="middle" fontSize="11" fontWeight="600">
                  MASTER OUT
                </text>
                <text x="45" y="44" fill="var(--primary)" textAnchor="middle" fontSize="11" fontFamily="var(--font-mono)">
                  MIX 35%
                </text>
              </g>

              {moving
                ? pulseEdges.map((edge) => (
                    <PulseHead key={`pulse-${edge.id}`} edge={edge} amplitude={liveAmplitude} animate={moving} />
                  ))
                : null}
            </svg>
          </div>

          <div className="download-row panel-inset">
            <div>
              <p className="eyebrow eyebrow--muted mb-2">
                Continuous impulse
                <span className={running ? 'impulse-state impulse-state--held' : 'impulse-state'}>
                  {running ? 'Held' : 'Resting'}
                </span>
              </p>
              <p className="text-sm text-muted-foreground">
                At rest the diagram is still. Hold an impulse in the loop to watch the passes travel:
                while it runs the amplitude stays pinned, and once stopped each pass decays away until
                the loop is empty again.
              </p>
            </div>
            <button
              type="button"
              className={running ? 'btn btn-primary shrink-0' : 'btn shrink-0'}
              aria-pressed={running}
              onClick={toggleImpulse}
            >
              {running ? 'Stop Impulse' : 'Continuous Impulse'}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
