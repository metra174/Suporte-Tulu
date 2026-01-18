
import { Motive, FAQItem } from './types';

export const SUPPORT_EMAIL = 'tulu.geral@gmail.com';
export const SUPPORT_WHATSAPP = '244955409474';

export const PROVINCES = [
  'Luanda', 'Benguela', 'Huambo', 'Huíla', 'Cabinda', 'Namibe', 
  'Cunene', 'Malanje', 'Uíge', 'Zaire', 'Cuanza Norte', 'Cuanza Sul', 
  'Lunda Norte', 'Lunda Sul', 'Moxico', 'Bié', 'Bengo', 'Cuando Cubango'
];

export const MOTIVES = [
  { id: Motive.LOGISTICS, label: '📦 Entrega', icon: '📦' },
  { id: Motive.PAYMENTS, label: '💳 Pagamento', icon: '💳' },
  { id: Motive.DEFECT, label: '🛠️ Defeito', icon: '🛠️' },
  { id: Motive.DATA, label: '👤 Cadastro', icon: '👤' },
  { id: Motive.OTHERS, label: '❓ Outros', icon: '❓' },
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
