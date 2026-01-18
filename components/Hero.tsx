
import React from 'react';

const Hero: React.FC = () => {
  return (
    <section id="inicio" className="py-16 md:py-24 bg-gradient-to-b from-white to-[#F4F7F6]">
      <div className="container mx-auto px-4 text-center">
        <div className="inline-block px-4 py-1.5 mb-6 text-xs font-semibold tracking-widest text-[#27AE60] uppercase bg-green-50 rounded-full">
          CENTRAL DE AJUDA OFICIAL
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold text-[#2C3E50] mb-6 leading-tight">
          Como podemos ajudar <br /> você hoje?
        </h1>
        <p className="max-w-2xl mx-auto text-lg text-gray-600 mb-10 leading-relaxed">
          Preencha os dados abaixo e nossa equipe entrará em contato em instantes via WhatsApp ou E-mail. Sua tranquilidade é nossa prioridade.
        </p>
        <a 
          href="#protocolo" 
          className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-[#27AE60] rounded-xl hover:bg-[#219150] transition-all transform hover:scale-105 shadow-lg shadow-green-200"
        >
          Iniciar Protocolo de Atendimento
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </a>
      </div>
    </section>
  );
};

export default Hero;
