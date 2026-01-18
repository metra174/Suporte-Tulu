
import React, { useState } from 'react';
import { Motive, FormData } from '../types';
import { MOTIVES, PROVINCES, SUPPORT_WHATSAPP } from '../constants';

const INITIAL_DATA: FormData = {
  motive: '',
  fullName: '',
  companyName: '',
  email: '',
  phone: '',
  province: '',
  address: '',
  description: '',
};

const MultiStepForm: React.FC = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(INITIAL_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleMotiveSelect = (motive: Motive) => {
    setFormData(prev => ({ ...prev, motive }));
    setStep(2);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      
      const message = `🚨 NOVO CHAMADO DE SUPORTE - TULU\n\n` +
                      `* Cliente: ${formData.fullName}\n` +
                      `* Empresa: ${formData.companyName}\n` +
                      `* Província: ${formData.province}\n` +
                      `* Endereço: ${formData.address}\n` +
                      `* E-mail: ${formData.email}\n` +
                      `* Motivo: ${formData.motive}\n` +
                      `* Descrição: ${formData.description}\n\n` +
                      `Aguardando atendimento humano.`;

      const encodedMessage = encodeURIComponent(message);
      window.open(`https://wa.me/${SUPPORT_WHATSAPP}?text=${encodedMessage}`, '_blank');
    }, 1500);
  };

  const renderStep1 = () => (
    <div className="space-y-6 animate-fadeIn">
      <h3 className="text-xl font-bold text-center text-[#2C3E50] mb-8">Selecione o motivo do seu contato:</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {MOTIVES.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => handleMotiveSelect(item.id)}
            className={`flex items-center p-5 rounded-xl border-2 transition-all text-left ${
              formData.motive === item.id 
                ? 'border-[#27AE60] bg-green-50 shadow-md' 
                : 'border-gray-100 hover:border-gray-300 hover:bg-white'
            }`}
          >
            <span className="text-3xl mr-4">{item.icon}</span>
            <span className="font-semibold text-gray-700">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4 animate-fadeIn">
       <div className="flex justify-between items-center mb-4">
          <button onClick={() => setStep(1)} className="text-sm text-gray-500 hover:text-[#2C3E50]">← Voltar</button>
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Identificação</span>
       </div>
       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-600">Nome Completo</label>
            <input 
              required
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#27AE60] outline-none transition-all" 
              placeholder="Ex: João Silva"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-600">Nome da Empresa</label>
            <input 
              required
              name="companyName"
              value={formData.companyName}
              onChange={handleInputChange}
              className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#27AE60] outline-none transition-all" 
              placeholder="Ex: Tulu Tech"
            />
          </div>
          <div className="space-y-1 col-span-full">
            <label className="text-sm font-semibold text-gray-600">E-mail de Contato</label>
            <input 
              required
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#27AE60] outline-none transition-all" 
              placeholder="seu@email.com"
            />
          </div>
       </div>
       <button 
        type="button"
        onClick={() => setStep(3)}
        disabled={!formData.fullName || !formData.companyName || !formData.email}
        className="w-full py-4 mt-4 text-white bg-[#2C3E50] rounded-xl font-bold hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed transition-all"
       >
        Próximo Passo
       </button>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-4 animate-fadeIn">
       <div className="flex justify-between items-center mb-4">
          <button onClick={() => setStep(2)} className="text-sm text-gray-500 hover:text-[#2C3E50]">← Voltar</button>
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Localização e Detalhes</span>
       </div>
       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-600">Província</label>
            <select 
              required
              name="province"
              value={formData.province}
              onChange={handleInputChange}
              className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#27AE60] outline-none transition-all bg-white"
            >
              <option value="">Selecione...</option>
              {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-600">Endereço Completo</label>
            <input 
              required
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#27AE60] outline-none transition-all" 
              placeholder="Rua, Número, Bairro"
            />
          </div>
       </div>
       <div className="space-y-1">
          <label className="text-sm font-semibold text-gray-600">Descrição do Problema</label>
          <textarea 
            required
            name="description"
            rows={4}
            value={formData.description}
            onChange={handleInputChange}
            className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#27AE60] outline-none transition-all resize-none" 
            placeholder="Descreva detalhadamente o ocorrido..."
          />
       </div>
       <div className="pt-2 text-center">
         <button 
          type="submit"
          disabled={isSubmitting || !formData.province || !formData.address || !formData.description}
          className="w-full py-4 text-white bg-[#27AE60] rounded-xl font-bold hover:bg-[#219150] disabled:opacity-50 transition-all flex justify-center items-center shadow-lg shadow-green-100"
         >
          {isSubmitting ? (
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : "ENVIAR E FALAR COM ATENDENTE AGORA"}
         </button>
         <p className="mt-3 text-[10px] text-gray-400 uppercase font-bold">Ao clicar, você será redirecionado para o suporte humano.</p>
       </div>
    </div>
  );

  const renderSuccess = () => (
    <div className="text-center py-10 animate-fadeIn">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-[#27AE60]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h3 className="text-2xl font-bold text-[#2C3E50] mb-2">Triagem Concluída!</h3>
      <p className="text-gray-600 mb-8">Seu protocolo foi gerado e enviado para <strong>{formData.email}</strong>. Continue a conversa no WhatsApp para atendimento prioritário.</p>
      <button 
        onClick={() => { setIsSuccess(false); setStep(1); setFormData(INITIAL_DATA); }}
        className="text-[#27AE60] font-bold hover:underline"
      >
        Novo Atendimento
      </button>
    </div>
  );

  return (
    <section id="protocolo" className="py-20 px-4">
      <div className="container mx-auto max-w-3xl">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
          <div className="p-8 md:p-12">
            {!isSuccess ? (
              <form onSubmit={handleSubmit}>
                <div className="mb-8 flex items-center justify-between">
                  <div className="flex space-x-2">
                    {[1, 2, 3].map((s) => (
                      <div 
                        key={s} 
                        className={`h-1.5 w-8 rounded-full transition-all duration-300 ${s === step ? 'bg-[#27AE60] w-12' : s < step ? 'bg-[#2C3E50]' : 'bg-gray-100'}`} 
                      />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-gray-400">PASSO {step} DE 3</span>
                </div>
                
                {step === 1 && renderStep1()}
                {step === 2 && renderStep2()}
                {step === 3 && renderStep3()}
              </form>
            ) : renderSuccess()}
          </div>
          
          <div className="bg-gray-50 p-6 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 text-center md:text-left">
            <div className="flex items-center space-x-2 justify-center md:justify-start">
               <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
               <span className="text-xs font-medium text-gray-500 uppercase tracking-widest">Protocolo Seguro Tulu</span>
            </div>
            <div className="text-[10px] font-bold text-gray-400">tulu.geral@gmail.com | +244 955 409 474</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MultiStepForm;
