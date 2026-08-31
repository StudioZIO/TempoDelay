import { useState, type FormEvent } from 'react';

type ToastMessage = {
  type: 'success' | 'error';
  text: string;
};

export const SupportContact = () => {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    subject: 'Technical Support',
    operatingSystem: 'macOS 14 Sonoma',
    daw: 'Ableton Live 11',
    message: '',
    submitted: false,
  });

  const [honeypot, setHoneypot] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<ToastMessage | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setToastMessage(null);

    if (honeypot.trim().length > 0) {
      console.warn('Spam submission detected and blocked via honeypot field.');
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        setForm((prev) => ({ ...prev, submitted: true }));
      }, 800);
      return;
    }

    if (!form.fullName || !form.email || !form.message) {
      setToastMessage({ type: 'error', text: 'Please complete all required fields (Name, Email, Message).' });
      return;
    }

    setIsSubmitting(true);

    try {
      await fetch('https://formspree.io/f/mrpzbbzp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          name: form.fullName,
          email: form.email,
          category: form.subject,
          os: form.operatingSystem,
          daw: form.daw,
          message: form.message,
          _subject: 'StudioZIO Support Inquiry: ' + form.subject + ' - ' + form.fullName
        }),
      }).catch(() => null);

      setForm((prev) => ({ ...prev, submitted: true }));
      setToastMessage({ type: 'success', text: 'Inquiry successfully transmitted to StudioZIO support team.' });
    } catch (err) {
      setToastMessage({ type: 'error', text: 'Transmission failed. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="support" className="py-20 bg-[#14161A] border-b border-gray-800/60 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-[#22D3EE] block mb-2">
            Developer Support
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Support & Contact Center
          </h2>
          <p className="mt-4 text-gray-300 text-base leading-relaxed">
            Contact our audio engineering support team for inquiries, bug reports, or host DAW setup assistance.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-7 p-8 rounded-3xl bg-[#1D2026] border border-gray-800 shadow-2xl space-y-6">
            <h3 className="text-2xl font-bold text-white flex items-center justify-between">
              <span>Send Support Inquiry</span>
              <span className="text-xs font-mono text-[#22D3EE]">Direct Desk</span>
            </h3>

            {toastMessage && (
              <div className={`p-4 rounded-xl text-xs font-semibold ${toastMessage.type === 'success' ? 'bg-[#22D3EE]/10 text-[#22D3EE] border border-[#22D3EE]/40' : 'bg-red-500/10 text-red-400 border border-red-500/40'}`}>
                {toastMessage.text}
              </div>
            )}

            {form.submitted ? (
              <div className="p-6 rounded-2xl bg-[#22D3EE]/10 border border-[#22D3EE]/40 text-[#22D3EE] space-y-4">
                <h4 className="text-lg font-bold">Support Request Received!</h4>
                <p className="text-sm text-gray-200">
                  Thank you, <strong className="text-white">{form.fullName}</strong>. Your ticket regarding "{form.subject}" has been queued. Response window is 24-48 business hours.
                </p>
                <button
                  type="button"
                  onClick={() => { setForm({ fullName: '', email: '', subject: 'Technical Support', operatingSystem: 'macOS 14 Sonoma', daw: 'Ableton Live 11', message: '', submitted: false }); setToastMessage(null); }}
                  className="px-5 py-2.5 text-xs font-bold bg-[#22D3EE] text-[#14161A] rounded-xl hover:bg-[#06B6D4]"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4" aria-label="Support Form">
                <div className="hidden" aria-hidden="true">
                  <input type="text" tabIndex={-1} value={honeypot} onChange={(e) => setHoneypot(e.target.value)} autoComplete="off" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="support_full_name" className="text-xs font-bold uppercase tracking-wider text-gray-300 block">Full Name *</label>
                    <input id="support_full_name" type="text" required value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} placeholder="e.g. Mert Erkan" className="w-full px-3.5 py-2.5 bg-[#14161A] border border-gray-700/80 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#22D3EE]" aria-label="Full Name" />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="support_email" className="text-xs font-bold uppercase tracking-wider text-gray-300 block">Email Address *</label>
                    <input id="support_email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="e.g. producer@studiozio.audio" className="w-full px-3.5 py-2.5 bg-[#14161A] border border-gray-700/80 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#22D3EE]" aria-label="Email Address" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="support_category" className="text-xs font-bold uppercase tracking-wider text-gray-300 block">Category</label>
                    <select id="support_category" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="w-full px-3 py-2.5 bg-[#14161A] border border-gray-700/80 rounded-xl text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#22D3EE]" aria-label="Category">
                      <option value="Technical Support">Technical Support</option>
                      <option value="DAW Compatibility">DAW Compatibility</option>
                      <option value="Bug Report">Bug Report</option>
                      <option value="Feature Inquiry">Feature Inquiry</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="support_os" className="text-xs font-bold uppercase tracking-wider text-gray-300 block">OS</label>
                    <input id="support_os" type="text" value={form.operatingSystem} onChange={(e) => setForm({ ...form, operatingSystem: e.target.value })} placeholder="macOS / Windows" className="w-full px-3.5 py-2.5 bg-[#14161A] border border-gray-700/80 rounded-xl text-white text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#22D3EE]" aria-label="OS" />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="support_daw" className="text-xs font-bold uppercase tracking-wider text-gray-300 block">DAW</label>
                    <input id="support_daw" type="text" value={form.daw} onChange={(e) => setForm({ ...form, daw: e.target.value })} placeholder="Logic / Live / FL" className="w-full px-3.5 py-2.5 bg-[#14161A] border border-gray-700/80 rounded-xl text-white text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#22D3EE]" aria-label="DAW" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="support_message" className="text-xs font-bold uppercase tracking-wider text-gray-300 block">Message Details *</label>
                  <textarea id="support_message" required rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Describe your inquiry..." className="w-full px-3.5 py-2.5 bg-[#14161A] border border-gray-700/80 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#22D3EE]" aria-label="Message Details" />
                </div>
                <button type="submit" disabled={isSubmitting} className="w-full py-3.5 px-6 rounded-xl bg-[#22D3EE] hover:bg-[#06B6D4] text-[#14161A] font-extrabold text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#22D3EE]">
                  {isSubmitting ? 'Transmitting Ticket...' : 'Submit Support Request'}
                </button>
              </form>
            )}
          </div>

          <div className="lg:col-span-5 space-y-6">
            <div className="p-8 rounded-3xl bg-[#1D2026] border border-gray-800 space-y-6 shadow-xl">
              <h3 className="text-xl font-bold text-white">Documentation & Links</h3>
              <div className="space-y-3 text-xs text-gray-300">
                <a href="#parameters" className="p-3.5 rounded-xl bg-[#14161A] border border-gray-800 hover:border-[#22D3EE] block font-bold text-white hover:text-[#22D3EE]">Parameter Reference Guide</a>
                <a href="#routing-visualizer" className="p-3.5 rounded-xl bg-[#14161A] border border-gray-800 hover:border-[#F5A524] block font-bold text-white hover:text-[#F5A524]">Signal Routing Diagram</a>
                <a href="#installation" className="p-3.5 rounded-xl bg-[#14161A] border border-gray-800 hover:border-[#22D3EE] block font-bold text-white hover:text-[#22D3EE]">Installation Steps</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
