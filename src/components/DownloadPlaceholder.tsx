import React, { useState } from 'react';

const NOTIFY_ENDPOINT = 'https://formspree.io/f/mrpzbbzp';

export const DownloadPlaceholder: React.FC = () => {
  const [copiedMac, setCopiedMac] = useState(false);
  const [notifyModalOpen, setNotifyModalOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [newsletterOptIn, setNewsletterOptIn] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notifySuccess, setNotifySuccess] = useState(false);

  const macHash = '8f3a2e91b4c7d0e5f2a184c90123ef456789a0b1c2d3e4f5a6b7c8d9e0f1a2b3';

  const copyToClipboard = (text: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
    }
    setCopiedMac(true);
    setTimeout(() => setCopiedMac(false), 2000);
  };

  const handleNotifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;

    setIsSubmitting(true);

    try {
      // Send pre-launch subscriber lead to endpoint (ConvertKit / Brevo / Formspree)
      await fetch(NOTIFY_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          email: email,
          newsletter_opt_in: newsletterOptIn,
          product: 'StudioZIO Tempo Delay Release 4.0.1 Launch Notification',
          _subject: `New Launch Notify Lead: StudioZIO Tempo Delay - ${email}`
        })
      }).catch(() => null);

      setNotifySuccess(true);
      setIsSubmitting(false);
    } catch (err) {
      console.error('Launch notification error:', err);
      setIsSubmitting(false);
    }
  };

  return (
    <section id="downloads" className="py-16 bg-[#14161A] border-b border-gray-800/60 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-[#22D3EE] block mb-2">
            Pre-Release Launch Status
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Release 4.0.1 — Coming Soon
          </h2>
          <p className="mt-3 text-gray-300 text-sm sm:text-base leading-relaxed">
            StudioZIO Tempo Delay Release 4.0.1 is currently undergoing final production testing on macOS Apple Silicon (arm64). Sign up below to be notified instantly at launch.
          </p>
        </div>

        {/* Download Card Container */}
        <div className="max-w-3xl mx-auto">
          
          {/* macOS Pre-Release Card */}
          <div className="p-8 rounded-3xl bg-[#1D2026] border border-gray-700/80 hover:border-[#22D3EE]/50 transition-all shadow-2xl flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-[#22D3EE]/10 text-[#22D3EE] border border-[#22D3EE]/30">
                  macOS Apple Silicon (arm64)
                </span>
                <span className="text-xs font-mono text-gray-400">Release 4.0.1 (Schema 8) • ~24.5 MB</span>
              </div>

              <h3 className="text-2xl font-black text-white flex items-center space-x-3">
                <span>StudioZIO Tempo Delay for macOS</span>
              </h3>

              <p className="text-sm text-gray-300 leading-relaxed">
                Includes native binaries for Apple Silicon (arm64) in Audio Unit (AUv2), VST3, and Standalone App formats.
              </p>

              <div className="p-4 rounded-xl bg-[#14161A] border border-gray-800 space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block">Installer Details</span>
                <div className="space-y-1 text-xs text-gray-300 font-mono">
                  <div className="flex justify-between">
                    <span className="text-gray-500">File Name:</span>
                    <span className="text-white">StudioZIO_Tempo_Delay_v4.0.1_macOS.dmg</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Target Build:</span>
                    <span className="text-[#22D3EE]">Release 4.0.1 (Schema 8)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Availability:</span>
                    <span className="text-[#F5A524]">Coming Soon</span>
                  </div>
                </div>
              </div>

              {/* Terminal Style SHA256 Checksum Panel */}
              <div className="p-3.5 rounded-xl bg-[#14161A] border border-gray-800/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-gray-400 flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#22D3EE]"></span>
                    <span>SHA-256 Checksum (Release 4.0.1 Placeholder)</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(macHash)}
                    className="px-2.5 py-1 rounded-md bg-[#22D3EE]/10 hover:bg-[#22D3EE]/20 border border-[#22D3EE]/30 text-[#22D3EE] font-mono text-[10px] font-bold uppercase tracking-wider transition-all focus:outline-none focus:ring-2 focus:ring-[#22D3EE]"
                    aria-label="Copy macOS SHA-256 Checksum"
                  >
                    {copiedMac ? 'Copied!' : 'Copy Hash'}
                  </button>
                </div>
                <div className="p-2 rounded-lg bg-[#0E1013] text-[11px] font-mono text-[#22D3EE] break-all select-all border border-gray-900">
                  {macHash}
                </div>
              </div>
            </div>

            {/* Launch Status & Notify Me Trigger Button */}
            <div className="space-y-3 pt-4 border-t border-gray-800">
              <div className="p-3 rounded-xl bg-[#14161A] border border-gray-800 text-center">
                <span className="text-xs font-mono font-bold text-[#F5A524] uppercase tracking-wider block">
                  Release 4.0.1 — Coming Soon
                </span>
              </div>

              <div className="space-y-3">
                <a
                  href="/StudioZIOTempoDelay-v4.0.1-RC1-macOS-arm64.pkg"
                  download
                  className="w-full py-4 px-6 rounded-xl bg-[#22D3EE] hover:bg-[#06B6D4] text-[#14161A] font-extrabold text-sm transition-all shadow-xl shadow-[#22D3EE]/25 flex items-center justify-center space-x-2 text-center block"
                  aria-label="Download for MacOS"
                >
                  <svg className="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <span>Download for MacOS</span>
                </a>
                <p className="text-xs text-amber-400/90 bg-amber-500/10 p-3 rounded-xl border border-amber-500/20 text-center leading-relaxed">
                  This is a pre-release version intended for evaluation and testing. While fully code-signed and notarized by Apple, minor issues may still exist.
                </p>
              </div>
              <span className="text-[11px] text-gray-400 text-center block">Requires macOS 11 or later • Apple Silicon (arm64)</span>
            </div>
          </div>

        </div>

      </div>

      {/* Launch Notification Modal */}
      {notifyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md transition-all">
          <div className="max-w-md w-full p-8 rounded-3xl bg-[#1D2026] border border-[#22D3EE]/40 shadow-2xl space-y-6 relative">
            
            {/* Close Button */}
            <button
              type="button"
              onClick={() => { setNotifyModalOpen(false); setNotifySuccess(false); }}
              className="absolute top-4 right-4 text-gray-400 hover:text-white p-1 rounded-lg bg-[#14161A]"
              aria-label="Close modal"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Modal Title & Header */}
            <div className="space-y-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#22D3EE] block">
                Pre-Launch Registration
              </span>
              <h3 className="text-2xl font-black text-white">
                Notify Me When It Launches
              </h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                Enter your email address to be notified the moment StudioZIO Tempo Delay Release 4.0.1 goes live.
              </p>
            </div>

            {notifySuccess ? (
              <div className="p-6 rounded-2xl bg-[#22D3EE]/10 border border-[#22D3EE]/40 text-[#22D3EE] space-y-3">
                <div className="flex items-center space-x-2">
                  <svg className="w-6 h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <h4 className="text-lg font-bold">You're On The VIP Launch List!</h4>
                </div>
                <p className="text-xs text-gray-200 leading-relaxed">
                  Thank you! We will e-mail you the moment Release 4.0.1 officially launches.
                </p>
                <button
                  type="button"
                  onClick={() => { setNotifyModalOpen(false); setNotifySuccess(false); }}
                  className="w-full py-2.5 px-4 bg-[#22D3EE] text-[#14161A] font-bold text-xs rounded-xl hover:bg-[#06B6D4]"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleNotifySubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label htmlFor="notify_email" className="text-xs font-bold uppercase tracking-wider text-gray-300 block">
                    Email Address <span className="text-[#22D3EE]">*</span>
                  </label>
                  <input
                    id="notify_email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="producer@studiozio.audio"
                    className="w-full px-4 py-3 bg-[#14161A] border border-gray-700/80 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#22D3EE]"
                    aria-label="Email Address for Launch Notification"
                  />
                </div>

                {/* Newsletter Opt-In Checkbox */}
                <div className="flex items-start space-x-3 pt-1">
                  <input
                    id="newsletter_opt_in"
                    type="checkbox"
                    checked={newsletterOptIn}
                    onChange={(e) => setNewsletterOptIn(e.target.checked)}
                    className="w-4 h-4 mt-0.5 rounded bg-[#14161A] border-gray-700 text-[#22D3EE] focus:ring-[#22D3EE] cursor-pointer"
                  />
                  <label htmlFor="newsletter_opt_in" className="text-xs text-gray-300 leading-tight cursor-pointer select-none">
                    I want to receive emails about new StudioZIO plugin releases, updates, and producer news.
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-3.5 px-6 rounded-xl bg-[#22D3EE] hover:bg-[#06B6D4] text-[#14161A] font-extrabold text-sm transition-all shadow-lg shadow-[#22D3EE]/30 focus:outline-none focus:ring-2 focus:ring-[#22D3EE] ${
                    isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                  aria-label="Submit Email for Launch Notification"
                >
                  {isSubmitting ? 'Subscribing...' : 'Notify Me When It Launches'}
                </button>
              </form>
            )}

          </div>
        </div>
      )}

    </section>
  );
};
