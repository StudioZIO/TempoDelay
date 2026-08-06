import React, { useState } from 'react';
import { FAQ_ITEMS } from '../data/websiteContent';

export const FAQ: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>('faq-1');

  const toggleFAQ = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="faq" className="py-20 bg-[#14161A] border-b border-gray-800/60 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-[#22D3EE] block mb-2">
            Questions & Answers
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-gray-300 text-base leading-relaxed">
            Common questions regarding plugin features, audio DSP mechanics, installation, and host compatibility.
          </p>
        </div>

        {/* Accordion List */}
        <div className="max-w-4xl mx-auto space-y-4">
          {FAQ_ITEMS.map((item) => {
            const isOpen = openId === item.id;
            return (
              <div
                key={item.id}
                className="rounded-2xl bg-[#1D2026] border border-gray-800 overflow-hidden shadow-lg transition-colors"
              >
                <button
                  type="button"
                  onClick={() => toggleFAQ(item.id)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${item.id}`}
                  className="w-full px-6 py-5 text-left flex items-center justify-between space-x-4 focus:outline-none focus:ring-2 focus:ring-[#22D3EE]"
                >
                  <span className="text-base sm:text-lg font-bold text-white flex items-center space-x-3">
                    <span className="px-2.5 py-0.5 rounded text-[10px] uppercase font-mono font-bold bg-[#14161A] text-[#22D3EE] border border-gray-800">
                      {item.category}
                    </span>
                    <span>{item.question}</span>
                  </span>

                  <span className={`w-8 h-8 rounded-full bg-[#14161A] border border-gray-800 flex items-center justify-center text-[#22D3EE] shrink-0 transition-transform ${
                    isOpen ? 'rotate-180 bg-[#22D3EE] text-[#14161A]' : ''
                  }`}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </button>

                {isOpen && (
                  <div
                    id={`faq-answer-${item.id}`}
                    role="region"
                    aria-labelledby={`faq-question-${item.id}`}
                    className="px-6 pb-6 pt-2 text-sm text-gray-300 leading-relaxed border-t border-gray-800/60 bg-[#14161A]/40"
                  >
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
