
export enum Motive {
  TECH_ERROR = 'Erro Técnico / Link Quebrado',
  CONVERSION = 'Baixa Conversão / Vendas',
  DESIGN = 'Design / Visual Desconfigurado',
  SPEED = 'Lentidão / Carregamento',
  CONTENT = 'Erro de Conteúdo',
  OTHERS = 'Outro erro específico'
}

export interface FormData {
  motive: Motive | '';
  fullName: string;
  companyName: string;
  email: string;
  phone: string;
  province: string;
  address: string;
  description: string;
  followUpAnswer?: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}
