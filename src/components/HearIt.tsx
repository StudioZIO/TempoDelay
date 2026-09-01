import { AudioDemo } from './AudioDemo';
import { Section } from './Section';

export const HearIt = () => (
  <Section
    id="demo"
    eyebrow="Hear it first"
    title="The same passage, dry and delayed"
    lede="Two renders of one performance, switched instantly so the playhead never moves. Both are matched to −12 LUFS integrated, because at different levels the louder one always wins and the comparison tells you nothing."
  >
    <AudioDemo
      title="Tempo Delay · 1/4 and 1/8D, ping-pong"
      dry="/audio/tempo-delay-dry"
      wet="/audio/tempo-delay-wet"
      processedLabel="Delayed"
      note="Rendered through Tempo Delay 4.0.1 at 44.1 kHz. Both files measure −12.0 LUFS integrated with a −3.1 dBTP true peak, so the only difference you hear is the effect."
    />
  </Section>
);
