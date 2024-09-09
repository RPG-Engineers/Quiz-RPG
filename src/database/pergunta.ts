import Dexie from "dexie";
import { Pergunta } from "../types";
import { db } from "./db";

/**
 * Adiciona uma pergunta ao banco de dados e retorna
 * o id da pergunta adicionada.
 *
 * @param {Pergunta} pergunta Pergunta a ser adicionada
 */
export async function addPergunta(pergunta: Pergunta) {
  await db.pergunta.add(pergunta);
  if (pergunta.id_pergunta !== undefined) {
    return pergunta.id_pergunta;
  } else {
    throw new Error("ID da pergunta não foi definido.");
  }
}

/**
 * Obtém todas as perguntas do banco de dados
 *
 */
export async function getPerguntas(): Promise<Pergunta[]> {
  return await db.pergunta.toArray();
}

/**
 * Obtém uma pergunta do banco de dados
 *
 * @param {number} id Id da pergunta a ser obtida
 */
export async function getPerguntaById(id: number): Promise<Pergunta> {
  const pergunta = await db.pergunta.get(id);
  if (pergunta === undefined || pergunta === null) {
    throw new Error("Pergunta não encontrada");
  }
  return pergunta;
}

/**
 * Obtém as perguntas de um determinado questionário
 *
 * @param {number} questionarioId Id do questionário
 */
export async function getPerguntasByQuestionarioId(questionarioId: number): Promise<Pergunta[]> {
  return await db.transaction("r", db.questionario_pergunta, db.pergunta, async () => {
    const perguntasIds = await db.questionario_pergunta.where("id_questionario").equals(questionarioId).toArray();
    const perguntas = await Dexie.Promise.all(
      perguntasIds.map(async (pergunta_quest) => {
        const pergunta = await db.pergunta.get(pergunta_quest.id_pergunta);
        if (pergunta === undefined || pergunta === null) {
          throw new Error("Pergunta não encontrada, dados inconsistentes");
        }
        return pergunta;
      })
    );
    return perguntas;
  });
}

/**
 * Deleta uma pergunta do banco de dados
 *
 * @param {number} id Id da pergunta a ser deletada
 */
export async function deletePergunta(id: number) {
  await db.transaction("rw", db.questionario_pergunta, db.pergunta, db.alternativa, db.alternativa_tag, async () => {
    await db.pergunta.delete(id);
    await db.questionario_pergunta.where("id_pergunta").equals(id).delete();
    const alternativas = await db.alternativa.where("id_pergunta").equals(id).toArray();
    for (const alternativa of alternativas) {
      const alternativa_id = alternativa.id_alternativa;
      if (alternativa_id === undefined) {
        throw new Error("Alternativa corrompida durante a deleção");
      }
      await db.alternativa_tag.where("id_alternativa").equals(alternativa_id).delete();
      await db.alternativa.delete(alternativa_id);
    }
  });
}
