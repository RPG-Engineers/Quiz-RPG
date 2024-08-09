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

// Função para importar dados com rollback
export const importJSONFromFile = async (file: File) => {
  try {
    const reader = new FileReader();

    reader.onload = async (event) => {
      if (event.target?.result) {
        const data = JSON.parse(event.target.result as string);
        
        // Passo 1: Guardar o estado atual
        const backup = await getBackup();

        try {
          // Passo 2: Limpar dados
          await db.transaction('rw', db.caracteristica, db.tag, db.caracteristica_tag, db.alternativa, async () => {
            await db.caracteristica.clear();
            await db.tag.clear();
            await db.caracteristica_tag.clear();
            await db.alternativa.clear();
          });
          
          await db.transaction('rw', db.alternativa_tag, db.pergunta, db.questionario, db.questionario_pergunta, async () => {
            await db.alternativa_tag.clear();
            await db.pergunta.clear();
            await db.questionario.clear();
            await db.questionario_pergunta.clear();
          });

          // Passo 3: Adicionar dados
          await db.transaction('rw', db.caracteristica, db.tag, db.caracteristica_tag, db.alternativa,  async () => {
            await db.caracteristica.bulkAdd(data.caracteristicas);
            await db.tag.bulkAdd(data.tags);
            await db.caracteristica_tag.bulkAdd(data.caracteristica_tag);
            await db.alternativa.bulkAdd(data.alternativa);
          });
          
          await db.transaction('rw', db.alternativa_tag, db.pergunta, db.questionario, db.questionario_pergunta, async () => {
            await db.alternativa_tag.bulkAdd(data.alternativa_tag);
            await db.pergunta.bulkAdd(data.pergunta);
            await db.questionario.bulkAdd(data.questionario);
            await db.questionario_pergunta.bulkAdd(data.questionario_pergunta);
          });

          console.log('Dados importados com sucesso!');
        } catch (error) {
          console.error('Erro ao importar dados, restaurando o estado anterior:', error);
          // Passo 4: Restaurar dados em caso de falha
          await restoreBackup(backup);
          throw error;
        }
      }
    };

    reader.readAsText(file);
  } catch (error) {
    console.error('Erro ao importar dados:', error);
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const restoreBackup = async (backup: any) => {
  await db.transaction('rw', db.caracteristica, db.tag, db.caracteristica_tag, db.alternativa, async () => {
    await db.caracteristica.clear();
    await db.tag.clear();
    await db.caracteristica_tag.clear();
    await db.alternativa.clear();
    await db.caracteristica.bulkAdd(backup.caracteristicas);
    await db.tag.bulkAdd(backup.tags);
    await db.caracteristica_tag.bulkAdd(backup.caracteristica_tag);
    await db.alternativa.bulkAdd(backup.alternativa);
  });
  
  await db.transaction('rw', db.alternativa_tag, db.pergunta, db.questionario, db.questionario_pergunta, async () => {
    await db.alternativa_tag.clear();
    await db.pergunta.clear();
    await db.questionario.clear();
    await db.questionario_pergunta.clear();
    await db.alternativa_tag.bulkAdd(backup.alternativa_tag);
    await db.pergunta.bulkAdd(backup.pergunta);
    await db.questionario.bulkAdd(backup.questionario);
    await db.questionario_pergunta.bulkAdd(backup.questionario_pergunta);
  });
};

// Função para obter uma cópia dos dados
const getBackup = async () => {
  const caracteristicas = await db.caracteristica.toArray();
  const tags = await db.tag.toArray();
  const caracteristica_tag = await db.caracteristica_tag.toArray();
  const alternativa = await db.alternativa.toArray();
  const alternativa_tag = await db.alternativa_tag.toArray();
  const pergunta = await db.pergunta.toArray();
  const questionario = await db.questionario.toArray();
  const questionario_pergunta = await db.questionario_pergunta.toArray();
  return { caracteristicas, tags, caracteristica_tag, alternativa, alternativa_tag, pergunta, questionario, questionario_pergunta };
};

export const db = new AppDB();
