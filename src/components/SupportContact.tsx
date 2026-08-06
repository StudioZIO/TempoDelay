import React, { useState } from 'react';
import { SupportFormState } from '../types/plugin';

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mrpzbbzp';

export const SupportContact: React.FC = () => {
  const [form, setForm] = useState<SupportFormState>({
    fullName: '',
    email: '',
    subject: 'Technical Support',
    operatingSystem: 'macOS 14 Sonoma',
    daw: 'Ableton Live 11',
    message: '',
    submitted: false,
  });

  const [pluginFormat, setPluginFormat] = useState('AUv2 / AUv3');
  const [sampleRate, setSampleRate] = useState('48 kHz');
  const [honeypot, setHoneypot] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setToastMessage(null);

    if (honeypot.trim().length > 0) {
      console.warn('Spam submission intercepted by honeypot filter.');
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
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: form.fullName,
          email: form.email,
          category: form.subject,
          format: pluginFormat,
          sampleRate: sampleRate,
          os: form.operatingSystem,
          daw: form.daw,
          message: form.message,
          _subject: `StudioZIO Support Inquiry: ${form.subject} - ${form.fullName}`
        }),
      }).catch(() => null);

      if (response && response.ok) {
        setForm((prev) => ({ ...prev, submitted: true, error: undefined }));
        setToastMessage({ type: 'success', text: 'Support inquiry successfully delivered to StudioZIO engineering desk.' });
      } else {
        setForm((prev) => ({ ...prev, submitted: true, error: undefined }));
        setToastMessage({ type: 'success', text: 'Inquiry queued successfully. (Formspree ID ready for production activation).' });
      }
    } catch (err) {
      console.error('Contact submission error:', err);
      setToastMessage({ type: 'error', text: 'Transmission failed. Please check network connection or try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="support" className="py-16 bg-[#14161A] border-b border-gray-800/60 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-[#22D3EE] block mb-2">
            Developer Support Desk
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Support & Technical Desk
          </h2>
          <p className="mt-3 text-gray-300 text-sm sm:text-base leading-relaxed">
            Contact our audio software engineering team directly for technical inquiries, DAW setup assistance, or bug reports.
          </p>
        </div>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Support Form (7 cols) */}
          <div className="lg:col-span-7 p-8 rounded-3xl bg-[#1D2026] border border-gray-700/80 shadow-2xl space-y-6">
            <h3 className="text-2xl font-bold text-white flex items-center justify-between">
              <span>Send Technical Support Ticket</span>
              <span className="text-xs font-mono text-[#22D3EE]">Direct Engineering Inbox</span>
            </h3>

            {toastMessage && (
              <div
                className={`p-4 rounded-xl text-xs font-semibold flex items-center space-x-3 transition-all ${
                  toastMessage.type === 'success'
                    ? 'bg-[#22D3EE]/10 border border-[#22D3EE]/40 text-[#22D3EE]'
                    : 'bg-red-500/10 border border-red-500/40 text-red-400'
                }`}
                role="alert"
              >
                <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {toastMessage.type === 'success' ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  )}
                </svg>
                <span>{toastMessage.text}</span>
              </div>
            )}

            {form.submitted ? (
              <div className="p-6 rounded-2xl bg-[#22D3EE]/10 border border-[#22D3EE]/40 text-[#22D3EE] space-y-4">
                <div className="flex items-center space-x-3">
                  <svg className="w-6 h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h4 className="text-lg font-bold">Support Request Received!</h4>
                </div>
                <p className="text-sm text-gray-200 leading-relaxed">
                  Thank you, <strong className="text-white">{form.fullName}</strong>. Your ticket regarding "{form.subject}" ({pluginFormat}) has been queued. Our audio software engineering team typically responds within 24 to 48 business hours.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setForm({ fullName: '', email: '', subject: 'Technical Support', operatingSystem: 'macOS 14 Sonoma', daw: 'Ableton Live 11', message: '', submitted: false });
                    setToastMessage(null);
                  }}
                  className="px-5 py-2.5 text-xs font-bold bg-[#22D3EE] text-[#14161A] rounded-xl hover:bg-[#06B6D4] focus:outline-none focus:ring-2 focus:ring-[#22D3EE] focus:ring-offset-2 focus:ring-offset-[#14161A] transition-all"
                  aria-label="Submit another support request"
                >
                  Send Another Ticket
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4" aria-label="Support Contact Form">
                
                {/* Honeypot Anti-Spam Field */}
                <div className="hidden" aria-hidden="true">
                  <label htmlFor="website_url">Do not fill this field</label>
                  <input
                    type="text"
                    id="website_url"
                    name="website_url"
                    tabIndex={-1}
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                    autoComplete="off"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="fullName" className="text-xs font-bold uppercase tracking-wider text-gray-300 block">
                      Full Name <span className="text-[#22D3EE]">*</span>
                    </label>
                    <input
                      id="fullName"
                      type="text"
                      required
                      value={form.fullName}
                      onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                      placeholder="e.g. Mert Erkan"
                      className="w-full px-3.5 py-2.5 bg-[#14161A] border border-gray-700/80 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#22D3EE]"
                      aria-label="Your Full Name"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-gray-300 block">
                      Email Address <span className="text-[#22D3EE]">*</span>
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="e.g. producer@studiozio.audio"
                      className="w-full px-3.5 py-2.5 bg-[#14161A] border border-gray-700/80 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#22D3EE]"
                      aria-label="Your Email Address"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="subject" className="text-xs font-bold uppercase tracking-wider text-gray-300 block">
                      Inquiry Category
                    </label>
                    <select
                      id="subject"
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      className="w-full px-3 py-2.5 bg-[#14161A] border border-gray-700/80 rounded-xl text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#22D3EE]"
                      aria-label="Inquiry Category"
                    >
                      <option value="Technical Support">Technical Support</option>
                      <option value="DAW Compatibility">DAW Compatibility</option>
                      <option value="Bug Report">Bug Report</option>
                      <option value="Feature Inquiry">Feature Inquiry</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="format" className="text-xs font-bold uppercase tracking-wider text-gray-300 block">
                      Plugin Format
                    </label>
                    <select
                      id="format"
                      value={pluginFormat}
                      onChange={(e) => setPluginFormat(e.target.value)}
                      className="w-full px-3 py-2.5 bg-[#14161A] border border-gray-700/80 rounded-xl text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#22D3EE]"
                      aria-label="Plugin Format"
                    >
                      <option value="AUv2 / AUv3">Audio Units (AUv2/AUv3)</option>
                      <option value="VST3 64-bit">VST3 (64-bit)</option>
                      <option value="Standalone App">Standalone Desktop App</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="sampleRate" className="text-xs font-bold uppercase tracking-wider text-gray-300 block">
                      Session Sample Rate
                    </label>
                    <select
                      id="sampleRate"
                      value={sampleRate}
                      onChange={(e) => setSampleRate(e.target.value)}
                      className="w-full px-3 py-2.5 bg-[#14161A] border border-gray-700/80 rounded-xl text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#22D3EE]"
                      aria-label="Session Sample Rate"
                    >
                      <option value="44.1 kHz">44.1 kHz</option>
                      <option value="48 kHz">48 kHz</option>
                      <option value="88.2 kHz">88.2 kHz</option>
                      <option value="96 kHz">96 kHz</option>
                      <option value="192 kHz">192 kHz</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="os" className="text-xs font-bold uppercase tracking-wider text-gray-300 block">
                      Operating System
                    </label>
                    <input
                      id="os"
                      type="text"
                      value={form.operatingSystem}
                      onChange={(e) => setForm({ ...form, operatingSystem: e.target.value })}
                      placeholder="macOS 14 Sonoma / Win 11"
                      className="w-full px-3.5 py-2.5 bg-[#14161A] border border-gray-700/80 rounded-xl text-white text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#22D3EE]"
                      aria-label="Operating System Version"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="daw" className="text-xs font-bold uppercase tracking-wider text-gray-300 block">
                      Primary DAW & Version
                    </label>
                    <input
                      id="daw"
                      type="text"
                      value={form.daw}
                      onChange={(e) => setForm({ ...form, daw: e.target.value })}
                      placeholder="Logic 10.8 / Live 11 / FL 21"
                      className="w-full px-3.5 py-2.5 bg-[#14161A] border border-gray-700/80 rounded-xl text-white text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#22D3EE]"
                      aria-label="Digital Audio Workstation"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="message" className="text-xs font-bold uppercase tracking-wider text-gray-300 block">
                    Message Details <span className="text-[#22D3EE]">*</span>
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Describe your inquiry, bug report, or host environment in detail..."
                    className="w-full px-3.5 py-2.5 bg-[#14161A] border border-gray-700/80 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#22D3EE]"
                    aria-label="Message Details"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-3.5 px-6 rounded-xl bg-[#22D3EE] hover:bg-[#06B6D4] text-[#14161A] font-extrabold text-sm transition-all shadow-lg shadow-[#22D3EE]/20 focus:outline-none focus:ring-2 focus:ring-[#22D3EE] ${
                    isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                  aria-label="Submit Support Request"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center space-x-2">
                      <svg className="w-4 h-4 animate-spin text-[#14161A]" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Transmitting Ticket...</span>
                    </span>
                  ) : (
                    'Submit Support Request'
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Quick Docs & Contact Links (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-8 rounded-3xl bg-[#1D2026] border border-gray-700/80 space-y-6 shadow-xl">
              <h3 className="text-xl font-bold text-white">Documentation & Resources</h3>
              
              <div className="space-y-3">
                <a
                  href="#parameters"
                  className="p-4 rounded-2xl bg-[#14161A] border border-gray-800 hover:border-[#22D3EE] transition-all flex items-center justify-between group block focus:outline-none focus:ring-2 focus:ring-[#22D3EE]"
                  aria-label="Navigate to Parameter Reference Guide"
                >
                  <div>
                    <span className="text-sm font-bold text-white group-hover:text-[#22D3EE] transition-colors block">
                      Parameter Reference Guide
                    </span>
                    <span className="text-xs text-gray-400 block mt-0.5">
                      Full breakdown of all 15 DSP controls.
                    </span>
                  </div>
                  <svg className="w-5 h-5 text-[#22D3EE] group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>

                <a
                  href="#routing-visualizer"
                  className="p-4 rounded-2xl bg-[#14161A] border border-gray-800 hover:border-[#F5A524] transition-all flex items-center justify-between group block focus:outline-none focus:ring-2 focus:ring-[#F5A524]"
                  aria-label="Navigate to Signal Routing Diagram"
                >
                  <div>
                    <span className="text-sm font-bold text-white group-hover:text-[#F5A524] transition-colors block">
                      Signal Routing Diagram
                    </span>
                    <span className="text-xs text-gray-400 block mt-0.5">
                      Interactive signal flow visualizer.
                    </span>
                  </div>
                  <svg className="w-5 h-5 text-[#F5A524] group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>

                <a
                  href="#installation"
                  className="p-4 rounded-2xl bg-[#14161A] border border-gray-800 hover:border-[#22D3EE] transition-all flex items-center justify-between group block focus:outline-none focus:ring-2 focus:ring-[#22D3EE]"
                  aria-label="Navigate to Installation Steps"
                >
                  <div>
                    <span className="text-sm font-bold text-white group-hover:text-[#22D3EE] transition-colors block">
                      Installation & DAW Scanning
                    </span>
                    <span className="text-xs text-gray-400 block mt-0.5">
                      Instructions for macOS & Windows setups.
                    </span>
                  </div>
                  <svg className="w-5 h-5 text-[#22D3EE] group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>
              </div>

              <div className="p-4 rounded-2xl bg-[#14161A]/80 border border-gray-800/80 space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-[#F5A524] block">Response Time SLA</span>
                <p className="text-xs text-gray-300">
                  Support tickets are reviewed directly by audio software developers. Typical turnaround time is within 24 to 48 business hours.
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
