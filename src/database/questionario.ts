import { Questionario, QuestionarioPergunta } from "../types";
import { db } from "./db";

/**
 * Adiciona um questionário ao banco de dados e retorna
 * o id do questionário adicionado
 *
 * @param {Questionario} questionario  Questionário a ser adicionado
 */
export async function addQuestionario(questionario: Questionario): Promise<number> {
  await db.questionario.add(questionario);
  if (questionario.id_questionario !== undefined) {
    return questionario.id_questionario;
  } else {
    throw new Error("ID do questionário não foi definido.");
  }
}

/**
 * Associa as perguntas ao questionário
 *
 * @param {number} questionario_id Id do questionário
 * @param {Set<number>} perguntasIds Ids das perguntas a serem associadas
 */
export async function associateQuestionarioToPerguntas(questionario_id: number, perguntasIds: Set<number>) {
  const perguntasIdsArray = Array.from(perguntasIds);
  try {
    await db.transaction("rw", db.questionario_pergunta, async () => {
      const entries: QuestionarioPergunta[] = perguntasIdsArray.map((perguntaId) => ({
        id_questionario: questionario_id,
        id_pergunta: perguntaId,
      }));
      await db.questionario_pergunta.bulkAdd(entries);
    });
  } catch (error) {
    console.error("Erro ao associar perguntas ao questionário:", error);
    throw error;
  }
}

/**
 * Obtém todos os questionários do banco de dados
 */
export async function getQuestionarios(): Promise<Questionario[]> {
  return await db.questionario.toArray();
}

/**
 * Obtém um questionário do banco de dados
 *
 * @param {number} id Id do questionário a ser obtido
 */
export async function getQuestionarioById(id: number): Promise<Questionario> {
  const questionario = await db.questionario.get(id);
  if (questionario === undefined || questionario === null) {
    throw new Error("Questionário não encontrado");
  }
  return questionario;
}

/**
 * Atualiza um questionário do banco de dados
 *
 * @param {number} id Id do questionário a ser atualizado
 * @param {Questionario} updatedQuestionario Questionário atualizado
 */
export async function updateQuestionario(id: number, updatedQuestionario: Questionario) {
  await db.questionario.update(id, updatedQuestionario);
}

/**
 * Atualiza a associação de perguntas a um questionário
 *
 * @param {number} id Id do questionário
 * @param {Set<number>} perguntasIds Ids das perguntas a serem associadas
 */
export async function updateAssociationQuestionarioToPerguntas(id: number, perguntasIds: Set<number>) {
  try {
    await db.transaction("rw", db.questionario_pergunta, async () => {
      // Obtenha as associações existentes para o questionário
      const existingAssociations = await db.questionario_pergunta.where("id_questionario").equals(id).toArray();

      // Determine as associações a adicionar e remover
      const currentPerguntaIdsSet = new Set(existingAssociations.map((entry) => entry.id_pergunta));
      const perguntasToAdd = Array.from(perguntasIds).filter((perguntaId) => !currentPerguntaIdsSet.has(perguntaId));
      const perguntasToRemove = existingAssociations
        .filter((entry) => !perguntasIds.has(entry.id_pergunta))
        .map((entry) => entry.id_pergunta);

      // Adicione novas associações
      const newAssociations = perguntasToAdd.map((perguntaId) => ({
        id_questionario: id,
        id_pergunta: perguntaId,
      }));
      if (newAssociations.length > 0) {
        await db.questionario_pergunta.bulkAdd(newAssociations);
      }

      // Remova associações antigas
      if (perguntasToRemove.length > 0) {
        await db.questionario_pergunta
          .where("id_questionario")
          .equals(id)
          .and((entry) => perguntasToRemove.includes(entry.id_pergunta))
          .delete();
      }
    });
  } catch (error) {
    console.error("Erro ao atualizar associações de questionário com perguntas:", error);
    throw error;
  }
}

/**
 * Deleta um questionário específico no banco de dados
 *
 * @param {number} id Id do questionário a ser deletado
 */
export async function deleteQuestionario(id: number) {
  await db.transaction("rw", db.questionario, db.questionario_pergunta, async () => {
    await db.questionario.delete(id);
    await db.questionario_pergunta.where("id_questionario").equals(id).delete();
  });
}
