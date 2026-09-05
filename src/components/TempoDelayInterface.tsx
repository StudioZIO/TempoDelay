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
        caption="The Default Stereo Delay preset, running in the standalone app with real audio driving the meters and tempo sync off, which is why both delays read in milliseconds. These are the preset's values; the plug-in's own defaults are listed in the parameter guide below. Cropped to the GUI only."
      >
        <img
          className="gui-render"
          src="/images/tempo-delay-ui.png"
          width={1440}
          height={760}
          decoding="async"
          alt="The Tempo Delay interface on the Default Stereo Delay preset with Tone and Filters open. The signal path shows 120 BPM with sync off, independent left and right divisions, 80 Hz to 8 kHz filtering, 45 per cent feedback, Digital character, 100 per cent width and 50 per cent mix, and both delay times at 100 milliseconds. Real audio is active in the input, wet and output meters."
        />
      </PluginShot>

      <PluginShot
        name="StudioZIO Tempo Delay 4.0.1 — Advanced & Routing"
        caption="The same preset and the same audio-active session, with the complete routing and gain page visible."
      >
        <img
          className="gui-render"
          src="/images/tempo-delay-routing.png"
          width={1440}
          height={760}
          loading="lazy"
          decoding="async"
          alt="The Tempo Delay interface on the same Default Stereo Delay preset with Advanced and Routing open. Creative routing, ducking and input, wet and output gain controls are grouped below the delay engine while the live stereo meters and correlation display remain visible."
        />
      </PluginShot>
    </div>
  </Section>
);
