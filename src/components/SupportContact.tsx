import { useId, useRef, useState, type FormEvent } from 'react';

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mrpzbbzp';

const CATEGORIES = [
  'Technical Support',
  'DAW Compatibility',
  'Bug Report',
  'Feature Inquiry',
] as const;

type Status =
  | { kind: 'idle' }
  | { kind: 'sending' }
  | { kind: 'sent'; name: string; category: string }
  | { kind: 'error'; text: string };

const EMPTY = {
  fullName: '',
  email: '',
  category: CATEGORIES[0] as string,
  operatingSystem: '',
  daw: '',
  message: '',
};

export const SupportContact = () => {
  const [form, setForm] = useState(EMPTY);
  const [honeypot, setHoneypot] = useState('');
  const [status, setStatus] = useState<Status>({ kind: 'idle' });
  const resultRef = useRef<HTMLDivElement>(null);
  const id = useId();

  const field = (name: string) => `${id}-${name}`;
  const set = (key: keyof typeof EMPTY) => (value: string) =>
    setForm((current) => ({ ...current, [key]: value }));

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Bots fill every field they can see; people never reach this one.
    // Report the same success they'd get so a bot learns nothing from the
    // difference, but send nothing.
    if (honeypot.trim().length > 0) {
      setStatus({ kind: 'sent', name: form.fullName, category: form.category });
      return;
    }

    setStatus({ kind: 'sending' });

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          name: form.fullName,
          email: form.email,
          category: form.category,
          os: form.operatingSystem,
          daw: form.daw,
          message: form.message,
          _subject: `StudioZIO Support Inquiry: ${form.category} - ${form.fullName}`,
        }),
      });

      // The previous version swallowed every failure and reported success
      // regardless, so a message that never arrived still looked sent.
      if (!response.ok) {
        setStatus({
          kind: 'error',
          text: `The support desk rejected the message (HTTP ${response.status}). Please try again, or email the address below.`,
        });
        return;
      }

      setStatus({ kind: 'sent', name: form.fullName, category: form.category });
      setForm(EMPTY);
    } catch {
      setStatus({
        kind: 'error',
        text: 'The message could not be sent — check your connection and try again.',
      });
    }
  };

  const sending = status.kind === 'sending';

  if (status.kind === 'sent') {
    return (
      <div className="panel-float form-result" ref={resultRef} tabIndex={-1}>
        <p className="eyebrow eyebrow--muted mb-2">Received</p>
        <h3>Your inquiry is with the support desk</h3>
        <p className="text-sm text-muted-foreground mt-2">
          Thanks{status.name ? `, ${status.name}` : ''} — your “{status.category}” request has been
          queued. Replies normally go out within 24–48 business hours, to the address you gave.
        </p>
        <div className="actions mt-4">
          <button type="button" className="btn" onClick={() => setStatus({ kind: 'idle' })}>
            Send another inquiry
          </button>
        </div>
      </div>
    );
  }

  return (
    <form className="panel-float support-form" onSubmit={handleSubmit} noValidate={false}>
      <div className="form-hp" aria-hidden="true">
        <label htmlFor={field('company')}>Company</label>
        <input
          id={field('company')}
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(event) => setHoneypot(event.target.value)}
        />
      </div>

      <div className="form-grid form-grid--2">
        <div className="form-row">
          <label className="form-label" htmlFor={field('name')}>
            Name <span className="req">required</span>
          </label>
          <input
            id={field('name')}
            className="field"
            type="text"
            required
            autoComplete="name"
            value={form.fullName}
            onChange={(event) => set('fullName')(event.target.value)}
          />
        </div>

        <div className="form-row">
          <label className="form-label" htmlFor={field('email')}>
            Email <span className="req">required</span>
          </label>
          <input
            id={field('email')}
            className="field"
            type="email"
            required
            autoComplete="email"
            value={form.email}
            onChange={(event) => set('email')(event.target.value)}
          />
          <p className="form-hint" id={field('email-hint')}>
            The only address the reply can reach.
          </p>
        </div>
      </div>

      <div className="form-grid form-grid--3">
        <div className="form-row">
          <label className="form-label" htmlFor={field('category')}>
            Category
          </label>
          <select
            id={field('category')}
            className="field"
            value={form.category}
            onChange={(event) => set('category')(event.target.value)}
          >
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="form-row">
          <label className="form-label" htmlFor={field('os')}>
            Operating system
          </label>
          <input
            id={field('os')}
            className="field field-mono"
            type="text"
            placeholder="macOS 14"
            value={form.operatingSystem}
            onChange={(event) => set('operatingSystem')(event.target.value)}
          />
        </div>

        <div className="form-row">
          <label className="form-label" htmlFor={field('daw')}>
            Host DAW
          </label>
          <input
            id={field('daw')}
            className="field field-mono"
            type="text"
            placeholder="Logic Pro"
            value={form.daw}
            onChange={(event) => set('daw')(event.target.value)}
          />
        </div>
      </div>

      <div className="form-row">
        <label className="form-label" htmlFor={field('message')}>
          Message <span className="req">required</span>
        </label>
        <textarea
          id={field('message')}
          className="field field-area"
          required
          rows={6}
          value={form.message}
          onChange={(event) => set('message')(event.target.value)}
        />
        <p className="form-hint">
          For a bug, the host, its version and what you did before it happened get to an answer
          fastest.
        </p>
      </div>

      <div aria-live="polite" role="status">
        {status.kind === 'error' ? <p className="form-error">{status.text}</p> : null}
      </div>

      <div className="actions">
        <button type="submit" className="btn btn-primary" disabled={sending}>
          {sending ? 'Sending…' : 'Send inquiry'}
        </button>
      </div>
    </form>
  );
};
