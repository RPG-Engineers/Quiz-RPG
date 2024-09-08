import Dexie from "dexie";
import { Pergunta } from "../types";
import { db } from "./db";

// === CRUD Pergunta ===
/**
 * Adiciona uma pergunta ao banco de dados
 *
 * @param {Pergunta} pergunta Pergunta a ser adicionada
 */

export const addPergunta = async (pergunta: Pergunta) => {
  await db.pergunta.add(pergunta);
  return pergunta.id_pergunta ?? -1;
};
/**
 * Obtém todas as perguntas do banco de dados
 *
 */

export const getPerguntas = async (): Promise<Pergunta[]> => {
  return await db.pergunta.toArray();
};
/**
 * Obtém uma pergunta do banco de dados
 *
 * @param {number} id Id da pergunta a ser obtida
 */

export const getPerguntaById = async (id: number): Promise<Pergunta> => {
  const pergunta = await db.pergunta.get(id);
  if (typeof pergunta === "undefined") {
    throw new Error("Pergunta não encontrada");
  }
  return pergunta;
};
/**
 * Obtém as perguntas de um determinado questionário
 *
 * @param {number} id_questionario Id do questionário
 */

export const getPerguntasByQuestionarioId = async (id_questionario: number): Promise<Pergunta[]> => {
  return await db.transaction("r", db.questionario_pergunta, db.pergunta, async () => {
    const perguntas_ids = await db.questionario_pergunta.where("id_questionario").equals(id_questionario).toArray();
    const perguntas = await Dexie.Promise.all(
      perguntas_ids.map(async (pergunta_quest) => {
        const pergunta = await db.pergunta.get(pergunta_quest.id_pergunta);
        if (typeof pergunta === "undefined") {
          throw new Error("Pergunta não encontrada");
        }
        return pergunta;
      })
    );
    return perguntas;
  });
};
/**
 * Atualiza uma pergunta do banco de dados
 *
 * @param {number} id Id da pergunta a ser atualizada
 * @param {Pergunta} updated_pergunta Pergunta atualizada
 */

export const updatePergunta = async (id: number, updated_pergunta: Pergunta) => {
  await db.pergunta.update(id, updated_pergunta);
};
/**
 * Deleta uma pergunta do banco de dados
 *
 * @param {number} id Id da pergunta a ser deletada
 */

export const deletePergunta = async (id: number) => {
  await db.transaction("rw", db.questionario_pergunta, db.pergunta, db.alternativa, db.alternativa_tag, async () => {
    await db.pergunta.delete(id);
    await db.questionario_pergunta.where("id_pergunta").equals(id).delete();
    const alternativas_associadas = await db.alternativa.where("id_pergunta").equals(id).toArray();
    for (const alternativa of alternativas_associadas) {
      const alternativa_id = alternativa.id_alternativa;
      if (typeof alternativa_id === "undefined") {
        throw new Error("Alternativa não encontrada durante a deleção");
      }
      await db.alternativa_tag.where("id_alternativa").equals(alternativa_id).delete();
      await db.alternativa.delete(alternativa_id);
    }
  });
};
