import type { ReactNode } from 'react';

type PluginShotProps = { name: string; caption: string; children: ReactNode };

/**
 * Frames a rendering of the plugin interface in the site's own surface ramp.
 *
 * The rendering is drawn rather than captured: it stays crisp at any size,
 * sits in the site palette, weighs a couple of kilobytes and its labels are
 * real text a screen reader can reach. Because it is a drawing and not
 * evidence, it is captioned as one, and every load-bearing claim about the
 * plugin is stated in prose elsewhere on the page.
 */
export const PluginShot = ({ name, caption, children }: PluginShotProps) => (
  <figure className="panel plugin-shot">
    <div className="plugin-shot-bar" aria-hidden="true">
      <span className="plugin-shot-dot" />
      <span className="plugin-shot-dot" />
      <span className="plugin-shot-dot" />
      <span className="plugin-shot-name">{name}</span>
    </div>
    {children}
    <figcaption>{caption}</figcaption>
  </figure>
);
