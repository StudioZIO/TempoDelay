import type { ReactNode } from 'react';

type ChipProps = {
  children: ReactNode;
  /** "signal" is amber: meters, clip states and release flags only. */
  tone?: 'muted' | 'signal';
  dot?: boolean;
};

/** Mono uppercase pill. Amber tone is a data flag, never an action. */
export const Chip = ({ children, tone = 'muted', dot = false }: ChipProps) => (
  <span className={tone === 'signal' ? 'chip chip--signal' : 'chip'}>
    {dot ? <span className="dot" aria-hidden="true" /> : null}
    {children}
  </span>
);
