
import React, { useState, useEffect, useRef } from 'react';
import { Motive, FormData } from '../types.ts';
import { MOTIVES, PROVINCES, SUPPORT_WHATSAPP } from '../constants.ts';

type Message = {
  id: number;
  type: 'bot' | 'user';
  content: React.ReactNode;
};

const TypingIndicator: React.FC<{ theme: 'light' | 'dark' }> = ({ theme }) => (
  <div className={`flex items-center space-x-1.5 p-4 rounded-2xl ${theme === 'dark' ? 'bg-[#2d2d2d]' : 'bg-white'} w-20 shadow-sm border ${theme === 'dark' ? 'border-gray-800' : 'border-gray-100'}`}>
    <div className="w-2 h-2 bg-[#27AE60] rounded-full animate-bounce [animation-duration:0.6s]" style={{ animationDelay: '0ms' }}></div>
    <div className="w-2 h-2 bg-[#27AE60] rounded-full animate-bounce [animation-duration:0.6s]" style={{ animationDelay: '150ms' }}></div>
    <div className="w-2 h-2 bg-[#27AE60] rounded-full animate-bounce [animation-duration:0.6s]" style={{ animationDelay: '300ms' }}></div>
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
      startConversation();
    }
    scrollToBottom();
  }, [isOpen, messages, theme]);

  const triggerBotResponse = (content: React.ReactNode, delay: number = 1000) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, { id: Date.now() + Math.random(), type: 'bot', content }]);
    }, delay);
  };

  const addUserMessage = (content: React.ReactNode) => {
    setMessages(prev => [...prev, { id: Date.now() + Math.random(), type: 'user', content }]);
  };

  const startConversation = () => {
    triggerBotResponse(
      <div className="space-y-2">
        <p className="font-black text-xl">Olá! Eu sou o assistente da Tulu. 🤖</p>
        <p>Antes de falarmos de trabalho, como está a ser o seu dia?</p>
      </div>
    );
    setStep(1); // Esperando resposta sobre o dia
  };

  const checkSentiment = (text: string) => {
    const negatives = ['mal', 'ruim', 'não', 'triste', 'pessimo', 'difícil', 'complicado', 'frustrado'];
    return negatives.some(word => text.toLowerCase().includes(word));
  };

  const handleMotiveSelect = (motive: Motive, label: string) => {
    addUserMessage(label);
    setFormData(prev => ({ ...prev, motive }));
    
    let followUp = "";
    switch(motive) {
      case Motive.TECH_ERROR:
        followUp = "Links quebrados são prioridade máxima! 🚨 O erro está no botão do WhatsApp ou em outro link da página?";
        break;
      case Motive.CONVERSION:
        followUp = "Vamos otimizar sua taxa de conversão! 📈 Você está recebendo muitos cliques mas nenhuma venda, ou as visitas sumiram?";
        break;
      case Motive.DESIGN:
        followUp = "Design é autoridade! 🎨 O que está desconfigurado? Imagens, textos ou cores no telemóvel?";
        break;
      case Motive.SPEED:
        followUp = "Velocidade é vendas! ⏱️ A página demora quanto tempo para carregar? Já testou em outra rede?";
      case Motive.OTHERS:
        followUp = "Anotei que é um erro novo na minha memória. Descreva detalhadamente o que está a acontecer.";
        break;
      default:
        followUp = "Descreva detalhadamente o erro técnico ou a dúvida que você possui no momento.";
    }

    triggerBotResponse(followUp);
    setStep(5); // Esperando followUpAnswer
  };

  const handleInfoSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const input = (e.target as any).info.value;
    if (!input) return;

    addUserMessage(input);
    const hasNegativeVibe = checkSentiment(input);

    if (step === 1) {
      triggerBotResponse(
        <div className="space-y-2">
          {hasNegativeVibe && <p className="text-[#27AE60] font-bold italic">Sinto muito por ouvir isso. Vou guardar essa informação na minha memória de prioridade para que o nosso suporte humano te dê um carinho especial. ❤️</p>}
          <p>Espero que tudo corra bem com a sua família e que os negócios prosperem! Como vai o ânimo hoje?</p>
        </div>
      );
      setStep(2);
    } else if (step === 2) {
      const currentTime = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
      triggerBotResponse(
        <div className="space-y-2">
          <p>Por aqui, são agora <strong>{currentTime}</strong> e eu sinto-me 100% carregado para te ajudar. ✨</p>
          <p>Você gosta dos serviços que a Tulu tem oferecido até agora?</p>
        </div>
      );
      setStep(3);
    } else if (step === 3) {
      triggerBotResponse(
        <div className="space-y-3">
          <p>Agora, para que eu possa resolver o seu problema com a Landing Page, diga-me qual destes erros está a acontecer:</p>
        </div>
      );
      setStep(4); // Mostrar Botões
    } else if (step === 5) {
      setFormData(prev => ({ ...prev, followUpAnswer: input }));
      triggerBotResponse("Com quem tenho o prazer de falar e qual o nome da sua empresa? (Ex: João - Padaria Central)");
      setStep(6);
    } else if (step === 6) {
      const [name, company] = input.split(' - ');
      setFormData(prev => ({ ...prev, fullName: name || input, companyName: company || 'Empresa Própria' }));
      triggerBotResponse("Pode confirmar o seu melhor E-mail? Vou enviar uma cópia do protocolo para si e para tulu.geral@gmail.com.");
      setStep(7);
    } else if (step === 7) {
      setFormData(prev => ({ ...prev, email: input }));
      triggerBotResponse("Em qual das 18 províncias de Angola você está?");
      setStep(8); // Menu Províncias
    } else if (step === 9) {
      setFormData(prev => ({ ...prev, address: input }));
      triggerBotResponse(
        <div className="space-y-4">
          <div className={`${theme === 'dark' ? 'bg-black/50 border-white/5' : 'bg-[#2C3E50] border-gray-100'} p-5 text-white rounded-[2rem] shadow-2xl border`}>
             <p className="font-black text-[10px] uppercase tracking-[0.3em] text-[#27AE60] mb-3">Protocolo Inteligente Tulu</p>
             <div className="text-xs space-y-2 opacity-90">
                <div className="flex justify-between border-b border-white/10 pb-1"><span>STATUS:</span> <span className="font-bold text-green-400">AGUARDANDO WHATSAPP</span></div>
                <div className="flex justify-between"><span>ASSUNTO:</span> <span className="font-bold uppercase">{formData.motive}</span></div>
                <div className="flex justify-between"><span>PROVÍNCIA:</span> <span className="font-bold">{formData.province}</span></div>
             </div>
          </div>
          <p className="font-bold text-lg">Deseja que eu envie todo este nosso histórico para o atendente humano no WhatsApp agora mesmo?</p>
        </div>
      );
      setStep(10);
    }

    (e.target as any).info.value = "";
  };

  const handleProvinceSelect = (province: string) => {
    addUserMessage(province);
    setFormData(prev => ({ ...prev, province }));
    triggerBotResponse("Qual o seu endereço físico completo?");
    setStep(9);
  };

  const finishFlow = (toWhatsApp: boolean) => {
    addUserMessage(toWhatsApp ? "ENVIAR AO WHATSAPP AGORA 🏁" : "Fechar chat.");
    
    if (toWhatsApp) {
      const message = `🚨 CHAMADO TULU TECH - CONVERSA HISTÓRICA\n\n` +
                      `* Erro: ${formData.motive}\n` +
                      `* Contexto: ${formData.followUpAnswer}\n` +
                      `* Cliente: ${formData.fullName}\n` +
                      `* Empresa: ${formData.companyName}\n` +
                      `* Província: ${formData.province}\n` +
                      `* Endereço: ${formData.address}\n\n` +
                      `Desejo atendimento especializado baseado no histórico do Bot.`;

      const encodedMessage = encodeURIComponent(message);
      window.open(`https://wa.me/${SUPPORT_WHATSAPP}?text=${encodedMessage}`, '_blank');
    }

    triggerBotResponse("Protocolo finalizado. Tulu Tech agradece pela confiança! 🚀");
    setStep(11);
  };

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  const containerClasses = isExpanded 
    ? "fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-center justify-center p-2 md:p-6"
    : "fixed bottom-4 right-4 md:bottom-6 md:right-6 z-[100] flex flex-col items-end";

  const chatBoxClasses = `
    transition-all duration-500 ease-in-out flex flex-col overflow-hidden border shadow-2xl
    ${theme === 'dark' ? 'bg-[#141414] border-gray-800 text-white' : 'bg-white border-gray-100 text-[#2C3E50]'}
    ${isExpanded 
        ? 'w-full h-full md:max-w-[1200px] md:max-h-[90vh] md:rounded-[3rem]' 
        : 'w-[calc(100vw-2rem)] md:w-[450px] h-[75vh] md:h-[650px] rounded-[2.5rem]'}
  `;

  return (
    <div className={containerClasses}>
      {isOpen && (
        <div className={chatBoxClasses}>
          {/* Header */}
          <div className={`p-4 md:p-8 flex items-center justify-between shadow-2xl relative transition-colors z-20 ${theme === 'dark' ? 'bg-[#0a0a0a]' : 'bg-gradient-to-r from-[#2C3E50] to-[#1a252f] text-white'}`}>
            <div className="flex items-center space-x-3 md:space-x-5 relative z-10">
              <div className="relative">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-[#27AE60] to-[#219150] rounded-xl md:rounded-2xl flex items-center justify-center border-2 border-white/20 shadow-2xl overflow-hidden">
                   <span className="font-black text-white text-lg md:text-2xl tracking-tighter">TULU</span>
                </div>
                <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500"></span>
                </span>
              </div>
              <div>
                <p className="font-black text-sm md:text-xl tracking-tighter uppercase">Assistente Tulu</p>
                <p className="text-[8px] md:text-[10px] text-green-400 font-black uppercase tracking-[0.2em]">Conexão Proativa</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-1 md:space-x-2 relative z-10">
              <button onClick={toggleTheme} className="hover:bg-white/10 p-2 md:p-3 rounded-xl transition-all" title="Tema">
                {theme === 'dark' ? '☀️' : '🌙'}
              </button>
              <button onClick={() => setIsExpanded(!isExpanded)} className="hover:bg-white/10 p-2 md:p-3 rounded-xl transition-all" title="Full Screen">
                {isExpanded ? '↙️' : '↔️'}
              </button>
              <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-2 md:p-3 rounded-xl transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-8 md:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className={`flex-1 overflow-y-auto p-4 md:p-10 space-y-6 md:space-y-8 transition-colors ${theme === 'dark' ? 'bg-[#0f0f0f]' : 'bg-[#F8FAFB]'}`}>
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn space-x-2 md:space-x-4 items-end`}>
                {msg.type === 'bot' && (
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-[#27AE60] flex-shrink-0 flex items-center justify-center text-[8px] md:text-[10px] font-black text-white shadow-xl mb-1">
                    BOT
                  </div>
                )}
                <div className={`max-w-[85%] md:max-w-[70%] p-4 md:p-8 rounded-[1.5rem] md:rounded-[2rem] text-sm md:text-lg shadow-sm leading-relaxed border transition-all ${
                  msg.type === 'user' 
                    ? 'bg-gradient-to-br from-[#27AE60] to-[#219150] text-white rounded-tr-none border-[#27AE60]' 
                    : theme === 'dark' 
                      ? 'bg-[#1e1e1e] text-white rounded-tl-none border-gray-800' 
                      : 'bg-white text-gray-700 rounded-tl-none border-gray-100'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start space-x-2 md:space-x-4 animate-fadeIn items-end">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-[#27AE60] flex-shrink-0 flex items-center justify-center text-[8px] md:text-[10px] font-black text-white shadow-xl mb-1">
                  BOT
                </div>
                <TypingIndicator theme={theme} />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Interaction Area */}
          <div className={`p-4 md:p-12 border-t transition-colors z-20 ${theme === 'dark' ? 'bg-[#0a0a0a] border-gray-800' : 'bg-white border-gray-100'}`}>
            {step === 4 && (
              <div className={`grid gap-3 ${isExpanded ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-4' : 'grid-cols-1'}`}>
                {MOTIVES.map(m => (
                  <button 
                    key={m.id}
                    onClick={() => handleMotiveSelect(m.id, m.label)}
                    className={`
                      w-full text-left p-4 md:p-6 text-xs md:text-sm font-bold rounded-2xl md:rounded-[1.5rem] transition-all border flex items-center group shadow-md
                      ${theme === 'dark' ? 'bg-[#1e1e1e] border-gray-800 hover:bg-[#27AE60] hover:border-[#27AE60]' : 'bg-gray-50 border-gray-100 hover:bg-[#27AE60] hover:text-white'}
                    `}
                  >
                    <span className="mr-3 md:mr-4 text-xl md:text-3xl group-hover:scale-125 transition-transform">{m.label.split(' ')[0]}</span>
                    <span className="flex-1">{m.label.split(' ').slice(1).join(' ')}</span>
                  </button>
                ))}
              </div>
            )}

            {(step === 1 || step === 2 || step === 3 || step === 5 || step === 6 || step === 7 || step === 9) && (
              <form onSubmit={handleInfoSubmit} className="flex flex-col space-y-4 max-w-4xl mx-auto">
                <div className="flex space-x-2 md:space-x-4">
                  <input 
                    autoFocus
                    name="info"
                    autoComplete="off"
                    placeholder="Escreva sua resposta..."
                    className={`
                      flex-1 p-4 md:p-8 text-sm md:text-xl rounded-[1.5rem] md:rounded-[2rem] outline-none border-2 transition-all shadow-inner
                      ${theme === 'dark' ? 'bg-[#1e1e1e] border-gray-800 focus:border-[#27AE60] text-white' : 'bg-gray-50 border-gray-100 focus:border-[#27AE60] text-[#2C3E50]'}
                    `}
                  />
                  <button type="submit" className="bg-[#27AE60] text-white px-5 md:px-12 rounded-[1.5rem] md:rounded-[2rem] hover:bg-[#219150] transition-all shadow-xl active:scale-95 text-lg font-bold">
                    ENVIAR
                  </button>
                </div>
                <p className="text-[10px] text-center text-gray-500 font-black uppercase tracking-[0.2em]">Pressione ENTER para falar com o robô</p>
              </form>
            )}

            {step === 8 && (
              <div className={`grid gap-2 ${isExpanded ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-6' : 'grid-cols-2'}`}>
                {PROVINCES.map(p => (
                  <button 
                    key={p} 
                    onClick={() => handleProvinceSelect(p)}
                    className={`
                      p-3 md:p-4 text-[8px] md:text-xs font-black rounded-xl md:rounded-2xl transition-all border uppercase tracking-wider
                      ${theme === 'dark' ? 'bg-[#1e1e1e] border-gray-800 hover:bg-[#27AE60]' : 'bg-gray-50 border-gray-100 hover:bg-[#27AE60] hover:text-white'}
                    `}
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}

            {step === 10 && (
              <div className={`flex flex-col space-y-4 md:space-y-5 ${isExpanded ? 'max-w-2xl mx-auto' : ''}`}>
                <button 
                  onClick={() => finishFlow(true)}
                  className="w-full py-5 md:py-10 bg-gradient-to-r from-[#27AE60] to-[#219150] text-white rounded-[1.5rem] md:rounded-[2.5rem] text-lg md:text-2xl font-black shadow-[0_20px_60px_rgba(39,174,96,0.4)] hover:scale-[1.02] transition-all border-b-4 md:border-b-8 border-[#1a7440] active:border-b-0 active:translate-y-1"
                >
                  SIM, FALAR NO WHATSAPP AGORA 🏁
                </button>
                <button 
                  onClick={() => finishFlow(false)}
                  className={`w-full py-3 md:py-5 rounded-xl md:rounded-[1.5rem] text-[10px] md:text-xs font-black transition-all uppercase tracking-widest ${theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'}`}
                >
                  Fechar apenas
                </button>
              </div>
            )}

            {step === 11 && (
              <button 
                onClick={() => { setMessages([]); setStep(0); setIsOpen(false); setIsExpanded(false); }}
                className={`w-full py-4 md:py-6 rounded-2xl md:rounded-[2rem] text-xs md:text-base font-black transition-all border-2 border-dashed ${theme === 'dark' ? 'bg-gray-800 border-gray-700 hover:bg-gray-700' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'}`}
              >
                SAIR DO ATENDIMENTO
              </button>
            )}
          </div>
        </div>
      )}

      {/* Main Trigger Button */}
      {(!isOpen || !isExpanded) && (
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-[#27AE60] to-[#219150] text-white rounded-3xl md:rounded-[2.5rem] shadow-[0_25px_60px_rgba(39,174,96,0.4)] flex items-center justify-center hover:scale-110 transition-all duration-500 relative group border-4 md:border-8 border-white"
        >
          <div className={`absolute -top-16 right-0 text-[10px] font-black py-3 px-6 rounded-2xl shadow-2xl opacity-0 group-hover:opacity-100 transition-all transform translate-y-4 group-hover:translate-y-0 whitespace-nowrap pointer-events-none border flex items-center space-x-2 ${theme === 'dark' ? 'bg-[#2C3E50] border-gray-700' : 'bg-white border-gray-100 text-[#2C3E50]'}`}>
            <span className="w-2 h-2 bg-green-500 rounded-full animate-ping"></span>
            <span>Relatar Problema? 🤖</span>
          </div>
          
          {isOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 md:h-10 md:w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
            </svg>
          ) : (
            <div className="relative transform group-hover:rotate-12 transition-all scale-75 md:scale-100">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <rect x="3" y="11" width="18" height="10" rx="3" />
                  <circle cx="12" cy="5" r="2.5" />
                  <path d="M12 7.5v3.5" />
                  <line x1="8" y1="16" x2="8" y2="16.01" />
                  <line x1="16" y1="16" x2="16" y2="16.01" />
              </svg>
              <span className="absolute -top-1 -right-1 flex h-6 w-6">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-6 w-6 bg-red-600 border-2 border-white shadow-lg"></span>
              </span>
            </div>
          )}
        </button>
      )}
    </div>
  );
};

export default ChatRobot;
