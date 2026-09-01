import type { ReactNode } from 'react';

type PluginShotProps = { name: string; caption: string; children: ReactNode };

/**
 * Frames a capture of the plugin interface in the site's own surface ramp.
 *
 * The capture is cropped to the plugin's own window, so no host chrome ships
 * with it and the frame around it is the site's, not another application's.
 * The image carries no text the page depends on: every value it shows is
 * repeated in its alt text, and every load-bearing claim about the plugin is
 * stated in prose elsewhere on the page.
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
