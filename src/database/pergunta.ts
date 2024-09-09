import Dexie from "dexie";
import { AlternativaWithTags, Pergunta } from "../types";
import { db } from "./db";
import { addAlternativa, associateAlternativaToTags, deleteAlternativa, getAlternativasByPerguntaId, updateAlternativa, updateAssociationAlternativaToTags } from "./alternativa";

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
 * Atualiza uma pergunta do banco de dados
 *
 * @param {number} id Id da pergunta a ser atualizada
 * @param {Pergunta} updatedPegunta Pergunta atualizada
 */
export async function updatePergunta(id: number, updatedPegunta: Pergunta) {
  await db.pergunta.update(id, updatedPegunta);
}

/**
 * Atualiza a associação de alternativa a uma pergunta
 *
 * @param {number} id Id da pergunta
 * @param {AlternativaWithTags[]} alternativas Alternativas a serem associadas
 */
export async function updateAssociationPerguntaToAlternativas(id: number, alternativas: AlternativaWithTags[]) {
  try {
    await db.transaction("rw", db.alternativa, db.alternativa_tag, db.tag, async () => {
      // Obtenha as associações existentes para a pergunta
      const existingAssociations = await getAlternativasByPerguntaId(id);

      // Determine as alternativas a adicionar, editar e remover
      const currentAlternativesIdsSet = new Set(existingAssociations.map((entry) => entry.id_alternativa));
      const alternativesToAdd = alternativas.filter((alternativa) => !currentAlternativesIdsSet.has(alternativa.id_alternativa));
      const alternativesToEdit = alternativas.filter((alternativa) => currentAlternativesIdsSet.has(alternativa.id_alternativa));
      const alternativesToRemove = existingAssociations
        .filter((entry) => !alternativas.some((alt) => alt.id_alternativa === entry.id_alternativa))
        .map((entry) => entry.id_alternativa);

      // Adicione novas associações
      for (const alternativa of alternativesToAdd) {
        const newId = await addAlternativa(alternativa);
        await associateAlternativaToTags(newId, alternativa.tagsIds);
      }

      // Edite associações existentes
      for (const alternativa of alternativesToEdit) {
        await updateAlternativa(alternativa.id_alternativa!, alternativa);
        await updateAssociationAlternativaToTags(alternativa.id_alternativa!, alternativa.tagsIds);
      }

      // Remova associações antigas
      for (const idAlternativa of alternativesToRemove) {
        await deleteAlternativa(idAlternativa!);
      }
    });
  } catch (error) {
    console.error("Erro ao atualizar associações de perguntas com alternativas:", error);
    throw error;
  }
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
