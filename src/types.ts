// Tipos dos Objetos

export interface Questionario {
  id?: number;
  nome: string;
  default: boolean;
}

export interface Pergunta {
  id?: number;
  id_questionario?: number;
  pergunta: string;
}

export interface Alternativa {
  id?: number;
  id_pergunta: number;
  alternativa: string;
}

export interface Tag {
  id?: number;
  id_alternativa?: number;
  id_caracteristica?: number;
  nome: string;
  cor: string;
}

export interface Caracteristica {
  id?: number;
  nome: string;
  descricaco: string;
  url_imagem: string;
  url_referencia: string;
  tipo: TipoCaracteristica;
}

export enum TipoCaracteristica {
  CLASSE = "Classe",
  RACA = "Raça",
  BACKGROUND = "Background",
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