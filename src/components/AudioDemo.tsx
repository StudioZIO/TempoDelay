import { useCallback, useEffect, useRef, useState } from 'react';
import { track } from '../analytics';

type AudioDemoProps = {
  /** Base path without extension; .opus and .m4a are both offered. */
  dry: string;
  wet: string;
  title: string;
  processedLabel: string;
  bypassLabel?: string;
  note: string;
};

/**
 * A/B player for two time-aligned renders of the same passage. Both files run
 * in lockstep and the toggle crossfades between them, so switching is instant
 * and keeps its place — the only thing that changes is the processing.
 *
 * Both renders are loudness-matched, which is the point: at different levels
 * the louder one always sounds better and the comparison tells you nothing.
 */
const Sources = ({ base }: { base: string }) => (
  <>
    {/* Opus first for the browsers that have it, AAC for Safari's older releases. */}
    <source src={`${base}.opus`} type="audio/ogg; codecs=opus" />
    <source src={`${base}.m4a`} type="audio/mp4; codecs=mp4a.40.2" />
  </>
);

export const AudioDemo = ({
  dry: dryBase,
  wet: wetBase,
  title,
  processedLabel,
  bypassLabel = 'Dry',
  note,
}: AudioDemoProps) => {
  const [playing, setPlaying] = useState(false);
  const [processed, setProcessed] = useState(true);
  const [level, setLevel] = useState(0);
  const [progress, setProgress] = useState(0);
  const [failed, setFailed] = useState(false);

  const dryEl = useRef<HTMLAudioElement | null>(null);
  const wetEl = useRef<HTMLAudioElement | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const dryGain = useRef<GainNode | null>(null);
  const wetGain = useRef<GainNode | null>(null);
  const analyser = useRef<AnalyserNode | null>(null);
  const raf = useRef<number | null>(null);

  const stopRaf = useCallback(() => {
    if (raf.current !== null) cancelAnimationFrame(raf.current);
    raf.current = null;
  }, []);

  useEffect(
    () => () => {
      stopRaf();
      void ctxRef.current?.close();
      ctxRef.current = null;
    },
    [stopRaf],
  );

  // Crossfade on toggle. Before the graph exists, fall back to element volume
  // so the control still works if Web Audio is unavailable.
  useEffect(() => {
    const ctx = ctxRef.current;
    if (ctx && dryGain.current && wetGain.current) {
      const now = ctx.currentTime;
      dryGain.current.gain.setTargetAtTime(processed ? 0 : 1, now, 0.015);
      wetGain.current.gain.setTargetAtTime(processed ? 1 : 0, now, 0.015);
      return;
    }
    if (dryEl.current) dryEl.current.volume = processed ? 0 : 1;
    if (wetEl.current) wetEl.current.volume = processed ? 1 : 0;
  }, [processed]);

  const ensureGraph = () => {
    if (ctxRef.current) return;
    const Ctor =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    const dry = dryEl.current;
    const wet = wetEl.current;
    if (!Ctor || !dry || !wet) return;

    const ctx = new Ctor();
    const dryNode = ctx.createGain();
    const wetNode = ctx.createGain();
    dryNode.gain.value = processed ? 0 : 1;
    wetNode.gain.value = processed ? 1 : 0;

    const node = ctx.createAnalyser();
    node.fftSize = 256;

    ctx.createMediaElementSource(dry).connect(dryNode).connect(node);
    ctx.createMediaElementSource(wet).connect(wetNode).connect(node);
    node.connect(ctx.destination);

    dry.volume = 1;
    wet.volume = 1;

    ctxRef.current = ctx;
    dryGain.current = dryNode;
    wetGain.current = wetNode;
    analyser.current = node;
  };

  const stop = () => {
    dryEl.current?.pause();
    wetEl.current?.pause();
    stopRaf();
    setLevel(0);
    setPlaying(false);
  };

  const start = async () => {
    const dry = dryEl.current;
    const wet = wetEl.current;
    if (!dry || !wet) return;

    ensureGraph();
    await ctxRef.current?.resume();

    try {
      // Line the two renders up before either of them sounds.
      wet.currentTime = dry.currentTime;
      await Promise.all([dry.play(), wet.play()]);
    } catch {
      setFailed(true);
      return;
    }
    setPlaying(true);

    const data = new Uint8Array(128);
    const tick = () => {
      const node = analyser.current;
      if (node) {
        node.getByteTimeDomainData(data);
        let peak = 0;
        for (let i = 0; i < data.length; i += 1) {
          const value = Math.abs((data[i]! - 128) / 128);
          if (value > peak) peak = value;
        }
        setLevel(peak);
      }
      const d = dryEl.current;
      const w = wetEl.current;
      if (d && d.duration) setProgress(d.currentTime / d.duration);
      // Two elements will drift; pull them back together before it is audible.
      if (d && w && Math.abs(d.currentTime - w.currentTime) > 0.06) {
        w.currentTime = d.currentTime;
      }
      raf.current = requestAnimationFrame(tick);
    };
    stopRaf();
    raf.current = requestAnimationFrame(tick);
  };

  return (
    <div className="panel-float audio-demo">
      {/* preload="none": nothing is fetched until someone asks to hear it.
          With metadata preloading the two renders competed with the document
          for bandwidth and pushed first contentful paint from 1.0s to 2.6s on
          a throttled connection. */}
      <audio ref={dryEl} loop preload="none">
        <Sources base={dryBase} />
      </audio>
      <audio ref={wetEl} loop preload="none">
        <Sources base={wetBase} />
      </audio>

      <div className="audio-demo-head">
        <span className="eyebrow eyebrow--muted mb-0">{title}</span>
        <span className="audio-demo-state">
          {failed ? 'Playback blocked' : 'Real render · matched −12 LUFS'}
        </span>
      </div>

      <div className="audio-demo-body">
        <button
          type="button"
          className={playing ? 'btn shrink-0' : 'btn btn-primary shrink-0'}
          aria-pressed={playing}
          onClick={playing ? stop : start}
        >
          {playing ? 'Stop' : 'Hear it'}
        </button>

        <div className="seg" role="group" aria-label="Compare dry and processed">
          {[
            { on: false, label: bypassLabel },
            { on: true, label: processedLabel },
          ].map((option) => (
            <button
              key={option.label}
              type="button"
              className="seg-option"
              aria-pressed={processed === option.on}
              onClick={() => {
                setProcessed(option.on);
                track('ab_toggle', { take: option.on ? 'processed' : 'dry', product: 'tempo-delay' });
              }}
            >
              {option.label}
            </button>
          ))}
        </div>

        <div className="audio-demo-meters">
          <div className="audio-level" role="img" aria-label={`Output level ${Math.round(level * 100)} percent`}>
            <span
              className={level > 0.92 ? 'audio-level-fill is-hot' : 'audio-level-fill'}
              style={{ width: `${Math.min(100, level * 130)}%` }}
            />
          </div>
          <div className="audio-demo-foot">
            <span className="audio-demo-caption">Output</span>
            <span className="audio-progress">
              <span className="audio-progress-fill" style={{ width: `${Math.round(progress * 100)}%` }} />
            </span>
          </div>
        </div>
      </div>

      <p className="audio-demo-note">{note}</p>
    </div>
  );
};
