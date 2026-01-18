
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-[#2C3E50] rounded-md flex items-center justify-center text-white font-bold">T</div>
          <span className="text-2xl font-bold text-[#2C3E50] tracking-tight">Tulu<span className="text-[#27AE60]">Suporte</span></span>
        </div>
        <nav className="hidden md:flex space-x-6 text-sm font-medium">
          <a href="#inicio" className="hover:text-[#27AE60] transition-colors">Início</a>
          <a href="#protocolo" className="hover:text-[#27AE60] transition-colors">Novo Chamado</a>
          <a href="#faq" className="hover:text-[#27AE60] transition-colors">Dúvidas</a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
