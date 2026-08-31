import { useState } from 'react';
import { FAQ_ITEMS } from '../data/websiteContent';

export const FAQ = () => {
  const [openId, setOpenId] = useState<string | null>('faq-1');

  return (
    <section id="faq" className="py-20 bg-[#14161A] border-b border-gray-800/60 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-[#22D3EE] block mb-2">
            Questions & Answers
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="max-w-4xl mx-auto space-y-4">
          {FAQ_ITEMS.map((item) => {
            const isOpen = openId === item.id;
            return (
              <div key={item.id} className="rounded-2xl bg-[#1D2026] border border-gray-800 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setOpenId(isOpen ? null : item.id)}
                  aria-expanded={isOpen}
                  {...(isOpen ? { 'aria-controls': `faq-answer-${item.id}` } : {})}
                  className="w-full px-6 py-5 text-left flex items-center justify-between text-white font-bold text-base"
                >
                  <span>{item.question}</span>
                  <span className="text-[#22D3EE] text-xl font-bold">{isOpen ? '-' : '+'}</span>
                </button>
                {isOpen && (
                  <div id={`faq-answer-${item.id}`} className="px-6 pb-6 text-sm text-gray-300 border-t border-gray-800/60 pt-4">
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
