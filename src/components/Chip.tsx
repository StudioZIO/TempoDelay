import type { ReactNode } from 'react';

type ChipProps = {
  children: ReactNode;
  /** "flag" marks a release state. It is the dot that marks it, not a
      second accent hue: the plug-in window is single-accent. */
  tone?: 'muted' | 'flag';
  dot?: boolean;
};

/** Mono uppercase pill. A flag is data, never an action. */
export const Chip = ({ children, tone = 'muted', dot = false }: ChipProps) => (
  <span className={tone === 'flag' ? 'chip chip--flag' : 'chip'}>
    {dot ? <span className="dot" aria-hidden="true" /> : null}
    {children}
  </span>
);
