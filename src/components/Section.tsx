import type { ReactNode } from 'react';

type SectionProps = {
  id?: string;
  eyebrow: string;
  title: string;
  lede?: string;
  children?: ReactNode;
  tight?: boolean;
};

/** Hairline-separated band: eyebrow, h2, optional lede, then a content slot. */
export const Section = ({ id, eyebrow, title, lede, children, tight = false }: SectionProps) => (
  <section id={id} className={tight ? 'section section--tight scroll-mt-24' : 'section scroll-mt-24'}>
    <div className="shell">
      <div className="section-head">
        <p className="eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
        {lede ? <p className="lede">{lede}</p> : null}
      </div>
      {children}
    </div>
  </section>
);
