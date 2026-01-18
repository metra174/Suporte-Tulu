
import React, { useState, useEffect, useRef } from 'react';
import { Motive, FormData } from '../types.ts';
import { MOTIVES, PROVINCES, SUPPORT_WHATSAPP } from '../constants.ts';

type Message = {
  id: number;
  type: 'bot' | 'user';
  content: React.ReactNode;
};

const TypingIndicator: React.FC<{ theme: 'light' | 'dark' }> = ({ theme }) => (
  <div className={`flex items-center space-x-1 p-3 rounded-2xl ${theme === 'dark' ? 'bg-[#2d2d2d]' : 'bg-white'} w-16 shadow-sm border ${theme === 'dark' ? 'border-gray-800' : 'border-gray-100'}`}>
    <div className="w-1.5 h-1.5 bg-[#27AE60] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
    <div className="w-1.5 h-1.5 bg-[#27AE60] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
    <div className="w-1.5 h-1.5 bg-[#27AE60] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
  </div>
);

const ChatRobot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [messages, setMessages] = useState<Message[]>([]);
  const [step, setStep] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
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
      triggerBotResponse(
        <div className="space-y-3">
          <p className="font-extrabold text-lg">Olá! Sou o Tulu Bot v4.0. 🤖</p>
          <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>Identifiquei que você está com dificuldades na sua Landing Page. Qual é o tipo de erro que está a enfrentar?</p>
          <div className={`${theme === 'dark' ? 'bg-[#27AE60]/10 border-[#27AE60]/30' : 'bg-blue-50 border-blue-100'} border p-4 rounded-2xl`}>
             <p className={`text-[11px] font-black leading-tight uppercase tracking-widest ${theme === 'dark' ? 'text-[#27AE60]' : 'text-blue-700'}`}>
               🚀 INSTRUÇÃO DE SUPORTE:
             </p>
             <p className={`text-[11px] mt-1 leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-blue-600'}`}>
               Ao terminar, aperte em <strong>"FINALIZAR"</strong> para abrir o WhatsApp. Use <strong>↔️</strong> para expandir e <strong>{theme === 'dark' ? '☀️' : '🌙'}</strong> para mudar o modo.
             </p>
          </div>
        </div>
      );
      setStep(1);
    }
    scrollToBottom();
  }, [isOpen, messages, theme]);

  const triggerBotResponse = (content: React.ReactNode, delay: number = 1000) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, { id: Date.now(), type: 'bot', content }]);
    }, delay);
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
            <p><strong>Entendido!</strong> Links que não funcionam são críticos. 🕵️‍♂️</p>
            <p>O erro acontece em todos os botões ou apenas em um específico (como o botão do WhatsApp)?</p>
          </div>
        );
        break;
      case Motive.CONVERSION:
        followUpResponse = (
          <div className="space-y-2">
            <p><strong>Baixa conversão?</strong> Vamos analisar o Copywriting e o Design. 📉</p>
            <p>Você recebe visitas mas ninguém clica, ou a página não tem visitas nenhumas?</p>
          </div>
        );
        break;
      case Motive.DESIGN:
        followUpResponse = (
          <div className="space-y-2">
            <p><strong>O visual é a porta de entrada!</strong> 🎨</p>
            <p>O erro é texto encavalitado, imagens que não carregam ou as cores erradas?</p>
          </div>
        );
        break;
      case Motive.SPEED:
        followUpResponse = (
          <div className="space-y-2">
            <p><strong>Páginas lentas custam caro.</strong> ⏱️</p>
            <p>Isso acontece mais no telemóvel ou no computador?</p>
          </div>
        );
        break;
      case Motive.CONTENT:
        followUpResponse = (
          <div className="space-y-2">
            <p><strong>Conteúdo é confiança.</strong> 📝</p>
            <p>É um preço desatualizado, erro de ortografia ou endereço mudou?</p>
          </div>
        );
        break;
      default:
        followUpResponse = "Descreva detalhadamente o erro (ex: código 404, 500 ou texto sumindo).";
    }

    triggerBotResponse(followUpResponse);
    setStep(2);
  };

  const handleInfoSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const input = (e.target as any).info.value;
    if (!input) return;

    addUserMessage(input);
    
    if (step === 2) {
      setFormData(prev => ({ ...prev, followUpAnswer: input }));
      triggerBotResponse("Perfeito. Agora, qual o seu nome completo e o nome da sua empresa?");
      setStep(3);
    } else if (step === 3) {
      setFormData(prev => ({ ...prev, fullName: input, companyName: input })); 
      triggerBotResponse("Qual o seu melhor e-mail para enviarmos o protocolo?");
      setStep(4);
    } else if (step === 4) {
      setFormData(prev => ({ ...prev, email: input }));
      triggerBotResponse("Em qual Província de Angola a sua empresa está sediada?");
      setStep(5);
    } else if (step === 6) {
      setFormData(prev => ({ ...prev, address: input }));
      triggerBotResponse(
        <div className="space-y-3">
          <div className={`${theme === 'dark' ? 'bg-black/40 border-gray-800' : 'bg-[#2C3E50] border-[#2C3E50]'} p-4 text-white rounded-2xl shadow-inner border`}>
             <p className="font-black text-[10px] uppercase tracking-widest text-[#27AE60] mb-2">Relatório de Triagem</p>
             <div className="text-[11px] space-y-1 opacity-90">
                <p><strong>ASSUNTO:</strong> {formData.motive}</p>
                <p><strong>SITUAÇÃO:</strong> {formData.followUpAnswer}</p>
                <p><strong>LOCAL:</strong> {formData.province} - {input}</p>
             </div>
          </div>
          <p className="font-bold">Armazenei tudo! Deseja enviar estes dados agora para o suporte humano no WhatsApp?</p>
        </div>
      );
      setStep(7);
    }

    (e.target as any).info.value = "";
  };

  const handleProvinceSelect = (province: string) => {
    addUserMessage(province);
    setFormData(prev => ({ ...prev, province }));
    triggerBotResponse("Qual o endereço físico completo da sua empresa?");
    setStep(6);
  };

  const finishFlow = (toWhatsApp: boolean) => {
    addUserMessage(toWhatsApp ? "FINALIZAR E IR AO WHATSAPP 🏁" : "Apenas fechar.");
    
    if (toWhatsApp) {
      const message = `🚨 NOVO CHAMADO - TULU TECH\n\n` +
                      `* Erro: ${formData.motive}\n` +
                      `* Detalhe: ${formData.followUpAnswer}\n` +
                      `* Nome: ${formData.fullName}\n` +
                      `* Empresa: ${formData.companyName}\n` +
                      `* Província: ${formData.province}\n` +
                      `* Endereço: ${formData.address}\n` +
                      `* E-mail: ${formData.email}\n\n` +
                      `Desejo atendimento especializado.`;

      const encodedMessage = encodeURIComponent(message);
      window.open(`https://wa.me/${SUPPORT_WHATSAPP}?text=${encodedMessage}`, '_blank');
    }

    triggerBotResponse("Protocolo registrado. Nossos especialistas entrarão em contacto. Tulu Tech agradece! ✨");
    setStep(8);
  };

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <div className={`
          rounded-[2.5rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)] flex flex-col mb-6 overflow-hidden border transition-all duration-500
          ${theme === 'dark' ? 'bg-[#1a1a1a] border-gray-800 text-white' : 'bg-white border-gray-100 text-[#2C3E50]'}
          ${isExpanded ? 'w-[90vw] h-[85vh] md:w-[75vw]' : 'w-80 md:w-[450px] h-[650px]'}
        `}>
          {/* Header */}
          <div className={`p-6 flex items-center justify-between shadow-xl relative transition-colors ${theme === 'dark' ? 'bg-[#121212]' : 'bg-gradient-to-r from-[#2C3E50] to-[#1a252f] text-white'}`}>
            <div className="flex items-center space-x-4 relative z-10">
              <div className="w-14 h-14 bg-gradient-to-br from-[#27AE60] to-[#219150] rounded-2xl flex items-center justify-center border-2 border-white/10 shadow-lg group">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md">
                   <span className="font-black text-white text-xl">T</span>
                </div>
              </div>
              <div>
                <p className={`font-black text-lg tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-white'}`}>TULU BOT PRO</p>
                <div className="flex items-center space-x-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  <p className="text-[9px] text-green-400 font-black uppercase tracking-widest">Atendimento Ativo</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-1 relative z-10">
              <button onClick={toggleTheme} className="hover:bg-white/10 p-2.5 rounded-2xl transition-all">
                {theme === 'dark' ? '☀️' : '🌙'}
              </button>
              <button onClick={() => setIsExpanded(!isExpanded)} className="hover:bg-white/10 p-2.5 rounded-2xl transition-all">
                ↔️
              </button>
              <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-2.5 rounded-2xl transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className={`flex-1 overflow-y-auto p-6 md:p-8 space-y-6 transition-colors ${theme === 'dark' ? 'bg-[#1a1a1a]' : 'bg-[#F9FBFC]'}`}>
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn space-x-3`}>
                {msg.type === 'bot' && (
                  <div className="w-8 h-8 rounded-full bg-[#27AE60] flex-shrink-0 flex items-center justify-center text-[10px] font-black text-white shadow-md">
                    TB
                  </div>
                )}
                <div className={`max-w-[85%] p-5 rounded-3xl text-sm md:text-base shadow-sm leading-relaxed border transition-colors ${
                  msg.type === 'user' 
                    ? 'bg-[#27AE60] text-white rounded-tr-none border-[#27AE60]' 
                    : theme === 'dark' 
                      ? 'bg-[#2d2d2d] text-white rounded-tl-none border-gray-800' 
                      : 'bg-white text-gray-700 rounded-tl-none border-gray-100'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start space-x-3 animate-fadeIn">
                <div className="w-8 h-8 rounded-full bg-[#27AE60] flex-shrink-0 flex items-center justify-center text-[10px] font-black text-white shadow-md">
                  TB
                </div>
                <TypingIndicator theme={theme} />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Interaction Area */}
          <div className={`p-6 md:p-8 border-t transition-colors ${theme === 'dark' ? 'bg-[#121212] border-gray-800' : 'bg-white border-gray-100'}`}>
            {step === 1 && (
              <div className={`grid gap-3 ${isExpanded ? 'grid-cols-2 md:grid-cols-3' : 'grid-cols-1'}`}>
                {MOTIVES.map(m => (
                  <button 
                    key={m.id}
                    onClick={() => handleMotiveSelect(m.id, m.label)}
                    className={`
                      w-full text-left p-5 text-xs font-bold rounded-2xl transition-all border flex items-center group shadow-sm
                      ${theme === 'dark' ? 'bg-[#2d2d2d] border-gray-800 hover:bg-[#3d3d3d]' : 'bg-gray-50 border-gray-100 hover:bg-[#27AE60] hover:text-white'}
                    `}
                  >
                    <span className="mr-3 text-xl group-hover:scale-110 transition-transform">{m.label.split(' ')[0]}</span>
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
                    placeholder="Sua resposta..."
                    className={`
                      flex-1 p-5 text-sm rounded-3xl outline-none border-2 transition-all
                      ${theme === 'dark' ? 'bg-[#2d2d2d] border-gray-800 focus:border-[#27AE60] text-white' : 'bg-gray-50 border-gray-100 focus:border-[#27AE60] text-[#2C3E50]'}
                    `}
                  />
                  <button type="submit" className="bg-[#27AE60] text-white px-6 rounded-3xl hover:bg-[#219150] transition-all shadow-lg active:scale-95">
                    🚀
                  </button>
                </div>
                <p className="text-[10px] text-center text-gray-500 font-bold uppercase tracking-widest">Enter para enviar</p>
              </form>
            )}

            {step === 5 && (
              <div className={`grid gap-2 ${isExpanded ? 'grid-cols-3 md:grid-cols-6' : 'grid-cols-2'}`}>
                {PROVINCES.map(p => (
                  <button 
                    key={p} 
                    onClick={() => handleProvinceSelect(p)}
                    className={`
                      p-3 text-[9px] font-black rounded-xl transition-all border uppercase
                      ${theme === 'dark' ? 'bg-[#2d2d2d] border-gray-800 hover:bg-[#27AE60]' : 'bg-gray-50 border-gray-100 hover:bg-[#27AE60] hover:text-white'}
                    `}
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
                  className="w-full py-6 bg-gradient-to-r from-[#27AE60] to-[#219150] text-white rounded-3xl text-lg font-black shadow-[0_20px_50px_rgba(39,174,96,0.4)] hover:scale-[1.03] transition-all"
                >
                  FINALIZAR & FALAR NO WHATSAPP 🏁
                </button>
                <button 
                  onClick={() => finishFlow(false)}
                  className={`w-full py-4 rounded-2xl text-xs font-black transition-all uppercase tracking-widest ${theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'}`}
                >
                  Fechar apenas
                </button>
              </div>
            )}

            {step === 8 && (
              <button 
                onClick={() => { setMessages([]); setStep(0); setIsOpen(false); setIsExpanded(false); }}
                className={`w-full py-5 rounded-3xl text-sm font-black transition-all border-2 border-dashed ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}
              >
                SAIR DO SUPORTE
              </button>
            )}
          </div>
        </div>
      )}

      {/* Main Trigger */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-24 h-24 bg-gradient-to-br from-[#27AE60] to-[#219150] text-white rounded-[2.5rem] shadow-[0_25px_60px_rgba(39,174,96,0.4)] flex items-center justify-center hover:scale-110 transition-all duration-500 relative group border-8 border-white"
      >
        <div className={`absolute -top-16 right-0 text-[10px] font-black py-3 px-6 rounded-2xl shadow-2xl opacity-0 group-hover:opacity-100 transition-all transform translate-y-4 group-hover:translate-y-0 whitespace-nowrap pointer-events-none border flex items-center space-x-2 ${theme === 'dark' ? 'bg-[#2C3E50] border-gray-700' : 'bg-white border-gray-100 text-[#2C3E50]'}`}>
           <span className="w-2 h-2 bg-green-500 rounded-full animate-ping"></span>
           <span>Ajuda Tecnológica Tulu? 🤖</span>
        </div>
        
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
          </svg>
        ) : (
          <div className="relative transform group-hover:rotate-6 transition-all">
             <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <rect x="3" y="11" width="18" height="10" rx="3" />
                <circle cx="12" cy="5" r="2.5" />
                <path d="M12 7.5v3.5" />
                <line x1="8" y1="16" x2="8" y2="16.01" />
                <line x1="16" y1="16" x2="16" y2="16.01" />
             </svg>
            <span className="absolute -top-1 -right-1 flex h-7 w-7">
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
