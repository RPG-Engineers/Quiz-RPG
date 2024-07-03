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
  Classe = "Classe",
  Raca = "Raça",
  Background = "Background",
}
