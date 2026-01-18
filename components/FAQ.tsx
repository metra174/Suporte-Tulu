
import React, { useState } from 'react';
import { FAQS } from '../constants';

const FAQItem: React.FC<{ item: typeof FAQS[0] }> = ({ item }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-100 last:border-0">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 flex justify-between items-center text-left focus:outline-none group"
      >
        <span className="text-lg font-bold text-[#2C3E50] group-hover:text-[#27AE60] transition-colors">{item.question}</span>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className={`h-5 w-5 text-gray-400 transform transition-transform ${isOpen ? 'rotate-180 text-[#27AE60]' : ''}`} 
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-40 pb-6' : 'max-h-0'}`}>
        <p className="text-gray-600 leading-relaxed">
          {item.answer}
        </p>
      </div>
    </div>
  );
};

const FAQ: React.FC = () => {
  return (
    <section id="faq" className="py-20 bg-white">
      <div className="container mx-auto px-4 max-w-3xl">
        <h2 className="text-3xl font-bold text-[#2C3E50] mb-12 text-center">Dúvidas Frequentes</h2>
        <div className="space-y-2">
          {FAQS.map((item, idx) => (
            <FAQItem key={idx} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
