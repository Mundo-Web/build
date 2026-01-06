import React, { useState } from 'react';

const FaqWebQuirurgica = ({ data, faqs }) => {
  const [openIndex, setOpenIndex] = useState(0);

  if (!faqs || faqs.length === 0) {
    return null;
  }

  return (
    <section id="faq" className="py-24 px-primary 2xl:px-0 bg-white">
      <div className="2xl:max-w-4xl mx-auto">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-5xl md:text-6xl font-extralight text-primary leading-tight">
            Preguntas <span className="font-light">Frecuentes</span>
          </h2>
          <div className=" mx-auto"></div>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={faq.id || index}
              className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-8 py-6 flex items-center justify-between text-left hover:bg-sections-color transition-colors"
              >
                <span className="text-lg font-light text-primary pr-8">
                  {faq.title || faq.question}
                </span>
                <div className="flex-shrink-0">
                  {openIndex === index ? (
                    <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  )}
                </div>
              </button>
              <div
                className={`transition-all duration-300 ease-in-out overflow-hidden ${openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}
              >
                <div className="px-8 pb-6 text-neutral-dark font-light leading-relaxed">
                  {faq.description || faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FaqWebQuirurgica;
