
import React from 'react';

const Hero: React.FC = () => {
  const openRobot = () => {
    const event = new CustomEvent('open-tulu-robot');
    window.dispatchEvent(event);
  };

  return (
    <section id="inicio" className="relative pt-20 pb-16 md:pt-32 md:pb-24 overflow-hidden">
      {/* Background Technology Scenes */}
      <div className="absolute inset-0 tech-grid pointer-events-none"></div>
      <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 bg-[#27AE60] opacity-[0.03] blur-[100px] rounded-full"></div>
      <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-96 h-96 bg-[#2C3E50] opacity-[0.03] blur-[100px] rounded-full"></div>
      
      {/* Tech Floating Icons */}
      <div className="absolute top-1/4 left-10 opacity-10 animate-pulse-slow hidden lg:block">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#27AE60" strokeWidth="1.5">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
      </div>
      <div className="absolute top-1/3 right-12 opacity-10 animate-bounce hidden lg:block" style={{ animationDuration: '3s' }}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2C3E50" strokeWidth="1.5">
          <path d="M4 7V4h16v3M4 17v3h16v-3M9 12l2 2 4-4" />
        </svg>
      </div>

      <div className="container mx-auto px-4 relative z-10 text-center">
        <div className="inline-flex items-center px-4 py-1.5 mb-8 text-xs font-bold tracking-widest text-[#27AE60] uppercase bg-green-50 rounded-full border border-green-100 shadow-sm animate-fadeIn">
          <span className="flex h-2 w-2 mr-2 rounded-full bg-[#27AE60]"></span>
          CENTRAL DE AJUDA INTELIGENTE
        </div>
        
        <h1 className="text-5xl md:text-7xl font-black text-[#2C3E50] mb-8 leading-tight animate-fadeIn" style={{ animationDelay: '0.1s' }}>
          Como podemos ajudar <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2C3E50] to-[#27AE60]">você hoje?</span>
        </h1>
        
        <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-500 mb-12 leading-relaxed animate-fadeIn" style={{ animationDelay: '0.2s' }}>
          Tecnologia a serviço da sua tranquilidade. Escolha um dos canais abaixo e resolva seu chamado em tempo recorde.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-5 animate-fadeIn" style={{ animationDelay: '0.3s' }}>
          <button 
            onClick={openRobot}
            className="w-full sm:w-auto inline-flex items-center justify-center px-10 py-5 text-lg font-black text-white bg-[#27AE60] rounded-2xl hover:bg-[#219150] transition-all transform hover:scale-105 shadow-[0_20px_50px_rgba(39,174,96,0.2)] border-b-4 border-[#1e8449] active:border-b-0 active:translate-y-1"
          >
            Falar com Robô 🤖
          </button>
          
          <a 
            href="#protocolo" 
            className="w-full sm:w-auto inline-flex items-center justify-center px-10 py-5 text-lg font-bold text-[#2C3E50] bg-white rounded-2xl hover:bg-gray-50 transition-all transform hover:scale-105 shadow-xl border border-gray-100"
          >
            Protocolo Manual
          </a>
        </div>
        
        {/* Status indicator */}
        <div className="mt-16 flex items-center justify-center space-x-8 opacity-40 grayscale">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className="text-[10px] font-bold uppercase tracking-tighter">Sistemas Online</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className="text-[10px] font-bold uppercase tracking-tighter">Triagem Ativa</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
