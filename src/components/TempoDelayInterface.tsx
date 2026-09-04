import { PluginShot } from './PluginShot';
import { Section } from './Section';

export const TempoDelayInterface = () => (
  <Section
    id="interface"
    eyebrow="The interface"
    title="One window, nothing buried"
    lede="The delay engine sits on the surface: sync, divisions, independent feedback per side, width and mix. Tone, modulation and routing are one tab away, never a nested page."
  >
    <div className="interface-shots">
      <PluginShot
        name="StudioZIO Tempo Delay 4.0.1 — Tone & Filters"
        caption="Final standalone interface with real audio driving the meters. Cropped to the GUI only."
      >
        <img
          className="gui-render"
          src="/images/tempo-delay-ui.png"
          width={1440}
          height={760}
          decoding="async"
          alt="The final Tempo Delay interface with Tone and Filters open. The signal path shows 120 BPM, independent left and right divisions, 80 Hz to 8 kHz filtering, 45 per cent feedback, Digital character, 100 per cent width and 50 per cent mix. Real audio is active in the input, wet and output meters."
        />
      </PluginShot>

      <PluginShot
        name="StudioZIO Tempo Delay 4.0.1 — Advanced & Routing"
        caption="The same audio-active standalone session with the complete routing and gain page visible."
      >
        <img
          className="gui-render"
          src="/images/tempo-delay-routing.png"
          width={1440}
          height={760}
          loading="lazy"
          decoding="async"
          alt="The final Tempo Delay interface with Advanced and Routing open. Creative routing, ducking and input, wet and output gain controls are grouped below the delay engine while the live stereo meters and correlation display remain visible."
        />
      </PluginShot>
    </div>
  </Section>
);
