import { Section } from './Section';
import { SupportContact } from './SupportContact';

/** Anchors that still exist in the redesigned single page. */
const REFERENCES = [
  { href: '/#parameters', title: 'Parameter reference', note: 'All 32 automatable parameters, with their APVTS IDs, ranges and defaults.' },
  { href: '/#simulator', title: 'Signal flow', note: 'How routing, feedback and the tone stage fit together, end to end.' },
  { href: '/#specification', title: 'Specification', note: 'Sample rates, latency, formats and system requirements.' },
  { href: '/#download', title: 'Download and install', note: 'The signed macOS installer and what it needs on disk.' },
];

export const ContactPage = () => (
  <>
    <Section
      eyebrow="Support"
      title="Talk to the people who build it"
      lede="Bug reports, host compatibility and setup questions all reach the same desk. Most answers go out within 24–48 business hours."
    >
      <SupportContact />
    </Section>

    <Section
      eyebrow="Before you write"
      title="These usually answer it faster"
      lede="Every one of these is on the product page and needs no reply to read."
      tight
    >
      <div className="card-grid card-grid--2">
        {REFERENCES.map((reference) => (
          <a key={reference.href} className="panel module-card link-card" href={reference.href}>
            <h3>{reference.title}</h3>
            <p className="text-sm text-muted-foreground mt-2">{reference.note}</p>
          </a>
        ))}
      </div>
    </Section>
  </>
);
