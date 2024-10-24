// Tipos dos Objetos

export interface Questionario {
  id_questionario?: number;
  nome: string;
  default: boolean;
}

export interface Pergunta {
  id_pergunta?: number;
  pergunta: string;
}

export interface Alternativa {
  id_alternativa?: number;
  id_pergunta: number;
  alternativa: string;
}

export interface Tag {
  id_tag?: number;
  nome: string;
  cor: string;
}

export interface Caracteristica {
  id_caracteristica?: number;
  nome: string;
  descricao: string;
  url_imagem: string;
  url_referencia: string;
  tipo: TipoCaracteristica;
}

export enum TipoCaracteristica {
  CLASSE = 1,
  RACA = 2,
  BACKGROUND = 3,
}

// Tipos exclusivo para as Tabelas do Banco

export interface QuestionarioPergunta {
  id_questionario: number;
  id_pergunta: number;
}

export interface AlternativaTag {
  id_alternativa: number;
  id_tag: number;
}

export interface CaracteristicaTag {
  id_caracteristica: number;
  id_tag: number;
}

// Tipos herdados

export interface CaracteristicaWithTags extends Caracteristica {
  tags: Tag[];
}

export interface AlternativaWithTags extends Alternativa {
  tagsIds: Set<number>;
}

export interface QuestionarioWithPerguntas extends Questionario {
  perguntas: Pergunta[];
}

export interface AggregationPergunta {
  pergunta: Pergunta;
  alternativas: AlternativaWithTags[];
}

// Enum do pódio

export enum CardType {
  Bronze = 'bronze',
  Silver = 'silver',
  Gold = 'gold',
}

// Toast

export interface ToastType {
  id: string;
  message: string;
  variant: ToastVariant;
}

export type ToastVariant = 'success' | 'warning' | 'danger';

// Form Errors

export interface FormErrors {
  [key: string]: boolean;
}