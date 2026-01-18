
import { Motive, FAQItem } from './types.ts';

export const SUPPORT_EMAIL = 'tulu.geral@gmail.com';
export const SUPPORT_WHATSAPP = '244955409474';

export const PROVINCES = [
  'Luanda', 'Benguela', 'Huambo', 'Huíla', 'Cabinda', 'Namibe', 
  'Cunene', 'Malanje', 'Uíge', 'Zaire', 'Cuanza Norte', 'Cuanza Sul', 
  'Lunda Norte', 'Lunda Sul', 'Moxico', 'Bié', 'Bengo', 'Cuando Cubango'
];

export const MOTIVES = [
  { id: Motive.TECH_ERROR, label: '❌ Erro Técnico / Link Quebrado', icon: '❌' },
  { id: Motive.CONVERSION, label: '📉 Baixa Conversão / Vendas', icon: '📉' },
  { id: Motive.DESIGN, label: '🎨 Design / Visual Desconfigurado', icon: '🎨' },
  { id: Motive.SPEED, label: '⏱️ Lentidão / Carregamento', icon: '⏱️' },
  { id: Motive.CONTENT, label: '📝 Erro de Conteúdo', icon: '📝' },
  { id: Motive.OTHERS, label: '❓ Outro erro específico', icon: '❓' },
];

export const FAQS: FAQItem[] = [
  {
    question: 'Qual o prazo de resposta?',
    answer: 'Nossa equipe analisa cada chamado individualmente e respondemos em até 4 horas úteis.'
  },
  {
    question: 'Posso acompanhar o status?',
    answer: 'Sim! Após enviar o formulário, você receberá uma cópia do protocolo no seu e-mail de contato.'
  },
  {
    question: 'O atendimento funciona aos finais de semana?',
    answer: 'Nosso suporte automático recebe dados 24h, com triagem humana e resolução de segunda a sexta, em horário comercial.'
  }
];
