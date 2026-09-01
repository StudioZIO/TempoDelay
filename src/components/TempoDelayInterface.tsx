import { PluginShot } from './PluginShot';
import { Section } from './Section';

export const TempoDelayInterface = () => (
  <Section
    id="interface"
    eyebrow="The interface"
    title="One window, nothing buried"
    lede="The delay engine sits on the surface: sync, divisions, independent feedback per side, width and mix. Tone, modulation and routing are one tab away, never a nested page."
  >
    {/* Not lazy: the panel is the section, and at 29 KB the request it would
        defer costs less than a blank frame if the observer never fires. */}
    <PluginShot
      name="StudioZIO Tempo Delay 4.0.1"
      caption="Captured from the plug-in on its default preset, cropped to the plug-in's own window."
    >
      <img
        className="gui-render"
        src="/images/tempo-delay-ui.webp"
        width={1120}
        height={720}
        decoding="async"
        alt="The Tempo Delay window. Tempo sync is on at 120 BPM with 1/8 dotted on the left and 1/8 on the right, giving 375 ms and 250 ms; feedback is 40 per cent on both sides, ping-pong is off, width is 100 per cent and mix is 35 per cent. The Tone and Filters tab is open, showing an 80 Hz high-pass, an 8 kHz low-pass and 30 per cent saturation."
      />
    </PluginShot>
  </Section>
);
