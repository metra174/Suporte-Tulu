
import React from 'react';

const SocialProof: React.FC = () => {
  return (
    <section className="py-16 bg-[#F4F7F6]">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="p-8">
            <div className="text-4xl font-extrabold text-[#2C3E50] mb-2">98%</div>
            <p className="text-gray-500 font-medium">Chamados resolvidos em menos de 24 horas.</p>
          </div>
          <div className="p-8 border-y md:border-y-0 md:border-x border-gray-200">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#27AE60]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
            </div>
            <h4 className="text-lg font-bold text-[#2C3E50] mb-1">Atendimento Seguro</h4>
            <p className="text-sm text-gray-500">Seus dados são protegidos por criptografia de ponta a ponta.</p>
          </div>
          <div className="p-8">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#2C3E50]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
            <h4 className="text-lg font-bold text-[#2C3E50] mb-1">Suporte Oficial</h4>
            <p className="text-sm text-gray-500">Canal direto com a equipe técnica da Tulu.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocialProof;
