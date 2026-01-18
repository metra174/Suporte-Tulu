
export enum Motive {
  LOGISTICS = 'Problema com Entrega / Logística',
  PAYMENTS = 'Dúvida sobre Pagamentos / Faturas',
  DEFECT = 'Defeito de Produto / Serviço',
  DATA = 'Alteração de Dados Cadastrais',
  OTHERS = 'Outros Assuntos'
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
}

export interface FAQItem {
  question: string;
  answer: string;
}
