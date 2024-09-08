import { QuestionarioWithPerguntas, Questionario, Pergunta, QuestionarioPergunta } from "../types";
import { getPerguntasByQuestionarioId } from "./pergunta";
import { db } from "./db";

// === CRUD Questionario ===
/**
 * Adiciona um questionário ao banco de dados
 *
 * @param {QuestionarioWithPerguntas} questionarioWithPerguntas Questionário a ser adicionado
 */

export const addQuestionario = async (questionarioWithPerguntas: QuestionarioWithPerguntas) => {
  const questionario: Questionario = {
    nome: questionarioWithPerguntas.nome,
    default: questionarioWithPerguntas.default,
  };
  const perguntas: Pergunta[] = questionarioWithPerguntas.perguntas;

  try {
    // Adiciona o questionário e obtém o ID gerado
    const questionario_id = await db.questionario.add(questionario);

    // Obtém os IDs das perguntas
    const perguntas_ids = perguntas.map((pergunta) => pergunta.id_pergunta!);

    // Associa as perguntas ao questionário
    await associateQuestionarioToPerguntas(questionario_id, perguntas_ids);

    console.log("Questionário e associações adicionados com sucesso!");
  } catch (error) {
    console.error("Erro ao adicionar questionário e associações:", error);
  }
};
/**
 * Associa as perguntas ao questionário
 *
 * @param {number} questionario_id Id do questionário
 * @param {number[]} perguntas_ids Ids das perguntas a serem associadas
 */
const associateQuestionarioToPerguntas = async (questionario_id: number, perguntas_ids: number[]) => {
  try {
    await db.transaction("rw", db.questionario_pergunta, async () => {
      const entries: QuestionarioPergunta[] = perguntas_ids.map((perguntas_id) => ({
        id_questionario: questionario_id,
        id_pergunta: perguntas_id,
      }));
      await db.questionario_pergunta.bulkAdd(entries);
    });

    console.log("Associações adicionadas com sucesso!");
  } catch (error) {
    console.error("Erro ao associar perguntas ao questionário:", error);
  }
};
/**
 * Obtém todos os questionários do banco de dados
 *
 */

export const getQuestionarios = async (): Promise<Questionario[]> => {
  return await db.questionario.toArray();
};
/**
 * Obtém um questionário do banco de dados
 *
 * @param {number} id Id do questionário a ser obtido
 */

export const getQuestionarioById = async (id: number): Promise<QuestionarioWithPerguntas> => {
  const questionario = await db.questionario.get(id);
  if (typeof questionario === "undefined") {
    throw new Error("Questionário não encontrado");
  }
  const perguntas = await getPerguntasByQuestionarioId(questionario.id_questionario!);
  return { ...questionario, perguntas };
};
/**
 * Atualiza um questionário do banco de dados
 *
 * @param {number} id Id do questionário a ser atualizado
 * @param {Questionario} updated_questionario Questionário atualizado
 */

export const updateQuestionarioById = async (id: number, updated_questionario: Questionario) => {
  await db.questionario.update(id, updated_questionario);
};
/**
 * Atualiza um questionário do banco de dados
 *
 * @param {number} id Id do questionário a ser atualizado
 * @param {Questionario} updated_questionario Questionário atualizado
 */

export const updateQuestionario = async (updated_questionario: QuestionarioWithPerguntas) => {
  const questionario: Questionario = {
    nome: updated_questionario.nome,
    default: updated_questionario.default,
  };
  const perguntas: Pergunta[] = updated_questionario.perguntas;

  // Atualiza o questionário
  await db.questionario.update(updated_questionario.id_questionario!, questionario);

  // Obtém os IDs das perguntas
  const perguntas_ids = perguntas.map((pergunta) => pergunta.id_pergunta!);

  // Associa as perguntas ao questionário
  await updateAssociationQuestionarioToPerguntas(updated_questionario.id_questionario!, perguntas_ids);
};
/**
 * Atualiza a associação de perguntas a um questionário
 *
 * @param {number} id_questionario Id do questionário
 * @param {number[]} perguntas_ids Ids das perguntas a serem associadas
 */

export const updateAssociationQuestionarioToPerguntas = async (id_questionario: number, perguntas_ids: number[]) => {
  try {
    await db.transaction("rw", db.questionario_pergunta, async () => {
      // Obtenha as associações existentes para o questionário
      const existingAssociations = await db.questionario_pergunta.where("id_questionario").equals(id_questionario).toArray();

      // Crie um Set com IDs fornecidos para facilitar a verificação
      const perguntaIdsSet = new Set(perguntas_ids);

      // Determine as associações a adicionar e remover
      const currentPerguntaIdsSet = new Set(existingAssociations.map((entry) => entry.id_pergunta));
      const perguntasToAdd = perguntas_ids.filter((id_pergunta) => !currentPerguntaIdsSet.has(id_pergunta));
      const perguntasToRemove = existingAssociations
        .filter((entry) => !perguntaIdsSet.has(entry.id_pergunta))
        .map((entry) => entry.id_pergunta);

      // Adicione novas associações
      const newAssociations = perguntasToAdd.map((id_pergunta) => ({
        id_questionario: id_questionario,
        id_pergunta: id_pergunta,
      }));
      if (newAssociations.length > 0) {
        await db.questionario_pergunta.bulkAdd(newAssociations);
      }

      // Remova associações antigas
      if (perguntasToRemove.length > 0) {
        await db.questionario_pergunta
          .where("id_questionario")
          .equals(id_questionario)
          .and((entry) => perguntasToRemove.includes(entry.id_pergunta))
          .delete();
      }
    });
  } catch (error) {
    console.error("Erro ao atualizar associações de questionário com perguntas:", error);
  }
};
/**
 * Deleta um questionário específico no banco de dados
 *
 * @param {number} id Id do questionário a ser deletado
 */

export const deleteQuestionario = async (id: number) => {
  await db.transaction("rw", db.questionario, db.questionario_pergunta, async () => {
    await db.questionario.delete(id);
    await db.questionario_pergunta.where("id_questionario").equals(id).delete();
  });
};
