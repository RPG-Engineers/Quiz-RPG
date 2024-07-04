import Dexie, { Table } from "dexie";
import {
  Alternativa,
  AlternativaTag,
  Caracteristica,
  CaracteristicaTag,
  Pergunta,
  Questionario,
  QuestionarioPergunta,
  Tag,
} from "../types";

class AppDB extends Dexie {
  questionario!: Table<Questionario>;
  pergunta!: Table<Pergunta>;
  questionario_pergunta!: Table<QuestionarioPergunta>;
  alternativa!: Table<Alternativa>;
  alternativa_tag!: Table<AlternativaTag>;
  tag!: Table<Tag>;
  caracteristica!: Table<Caracteristica>;
  caracteristica_tag!: Table<CaracteristicaTag>;

  // Muito cuidado com o qual dado é indexado!! (Afeta performance)
  constructor() {
    super("RpgDatabase");
    this.version(1).stores({
      questionario: "++id_questionario, nome, default",
      questionario_pergunta:
        "[id_questionario+id_pergunta], id_questionario, id_pergunta",
      pergunta: "++id_pergunta, pergunta",
      alternativa: "++id_alternativa, id_pergunta, alternativa",
      alternativa_tag: "[id_alternativa+id_tag], id_alternativa, id_tag",
      tag: "++id_tag, &nome, cor",
      caracteristica_tag:
        "[id_caracteristica+id_tag], id_caracteristica, id_tag",
      caracteristica:
        "++id_caracteristica, nome, descricao, url_imagem, url_referencia, tipo",
    });
  }
}

export const db = new AppDB();
