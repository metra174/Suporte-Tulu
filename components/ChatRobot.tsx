
import React, { useState, useEffect, useRef } from 'react';
import { Motive, FormData } from '../types.ts';
import { MOTIVES, PROVINCES, SUPPORT_WHATSAPP } from '../constants.ts';

type Message = {
  id: number;
  type: 'bot' | 'user';
  content: React.ReactNode;
};

const ChatRobot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<Partial<FormData>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('open-tulu-robot', handleOpen);
    return () => window.removeEventListener('open-tulu-robot', handleOpen);
  }, []);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      addBotMessage(
        <div className="space-y-3">
          <p className="font-extrabold text-[#2C3E50] text-lg">Olá! Sou o Tulu Bot. 🤖</p>
          <p className="text-gray-600">Identifiquei que você está com dificuldades na sua Landing Page. Qual é o tipo de erro que está a enfrentar?</p>
          <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl">
             <p className="text-[11px] text-blue-700 font-black leading-tight uppercase tracking-widest">
               🚀 DICA DE SUPORTE:
             </p>
             <p className="text-[11px] text-blue-600 mt-1 leading-relaxed">
               Ao terminar, aperte em <strong>"FINALIZAR"</strong> para ser redirecionado ao WhatsApp e garantir um atendimento de qualidade. Use o ícone ↔️ acima para aumentar a tela.
             </p>
          </div>
        </div>
      );
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
    
    let followUpResponse = null;
    switch(motive) {
      case Motive.TECH_ERROR:
        followUpResponse = (
          <div className="space-y-2">
            <p><strong>Entendido!</strong> Links que não funcionam impedem o seu cliente de comprar. Vou investigar. 🕵️‍♂️</p>
            <p>Por favor, me diga: o erro acontece em todos os botões ou apenas em um específico (como o botão do WhatsApp)?</p>
          </div>
        );
        break;
      case Motive.CONVERSION:
        followUpResponse = (
          <div className="space-y-2">
            <p><strong>A sua página está no ar, mas não está a trazer resultados?</strong> Isso pode ser Copywriting ou design. 📉</p>
            <p>Para te ajudar, preciso saber: você está a receber visitas, mas ninguém entra em contacto, ou a página não está a ter visitas nenhumas?</p>
          </div>
        );
        break;
      case Motive.DESIGN:
        followUpResponse = (
          <div className="space-y-2">
            <p><strong>A imagem da sua marca é tudo!</strong> Se a página parece 'partida', precisamos de ajustar. 🎨</p>
            <p>O problema que você vê é um texto encavalitado, imagens que não carregam ou as cores que estão erradas?</p>
          </div>
        );
        break;
      case Motive.SPEED:
        followUpResponse = (
          <div className="space-y-2">
            <p><strong>Páginas lentas fazem o cliente desistir em segundos.</strong> Vamos medir a velocidade da sua Landing Page. ⏱️</p>
            <p>Isso acontece mais quando tenta abrir pelo telemóvel (celular) ou no computador?</p>
          </div>
        );
        break;
      case Motive.CONTENT:
        followUpResponse = (
          <div className="space-y-2">
            <p><strong>Informação errada afasta clientes.</strong> O que precisamos de corrigir? 📝</p>
            <p>É um preço desatualizado, um erro de ortografia ou a sua morada/endereço mudou?</p>
          </div>
        );
        break;
      default:
        followUpResponse = "Descreva detalhadamente o que está a acontecer. Se houver um código de erro (como 404 ou 500), por favor escreva-o aqui.";
    }

    setTimeout(() => {
      addBotMessage(followUpResponse);
      setStep(2); // followUpAnswer
    }, 500);
  };

  const handleInfoSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const input = (e.target as any).info.value;
    if (!input) return;

    addUserMessage(input);
    
    if (step === 2) {
      setFormData(prev => ({ ...prev, followUpAnswer: input }));
      setTimeout(() => {
        addBotMessage("Perfeito, guardei esse detalhe na minha memória. Agora, para o registro oficial: qual o seu nome completo e o nome da sua empresa?");
        setStep(3);
      }, 500);
    } else if (step === 3) {
      setFormData(prev => ({ ...prev, fullName: input, companyName: input })); 
      setTimeout(() => {
        addBotMessage("Confirmaremos o envio do protocolo para o seu e-mail e para tulu.geral@gmail.com. Qual o seu melhor E-mail para contato?");
        setStep(4);
      }, 500);
    } else if (step === 4) {
      setFormData(prev => ({ ...prev, email: input }));
      setTimeout(() => {
        addBotMessage("Em qual Província de Angola a sua empresa está sediada?");
        setStep(5);
      }, 500);
    } else if (step === 6) {
      setFormData(prev => ({ ...prev, address: input }));
      setTimeout(() => {
        addBotMessage(
          <div className="space-y-3">
            <div className="p-4 bg-[#2C3E50] text-white rounded-2xl shadow-inner">
               <p className="font-black text-xs uppercase tracking-widest text-[#27AE60] mb-2">Resumo do Chamado</p>
               <div className="text-[11px] space-y-1 opacity-90">
                  <p><strong>ERRO:</strong> {formData.motive}</p>
                  <p><strong>DETALHE:</strong> {formData.followUpAnswer}</p>
                  <p><strong>LOCAL:</strong> {formData.province} - {input}</p>
               </div>
            </div>
            <p className="font-bold text-[#2C3E50]">Tudo pronto! Armazenei sua reclamação. Deseja que eu envie estes dados agora para o suporte humano no WhatsApp?</p>
          </div>
        );
        setStep(7);
      }, 500);
    }

    (e.target as any).info.value = "";
  };

  const handleProvinceSelect = (province: string) => {
    addUserMessage(province);
    setFormData(prev => ({ ...prev, province }));
    setTimeout(() => {
      addBotMessage("Onde a sua empresa está localizada fisicamente? (Endereço completo)");
      setStep(6);
    }, 500);
  };

  const finishFlow = (toWhatsApp: boolean) => {
    addUserMessage(toWhatsApp ? "FINALIZAR ATENDIMENTO AGORA 🏁" : "Fechar somente.");
    
    if (toWhatsApp) {
      const message = `🚨 NOVO CHAMADO DE SUPORTE - TULU\n\n` +
                      `* Problema: ${formData.motive}\n` +
                      `* Detalhe: ${formData.followUpAnswer}\n` +
                      `* Cliente: ${formData.fullName}\n` +
                      `* Empresa: ${formData.companyName}\n` +
                      `* Província: ${formData.province}\n` +
                      `* Endereço: ${formData.address}\n` +
                      `* E-mail: ${formData.email}\n\n` +
                      `Olá Suporte TULU, desejo atendimento humano de qualidade.`;

      const encodedMessage = encodeURIComponent(message);
      window.open(`https://wa.me/${SUPPORT_WHATSAPP}?text=${encodedMessage}`, '_blank');
    }

    setTimeout(() => {
      addBotMessage("O protocolo foi enviado para nossa central. Nossos especialistas entrarão em contacto. Tulu Tech agradece! ✨");
      setStep(8);
    }, 800);
  };

  return (
    <div className={`fixed bottom-6 right-6 z-50 flex flex-col items-end transition-all duration-500`}>
      {isOpen && (
        <div className={`bg-white rounded-[2.5rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.4)] flex flex-col mb-6 overflow-hidden border border-gray-100 animate-slideUp transition-all duration-500 ${isExpanded ? 'w-[90vw] h-[85vh] md:w-[80vw]' : 'w-80 md:w-[450px] h-[650px]'}`}>
          {/* Advanced Robot Header */}
          <div className="bg-gradient-to-br from-[#2C3E50] via-[#1a252f] to-[#27AE60] p-6 flex items-center justify-between text-white shadow-xl relative">
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-[80px] -mr-16 -mt-16"></div>
            <div className="flex items-center space-x-4 relative z-10">
              <div className="w-16 h-16 bg-white/10 backdrop-blur-xl rounded-3xl flex items-center justify-center border border-white/20 shadow-2xl overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-tr from-[#27AE60]/20 to-transparent"></div>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#27AE60" strokeWidth="2.5" className="group-hover:scale-110 transition-transform">
                  <path d="M12 8V4H8" /><rect x="5" y="8" width="14" height="12" rx="2" /><path d="M9 12h.01M15 12h.01" />
                </svg>
              </div>
              <div>
                <p className="font-black text-xl tracking-tighter">TULU BOT PRO 3.5</p>
                <div className="flex items-center space-x-2 mt-0.5">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  <p className="text-[9px] text-green-400 font-black uppercase tracking-[0.25em]">Online & Triando</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-1 relative z-10">
              <button 
                onClick={() => setIsExpanded(!isExpanded)} 
                title={isExpanded ? "Reduzir Tela" : "Expandir Tela"}
                className="hover:bg-white/10 p-2.5 rounded-2xl transition-all"
              >
                {isExpanded ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                  </svg>
                )}
              </button>
              <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-2.5 rounded-2xl transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 bg-[#F9FBFC]">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}>
                <div className={`max-w-[90%] md:max-w-[75%] p-6 rounded-[2rem] text-sm md:text-base shadow-sm leading-relaxed border ${
                  msg.type === 'user' 
                    ? 'bg-gradient-to-br from-[#27AE60] to-[#219150] text-white rounded-tr-none border-[#27AE60] shadow-green-100 shadow-xl' 
                    : 'bg-white text-gray-700 rounded-tl-none border-gray-100'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Interaction Area */}
          <div className="p-6 md:p-8 border-t border-gray-100 bg-white shadow-[0_-10px_30px_rgba(0,0,0,0.02)]">
            {step === 1 && (
              <div className={`grid gap-3 ${isExpanded ? 'grid-cols-2 md:grid-cols-3' : 'grid-cols-1'}`}>
                {MOTIVES.map(m => (
                  <button 
                    key={m.id}
                    onClick={() => handleMotiveSelect(m.id, m.label)}
                    className="w-full text-left p-5 text-xs md:text-sm font-bold bg-gray-50 hover:bg-[#27AE60] hover:text-white rounded-3xl transition-all border border-gray-100 flex items-center group shadow-sm hover:shadow-green-100"
                  >
                    <span className="mr-4 text-2xl transform group-hover:scale-125 transition-transform">{m.label.split(' ')[0]}</span>
                    <span>{m.label.split(' ').slice(1).join(' ')}</span>
                  </button>
                ))}
              </div>
            )}

            {(step === 2 || step === 3 || step === 4 || step === 6) && (
              <form onSubmit={handleInfoSubmit} className="flex flex-col space-y-4">
                <div className="flex space-x-3">
                  <input 
                    autoFocus
                    name="info"
                    autoComplete="off"
                    placeholder="Digite sua resposta aqui e pressione Enter..."
                    className="flex-1 p-5 text-sm md:text-base border-2 border-gray-100 rounded-3xl focus:border-[#27AE60] focus:ring-0 outline-none transition-all placeholder:text-gray-300 bg-gray-50/50"
                  />
                  <button type="submit" className="bg-[#2C3E50] text-white px-6 rounded-3xl hover:bg-black transition-all active:scale-95 shadow-xl shadow-gray-200 group">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                    </svg>
                  </button>
                </div>
                <div className="flex justify-center items-center space-x-4">
                   <div className="h-px bg-gray-100 flex-1"></div>
                   <p className="text-[9px] text-gray-400 font-black uppercase tracking-[0.2em]">Triagem em Tempo Real</p>
                   <div className="h-px bg-gray-100 flex-1"></div>
                </div>
              </form>
            )}

            {step === 5 && (
              <div className={`grid gap-2 ${isExpanded ? 'grid-cols-4 md:grid-cols-6' : 'grid-cols-2'}`}>
                {PROVINCES.map(p => (
                  <button 
                    key={p} 
                    onClick={() => handleProvinceSelect(p)}
                    className="p-3 text-[9px] font-black bg-gray-50 border border-gray-100 rounded-xl hover:bg-[#27AE60] hover:text-white transition-all shadow-sm uppercase"
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}

            {step === 7 && (
              <div className={`flex flex-col space-y-4 ${isExpanded ? 'max-w-md mx-auto' : ''}`}>
                <button 
                  onClick={() => finishFlow(true)}
                  className="w-full py-6 bg-gradient-to-r from-[#27AE60] to-[#219150] text-white rounded-[2rem] text-lg font-black shadow-[0_20px_60px_rgba(39,174,96,0.3)] hover:scale-[1.03] transition-all border-b-8 border-[#1e8449] active:border-b-0 active:translate-y-2"
                >
                  FINALIZAR & FALAR NO WHATSAPP 🏁
                </button>
                <button 
                  onClick={() => finishFlow(false)}
                  className="w-full py-4 bg-gray-100 text-[#2C3E50] rounded-[1.5rem] text-xs font-black hover:bg-gray-200 transition-all uppercase tracking-widest"
                >
                  Fechar apenas o Chat
                </button>
              </div>
            )}

            {step === 8 && (
              <button 
                onClick={() => { setMessages([]); setStep(0); setIsOpen(false); setIsExpanded(false); }}
                className="w-full py-5 bg-gray-100 text-[#2C3E50] rounded-3xl text-sm font-black hover:bg-gray-200 transition-all border-2 border-dashed border-gray-200"
              >
                ENCERRAR SESSÃO DE SUPORTE
              </button>
            )}
          </div>
        </div>
      )}

      {/* Primary Robotic Trigger */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-24 h-24 bg-gradient-to-br from-[#27AE60] to-[#219150] text-white rounded-[2.5rem] shadow-[0_25px_60px_rgba(39,174,96,0.4)] flex items-center justify-center hover:scale-110 transition-all duration-500 relative group border-8 border-white"
      >
        <div className="absolute -top-16 right-0 bg-[#2C3E50] text-white text-[10px] font-black py-3 px-6 rounded-2xl shadow-2xl opacity-0 group-hover:opacity-100 transition-all transform translate-y-4 group-hover:translate-y-0 whitespace-nowrap pointer-events-none border border-white/10 flex items-center space-x-2">
           <span className="w-2 h-2 bg-green-500 rounded-full animate-ping"></span>
           <span>Relatar Erro Grave na Landing Page? 🤖</span>
        </div>
        
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
          </svg>
        ) : (
          <div className="relative transform group-hover:rotate-12 group-hover:scale-110 transition-all duration-300">
             <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <rect x="3" y="11" width="18" height="10" rx="3" />
                <circle cx="12" cy="5" r="2.5" />
                <path d="M12 7.5v3.5" />
                <line x1="8" y1="16" x2="8" y2="16.01" />
                <line x1="16" y1="16" x2="16" y2="16.01" />
             </svg>
            <span className="absolute -top-2 -right-2 flex h-7 w-7">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-7 w-7 bg-red-600 border-4 border-white shadow-lg"></span>
            </span>
          </div>
        )}
      </button>
    </div>
  );
};

export default ChatRobot;
