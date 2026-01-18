
import React, { useState, useEffect, useRef } from 'react';
import { Motive, FormData } from '../types';
import { MOTIVES, PROVINCES, SUPPORT_WHATSAPP } from '../constants';

type Message = {
  id: number;
  type: 'bot' | 'user';
  content: React.ReactNode;
};

const ChatRobot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<Partial<FormData>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      addBotMessage("Olá! Você está na Central de Suporte TULU. Para agilizar o seu atendimento, por favor, escolha o motivo do contato.");
      setStep(1);
    }
    scrollToBottom();
  }, [isOpen, messages]);

  const addBotMessage = (content: React.ReactNode) => {
    setMessages(prev => [...prev, { id: Date.now(), type: 'bot', content }]);
  };

  const addUserMessage = (content: React.ReactNode) => {
    setMessages(prev => [...prev, { id: Date.now() + 1, type: 'user', content }]);
  };

  const handleMotiveSelect = (motive: Motive, label: string) => {
    addUserMessage(label);
    setFormData(prev => ({ ...prev, motive }));
    
    setTimeout(() => {
      addBotMessage("Perfeito. Qual é o seu nome completo e o nome da sua empresa?");
      setStep(2);
    }, 500);
  };

  const handleInfoSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const input = (e.target as any).info.value;
    if (!input) return;

    addUserMessage(input);
    if (step === 2) {
      const parts = input.split(' ');
      setFormData(prev => ({ ...prev, fullName: input, companyName: parts[parts.length - 1] })); 
      setTimeout(() => {
        addBotMessage("Pode nos confirmar o seu melhor e-mail?");
        setStep(3);
      }, 500);
    } else if (step === 3) {
      setFormData(prev => ({ ...prev, email: input }));
      setTimeout(() => {
        addBotMessage("Em qual província você se encontra?");
        setStep(4);
      }, 500);
    } else if (step === 5) {
      setFormData(prev => ({ ...prev, address: input }));
      setTimeout(() => {
        addBotMessage("Descreva brevemente o que aconteceu ou qual é a sua dúvida.");
        setStep(6);
      }, 500);
    } else if (step === 6) {
      setFormData(prev => ({ ...prev, description: input }));
      setTimeout(() => {
        addBotMessage("Já registrei todos os seus dados e o motivo da sua reclamação. Você deseja que eu envie agora essas informações para um atendente humano (Suporte em Vida Real) para um atendimento personalizado via WhatsApp?");
        setStep(7);
      }, 500);
    }

    (e.target as any).info.value = "";
  };

  const handleProvinceSelect = (province: string) => {
    addUserMessage(province);
    setFormData(prev => ({ ...prev, province }));
    setTimeout(() => {
      addBotMessage("Qual o seu endereço completo para registo no protocolo?");
      setStep(5);
    }, 500);
  };

  const finishFlow = (toWhatsApp: boolean) => {
    addUserMessage(toWhatsApp ? "SIM, falar com suporte agora." : "Não, apenas registrar e-mail.");
    
    if (toWhatsApp) {
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
    }

    setTimeout(() => {
      addBotMessage("Tudo pronto! Protocolo registrado com sucesso. Nossa equipe entrará em contato em breve.");
      setStep(8);
    }, 800);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="w-80 md:w-96 h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col mb-4 overflow-hidden border border-gray-100 animate-slideUp">
          {/* Header */}
          <div className="bg-[#2C3E50] p-4 flex items-center justify-between text-white shadow-lg">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center font-bold text-[#2C3E50] shadow-sm overflow-hidden">
                <span className="text-xl">T</span>
              </div>
              <div>
                <p className="font-bold text-sm leading-tight">Robô Tulu</p>
                <div className="flex items-center space-x-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  <span className="text-[10px] text-gray-300">Central de Ajuda</span>
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-1 rounded transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l18 12" />
              </svg>
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#F8FAFB]">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-4 rounded-2xl text-sm shadow-sm leading-relaxed ${
                  msg.type === 'user' 
                    ? 'bg-[#27AE60] text-white rounded-tr-none' 
                    : 'bg-white text-gray-700 rounded-tl-none border border-gray-100'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Interaction Area */}
          <div className="p-4 border-t border-gray-100 bg-white">
            {step === 1 && (
              <div className="grid grid-cols-2 gap-2">
                {MOTIVES.map(m => (
                  <button 
                    key={m.id}
                    onClick={() => handleMotiveSelect(m.id, m.label)}
                    className="w-full text-center p-3 text-xs font-bold bg-gray-50 hover:bg-[#27AE60] hover:text-white rounded-xl transition-all border border-gray-100 shadow-sm"
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            )}

            {(step === 2 || step === 3 || step === 5 || step === 6) && (
              <form onSubmit={handleInfoSubmit} className="flex space-x-2">
                <input 
                  autoFocus
                  name="info"
                  autoComplete="off"
                  placeholder="Responda aqui..."
                  className="flex-1 p-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#27AE60] outline-none transition-all"
                />
                <button type="submit" className="bg-[#2C3E50] text-white p-3 rounded-xl hover:bg-black transition-transform active:scale-95 shadow-md">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                  </svg>
                </button>
              </form>
            )}

            {step === 4 && (
              <div className="grid grid-cols-2 gap-2">
                {PROVINCES.slice(0, 8).map(p => (
                  <button 
                    key={p} 
                    onClick={() => handleProvinceSelect(p)}
                    className="p-2 text-[10px] font-bold bg-gray-50 border border-gray-100 rounded-lg hover:bg-[#27AE60] hover:text-white transition-all shadow-sm"
                  >
                    {p}
                  </button>
                ))}
                <select 
                  onChange={(e) => handleProvinceSelect(e.target.value)}
                  className="col-span-2 p-3 text-xs font-bold bg-gray-50 border border-gray-100 rounded-lg outline-none focus:ring-2 focus:ring-[#27AE60]"
                >
                  <option value="">Outras Províncias...</option>
                  {PROVINCES.slice(8).map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
            )}

            {step === 7 && (
              <div className="flex flex-col space-y-2">
                <button 
                  onClick={() => finishFlow(true)}
                  className="w-full py-4 bg-[#27AE60] text-white rounded-xl text-sm font-bold shadow-lg shadow-green-100 hover:bg-[#219150] transition-all"
                >
                  SIM, falar com suporte agora.
                </button>
                <button 
                  onClick={() => finishFlow(false)}
                  className="w-full py-3 bg-[#2C3E50] text-white rounded-xl text-xs font-bold shadow-md hover:bg-black transition-all"
                >
                  Não, apenas registrar e-mail.
                </button>
              </div>
            )}

            {step === 8 && (
              <button 
                onClick={() => { setMessages([]); setStep(0); setIsOpen(false); }}
                className="w-full py-3 bg-gray-100 text-[#2C3E50] rounded-xl text-sm font-bold hover:bg-gray-200 transition-all"
              >
                Fechar Atendimento
              </button>
            )}
          </div>
        </div>
      )}

      {/* Trigger Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-[#27AE60] text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform relative group border-4 border-white"
      >
        <div className="absolute -top-12 right-0 bg-white text-[#2C3E50] text-[10px] font-bold py-1.5 px-3 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-gray-100">
           Precisa de ajuda? 👋
        </div>
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        ) : (
          <div className="relative">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 border-2 border-white"></span>
            </span>
          </div>
        )}
      </button>
    </div>
  );
};

export default ChatRobot;
