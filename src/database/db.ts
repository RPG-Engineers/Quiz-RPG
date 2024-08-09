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
import { saveAs } from "file-saver";

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
      questionario_pergunta: "[id_questionario+id_pergunta], id_questionario, id_pergunta",
      pergunta: "++id_pergunta, pergunta",
      alternativa: "++id_alternativa, id_pergunta, alternativa",
      alternativa_tag: "[id_alternativa+id_tag], id_alternativa, id_tag",
      tag: "++id_tag, &nome, cor",
      caracteristica_tag: "[id_caracteristica+id_tag], id_caracteristica, id_tag",
      caracteristica: "++id_caracteristica, nome, descricao, url_imagem, url_referencia, tipo",
    });
  }
}

// Função para exportar todos os dados do Dexie para JSON usando file-saver
export const exportDexieToJSON = async () => {
  try {
    // Obter todos os dados de cada tabela
    const caracteristicas = await db.caracteristica.toArray();
    const tags = await db.tag.toArray();
    const caracteristicaTag = await db.caracteristica_tag.toArray();
    const alternativa = await db.alternativa.toArray();
    const alternativaTag = await db.alternativa_tag.toArray();
    const pergunta = await db.pergunta.toArray();
    const questionario = await db.questionario.toArray();
    const questionarioPergunta = await db.questionario_pergunta.toArray();

    // Criar um objeto para armazenar todos os dados
    const data = {
      caracteristicas,
      tags,
      caracteristica_tag: caracteristicaTag,
      alternativa,
      alternativa_tag: alternativaTag,
      pergunta,
      questionario,
      questionario_pergunta: questionarioPergunta,
    };

    // Converter o objeto de dados para JSON
    const json = JSON.stringify(data, null, 2);

    // Criar um blob com os dados JSON
    const blob = new Blob([json], { type: "application/json" });

    // Usar file-saver para salvar o arquivo JSON
    saveAs(blob, "dados-dexie.json");
  } catch (error) {
    console.error("Erro ao exportar dados:", error);
  }
};

export const db = new AppDB();
