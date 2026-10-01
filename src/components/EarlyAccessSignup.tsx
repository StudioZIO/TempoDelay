import { useState } from 'react';
import { track } from '../analytics';

/* The StudioZIO Early Access sign-up, directly under each download box.

   Same wording, list and consent version as the hub's /early-access/ page
   (owner's call, 1 October 2026). Only metadata__source differs, so the list
   records which site a sign-up came from.

   After the download, never in front of it: the installer still needs no
   email, and nothing here touches the download link.

   A native POST, because Buttondown's embed endpoint must be a form action,
   not a fetch -- so submit is never prevented. The page is served with
   form-action https://buttondown.com and nothing wider. The submit handler
   only reports early_access_submit and says what happens next; it runs once
   the browser has accepted the form as valid, so an empty click is not
   counted. With JavaScript off the form still posts.

   The consent wording is versioned: change the text, change the date. */
export const EARLY_ACCESS_ENDPOINT = 'https://buttondown.com/api/emails/embed-subscribe/studiozio';
export const EARLY_ACCESS_CONSENT_VERSION = '2026-09-21';
export const EARLY_ACCESS_SOURCE = 'www.tempodelay.tech/';
const EARLY_ACCESS_CONSENT_TEXT =
  'I want to receive StudioZIO Early Access emails about product updates, release news and testing opportunities. I can unsubscribe at any time.';
const PRIVACY_URL = 'https://www.studiozio.tech/privacy/';

/** idPrefix keeps the ids unique when the page carries more than one copy. */
export const EarlyAccessSignup = ({ idPrefix }: { idPrefix: string }) => {
  const [status, setStatus] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const id = (name: string) => `${idPrefix}-${name}`;

  const onSubmit = () => {
    track('early_access_submit', { source: EARLY_ACCESS_SOURCE, transport_type: 'beacon' });
    setStatus('Opening Buttondown to finish signing up. Check your inbox for the confirmation email.');
    /* Guard against a double post while the next page loads. Deferred so the
       browser has already captured the form data and started the POST. */
    window.setTimeout(() => setSubmitted(true), 0);
  };

  return (
    <form
      className="panel-float early-access-form mt-6"
      action={EARLY_ACCESS_ENDPOINT}
      method="post"
      aria-labelledby={id('title')}
      onSubmit={onSubmit}
    >
      <input type="hidden" name="metadata__consent_version" value={EARLY_ACCESS_CONSENT_VERSION} />
      <input type="hidden" name="metadata__source" value={EARLY_ACCESS_SOURCE} />

      <p className="eyebrow">Early Access</p>
      <h3 id={id('title')}>StudioZIO Early Access</h3>
      <p className="lede">
        Join StudioZIO Early Access for product updates, release news and future testing opportunities.
      </p>
      <p className="lede">
        It is an email list and nothing more: it costs nothing, and signing up does not reserve a
        product, a price, a discount, a release date or a place in any test.
      </p>

      <div className="form-row">
        <label className="form-label" htmlFor={id('email')}>
          Email <span className="req">required</span>
        </label>
        <input
          id={id('email')}
          name="email"
          className="field"
          type="email"
          required
          autoComplete="email"
          aria-describedby={id('email-hint')}
        />
        <p className="form-hint" id={id('email-hint')}>Used only for StudioZIO Early Access emails.</p>
      </div>

      <div className="form-check">
        <input id={id('consent')} name="metadata__consent" type="checkbox" value="True" required />
        <label htmlFor={id('consent')}>
          {EARLY_ACCESS_CONSENT_TEXT} <span className="req">required</span>
        </label>
      </div>

      <p className="form-hint">
        After you join, Buttondown sends an email asking you to confirm your address; nothing else
        arrives until you do. Every email has an unsubscribe link. Buttondown, a US-based newsletter
        service, stores the list and sends the emails. See the <a href={PRIVACY_URL}>privacy policy</a>.
      </p>

      <p className="form-status" role="status" aria-live="polite">{status}</p>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary" disabled={submitted}>
          Join Early Access
        </button>
      </div>
    </form>
  );
};
