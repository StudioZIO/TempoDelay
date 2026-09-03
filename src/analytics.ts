/* Conversion measurement.

   The site's GA4 contract (scripts/verify_dist.mjs, GA4_EXACTNESS) allows the
   standard js and config calls plus event calls whose names are on an
   allowlist. EventName below IS that allowlist: adding a name here without
   adding it there fails the production build, which is deliberate — the point
   of the contract is that nobody can quietly start measuring something new.

   Nothing here delays the interaction. GA4 sends over sendBeacon, which
   survives the page going away, so holding a download click back to "make sure
   the hit lands" would cost every visitor latency for nothing. Consent is not
   re-checked either: the tag applies Consent Mode before this can run. */
type EventName = 'download_click' | 'ab_toggle';

type Gtag = (command: 'event', name: EventName, params: Record<string, string>) => void;

export const track = (name: EventName, params: Record<string, string>): void => {
  const gtag = (window as unknown as { gtag?: Gtag }).gtag;
  if (typeof gtag !== 'function') return;
  gtag('event', name, params);
};
